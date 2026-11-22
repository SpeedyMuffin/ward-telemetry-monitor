use crate::license;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

pub const DEFAULT_DEPARTMENT: &str = "İNFÜZYON İZLEM VE KONTROL SİSTEMİ";
const DEFAULT_INITIAL_PASSWORD: &str = "admin1234";
const HASH_ITERATIONS: usize = 10_000;
const SESSION_TTL_SEC: i64 = 7200;
const RATE_WINDOW_SEC: i64 = 60;
const MAX_FAILED_ATTEMPTS: usize = 5;

fn default_department() -> String {
    DEFAULT_DEPARTMENT.to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdminSettingsFile {
    #[serde(default)]
    pub facility_name: String,
    #[serde(default = "default_department")]
    pub department_name: String,
    pub password_salt: String,
    pub password_hash: String,
    #[serde(default)]
    pub using_default_password: bool,
}

fn to_hex(bytes: &[u8]) -> String {
    let mut s = String::with_capacity(bytes.len() * 2);
    for &b in bytes {
        s.push_str(&format!("{:02x}", b));
    }
    s
}

fn random_hex(byte_len: usize) -> String {
    let mut buf = vec![0u8; byte_len];
    getrandom::getrandom(&mut buf).expect("OS RNG unavailable");
    to_hex(&buf)
}

pub fn hash_password(salt_hex: &str, password: &str) -> String {
    let mut h = Sha256::new();
    h.update(salt_hex.as_bytes());
    h.update(b":");
    h.update(password.as_bytes());
    let mut digest = h.finalize();

    for _ in 1..HASH_ITERATIONS {
        let mut iter_h = Sha256::new();
        iter_h.update(&digest);
        iter_h.update(salt_hex.as_bytes());
        iter_h.update(password.as_bytes());
        digest = iter_h.finalize();
    }
    to_hex(&digest)
}

fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }
    let mut diff: u8 = 0;
    for (&x, &y) in a.iter().zip(b.iter()) {
        diff |= x ^ y;
    }
    diff == 0
}

pub struct AdminState {
    pub settings: AdminSettingsFile,
    sessions: HashMap<String, i64>,
    failed_attempts: Vec<i64>,
    settings_path: PathBuf,
}

impl AdminState {
    fn build_default_settings() -> AdminSettingsFile {
        let salt = random_hex(16);
        let hash = hash_password(&salt, DEFAULT_INITIAL_PASSWORD);
        AdminSettingsFile {
            facility_name: String::new(),
            department_name: DEFAULT_DEPARTMENT.to_string(),
            password_salt: salt,
            password_hash: hash,
            using_default_password: true,
        }
    }

    pub fn load_or_init() -> Self {
        let path = license::runtime_dir().join("admin_settings.json");
        if let Ok(raw) = fs::read_to_string(&path) {
            if let Ok(mut parsed) = serde_json::from_str::<AdminSettingsFile>(&raw) {
                if !parsed.password_salt.trim().is_empty() && !parsed.password_hash.trim().is_empty() {
                    if parsed.department_name.trim().is_empty() {
                        parsed.department_name = DEFAULT_DEPARTMENT.to_string();
                    }
                    return Self {
                        settings: parsed,
                        sessions: HashMap::new(),
                        failed_attempts: Vec::new(),
                        settings_path: path,
                    };
                }
            }
        }

        let state = Self {
            settings: Self::build_default_settings(),
            sessions: HashMap::new(),
            failed_attempts: Vec::new(),
            settings_path: path,
        };
        state.save();
        state
    }

    #[cfg(test)]
    pub fn new_in_memory_for_test() -> Self {
        Self {
            settings: Self::build_default_settings(),
            sessions: HashMap::new(),
            failed_attempts: Vec::new(),
            settings_path: PathBuf::new(),
        }
    }

    pub fn save(&self) {
        if self.settings_path.as_os_str().is_empty() {
            return;
        }
        if let Ok(json) = serde_json::to_string_pretty(&self.settings) {
            let _ = fs::write(&self.settings_path, json);
        }
    }

    pub fn verify_password(&self, candidate: &str) -> bool {
        let computed = hash_password(&self.settings.password_salt, candidate);
        constant_time_eq(computed.as_bytes(), self.settings.password_hash.as_bytes())
    }

    pub fn login(&mut self, password: &str) -> Result<String, &'static str> {
        let now = license::now_unix();
        self.failed_attempts.retain(|&ts| now - ts < RATE_WINDOW_SEC);
        if self.failed_attempts.len() >= MAX_FAILED_ATTEMPTS {
            return Err("Çok fazla hatalı deneme. Lütfen 1 dakika bekleyin.");
        }

