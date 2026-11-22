use crate::config::AppConfig;
use crate::license;
use crate::models::{PumpState, StateStore};
use std::io::{Read, Write};
use std::net::TcpStream;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

fn extract_tag_val(block: &str, tag: &str) -> Option<String> {
    let open = format!("<{}>", tag);
    let close = format!("</{}>", tag);
    let start = block.find(&open)? + open.len();
    let rest = &block[start..];
    let end = rest.find(&close)?;
    Some(rest[..end].trim().to_string())
}

pub fn spawn_xml_worker(state: Arc<Mutex<StateStore>>, cfg: AppConfig) {
    let bridge_addr = cfg.xml_bridge_addr.trim().to_string();
    if bridge_addr.is_empty() {
        return;
    }
    let xml_user = cfg.xml_username.trim().to_string();
    let xml_pass_hash = cfg.xml_password_hash.trim().to_string();

    std::thread::spawn(move || loop {
        let Ok(sock_addr) = bridge_addr.parse::<std::net::SocketAddr>() else {
            eprintln!("Geçersiz XML köprü adresi (config.json): {}", bridge_addr);
            std::thread::sleep(Duration::from_secs(10));
            continue;
        };
        match TcpStream::connect_timeout(&sock_addr, Duration::from_secs(2)) {
            Ok(mut stream) => {
                let _ = stream.set_read_timeout(Some(Duration::from_secs(2)));
                if let Ok(mut st) = state.lock() {
                    st.connected_to_xml = true;
                }

                if !xml_user.is_empty() && !xml_pass_hash.is_empty() {
                    let login = format!(
                        "<Auth user=\"{}\" token=\"{}\" />\n",
                        xml_user, xml_pass_hash
                    );
                    if stream.write_all(login.as_bytes()).is_err() {
                        continue;
                    }
                }

                let mut buf = Vec::with_capacity(8192);
                let mut tmp = [0u8; 2048];
                let mut last_hb = Instant::now();

                loop {
                    if last_hb.elapsed() >= Duration::from_secs(12) {
                        if stream.write_all(b"<Ping />\n").is_err() {
                            break;
                        }
                        last_hb = Instant::now();
                    }

                    match stream.read(&mut tmp) {
                        Ok(0) => break,
                        Ok(n) => {
                            buf.extend_from_slice(&tmp[..n]);
                            while let Some(pos) = buf.iter().position(|&b| b == b'\n') {
                                let msg_bytes = buf.drain(..=pos).collect::<Vec<u8>>();
                                let xml_line = String::from_utf8_lossy(&msg_bytes[..msg_bytes.len() - 1]);
                                let xml_str = xml_line.trim();
                                if !xml_str.is_empty() {
                                    process_xml_packet(&state, xml_str);
                                }
                            }
                        }
                        Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock || e.kind() == std::io::ErrorKind::TimedOut => {
                            continue;
                        }
                        Err(_) => break,
                    }
                }
            }
            Err(_) => {}
        }

        if let Ok(mut st) = state.lock() {
            st.connected_to_xml = false;
        }
        std::thread::sleep(Duration::from_secs(6));
    });
}

fn process_xml_packet(state: &Arc<Mutex<StateStore>>, xml_str: &str) {
    if !xml_str.contains("InfusionTelemetry") && !xml_str.contains("PumpStatus") {
        return;
    }
    let sn = match extract_tag_val(xml_str, "serialNumber") {
        Some(s) if !s.is_empty() => s,
        _ => return,
    };
    let rate = extract_tag_val(xml_str, "rate").and_then(|v| v.parse::<f64>().ok()).unwrap_or(0.0);
    let vol = extract_tag_val(xml_str, "volumeInfused").and_then(|v| v.parse::<f64>().ok()).unwrap_or(0.0);
    let vtbi = extract_tag_val(xml_str, "vtbi").and_then(|v| v.parse::<f64>().ok()).unwrap_or(0.0);
    let remaining_sec = extract_tag_val(xml_str, "remainingSec").and_then(|v| v.parse::<i64>().ok()).unwrap_or(0);
    let drug = extract_tag_val(xml_str, "drugName").unwrap_or_else(|| "Tanımsız".into());
    let st_code = extract_tag_val(xml_str, "status").unwrap_or_else(|| "0".into());
    let bed_xml = extract_tag_val(xml_str, "bedName").unwrap_or_default();
    let device_type = extract_tag_val(xml_str, "deviceType").unwrap_or_else(|| "Standart".into());

    if let Ok(mut st) = state.lock() {
        let now = license::now_unix();
        let mut target_bed = bed_xml.clone();
        for m in &mut st.mappings {
            if (m.source_type == "PUMP_SN" && m.address.eq_ignore_ascii_case(&sn))
                || (m.source_type == "DOCK_IP" && !bed_xml.is_empty() && m.bed_name.eq_ignore_ascii_case(&bed_xml))
            {
                m.last_seen = now;
                m.is_online = true;
                target_bed = m.bed_name.clone();
                break;
            }
        }
        if target_bed.is_empty() {
            return;
        }
        st.pumps.insert(
            sn.clone(),
            PumpState {
                id: sn.clone(),
                bed_name: target_bed,
                source_type: "DOCK_IP".into(),
                source_address: "XML_BRIDGE".into(),
                model: format!("İnfüzyon Pompası ({})", device_type),
                serial: sn,
                slot: 1,
                mode: "Sürekli İnfüzyon".into(),
                status: if st_code == "1" { "INFUSING".into() } else { "STOPPED".into() },
                rate,
                rate_unit: "ml/h".into(),
                volume_infused: vol,
                vtbi,
                time_remaining_sec: remaining_sec,
                drug_name: drug,
                drug_concentration: String::new(),
                pressure_level: 2,
                battery: 100,
                ac_power: true,
                alarm: None,
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
    fn extracts_generic_xml_tags() {
        let sample = "<InfusionTelemetry><serialNumber>SN-100</serialNumber><remainingSec>1800</remainingSec><drugName>Noradrenalin</drugName></InfusionTelemetry>";
        assert_eq!(extract_tag_val(sample, "serialNumber").as_deref(), Some("SN-100"));
        assert_eq!(extract_tag_val(sample, "remainingSec").as_deref(), Some("1800"));
        assert_eq!(extract_tag_val(sample, "drugName").as_deref(), Some("Noradrenalin"));
        assert_eq!(extract_tag_val(sample, "missing"), None);
    }
}
