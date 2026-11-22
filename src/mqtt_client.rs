use crate::config::AppConfig;
use crate::models::StateStore;
use std::io::{Read, Write};
use std::net::TcpStream;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

fn encode_utf8_field(s: &str) -> Vec<u8> {
    let b = s.as_bytes();
    let mut v = Vec::with_capacity(2 + b.len());
    v.push(((b.len() >> 8) & 0xFF) as u8);
    v.push((b.len() & 0xFF) as u8);
    v.extend_from_slice(b);
    v
}

fn encode_remaining_len(mut len: usize) -> Vec<u8> {
    let mut out = Vec::new();
    loop {
        let mut digit = (len % 128) as u8;
        len /= 128;
        if len > 0 {
            digit |= 0x80;
        }
        out.push(digit);
        if len == 0 {
            break;
        }
    }
    out
}

fn build_connect_packet(client_id: &str) -> Vec<u8> {
    let mut vh_pl = Vec::new();
    vh_pl.extend_from_slice(&encode_utf8_field("MQTT")); // Protocol Name
    vh_pl.push(4); // Level 3.1.1
    vh_pl.push(0x02); // Clean Session
    vh_pl.push(0x00); // Keep Alive MSB
    vh_pl.push(30); // Keep Alive LSB (30s)
    vh_pl.extend_from_slice(&encode_utf8_field(client_id));

    let mut pkt = vec![0x10];
    pkt.extend_from_slice(&encode_remaining_len(vh_pl.len()));
    pkt.extend_from_slice(&vh_pl);
    pkt
}

fn build_subscribe_packet(packet_id: u16, topic: &str) -> Vec<u8> {
    let mut vh_pl = Vec::new();
    vh_pl.push((packet_id >> 8) as u8);
    vh_pl.push((packet_id & 0xFF) as u8);
    vh_pl.extend_from_slice(&encode_utf8_field(topic));
    vh_pl.push(0x00); // QoS 0

    let mut pkt = vec![0x82];
    pkt.extend_from_slice(&encode_remaining_len(vh_pl.len()));
    pkt.extend_from_slice(&vh_pl);
    pkt
}

fn read_remaining_length(stream: &mut TcpStream) -> std::io::Result<usize> {
    let mut multiplier = 1usize;
    let mut value = 0usize;
    loop {
        let mut b = [0u8; 1];
        stream.read_exact(&mut b)?;
        value += ((b[0] & 0x7F) as usize) * multiplier;
        if (b[0] & 0x80) == 0 {
            break;
        }
        multiplier *= 128;
        if multiplier > 128 * 128 * 128 {
            return Err(std::io::Error::new(std::io::ErrorKind::InvalidData, "MQTT remaining len overflow"));
        }
    }
    Ok(value)
}

pub fn spawn_mqtt_worker(state: Arc<Mutex<StateStore>>, cfg: AppConfig) {
    let broker_addr = cfg.mqtt_broker.trim().to_string();
    if broker_addr.is_empty() {
        return;
    }
    let topic_filter = if cfg.mqtt_topic.trim().is_empty() {
        "telemetry/#".to_string()
    } else {
        cfg.mqtt_topic.trim().to_string()
    };

    std::thread::spawn(move || loop {
        let Ok(sock_addr) = broker_addr.parse::<std::net::SocketAddr>() else {
            eprintln!("Geçersiz MQTT broker adresi (config.json): {}", broker_addr);
            std::thread::sleep(Duration::from_secs(10));
            continue;
        };
        match TcpStream::connect_timeout(&sock_addr, Duration::from_secs(4)) {
            Ok(mut stream) => {
                let _ = stream.set_read_timeout(Some(Duration::from_secs(3)));
                let cid = format!("WardTelemetryMonitor_{}", crate::license::now_unix());
                if stream.write_all(&build_connect_packet(&cid)).is_err() {
                    continue;
                }

                // Read CONNACK (4 bytes: 0x20 0x02 ...)
                let mut hdr = [0u8; 1];
                if stream.read_exact(&mut hdr).is_err() || hdr[0] != 0x20 {
                    continue;
                }
                if let Ok(rlen) = read_remaining_length(&mut stream) {
                    let mut cbuf = vec![0u8; rlen];
                    if stream.read_exact(&mut cbuf).is_err() {
                        continue;
                    }
                } else {
                    continue;
                }

                if stream.write_all(&build_subscribe_packet(1, &topic_filter)).is_err() {
                    continue;
                }

                if let Ok(mut st) = state.lock() {
                    st.connected_to_mqtt = true;
                }

                let mut last_ping = Instant::now();
                loop {
                    if last_ping.elapsed() >= Duration::from_secs(18) {
                        if stream.write_all(&[0xC0, 0x00]).is_err() {
                            break;
                        }
                        last_ping = Instant::now();
                    }

                    let mut fh = [0u8; 1];
                    match stream.read_exact(&mut fh) {
                        Ok(_) => {
                            let rem = match read_remaining_length(&mut stream) {
                                Ok(r) => r,
                                Err(_) => break,
                            };
                            let mut body = vec![0u8; rem];
                            if rem > 0 && stream.read_exact(&mut body).is_err() {
                                break;
                            }

                            let pkt_type = fh[0] & 0xF0;
                            if pkt_type == 0x30 && body.len() >= 2 {
                                // PUBLISH
                                let qos = (fh[0] >> 1) & 0x03;
                                let tlen = ((body[0] as usize) << 8) | (body[1] as usize);
                                if 2 + tlen <= body.len() {
                                    let topic = String::from_utf8_lossy(&body[2..2 + tlen]).to_string();
                                    let mut pl_start = 2 + tlen;
                                    if qos > 0 && pl_start + 2 <= body.len() {
                                        pl_start += 2;
                                    }
                                    if pl_start <= body.len() {
                                        let payload = String::from_utf8_lossy(&body[pl_start..]).to_string();
                                        if let Ok(mut st) = state.lock() {
                                            st.handle_telemetry_message(&topic, &payload);
                                        }
                                    }
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
            st.connected_to_mqtt = false;
        }
        std::thread::sleep(Duration::from_secs(4));
    });
}
