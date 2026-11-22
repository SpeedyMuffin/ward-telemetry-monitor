#![allow(dead_code)]

mod license;

use base64::{engine::general_purpose::URL_SAFE, Engine as _};
use ed25519_dalek::{Signer, SigningKey};
use serde::Serialize;
use std::fs::{self, OpenOptions};
use std::io::{self, BufRead, Write};
use std::process::{Command, Stdio};

const SIGNING_KEY_FILE: &str = "signing_key.secret";

#[derive(Serialize)]
struct KeyPayload {
    hwid: String,
    max_beds: i64,
    issued_at: i64,
    expires_at: i64,
    customer: String,
    edition: String,
}

fn read_line_trimmed(reader: &mut dyn BufRead) -> String {
    let mut s = String::new();
    let _ = reader.read_line(&mut s);
    s.trim().to_string()
}

fn prompt(reader: &mut dyn BufRead, msg: &str, default_val: &str) -> String {
    if default_val.is_empty() {
        print!("{}: ", msg);
    } else {
        print!("{} [{}]: ", msg, default_val);
    }
    let _ = io::stdout().flush();
    let v = read_line_trimmed(reader);
    if v.is_empty() {
        default_val.to_string()
    } else {
        v
    }
}

fn copy_to_clipboard(text: &str) -> bool {
    if let Ok(mut child) = Command::new("cmd")
        .args(["/C", "clip"])
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
    {
        if let Some(mut stdin) = child.stdin.take() {
            let _ = stdin.write_all(text.as_bytes());
        }
        return child.wait().map(|s| s.success()).unwrap_or(false);
    }
    false
}

fn encode_hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{:02x}", b)).collect()
}

fn decode_hex_32(s: &str) -> Result<[u8; 32], String> {
    let clean = s.trim();
    if clean.len() != 64 {
        return Err(format!(
            "Gecersiz {} uzunlugu: {} (64 hex karakter bekleniyor)",
            SIGNING_KEY_FILE,
            clean.len()
        ));
    }
    let mut out = [0u8; 32];
    for i in 0..32 {
        out[i] = u8::from_str_radix(&clean[i * 2..i * 2 + 2], 16)
            .map_err(|_| format!("{} gecersiz hex karakter iceriyor", SIGNING_KEY_FILE))?;
    }
    Ok(out)
}

fn load_signing_key() -> Result<SigningKey, String> {
    let key_path = license::runtime_dir().join(SIGNING_KEY_FILE);
    let raw = fs::read_to_string(&key_path).map_err(|_| {
        format!(
            "{} bulunamadi! Once 'WardMonitor_LicenseGen.exe --init-keys' ile Ed25519 anahtar cifti uretin.",
            key_path.display()
        )
    })?;
    let seed = decode_hex_32(&raw)?;
    Ok(SigningKey::from_bytes(&seed))
}

fn init_keys() -> Result<(), String> {
    let mut seed = [0u8; 32];
    getrandom::getrandom(&mut seed).map_err(|e| format!("Rastgele anahtar uretilemedi: {}", e))?;
    let sk = SigningKey::from_bytes(&seed);
    let pk = sk.verifying_key().to_bytes();

    let key_path = license::runtime_dir().join(SIGNING_KEY_FILE);
    fs::write(&key_path, format!("{}\n", encode_hex(&seed)))
        .map_err(|e| format!("{} yazilamadi: {}", key_path.display(), e))?;

    println!("================================================================");
    println!(" YENI ED25519 ANAHTAR CIFTI URETILDI");
    println!("================================================================");
    println!("Private Key (GIZLI TUTUN): {}", key_path.display());
    println!();
    println!("Asagidaki Public Key dizisini src/license.rs icindeki EMBEDDED_PUBLIC_KEY");
    println!("sabitiyle degistirip WardTelemetryMonitor.exe'yi yeniden derleyin:");
    println!();
    println!("const EMBEDDED_PUBLIC_KEY: [u8; 32] = [");
    for row in pk.chunks(16) {
        let nums: Vec<String> = row.iter().map(|b| b.to_string()).collect();
        println!("    {},", nums.join(", "));
    }
    println!("];");
    println!("================================================================");
    Ok(())
}

