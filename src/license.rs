use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use base64::{engine::general_purpose::URL_SAFE, Engine as _};
use ed25519_dalek::{Signature, VerifyingKey};
use hmac::{Hmac, Mac};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs;
use std::path::PathBuf;
use std::ptr;
use std::time::{SystemTime, UNIX_EPOCH};

type Aes128CbcEnc = cbc::Encryptor<aes::Aes128>;
type Aes128CbcDec = cbc::Decryptor<aes::Aes128>;
type HmacSha256 = Hmac<Sha256>;

// Ed25519 Public Key (32 byte). Müşteri binary'sinde yalnızca doğrulama için public key bulunur;
// private key hiç gömülmez. İlk dağıtımda `WardMonitor_LicenseGen.exe --init-keys` çıktısıyla değiştirin.
const EMBEDDED_PUBLIC_KEY: [u8; 32] = [
    189, 44, 52, 153, 121, 126, 39, 110, 163, 176, 109, 169, 85, 120, 234, 73,
    13, 90, 36, 23, 236, 182, 221, 3, 255, 118, 185, 233, 120, 2, 32, 246,
];

// Yerel heartbeat (.sys_state.dat & Registry) mühürlemesi için örnek demo anahtarları.
const MASKED_MASTER_SECRET: &[u8] = &[
    228, 248, 199, 168, 217, 146, 155, 104, 106, 80, 54, 82, 15, 17, 247, 205,
    215, 168, 215, 158, 106, 28, 94, 73, 39, 1, 7, 236, 232, 192, 169, 189,
    237, 238, 24, 69,
];
const MASKED_HWID_SALT: &[u8] = &[
    0, 42, 40, 83, 127, 103, 132, 191, 192, 213, 236, 24, 23, 53, 35, 8, 21, 248,
];
const REG_SUBKEY: &str = "Software\\WardTelemetry\\MonitorGuard";

fn deobfuscate_master_secret() -> Vec<u8> {
    let base: u8 = std::hint::black_box(0xA7);
    let step: usize = std::hint::black_box(19);
    let bias: usize = std::hint::black_box(7);
    MASKED_MASTER_SECRET
        .iter()
        .enumerate()
        .map(|(i, &b)| {
            let m = base ^ (((i.wrapping_mul(step)).wrapping_add(bias)) & 0xFF) as u8;
            b ^ std::hint::black_box(m)
        })
        .collect()
}

fn deobfuscate_hwid_salt() -> String {
    let base: u8 = std::hint::black_box(0x5C);
    let step: usize = std::hint::black_box(23);
    let bias: usize = std::hint::black_box(11);
    let bytes: Vec<u8> = MASKED_HWID_SALT
        .iter()
        .enumerate()
        .map(|(i, &b)| {
            let m = base ^ (((i.wrapping_mul(step)).wrapping_add(bias)) & 0xFF) as u8;
            b ^ std::hint::black_box(m)
        })
        .collect();
    String::from_utf8(bytes).unwrap_or_default()
}

fn is_debugger_attached() -> bool {
    unsafe { winapi::um::debugapi::IsDebuggerPresent() != 0 }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LicenseStatus {
    pub valid: bool,
    pub reason: String,
    pub message: String,
    pub hwid: String,
    pub customer: String,
    pub max_beds: i64,
    pub days_left: i64,
    pub expires_at: i64,
    pub expires_date: String,
    pub edition: String,
}

#[derive(Debug, Deserialize)]
struct TokenPayload {
    hwid: String,
    max_beds: Option<i64>,
    expires_at: Option<i64>,
    customer: Option<String>,
    edition: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct TickRecord {
    hwid: String,
    last_tick: i64,
}

pub fn now_unix() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0)
}

/// Howard Hinnant civil-from-days algorithm + UTC+3 (Türkiye)
pub fn format_ts_tr(ts: i64, include_time: bool) -> String {
    if ts <= 0 {
        return "-".to_string();
    }
    let local_ts = ts + 3 * 3600;
    let days = local_ts.div_euclid(86400);
    let secs = local_ts.rem_euclid(86400);
    let z = days + 719468;
    let era = if z >= 0 { z } else { z - 146096 } / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = mp + if mp < 10 { 3 } else { -9 };
    let year = y + if m <= 2 { 1 } else { 0 };
    if !include_time {
        return format!("{:02}.{:02}.{:04}", d, m, year);
    }
    let hh = secs / 3600;
    let mm = (secs % 3600) / 60;
    let ss = secs % 60;
    format!("{:02}.{:02}.{:04} {:02}:{:02}:{:02}", d, m, year, hh, mm, ss)
}

