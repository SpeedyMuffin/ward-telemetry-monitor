# Ward Telemetry Monitor (`Rust · R&D / PoC`)

[English](#english) · [Türkçe](#türkçe)

---

<a id="english"></a>
## English

Single-binary Rust central device telemetry and HL7 v2 monitoring station prototype featuring an embedded bilingual (**TR / EN**) Web UI, password-protected Admin Panel, and offline Ed25519 hardware licensing.

### Architecture Overview

- **Embedded HTTP Server & Bilingual Web UI (`src/main.rs`, `ui/`):** HTML/CSS/JS assets are embedded into the binary at compile time with zero external web-server or runtime dependencies. Includes a live `TR / EN` language switcher (auto-detects browser locale) and customizable facility/department header branding.
- **Zero-Dependency MQTT 3.1.1 Client (`src/mqtt_client.rs`):** Implements raw TCP `CONNECT` / `CONNACK` / `SUBSCRIBE` / `PINGREQ` / `PUBLISH` framing to ingest HL7 v2 payloads from configurable topics (default `telemetry/#`).
- **Win32 Serial Port Reader (`src/serial_com.rs`):** Uses `CreateFileW` / `SetCommState` / `COMMTIMEOUTS` to decode STX/ETX-framed binary telemetry packets with `0x7E` byte-stuffing and CRC16-Kermit verification.
- **TCP/XML Bridge (`src/xml_client.rs`):** Connects to a configurable newline-delimited TCP/XML endpoint with `<Auth>` and `<Ping />` keep-alive handling.
- **Clinical Rules & Reporting (`src/models.rs`):** Parses HL7 v2 (`MSH`/`PV1`/`OBX`), evaluates DERS dose limits (`soft_min` / `soft_max` / `hard_max`), tracks 24-hour fluid balance per bed, logs device/alarm history, and exports CSV reports.
- **Password-Protected Admin Panel (`src/admin.rs`):** Manages facility/department header titles, wards & beds, device/port bindings, DERS drug rules, license activation, and password changes (salted 10,000-round SHA-256 stored in `admin_settings.json`, session token auth, and brute-force rate limiting). Initial default password: `admin1234` (change after first login).
- **Hardware-Bound Ed25519 Licensing (`src/license.rs`, `src/keygen_bin.rs`):** Only the 32-byte Ed25519 public key is embedded in the monitor binary; the private key (`signing_key.secret`) remains exclusively in the offline keygen tool. Includes HWID binding and clock-rollback detection.

### Configuration (`config.json`)

Sensitive network addresses and credentials are never hardcoded. Copy `config.example.json` to `config.json` and adjust it for your environment:

```json
{
  "bind_host": "127.0.0.1",
  "http_port": 8090,
  "mqtt_broker": "127.0.0.1:1883",
  "mqtt_topic": "telemetry/#",
  "xml_bridge_addr": "",
  "xml_username": "",
  "xml_password_hash": "",
  "enable_serial_com": true
}
```

- Leaving `mqtt_broker` or `xml_bridge_addr` empty disables that background worker.
- Default `bind_host` restricts listening to localhost (`127.0.0.1`).

### Build & Test

```bash
cargo test
cargo build --release
```

### Generating an Ed25519 Keypair (First Setup)

1. Run `WardMonitor_LicenseGen.exe --init-keys` to generate a private `signing_key.secret` file and print a 32-byte `EMBEDDED_PUBLIC_KEY` array.
2. Paste `EMBEDDED_PUBLIC_KEY` into `src/license.rs` and rebuild with `cargo build --release`.
3. Generate signed `WTMKEY-...` licenses for a target HWID using `WardMonitor_LicenseGen.exe` (never distribute `signing_key.secret`).

### Legal & Usage Notice

This repository is an **R&D / Proof-of-Concept (PoC)** project exploring embedded serial communications, zero-dependency protocol parsing, and HL7 v2 telemetry integration in Rust. It is not a certified medical device; any clinical deployment requires formal regulatory and data-privacy compliance evaluation (MDR / HIPAA / KVKK).

---

<a id="türkçe"></a>
## Türkçe

Tek-binary Rust tabanlı, gömülü çift dilli (**TR / EN**) Web arayüzüne, şifre korumalı Yönetim Paneline ve çevrimdışı Ed25519 donanım lisanslamasına sahip merkezi cihaz telemetri ve HL7 v2 izleme istasyonu prototipi.

### Mimari Özeti

- **Gömülü HTTP Sunucu & Çift Dilli Web UI (`src/main.rs`, `ui/`):** HTML/CSS/JS varlıkları derleme anında binary içine gömülür; harici web sunucusu gerektirmez. Sağ üstten anlık `TR / EN` dil değiştirme ve kurum adı özelleştirme sunar.
- **Sıfır Bağımlılık MQTT 3.1.1 İstemcisi (`src/mqtt_client.rs`):** Ham `TcpStream` üzerinde `CONNECT` / `CONNACK` / `SUBSCRIBE` / `PINGREQ` / `PUBLISH` çerçevelerini işleyerek yapılandırılabilir konudan (varsayılan `telemetry/#`) gelen HL7 v2 paketlerini çözer.
- **Win32 Seri Port (RS-232) Dinleyicisi (`src/serial_com.rs`):** `CreateFileW` / `SetCommState` / `COMMTIMEOUTS` ile STX/ETX çerçeveli, `0x7E` byte-stuffing ve CRC16-Kermit doğrulamalı ikili telemetri paketlerini ayrıştırır.
- **TCP/XML Köprüsü (`src/xml_client.rs`):** Yapılandırılabilir satır sonlu TCP/XML uç noktasından gelen cihaz durum akışını işler.
- **Klinik Kurallar & Raporlama (`src/models.rs`):** HL7 v2 (`MSH`/`PV1`/`OBX`) ayrıştırma, ilaç doz limitleri (DERS — `soft_min`/`soft_max`/`hard_max`), yatak bazlı 24 saat sıvı dengesi ve CSV dışa aktarma.
- **Yönetim Paneli (`src/admin.rs`):** Kurum/birim üst başlığı özelleştirme, servis/yatak tanımlama, cihaz/port eşleştirme, DERS ilaç kuralları ve şifre yönetimi **YÖNETİM (ADMİN)** sekmesi altındadır. İlk kurulum şifresi `admin1234` olup tuzlanmış `10.000` turlu SHA-256 özeti olarak `admin_settings.json` içinde saklanır; ilk girişten sonra değiştirilmesi önerilir.
- **Donanım Kimlikli Ed25519 Lisanslama (`src/license.rs`, `src/keygen_bin.rs`):** İstemci ikilisinde yalnızca 32-byte Public Key bulunur; gizli `signing_key.secret` yalnızca lisans üreticisinde tutulur.

### Yasal & Kullanım Notu

Bu proje, gömülü seri haberleşme, sıfırdan protokol ayrıştırma ve HL7 v2 veri entegrasyonu üzerine geliştirilmiş bir **Ar-Ge / Kavram Kanıtı (PoC)** çalışmasıdır. Tıbbi teşhis veya tedavi amacı taşımaz; klinik ortamlarda kullanılmadan önce ilgili tıbbi cihaz ve veri koruma regülasyonlarına (MDR / KVKK) uygunluk değerlendirmesi gerektirir.
