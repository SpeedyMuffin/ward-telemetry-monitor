use crate::license;
use crate::models::{AlarmInfo, PumpState, StateStore};
use std::collections::{HashMap, HashSet};
use std::ptr;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use winapi::um::winnt::HANDLE;

// Standart STX(0x02) + jenerik telemetri sorgu kodu [0x01, 0x00, 0x01] + CRC16-Kermit + ETX(0x04)
const TELEMETRY_POLL_FRAME: &[u8] = &[0x02, 0x01, 0x00, 0x01, 0x55, 0x4B, 0x04];

fn crc16_kermit(data: &[u8]) -> u16 {
    let mut crc: u16 = 0;
    for &b in data {
        crc ^= b as u16;
        for _ in 0..8 {
            crc = if (crc & 1) != 0 { (crc >> 1) ^ 0x8408 } else { crc >> 1 };
        }
    }
    crc
}

fn unpack_frame(raw: &[u8]) -> Option<Vec<u8>> {
    if raw.len() < 4 || raw[0] != 0x02 || raw[raw.len() - 1] != 0x04 {
        return None;
    }
    let mut out = Vec::new();
    let mut i = 1;
    let end = raw.len() - 1;
    while i < end {
        if raw[i] == 0x7E && i + 1 < end {
            i += 1;
            out.push(raw[i] ^ 0x20);
        } else {
            out.push(raw[i]);
        }
        i += 1;
    }
    if out.len() < 2 {
        return None;
    }
    let pl_len = out.len() - 2;
    let recv_crc = u16::from_le_bytes([out[pl_len], out[pl_len + 1]]);
    if recv_crc != crc16_kermit(&out[..pl_len]) {
        return None;
    }
    Some(out[..pl_len].to_vec())
}

/// Scans an accumulated serial RX buffer for any valid CRC-verified STX(0x02)..ETX(0x04) frame.
fn extract_valid_frame(buf: &[u8]) -> Option<Vec<u8>> {
    let mut start = 0;
    while start < buf.len() {
        if let Some(rel_s) = buf[start..].iter().position(|&b| b == 0x02) {
            let s = start + rel_s;
            let mut end_search = s + 1;
            while end_search < buf.len() {
                if let Some(rel_e) = buf[end_search..].iter().position(|&b| b == 0x04) {
                    let e = end_search + rel_e;
                    if let Some(decoded) = unpack_frame(&buf[s..=e]) {
                        return Some(decoded);
                    }
                    end_search = e + 1;
                } else {
                    break;
                }
            }
            start = s + 1;
        } else {
            break;
        }
    }
    None
}

struct SerialPort {
    handle: HANDLE,
    current_baud: u32,
}

unsafe impl Send for SerialPort {}

impl Drop for SerialPort {
    fn drop(&mut self) {
        unsafe {
            winapi::um::handleapi::CloseHandle(self.handle);
        }
    }
}

impl SerialPort {
    fn open(com_name: &str, baud: u32) -> Option<Self> {
        use winapi::um::fileapi::{CreateFileW, OPEN_EXISTING};
        use winapi::um::handleapi::INVALID_HANDLE_VALUE;
        use winapi::um::winnt::{FILE_ATTRIBUTE_NORMAL, GENERIC_READ, GENERIC_WRITE};

        let dev_path = format!("\\\\.\\{}", com_name.trim().to_uppercase());
        let wide: Vec<u16> = dev_path.encode_utf16().chain(std::iter::once(0)).collect();

        unsafe {
            let h = CreateFileW(
                wide.as_ptr(),
                GENERIC_READ | GENERIC_WRITE,
                0,
                ptr::null_mut(),
                OPEN_EXISTING,
                FILE_ATTRIBUTE_NORMAL,
                ptr::null_mut(),
            );
            if h == INVALID_HANDLE_VALUE {
                return None;
            }
            let mut port = Self { handle: h, current_baud: 0 };
            if !port.configure(baud) {
                return None;
            }
            Some(port)
        }
    }