pub fn runtime_dir() -> PathBuf {
    std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|x| x.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."))
}

fn master_keys() -> ([u8; 16], [u8; 16]) {
    let secret = deobfuscate_master_secret();
    let digest = Sha256::digest(&secret);
    let mut sign_key = [0u8; 16];
    let mut enc_key = [0u8; 16];
    sign_key.copy_from_slice(&digest[0..16]);
    enc_key.copy_from_slice(&digest[16..32]);
    (sign_key, enc_key)
}

fn fernet_decrypt(token_str: &str) -> Result<Vec<u8>, ()> {
    let raw = URL_SAFE.decode(token_str.trim()).map_err(|_| ())?;
    if raw.len() < 1 + 8 + 16 + 16 + 32 {
        return Err(());
    }
    if raw[0] != 0x80 {
        return Err(());
    }
    let (sign_key, enc_key) = master_keys();
    let msg_len = raw.len() - 32;
    let mut mac = HmacSha256::new_from_slice(&sign_key).map_err(|_| ())?;
    mac.update(&raw[..msg_len]);
    mac.verify_slice(&raw[msg_len..]).map_err(|_| ())?;

    let iv = &raw[9..25];
    let ciphertext = &raw[25..msg_len];
    let dec = Aes128CbcDec::new_from_slices(&enc_key, iv).map_err(|_| ())?;
    let mut buf = ciphertext.to_vec();
    let pt = dec.decrypt_padded_mut::<Pkcs7>(&mut buf).map_err(|_| ())?;
    Ok(pt.to_vec())
}

pub fn fernet_encrypt(plaintext: &[u8]) -> Result<String, ()> {
    let (sign_key, enc_key) = master_keys();
    let ts = now_unix() as u64;
    let mut iv_bytes = [0u8; 16];
    getrandom::getrandom(&mut iv_bytes).map_err(|_| ())?;
    let iv = &iv_bytes;

    let enc = Aes128CbcEnc::new_from_slices(&enc_key, iv).map_err(|_| ())?;
    let ct = enc.encrypt_padded_vec_mut::<Pkcs7>(plaintext);

    let mut out = Vec::with_capacity(1 + 8 + 16 + ct.len() + 32);
    out.push(0x80);
    out.extend_from_slice(&ts.to_be_bytes());
    out.extend_from_slice(iv);
    out.extend_from_slice(&ct);

    let mut mac = HmacSha256::new_from_slice(&sign_key).map_err(|_| ())?;
    mac.update(&out);
    let sig = mac.finalize().into_bytes();
    out.extend_from_slice(&sig);

    Ok(URL_SAFE.encode(&out))
}

fn to_wide(s: &str) -> Vec<u16> {
    s.encode_utf16().chain(std::iter::once(0)).collect()
}

fn read_machine_guid() -> String {
    use winapi::shared::minwindef::{DWORD, HKEY, LPBYTE};
    use winapi::um::winnt::{KEY_READ, KEY_WOW64_64KEY};
    use winapi::um::winreg::{RegCloseKey, RegOpenKeyExW, RegQueryValueExW, HKEY_LOCAL_MACHINE};

    unsafe {
        let subkey = to_wide("SOFTWARE\\Microsoft\\Cryptography");
        let val_name = to_wide("MachineGuid");
        let mut hkey: HKEY = ptr::null_mut();
        if RegOpenKeyExW(HKEY_LOCAL_MACHINE, subkey.as_ptr(), 0, KEY_READ | KEY_WOW64_64KEY, &mut hkey) != 0 {
            return "UNKNOWN_GUID".to_string();
        }
        let mut buf = [0u16; 256];
        let mut size: DWORD = (buf.len() * 2) as DWORD;
        let rc = RegQueryValueExW(
            hkey,
            val_name.as_ptr(),
            ptr::null_mut(),
            ptr::null_mut(),
            buf.as_mut_ptr() as LPBYTE,
            &mut size,
        );
        RegCloseKey(hkey);
        if rc != 0 {
            return "UNKNOWN_GUID".to_string();
        }
        let u16_len = (size as usize) / 2;
        let trimmed = &buf[..u16_len];
        let end = trimmed.iter().position(|&c| c == 0).unwrap_or(trimmed.len());
        String::from_utf16_lossy(&trimmed[..end])
    }
}

