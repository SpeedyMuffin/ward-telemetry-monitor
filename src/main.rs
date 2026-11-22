#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod admin;
mod config;
mod license;
mod models;
mod mqtt_client;
mod serial_com;
mod xml_client;

use models::{Bed, DeviceMapping, DrugRule, PatientInfo, Room, StateStore};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tiny_http::{Header, Method, Request, Response, Server, StatusCode};

const HTML_INDEX: &str = include_str!("../ui/index.html");
const CSS_STYLES: &str = include_str!("../ui/styles.css");
const JS_APP: &str = include_str!("../ui/app.js");

fn json_resp<T: Serialize>(data: &T, code: u16) -> Response<std::io::Cursor<Vec<u8>>> {
    let body = serde_json::to_vec(data).unwrap_or_else(|_| b"{}".to_vec());
    Response::from_data(body)
        .with_status_code(StatusCode(code))
        .with_header(Header::from_bytes("Content-Type", "application/json; charset=utf-8").unwrap())
}

fn text_resp(body: &str, ctype: &str, code: u16) -> Response<std::io::Cursor<Vec<u8>>> {
    Response::from_data(body.as_bytes().to_vec())
        .with_status_code(StatusCode(code))
        .with_header(Header::from_bytes("Content-Type", ctype).unwrap())
}

fn read_body(req: &mut Request) -> String {
    let mut s = String::new();
    let _ = req.as_reader().read_to_string(&mut s);
    s
}

fn url_decode(input: &str) -> String {
    let mut bytes = Vec::with_capacity(input.len());
    let raw = input.as_bytes();
    let mut i = 0;
    while i < raw.len() {
        if raw[i] == b'%' && i + 2 < raw.len() {
            if let Ok(hex_str) = std::str::from_utf8(&raw[i + 1..i + 3]) {
                if let Ok(b) = u8::from_str_radix(hex_str, 16) {
                    bytes.push(b);
                    i += 3;
                    continue;
                }
            }
        } else if raw[i] == b'+' {
            bytes.push(b' ');
            i += 1;
            continue;
        }
        bytes.push(raw[i]);
        i += 1;
    }
    String::from_utf8_lossy(&bytes).to_string()
}

#[derive(Deserialize)]
struct LicenseActivateReq {
    license_key: String,
}

#[derive(Deserialize)]
struct RoomCreateReq {
    name: String,
}

#[derive(Deserialize)]
struct BedCreateReq {
    room_id: i64,
    name: String,
}

#[derive(Deserialize)]
struct MappingReq {
    bed_name: String,
    source_type: String,
    address: String,
    #[serde(default)]
    model: String,
    #[serde(default)]
    label: String,
    #[serde(default)]
    drug_name: String,
    #[serde(default)]
    drug_concentration: String,
}

#[derive(Deserialize)]
struct DrugReq {
    id: Option<String>,
    name: String,
    #[serde(default)]
    default_conc: String,
    #[serde(default = "def_unit")]
    unit: String,
    soft_min: f64,
    soft_max: f64,
    hard_max: f64,
    #[serde(default)]
    category: String,
}

fn def_unit() -> String {
    "ml/h".into()
}

#[derive(Deserialize)]
struct PatientReq {
    name: String,
    #[serde(default)]
    protocol_no: String,
    age: Option<i64>,
    weight_kg: Option<f64>,
    #[serde(default)]
    note: String,
}

#[derive(Deserialize)]
struct AdminLoginReq {
    password: String,
}

#[derive(Deserialize)]
struct AdminPasswordReq {
    current_password: String,
    new_password: String,
}

#[derive(Deserialize)]
struct AdminSettingsReq {
    facility_name: String,
    #[serde(default)]
    department_name: String,
}

#[derive(Serialize)]
struct ErrorDetail {
    detail: String,
}

#[derive(Serialize)]
struct BedFluidSummary {
    bed_name: String,
    room_name: String,
    patient_name: String,
    pumps_count: usize,
    total_volume_ml: f64,
    active_rate_mlh: f64,
}

