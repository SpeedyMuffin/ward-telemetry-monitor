use crate::license::{self, LicenseStatus};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Room {
    pub id: i64,
    pub name: String,
    pub bed_ids: Vec<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatientInfo {
    pub name: String,
    pub protocol_no: String,
    pub age: Option<i64>,
    pub weight_kg: Option<f64>,
    pub note: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Bed {
    pub id: i64,
    pub name: String,
    pub room_id: i64,
    pub room_name: String,
    #[serde(rename = "posX")]
    pub pos_x: Option<i64>,
    #[serde(rename = "posY")]
    pub pos_y: Option<i64>,
    pub patient: Option<PatientInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeviceMapping {
    pub id: String,
    pub bed_name: String,
    pub source_type: String, // PI_IP, DIRECT_COM, DOCK_IP, PUMP_SN
    pub address: String,
    pub model: String,
    pub label: String,
    pub drug_name: String,
    pub drug_concentration: String,
    pub created_at: i64,
    pub last_seen: i64,
    pub is_online: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AlarmInfo {
    pub code: String,
    pub text: String,
    pub level: String,
    pub time: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DersWarning {
    pub level: String,
    pub limit: f64,
    pub message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PumpState {
    pub id: String,
    pub bed_name: String,
    pub source_type: String,
    pub source_address: String,
    pub model: String,
    pub serial: String,
    pub slot: i32,
    pub mode: String,
    pub status: String,
    pub rate: f64,
    pub rate_unit: String,
    pub volume_infused: f64,
    pub vtbi: f64,
    pub time_remaining_sec: i64,
    pub drug_name: String,
    pub drug_concentration: String,
    pub pressure_level: i32,
    pub battery: i32,
    pub ac_power: bool,
    pub alarm: Option<AlarmInfo>,
    pub ders_warning: Option<DersWarning>,
    pub near_end: bool,
    pub near_end_min: i64,
    #[serde(default)]
    pub last_updated: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DrugRule {
    pub id: String,
    pub name: String,
    pub default_conc: String,
    pub unit: String,
    pub soft_min: f64,
    pub soft_max: f64,
    pub hard_max: f64,
    pub category: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventLog {
    pub id: String,
    pub ts: i64,
    pub time_str: String,
    pub bed_name: String,
    pub pump_serial: String,
    pub event_type: String,
    pub severity: String,
    pub description: String,
    pub rate: f64,
    pub volume: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiscoveredPi {
    pub ip: String,
    pub last_seen: i64,
    pub topic: String,
    pub device_type: String,
    pub device_label: String,
    pub last_payload: String,
    #[serde(default)]
    pub is_active: bool,
    #[serde(default)]
    pub mapped_bed: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct WardStructureFile {
    pub rooms: Vec<Room>,
    pub beds: Vec<Bed>,
    pub next_id: i64,
}

#[derive(Debug, Clone, Serialize)]
pub struct BedSnapshot {
    pub id: i64,
    pub name: String,
    pub room_id: i64,
    pub room_name: String,
    #[serde(rename = "posX")]
    pub pos_x: Option<i64>,
    #[serde(rename = "posY")]
    pub pos_y: Option<i64>,
    pub patient: Option<PatientInfo>,
    pub pumps: Vec<PumpState>,
    pub total_volume_ml: f64,
    pub total_rate_mlh: f64,
    pub mapping: Option<DeviceMapping>,
    pub alarms: Vec<AlarmInfo>,
}

#[derive(Debug, Clone, Serialize)]
pub struct FullSnapshot {
    pub server_time: String,
    pub facility_name: String,
    pub department_name: String,
    pub connected_to_xml: bool,
    pub connected_to_mqtt: bool,
    pub license: LicenseStatus,
    pub rooms: Vec<Room>,
    pub beds: Vec<BedSnapshot>,
    pub mappings: Vec<DeviceMapping>,
    pub discovered_pis: Vec<DiscoveredPi>,
    pub drug_library: Vec<DrugRule>,
    pub pumps_count: usize,
    pub alarms_count: usize,
    pub active_alarms: Vec<AlarmInfo>,
}

pub fn default_drug_library() -> Vec<DrugRule> {
    vec![
        DrugRule { id: "propofol".into(), name: "Propofol 1%".into(), default_conc: "10 mg/ml".into(), unit: "ml/h".into(), soft_min: 5.0, soft_max: 60.0, hard_max: 120.0, category: "Sedasyon".into() },
        DrugRule { id: "noradrenalin".into(), name: "Noradrenalin".into(), default_conc: "4 mg / 50 ml".into(), unit: "ml/h".into(), soft_min: 0.5, soft_max: 25.0, hard_max: 60.0, category: "Vazopressör".into() },
        DrugRule { id: "dopamin".into(), name: "Dopamin".into(), default_conc: "400 mg / 250 ml".into(), unit: "ml/h".into(), soft_min: 2.0, soft_max: 45.0, hard_max: 90.0, category: "İnotrop".into() },
        DrugRule { id: "dobutamin".into(), name: "Dobutamin".into(), default_conc: "250 mg / 50 ml".into(), unit: "ml/h".into(), soft_min: 1.0, soft_max: 40.0, hard_max: 80.0, category: "İnotrop".into() },
        DrugRule { id: "fentanyl".into(), name: "Fentanyl".into(), default_conc: "50 mcg/ml".into(), unit: "ml/h".into(), soft_min: 0.5, soft_max: 10.0, hard_max: 25.0, category: "Analjezik / PCA".into() },
        DrugRule { id: "midazolam".into(), name: "Midazolam".into(), default_conc: "50 mg / 50 ml".into(), unit: "ml/h".into(), soft_min: 1.0, soft_max: 15.0, hard_max: 30.0, category: "Sedasyon".into() },
        DrugRule { id: "remifentanil".into(), name: "Remifentanil".into(), default_conc: "2 mg / 40 ml".into(), unit: "ml/h".into(), soft_min: 0.5, soft_max: 20.0, hard_max: 40.0, category: "Analjezik".into() },
        DrugRule { id: "insulin".into(), name: "İnsülin Regular".into(), default_conc: "50 IU / 50 ml".into(), unit: "ml/h".into(), soft_min: 0.5, soft_max: 12.0, hard_max: 25.0, category: "Endokrin".into() },
        DrugRule { id: "heparin".into(), name: "Heparin".into(), default_conc: "25000 IU / 50 ml".into(), unit: "ml/h".into(), soft_min: 1.0, soft_max: 8.0, hard_max: 15.0, category: "Antikoagülan".into() },
        DrugRule { id: "amiodaron".into(), name: "Amiodaron".into(), default_conc: "900 mg / 50 ml".into(), unit: "ml/h".into(), soft_min: 1.0, soft_max: 10.0, hard_max: 20.0, category: "Antiaritmik".into() },
        DrugRule { id: "nitrogliserin".into(), name: "Nitrogliserin".into(), default_conc: "25 mg / 50 ml".into(), unit: "ml/h".into(), soft_min: 0.5, soft_max: 18.0, hard_max: 35.0, category: "Vazodilatör".into() },
        DrugRule { id: "izotonik".into(), name: "İzotonik NaCl %0.9".into(), default_conc: "500 ml".into(), unit: "ml/h".into(), soft_min: 10.0, soft_max: 250.0, hard_max: 1000.0, category: "Sıvı Replasmanı".into() },
    ]
}

pub struct StateStore {
    pub connected_to_xml: bool,
    pub connected_to_mqtt: bool,
    pub admin: crate::admin::AdminState,
    pub structure: WardStructureFile,
    pub pumps: HashMap<String, PumpState>,
    pub mappings: Vec<DeviceMapping>,
    pub discovered_pis: HashMap<String, DiscoveredPi>,
    pub drug_library: Vec<DrugRule>,
    pub event_logs: Vec<EventLog>,
    pub patients_by_bed: HashMap<String, PatientInfo>,
    pub volume_offsets: HashMap<String, f64>,
    pub last_alarm_states: HashMap<String, String>,
    pub license_status: LicenseStatus,
    pub last_license_tick: i64,
    pub event_seq: u64,
}

fn data_file(name: &str) -> PathBuf {
    license::runtime_dir().join(name)
}

fn load_json_or<T: for<'de> Deserialize<'de>>(name: &str, default_val: T) -> T {
    let p = data_file(name);
    if let Ok(s) = fs::read_to_string(&p) {
        if let Ok(v) = serde_json::from_str::<T>(&s) {
            return v;
        }
    }
    default_val
}

fn save_json<T: Serialize>(name: &str, val: &T) {
    if let Ok(s) = serde_json::to_string_pretty(val) {
        let _ = fs::write(data_file(name), s);
    }
}

impl StateStore {
    pub fn new() -> Self {
        let mut structure: WardStructureFile = load_json_or(
            "structure.json",
            WardStructureFile { rooms: Vec::new(), beds: Vec::new(), next_id: 1 },
        );
        if structure.next_id < 1 {
            structure.next_id = 1;
        }
        let mappings: Vec<DeviceMapping> = load_json_or("mappings.json", Vec::new());
        let mut drug_library: Vec<DrugRule> = load_json_or("drug_library.json", Vec::new());
        if drug_library.is_empty() {
            drug_library = default_drug_library();
            save_json("drug_library.json", &drug_library);
        }
        let event_logs: Vec<EventLog> = load_json_or("event_history.json", Vec::new());
        let patients_by_bed: HashMap<String, PatientInfo> = load_json_or("patients.json", HashMap::new());
        for b in &mut structure.beds {
            if let Some(pat) = patients_by_bed.get(&b.name) {
                b.patient = Some(pat.clone());
            }
        }
        let license_status = license::get_license_status(true);
        let admin = crate::admin::AdminState::load_or_init();

        let mut s = Self {
            connected_to_xml: false,
            connected_to_mqtt: false,
            admin,
            structure,
            pumps: HashMap::new(),
            mappings,
            discovered_pis: HashMap::new(),
            drug_library,
            event_logs,
            patients_by_bed,
            volume_offsets: HashMap::new(),
            last_alarm_states: HashMap::new(),
            license_status,
            last_license_tick: license::now_unix(),
            event_seq: 1,
        };
        s.log_event("SİSTEM", "ÇEKİRDEK", "SYSTEM_START", "INFO", "Merkezi İzlem sistemi başlatıldı.", 0.0, 0.0);
        s
    }

    pub fn save_structure(&self) {
        save_json("structure.json", &self.structure);
    }

    pub fn save_mappings(&self) {
        save_json("mappings.json", &self.mappings);
    }

    pub fn save_drugs(&self) {
        save_json("drug_library.json", &self.drug_library);
    }

    pub fn save_patients(&self) {
        save_json("patients.json", &self.patients_by_bed);
    }

    pub fn save_history(&self) {
        save_json("event_history.json", &self.event_logs);
    }

    pub fn log_event(&mut self, bed_name: &str, pump_serial: &str, event_type: &str, severity: &str, description: &str, rate: f64, volume: f64) {
        let now = license::now_unix();
        self.event_seq += 1;
        let entry = EventLog {
            id: format!("EV{:08}", self.event_seq),
            ts: now,
            time_str: license::format_ts_tr(now, true),
            bed_name: bed_name.to_string(),
            pump_serial: pump_serial.to_string(),
            event_type: event_type.to_string(),
            severity: severity.to_string(),
            description: description.to_string(),
            rate: (rate * 100.0).round() / 100.0,
            volume: (volume * 100.0).round() / 100.0,
        };
        self.event_logs.insert(0, entry);
        if self.event_logs.len() > 500 {
            self.event_logs.truncate(500);
        }
        self.save_history();
    }

    pub fn refresh_license(&mut self, update_tick: bool) -> LicenseStatus {
        self.license_status = license::get_license_status(update_tick);
        self.license_status.clone()
    }

    fn match_drug(&self, drug_name: &str) -> Option<&DrugRule> {
        let d_lower = drug_name.trim().to_lowercase();
        if d_lower.is_empty() {
            return None;
        }
        for item in &self.drug_library {
            let iname = item.name.to_lowercase();
            let first = iname.split_whitespace().next().unwrap_or("");
            if iname.contains(&d_lower) || d_lower.contains(&iname) || (!first.is_empty() && d_lower.contains(first)) {
                return Some(item);
            }
        }
        None
    }

    fn enrich_pump(&self, pump: &PumpState, now: i64) -> PumpState {
        let mut p = pump.clone();
        let offset = *self.volume_offsets.get(&p.id).unwrap_or(&0.0);
        p.volume_infused = ((p.volume_infused - offset).max(0.0) * 100.0).round() / 100.0;

        if p.last_updated > 0 && (now - p.last_updated) >= 30 {
            p.status = "OFFLINE".into();
            p.rate = 0.0;
            p.near_end = false;
            p.near_end_min = 0;
            p.ders_warning = None;
            return p;
        }

        p.ders_warning = None;
        if let Some(rule) = self.match_drug(&p.drug_name) {
            if p.rate > 0.0 {
                if p.rate > rule.hard_max {
                    p.ders_warning = Some(DersWarning {
                        level: "HARD".into(),
                        limit: rule.hard_max,
                        message: format!("KRİTİK DOZ AŞIMI ({:.1} > {} {})", p.rate, rule.hard_max, rule.unit),
                    });
                } else if p.rate > rule.soft_max {
                    p.ders_warning = Some(DersWarning {
                        level: "SOFT".into(),
                        limit: rule.soft_max,
                        message: format!("Yüksek Doz Uyarısı ({:.1} > {} {})", p.rate, rule.soft_max, rule.unit),
                    });
                } else if p.rate < rule.soft_min {
                    p.ders_warning = Some(DersWarning {
                        level: "SOFT".into(),
                        limit: rule.soft_min,
                        message: format!("Düşük Hız Uyarısı ({:.1} < {} {})", p.rate, rule.soft_min, rule.unit),
                    });
                }
            }
        }

        if (p.status == "INFUSING" || p.status == "RUNNING") && p.time_remaining_sec > 0 && p.time_remaining_sec <= 900 {
            p.near_end = true;
            p.near_end_min = (p.time_remaining_sec / 60).max(1);
        } else {
            p.near_end = false;
            p.near_end_min = 0;
        }
        p
    }

    pub fn get_full_snapshot(&mut self) -> FullSnapshot {
        let now = license::now_unix();
        if now - self.last_license_tick > 60 {
            self.refresh_license(true);
            self.last_license_tick = now;
        }

        for m in &mut self.mappings {
            m.is_online = m.last_seen > 0 && (now - m.last_seen) < 30;
        }

        let time_str = license::format_ts_tr(now, true)
            .split(' ')
            .nth(1)
            .unwrap_or("--:--:--")
            .to_string();

        if !self.license_status.valid {
            return FullSnapshot {
                server_time: time_str,
                facility_name: self.admin.settings.facility_name.clone(),
                department_name: self.admin.settings.department_name.clone(),
                connected_to_xml: self.connected_to_xml,
                connected_to_mqtt: self.connected_to_mqtt,
                license: self.license_status.clone(),
                rooms: Vec::new(),
                beds: Vec::new(),
                mappings: Vec::new(),
                discovered_pis: Vec::new(),
                drug_library: Vec::new(),
                pumps_count: 0,
                alarms_count: 0,
                active_alarms: Vec::new(),
            };
        }

        self.pumps.retain(|_, p| p.last_updated == 0 || (now - p.last_updated) < 300);
        let pumps_enriched: Vec<PumpState> = self.pumps.values().map(|p| self.enrich_pump(p, now)).collect();
        let mut beds_out = Vec::new();
        for b in &self.structure.beds {
            let bed_pumps: Vec<PumpState> = pumps_enriched.iter().filter(|p| p.bed_name == b.name).cloned().collect();
            let total_vol: f64 = bed_pumps.iter().map(|p| p.volume_infused).sum();
            let total_rate: f64 = bed_pumps
                .iter()
                .filter(|p| p.status == "INFUSING" || p.status == "RUNNING")
                .map(|p| p.rate)
                .sum();
            let mapping = self.mappings.iter().find(|m| m.bed_name == b.name).cloned();
            let alarms: Vec<AlarmInfo> = bed_pumps.iter().filter_map(|p| p.alarm.clone()).collect();
            let pat = self.patients_by_bed.get(&b.name).cloned().or_else(|| b.patient.clone());

            beds_out.push(BedSnapshot {
                id: b.id,
                name: b.name.clone(),
                room_id: b.room_id,
                room_name: b.room_name.clone(),
                pos_x: b.pos_x,
                pos_y: b.pos_y,
                patient: pat,
                pumps: bed_pumps,
                total_volume_ml: (total_vol * 10.0).round() / 10.0,
                total_rate_mlh: (total_rate * 10.0).round() / 10.0,
                mapping,
                alarms,
            });
        }

        let all_alarms: Vec<AlarmInfo> = pumps_enriched.iter().filter_map(|p| p.alarm.clone()).collect();
        let mut disc_list: Vec<DiscoveredPi> = self
            .discovered_pis
            .values()
            .map(|d| {
                let mut dc = d.clone();
                dc.is_active = (now - dc.last_seen) < 60;
                dc.mapped_bed = self
                    .mappings
                    .iter()
                    .find(|m| m.address == dc.ip || m.address.starts_with(&format!("{}:", dc.ip)))
                    .map(|m| m.bed_name.clone());
                dc
            })
            .collect();
        disc_list.sort_by(|a, b| b.last_seen.cmp(&a.last_seen));

        FullSnapshot {
            server_time: time_str,
            facility_name: self.admin.settings.facility_name.clone(),
            department_name: self.admin.settings.department_name.clone(),
            connected_to_xml: self.connected_to_xml,
            connected_to_mqtt: self.connected_to_mqtt,
            license: self.license_status.clone(),
            rooms: self.structure.rooms.clone(),
            beds: beds_out,
            mappings: self.mappings.clone(),
            discovered_pis: disc_list,
            drug_library: self.drug_library.clone(),
            pumps_count: pumps_enriched.len(),
            alarms_count: all_alarms.len(),
            active_alarms: all_alarms,
        }
    }

    pub fn handle_hl7_message(&mut self, topic: &str, payload: &str) {
        let parts: Vec<&str> = topic.split('/').collect();
        if parts.len() < 2 || parts[0] != "hl7" {
            return;
        }
        let pi_ip = parts[1].to_string();
        let sub_id = if parts.len() >= 3 { parts[2].to_string() } else { "DEFAULT".to_string() };
        let now = license::now_unix();

        let parsed = parse_hl7_packet(payload);
        let (dev_type, dev_label) = classify_hl7_device(&parsed, payload, topic);

        let clean_snippet: String = payload.chars().take(110).map(|c| if c == '\r' || c == '\n' { ' ' } else { c }).collect();
        self.discovered_pis.insert(
            pi_ip.clone(),
            DiscoveredPi {
                ip: pi_ip.clone(),
                last_seen: now,
                topic: topic.to_string(),
                device_type: dev_type.clone(),
                device_label: dev_label.clone(),
                last_payload: clean_snippet,
                is_active: true,
                mapped_bed: None,
            },
        );

        if dev_type != "INFUSION_PUMP" {
            return;
        }

        // Match either exact IP:SUB_ID, plain PI_IP, or PV1 bed tag match!
        let combined_addr = format!("{}:{}", pi_ip, sub_id.to_uppercase());
        let pv1_bed_clean = parsed.pv1_bed.split('^').last().unwrap_or("").trim().to_string();
        let pv1_stripped = pv1_bed_clean.strip_prefix("BED_").unwrap_or(&pv1_bed_clean);

        let mut matched_idx = None;
        for (i, m) in self.mappings.iter().enumerate() {
            if m.source_type == "PI_IP" {
                if m.address.eq_ignore_ascii_case(&combined_addr) || m.address == pi_ip {
                    matched_idx = Some(i);
                    break;
                }
            }
        }
        if matched_idx.is_none() && !pv1_stripped.is_empty() {
            for (i, m) in self.mappings.iter().enumerate() {
                if m.bed_name.eq_ignore_ascii_case(pv1_stripped) {
                    matched_idx = Some(i);
                    break;
                }
            }
        }

        if let Some(idx) = matched_idx {
            let bed_name = self.mappings[idx].bed_name.clone();
            let model_override = self.mappings[idx].model.clone();
            let drug_name = self.mappings[idx].drug_name.clone();
            let drug_conc = self.mappings[idx].drug_concentration.clone();
            self.mappings[idx].last_seen = now;
            self.mappings[idx].is_online = true;

            let pump_key = format!("PUMP-PI-{}-{}", pi_ip, sub_id);
            let serial_id = format!("GW-{}-{}", pi_ip.split('.').last().unwrap_or("0"), sub_id);
            let pump_model = if model_override.is_empty() { dev_label } else { model_override };

            let prev = self.last_alarm_states.get(&pump_key).cloned();
            if prev.as_deref() != Some(&parsed.status) {
                let sev = if parsed.status == "ALARM" { "HIGH" } else { "INFO" };
                let desc = parsed
                    .alarm
                    .as_ref()
                    .map(|a| a.text.clone())
                    .unwrap_or_else(|| format!("Pompa durumu: {}", parsed.status));
                self.log_event(&bed_name, &serial_id, "STATUS_CHANGE", sev, &desc, parsed.rate, parsed.vol_inf);
                self.last_alarm_states.insert(pump_key.clone(), parsed.status.clone());
            }

            self.pumps.insert(
                pump_key.clone(),
                PumpState {
                    id: pump_key,
                    bed_name,
                    source_type: "PI_IP".into(),
                    source_address: pi_ip,
                    model: pump_model.clone(),
                    serial: serial_id,
                    slot: 1,
                    mode: "Sürekli İnfüzyon".into(),
                    status: parsed.status,
                    rate: parsed.rate,
                    rate_unit: "ml/h".into(),
                    volume_infused: parsed.vol_inf,
                    vtbi: parsed.vtbi,
                    time_remaining_sec: parsed.time_remaining_sec,
                    drug_name: if drug_name.is_empty() { "İnfüzyon Çözeltisi".into() } else { drug_name },
                    drug_concentration: drug_conc,
                    pressure_level: parsed.pressure_level,
                    battery: parsed.battery,
                    ac_power: true,
                    alarm: parsed.alarm,
                    ders_warning: None,
                    near_end: false,
                    near_end_min: 0,
                    last_updated: now,
                },
            );
        }
    }
}

pub struct ParsedHl7 {
    pub sending_app: String,
    pub pv1_bed: String,
    pub rate: f64,
    pub vol_inf: f64,
    pub vtbi: f64,
    pub time_remaining_sec: i64,
    pub pressure_level: i32,
    pub battery: i32,
    pub status: String,
    pub alarm: Option<AlarmInfo>,
    pub raw_obx: HashMap<String, String>,
}

pub fn parse_hl7_packet(raw_text: &str) -> ParsedHl7 {
    let mut sending_app = String::new();
    let mut pv1_bed = String::new();
    let mut obx: HashMap<String, String> = HashMap::new();

    for line in raw_text.replace('\r', "\n").lines() {
        let l = line.trim();
        if l.is_empty() {
            continue;
        }
        let parts: Vec<&str> = l.split('|').collect();
        match parts[0] {
            "MSH" => {
                if parts.len() > 2 {
                    sending_app = parts[2].to_string();
                }
            }
            "PV1" => {
                if parts.len() > 3 {
                    pv1_bed = parts[3].to_string();
                }
            }
            "OBX" => {
                if parts.len() >= 6 {
                    let key = parts[3].split('^').next().unwrap_or("").trim().to_uppercase();
                    obx.insert(key, parts[5].trim().to_string());
                }
            }
            _ => {}
        }
    }

    let get_f64 = |keys: &[&str], def: f64| -> f64 {
        for k in keys {
            if let Some(v) = obx.get(*k) {
                if let Ok(num) = v.parse::<f64>() {
                    return num;
                }
            }
        }
        def
    };

    let rate = get_f64(&["RATE", "FLOW_RATE", "INF_RATE"], 0.0);
    let vol_inf = get_f64(&["VOL_INF", "VOL", "TOTAL_VOL", "INFUSED"], 0.0);
    let vtbi = get_f64(&["VTBI", "TARGET_VOL", "VOL_TBI"], 500.0);

    let mut time_left = 0i64;
    for k in &["TIME_LEFT", "TIME_REMAINING"] {
        if let Some(v) = obx.get(*k) {
            if let Ok(val) = v.parse::<f64>() {
                time_left = if val < 2000.0 { (val * 60.0) as i64 } else { val as i64 };
                break;
            }
        }
    }
    if time_left == 0 && rate > 0.0 && vtbi > vol_inf {
        time_left = (((vtbi - vol_inf) / rate) * 3600.0) as i64;
    }

    let mut pressure_level = 1;
    for k in &["PRESSURE", "PRESS", "OCCLUSION"] {
        if let Some(v) = obx.get(*k) {
            if let Ok(p) = v.parse::<f64>() {
                pressure_level = if p <= 1.5 {
                    ((p * 7.0) as i32 + 1).clamp(1, 8)
                } else {
                    (p as i32).clamp(1, 8)
                };
                break;
            }
        }
    }

    let battery = get_f64(&["BATTERY", "BAT", "BATT_PCT"], 100.0) as i32;

    let mut status = "INFUSING".to_string();
    for k in &["STATUS", "STATE", "PUMP_STATUS"] {
        if let Some(v) = obx.get(*k) {
            let su = v.to_uppercase();
            if su.contains("ALARM") {
                status = "ALARM".into();
            } else if su.contains("STOP") || su.contains("PAUSE") || su.contains("STANDBY") {
                status = "STOPPED".into();
            } else if su.contains("KVO") {
                status = "KVO".into();
            } else if su.contains("INFUS") || su.contains("RUN") {
                status = "INFUSING".into();
            }
            break;
        }
    }

    let mut alarm_obj = None;
    for k in &["ALARM", "ALARM_DESC", "ERROR"] {
        if let Some(txt) = obx.get(*k) {
            let up = txt.to_uppercase();
            if !txt.is_empty() && !matches!(up.as_str(), "NORMAL" | "OK" | "NONE" | "NO_ALARM" | "0") {
                status = "ALARM".into();
                alarm_obj = Some(AlarmInfo {
                    code: txt.clone(),
                    text: txt.clone(),
                    level: "HIGH".into(),
                    time: license::now_unix(),
                });
                break;
            }
        }
    }

    ParsedHl7 {
        sending_app,
        pv1_bed,
        rate,
        vol_inf,
        vtbi,
        time_remaining_sec: time_left,
        pressure_level,
        battery,
        status,
        alarm: alarm_obj,
        raw_obx: obx,
    }
}

pub fn classify_hl7_device(parsed: &ParsedHl7, payload: &str, topic: &str) -> (String, String) {
    let payload_up = payload.to_uppercase();
    let topic_up = topic.to_uppercase();
    let send_up = parsed.sending_app.to_uppercase();
    let keys: HashSet<&str> = parsed.raw_obx.keys().map(|s| s.as_str()).collect();

    let vent_keys: HashSet<&str> = ["PEEP", "PIP", "P_PEAK", "FIO2", "TV_EXP", "VTE", "RR", "RESP_RATE", "10281", "10061", "10208", "10063", "10214", "449"].into_iter().collect();
    if !keys.is_disjoint(&vent_keys) || topic_up.contains("VENT") || send_up.contains("VENT") {
        return ("VENTILATOR".into(), "Ventilatör".into());
    }

    let mon_keys: HashSet<&str> = ["SPO2", "HR", "PULSE", "NIBP", "ECG"].into_iter().collect();
    if !keys.is_disjoint(&mon_keys) || topic_up.contains("MONITOR") || send_up.contains("MONITOR") {
        return ("MONITOR".into(), "Hasta Başı Monitör".into());
    }

    let is_inf = topic_up.contains("PUMP")
        || topic_up.contains("INFUSION")
        || send_up.contains("PUMP")
        || send_up.contains("INFUSION")
        || (keys.contains("RATE") && (keys.contains("VOL_INF") || keys.contains("VTBI")));

    if is_inf {
        let model = if payload_up.contains("PCA") || topic_up.contains("PCA") {
            "PCA Pompası"
        } else if payload_up.contains("VOLUMETRIC") || topic_up.contains("VOLUMETRIC") {
            "Volumetrik Pompa"
        } else if payload_up.contains("SYRINGE") || topic_up.contains("SYRINGE") {
            "Enjektör Pompası"
        } else {
            "İnfüzyon Pompası"
        };
        return ("INFUSION_PUMP".into(), model.into());
    }

    ("OTHER_DEVICE".into(), "Diğer Cihaz".into())
}