    fn configure(&mut self, baud: u32) -> bool {
        use winapi::um::commapi::{GetCommState, SetCommState, SetCommTimeouts};
        use winapi::um::winbase::{COMMTIMEOUTS, DCB, NOPARITY, ONESTOPBIT};

        unsafe {
            if self.current_baud != baud {
                let mut dcb: DCB = std::mem::zeroed();
                dcb.DCBlength = std::mem::size_of::<DCB>() as u32;
                if GetCommState(self.handle, &mut dcb) == 0 {
                    return false;
                }
                dcb.BaudRate = baud;
                dcb.ByteSize = 8;
                dcb.Parity = NOPARITY;
                dcb.StopBits = ONESTOPBIT;
                if SetCommState(self.handle, &mut dcb) == 0 {
                    return false;
                }
                self.current_baud = baud;
            }

            // ReadTotalTimeoutMultiplier = 0 avoids Win32 waiting 5ms * buf_len (5+ seconds!)
            let mut timeouts = COMMTIMEOUTS {
                ReadIntervalTimeout: 25,
                ReadTotalTimeoutMultiplier: 0,
                ReadTotalTimeoutConstant: 120,
                WriteTotalTimeoutMultiplier: 0,
                WriteTotalTimeoutConstant: 200,
            };
            SetCommTimeouts(self.handle, &mut timeouts) != 0
        }
    }

    fn purge_rx(&self) {
        use winapi::um::commapi::PurgeComm;
        use winapi::um::winbase::{PURGE_RXCLEAR, PURGE_TXCLEAR};
        unsafe {
            PurgeComm(self.handle, PURGE_RXCLEAR | PURGE_TXCLEAR);
        }
    }

    fn poll_telemetry(&mut self) -> Result<Option<Vec<u8>>, ()> {
        use winapi::um::fileapi::WriteFile;

        if !self.configure(115200) {
            return Err(());
        }
        self.purge_rx();

        unsafe {
            let mut written: u32 = 0;
            let wok = WriteFile(
                self.handle,
                TELEMETRY_POLL_FRAME.as_ptr() as *const _,
                TELEMETRY_POLL_FRAME.len() as u32,
                &mut written,
                ptr::null_mut(),
            );
            if wok == 0 {
                return Err(());
            }
        }

        std::thread::sleep(Duration::from_millis(35));

        let mut rx_buf = Vec::with_capacity(512);
        let mut chunk = [0u8; 256];
        let deadline = Instant::now() + Duration::from_millis(260);

        while Instant::now() < deadline {
            let mut read_bytes: u32 = 0;
            let ok = unsafe {
                winapi::um::fileapi::ReadFile(
                    self.handle,
                    chunk.as_mut_ptr() as *mut _,
                    chunk.len() as u32,
                    &mut read_bytes,
                    ptr::null_mut(),
                )
            };
            if ok == 0 {
                return Err(());
            }
            if read_bytes > 0 {
                rx_buf.extend_from_slice(&chunk[..read_bytes as usize]);
                if let Some(frame) = extract_valid_frame(&rx_buf) {
                    return Ok(Some(frame));
                }
            } else if !rx_buf.is_empty() {
                break;
            }
        }
        Ok(None)
    }

}

fn parse_generic_telemetry(payload: &[u8]) -> Option<(&'static str, f64, f64, Option<AlarmInfo>)> {
    let needle = [0xAA, 0x55, 0x01];
    let pos = payload.windows(needle.len()).position(|w| w == needle)?;
    let t_data = payload.get(pos + needle.len()..)?;
    if t_data.len() < 9 {
        return None;
    }
    let status_b = t_data[0];
    let rate = f32::from_le_bytes([t_data[1], t_data[2], t_data[3], t_data[4]]) as f64;
    let vol = f32::from_le_bytes([t_data[5], t_data[6], t_data[7], t_data[8]]) as f64;
    match status_b {
        0x01 => Some(("INFUSING", rate, vol, None)),
        0x02 => Some((
            "ALARM",
            rate,
            vol,
            Some(AlarmInfo {
                code: "PUMP_ALARM".into(),
                text: "Cihaz Alarmı".into(),
                level: "HIGH".into(),
                time: license::now_unix(),
            }),
        )),
        _ => Some(("STOPPED", rate, vol, None)),
    }
}