        if !self.verify_password(password) {
            self.failed_attempts.push(now);
            return Err("Hatalı yönetici şifresi.");
        }

        self.failed_attempts.clear();
        self.sessions.retain(|_, &mut exp| exp > now);
        let token = random_hex(32);
        self.sessions.insert(token.clone(), now + SESSION_TTL_SEC);
        Ok(token)
    }

    pub fn is_authenticated(&mut self, token: Option<&str>) -> bool {
        let now = license::now_unix();
        self.sessions.retain(|_, &mut exp| exp > now);
        let Some(tok) = token.map(str::trim).filter(|t| !t.is_empty()) else {
            return false;
        };
        let matched = self
            .sessions
            .keys()
            .find(|k| constant_time_eq(k.as_bytes(), tok.as_bytes()))
            .cloned();
        if let Some(k) = matched {
            self.sessions.insert(k, now + SESSION_TTL_SEC);
            return true;
        }
        false
    }

    pub fn logout(&mut self, token: Option<&str>) {
        let Some(tok) = token.map(str::trim).filter(|t| !t.is_empty()) else {
            return;
        };
        let matched = self
            .sessions
            .keys()
            .find(|k| constant_time_eq(k.as_bytes(), tok.as_bytes()))
            .cloned();
        if let Some(k) = matched {
            self.sessions.remove(&k);
        }
    }

    pub fn change_password(&mut self, current: &str, new_pass: &str) -> Result<String, &'static str> {
        if !self.verify_password(current) {
            return Err("Mevcut yönetici şifresi hatalı.");
        }
        if new_pass.trim().len() < 6 {
            return Err("Yeni şifre en az 6 karakter olmalıdır.");
        }
        let new_salt = random_hex(16);
        let new_hash = hash_password(&new_salt, new_pass);
        self.settings.password_salt = new_salt;
        self.settings.password_hash = new_hash;
        self.settings.using_default_password = false;
        self.save();

        self.sessions.clear();
        let now = license::now_unix();
        let fresh_token = random_hex(32);
        self.sessions.insert(fresh_token.clone(), now + SESSION_TTL_SEC);
        Ok(fresh_token)
    }

    pub fn update_facility(&mut self, facility_name: &str, department_name: &str) -> Result<(), &'static str> {
        let fac = facility_name.trim();
        let dept = department_name.trim();
        if fac.chars().count() > 100 || dept.chars().count() > 100 {
            return Err("Kurum veya birim adı en fazla 100 karakter olabilir.");
        }
        self.settings.facility_name = fac.to_string();
        self.settings.department_name = if dept.is_empty() {
            DEFAULT_DEPARTMENT.to_string()
        } else {
            dept.to_string()
        };
        self.save();
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn salted_hash_verifies_and_rejects_wrong_password() {
        let st = AdminState::new_in_memory_for_test();
        assert!(st.settings.using_default_password);
        assert!(st.verify_password("admin1234"));
        assert!(!st.verify_password("wrongpass"));
        assert!(!st.verify_password(""));
    }

    #[test]
    fn change_password_updates_salt_and_invalidates_old_password() {
        let mut st = AdminState::new_in_memory_for_test();
        let old_salt = st.settings.password_salt.clone();
        let old_token = st.login("admin1234").expect("default login");
        assert!(st.is_authenticated(Some(&old_token)));

        let new_token = st.change_password("admin1234", "GucluSifre99!").expect("password change");
        assert!(!st.settings.using_default_password);
        assert_ne!(st.settings.password_salt, old_salt);
        assert!(!st.verify_password("admin1234"));
        assert!(st.verify_password("GucluSifre99!"));
        assert!(!st.is_authenticated(Some(&old_token)));
        assert!(st.is_authenticated(Some(&new_token)));
    }

    #[test]
    fn session_login_verify_and_logout_flow() {
        let mut st = AdminState::new_in_memory_for_test();
        assert!(!st.is_authenticated(None));
        assert!(!st.is_authenticated(Some("nonexistent")));

        let tok = st.login("admin1234").expect("login ok");
        assert!(st.is_authenticated(Some(&tok)));

        st.logout(Some(&tok));
        assert!(!st.is_authenticated(Some(&tok)));
    }

    #[test]
    fn rate_limits_after_five_failed_attempts() {
        let mut st = AdminState::new_in_memory_for_test();
        for _ in 0..5 {
            assert!(st.login("badpass").is_err());
        }
        let blocked = st.login("admin1234");
        assert!(blocked.is_err());
        assert!(blocked.unwrap_err().contains("bekleyin"));
    }
}