fn read_c_volume_serial() -> u32 {
    use winapi::shared::minwindef::DWORD;
    use winapi::um::fileapi::GetVolumeInformationW;

    unsafe {
        let root = to_wide("C:\\");
        let mut serial: DWORD = 0;
        let ok = GetVolumeInformationW(
            root.as_ptr(),
            ptr::null_mut(),
            0,
            &mut serial,
            ptr::null_mut(),
            ptr::null_mut(),
            ptr::null_mut(),
            0,
        );
        if ok != 0 { serial } else { 0 }
    }
}

pub fn get_stable_hwid() -> String {
    let guid = read_machine_guid();
    let vol_ser = read_c_volume_serial();
    let salt = deobfuscate_hwid_salt();
    let raw = format!("{}|{:08X}|{}", guid, vol_ser, salt);
    let digest = Sha256::digest(raw.as_bytes());
    let hex_up: String = digest.iter().map(|b| format!("{:02X}", b)).collect();
    format!("WTM-{}-{}-{}", &hex_up[0..4], &hex_up[4..8], &hex_up[8..12])
}

fn read_reg_tick(hwid: &str) -> i64 {
    use winapi::shared::minwindef::{DWORD, HKEY, LPBYTE};
    use winapi::um::winnt::KEY_READ;
    use winapi::um::winreg::{RegCloseKey, RegOpenKeyExW, RegQueryValueExW, HKEY_CURRENT_USER};

    unsafe {
        let subkey = to_wide(REG_SUBKEY);
        let val_name = to_wide("LastTick");
        let mut hkey: HKEY = ptr::null_mut();
        if RegOpenKeyExW(HKEY_CURRENT_USER, subkey.as_ptr(), 0, KEY_READ, &mut hkey) != 0 {
            return 0;
        }
        let mut buf = [0u16; 1024];
        let mut size: DWORD = (buf.len() * 2) as DWORD;
        let rc = RegQueryValueExW(
            hkey,
            val_name.as_ptr(),
            ptr::null_mut(),
            ptr::null_mut(),
            buf.as_mut_ptr() as LPBYTE,
            &mut size,
        );
        RegCloseKey(hkey);
        if rc != 0 {
            return 0;
        }
        let u16_len = (size as usize) / 2;
        let trimmed = &buf[..u16_len];
        let end = trimmed.iter().position(|&c| c == 0).unwrap_or(trimmed.len());
        let token = String::from_utf16_lossy(&trimmed[..end]);
        if let Ok(pt) = fernet_decrypt(&token) {
            if let Ok(rec) = serde_json::from_slice::<TickRecord>(&pt) {
                if rec.hwid == hwid {
                    return rec.last_tick;
                }
            }
        }
        0
    }
}

fn write_reg_tick(token: &str) {
    use winapi::shared::minwindef::HKEY;
    use winapi::um::winnt::{KEY_WRITE, REG_SZ};
    use winapi::um::winreg::{RegCloseKey, RegCreateKeyExW, RegSetValueExW, HKEY_CURRENT_USER};

    unsafe {
        let subkey = to_wide(REG_SUBKEY);
        let val_name = to_wide("LastTick");
        let mut hkey: HKEY = ptr::null_mut();
        if RegCreateKeyExW(
            HKEY_CURRENT_USER,
            subkey.as_ptr(),
            0,
            ptr::null_mut(),
            0,
            KEY_WRITE,
            ptr::null_mut(),
            &mut hkey,
            ptr::null_mut(),
        ) == 0
        {
            let wval = to_wide(token);
            let byte_len = (wval.len() * 2) as u32;
            RegSetValueExW(hkey, val_name.as_ptr(), 0, REG_SZ, wval.as_ptr() as *const u8, byte_len);
            RegCloseKey(hkey);
        }
    }
}

fn read_file_tick(hwid: &str) -> i64 {
    let p = runtime_dir().join(".sys_state.dat");
    if let Ok(token) = fs::read_to_string(p) {
        if let Ok(pt) = fernet_decrypt(token.trim()) {
            if let Ok(rec) = serde_json::from_slice::<TickRecord>(&pt) {
                if rec.hwid == hwid {
                    return rec.last_tick;
                }
            }
        }
    }
    0
}