fn generate_key(sk: &SigningKey, hwid: &str, max_beds: i64, days: i64, customer: &str) -> Result<(String, i64, i64), String> {
    let clean_hwid = hwid.trim().to_uppercase();
    if !clean_hwid.starts_with("WTM-") || clean_hwid.len() < 16 {
        return Err(format!("Gecersiz HWID formati: '{}' (Beklenen: WTM-XXXX-XXXX-XXXX)", clean_hwid));
    }
    let now = license::now_unix();
    let exp = now + days * 86400;
    let payload = KeyPayload {
        hwid: clean_hwid,
        max_beds,
        issued_at: now,
        expires_at: exp,
        customer: customer.to_string(),
        edition: "ENTERPRISE".to_string(),
    };
    let raw = serde_json::to_vec(&payload).map_err(|e| e.to_string())?;
    let sig = sk.sign(&raw);
    let token = format!(
        "WTMKEY-{}.{}",
        URL_SAFE.encode(&raw),
        URL_SAFE.encode(sig.to_bytes())
    );
    Ok((token, now, exp))
}

fn archive_record(customer: &str, hwid: &str, max_beds: i64, days: i64, exp_date: &str, key: &str) {
    let log_path = license::runtime_dir().join("uretilen_lisanslar.txt");
    if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(&log_path) {
        let now_str = license::format_ts_tr(license::now_unix(), true);
        let _ = writeln!(
            f,
            "[{}] Kurum: {} | HWID: {} | Yatak: {} | Sure: {} gun (Bitis: {}) | Anahtar: {}",
            now_str, customer, hwid, max_beds, days, exp_date, key
        );
    }
}

