// ========================================================
// WARD TELEMETRY MONITOR — INDUSTRIAL BILINGUAL CLIENT (TR/EN)
// ========================================================

const I18N = {
    tr: {
        defaultBrandTitle: "MERKEZİ İZLEM",
        defaultDepartment: "İNFÜZYON İZLEM VE KONTROL SİSTEMİ",
        lockHeaderTag: "ERİŞİM KİLİTLİ",
        lockTitle: "MERKEZİ İZLEM — LİSANS DOĞRULAMA",
        lockReasonDefault: "Lisans doğrulanıyor...",
        lockHwidLabel: "CİHAZ DONANIM KİMLİĞİ (HWID)",
        btnCopy: "KOPYALA",
        btnCopied: "KOPYALANDI",
        lockKeyLabel: "LİSANS ANAHTARI (WTMKEY-...)",
        lockKeyPlaceholder: "Aktivasyon anahtarını giriniz...",
        btnUnlockLicense: "LİSANSI ETKİNLEŞTİR",
        lockFooter: "Ekrandaki Cihaz Kodu (HWID) lisans üreticisine yapıştırılarak aktivasyon anahtarı üretilir.",
        xmlConnected: "XML KÖPRÜ: BAĞLI",
        xmlClosed: "XML KÖPRÜ: KAPALI",
        mqttConnected: "MQTT: BAĞLI",
        mqttWaiting: "MQTT: BEKLİYOR",
        comActive: "COM PORT: {n} AKTİF",
        licLocked: "LİSANS: KİLİTLİ",
        licActiveDays: "LİSANS: AKTİF ({n} GÜN)",
        alarmCount: "{n} ALARM",
        audioOn: "SES: AÇIK",
        audioOff: "SES: KAPALI",
        btnAdminPanel: "ADMİN PANELİ",
        btnAdminPanelOpen: "ADMİN (AÇIK)",
        tabWard: "SERVİS İZLEM",
        tabMap: "YERLEŞİM PLANI",
        tabDrugs: "İLAÇ KÜTÜPHANESİ (DERS)",
        tabHistory: "OLAY KAYITLARI",
        tabReports: "KLİNİK RAPORLAR",
        tabAdmin: "YÖNETİM (ADMİN)",
        roomAll: "TÜMÜ",
        alarmPrefix: "AKTİF ALARM:",
        mapTitle: "SERVİS YERLEŞİM PLANI",
        mapDesc: "Tanımlı yatakların konumları ve anlık infüzyon durumları. Detay için yatağa tıklayın.",
        btnEditWardsAdmin: "SERVİS / YATAK DÜZENLE (ADMİN)",
        drugsTitle: "İLAÇ KÜTÜPHANESİ VE DOZ LİMİTLERİ (DERS)",
        drugsDesc: "Canlı cihazlardan gelen infüzyon hızları bu tablodaki alt ve üst sınırlarla otomatik denetlenir.",
        btnEditDrugsAdmin: "ADMİN İLE DÜZENLE",
        thDrugName: "İLAÇ ADI",
        thCategory: "KATEGORİ",
        thConc: "KONSANTRASYON",
        thSoftMin: "SOFT MİN",
        thSoftMax: "SOFT MAX",
        thHardMax: "HARD MAX",
        thUnit: "BİRİM",
        historyTitle: "GERÇEK OLAY VE ALARM ARŞİVİ",
        historyDesc: "Cihaz bağlantıları, pompa durum değişimleri, alarmlar ve hasta kayıt hareketleri.",
        optAllLogs: "TÜM KAYITLAR",
        optHighLogs: "KRİTİK ALARMLAR",
        optInfoLogs: "SİSTEM BİLGİLERİ",
        btnRefresh: "YENİLE",
        btnExportCsv: "CSV DIŞA AKTAR",
        thDateTime: "TARİH / SAAT",
        thBed: "YATAK",
        thDevicePort: "CİHAZ / PORT",
        thEvent: "OLAY",
        thSeverity: "SEVİYE",
        thDesc: "AÇIKLAMA",
        thRate: "HIZ",
        thVolume: "HACİM",
        reportsTitle: "KLİNİK SIVI DENGESİ VE CQI RAPORLARI",
        reportsDesc: "Yalnızca bağlı aktif gerçek pompalardan hesaplanan servis geneli veriler.",
        btnRefreshReports: "RAPORU YENİLE",
        adminLoginTitle: "YÖNETİCİ PANELİ GİRİŞİ",
        adminLoginDesc: "Kurum ayarları, servis/yatak tanımları, cihaz portları ve DERS ilaç kuralları şifre ile korunmaktadır.",
        lblAdminPass: "Yönetici Şifresi:",
        phAdminPass: "Şifrenizi giriniz...",
        btnAdminLogin: "GİRİŞ YAP",
        adminDefaultHint: "İlk kurulum varsayılan şifresi: admin1234 — Giriş yaptıktan sonra değiştirmeniz önerilir.",
        adminPanelTitle: "YÖNETİCİ PANELİ",
        adminPanelDesc: "Kurum başlığı, yatak yapılandırması, fiziksel cihaz bağlantıları ve sistem güvenliği",
        adminSessionOpen: "OTURUM AÇIK",
        btnAdminLogout: "OTURUMU KİLİTLE",
        adminDefaultWarn: "Güvenlik Uyarısı: Hâlâ varsayılan yönetici şifresini (admin1234) kullanıyorsunuz. Lütfen \"Kurum & Güvenlik\" sekmesinden şifreyi değiştirin.",
        subtabGeneral: "Kurum & Güvenlik",
        subtabWards: "Servis & Yataklar",
        subtabDevices: "Cihaz & Portlar",
        subtabDrugs: "DERS İlaç Kuralları",
        subtabLicense: "Lisans",
        secFacilityTitle: "KURUM VE ÜST BAŞLIK BİLGİLERİ",
        secFacilityDesc: "Tanımladığınız kurum adı ve birim alt başlığı tüm istasyon üst barında ve tarayıcı başlığında gösterilir.",
        lblFacilityName: "Kullanılacak Kurum / Hastane Adı:",
        phFacilityName: "Örn: İzmir Şehir Hastanesi",
        lblDepartmentName: "Birim / Servis Alt Başlığı:",
        phDepartmentName: "Örn: 3. Basamak Genel Yoğun Bakım",
        btnSaveFacility: "BAŞLIĞI KAYDET",
        secPasswordTitle: "YÖNETİCİ ŞİFRESİ DEĞİŞTİR",
        secPasswordDesc: "Yeni şifre tuzlanmış 10.000 turlu SHA-256 özeti olarak saklanır.",
        lblCurPass: "Mevcut Şifre:",
        lblNewPass: "Yeni Şifre (en az 6 karakter):",
        lblNewPass2: "Yeni Şifre (Tekrar):",
        btnUpdatePass: "ŞİFREYİ GÜNCELLE",
        secAddRoomTitle: "1. YENİ SERVİS / ODA EKLE",
        lblRoomName: "Servis / Oda Adı:",
        phRoomName: "Örn: Anestezi Yoğun Bakım 1",
        btnAddRoom: "+ SERVİS EKLE",
        secAddBedTitle: "2. YENİ YATAK EKLE",
        lblTargetRoom: "Bağlı Olduğu Servis:",
        lblBedName: "Yatak Kodu / Adı:",
        phBedName: "Örn: 01, YATAK-01, YB-04",
        btnAddBed: "+ YATAK EKLE",
        secDefinedWardsTitle: "TANIMLI SERVİS VE YATAKLAR",
        thService: "SERVİS",
        thAction: "İŞLEM",
        secActiveMappingsTitle: "AKTİF YATAK-CİHAZ EŞLEŞTİRMELERİ",
        thMethod: "YÖNTEM",
        thAddressPort: "ADRES / PORT",
        thModel: "MODEL",
        thLabelDrug: "ETİKET / İLAÇ",
        thLastData: "SON VERİ",
        thStatus: "DURUM",
        secBindDeviceTitle: "+ CİHAZ / PORT BAĞLA",
        lblTargetBed: "Hedef Yatak:",
        lblConnMethod: "Fiziksel Bağlantı Yöntemi:",
        optSourceGateway: "[GW] Uç Ağ Geçidi (MQTT / Kanal)",
        optSourceCom: "[COM] Doğrudan PC USB/RS232 Portu",
        optSourceDock: "[DOK] LAN Dok İstasyonu (TCP/XML)",
        optSourceSn: "[SN] Fiziksel Pompa Seri Numarası",
        lblDeviceModel: "Pompa Modeli:",
        optModelSyringe: "Enjektör Pompası",
        optModelVol: "Volumetrik Pompa",
        optModelPca: "PCA Pompası",
        optModelMulti: "Çok Kanallı Pompa",
        lblConnLabel: "Bağlantı Etiketi:",
        phConnLabel: "Örn: Yatak 1 Pompa Hattı",
        lblDrugName: "İlaç Adı:",
        phDrugName: "Örn: Noradrenalin",
        lblDrugConc: "Konsantrasyon / Doz:",
        phDrugConc: "Örn: 4 mg / 50 ml",
        btnClear: "TEMİZLE",
        btnSaveMapping: "KAYDET VE YATAĞA BAĞLA",
        secDiscoveredGatewaysTitle: "AĞDAKİ UÇ AĞ GEÇİTLERİ",
        secDiscoveredGatewaysDesc: "Yapılandırılmış MQTT Broker üzerinden aktif telemetri gönderen cihazlar",
        thGwAddr: "AĞ GEÇİDİ",
        thLastSignal: "SON SİNYAL",
        thClass: "SINIFLANDIRMA",
        thLastPayload: "SON VERİ ÖZETİ",
        thBoundBed: "BAĞLI YATAK",
        secAddDrugTitle: "+ DERS İLAÇ KURALI EKLE",
        lblCategory: "Kategori:",
        lblStdConc: "Standart Konsantrasyon:",
        lblSoftMin: "Soft Alt Limit (ml/h):",
        lblSoftMax: "Soft Üst Limit (ml/h):",
        lblHardMax: "Hard Üst Limit (ml/h):",
        btnSaveDrugRule: "İLAÇ KURALINI KAYDET",
        secExistingDrugsTitle: "TANIMLI DERS KURALLARI",
        thSoftRange: "SOFT",
        secLicenseStatusTitle: "LİSANS VE DONANIM KİLİDİ DURUMU",
        secLicenseUpdateTitle: "YENİ LİSANS ANAHTARI ETKİNLEŞTİR",
        modalBedTitle: "YATAK BAŞI İSTASYONU",
        modalBedSub: "Hasta bilgileri ve cihaz kanalları",
        modalLicenseTitle: "LİSANS VE DONANIM KİLİDİ",
        footerLeft: "WARD TELEMETRY MONITOR • MQTT / HL7 v2 • TCP/XML • DIRECT COM",
        footerRight: "DONANIM KİLİTLİ ENDÜSTRİYEL İZLEM İSTASYONU",
        // Dynamic messages & cards
        bedCountBadge: "{n} YATAK",
        bedWord: "Yatak",
        noBedsInRoom: "Bu serviste tanımlı yatak yok.",
        btnAddBedAdmin: "+ Yatak Ekle (Admin)",
        emptyWardTitle: "SERVİS VE YATAK YAPISI HENÜZ OLUŞTURULMADI",
        emptyWardDesc: "Bu sistemde ön tanımlı sahte demo kaydı bulunmamaktadır. Servis/Oda ve yataklarınızı Yönetici Paneli üzerinden tanımladıktan sonra gerçek cihaz veya COM port bağlayabilirsiniz.",
        btnOpenWardAdmin: "ADMİN PANELİNDEN SERVİS / YATAK EKLE",
        noConnection: "BAĞLANTI YOK",
        noPatientRecord: "Hasta kaydı yok",
        protocolPrefix: "Protokol:",
        onlineBadge: "CANLI",
        waitingBadge: "BEKLİYOR",
        deviceBoundWaiting: "Cihaz Tanımlı ({addr}) — Veri akışı bekleniyor...",
        btnConnStatus: "BAĞLANTI DURUMU",
        noPumpBound: "Bağlı Gerçek Pompa / Port Yok",
        btnBindDevice: "CİHAZ / PORT BAĞLA",
        stStandby: "BEKLEMEDE",
        stOffline: "BAĞLANTI KOPTU",
        stAlarm: "ALARM",
        stMinLeft: "{m} DK KALDI",
        stInfusing: "AKIYOR",
        rateLabel: "AKIŞ HIZI",
        givenLabel: "VERİLEN:",
        vtbiLabel: "HEDEF:",
        remLabel: "KALAN:",
        pressureLabel: "BASINÇ:",
        undefinedVal: "Tanımsız",
        noPumpData: "Bağlı pompa verisi yok.",
        patientFormTitle: "HASTA KAYIT BİLGİLERİ",
        lblPatName: "Hasta Adı Soyadı:",
        lblPatProto: "Protokol No:",
        lblPatWeight: "Kilo (kg):",
        lblPatNote: "Klinik Not:",
        btnSavePatient: "HASTAYI KAYDET",
        btnResetVol24h: "24S HACİM SIFIRLA",
        channelsTitle: "KANALLAR",
        confirmDeleteRoom: "Bu servis ve altındaki tüm yataklar kaldırılsın mı?",
        confirmDeleteBed: "Yatak {bed} kaldırılsın mı?",
        confirmDeleteDrug: "İlaç kuralı silinsin mi?",
        confirmDeleteMapping: "Yatak {bed} cihaz bağlantısı kaldırılsın mı?",
        confirmResetVol: "Yatak {bed} 24 saatlik sıvı sayacı sıfırlansın mı?",
        confirmBindNonPump: "DİKKAT: {gw} kaynağındaki yayın {type} sınıfında görünüyor. İnfüzyon pompası olarak bağlamak istediğinizden emin misiniz?",
        noWardsSaved: "Kayıtlı servis yok. Soldaki formdan ilk servisinizi ekleyin.",
        noMappingsSaved: "Kayıtlı cihaz eşleştirmesi yok.",
        noMqttGateways: "MQTT üzerinde aktif cihaz sinyali görülmedi.",
        noFloorBeds: "Yerleşim planı için Admin Paneli üzerinden servis ve yatak ekleyin.",
        btnDeleteRoom: "Servisi Sil",
        btnDeleteBed: "Yatağı Sil",
        btnDelete: "Sil",
        btnRemove: "Kaldır",
        btnTransferToForm: "Forma Aktar",
        waitingForData: "Veri Bekleniyor",
        unmappedBed: "Bağlı Değil",
        floorEmpty: "BOŞ",
        floorActive: "AKTİF",
        kpiActivePumps: "BAĞLI AKTİF POMPA",
        kpiTotalRate: "TOPLAM AKIŞ HIZI",
        kpiTotalVol: "TOPLAM VERİLEN SIVI",
        kpiDersComp: "DERS DOZ UYUMU",
        repFluidByBed: "YATAK BAZLI SIVI DENGESİ",
        repAlarmDist: "ALARM DAĞILIMI",
        repThPump: "POMPA",
        repThRate: "HIZ",
        repThTotal: "TOPLAM",
        noData: "Veri yok",
        licRowStatus: "DURUM",
        licStatusValid: "AKTİF VE DOĞRULANDI",
        licStatusInvalid: "KİLİTLİ",
        licRowCustomer: "KURUM / LİSANS SAHİBİ",
        licRowHwid: "DONANIM KİMLİĞİ (HWID)",
        licRowMaxBeds: "YATAK LİMİTİ",
        licRowExpires: "SÜRÜM / BİTİŞ",
        daysUnit: "Gün",
        srcTypeGateway: "AĞ GEÇİDİ",
        srcTypeCom: "DOĞRUDAN COM",
        srcTypeDock: "LAN DOK",
        srcTypeSn: "SERİ NO",
        lblGwAddr: "Uç Ağ Geçidi Kimliği / Adresi (Örn: gw-01 veya gw-01:CH1):",
        phGwAddr: "Örn: gw-01 veya 192.168.1.50:CH1",
        hintGwAddr: "MQTT topic formatı <ön_ek>/<ağ_geçidi_kimliği>/<kanal> şeklindedir (ör. telemetry/gw-01/ch1).",
        lblComAddr: "Doğrudan Seri Port Adı (Örn: COM3, COM4):",
        phComAddr: "Örn: COM3",
        hintComAddr: "Tek infüzyon pompası USB-RS232 kablosuyla doğrudan bu bilgisayara bağlıysa port adını yazın.",
        lblDockAddr: "LAN Dok İstasyonu IP Adresi:",
        phDockAddr: "Örn: 192.168.1.150",
        hintDockAddr: "Yerel ağdaki TCP/XML köprüsü üzerinden bağlanır.",
        lblSnAddr: "Fiziksel Pompa Seri Numarası (SN):",
        phSnAddr: "Örn: 220145",
        hintSnAddr: "Pompa hangi porta veya doka takılırsa takılsın seri numarasından yatağa eşleşir.",
        msgFacilitySaved: "Kurum ve birim başlığı güncellendi.",
        msgPwMismatch: "Yeni şifreler birbiriyle eşleşmiyor.",
        msgPwMinLen: "Yeni şifre en az 6 karakter olmalıdır.",
        msgPwUpdated: "Yönetici şifresi güncellendi ve yeni oturum açıldı.",
        msgDrugSaved: "DERS ilaç kuralı kaydedildi.",
        msgLicUpdated: "Yeni lisans başarıyla doğrulandı.",
        msgLicInvalid: "Lisans doğrulanamadı: ",
        msgSessionExpired: "Oturum süresi doldu veya yetkisiz işlem. Lütfen tekrar giriş yapın.",
    },
    en: {
        defaultBrandTitle: "CENTRAL MONITOR",
        defaultDepartment: "INFUSION TELEMETRY & MONITORING STATION",
        lockHeaderTag: "ACCESS LOCKED",
        lockTitle: "CENTRAL MONITOR — LICENSE VERIFICATION",
        lockReasonDefault: "Verifying license...",
        lockHwidLabel: "DEVICE HARDWARE ID (HWID)",
        btnCopy: "COPY",
        btnCopied: "COPIED",
        lockKeyLabel: "LICENSE KEY (WTMKEY-...)",
        lockKeyPlaceholder: "Enter activation key...",
        btnUnlockLicense: "ACTIVATE LICENSE",
        lockFooter: "Paste the Hardware ID (HWID) above into WardMonitor_LicenseGen.exe to generate an activation key.",
        xmlConnected: "XML BRIDGE: CONNECTED",
        xmlClosed: "XML BRIDGE: OFFLINE",
        mqttConnected: "MQTT: CONNECTED",
        mqttWaiting: "MQTT: WAITING",
        comActive: "COM PORT: {n} ACTIVE",
        licLocked: "LICENSE: LOCKED",
        licActiveDays: "LICENSE: ACTIVE ({n} DAYS)",
        alarmCount: "{n} ALARMS",
        audioOn: "AUDIO: ON",
        audioOff: "AUDIO: MUTED",
        btnAdminPanel: "ADMIN PANEL",
        btnAdminPanelOpen: "ADMIN (UNLOCKED)",
        tabWard: "WARD MONITOR",
        tabMap: "FLOOR PLAN",
        tabDrugs: "DRUG LIBRARY (DERS)",
        tabHistory: "EVENT LOGS",
        tabReports: "CLINICAL REPORTS",
        tabAdmin: "ADMINISTRATION",
        roomAll: "ALL",
        alarmPrefix: "ACTIVE ALARM:",
        mapTitle: "WARD FLOOR LAYOUT",
        mapDesc: "Configured bed positions and live infusion telemetry. Click a bed for clinical details.",
        btnEditWardsAdmin: "EDIT WARDS / BEDS (ADMIN)",
        drugsTitle: "DRUG LIBRARY & DOSE LIMITS (DERS)",
        drugsDesc: "Live infusion rates are checked automatically against soft and hard safety thresholds.",
        btnEditDrugsAdmin: "EDIT IN ADMIN",
        thDrugName: "DRUG NAME",
        thCategory: "CATEGORY",
        thConc: "CONCENTRATION",
        thSoftMin: "SOFT MIN",
        thSoftMax: "SOFT MAX",
        thHardMax: "HARD MAX",
        thUnit: "UNIT",
        historyTitle: "LIVE EVENT & ALARM HISTORY",
        historyDesc: "Device connections, pump state transitions, alarms, and patient assignment records.",
        optAllLogs: "ALL EVENTS",
        optHighLogs: "CRITICAL ALARMS",
        optInfoLogs: "SYSTEM INFO",
        btnRefresh: "REFRESH",
        btnExportCsv: "EXPORT CSV",
        thDateTime: "DATE / TIME",
        thBed: "BED",
        thDevicePort: "DEVICE / PORT",
        thEvent: "EVENT",
        thSeverity: "SEVERITY",
        thDesc: "DESCRIPTION",
        thRate: "RATE",
        thVolume: "VOLUME",
        reportsTitle: "CLINICAL FLUID BALANCE & CQI REPORTS",
        reportsDesc: "Ward-wide aggregates calculated from connected active infusion pumps.",
        btnRefreshReports: "REFRESH REPORT",
        adminLoginTitle: "ADMIN PANEL LOGIN",
        adminLoginDesc: "Facility branding, ward/bed configuration, device bindings, and DERS drug rules are password protected.",
        lblAdminPass: "Administrator Password:",
        phAdminPass: "Enter password...",
        btnAdminLogin: "SIGN IN",
        adminDefaultHint: "Initial default password: admin1234 — Please change it after signing in.",
        adminPanelTitle: "ADMINISTRATION PANEL",
        adminPanelDesc: "Facility header branding, ward layout, device bindings, and system security",
        adminSessionOpen: "SESSION ACTIVE",
        btnAdminLogout: "LOCK SESSION",
        adminDefaultWarn: "Security Warning: Default administrator password (admin1234) is still active. Please change it under \"Facility & Security\".",
        subtabGeneral: "Facility & Security",
        subtabWards: "Wards & Beds",
        subtabDevices: "Devices & Ports",
        subtabDrugs: "DERS Drug Rules",
        subtabLicense: "License",
        secFacilityTitle: "FACILITY & HEADER BRANDING",
        secFacilityDesc: "The facility and department titles appear live in the top navigation bar and browser title.",
        lblFacilityName: "Facility / Hospital Name:",
        phFacilityName: "e.g. Izmir City Hospital",
        lblDepartmentName: "Department / Ward Subtitle:",
        phDepartmentName: "e.g. Surgical Intensive Care Unit",
        btnSaveFacility: "SAVE HEADER",
        secPasswordTitle: "CHANGE ADMIN PASSWORD",
        secPasswordDesc: "Stored locally as a salted 10,000-round SHA-256 digest.",
        lblCurPass: "Current Password:",
        lblNewPass: "New Password (min 6 chars):",
        lblNewPass2: "Confirm New Password:",
        btnUpdatePass: "UPDATE PASSWORD",
        secAddRoomTitle: "1. ADD WARD / ROOM",
        lblRoomName: "Ward / Room Name:",
        phRoomName: "e.g. Anesthesia ICU 1",
        btnAddRoom: "+ ADD WARD",
        secAddBedTitle: "2. ADD BED",
        lblTargetRoom: "Assigned Ward:",
        lblBedName: "Bed Code / Name:",
        phBedName: "e.g. 01, BED-01, ICU-04",
        btnAddBed: "+ ADD BED",
        secDefinedWardsTitle: "CONFIGURED WARDS & BEDS",
        thService: "WARD",
        thAction: "ACTION",
        secActiveMappingsTitle: "ACTIVE BED-DEVICE BINDINGS",
        thMethod: "METHOD",
        thAddressPort: "ADDRESS / PORT",
        thModel: "MODEL",
        thLabelDrug: "LABEL / DRUG",
        thLastData: "LAST TELEMETRY",
        thStatus: "STATUS",
        secBindDeviceTitle: "+ BIND DEVICE / PORT",
        lblTargetBed: "Target Bed:",
        lblConnMethod: "Connection Method:",
        optSourceGateway: "[GW] Edge Gateway (MQTT / Channel)",
        optSourceCom: "[COM] Direct PC USB/RS232 Port",
        optSourceDock: "[DOK] LAN Dock Bridge (TCP/XML)",
        optSourceSn: "[SN] Pump Serial Number",
        lblDeviceModel: "Pump Model:",
        optModelSyringe: "Syringe Pump",
        optModelVol: "Volumetric Pump",
        optModelPca: "PCA Pump",
        optModelMulti: "Multi-Channel Pump",
        lblConnLabel: "Connection Label:",
        phConnLabel: "e.g. Bed 1 Line A",
        lblDrugName: "Drug Name:",
        phDrugName: "e.g. Norepinephrine",
        lblDrugConc: "Concentration:",
        phDrugConc: "e.g. 4 mg / 50 ml",
        btnClear: "CLEAR",
        btnSaveMapping: "SAVE & BIND TO BED",
        secDiscoveredGatewaysTitle: "DISCOVERED EDGE GATEWAYS",
        secDiscoveredGatewaysDesc: "Active telemetry publishers discovered on the configured MQTT broker",
        thGwAddr: "GATEWAY",
        thLastSignal: "LAST SEEN",
        thClass: "CLASSIFICATION",
        thLastPayload: "LAST PAYLOAD SUMMARY",
        thBoundBed: "BOUND BED",
        secAddDrugTitle: "+ ADD DERS DRUG RULE",
        lblCategory: "Category:",
        lblStdConc: "Standard Concentration:",
        lblSoftMin: "Soft Min (ml/h):",
        lblSoftMax: "Soft Max (ml/h):",
        lblHardMax: "Hard Max (ml/h):",
        btnSaveDrugRule: "SAVE DRUG RULE",
        secExistingDrugsTitle: "DEFINED DERS RULES",
        thSoftRange: "SOFT",
        secLicenseStatusTitle: "LICENSE & HARDWARE LOCK STATUS",
        secLicenseUpdateTitle: "ACTIVATE NEW LICENSE KEY",
        modalBedTitle: "BEDSIDE STATION",
        modalBedSub: "Patient metadata and pump channels",
        modalLicenseTitle: "LICENSE & HARDWARE LOCK",
        footerLeft: "WARD TELEMETRY MONITOR • MQTT / HL7 v2 • TCP/XML • DIRECT COM",
        footerRight: "HARDWARE-BOUND INDUSTRIAL TELEMETRY STATION",
        // Dynamic messages & cards
        bedCountBadge: "{n} BEDS",
        bedWord: "Bed",
        noBedsInRoom: "No beds defined in this ward.",
        btnAddBedAdmin: "+ Add Bed (Admin)",
        emptyWardTitle: "NO WARDS OR BEDS CONFIGURED YET",
        emptyWardDesc: "This station ships with zero demo records. Create wards and beds in the Admin Panel, then bind physical COM ports, MQTT gateways, or TCP/XML bridges.",
        btnOpenWardAdmin: "ADD WARDS / BEDS IN ADMIN PANEL",
        noConnection: "UNBOUND",
        noPatientRecord: "No patient assigned",
        protocolPrefix: "Protocol:",
        onlineBadge: "LIVE",
        waitingBadge: "WAITING",
        deviceBoundWaiting: "Device Bound ({addr}) — Waiting for telemetry...",
        btnConnStatus: "CONNECTION STATUS",
        noPumpBound: "No Active Pump / Port Bound",
        btnBindDevice: "BIND DEVICE / PORT",
        stStandby: "STANDBY",
        stOffline: "OFFLINE",
        stAlarm: "ALARM",
        stMinLeft: "{m} MIN LEFT",
        stInfusing: "INFUSING",
        rateLabel: "FLOW RATE",
        givenLabel: "INFUSED:",
        vtbiLabel: "VTBI:",
        remLabel: "REMAINING:",
        pressureLabel: "PRESSURE:",
        undefinedVal: "Unassigned",
        noPumpData: "No active pump telemetry.",
        patientFormTitle: "PATIENT RECORD",
        lblPatName: "Patient Full Name:",
        lblPatProto: "MRN / Protocol No:",
        lblPatWeight: "Weight (kg):",
        lblPatNote: "Clinical Note:",
        btnSavePatient: "SAVE PATIENT",
        btnResetVol24h: "RESET 24H VOLUME",
        channelsTitle: "CHANNELS",
        confirmDeleteRoom: "Remove this ward and all its beds?",
        confirmDeleteBed: "Remove Bed {bed}?",
        confirmDeleteDrug: "Delete this DERS drug rule?",
        confirmDeleteMapping: "Unbind device from Bed {bed}?",
        confirmResetVol: "Reset 24-hour fluid volume counter for Bed {bed}?",
        confirmBindNonPump: "WARNING: Publisher {gw} looks like {type}. Are you sure you want to bind it as an infusion pump?",
        noWardsSaved: "No wards configured yet. Create your first ward on the left.",
        noMappingsSaved: "No device bindings configured.",
        noMqttGateways: "No active MQTT telemetry publishers seen yet.",
        noFloorBeds: "Add wards and beds in the Admin Panel to display the floor plan.",
        btnDeleteRoom: "Delete Ward",
        btnDeleteBed: "Delete Bed",
        btnDelete: "Delete",
        btnRemove: "Unbind",
        btnTransferToForm: "Load into Form",
        waitingForData: "Waiting",
        unmappedBed: "Unbound",
        floorEmpty: "EMPTY",
        floorActive: "ACTIVE",
        kpiActivePumps: "ACTIVE PUMPS",
        kpiTotalRate: "TOTAL FLOW RATE",
        kpiTotalVol: "TOTAL INFUSED VOL",
        kpiDersComp: "DERS COMPLIANCE",
        repFluidByBed: "24H FLUID BALANCE BY BED",
        repAlarmDist: "ALARM DISTRIBUTION",
        repThPump: "PUMPS",
        repThRate: "RATE",
        repThTotal: "TOTAL",
        noData: "No data",
        licRowStatus: "STATUS",
        licStatusValid: "ACTIVE & VERIFIED",
        licStatusInvalid: "LOCKED",
        licRowCustomer: "CUSTOMER / FACILITY",
        licRowHwid: "HARDWARE ID (HWID)",
        licRowMaxBeds: "BED LIMIT",
        licRowExpires: "EDITION / EXPIRES",
        daysUnit: "Days",
        srcTypeGateway: "EDGE GATEWAY",
        srcTypeCom: "DIRECT COM",
        srcTypeDock: "LAN DOCK",
        srcTypeSn: "SERIAL NO",
        lblGwAddr: "Edge Gateway ID / Address (e.g. gw-01 or gw-01:CH1):",
        phGwAddr: "e.g. gw-01 or 192.168.1.50:CH1",
        hintGwAddr: "Matches MQTT topic <prefix>/<gateway_id>/<channel> (e.g. telemetry/gw-01/ch1).",
        lblComAddr: "Direct Serial Port Name (e.g. COM3, COM4):",
        phComAddr: "e.g. COM3",
        hintComAddr: "Enter the COM port if a pump is connected directly via USB-RS232.",
        lblDockAddr: "LAN Dock Bridge Address:",
        phDockAddr: "e.g. 192.168.1.150",
        hintDockAddr: "Matches beds over the configurable TCP/XML bridge.",
        lblSnAddr: "Pump Serial Number (SN):",
        phSnAddr: "e.g. 220145",
        hintSnAddr: "Binds by device serial number across any dock or bridge.",
        msgFacilitySaved: "Facility and department titles saved.",
        msgPwMismatch: "New passwords do not match.",
        msgPwMinLen: "New password must be at least 6 characters.",
        msgPwUpdated: "Admin password updated and new session started.",
        msgDrugSaved: "DERS drug rule saved.",
        msgLicUpdated: "New license verified and activated.",
        msgLicInvalid: "License verification failed: ",
        msgSessionExpired: "Session expired or unauthorized. Please sign in again.",
    }
};