#[derive(Serialize)]
struct ReportsSummary {
    generated_at: String,
    active_pumps_count: usize,
    alarming_pumps_count: usize,
    near_end_count: usize,
    total_ward_volume_ml: f64,
    total_ward_rate_mlh: f64,
    ders_compliance_pct: f64,
    fluid_balance_by_bed: Vec<BedFluidSummary>,
    alarm_distribution: HashMap<String, usize>,
}

fn lock_state(state: &Arc<Mutex<StateStore>>) -> std::sync::MutexGuard<'_, StateStore> {
    state.lock().unwrap_or_else(|e| e.into_inner())
}

fn extract_admin_token(req: &Request) -> Option<String> {
    req.headers()
        .iter()
        .find(|h| h.field.equiv("X-Admin-Token"))
        .map(|h| h.value.as_str().trim().to_string())
        .filter(|s| !s.is_empty())
}

fn admin_unauth_resp() -> Response<std::io::Cursor<Vec<u8>>> {
    json_resp(
        &ErrorDetail { detail: "Bu işlem için yönetici girişi gereklidir.".into() },
        401,
    )
}

fn require_admin(req: &Request, state: &Arc<Mutex<StateStore>>) -> bool {
    let token = extract_admin_token(req);
    lock_state(state).admin.is_authenticated(token.as_deref())
}

