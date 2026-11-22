# Ward Telemetry Monitor (Rust — Ar-Ge / PoC)

Tek-binary Rust tabanlı, gömülü Web arayüzüne sahip merkezi cihaz telemetri ve HL7 v2 izleme istasyonu prototipi.

## Mimari Özeti

- **Gömülü HTTP Sunucu & Web UI (`src/main.rs`, `ui/`):** HTML/CSS/JS varlıkları derleme anında binary içine gömülür; harici web sunucusu veya çalışma zamanı bağımlılığı gerektirmez.
- **Sıfır Bağımlılık MQTT 3.1.1 İstemcisi (`src/mqtt_client.rs`):** Ham `TcpStream` üzerinde `CONNECT` / `CONNACK` / `SUBSCRIBE` / `PINGREQ` / `PUBLISH` çerçevelerini işleyerek `hl7/#` konusundan gelen HL7 v2 paketlerini çözer.
- **Win32 Seri Port (RS-232) Dinleyicisi (`src/serial_com.rs`):** `CreateFileW` / `SetCommState` / `COMMTIMEOUTS` ile seri port üzerinden STX/ETX çerçeveli, `0x7E` byte-stuffing ve CRC16-Kermit doğrulamalı ikili telemetri paketlerini ayrıştırır.
- **TCP/XML Köprüsü (`src/xml_client.rs`):** Yapılandırılabilir TCP/XML uç noktasından gelen cihaz durum akışını işler.
- **Klinik Kurallar & Raporlama (`src/models.rs`):** HL7 v2 (`MSH`/`PV1`/`OBX`) ayrıştırma, ilaç doz limitleri (DERS — `soft_min`/`soft_max`/`hard_max`), yatak bazlı 24 saat sıvı dengesi ve CSV dışa aktarma.
- **Donanım Kimlikli Ed25519 Lisanslama (`src/license.rs`, `src/keygen_bin.rs`):** İstemci ikilisinde yalnızca 32-byte Ed25519 Public Key gömülüdür; özel imzalama anahtarı (`signing_key.secret`) yalnızca lisans üreticisinde tutulur. HWID bağlama ve saat geri alma (clock-tamper) kontrolü içerir.

## Yapılandırma (`config.json`)

Hassas ağ adresleri ve kimlik bilgileri kaynak kodda tutulmaz. Başlangıç için `config.example.json` dosyasını `config.json` olarak kopyalayıp kendi ortamınıza göre düzenleyin:

```json
{
  "bind_host": "127.0.0.1",
  "http_port": 8090,
  "mqtt_broker": "127.0.0.1:1883",
  "mqtt_topic": "hl7/#",
  "xml_bridge_addr": "",
  "xml_username": "",
  "xml_password_hash": "",
  "enable_serial_com": true
}
```

- `mqtt_broker` veya `xml_bridge_addr` boş bırakılırsa ilgili ağ çalışanı başlatılmaz.
- Varsayılan `bind_host` yalnızca yerel erişim (`127.0.0.1`) için sınırlandırılmıştır.

## Derleme & Test

```bash
cargo test
cargo build --release
```

### Lisans Anahtar Çifti Oluşturma (İlk Kurulum)

1. `WardMonitor_LicenseGen.exe --init-keys` çalıştırın; çalışma dizininde gizli `signing_key.secret` dosyası oluşur ve terminale 32-byte `EMBEDDED_PUBLIC_KEY` dizisi basılır.
2. Çıktıdaki `EMBEDDED_PUBLIC_KEY` dizisini `src/license.rs` içine yapıştırıp `cargo build --release` ile yeniden derleyin.
3. Müşteri HWID'si için `WardMonitor_LicenseGen.exe` ile imzalı `WTMKEY-...` anahtarı üretin (`signing_key.secret` dosyasını asla müşteriyle veya GitHub'da paylaşmayın).

## Yönetim Paneli (Admin)

Kurum/birim başlığı özelleştirme, servis/yatak tanımlama, cihaz/port eşleştirme, DERS ilaç kuralı düzenleme, lisans aktivasyonu ve şifre yönetimi arayüzdeki şifre korumalı **YÖNETİM (ADMİN)** sekmesi altındadır:

- **İlk Kurulum Şifresi:** `admin1234` (tuzlanmış, 10.000 turlu SHA-256 özeti olarak `admin_settings.json` içinde saklanır; ilk girişten sonra değiştirmeniz önerilir).
- **Üst Başlık Kurum Adı:** Yönetici panelinden tanımlanan kurum ve birim adı doğrudan üst panelde ve tarayıcı başlığında gösterilir.

## Yasal & Kullanım Notu

Bu proje, gömülü seri haberleşme, sıfırdan protokol ayrıştırma ve HL7 v2 veri entegrasyonu üzerine geliştirilmiş bir **Ar-Ge / Kavram Kanıtı (PoC)** çalışmasıdır. Tıbbi teşhis veya tedavi amacı taşımaz; klinik ortamlarda kullanılmadan önce ilgili tıbbi cihaz ve veri koruma regülasyonlarına (MDR / KVKK) uygunluk değerlendirmesi gerektirir.