pub fn record_heartbeat_tick() {
    let hwid = get_stable_hwid();
    let now = now_unix();
    let prev = read_file_tick(&hwid).max(read_reg_tick(&hwid));
    let rec = TickRecord {
        hwid,
        last_tick: now.max(prev),
    };
    if let Ok(raw) = serde_json::to_vec(&rec) {
        if let Ok(tok) = fernet_encrypt(&raw) {
            let _ = fs::write(runtime_dir().join(".sys_state.dat"), &tok);
            write_reg_tick(&tok);
        }
    }
}

pub fn verify_ed25519_payload(token_part: &str, public_key: &[u8; 32]) -> Result<Vec<u8>, ()> {
    let (b64_payload, b64_sig) = token_part.trim().split_once('.').ok_or(())?;
    let payload_bytes = URL_SAFE.decode(b64_payload).map_err(|_| ())?;
    let sig_bytes = URL_SAFE.decode(b64_sig).map_err(|_| ())?;
    let sig_arr: [u8; 64] = sig_bytes.try_into().map_err(|_| ())?;
    let vk = VerifyingKey::from_bytes(public_key).map_err(|_| ())?;
    let sig = Signature::from_bytes(&sig_arr);
    vk.verify_strict(&payload_bytes, &sig).map_err(|_| ())?;
    Ok(payload_bytes)
}

pub fn decode_and_verify_key(license_key: &str, check_tamper: bool) -> LicenseStatus {
    let current_hwid = get_stable_hwid();
    if is_debugger_attached() {
        return LicenseStatus {
            valid: false,
            reason: "DEBUGGER_DETECTED".into(),
            message: "Güvenlik ihlali: Debugger tespit edildi, erişim engellendi.".into(),
            hwid: current_hwid,
            customer: "-".into(),
            max_beds: 0,
            days_left: 0,
            expires_at: 0,
            expires_date: "-".into(),
            edition: "-".into(),
        };
    }
    let now = now_unix();
    let trimmed = license_key.trim();

    if !trimmed.starts_with("WTMKEY-") {
        return LicenseStatus {
            valid: false,
            reason: "LICENSE_MISSING_OR_INVALID_FORMAT".into(),
            message: "Geçerli lisans anahtarı bulunamadı.".into(),
            hwid: current_hwid,
            customer: "-".into(),
            max_beds: 0,
            days_left: 0,
            expires_at: 0,
            expires_date: "-".into(),
            edition: "-".into(),
        };
    }

    let token_part = &trimmed["WTMKEY-".len()..];
    let pt = match verify_ed25519_payload(token_part, &EMBEDDED_PUBLIC_KEY) {
        Ok(d) => d,
        Err(_) => {
            return LicenseStatus {
                valid: false,
                reason: "LICENSE_SIGNATURE_CORRUPTED".into(),
                message: "Lisans imzası geçersiz veya bozulmuş.".into(),
                hwid: current_hwid,
                customer: "-".into(),
                max_beds: 0,
                days_left: 0,
                expires_at: 0,
                expires_date: "-".into(),
                edition: "-".into(),
            }
        }
    };

    let payload: TokenPayload = match serde_json::from_slice(&pt) {
        Ok(p) => p,
        Err(_) => {
            return LicenseStatus {
                valid: false,
                reason: "LICENSE_PAYLOAD_INVALID".into(),
                message: "Lisans veri yapısı hatalı.".into(),
                hwid: current_hwid,
                customer: "-".into(),
                max_beds: 0,
                days_left: 0,
                expires_at: 0,
                expires_date: "-".into(),
                edition: "-".into(),
            }
        }
    };

    let token_hwid = payload.hwid.trim().to_uppercase();
    let expires_at = payload.expires_at.unwrap_or(0);
    let max_beds = payload.max_beds.unwrap_or(0);
    let customer = payload.customer.unwrap_or_else(|| "Kayıtsız Kurum".into());
    let edition = payload.edition.unwrap_or_else(|| "ENTERPRISE".into());
    let exp_str = format_ts_tr(expires_at, false);

    if token_hwid != current_hwid {
        return LicenseStatus {
            valid: false,
            reason: "HWID_MISMATCH".into(),
            message: format!("Lisans başka bir cihaza ({}) aittir. Bu cihaz ({}) için kilitlendi.", token_hwid, current_hwid),
            hwid: current_hwid,
            customer,
            max_beds,
            days_left: 0,
            expires_at,
            expires_date: exp_str,
            edition,
        };
    }

    if check_tamper {
        let last_tick = read_file_tick(&current_hwid).max(read_reg_tick(&current_hwid));
        if last_tick > 0 && now < (last_tick - 300) {
            return LicenseStatus {
                valid: false,
                reason: "CLOCK_TAMPER_DETECTED".into(),
                message: format!("Sistem saati geri alınmış. Son doğrulanmış zaman: {}.", format_ts_tr(last_tick, true)),
                hwid: current_hwid,
                customer,
                max_beds,
                days_left: 0,
                expires_at,
                expires_date: exp_str,
                edition,
            };
        }
    }

    if now > expires_at {
        return LicenseStatus {
            valid: false,
            reason: "LICENSE_EXPIRED".into(),
            message: format!("Lisans süresi {} tarihinde sona ermiştir.", exp_str),
            hwid: current_hwid,
            customer,
            max_beds,
            days_left: 0,
            expires_at,
            expires_date: exp_str,
            edition,
        };
    }

    let days_left = ((expires_at - now) / 86400 + 1).max(0);
    LicenseStatus {
        valid: true,
        reason: "OK".into(),
        message: "Lisans doğrulandı.".into(),
        hwid: current_hwid,
        customer,
        max_beds,
        days_left,
        expires_at,
        expires_date: exp_str,
        edition,
    }
}