fn spawn_port_thread(port_key: String, running: Arc<AtomicBool>, state: Arc<Mutex<StateStore>>) {
    std::thread::spawn(move || {
        let mut port_opt: Option<SerialPort> = None;

        while running.load(Ordering::Relaxed) {
            let tick_start = Instant::now();

            // Refresh latest mapping fields (bed, model, drug) dynamically
            let mapping_info: Option<(String, String, String, String, String)> = {
                if let Ok(st) = state.lock() {
                    st.mappings
                        .iter()
                        .find(|m| m.source_type == "DIRECT_COM" && m.address.trim().eq_ignore_ascii_case(&port_key))
                        .map(|m| (m.bed_name.clone(), m.address.clone(), m.model.clone(), m.drug_name.clone(), m.drug_concentration.clone()))
                } else {
                    None
                }
            };

            let Some((bed_name, port_name, model, drug_name, drug_conc)) = mapping_info else {
                break;
            };

            if port_opt.is_none() {
                port_opt = SerialPort::open(&port_name, 115200);
            }

            if let Some(ref mut port) = port_opt {
                match port.poll_telemetry() {
                    Ok(Some(payload)) => {
                        if let Some((st_str, rate, vol, alarm)) = parse_generic_telemetry(&payload) {
                            update_com_pump(&state, &bed_name, &port_name, &model, &drug_name, &drug_conc, st_str, rate, vol, alarm);
                        }
                    }
                    Ok(None) => {}
                    Err(_) => {
                        // Port disconnected or I/O error -> reopen cleanly on next cycle
                        port_opt = None;
                    }
                }
            }

            // Target 1-second (1000 ms) refresh cadence
            let elapsed = tick_start.elapsed();
            let target = Duration::from_millis(1000);
            if elapsed < target {
                std::thread::sleep(target - elapsed);
            }
        }
    });
}

pub fn spawn_direct_com_worker(state: Arc<Mutex<StateStore>>) {
    std::thread::spawn(move || {
        let mut workers: HashMap<String, Arc<AtomicBool>> = HashMap::new();

        loop {
            let desired_ports: HashSet<String> = {
                if let Ok(st) = state.lock() {
                    st.mappings
                        .iter()
                        .filter(|m| m.source_type == "DIRECT_COM" && !m.address.trim().is_empty())
                        .map(|m| m.address.trim().to_uppercase())
                        .collect()
                } else {
                    HashSet::new()
                }
            };

            // Stop removed ports
            workers.retain(|port_key, flag| {
                if !desired_ports.contains(port_key) {
                    flag.store(false, Ordering::Relaxed);
                    false
                } else {
                    true
                }
            });

            // Spawn newly added ports
            for port_key in desired_ports {
                if !workers.contains_key(&port_key) {
                    let flag = Arc::new(AtomicBool::new(true));
                    workers.insert(port_key.clone(), flag.clone());
                    spawn_port_thread(port_key, flag, state.clone());
                }
            }

            std::thread::sleep(Duration::from_millis(1000));
        }
    });
}