fn handle_request(mut req: Request, state: &Arc<Mutex<StateStore>>) {
    let full_url = req.url().to_string();
    let (path, query) = match full_url.split_once('?') {
        Some((p, q)) => (p.to_string(), q.to_string()),
        None => (full_url, String::new()),
    };
    let method = req.method().clone();

    // 1. Static Embedded UI
    if method == Method::Get && path == "/" {
        let _ = req.respond(text_resp(HTML_INDEX, "text/html; charset=utf-8", 200));
        return;
    }
    if method == Method::Get && path == "/static/styles.css" {
        let _ = req.respond(text_resp(CSS_STYLES, "text/css; charset=utf-8", 200));
        return;
    }
    if method == Method::Get && path == "/static/app.js" {
        let _ = req.respond(text_resp(JS_APP, "application/javascript; charset=utf-8", 200));
        return;
    }

    // 2. State & License
    if method == Method::Get && path == "/api/state" {
        let snap = lock_state(state).get_full_snapshot();
        let _ = req.respond(json_resp(&snap, 200));
        return;
    }
    if method == Method::Get && path == "/api/license/status" {
        let lic = lock_state(state).refresh_license(false);
        let _ = req.respond(json_resp(&lic, 200));
        return;
    }
    if method == Method::Post && path == "/api/license/activate" {
        let body = read_body(&mut req);
        if let Ok(parsed) = serde_json::from_str::<LicenseActivateReq>(&body) {
            let st_res = license::activate_license_key(&parsed.license_key);
            let mut guard = lock_state(state);
            guard.license_status = st_res.clone();
            if st_res.valid {
                guard.log_event("SİSTEM", "LİSANS", "LICENSE_ACTIVATED", "INFO", &format!("Lisans aktive edildi: {}", st_res.customer), 0.0, 0.0);
            } else {
                guard.log_event("SİSTEM", "LİSANS", "LICENSE_FAILED", "HIGH", &format!("Geçersiz lisans denemesi: {}", st_res.reason), 0.0, 0.0);
            }
            let _ = req.respond(json_resp(&st_res, 200));
            return;
        }
        let _ = req.respond(json_resp(&ErrorDetail { detail: "Geçersiz JSON".into() }, 400));
        return;
    }

    // 2.5 Admin Auth & Facility Settings
    if method == Method::Get && path == "/api/admin/status" {
        let token = extract_admin_token(&req);
        let mut g = lock_state(state);
        let authenticated = g.admin.is_authenticated(token.as_deref());
        let _ = req.respond(json_resp(
            &serde_json::json!({
                "authenticated": authenticated,
                "using_default_password": g.admin.settings.using_default_password,
                "facility_name": g.admin.settings.facility_name,
                "department_name": g.admin.settings.department_name,
            }),
            200,
        ));
        return;
    }
    if method == Method::Post && path == "/api/admin/login" {
        let body = read_body(&mut req);
        if let Ok(parsed) = serde_json::from_str::<AdminLoginReq>(&body) {
            let mut g = lock_state(state);
            match g.admin.login(&parsed.password) {
                Ok(token) => {
                    g.log_event("SİSTEM", "ADMİN", "ADMIN_LOGIN", "INFO", "Yönetici oturumu açıldı.", 0.0, 0.0);
                    let _ = req.respond(json_resp(
                        &serde_json::json!({
                            "ok": true,
                            "token": token,
                            "using_default_password": g.admin.settings.using_default_password,
                            "facility_name": g.admin.settings.facility_name,
                            "department_name": g.admin.settings.department_name,
                        }),
                        200,
                    ));
                }
                Err(msg) => {
                    g.log_event("SİSTEM", "ADMİN", "ADMIN_LOGIN_FAIL", "HIGH", msg, 0.0, 0.0);
                    let code = if msg.contains("bekleyin") { 429 } else { 401 };
                    let _ = req.respond(json_resp(&ErrorDetail { detail: msg.into() }, code));
                }
            }
            return;
        }
        let _ = req.respond(json_resp(&ErrorDetail { detail: "Geçersiz JSON".into() }, 400));
        return;
    }
    if method == Method::Post && path == "/api/admin/logout" {
        let token = extract_admin_token(&req);
        let mut g = lock_state(state);
        if g.admin.is_authenticated(token.as_deref()) {
            g.admin.logout(token.as_deref());
            g.log_event("SİSTEM", "ADMİN", "ADMIN_LOGOUT", "INFO", "Yönetici oturumu kapatıldı.", 0.0, 0.0);
        }
        let _ = req.respond(json_resp(&serde_json::json!({"ok": true}), 200));
        return;
    }
    if method == Method::Post && path == "/api/admin/settings" {
        if !require_admin(&req, state) {
            let _ = req.respond(admin_unauth_resp());
            return;
        }
        let body = read_body(&mut req);
        if let Ok(parsed) = serde_json::from_str::<AdminSettingsReq>(&body) {
            let mut g = lock_state(state);
            match g.admin.update_facility(&parsed.facility_name, &parsed.department_name) {
                Ok(()) => {
                    let fac = g.admin.settings.facility_name.clone();
                    let dept = g.admin.settings.department_name.clone();
                    g.log_event(
                        "SİSTEM",
                        "ADMİN",
                        "ADMIN_SETTINGS_UPDATE",
                        "INFO",
                        &format!("Kurum ayarları güncellendi: {} / {}", fac, dept),
                        0.0,
                        0.0,
                    );
                    let _ = req.respond(json_resp(
                        &serde_json::json!({
                            "ok": true,
                            "facility_name": fac,
                            "department_name": dept,
                        }),
                        200,
                    ));
                }
                Err(msg) => {
                    let _ = req.respond(json_resp(&ErrorDetail { detail: msg.into() }, 400));
                }
            }
            return;
        }
        let _ = req.respond(json_resp(&ErrorDetail { detail: "Geçersiz JSON".into() }, 400));
        return;
    }
    if method == Method::Post && path == "/api/admin/password" {
        if !require_admin(&req, state) {
            let _ = req.respond(admin_unauth_resp());
            return;
        }
        let body = read_body(&mut req);
        if let Ok(parsed) = serde_json::from_str::<AdminPasswordReq>(&body) {
            let mut g = lock_state(state);
            match g.admin.change_password(&parsed.current_password, &parsed.new_password) {
                Ok(new_token) => {
                    g.log_event("SİSTEM", "ADMİN", "ADMIN_PASSWORD_CHANGED", "INFO", "Yönetici şifresi değiştirildi.", 0.0, 0.0);
                    let _ = req.respond(json_resp(&serde_json::json!({"ok": true, "token": new_token}), 200));
                }
                Err(msg) => {
                    let _ = req.respond(json_resp(&ErrorDetail { detail: msg.into() }, 400));
                }
            }
            return;
        }
        let _ = req.respond(json_resp(&ErrorDetail { detail: "Geçersiz JSON".into() }, 400));
        return;
    }

    // 3. Rooms & Beds Management (Admin protected)
    if method == Method::Post && path == "/api/rooms" {
        if !require_admin(&req, state) {
            let _ = req.respond(admin_unauth_resp());
            return;
        }
        let body = read_body(&mut req);
        if let Ok(parsed) = serde_json::from_str::<RoomCreateReq>(&body) {
            let mut g = lock_state(state);
            if !g.license_status.valid {
                let _ = req.respond(json_resp(&ErrorDetail { detail: "Lisans geçersiz.".into() }, 403));
                return;
            }
            g.structure.next_id += 1;
            let rid = g.structure.next_id;
            let r = Room { id: rid, name: parsed.name.trim().to_string(), bed_ids: Vec::new() };
            g.structure.rooms.push(r.clone());
            g.save_structure();
            g.log_event("SERVİS", "-", "ROOM_ADD", "INFO", &format!("Yeni servis eklendi: {}", r.name), 0.0, 0.0);
            let _ = req.respond(json_resp(&r, 200));
            return;
        }
    }
    if method == Method::Delete && path.starts_with("/api/rooms/") {
        if !require_admin(&req, state) {
            let _ = req.respond(admin_unauth_resp());
            return;
        }
        if let Ok(rid) = path["/api/rooms/".len()..].parse::<i64>() {
            let mut g = lock_state(state);
            let removed_beds: Vec<String> = g.structure.beds.iter().filter(|b| b.room_id == rid).map(|b| b.name.clone()).collect();
            g.structure.rooms.retain(|r| r.id != rid);
            g.structure.beds.retain(|b| b.room_id != rid);
            g.mappings.retain(|m| !removed_beds.contains(&m.bed_name));
            g.pumps.retain(|_, p| !removed_beds.contains(&p.bed_name));
            g.save_structure();
            g.save_mappings();
            let _ = req.respond(json_resp(&serde_json::json!({"status": "ok"}), 200));
            return;
        }
    }
    if method == Method::Post && path == "/api/beds" {
        if !require_admin(&req, state) {
            let _ = req.respond(admin_unauth_resp());
            return;
        }
        let body = read_body(&mut req);
        if let Ok(parsed) = serde_json::from_str::<BedCreateReq>(&body) {
            let mut g = lock_state(state);
            if !g.license_status.valid {
                let _ = req.respond(json_resp(&ErrorDetail { detail: "Lisans geçersiz.".into() }, 403));
                return;
            }
            if g.structure.beds.len() as i64 >= g.license_status.max_beds {
                let _ = req.respond(json_resp(&ErrorDetail { detail: format!("Lisans yatak limiti ({}) dolmuştur.", g.license_status.max_beds) }, 403));
                return;
            }
            let bname = parsed.name.trim().to_string();
            if g.structure.beds.iter().any(|b| b.name.eq_ignore_ascii_case(&bname)) {
                let _ = req.respond(json_resp(&ErrorDetail { detail: "Bu yatak adı zaten mevcut.".into() }, 400));
                return;
            }
            let room_name = g.structure.rooms.iter().find(|r| r.id == parsed.room_id).map(|r| r.name.clone()).unwrap_or_else(|| "Servis".into());
            g.structure.next_id += 1;
            let bid = g.structure.next_id;
            let idx = g.structure.beds.len() as i64;
            let new_bed = Bed {
                id: bid,
                name: bname.clone(),
                room_id: parsed.room_id,
                room_name,
                pos_x: Some((idx % 4) * 230 + 30),
                pos_y: Some((idx / 4) * 140 + 30),
                patient: None,
            };
            g.structure.beds.push(new_bed.clone());
            if let Some(rm) = g.structure.rooms.iter_mut().find(|r| r.id == parsed.room_id) {
                rm.bed_ids.push(bid);
            }
            g.save_structure();
            g.log_event(&bname, "-", "BED_ADD", "INFO", &format!("Yatak tanımlandı: {}", bname), 0.0, 0.0);
            let _ = req.respond(json_resp(&new_bed, 200));
            return;
        }
    }

    // Bed-specific actions: DELETE /api/beds/{name} (admin), POST /api/beds/{name}/patient, POST /api/beds/{name}/reset_volume
    if path.starts_with("/api/beds/") {
        let rest = &path["/api/beds/".len()..];
        if method == Method::Delete && !rest.contains('/') {
            if !require_admin(&req, state) {
                let _ = req.respond(admin_unauth_resp());
                return;
            }
            let bname = url_decode(rest);
            let mut g = lock_state(state);
            g.structure.beds.retain(|b| b.name != bname);
            g.mappings.retain(|m| m.bed_name != bname);
            g.pumps.retain(|_, p| p.bed_name != bname);
            g.save_structure();
            g.save_mappings();
            let _ = req.respond(json_resp(&serde_json::json!({"status": "ok"}), 200));
            return;
        }
        if method == Method::Post && rest.ends_with("/patient") {
            let bname = url_decode(&rest[..rest.len() - "/patient".len()]);
            let body = read_body(&mut req);
            if let Ok(preq) = serde_json::from_str::<PatientReq>(&body) {
                let pat = PatientInfo {
                    name: preq.name.trim().to_string(),
                    protocol_no: preq.protocol_no.trim().to_string(),
                    age: preq.age,
                    weight_kg: preq.weight_kg,
                    note: preq.note.trim().to_string(),
                };
                let mut g = lock_state(state);
                g.patients_by_bed.insert(bname.clone(), pat.clone());
                for b in &mut g.structure.beds {
                    if b.name == bname {
                        b.patient = Some(pat.clone());
                    }
                }
                g.save_patients();
                g.save_structure();
                g.log_event(&bname, "-", "PATIENT_UPDATE", "INFO", &format!("Hasta kaydedildi: {}", pat.name), 0.0, 0.0);
                let _ = req.respond(json_resp(&serde_json::json!({"status": "ok"}), 200));
                return;
            }
        }
        if method == Method::Post && rest.ends_with("/reset_volume") {
            let bname = url_decode(&rest[..rest.len() - "/reset_volume".len()]);
            let mut g = lock_state(state);
            let updates: Vec<(String, f64)> = g.pumps.values().filter(|p| p.bed_name == bname).map(|p| (p.id.clone(), p.volume_infused)).collect();
            let cnt = updates.len();
            for (pid, v) in updates {
                g.volume_offsets.insert(pid, v);
            }
            g.log_event(&bname, "SAYAÇ", "VOLUME_RESET", "INFO", &format!("24s sıvı sayacı sıfırlandı ({} kanal)", cnt), 0.0, 0.0);
            let _ = req.respond(json_resp(&serde_json::json!({"status": "ok"}), 200));
            return;
        }
    }

    // 4. Mappings (writes require Admin)
    if method == Method::Get && path == "/api/mappings" {
        let g = lock_state(state);
        let _ = req.respond(json_resp(&g.mappings, 200));
        return;
    }
    if method == Method::Post && path == "/api/mappings" {
        if !require_admin(&req, state) {
            let _ = req.respond(admin_unauth_resp());
            return;
        }
        let body = read_body(&mut req);
        if let Ok(mreq) = serde_json::from_str::<MappingReq>(&body) {
            let mut g = lock_state(state);
            if !g.license_status.valid {
                let _ = req.respond(json_resp(&ErrorDetail { detail: "Lisans geçersiz.".into() }, 403));
                return;
            }
            let max_beds = g.license_status.max_beds;
            let others: Vec<DeviceMapping> = g.mappings.iter().filter(|m| m.bed_name != mreq.bed_name).cloned().collect();
            if others.len() as i64 >= max_beds {
                let _ = req.respond(json_resp(&ErrorDetail { detail: format!("Lisans yatak limiti ({}) dolmuştur.", max_beds) }, 403));
                return;
            }
            let new_map = DeviceMapping {
                id: format!("map-{}", mreq.bed_name),
                bed_name: mreq.bed_name.clone(),
                source_type: mreq.source_type.clone(),
                address: mreq.address.trim().to_string(),
                model: mreq.model.clone(),
                label: if mreq.label.trim().is_empty() { format!("{} ({})", mreq.address.trim(), mreq.source_type) } else { mreq.label.trim().to_string() },
                drug_name: mreq.drug_name.trim().to_string(),
                drug_concentration: mreq.drug_concentration.trim().to_string(),
                created_at: license::now_unix(),
                last_seen: 0,
                is_online: false,
            };
            g.mappings = others;
            g.mappings.push(new_map.clone());
            g.save_mappings();
            g.log_event(&mreq.bed_name, &new_map.address, "DEVICE_BIND", "INFO", &format!("Bağlantı tanımlandı [{}]: {}", new_map.source_type, new_map.address), 0.0, 0.0);
            let _ = req.respond(json_resp(&serde_json::json!({"status": "ok", "mapping": new_map}), 200));
            return;
        }
    }
    if method == Method::Delete && path.starts_with("/api/mappings/") {
        if !require_admin(&req, state) {
            let _ = req.respond(admin_unauth_resp());
            return;
        }
        let bname = url_decode(&path["/api/mappings/".len()..]);
        let mut g = lock_state(state);
        g.mappings.retain(|m| m.bed_name != bname);
        g.pumps.retain(|_, p| p.bed_name != bname);
        g.save_mappings();
        g.log_event(&bname, "-", "DEVICE_UNBIND", "INFO", "Cihaz eşleştirmesi kaldırıldı.", 0.0, 0.0);
        let _ = req.respond(json_resp(&serde_json::json!({"status": "ok"}), 200));
        return;
    }

    // 5. Drugs (writes require Admin)
    if method == Method::Get && path == "/api/drugs" {
        let g = lock_state(state);
        let _ = req.respond(json_resp(&g.drug_library, 200));
        return;
    }
    if method == Method::Post && path == "/api/drugs" {
        if !require_admin(&req, state) {
            let _ = req.respond(admin_unauth_resp());
            return;
        }
        let body = read_body(&mut req);
        if let Ok(dreq) = serde_json::from_str::<DrugReq>(&body) {
            let mut g = lock_state(state);
            let did = dreq.id.unwrap_or_else(|| dreq.name.to_lowercase().replace(' ', "_"));
            g.drug_library.retain(|d| d.id != did);
            let rule = DrugRule {
                id: did,
                name: dreq.name.trim().to_string(),
                default_conc: dreq.default_conc.trim().to_string(),
                unit: dreq.unit,
                soft_min: dreq.soft_min,
                soft_max: dreq.soft_max,
                hard_max: dreq.hard_max,
                category: dreq.category,
            };
            g.drug_library.push(rule.clone());
            g.save_drugs();
            g.log_event("DERS", &rule.id, "DRUG_ADD", "INFO", &format!("İlaç kuralı eklendi: {} (Hard Max: {})", rule.name, rule.hard_max), 0.0, 0.0);
            let _ = req.respond(json_resp(&serde_json::json!({"status": "ok", "drug": rule}), 200));
            return;
        }
    }
    if method == Method::Delete && path.starts_with("/api/drugs/") {
        if !require_admin(&req, state) {
            let _ = req.respond(admin_unauth_resp());
            return;
        }
        let did = url_decode(&path["/api/drugs/".len()..]);
        let mut g = lock_state(state);
        g.drug_library.retain(|d| d.id != did);
        g.save_drugs();
        let _ = req.respond(json_resp(&serde_json::json!({"status": "ok"}), 200));
        return;
    }

    // 6. History & CSV
    if method == Method::Get && path == "/api/history" {
        let sev_filter = query
            .split('&')
            .find_map(|kv| kv.strip_prefix("severity="))
            .unwrap_or("ALL");
        let g = lock_state(state);
        let filtered: Vec<_> = g
            .event_logs
            .iter()
            .filter(|l| sev_filter == "ALL" || l.severity == sev_filter)
            .take(150)
            .cloned()
            .collect();
        let _ = req.respond(json_resp(&filtered, 200));
        return;
    }
    if method == Method::Get && path == "/api/history/export_csv" {
        let g = lock_state(state);
        let mut csv_bytes: Vec<u8> = vec![0xEF, 0xBB, 0xBF];
        csv_bytes.extend_from_slice("Tarih/Saat;Yatak;Cihaz/Port;Olay;Seviye;Aciklama;Hiz;Hacim\r\n".as_bytes());
        for ev in &g.event_logs {
            let line = format!(
                "{};{};{};{};{};{};{:.2};{:.2}\r\n",
                ev.time_str, ev.bed_name, ev.pump_serial, ev.event_type, ev.severity, ev.description.replace(';', ","), ev.rate, ev.volume
            );
            csv_bytes.extend_from_slice(line.as_bytes());
        }
        let resp = Response::from_data(csv_bytes)
            .with_status_code(StatusCode(200))
            .with_header(Header::from_bytes("Content-Type", "text/csv; charset=utf-8").unwrap())
            .with_header(Header::from_bytes("Content-Disposition", "attachment; filename=merkezi_izlem_kayitlari.csv").unwrap());
        let _ = req.respond(resp);
        return;
    }

    // 7. Reports Summary
    if method == Method::Get && path == "/api/reports/summary" {
        let snap = lock_state(state).get_full_snapshot();
        let mut all_pumps = Vec::new();
        let mut fluid_by_bed = Vec::new();
        let mut alarm_dist: HashMap<String, usize> = HashMap::new();
        alarm_dist.insert("Oklüzyon / Tıkanma".into(), 0);
        alarm_dist.insert("Hava Kabarcığı".into(), 0);
        alarm_dist.insert("Bitmeye Yakın".into(), 0);
        alarm_dist.insert("DERS Doz Uyarısı".into(), 0);
        alarm_dist.insert("Diğer Alarmlar".into(), 0);

        for b in &snap.beds {
            let pat_name = b.patient.as_ref().map(|p| p.name.clone()).unwrap_or_else(|| format!("Yatak {}", b.name));
            fluid_by_bed.push(BedFluidSummary {
                bed_name: b.name.clone(),
                room_name: b.room_name.clone(),
                patient_name: pat_name,
                pumps_count: b.pumps.len(),
                total_volume_ml: b.total_volume_ml,
                active_rate_mlh: b.total_rate_mlh,
            });
            for p in &b.pumps {
                all_pumps.push(p.clone());
            }
        }

        let mut ders_ok = 0usize;
        let mut near_end_cnt = 0usize;
        let mut alarming_cnt = 0usize;
        for p in &all_pumps {
            if p.ders_warning.is_some() {
                *alarm_dist.entry("DERS Doz Uyarısı".into()).or_default() += 1;
            } else {
                ders_ok += 1;
            }
            if p.near_end {
                near_end_cnt += 1;
                *alarm_dist.entry("Bitmeye Yakın".into()).or_default() += 1;
            }
            if let Some(ref al) = p.alarm {
                alarming_cnt += 1;
                let up = al.text.to_uppercase();
                if up.contains("OCCLUSION") || up.contains("TIKAN") {
                    *alarm_dist.entry("Oklüzyon / Tıkanma".into()).or_default() += 1;
                } else if up.contains("AIR") || up.contains("HAVA") {
                    *alarm_dist.entry("Hava Kabarcığı".into()).or_default() += 1;
                } else {
                    *alarm_dist.entry("Diğer Alarmlar".into()).or_default() += 1;
                }
            }
        }
        let ders_pct = if all_pumps.is_empty() { 100.0 } else { ((ders_ok as f64 / all_pumps.len() as f64) * 1000.0).round() / 10.0 };
        let summary = ReportsSummary {
            generated_at: license::format_ts_tr(license::now_unix(), true),
            active_pumps_count: all_pumps.len(),
            alarming_pumps_count: alarming_cnt,
            near_end_count: near_end_cnt,
            total_ward_volume_ml: (fluid_by_bed.iter().map(|x| x.total_volume_ml).sum::<f64>() * 100.0).round() / 100.0,
            total_ward_rate_mlh: (fluid_by_bed.iter().map(|x| x.active_rate_mlh).sum::<f64>() * 100.0).round() / 100.0,
            ders_compliance_pct: ders_pct,
            fluid_balance_by_bed: fluid_by_bed,
            alarm_distribution: alarm_dist,
        };
        let _ = req.respond(json_resp(&summary, 200));
        return;
    }

    let _ = req.respond(text_resp("Bulunamadi", "text/plain", 404));
}