class MerkeziIzlemApp {
    constructor() {
        this.currentFilter = "ALL";
        this.currentView = "ward";
        this.audioMuted = false;
        this.lastState = null;
        this.audioCtx = null;
        this.lastAlarmCount = 0;

        const savedLang = localStorage.getItem("wtm_lang");
        const browserTr = (navigator.language || "").toLowerCase().startsWith("tr");
        this.lang = (savedLang === "tr" || savedLang === "en") ? savedLang : (browserTr ? "tr" : "en");

        this.adminToken = sessionStorage.getItem("wtm_admin_token") || "";
        this.adminAuthed = false;
        this.usingDefaultPassword = false;
        this.currentAdminSubtab = "general";
        this.pendingAdminSubtab = null;

        this.initDOMElements();
        this.initEventListeners();
        this.applyLanguage();
        this.startClock();
        this.pollLoop();
    }

    t(key, vars = {}) {
        const dict = I18N[this.lang] || I18N.tr;
        let s = dict[key] !== undefined ? dict[key] : (I18N.tr[key] !== undefined ? I18N.tr[key] : key);
        for (const [k, v] of Object.entries(vars)) {
            s = s.replace(`{${k}}`, String(v));
        }
        return s;
    }

    initDOMElements() {
        this.headerBrandMark = document.getElementById("headerBrandMark");
        this.headerFacilityName = document.getElementById("headerFacilityName");
        this.headerDepartmentName = document.getElementById("headerDepartmentName");

        this.backendStatusPill = document.getElementById("backendStatusPill");
        this.backendStatusText = document.getElementById("backendStatusText");
        this.mqttStatusPill = document.getElementById("mqttStatusPill");
        this.mqttStatusText = document.getElementById("mqttStatusText");
        this.comStatusPill = document.getElementById("comStatusPill");
        this.comStatusText = document.getElementById("comStatusText");
        this.btnLicenseBadge = document.getElementById("btnLicenseBadge");
        this.licenseBadgeText = document.getElementById("licenseBadgeText");
        this.btnToggleLang = document.getElementById("btnToggleLang");
        this.btnOpenAdminPanel = document.getElementById("btnOpenAdminPanel");

        this.licenseLockOverlay = document.getElementById("licenseLockOverlay");
        this.lockReasonText = document.getElementById("lockReasonText");
        this.lockHwidCode = document.getElementById("lockHwidCode");
        this.btnCopyHwid = document.getElementById("btnCopyHwid");
        this.unlockLicenseForm = document.getElementById("unlockLicenseForm");
        this.unlockKeyInput = document.getElementById("unlockKeyInput");

        this.moduleTabs = document.getElementById("moduleTabs");
        this.roomTabs = document.getElementById("roomTabs");
        this.totalBedsBadge = document.getElementById("totalBedsBadge");
        this.alarmPill = document.getElementById("alarmPill");
        this.alarmCountText = document.getElementById("alarmCountText");
        this.btnAudioMute = document.getElementById("btnAudioMute");
        this.digitalClock = document.getElementById("digitalClock");
        this.digitalDate = document.getElementById("digitalDate");
        this.alarmsBanner = document.getElementById("alarmsBanner");
        this.alarmBannerList = document.getElementById("alarmBannerList");
        this.roomsContainer = document.getElementById("roomsContainer");

        this.wardFloorCanvas = document.getElementById("wardFloorCanvas");
        this.drugsTableBody = document.getElementById("drugsTableBody");
        this.btnEditDrugsInAdmin = document.getElementById("btnEditDrugsInAdmin");
        this.historyTableBody = document.getElementById("historyTableBody");
        this.historySeverityFilter = document.getElementById("historySeverityFilter");
        this.btnRefreshHistory = document.getElementById("btnRefreshHistory");
        this.reportsContainer = document.getElementById("reportsContainer");
        this.btnRefreshReports = document.getElementById("btnRefreshReports");

        // Admin View Elements
        this.adminLoginBox = document.getElementById("adminLoginBox");
        this.adminLoginForm = document.getElementById("adminLoginForm");
        this.adminLoginPassword = document.getElementById("adminLoginPassword");
        this.adminLoginError = document.getElementById("adminLoginError");
        this.adminDefaultPassHint = document.getElementById("adminDefaultPassHint");
        this.adminWorkspace = document.getElementById("adminWorkspace");
        this.btnAdminLogout = document.getElementById("btnAdminLogout");
        this.adminDefaultPassWarn = document.getElementById("adminDefaultPassWarn");
        this.adminSubtabs = document.getElementById("adminSubtabs");

        this.adminFacilityForm = document.getElementById("adminFacilityForm");
        this.adminFacilityInput = document.getElementById("adminFacilityInput");
        this.adminDepartmentInput = document.getElementById("adminDepartmentInput");
        this.adminFacilityMsg = document.getElementById("adminFacilityMsg");

        this.adminPasswordForm = document.getElementById("adminPasswordForm");
        this.adminCurPass = document.getElementById("adminCurPass");
        this.adminNewPass = document.getElementById("adminNewPass");
        this.adminNewPass2 = document.getElementById("adminNewPass2");
        this.adminPasswordMsg = document.getElementById("adminPasswordMsg");

        // Admin Wards & Beds
        this.addRoomForm = document.getElementById("addRoomForm");
        this.newRoomNameInput = document.getElementById("newRoomNameInput");
        this.addBedForm = document.getElementById("addBedForm");
        this.newBedRoomSelect = document.getElementById("newBedRoomSelect");
        this.newBedNameInput = document.getElementById("newBedNameInput");
        this.wardBedsManageBody = document.getElementById("wardBedsManageBody");

        // Admin Devices & Ports
        this.activeMappingsCount = document.getElementById("activeMappingsCount");
        this.discoveredGatewaysCount = document.getElementById("discoveredGatewaysCount");
        this.mappingsTableBody = document.getElementById("mappingsTableBody");
        this.discoveredGatewaysTableBody = document.getElementById("discoveredGatewaysTableBody");
        this.saveMappingForm = document.getElementById("saveMappingForm");
        this.mapBedSelect = document.getElementById("mapBedSelect");
        this.mapSourceTypeSelect = document.getElementById("mapSourceTypeSelect");
        this.mapAddressInput = document.getElementById("mapAddressInput");
        this.mapModelSelect = document.getElementById("mapModelSelect");
        this.mapLabelInput = document.getElementById("mapLabelInput");
        this.mapDrugName = document.getElementById("mapDrugName");
        this.mapDrugConc = document.getElementById("mapDrugConc");
        this.lblMapAddress = document.getElementById("lblMapAddress");
        this.hintMapAddress = document.getElementById("hintMapAddress");
        this.btnResetMappingForm = document.getElementById("btnResetMappingForm");

        // Admin Drugs & License
        this.addDrugForm = document.getElementById("addDrugForm");
        this.adminDrugMsg = document.getElementById("adminDrugMsg");
        this.adminDrugsTableBody = document.getElementById("adminDrugsTableBody");
        this.adminLicenseBody = document.getElementById("adminLicenseBody");
        this.adminActivateLicenseForm = document.getElementById("adminActivateLicenseForm");
        this.adminLicenseKeyInput = document.getElementById("adminLicenseKeyInput");
        this.adminLicenseMsg = document.getElementById("adminLicenseMsg");

        // Bed Detail & License Modals
        this.bedDetailModal = document.getElementById("bedDetailModal");
        this.bedDetailTitle = document.getElementById("bedDetailTitle");
        this.bedDetailSub = document.getElementById("bedDetailSub");
        this.bedDetailBody = document.getElementById("bedDetailBody");
        this.btnCloseBedDetailModal = document.getElementById("btnCloseBedDetailModal");

        this.licenseInfoModal = document.getElementById("licenseInfoModal");
        this.licenseInfoBody = document.getElementById("licenseInfoBody");
        this.btnCloseLicenseModal = document.getElementById("btnCloseLicenseModal");
    }