fn print_usage() {
    println!("Kullanim:");
    println!("  WardMonitor_LicenseGen.exe --print-hwid        (Bu bilgisayarin HWID kodunu yazdirir)");
    println!("  WardMonitor_LicenseGen.exe --init-keys         (Yeni Ed25519 anahtar cifti uretir)");
    println!("  WardMonitor_LicenseGen.exe                     (Etkilesimli lisans uretim sihirbazi)");
    println!("  WardMonitor_LicenseGen.exe --hwid WTM-... --customer \"Kurum\" --beds 16 --days 365 [--out license.dat] [--no-pause]");
}

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let local_hwid = license::get_stable_hwid();

    let mut arg_hwid: Option<String> = None;
    let mut arg_customer = "Hastane Kurulumu".to_string();
    let mut arg_beds: i64 = 16;
    let mut arg_days: i64 = 365;
    let mut arg_out: Option<String> = None;
    let mut no_pause = false;
    let mut run_init_keys = false;

    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            "-h" | "--help" => {
                print_usage();
                return;
            }
            "--print-hwid" => {
                println!("{}", local_hwid);
                return;
            }
            "--init-keys" => {
                run_init_keys = true;
            }
            "--hwid" => {
                if i + 1 < args.len() {
                    arg_hwid = Some(args[i + 1].clone());
                    i += 1;
                }
            }
            "--customer" => {
                if i + 1 < args.len() {
                    arg_customer = args[i + 1].clone();
                    i += 1;
                }
            }
            "--beds" => {
                if i + 1 < args.len() {
                    arg_beds = args[i + 1].parse().unwrap_or(16);
                    i += 1;
                }
            }
            "--days" => {
                if i + 1 < args.len() {
                    arg_days = args[i + 1].parse().unwrap_or(365);
                    i += 1;
                }
            }
            "--out" => {
                if i + 1 < args.len() {
                    arg_out = Some(args[i + 1].clone());
                    i += 1;
                }
            }
            "--no-pause" => {
                no_pause = true;
            }
            _ => {}
        }
        i += 1;
    }

    if run_init_keys {
        if let Err(e) = init_keys() {
            eprintln!("HATA: {}", e);
            std::process::exit(1);
        }
        return;
    }

    let sk = match load_signing_key() {
        Ok(k) => k,
        Err(e) => {
            eprintln!("HATA: {}", e);
            std::process::exit(1);
        }
    };

    let interactive = arg_hwid.is_none();
    let stdin = io::stdin();
    let mut reader = stdin.lock();

    let (hwid, customer, beds, days, save_dat_path) = if interactive {
        println!("================================================================");
        println!(" WARD TELEMETRY MONITOR - LISANS ANAHTARI URETICI");
        println!("================================================================");
        println!("Bu bilgisayarin HWID kodu: {}", local_hwid);
        println!("Hedef bilgisayarda 'MERKEZI IZLEM' acildiginda ekranda");
        println!("gorunen 'Cihaz Kodu (HWID)' bilgisini asagiya yapistiriniz.");
        println!("(Bos birakip ENTER'a basarsaniz bu bilgisayarin kodu kullanilir)");
        println!();

        let h = prompt(&mut reader, "Hedef HWID", &local_hwid);
        let c = prompt(&mut reader, "Hastane / Kurum Adi", "Hastane Kurulumu");
        let b_str = prompt(&mut reader, "Maksimum Yatak Sayisi", "16");
        let d_str = prompt(&mut reader, "Gecerlilik Suresi (Gun)", "365");
        let write_dat = prompt(&mut reader, "Yanina license.dat dosyasi da kaydedilsin mi? (E/H)", "E");

        let b = b_str.parse::<i64>().unwrap_or(16).max(1);
        let d = d_str.parse::<i64>().unwrap_or(365).max(1);
        let out_p = if write_dat.eq_ignore_ascii_case("E") || write_dat.eq_ignore_ascii_case("Y") {
            Some(license::runtime_dir().join("license.dat").to_string_lossy().to_string())
        } else {
            None
        };
        (h, c, b, d, out_p)
    } else {
        (arg_hwid.unwrap(), arg_customer, arg_beds.max(1), arg_days.max(1), arg_out)
    };

    match generate_key(&sk, &hwid, beds, days, &customer) {
        Ok((key, _issued, exp)) => {
            let exp_date = license::format_ts_tr(exp, false);
            let clean_hwid = hwid.trim().to_uppercase();
            let copied = copy_to_clipboard(&key);
            archive_record(&customer, &clean_hwid, beds, days, &exp_date, &key);

            if let Some(ref path_str) = save_dat_path {
                if let Err(e) = fs::write(path_str, format!("{}\n", key)) {
                    eprintln!("UYARI: {} dosyasina yazilamadi: {}", path_str, e);
                } else {
                    println!("Dosya Kaydedildi  : {}", path_str);
                }
            }

            println!();
            println!("==================== LISANS ANAHTARI URETILDI ====================");
            println!("Kurum     : {}", customer);
            println!("HWID      : {}", clean_hwid);
            println!("Kapasite  : {} yatak | Sure: {} gun (Bitis: {})", beds, days, exp_date);
            println!("Panoya Kopyalandi: {}", if copied { "EVET (Ctrl+V ile yapistirabilirsiniz)" } else { "HAYIR" });
            println!("------------------------------------------------------------------");
            println!("{}", key);
            println!("------------------------------------------------------------------");
            println!("Arsiv Log : uretilen_lisanslar.txt");
            println!("==================================================================");
        }
        Err(e) => {
            eprintln!("HATA: {}", e);
            if !no_pause && interactive {
                let _ = prompt(&mut reader, "Cikmak icin ENTER tusuna basin", "");
            }
            std::process::exit(1);
        }
    }

    if !no_pause && interactive {
        println!();
        let _ = prompt(&mut reader, "Cikmak icin ENTER tusuna basin", "");
    }
}