fn update_com_pump(
    state: &Arc<Mutex<StateStore>>,
    bed_name: &str,
    port_name: &str,
    model: &str,
    drug_name: &str,
    drug_conc: &str,
    status: &str,
    rate: f64,
    vol: f64,
    alarm: Option<AlarmInfo>,
) {
    if let Ok(mut st) = state.lock() {
        let now = license::now_unix();
        for m in &mut st.mappings {
            if m.bed_name == bed_name
                && m.source_type == "DIRECT_COM"
                && m.address.trim().eq_ignore_ascii_case(port_name)
            {
                m.last_seen = now;
                m.is_online = true;
            }
        }
        let pid = format!("PUMP-COM-{}", port_name.to_uppercase());
        st.pumps.insert(
            pid.clone(),
            PumpState {
                id: pid,
                bed_name: bed_name.to_string(),
                source_type: "DIRECT_COM".into(),
                source_address: port_name.to_uppercase(),
                model: if model.is_empty() { "İnfüzyon Pompası (COM)".into() } else { model.to_string() },
                serial: port_name.to_uppercase(),
                slot: 1,
                mode: "Sürekli İnfüzyon".into(),
                status: status.to_string(),
                rate,
                rate_unit: "ml/h".into(),
                volume_infused: vol,
                vtbi: 500.0,
                time_remaining_sec: if rate > 0.0 { ((500.0 - vol).max(0.0) / rate * 3600.0) as i64 } else { 0 },
                drug_name: if drug_name.is_empty() { "Tanımsız".into() } else { drug_name.to_string() },
                drug_concentration: drug_conc.to_string(),
                pressure_level: if alarm.is_some() { 8 } else { 2 },
                battery: 97,
                ac_power: true,
                alarm,
                ders_warning: None,
                near_end: false,
                near_end_min: 0,
                last_updated: now,
            },
        );
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extracts_frame_with_noise_prefix_and_suffix() {
        // Build minimal framed telemetry packet: payload [0xAA, 0x55, 0x01] + CRC16-Kermit LE, wrapped in 0x02..0x04
        let payload = [0xAAu8, 0x55u8, 0x01u8];
        let crc = crc16_kermit(&payload).to_le_bytes();
        let mut frame = vec![0xFF, 0x00, 0x02]; // leading noise before STX
        frame.extend_from_slice(&payload);
        frame.extend_from_slice(&crc);
        frame.push(0x04);
        frame.extend_from_slice(&[0xAA, 0xBB]); // trailing noise after ETX

        let extracted = extract_valid_frame(&frame).expect("valid frame should be extracted");
        assert_eq!(extracted, payload);
    }

    #[test]
    fn parses_generic_12_byte_telemetry_payload() {
        let mut infusing = vec![0xAA, 0x55, 0x01, 0x01];
        infusing.extend_from_slice(&12.5f32.to_le_bytes());
        infusing.extend_from_slice(&45.25f32.to_le_bytes());
        let (st, rate, vol, alarm) = parse_generic_telemetry(&infusing).expect("infusing payload");
        assert_eq!(st, "INFUSING");
        assert!((rate - 12.5).abs() < 1e-4);
        assert!((vol - 45.25).abs() < 1e-4);
        assert!(alarm.is_none());

        let mut alarming = vec![0xAA, 0x55, 0x01, 0x02];
        alarming.extend_from_slice(&0.0f32.to_le_bytes());
        alarming.extend_from_slice(&10.0f32.to_le_bytes());
        let (st_a, _, _, alarm_a) = parse_generic_telemetry(&alarming).expect("alarm payload");
        assert_eq!(st_a, "ALARM");
        assert!(alarm_a.is_some());

        let mut stopped = vec![0xAA, 0x55, 0x01, 0x00];
        stopped.extend_from_slice(&0.0f32.to_le_bytes());
        stopped.extend_from_slice(&0.0f32.to_le_bytes());
        let (st_s, _, _, alarm_s) = parse_generic_telemetry(&stopped).expect("stopped payload");
        assert_eq!(st_s, "STOPPED");
        assert!(alarm_s.is_none());

        assert!(parse_generic_telemetry(&[0xAA, 0x55, 0x01, 0x01, 0x00]).is_none());
    }
}