    applyLanguage() {
        document.documentElement.lang = this.lang;
        if (this.btnToggleLang) {
            this.btnToggleLang.textContent = this.lang === "tr" ? "EN" : "TR";
        }
        document.querySelectorAll("[data-i18n]").forEach(el => {
            el.textContent = this.t(el.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            el.placeholder = this.t(el.dataset.i18nPlaceholder);
        });
        if (this.btnAudioMute) {
            this.btnAudioMute.textContent = this.audioMuted ? this.t("audioOff") : this.t("audioOn");
        }
        if (this.btnOpenAdminPanel) {
            this.btnOpenAdminPanel.textContent = this.adminAuthed ? this.t("btnAdminPanelOpen") : this.t("btnAdminPanel");
        }
        this.updateMappingAddressHints();

        if (this.lastState) this.renderDashboard(this.lastState);
        if (this.currentView === "drugs") this.loadDrugsView();
        else if (this.currentView === "history") this.loadHistoryView();
        else if (this.currentView === "reports") this.loadReportsView();
        else if (this.currentView === "admin" && this.adminAuthed) {
            if (this.currentAdminSubtab === "drugs") this.renderAdminDrugs();
            if (this.currentAdminSubtab === "license") this.renderAdminLicense();
        }
    }

    updateMappingAddressHints() {
        if (!this.mapSourceTypeSelect || !this.lblMapAddress) return;
        const val = this.mapSourceTypeSelect.value;
        if (val === "GATEWAY") {
            this.lblMapAddress.textContent = this.t("lblGwAddr");
            this.mapAddressInput.placeholder = this.t("phGwAddr");
            this.hintMapAddress.textContent = this.t("hintGwAddr");
        } else if (val === "DIRECT_COM") {
            this.lblMapAddress.textContent = this.t("lblComAddr");
            this.mapAddressInput.placeholder = this.t("phComAddr");
            this.hintMapAddress.textContent = this.t("hintComAddr");
        } else if (val === "DOCK_IP") {
            this.lblMapAddress.textContent = this.t("lblDockAddr");
            this.mapAddressInput.placeholder = this.t("phDockAddr");
            this.hintMapAddress.textContent = this.t("hintDockAddr");
        } else {
            this.lblMapAddress.textContent = this.t("lblSnAddr");
            this.mapAddressInput.placeholder = this.t("phSnAddr");
            this.hintMapAddress.textContent = this.t("hintSnAddr");
        }
    }

    escapeHtml(str) {
        return String(str ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    setFeedback(el, msg, isOk) {
        if (!el) return;
        el.textContent = msg || "";
        el.className = msg ? `admin-feedback ${isOk ? "ok" : "err"}` : "admin-feedback";
    }

    setAdminToken(token) {
        this.adminToken = token || "";
        if (this.adminToken) {
            sessionStorage.setItem("wtm_admin_token", this.adminToken);
        } else {
            sessionStorage.removeItem("wtm_admin_token");
        }
    }

    async adminFetch(url, options = {}) {
        const headers = Object.assign({}, options.headers || {});
        if (this.adminToken) {
            headers["X-Admin-Token"] = this.adminToken;
        }
        const res = await fetch(url, Object.assign({}, options, { headers }));
        let data = {};
        try {
            data = await res.json();
        } catch (e) { }

        if (res.status === 401) {
            this.adminAuthed = false;
            this.setAdminToken("");
            this.updateAdminPanelVisibility();
            if (this.adminLoginError) {
                this.adminLoginError.textContent = data.detail || this.t("msgSessionExpired");
            }
            throw new Error(data.detail || "Unauthorized");
        }
        return { ok: res.ok, status: res.status, data };
    }

    initEventListeners() {
        this.btnToggleLang.addEventListener("click", () => {
            this.lang = this.lang === "tr" ? "en" : "tr";
            localStorage.setItem("wtm_lang", this.lang);
            this.applyLanguage();
        });

        this.btnAudioMute.addEventListener("click", () => {
            this.audioMuted = !this.audioMuted;
            this.btnAudioMute.textContent = this.audioMuted ? this.t("audioOff") : this.t("audioOn");
        });

        this.moduleTabs.addEventListener("click", (e) => {
            const btn = e.target.closest(".mod-tab");
            if (!btn) return;
            this.switchMainView(btn.dataset.view);
        });

        this.roomTabs.addEventListener("click", (e) => {
            const btn = e.target.closest(".room-tab");
            if (!btn) return;
            this.setRoomFilter(btn.dataset.room);
        });

        this.btnOpenAdminPanel.addEventListener("click", () => this.openAdminSection("general"));
        this.btnEditDrugsInAdmin.addEventListener("click", () => this.openAdminSection("drugs"));

        this.btnCopyHwid.addEventListener("click", () => {
            const code = this.lockHwidCode.textContent;
            if (navigator.clipboard) navigator.clipboard.writeText(code);
            this.btnCopyHwid.textContent = this.t("btnCopied");
            setTimeout(() => { this.btnCopyHwid.textContent = this.t("btnCopy"); }, 2000);
        });

        this.unlockLicenseForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const res = await fetch("/api/license/activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ license_key: this.unlockKeyInput.value.trim() })
            });
            const data = await res.json();
            if (data.valid) {
                this.licenseLockOverlay.style.display = "none";
                this.unlockKeyInput.value = "";
                await this.fetchAndRender();
            } else {
                alert(this.t("msgLicInvalid") + (data.message || data.reason));
            }
        });

        this.btnLicenseBadge.addEventListener("click", () => this.openLicenseInfoModal());
        this.btnCloseLicenseModal.addEventListener("click", () => { this.licenseInfoModal.style.display = "none"; });

        // Admin Login & Logout
        this.adminLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            this.adminLoginError.textContent = "";
            const password = this.adminLoginPassword.value;
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                this.adminLoginError.textContent = data.detail || "Login failed.";
                return;
            }
            this.adminLoginPassword.value = "";
            this.setAdminToken(data.token);
            this.adminAuthed = true;
            this.usingDefaultPassword = !!data.using_default_password;
            const targetSub = this.pendingAdminSubtab || this.currentAdminSubtab || "general";
            this.pendingAdminSubtab = null;
            this.updateAdminPanelVisibility(data);
            this.switchAdminSubtab(targetSub);
            await this.fetchAndRender();
        });

        this.btnAdminLogout.addEventListener("click", async () => {
            try {
                await fetch("/api/admin/logout", {
                    method: "POST",
                    headers: this.adminToken ? { "X-Admin-Token": this.adminToken } : {}
                });
            } catch (e) { }
            this.adminAuthed = false;
            this.setAdminToken("");
            this.updateAdminPanelVisibility();
        });

        this.adminSubtabs.addEventListener("click", (e) => {
            const btn = e.target.closest(".admin-subtab");
            if (!btn) return;
            this.switchAdminSubtab(btn.dataset.subtab);
        });

        // Admin Facility Settings
        this.adminFacilityForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            this.setFeedback(this.adminFacilityMsg, "", true);
            try {
                const { ok, data } = await this.adminFetch("/api/admin/settings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        facility_name: this.adminFacilityInput.value.trim(),
                        department_name: this.adminDepartmentInput.value.trim()
                    })
                });
                if (!ok) {
                    this.setFeedback(this.adminFacilityMsg, data.detail || "Save failed.", false);
                    return;
                }
                this.setFeedback(this.adminFacilityMsg, this.t("msgFacilitySaved"), true);
                await this.fetchAndRender();
            } catch (err) { }
        });

        // Admin Password Change
        this.adminPasswordForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            this.setFeedback(this.adminPasswordMsg, "", true);
            const cur = this.adminCurPass.value;
            const np1 = this.adminNewPass.value;
            const np2 = this.adminNewPass2.value;
            if (np1 !== np2) {
                this.setFeedback(this.adminPasswordMsg, this.t("msgPwMismatch"), false);
                return;
            }
            if (np1.trim().length < 6) {
                this.setFeedback(this.adminPasswordMsg, this.t("msgPwMinLen"), false);
                return;
            }
            try {
                const { ok, data } = await this.adminFetch("/api/admin/password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ current_password: cur, new_password: np1 })
                });
                if (!ok) {
                    this.setFeedback(this.adminPasswordMsg, data.detail || "Failed.", false);
                    return;
                }
                if (data.token) this.setAdminToken(data.token);
                this.usingDefaultPassword = false;
                this.adminCurPass.value = "";
                this.adminNewPass.value = "";
                this.adminNewPass2.value = "";
                this.updateAdminPanelVisibility();
                this.setFeedback(this.adminPasswordMsg, this.t("msgPwUpdated"), true);
            } catch (err) { }
        });

        // Admin Wards & Beds
        this.addRoomForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = this.newRoomNameInput.value.trim();
            if (!name) return;
            try {
                const { ok, data } = await this.adminFetch("/api/rooms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name })
                });
                if (!ok) {
                    alert(data.detail || "Error.");
                    return;
                }
                this.newRoomNameInput.value = "";
                await this.fetchAndRender();
            } catch (err) { }
        });

        this.addBedForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const room_id = parseInt(this.newBedRoomSelect.value, 10);
            const name = this.newBedNameInput.value.trim();
            if (!room_id || !name) return;
            try {
                const { ok, data } = await this.adminFetch("/api/beds", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ room_id, name })
                });
                if (!ok) {
                    alert(data.detail || "Error.");
                    return;
                }
                this.newBedNameInput.value = "";
                await this.fetchAndRender();
            } catch (err) { }
        });

        // Admin Device Mapping
        this.btnResetMappingForm.addEventListener("click", () => {
            this.saveMappingForm.reset();
            this.updateMappingAddressHints();
        });

        this.mapSourceTypeSelect.addEventListener("change", () => this.updateMappingAddressHints());

        this.saveMappingForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                bed_name: this.mapBedSelect.value,
                source_type: this.mapSourceTypeSelect.value,
                address: this.mapAddressInput.value.trim(),
                model: this.mapModelSelect.value,
                label: this.mapLabelInput.value.trim(),
                drug_name: this.mapDrugName.value.trim() || this.t("undefinedVal"),
                drug_concentration: this.mapDrugConc.value.trim() || ""
            };
            try {
                const { ok, data } = await this.adminFetch("/api/mappings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (!ok) {
                    alert(data.detail || "Rejected.");
                    return;
                }
                this.mapAddressInput.value = "";
                this.mapLabelInput.value = "";
                await this.fetchAndRender();
            } catch (err) { }
        });

        // Admin Drug Form
        this.addDrugForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            this.setFeedback(this.adminDrugMsg, "", true);
            const payload = {
                name: document.getElementById("drugNameInput").value,
                category: document.getElementById("drugCategoryInput").value,
                default_conc: document.getElementById("drugConcInput").value,
                soft_min: parseFloat(document.getElementById("drugSoftMinInput").value),
                soft_max: parseFloat(document.getElementById("drugSoftMaxInput").value),
                hard_max: parseFloat(document.getElementById("drugHardMaxInput").value),
                unit: "ml/h"
            };
            try {
                const { ok, data } = await this.adminFetch("/api/drugs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (!ok) {
                    this.setFeedback(this.adminDrugMsg, data.detail || "Failed.", false);
                    return;
                }
                document.getElementById("drugNameInput").value = "";
                document.getElementById("drugConcInput").value = "";
                this.setFeedback(this.adminDrugMsg, this.t("msgDrugSaved"), true);
                await this.fetchAndRender();
                this.renderAdminDrugs();
            } catch (err) { }
        });

        // Admin License Activate Form
        this.adminActivateLicenseForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            this.setFeedback(this.adminLicenseMsg, "", true);
            const res = await fetch("/api/license/activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ license_key: this.adminLicenseKeyInput.value.trim() })
            });
            const data = await res.json();
            if (data.valid) {
                this.adminLicenseKeyInput.value = "";
                this.setFeedback(this.adminLicenseMsg, this.t("msgLicUpdated"), true);
                await this.fetchAndRender();
                this.renderAdminLicense();
            } else {
                this.setFeedback(this.adminLicenseMsg, this.t("msgLicInvalid") + (data.message || data.reason), false);
            }
        });

        // Bed Detail Modal Close
        this.btnCloseBedDetailModal.addEventListener("click", () => { this.bedDetailModal.style.display = "none"; });

        this.historySeverityFilter.addEventListener("change", () => this.loadHistoryView());
        this.btnRefreshHistory.addEventListener("click", () => this.loadHistoryView());
        this.btnRefreshReports.addEventListener("click", () => this.loadReportsView());
    }

    switchMainView(viewKey) {
        this.currentView = viewKey;
        document.querySelectorAll(".mod-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.view === viewKey));
        document.querySelectorAll(".view-section").forEach(sec => { sec.style.display = (sec.id === `view-${viewKey}`) ? "block" : "none"; });
        this.roomTabs.style.display = (viewKey === "ward") ? "flex" : "none";

        if (viewKey === "map" && this.lastState) this.renderFloorMap(this.lastState);
        else if (viewKey === "drugs") this.loadDrugsView();
        else if (viewKey === "history") this.loadHistoryView();
        else if (viewKey === "reports") this.loadReportsView();
        else if (viewKey === "admin") this.checkAdminStatus();
    }

    async checkAdminStatus() {
        try {
            const headers = this.adminToken ? { "X-Admin-Token": this.adminToken } : {};
            const res = await fetch("/api/admin/status", { headers, cache: "no-store" });
            const st = await res.json();
            this.adminAuthed = !!st.authenticated;
            this.usingDefaultPassword = !!st.using_default_password;
            if (!this.adminAuthed) {
                this.setAdminToken("");
            } else if (this.pendingAdminSubtab) {
                const target = this.pendingAdminSubtab;
                this.pendingAdminSubtab = null;
                this.currentAdminSubtab = target;
            }
            this.updateAdminPanelVisibility(st);
            if (this.adminAuthed) {
                this.switchAdminSubtab(this.currentAdminSubtab);
            } else if (this.adminLoginPassword) {
                this.adminLoginPassword.focus();
            }
        } catch (e) { }
    }

    updateAdminPanelVisibility(statusData = null) {
        if (this.btnOpenAdminPanel) {
            this.btnOpenAdminPanel.textContent = this.adminAuthed ? this.t("btnAdminPanelOpen") : this.t("btnAdminPanel");
        }
        if (this.adminAuthed) {
            this.adminLoginBox.style.display = "none";
            this.adminWorkspace.style.display = "block";
            if (this.adminDefaultPassWarn) {
                this.adminDefaultPassWarn.style.display = this.usingDefaultPassword ? "block" : "none";
            }
            const src = statusData || this.lastState;
            if (src) {
                if (this.adminFacilityInput && document.activeElement !== this.adminFacilityInput) {
                    this.adminFacilityInput.value = src.facility_name || "";
                }
                if (this.adminDepartmentInput && document.activeElement !== this.adminDepartmentInput) {
                    this.adminDepartmentInput.value = src.department_name || "";
                }
            }
        } else {
            this.adminLoginBox.style.display = "flex";
            this.adminWorkspace.style.display = "none";
            if (this.adminDefaultPassHint) {
                this.adminDefaultPassHint.style.display = this.usingDefaultPassword ? "block" : "none";
            }
        }
    }

    openAdminSection(subtab = "general") {
        if (this.adminAuthed) {
            this.currentAdminSubtab = subtab;
            this.switchMainView("admin");
            this.switchAdminSubtab(subtab);
        } else {
            this.pendingAdminSubtab = subtab;
            this.switchMainView("admin");
        }
    }

    switchAdminSubtab(subtab) {
        this.currentAdminSubtab = subtab;
        document.querySelectorAll(".admin-subtab").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.subtab === subtab);
        });
        document.querySelectorAll(".admin-pane").forEach(pane => {
            pane.style.display = (pane.id === `admin-pane-${subtab}`) ? "block" : "none";
        });
        if (subtab === "wards" && this.lastState) {
            this.renderWardManageTable(this.lastState.rooms, this.lastState.beds);
        } else if (subtab === "devices" && this.lastState) {
            this.renderMappingsTable(this.lastState.mappings);
            this.renderDiscoveredGatewaysTable(this.lastState.discovered_gateways);
        } else if (subtab === "drugs") {
            this.renderAdminDrugs();
        } else if (subtab === "license") {
            this.renderAdminLicense();
        }
    }

    startClock() {
        const update = () => {
            const now = new Date();
            const loc = this.lang === "en" ? "en-US" : "tr-TR";
            this.digitalClock.textContent = now.toLocaleTimeString(loc);
            this.digitalDate.textContent = now.toLocaleDateString(loc);
        };
        update();
        setInterval(update, 1000);
    }

    async pollLoop() {
        await this.fetchAndRender();
        await this.checkAdminStatus();
        setInterval(() => this.fetchAndRender(), 1000);
    }

    async fetchAndRender() {
        try {
            const res = await fetch("/api/state", { cache: "no-store" });
            if (!res.ok) return;
            const data = await res.json();
            this.renderDashboard(data);
        } catch (e) {
            this.updateBackendStatus(false, false, 0);
        }
    }

    updateBackendStatus(xmlConnected, mqttConnected, comCount) {
        this.backendStatusPill.className = xmlConnected ? "status-tag" : "status-tag disconnected";
        this.backendStatusText.textContent = xmlConnected ? this.t("xmlConnected") : this.t("xmlClosed");

        this.mqttStatusPill.className = mqttConnected ? "status-tag" : "status-tag disconnected";
        this.mqttStatusText.textContent = mqttConnected ? this.t("mqttConnected") : this.t("mqttWaiting");

        this.comStatusPill.className = comCount > 0 ? "status-tag" : "status-tag disconnected";
        this.comStatusText.textContent = this.t("comActive", { n: comCount });
    }

    setRoomFilter(roomId) {
        this.currentFilter = roomId;
        document.querySelectorAll(".room-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.room === roomId));
        if (this.lastState) this.renderRooms(this.lastState);
    }

    playAlarmSound() {
        if (this.audioMuted) return;
        try {
            if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.audioCtx.state === "suspended") this.audioCtx.resume();
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.setValueAtTime(660, now + 0.16);
            osc.frequency.setValueAtTime(880, now + 0.32);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.5);
        } catch (e) { }
    }

    renderDashboard(state) {
        this.lastState = state;

        // Update header facility/department branding
        const fac = (state.facility_name || "").trim();
        const rawDept = (state.department_name || "").trim();
        const isDefaultDept = !rawDept || rawDept === "İNFÜZYON İZLEM VE KONTROL SİSTEMİ";
        const dept = isDefaultDept ? this.t("defaultDepartment") : rawDept;
        const brandTitle = fac || this.t("defaultBrandTitle");
        if (this.headerFacilityName) this.headerFacilityName.textContent = brandTitle;
        if (this.headerDepartmentName) this.headerDepartmentName.textContent = dept;
        if (this.headerBrandMark) {
            this.headerBrandMark.textContent = (fac ? fac[0] : (this.lang === "en" ? "W" : "M")).toUpperCase();
        }
        document.title = fac ? `${fac} — ${this.t("defaultBrandTitle")}` : this.t("defaultBrandTitle");

        const lic = state.license || {};
        if (!lic.valid) {
            this.licenseLockOverlay.style.display = "flex";
            this.lockReasonText.textContent = lic.message || `(${lic.reason})`;
            this.lockHwidCode.textContent = lic.hwid || "---";
            this.licenseBadgeText.textContent = this.t("licLocked");
            return;
        } else {
            this.licenseLockOverlay.style.display = "none";
            this.licenseBadgeText.textContent = this.t("licActiveDays", { n: lic.days_left });
        }

        const comCount = (state.mappings || []).filter(m => m.source_type === "DIRECT_COM").length;
        this.updateBackendStatus(state.connected_to_xml, state.connected_to_mqtt, comCount);

        const alarmCount = state.alarms_count || 0;
        this.alarmCountText.textContent = this.t("alarmCount", { n: alarmCount });
        if (alarmCount > 0) {
            this.alarmPill.className = "alarm-box active-alarm";
            this.alarmsBanner.style.display = "block";
            this.alarmBannerList.innerHTML = state.active_alarms.map(a => `[${this.escapeHtml(a.text || a.code)}]`).join("  |  ");
            if (alarmCount > this.lastAlarmCount) this.playAlarmSound();
        } else {
            this.alarmPill.className = "alarm-box normal";
            this.alarmsBanner.style.display = "none";
        }
        this.lastAlarmCount = alarmCount;

        this.updateRoomTabs(state.rooms, state.beds);
        this.syncSelectDropdowns(state.rooms, state.beds);

        if (this.currentView === "ward") this.renderRooms(state);
        if (this.currentView === "map") this.renderFloorMap(state);
        if (this.currentView === "admin" && this.adminAuthed) {
            this.renderWardManageTable(state.rooms, state.beds);
            this.renderMappingsTable(state.mappings);
            this.renderDiscoveredGatewaysTable(state.discovered_gateways);
        }
    }

    updateRoomTabs(rooms, beds) {
        this.totalBedsBadge.textContent = beds ? beds.length : 0;
        const roomBtns = rooms.map(r => {
            const cnt = (beds || []).filter(b => b.room_id === r.id).length;
            const active = (this.currentFilter === String(r.id)) ? "active" : "";
            return `<button class="room-tab ${active}" data-room="${r.id}">${this.escapeHtml(r.name)} <span class="tab-badge">${cnt}</span></button>`;
        }).join("");
        const allActive = (this.currentFilter === "ALL") ? "active" : "";
        this.roomTabs.innerHTML = `<button class="room-tab ${allActive}" data-room="ALL">${this.t("roomAll")} <span class="tab-badge">${beds ? beds.length : 0}</span></button>${roomBtns}`;
    }

    syncSelectDropdowns(rooms, beds) {
        const bw = this.t("bedWord");
        if (this.newBedRoomSelect) {
            const prevR = this.newBedRoomSelect.value;
            this.newBedRoomSelect.innerHTML = (rooms || []).map(r => `<option value="${r.id}">${this.escapeHtml(r.name)}</option>`).join("");
            if (prevR && [...this.newBedRoomSelect.options].some(o => o.value === prevR)) this.newBedRoomSelect.value = prevR;
        }
        if (this.mapBedSelect) {
            const prevB = this.mapBedSelect.value;
            this.mapBedSelect.innerHTML = (beds || []).map(b => `<option value="${this.escapeHtml(b.name)}">${bw} ${this.escapeHtml(b.name)} (${this.escapeHtml(b.room_name)})</option>`).join("");
            if (prevB && [...this.mapBedSelect.options].some(o => o.value === prevB)) this.mapBedSelect.value = prevB;
        }
    }

    renderRooms(state) {
        const rooms = state.rooms || [];
        const beds = state.beds || [];

        if (rooms.length === 0 || beds.length === 0) {
            this.roomsContainer.innerHTML = `
            <div class="empty-ward-notice">
                <h3>${this.t("emptyWardTitle")}</h3>
                <p style="margin-bottom: 14px;">${this.t("emptyWardDesc")}</p>
                <button class="btn-ctrl btn-primary-solid" onclick="window.app.openAdminSection('wards')">${this.t("btnOpenWardAdmin")}</button>
            </div>`;
            return;
        }

        let html = "";
        rooms.forEach(room => {
            if (this.currentFilter !== "ALL" && String(room.id) !== this.currentFilter) return;
            const roomBeds = beds.filter(b => b.room_id === room.id);
            html += `
            <section class="room-section" id="room-sec-${room.id}">
                <div class="room-header">
                    <h2 class="room-title">${this.escapeHtml(room.name)}</h2>
                    <span class="room-bed-count">${this.t("bedCountBadge", { n: roomBeds.length })}</span>
                </div>
                <div class="beds-grid">
                    ${roomBeds.length > 0 ? roomBeds.map(b => this.renderBedCard(b)).join("") : `<div class="empty-bed-slot">${this.t("noBedsInRoom")} <button class="btn-ctrl" onclick="window.app.openAdminSection('wards')">${this.t("btnAddBedAdmin")}</button></div>`}
                </div>
            </section>`;
        });
        this.roomsContainer.innerHTML = html;
    }

    renderBedCard(bed) {
        const hasAlarm = bed.alarms && bed.alarms.length > 0;
        const patientName = bed.patient ? bed.patient.name : `${this.t("bedWord")} ${bed.name}`;
        const patientId = bed.patient && bed.patient.protocol_no ? `${this.t("protocolPrefix")} ${bed.patient.protocol_no}` : this.t("noPatientRecord");

        let sourceBadgeHtml = `<span class="source-badge">${this.t("noConnection")}</span>`;
        if (bed.mapping) {
            const m = bed.mapping;
            const tag = m.source_type === "GATEWAY" ? "GW" : m.source_type === "DIRECT_COM" ? "COM" : m.source_type === "DOCK_IP" ? "DOK" : "SN";
            const stateTxt = m.is_online ? this.t("onlineBadge") : this.t("waitingBadge");
            sourceBadgeHtml = `<span class="source-badge">[${tag}] ${this.escapeHtml(m.address)} (${stateTxt})</span>`;
        }

        return `
        <div class="bed-card ${hasAlarm ? 'has-alarm' : ''}" data-bed-name="${this.escapeHtml(bed.name)}">
            <div class="bed-card-header" onclick="window.app.openBedDetailModal('${this.escapeHtml(bed.name)}')">
                <div class="bed-badge-group">
                    <span class="bed-number">${this.escapeHtml(bed.name)}</span>
                    ${sourceBadgeHtml}
                </div>
                <div class="patient-info">
                    <div class="patient-name">${this.escapeHtml(patientName)}</div>
                    <div class="patient-id">${this.escapeHtml(patientId)} | ${bed.total_volume_ml || 0} ml</div>
                </div>
            </div>
            <div class="bed-body">
                ${bed.pumps && bed.pumps.length > 0 ?
                bed.pumps.map(p => this.renderPumpCard(p)).join("") :
                this.renderEmptyBed(bed.name, bed.mapping)
            }
            </div>
        </div>`;
    }

    renderEmptyBed(bedName, mapping) {
        if (mapping) {
            return `
            <div class="empty-bed-slot">
                <span>${this.t("deviceBoundWaiting", { addr: this.escapeHtml(mapping.address) })}</span>
                <button class="btn-ctrl" onclick="window.app.openAdminSection('devices')">${this.t("btnConnStatus")}</button>
            </div>`;
        }
        return `
        <div class="empty-bed-slot">
            <span>${this.t("noPumpBound")}</span>
            <button class="btn-ctrl btn-primary-solid" onclick="window.app.quickBindDevice('${this.escapeHtml(bedName)}')">${this.t("btnBindDevice")}</button>
        </div>`;
    }

    renderPumpCard(pump) {
        const isAlarm = pump.status === "ALARM" || pump.alarm !== null;
        const isInfusing = pump.status === "INFUSING" || pump.status === "RUNNING";
        const nearEnd = pump.near_end;
        const dersWarn = pump.ders_warning;

        let statusClass = "status-standby";
        let statusBadgeClass = "status-badge-standby";
        let statusLabel = this.t("stStandby");

        if (pump.status === "OFFLINE") {
            statusClass = "status-near-end";
            statusBadgeClass = "status-badge-warning";
            statusLabel = this.t("stOffline");
        } else if (isAlarm) {
            statusClass = "status-alarm";
            statusBadgeClass = "status-badge-alarm";
            statusLabel = this.t("stAlarm");
        } else if (nearEnd) {
            statusClass = "status-near-end";
            statusBadgeClass = "status-badge-warning";
            statusLabel = this.t("stMinLeft", { m: pump.near_end_min });
        } else if (isInfusing) {
            statusClass = "status-infusing";
            statusBadgeClass = "status-badge-running";
            statusLabel = this.t("stInfusing");
        }

        const vol = pump.volume_infused || 0;
        const vtbi = pump.vtbi || 100;
        const pct = Math.min(100, Math.round((vol / vtbi) * 100));
        const timeStr = this.formatTime(pump.time_remaining_sec);

        return `
        <div class="pump-card ${statusClass}" id="pump-${this.escapeHtml(pump.id)}">
            <div class="pump-top-row">
                <div>
                    <span class="pump-model">${this.escapeHtml(pump.model || 'Infusion Pump')}</span>
                    <span class="pump-serial">${this.escapeHtml(pump.serial || '')}</span>
                </div>
                <span class="pump-status-badge ${statusBadgeClass}">${statusLabel}</span>
            </div>

            <div class="pump-drug-row">
                <span class="drug-name">${this.escapeHtml(pump.drug_name || this.t("undefinedVal"))}</span>
                <span class="drug-conc">${this.escapeHtml(pump.drug_concentration || '')}</span>
            </div>

            ${dersWarn ? `<div class="ders-alert-bar ${dersWarn.level === 'HARD' ? 'ders-hard' : 'ders-soft'}">DERS: ${this.escapeHtml(dersWarn.message)}</div>` : ''}

            <div class="pump-telemetry-grid">
                <div class="rate-box">
                    <span class="rate-label">${this.t("rateLabel")}</span>
                    <div class="rate-value-group">
                        <span class="rate-number">${(pump.rate || 0).toFixed(1)}</span>
                        <span class="rate-unit">${this.escapeHtml(pump.rate_unit || 'ml/h')}</span>
                    </div>
                </div>
                <div class="vol-remaining-box">
                    <div class="metric-item"><span class="metric-label">${this.t("givenLabel")}</span><span class="metric-val">${vol.toFixed(1)} ml</span></div>
                    <div class="metric-item"><span class="metric-label">${this.t("vtbiLabel")}</span><span class="metric-val">${vtbi.toFixed(0)} ml</span></div>
                    <div class="metric-item"><span class="metric-label">${this.t("remLabel")}</span><span class="metric-val">${timeStr}</span></div>
                </div>
            </div>

            <div class="progress-track">
                <div class="progress-bar ${isInfusing ? 'infusing' : ''}" style="width: ${pct}%"></div>
            </div>

            <div class="pump-meta-row">
                <div class="pressure-gauge">
                    <span>${this.t("pressureLabel")}</span>
                    <div class="pressure-bars">${this.renderPressureBars(pump.pressure_level || 1)}</div>
                </div>
                <span>${pump.ac_power ? 'AC' : 'BAT'} | %${pump.battery || 100}</span>
            </div>

            ${isAlarm && pump.alarm ? `<div class="alarm-strip">ALARM: ${this.escapeHtml(pump.alarm.text || pump.alarm.code)}</div>` : ''}
        </div>`;
    }

    renderPressureBars(level) {
        let html = "";
        for (let i = 1; i <= 8; i++) {
            let cls = "";
            if (i <= level) {
                if (i <= 4) cls = "active-green";
                else if (i <= 6) cls = "active-yellow";
                else cls = "active-red";
            }
            html += `<span class="p-bar ${cls}"></span>`;
        }
        return html;
    }

    formatTime(seconds) {
        if (!seconds || seconds <= 0) return "--:--";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return h > 0 ? `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // ADMIN WARD TABLE & ACTIONS
    renderWardManageTable(rooms, beds) {
        if (!this.wardBedsManageBody) return;
        const rows = [];
        const bw = this.t("bedWord");
        (rooms || []).forEach(r => {
            const rb = (beds || []).filter(b => b.room_id === r.id);
            if (rb.length === 0) {
                rows.push(`<tr><td><strong>${this.escapeHtml(r.name)}</strong></td><td style="color:#657487;">-</td><td><button class="btn-table-action" onclick="window.app.deleteRoom(${r.id})">${this.t("btnDeleteRoom")}</button></td></tr>`);
            } else {
                rb.forEach(b => {
                    rows.push(`<tr><td>${this.escapeHtml(r.name)}</td><td><strong>${bw} ${this.escapeHtml(b.name)}</strong></td><td><button class="btn-table-action" onclick="window.app.deleteBed('${this.escapeHtml(b.name)}')">${this.t("btnDeleteBed")}</button></td></tr>`);
                });
            }
        });
        this.wardBedsManageBody.innerHTML = rows.length ? rows.join("") : `<tr><td colspan="3" style="text-align:center;color:#657487;">${this.t("noWardsSaved")}</td></tr>`;
    }

    async deleteRoom(roomId) {
        if (!confirm(this.t("confirmDeleteRoom"))) return;
        try {
            await this.adminFetch(`/api/rooms/${roomId}`, { method: "DELETE" });
            await this.fetchAndRender();
        } catch (err) { }
    }

    async deleteBed(bedName) {
        if (!confirm(this.t("confirmDeleteBed", { bed: bedName }))) return;
        try {
            await this.adminFetch(`/api/beds/${encodeURIComponent(bedName)}`, { method: "DELETE" });
            await this.fetchAndRender();
        } catch (err) { }
    }

    // FLOOR MAP
    renderFloorMap(state) {
        const beds = state.beds || [];
        if (beds.length === 0) {
            this.wardFloorCanvas.innerHTML = `<div style="padding:40px;color:#657487;text-align:center;">${this.t("noFloorBeds")}</div>`;
            return;
        }
        const bw = this.t("bedWord").toUpperCase();
        this.wardFloorCanvas.innerHTML = beds.map((b, idx) => {
            const x = b.posX != null ? b.posX : ((idx % 4) * 230 + 30);
            const y = b.posY != null ? b.posY : (Math.floor(idx / 4) * 140 + 30);
            const hasAlarm = b.alarms && b.alarms.length > 0;
            const activePumps = (b.pumps || []).filter(p => p.status === "INFUSING" || p.status === "RUNNING").length;
            const patName = b.patient ? b.patient.name : this.t("undefinedVal");
            return `
            <div class="floor-bed-node ${hasAlarm ? 'node-alarm' : activePumps > 0 ? 'node-active' : ''}"
                 style="left: ${x}px; top: ${y}px;"
                 onclick="window.app.openBedDetailModal('${this.escapeHtml(b.name)}')">
                <div class="node-head"><span>${bw} ${this.escapeHtml(b.name)}</span><span>${hasAlarm ? 'ALARM' : activePumps > 0 ? this.t("floorActive") : this.t("floorEmpty")}</span></div>
                <div class="node-patient">${this.escapeHtml(patName)}</div>
                <div class="node-stats">${(b.pumps || []).length} | ${b.total_rate_mlh || 0} ml/h</div>
            </div>`;
        }).join("");
    }

    // DRUG LIBRARY (PUBLIC READ-ONLY VIEW + ADMIN TABLE)
    async loadDrugsView() {
        const res = await fetch("/api/drugs");
        const drugs = await res.json();
        this.drugsTableBody.innerHTML = drugs.map(d => `
            <tr>
                <td><strong>${this.escapeHtml(d.name)}</strong></td>
                <td>${this.escapeHtml(d.category || '-')}</td>
                <td>${this.escapeHtml(d.default_conc || '-')}</td>
                <td>${d.soft_min}</td>
                <td>${d.soft_max}</td>
                <td><strong style="color:#f87171;">${d.hard_max}</strong></td>
                <td>${this.escapeHtml(d.unit)}</td>
            </tr>
        `).join("");
    }

    async renderAdminDrugs() {
        if (!this.adminDrugsTableBody) return;
        const res = await fetch("/api/drugs");
        const drugs = await res.json();
        this.adminDrugsTableBody.innerHTML = drugs.map(d => `
            <tr>
                <td><strong>${this.escapeHtml(d.name)}</strong></td>
                <td>${this.escapeHtml(d.category || '-')}</td>
                <td>${d.soft_min} – ${d.soft_max}</td>
                <td><strong style="color:#f87171;">${d.hard_max} ${this.escapeHtml(d.unit)}</strong></td>
                <td><button class="btn-table-action" onclick="window.app.deleteDrug('${this.escapeHtml(d.id)}')">${this.t("btnDelete")}</button></td>
            </tr>
        `).join("");
    }

    async deleteDrug(drugId) {
        if (!confirm(this.t("confirmDeleteDrug"))) return;
        try {
            await this.adminFetch(`/api/drugs/${encodeURIComponent(drugId)}`, { method: "DELETE" });
            await this.fetchAndRender();
            this.renderAdminDrugs();
        } catch (err) { }
    }

    // HISTORY
    async loadHistoryView() {
        const sev = this.historySeverityFilter.value || "ALL";
        const res = await fetch(`/api/history?severity=${encodeURIComponent(sev)}&limit=150`);
        const logs = await res.json();
        this.historyTableBody.innerHTML = logs.map(l => `
            <tr>
                <td><code>${this.escapeHtml(l.time_str)}</code></td>
                <td><strong>${this.escapeHtml(l.bed_name)}</strong></td>
                <td>${this.escapeHtml(l.pump_serial)}</td>
                <td>${this.escapeHtml(l.event_type)}</td>
                <td><span class="${l.severity === 'HIGH' ? 'badge-sev-high' : 'badge-sev-info'}">${this.escapeHtml(l.severity)}</span></td>
                <td>${this.escapeHtml(l.description)}</td>
                <td>${l.rate ? l.rate + ' ml/h' : '-'}</td>
                <td>${l.volume ? l.volume + ' ml' : '-'}</td>
            </tr>
        `).join("");
    }

    // REPORTS
    async loadReportsView() {
        const res = await fetch("/api/reports/summary");
        const r = await res.json();
        const alarmRows = Object.entries(r.alarm_distribution || {}).map(([k, v]) => `<div class="report-kv-row"><span>${this.escapeHtml(k)}</span><strong>${v}</strong></div>`).join("");
        const bedRows = (r.fluid_balance_by_bed || []).map(b => `
            <tr><td><strong>${this.escapeHtml(b.bed_name)}</strong></td><td>${this.escapeHtml(b.patient_name)}</td><td>${b.pumps_count}</td><td>${b.active_rate_mlh} ml/h</td><td><strong>${b.total_volume_ml} ml</strong></td></tr>
        `).join("");

        this.reportsContainer.innerHTML = `
            <div class="report-kpi-row">
                <div class="kpi-card"><span>${this.t("kpiActivePumps")}</span><strong>${r.active_pumps_count}</strong></div>
                <div class="kpi-card"><span>${this.t("kpiTotalRate")}</span><strong>${r.total_ward_rate_mlh} ml/h</strong></div>
                <div class="kpi-card"><span>${this.t("kpiTotalVol")}</span><strong>${r.total_ward_volume_ml} ml</strong></div>
                <div class="kpi-card"><span>${this.t("kpiDersComp")}</span><strong>%${r.ders_compliance_pct}</strong></div>
            </div>
            <div class="report-panels-2">
                <div class="report-box">
                    <h3 style="margin-bottom:8px;">${this.t("repFluidByBed")}</h3>
                    <table class="clinical-table"><thead><tr><th>${this.t("thBed")}</th><th>${this.t("lblPatName")}</th><th>${this.t("repThPump")}</th><th>${this.t("repThRate")}</th><th>${this.t("repThTotal")}</th></tr></thead><tbody>${bedRows || `<tr><td colspan="5">${this.t("noData")}</td></tr>`}</tbody></table>
                </div>
                <div class="report-box">
                    <h3 style="margin-bottom:8px;">${this.t("repAlarmDist")}</h3>
                    ${alarmRows}
                </div>
            </div>`;
    }

    // BED DETAIL MODAL (BEDSIDE CLINICAL WORKFLOW)
    openBedDetailModal(bedName) {
        if (!this.lastState) return;
        const bed = (this.lastState.beds || []).find(b => b.name === bedName);
        if (!bed) return;
        const pat = bed.patient || {};
        this.bedDetailTitle.textContent = `${this.t("bedWord").toUpperCase()} ${bed.name} (${bed.room_name})`;
        this.bedDetailSub.textContent = `${this.t("givenLabel")} ${bed.total_volume_ml || 0} ml | ${this.t("rateLabel")}: ${bed.total_rate_mlh || 0} ml/h`;

        const pumpsHtml = (bed.pumps || []).length > 0 ? bed.pumps.map(p => this.renderPumpCard(p)).join("") : `<p style="color:#657487;">${this.t("noPumpData")}</p>`;
        this.bedDetailBody.innerHTML = `
            <div class="bed-detail-grid">
                <div class="report-box">
                    <h4 style="margin-bottom:10px;color:#2ea8db;">${this.t("patientFormTitle")}</h4>
                    <form id="patientEditForm" class="modal-form">
                        <div class="form-row"><label>${this.t("lblPatName")}</label><input type="text" id="patNameInput" value="${this.escapeHtml(pat.name || '')}" required></div>
                        <div class="form-row grid-2">
                            <div><label>${this.t("lblPatProto")}</label><input type="text" id="patProtoInput" value="${this.escapeHtml(pat.protocol_no || '')}"></div>
                            <div><label>${this.t("lblPatWeight")}</label><input type="number" id="patWeightInput" value="${pat.weight_kg || ''}"></div>
                        </div>
                        <div class="form-row"><label>${this.t("lblPatNote")}</label><input type="text" id="patNoteInput" value="${this.escapeHtml(pat.note || '')}"></div>
                        <div style="display:flex;gap:8px;margin-top:6px;">
                            <button type="submit" class="btn-ctrl btn-primary-solid">${this.t("btnSavePatient")}</button>
                            <button type="button" class="btn-ctrl" onclick="window.app.resetBedVolume('${this.escapeHtml(bed.name)}')">${this.t("btnResetVol24h")}</button>
                        </div>
                    </form>
                </div>
                <div class="report-box">
                    <h4 style="margin-bottom:10px;color:#2ea8db;">${this.t("channelsTitle")} (${(bed.pumps || []).length})</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">${pumpsHtml}</div>
                </div>
            </div>`;

        document.getElementById("patientEditForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            await fetch(`/api/beds/${encodeURIComponent(bed.name)}/patient`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: document.getElementById("patNameInput").value,
                    protocol_no: document.getElementById("patProtoInput").value,
                    weight_kg: parseFloat(document.getElementById("patWeightInput").value) || null,
                    note: document.getElementById("patNoteInput").value
                })
            });
            this.bedDetailModal.style.display = "none";
            await this.fetchAndRender();
        });
        this.bedDetailModal.style.display = "flex";
    }

    async resetBedVolume(bedName) {
        if (!confirm(this.t("confirmResetVol", { bed: bedName }))) return;
        await fetch(`/api/beds/${encodeURIComponent(bedName)}/reset_volume`, { method: "POST" });
        this.bedDetailModal.style.display = "none";
        await this.fetchAndRender();
    }

    // LICENSE INFO MODAL & ADMIN LICENSE PANE
    async openLicenseInfoModal() {
        const res = await fetch("/api/license/status");
        const lic = await res.json();
        this.licenseInfoBody.innerHTML = `
            <div class="report-kv-row"><span>${this.t("licRowStatus")}</span><strong style="color:#4ade80;">${lic.valid ? this.t("licStatusValid") : this.t("licStatusInvalid")}</strong></div>
            <div class="report-kv-row"><span>${this.t("licRowCustomer")}</span><strong>${this.escapeHtml(lic.customer)}</strong></div>
            <div class="report-kv-row"><span>${this.t("licRowHwid")}</span><code>${this.escapeHtml(lic.hwid)}</code></div>
            <div class="report-kv-row"><span>${this.t("licRowMaxBeds")}</span><strong>${lic.max_beds} ${this.t("bedWord")}</strong></div>
            <div class="report-kv-row"><span>${this.t("licRowExpires")}</span><strong>${this.escapeHtml(lic.expires_date)} (${lic.days_left} ${this.t("daysUnit")})</strong></div>`;
        this.licenseInfoModal.style.display = "flex";
    }

    async renderAdminLicense() {
        if (!this.adminLicenseBody) return;
        const res = await fetch("/api/license/status");
        const lic = await res.json();
        this.adminLicenseBody.innerHTML = `
            <div class="report-kv-row"><span>${this.t("licRowStatus")}</span><strong style="color:${lic.valid ? '#4ade80' : '#f87171'};">${lic.valid ? this.t("licStatusValid") : this.t("licStatusInvalid")}</strong></div>
            <div class="report-kv-row"><span>${this.t("licRowCustomer")}</span><strong>${this.escapeHtml(lic.customer || '-')}</strong></div>
            <div class="report-kv-row">
                <span>${this.t("licRowHwid")}</span>
                <span style="display:flex;gap:8px;align-items:center;">
                    <code>${this.escapeHtml(lic.hwid)}</code>
                    <button type="button" class="btn-table-action" onclick="window.app.copyText('${this.escapeHtml(lic.hwid)}', this)">${this.t("btnCopy")}</button>
                </span>
            </div>
            <div class="report-kv-row"><span>${this.t("licRowMaxBeds")}</span><strong>${lic.max_beds} ${this.t("bedWord")}</strong></div>
            <div class="report-kv-row"><span>${this.t("licRowExpires")}</span><strong>${this.escapeHtml(lic.edition || '-')} · ${this.escapeHtml(lic.expires_date || '-')} (${lic.days_left || 0} ${this.t("daysUnit")})</strong></div>`;
    }

    copyText(text, btn) {
        if (navigator.clipboard) navigator.clipboard.writeText(text);
        if (btn) {
            const orig = btn.textContent;
            btn.textContent = this.t("btnCopied");
            setTimeout(() => { btn.textContent = orig; }, 1800);
        }
    }

    // ADMIN DEVICE MAPPINGS & GATEWAY DISCOVERY
    renderMappingsTable(mappings) {
        if (!mappings || !this.mappingsTableBody) return;
        this.activeMappingsCount.textContent = mappings.length;
        if (mappings.length === 0) {
            this.mappingsTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#657487;padding:20px;">${this.t("noMappingsSaved")}</td></tr>`;
            return;
        }
        const loc = this.lang === "en" ? "en-US" : "tr-TR";
        const typeMap = {
            GATEWAY: this.t("srcTypeGateway"),
            DIRECT_COM: this.t("srcTypeCom"),
            DOCK_IP: this.t("srcTypeDock"),
            PUMP_SN: this.t("srcTypeSn")
        };
        this.mappingsTableBody.innerHTML = mappings.map(m => {
            const lastSeenStr = m.last_seen > 0 ? new Date(m.last_seen * 1000).toLocaleTimeString(loc) : this.t("waitingForData");
            const statusBadge = m.is_online ? `<span class="badge-online">${this.t("onlineBadge")}</span>` : `<span class="badge-offline">${this.t("waitingBadge")}</span>`;
            return `
            <tr>
                <td><strong>${this.t("bedWord")} ${this.escapeHtml(m.bed_name)}</strong></td>
                <td>${typeMap[m.source_type] || this.escapeHtml(m.source_type)}</td>
                <td><code>${this.escapeHtml(m.address)}</code></td>
                <td>${this.escapeHtml(m.model || '-')}</td>
                <td>${this.escapeHtml(m.label || m.drug_name || '-')}</td>
                <td>${lastSeenStr}</td>
                <td>${statusBadge}</td>
                <td><button class="btn-table-action" onclick="window.app.deleteMapping('${this.escapeHtml(m.bed_name)}')">${this.t("btnRemove")}</button></td>
            </tr>`;
        }).join("");
    }

    renderDiscoveredGatewaysTable(gateways) {
        if (!gateways || !this.discoveredGatewaysTableBody) return;
        this.discoveredGatewaysCount.textContent = gateways.length;
        if (gateways.length === 0) {
            this.discoveredGatewaysTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#657487;padding:20px;">${this.t("noMqttGateways")}</td></tr>`;
            return;
        }
        const loc = this.lang === "en" ? "en-US" : "tr-TR";
        this.discoveredGatewaysTableBody.innerHTML = gateways.map(g => {
            const timeStr = g.last_seen > 0 ? new Date(g.last_seen * 1000).toLocaleTimeString(loc) : "-";
            const mappedText = g.mapped_bed ? `${this.t("bedWord")} ${this.escapeHtml(g.mapped_bed)}` : this.t("unmappedBed");
            return `
            <tr>
                <td><code>${this.escapeHtml(g.address)}</code></td>
                <td>${timeStr}</td>
                <td>${this.escapeHtml(g.device_label || g.device_type)}</td>
                <td><small>${this.escapeHtml((g.last_payload || "").slice(0, 48))}</small></td>
                <td>${mappedText}</td>
                <td><button class="btn-table-bind" onclick="window.app.quickBindGateway('${this.escapeHtml(g.address)}', '${this.escapeHtml(g.device_type || '')}')">${this.t("btnTransferToForm")}</button></td>
            </tr>`;
        }).join("");
    }

    quickBindGateway(gwAddr, devType) {
        if (devType && devType !== "INFUSION_PUMP") {
            if (!confirm(this.t("confirmBindNonPump", { gw: gwAddr, type: devType }))) return;
        }
        this.openAdminSection("devices");
        this.mapSourceTypeSelect.value = "GATEWAY";
        this.updateMappingAddressHints();
        this.mapAddressInput.value = gwAddr;
        this.mapLabelInput.value = `GW ${gwAddr}`;
    }

    quickBindDevice(bedName) {
        this.openAdminSection("devices");
        if (this.mapBedSelect) this.mapBedSelect.value = bedName;
    }

    async deleteMapping(bedName) {
        if (!confirm(this.t("confirmDeleteMapping", { bed: bedName }))) return;
        try {
            await this.adminFetch(`/api/mappings/${encodeURIComponent(bedName)}`, { method: "DELETE" });
            await this.fetchAndRender();
        } catch (err) { }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.app = new MerkeziIzlemApp();
});