fn open_desktop_window(port: u16) {
    use std::os::windows::process::CommandExt;
    const CREATE_NO_WINDOW: u32 = 0x08000000;

    let url = format!("http://127.0.0.1:{}/", port);
    let edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ];
    for ep in &edge_paths {
        if std::path::Path::new(ep).exists() {
            let _ = std::process::Command::new(ep)
                .arg(format!("--app={}", url))
                .arg("--window-size=1400,880")
                .spawn();
            return;
        }
    }
    let _ = std::process::Command::new("cmd")
        .args(["/C", "start", "", &url])
        .creation_flags(CREATE_NO_WINDOW)
        .spawn();
}

fn main() {
    let cfg = config::AppConfig::load();
    let args: Vec<String> = std::env::args().collect();
    let mut port: u16 = cfg.http_port;
    let mut headless = false;

    let mut i = 1;
    while i < args.len() {
        match args[i].as_str() {
            "--headless" => headless = true,
            "--port" if i + 1 < args.len() => {
                if let Ok(p) = args[i + 1].parse::<u16>() {
                    port = p;
                }
                i += 1;
            }
            _ => {}
        }
        i += 1;
    }

    // Bind HTTP port first before spawning any COM/MQTT/XML workers.
    // If an instance is already running in the background, just reopen the UI window cleanly.
    let addr = format!("{}:{}", cfg.bind_host, port);
    let server = match Server::http(&addr) {
        Ok(s) => Arc::new(s),
        Err(_) => {
            if !headless {
                open_desktop_window(port);
                std::thread::sleep(std::time::Duration::from_millis(200));
            }
            std::process::exit(0);
        }
    };

    let state = Arc::new(Mutex::new(StateStore::new()));
    mqtt_client::spawn_mqtt_worker(Arc::clone(&state), cfg.clone());
    xml_client::spawn_xml_worker(Arc::clone(&state), cfg.clone());
    if cfg.enable_serial_com {
        serial_com::spawn_direct_com_worker(Arc::clone(&state));
    }

    if !headless {
        let p = port;
        std::thread::spawn(move || {
            std::thread::sleep(std::time::Duration::from_millis(600));
            open_desktop_window(p);
        });
    }

    // Worker pool
    for _ in 0..4 {
        let srv = Arc::clone(&server);
        let st = Arc::clone(&state);
        std::thread::spawn(move || {
            for req in srv.incoming_requests() {
                handle_request(req, &st);
            }
        });
    }

    loop {
        std::thread::sleep(std::time::Duration::from_secs(60));
    }
}
