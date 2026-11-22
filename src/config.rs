use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct AppConfig {
    pub bind_host: String,
    pub http_port: u16,
    pub mqtt_broker: String,
    pub mqtt_topic: String,
    pub xml_bridge_addr: String,
    pub xml_username: String,
    pub xml_password_hash: String,
    pub enable_serial_com: bool,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            bind_host: "127.0.0.1".to_string(),
            http_port: 8090,
            mqtt_broker: String::new(),
            mqtt_topic: "hl7/#".to_string(),
            xml_bridge_addr: String::new(),
            xml_username: String::new(),
            xml_password_hash: String::new(),
            enable_serial_com: true,
        }
    }
}

impl AppConfig {
    /// Çalışma dizinindeki (veya mevcut dizindeki) `config.json` dosyasını okur; yoksa güvenli varsayılanları döner.
    pub fn load() -> Self {
        let candidates = [
            crate::license::runtime_dir().join("config.json"),
            PathBuf::from("config.json"),
        ];
        for path in &candidates {
            if let Ok(raw) = fs::read_to_string(path) {
                if let Ok(cfg) = serde_json::from_str::<AppConfig>(&raw) {
                    return cfg;
                }
            }
        }
        Self::default()
    }
}