pub fn get_license_status(update_tick: bool) -> LicenseStatus {
    let lpath = runtime_dir().join("license.dat");
    if !lpath.exists() {
        return LicenseStatus {
            valid: false,
            reason: "LICENSE_FILE_NOT_FOUND".into(),
            message: "Lisans dosyası (license.dat) bulunamadı.".into(),
            hwid: get_stable_hwid(),
            customer: "-".into(),
            max_beds: 0,
            days_left: 0,
            expires_at: 0,
            expires_date: "-".into(),
            edition: "-".into(),
        };
    }
    match fs::read_to_string(&lpath) {
        Ok(k) => {
            let st = decode_and_verify_key(&k, true);
            if st.valid && update_tick {
                record_heartbeat_tick();
            }
            st
        }
        Err(e) => LicenseStatus {
            valid: false,
            reason: "LICENSE_READ_ERROR".into(),
            message: format!("Lisans okunamadı: {}", e),
            hwid: get_stable_hwid(),
            customer: "-".into(),
            max_beds: 0,
            days_left: 0,
            expires_at: 0,
            expires_date: "-".into(),
            edition: "-".into(),
        },
    }
}

pub fn activate_license_key(license_key: &str) -> LicenseStatus {
    let st = decode_and_verify_key(license_key, true);
    if !st.valid {
        return st;
    }
    let lpath = runtime_dir().join("license.dat");
    let _ = fs::write(lpath, license_key.trim());
    record_heartbeat_tick();
    st
}

#[cfg(test)]
mod tests {
    use super::*;
    use ed25519_dalek::{Signer, SigningKey};

    #[test]
    fn embedded_public_key_is_valid_curve_point() {
        assert!(VerifyingKey::from_bytes(&EMBEDDED_PUBLIC_KEY).is_ok());
    }

    #[test]
    fn verify_ed25519_license_roundtrip() {
        let seed = [42u8; 32];
        let sk = SigningKey::from_bytes(&seed);
        let pk_bytes = sk.verifying_key().to_bytes();

        let payload = br#"{"hwid":"WTM-0000-0000-0000","max_beds":16,"expires_at":2000000000}"#;
        let sig = sk.sign(payload);
        let token = format!(
            "{}.{}",
            URL_SAFE.encode(payload),
            URL_SAFE.encode(sig.to_bytes())
        );

        let verified = verify_ed25519_payload(&token, &pk_bytes).expect("valid signature must verify");
        assert_eq!(verified, payload);

        let mut tampered_payload = payload.to_vec();
        tampered_payload[0] = b'[';
        let tampered_token = format!(
            "{}.{}",
            URL_SAFE.encode(&tampered_payload),
            URL_SAFE.encode(sig.to_bytes())
        );
        assert!(verify_ed25519_payload(&tampered_token, &pk_bytes).is_err());
    }
}
