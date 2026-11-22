// ========================================================
// MERKEZİ İZLEM — ENDÜSTRİYEL KLİNİK İSTEMCİ
// ========================================================

class MerkeziIzlemApp {
    constructor() {
        this.currentFilter = "ALL";
        this.currentView = "ward";
        this.audioMuted = false;
        this.lastState = null;
        this.audioCtx = null;
        this.lastAlarmCount = 0;

        this.initDOMElements();
        this.initEventListeners();
        this.startClock();
        this.pollLoop();
    }

    initDOMElements() {
        this.backendStatusPill = document.getElementById("backendStatusPill");
        this.backendStatusText = document.getElementById("backendStatusText");
        this.mqttStatusPill = document.getElementById("mqttStatusPill");
        this.mqttStatusText = document.getElementById("mqttStatusText");
        this.comStatusPill = document.getElementById("comStatusPill");
        this.comStatusText = document.getElementById("comStatusText");
        this.btnLicenseBadge = document.getElementById("btnLicenseBadge");
        this.licenseBadgeText = document.getElementById("licenseBadgeText");

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
        this.historyTableBody = document.getElementById("historyTableBody");
        this.historySeverityFilter = document.getElementById("historySeverityFilter");
        this.btnRefreshHistory = document.getElementById("btnRefreshHistory");
        this.reportsContainer = document.getElementById("reportsContainer");
        this.btnRefreshReports = document.getElementById("btnRefreshReports");

        // Ward Manager Modal
        this.btnOpenWardMgr = document.getElementById("btnOpenWardMgr");
        this.wardMgrModal = document.getElementById("wardMgrModal");
        this.btnCloseWardMgrModal = document.getElementById("btnCloseWardMgrModal");
        this.addRoomForm = document.getElementById("addRoomForm");
        this.newRoomNameInput = document.getElementById("newRoomNameInput");
        this.addBedForm = document.getElementById("addBedForm");
        this.newBedRoomSelect = document.getElementById("newBedRoomSelect");
        this.newBedNameInput = document.getElementById("newBedNameInput");
        this.wardBedsManageBody = document.getElementById("wardBedsManageBody");

        // Device Manager Modal
        this.btnOpenDeviceMgr = document.getElementById("btnOpenDeviceMgr");
        this.deviceMgrModal = document.getElementById("deviceMgrModal");
        this.btnCloseDeviceMgrModal = document.getElementById("btnCloseDeviceMgrModal");
        this.btnGoToAddNew = document.getElementById("btnGoToAddNew");
        this.activeMappingsCount = document.getElementById("activeMappingsCount");
        this.discoveredPisCount = document.getElementById("discoveredPisCount");
        this.mappingsTableBody = document.getElementById("mappingsTableBody");
        this.discoveredPisTableBody = document.getElementById("discoveredPisTableBody");
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
        this.btnCancelMapping = document.getElementById("btnCancelMapping");

        // Bed Detail & Drug & License Modals
        this.bedDetailModal = document.getElementById("bedDetailModal");
        this.bedDetailTitle = document.getElementById("bedDetailTitle");
        this.bedDetailSub = document.getElementById("bedDetailSub");
        this.bedDetailBody = document.getElementById("bedDetailBody");
        this.btnCloseBedDetailModal = document.getElementById("btnCloseBedDetailModal");

        this.addDrugModal = document.getElementById("addDrugModal");
        this.btnOpenAddDrugModal = document.getElementById("btnOpenAddDrugModal");
        this.btnCloseAddDrugModal = document.getElementById("btnCloseAddDrugModal");
        this.btnCancelDrugModal = document.getElementById("btnCancelDrugModal");
        this.addDrugForm = document.getElementById("addDrugForm");

        this.licenseInfoModal = document.getElementById("licenseInfoModal");
        this.licenseInfoBody = document.getElementById("licenseInfoBody");
        this.btnCloseLicenseModal = document.getElementById("btnCloseLicenseModal");
    }

    initEventListeners() {
        this.btnAudioMute.addEventListener("click", () => {
            this.audioMuted = !this.audioMuted;
            this.btnAudioMute.textContent = this.audioMuted ? "SES: KAPALI" : "SES: AÇIK";
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

        this.btnCopyHwid.addEventListener("click", () => {
            const code = this.lockHwidCode.textContent;
            if (navigator.clipboard) navigator.clipboard.writeText(code);
            this.btnCopyHwid.textContent = "KOPYALANDI";
            setTimeout(() => { this.btnCopyHwid.textContent = "KOPYALA"; }, 2000);
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
                alert("Lisans doğrulanamadı: " + (data.message || data.reason));
            }
        });

        this.btnLicenseBadge.addEventListener("click", () => this.openLicenseInfoModal());
        this.btnCloseLicenseModal.addEventListener("click", () => { this.licenseInfoModal.style.display = "none"; });

        // Ward & Bed Manager
        this.btnOpenWardMgr.addEventListener("click", () => this.openWardMgrModal());
        this.btnCloseWardMgrModal.addEventListener("click", () => { this.wardMgrModal.style.display = "none"; });

        this.addRoomForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = this.newRoomNameInput.value.trim();
            if (!name) return;
            await fetch("/api/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });
            this.newRoomNameInput.value = "";
            await this.fetchAndRender();
        });

        this.addBedForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const room_id = parseInt(this.newBedRoomSelect.value, 10);
            const name = this.newBedNameInput.value.trim();
            if (!room_id || !name) return;
            const res = await fetch("/api/beds", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ room_id, name })
            });
            if (!res.ok) {
                const err = await res.json();
                alert(err.detail || "Yatak eklenemedi.");
                return;
            }
            this.newBedNameInput.value = "";
            await this.fetchAndRender();
        });

        // Device Manager Modal
        this.btnOpenDeviceMgr.addEventListener("click", () => this.openDeviceMgrModal("active-mappings"));
        this.btnCloseDeviceMgrModal.addEventListener("click", () => { this.deviceMgrModal.style.display = "none"; });
        this.btnCancelMapping.addEventListener("click", () => this.switchDeviceMgrTab("active-mappings"));
        this.btnGoToAddNew.addEventListener("click", () => this.switchDeviceMgrTab("add-mapping"));
        document.querySelectorAll(".modal-tab").forEach(tabBtn => {
            tabBtn.addEventListener("click", () => this.switchDeviceMgrTab(tabBtn.dataset.tab));
        });

        this.mapSourceTypeSelect.addEventListener("change", () => {
            const val = this.mapSourceTypeSelect.value;
            if (val === "PI_IP") {
                this.lblMapAddress.textContent = "Uç Ağ Geçidi IP Adresi (veya Çoklu Port için IP:PORT):";
                this.mapAddressInput.placeholder = "Örn: 192.168.1.50 veya 192.168.1.50:PORT1";
                this.hintMapAddress.textContent = "Uç ağ geçidi üzerindeki servis veriyi MQTT üzerinden bu adrese gönderir.";
            } else if (val === "DIRECT_COM") {
                this.lblMapAddress.textContent = "Doğrudan Seri Port Adı (Örn: COM3, COM4):";
                this.mapAddressInput.placeholder = "Örn: COM3";
                this.hintMapAddress.textContent = "Tek infüzyon pompası USB-RS232 kablosuyla doğrudan bu bilgisayara bağlıysa port adını yazın.";
            } else if (val === "DOCK_IP") {
                this.lblMapAddress.textContent = "LAN Dok İstasyonu IP Adresi:";
                this.mapAddressInput.placeholder = "Örn: 192.168.1.150";
                this.hintMapAddress.textContent = "Yerel ağdaki TCP/XML köprüsü üzerinden bağlanır.";
            } else {
                this.lblMapAddress.textContent = "Fiziksel Pompa Seri Numarası (SN):";
                this.mapAddressInput.placeholder = "Örn: 220145";
                this.hintMapAddress.textContent = "Pompa hangi porta veya doka takılırsa takılsın seri numarasından yatağa eşleşir.";
            }
        });

        this.saveMappingForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                bed_name: this.mapBedSelect.value,
                source_type: this.mapSourceTypeSelect.value,
                address: this.mapAddressInput.value.trim(),
                model: this.mapModelSelect.value,
                label: this.mapLabelInput.value.trim(),
                drug_name: this.mapDrugName.value.trim() || "Tanımsız",
                drug_concentration: this.mapDrugConc.value.trim() || ""
            };
            const res = await fetch("/api/mappings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const err = await res.json();
                alert(err.detail || "Kayıt reddedildi.");
                return;
            }
            this.switchDeviceMgrTab("active-mappings");
            await this.fetchAndRender();
        });

        // Bed Detail Modal Close
        this.btnCloseBedDetailModal.addEventListener("click", () => { this.bedDetailModal.style.display = "none"; });

        // Drug Library Modal & Form
        this.btnOpenAddDrugModal.addEventListener("click", () => { this.addDrugModal.style.display = "flex"; });
        this.btnCloseAddDrugModal.addEventListener("click", () => { this.addDrugModal.style.display = "none"; });
        this.btnCancelDrugModal.addEventListener("click", () => { this.addDrugModal.style.display = "none"; });
        this.addDrugForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById("drugNameInput").value,
                category: document.getElementById("drugCategoryInput").value,
                default_conc: document.getElementById("drugConcInput").value,
                soft_min: parseFloat(document.getElementById("drugSoftMinInput").value),
                soft_max: parseFloat(document.getElementById("drugSoftMaxInput").value),
                hard_max: parseFloat(document.getElementById("drugHardMaxInput").value),
                unit: "ml/h"
            };
            await fetch("/api/drugs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            this.addDrugModal.style.display = "none";
            this.loadDrugsView();
        });

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
    }

    startClock() {
        const update = () => {
            const now = new Date();
            this.digitalClock.textContent = now.toLocaleTimeString("tr-TR");
            this.digitalDate.textContent = now.toLocaleDateString("tr-TR");
        };
        update();
        setInterval(update, 1000);
    }

    async pollLoop() {
        await this.fetchAndRender();
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
        this.backendStatusText.textContent = xmlConnected ? "XML KÖPRÜ: BAĞLI" : "XML KÖPRÜ: KAPALI";

        this.mqttStatusPill.className = mqttConnected ? "status-tag" : "status-tag disconnected";
        this.mqttStatusText.textContent = mqttConnected ? "MQTT: BAĞLI" : "MQTT: BEKLİYOR";

        this.comStatusPill.className = comCount > 0 ? "status-tag" : "status-tag disconnected";
        this.comStatusText.textContent = `COM PORT: ${comCount} AKTİF`;
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
        const lic = state.license || {};

        if (!lic.valid) {
            this.licenseLockOverlay.style.display = "flex";
            this.lockReasonText.textContent = lic.message || `Güvenlik kilidi devrede (${lic.reason})`;
            this.lockHwidCode.textContent = lic.hwid || "---";
            this.licenseBadgeText.textContent = "LİSANS: KİLİTLİ";
            return;
        } else {
            this.licenseLockOverlay.style.display = "none";
            this.licenseBadgeText.textContent = `LİSANS: AKTİF (${lic.days_left} GÜN)`;
        }

        const comCount = (state.mappings || []).filter(m => m.source_type === "DIRECT_COM").length;
        this.updateBackendStatus(state.connected_to_xml, state.connected_to_mqtt, comCount);

        const alarmCount = state.alarms_count || 0;
        this.alarmCountText.textContent = `${alarmCount} ALARM`;
        if (alarmCount > 0) {
            this.alarmPill.className = "alarm-box active-alarm";
            this.alarmsBanner.style.display = "block";
            this.alarmBannerList.innerHTML = state.active_alarms.map(a => `[${a.text || a.code}]`).join("  |  ");
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

        if (this.wardMgrModal.style.display === "flex") {
            this.renderWardManageTable(state.rooms, state.beds);
        }
        if (this.deviceMgrModal.style.display === "flex") {
            this.renderMappingsTable(state.mappings);
            this.renderDiscoveredPisTable(state.discovered_pis);
        }
    }

    updateRoomTabs(rooms, beds) {
        this.totalBedsBadge.textContent = beds ? beds.length : 0;
        const roomBtns = rooms.map(r => {
            const cnt = (beds || []).filter(b => b.room_id === r.id).length;
            const active = (this.currentFilter === String(r.id)) ? "active" : "";
            return `<button class="room-tab ${active}" data-room="${r.id}">${r.name} <span class="tab-badge">${cnt}</span></button>`;
        }).join("");
        const allActive = (this.currentFilter === "ALL") ? "active" : "";
        this.roomTabs.innerHTML = `<button class="room-tab ${allActive}" data-room="ALL">TÜMÜ <span class="tab-badge">${beds ? beds.length : 0}</span></button>${roomBtns}`;
    }

    syncSelectDropdowns(rooms, beds) {
        if (this.newBedRoomSelect) {
            const prevR = this.newBedRoomSelect.value;
            this.newBedRoomSelect.innerHTML = (rooms || []).map(r => `<option value="${r.id}">${r.name}</option>`).join("");
            if (prevR && [...this.newBedRoomSelect.options].some(o => o.value === prevR)) this.newBedRoomSelect.value = prevR;
        }
        if (this.mapBedSelect) {
            const prevB = this.mapBedSelect.value;
            this.mapBedSelect.innerHTML = (beds || []).map(b => `<option value="${b.name}">Yatak ${b.name} (${b.room_name})</option>`).join("");
            if (prevB && [...this.mapBedSelect.options].some(o => o.value === prevB)) this.mapBedSelect.value = prevB;
        }
    }

    renderRooms(state) {
        const rooms = state.rooms || [];
        const beds = state.beds || [];

        if (rooms.length === 0 || beds.length === 0) {
            this.roomsContainer.innerHTML = `
            <div class="empty-ward-notice">
                <h3>SERVİS VE YATAK YAPISI HENÜZ OLUŞTURULMADI</h3>
                <p style="margin-bottom: 14px;">Bu sistemde ön tanımlı sahte demo kaydı bulunmamaktadır. Servis/Oda ve yataklarınızı ekledikten sonra Uç Ağ Geçidi, Doğrudan COM Port veya LAN Dok üzerinden gerçek cihaz bağlayabilirsiniz.</p>
                <button class="btn-ctrl btn-primary-solid" onclick="window.app.openWardMgrModal()">+ SERVİS VE YATAK EKLE</button>
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
                    <h2 class="room-title">${room.name}</h2>
                    <span class="room-bed-count">${roomBeds.length} YATAK</span>
                </div>
                <div class="beds-grid">
                    ${roomBeds.length > 0 ? roomBeds.map(b => this.renderBedCard(b)).join("") : `<div class="empty-bed-slot">Bu serviste tanımlı yatak yok. <button class="btn-ctrl" onclick="window.app.openWardMgrModal()">+ Yatak Ekle</button></div>`}
                </div>
            </section>`;
        });
        this.roomsContainer.innerHTML = html;
    }

    renderBedCard(bed) {
        const hasAlarm = bed.alarms && bed.alarms.length > 0;
        const patientName = bed.patient ? bed.patient.name : `Yatak ${bed.name}`;
        const patientId = bed.patient && bed.patient.protocol_no ? `Protokol: ${bed.patient.protocol_no}` : "Hasta kaydı yok";

        let sourceBadgeHtml = `<span class="source-badge">BAĞLANTI YOK</span>`;
        if (bed.mapping) {
            const m = bed.mapping;
            const tag = m.source_type === "PI_IP" ? "PI" : m.source_type === "DIRECT_COM" ? "COM" : m.source_type === "DOCK_IP" ? "DOK" : "SN";
            const stateTxt = m.is_online ? "CANLI" : "BEKLİYOR";
            sourceBadgeHtml = `<span class="source-badge">[${tag}] ${m.address} (${stateTxt})</span>`;
        }

        return `
        <div class="bed-card ${hasAlarm ? 'has-alarm' : ''}" data-bed-name="${bed.name}">
            <div class="bed-card-header" onclick="window.app.openBedDetailModal('${bed.name}')">
                <div class="bed-badge-group">
                    <span class="bed-number">${bed.name}</span>
                    ${sourceBadgeHtml}
                </div>
                <div class="patient-info">
                    <div class="patient-name">${patientName}</div>
                    <div class="patient-id">${patientId} | ${bed.total_volume_ml || 0} ml</div>
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
                <span>Cihaz Tanımlı (${mapping.address}) — Veri akışı bekleniyor...</span>
                <button class="btn-ctrl" onclick="window.app.openDeviceMgrModal('active-mappings')">BAĞLANTI DURUMU</button>
            </div>`;
        }
        return `
        <div class="empty-bed-slot">
            <span>Bağlı Gerçek Pompa / Port Yok</span>
            <button class="btn-ctrl btn-primary-solid" onclick="window.app.quickBindDevice('${bedName}')">CİHAZ / PORT BAĞLA</button>
        </div>`;
    }

    renderPumpCard(pump) {
        const isAlarm = pump.status === "ALARM" || pump.alarm !== null;
        const isInfusing = pump.status === "INFUSING" || pump.status === "RUNNING";
        const nearEnd = pump.near_end;
        const dersWarn = pump.ders_warning;

        let statusClass = "status-standby";
        let statusBadgeClass = "status-badge-standby";
        let statusLabel = "BEKLEMEDE";

        if (pump.status === "OFFLINE") {
            statusClass = "status-near-end";
            statusBadgeClass = "status-badge-warning";
            statusLabel = "BAĞLANTI KOPTU";
        } else if (isAlarm) {
            statusClass = "status-alarm";
            statusBadgeClass = "status-badge-alarm";
            statusLabel = "ALARM";
        } else if (nearEnd) {
            statusClass = "status-near-end";
            statusBadgeClass = "status-badge-warning";
            statusLabel = `${pump.near_end_min} DK KALDI`;
        } else if (isInfusing) {
            statusClass = "status-infusing";
            statusBadgeClass = "status-badge-running";
            statusLabel = "AKIYOR";
        }

        const vol = pump.volume_infused || 0;
        const vtbi = pump.vtbi || 100;
        const pct = Math.min(100, Math.round((vol / vtbi) * 100));
        const timeStr = this.formatTime(pump.time_remaining_sec);

        return `
        <div class="pump-card ${statusClass}" id="pump-${pump.id}">
            <div class="pump-top-row">
                <div>
                    <span class="pump-model">${pump.model || 'İnfüzyon Pompası'}</span>
                    <span class="pump-serial">${pump.serial || ''}</span>
                </div>
                <span class="pump-status-badge ${statusBadgeClass}">${statusLabel}</span>
            </div>

            <div class="pump-drug-row">
                <span class="drug-name">${pump.drug_name || 'Tanımsız'}</span>
                <span class="drug-conc">${pump.drug_concentration || ''}</span>
            </div>

            ${dersWarn ? `<div class="ders-alert-bar ${dersWarn.level === 'HARD' ? 'ders-hard' : 'ders-soft'}">DERS: ${dersWarn.message}</div>` : ''}

            <div class="pump-telemetry-grid">
                <div class="rate-box">
                    <span class="rate-label">AKIŞ HIZI</span>
                    <div class="rate-value-group">
                        <span class="rate-number">${(pump.rate || 0).toFixed(1)}</span>
                        <span class="rate-unit">${pump.rate_unit || 'ml/h'}</span>
                    </div>
                </div>
                <div class="vol-remaining-box">
                    <div class="metric-item"><span class="metric-label">VERİLEN:</span><span class="metric-val">${vol.toFixed(1)} ml</span></div>
                    <div class="metric-item"><span class="metric-label">HEDEF:</span><span class="metric-val">${vtbi.toFixed(0)} ml</span></div>
                    <div class="metric-item"><span class="metric-label">KALAN:</span><span class="metric-val">${timeStr}</span></div>
                </div>
            </div>

            <div class="progress-track">
                <div class="progress-bar ${isInfusing ? 'infusing' : ''}" style="width: ${pct}%"></div>
            </div>

            <div class="pump-meta-row">
                <div class="pressure-gauge">
                    <span>BASINÇ:</span>
                    <div class="pressure-bars">${this.renderPressureBars(pump.pressure_level || 1)}</div>
                </div>
                <span>${pump.ac_power ? 'AC' : 'BAT'} | %${pump.battery || 100}</span>
            </div>

            ${isAlarm && pump.alarm ? `<div class="alarm-strip">ALARM: ${pump.alarm.text || pump.alarm.code}</div>` : ''}
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

    // WARD MANAGER MODAL
    openWardMgrModal() {
        this.wardMgrModal.style.display = "flex";
        if (this.lastState) {
            this.renderWardManageTable(this.lastState.rooms, this.lastState.beds);
        }
    }

    renderWardManageTable(rooms, beds) {
        const rows = [];
        (rooms || []).forEach(r => {
            const rb = (beds || []).filter(b => b.room_id === r.id);
            if (rb.length === 0) {
                rows.push(`<tr><td><strong>${r.name}</strong></td><td style="color:#657487;">(Yatak Yok)</td><td><button class="btn-table-action" onclick="window.app.deleteRoom(${r.id})">Servisi Sil</button></td></tr>`);
            } else {
                rb.forEach(b => {
                    rows.push(`<tr><td>${r.name}</td><td><strong>Yatak ${b.name}</strong></td><td><button class="btn-table-action" onclick="window.app.deleteBed('${b.name}')">Yatağı Sil</button></td></tr>`);
                });
            }
        });
        this.wardBedsManageBody.innerHTML = rows.length ? rows.join("") : `<tr><td colspan="3" style="text-align:center;color:#657487;">Kayıtlı servis yok. Soldaki formdan ilk servisinizi ekleyin.</td></tr>`;
    }

    async deleteRoom(roomId) {
        if (!confirm("Bu servis ve altındaki tüm yataklar kaldırılsın mı?")) return;
        await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
        await this.fetchAndRender();
    }

    async deleteBed(bedName) {
        if (!confirm(`Yatak ${bedName} kaldırılsın mı?`)) return;
        await fetch(`/api/beds/${encodeURIComponent(bedName)}`, { method: "DELETE" });
        await this.fetchAndRender();
    }

    // FLOOR MAP
    renderFloorMap(state) {
        const beds = state.beds || [];
        if (beds.length === 0) {
            this.wardFloorCanvas.innerHTML = `<div style="padding:40px;color:#657487;text-align:center;">Yerleşim planı için önce servis ve yatak ekleyin.</div>`;
            return;
        }
        this.wardFloorCanvas.innerHTML = beds.map((b, idx) => {
            const x = b.posX != null ? b.posX : ((idx % 4) * 230 + 30);
            const y = b.posY != null ? b.posY : (Math.floor(idx / 4) * 140 + 30);
            const hasAlarm = b.alarms && b.alarms.length > 0;
            const activePumps = (b.pumps || []).filter(p => p.status === "INFUSING" || p.status === "RUNNING").length;
            const patName = b.patient ? b.patient.name : "Tanımsız";
            return `
            <div class="floor-bed-node ${hasAlarm ? 'node-alarm' : activePumps > 0 ? 'node-active' : ''}"
                 style="left: ${x}px; top: ${y}px;"
                 onclick="window.app.openBedDetailModal('${b.name}')">
                <div class="node-head"><span>YATAK ${b.name}</span><span>${hasAlarm ? 'ALARM' : activePumps > 0 ? 'AKTİF' : 'BOŞ'}</span></div>
                <div class="node-patient">${patName}</div>
                <div class="node-stats">${(b.pumps || []).length} Pompa | ${b.total_rate_mlh || 0} ml/h</div>
            </div>`;
        }).join("");
    }

    // DRUG LIBRARY
    async loadDrugsView() {
        const res = await fetch("/api/drugs");
        const drugs = await res.json();
        this.drugsTableBody.innerHTML = drugs.map(d => `
            <tr>
                <td><strong>${d.name}</strong></td>
                <td>${d.category || '-'}</td>
                <td>${d.default_conc || '-'}</td>
                <td>${d.soft_min}</td>
                <td>${d.soft_max}</td>
                <td><strong style="color:#f87171;">${d.hard_max}</strong></td>
                <td>${d.unit}</td>
                <td><button class="btn-table-action" onclick="window.app.deleteDrug('${d.id}')">Sil</button></td>
            </tr>
        `).join("");
    }

    async deleteDrug(drugId) {
        if (!confirm("İlaç kuralı silinsin mi?")) return;
        await fetch(`/api/drugs/${encodeURIComponent(drugId)}`, { method: "DELETE" });
        this.loadDrugsView();
    }

    // HISTORY
    async loadHistoryView() {
        const sev = this.historySeverityFilter.value || "ALL";
        const res = await fetch(`/api/history?severity=${encodeURIComponent(sev)}&limit=150`);
        const logs = await res.json();
        this.historyTableBody.innerHTML = logs.map(l => `
            <tr>
                <td><code>${l.time_str}</code></td>
                <td><strong>${l.bed_name}</strong></td>
                <td>${l.pump_serial}</td>
                <td>${l.event_type}</td>
                <td><span class="${l.severity === 'HIGH' ? 'badge-sev-high' : 'badge-sev-info'}">${l.severity}</span></td>
                <td>${l.description}</td>
                <td>${l.rate ? l.rate + ' ml/h' : '-'}</td>
                <td>${l.volume ? l.volume + ' ml' : '-'}</td>
            </tr>
        `).join("");
    }

    // REPORTS
    async loadReportsView() {
        const res = await fetch("/api/reports/summary");
        const r = await res.json();
        const alarmRows = Object.entries(r.alarm_distribution || {}).map(([k, v]) => `<div class="report-kv-row"><span>${k}</span><strong>${v}</strong></div>`).join("");
        const bedRows = (r.fluid_balance_by_bed || []).map(b => `
            <tr><td><strong>${b.bed_name}</strong></td><td>${b.patient_name}</td><td>${b.pumps_count}</td><td>${b.active_rate_mlh} ml/h</td><td><strong>${b.total_volume_ml} ml</strong></td></tr>
        `).join("");

        this.reportsContainer.innerHTML = `
            <div class="report-kpi-row">
                <div class="kpi-card"><span>BAĞLI AKTİF POMPA</span><strong>${r.active_pumps_count}</strong></div>
                <div class="kpi-card"><span>TOPLAM AKIŞ HIZI</span><strong>${r.total_ward_rate_mlh} ml/h</strong></div>
                <div class="kpi-card"><span>TOPLAM VERİLEN SIVI</span><strong>${r.total_ward_volume_ml} ml</strong></div>
                <div class="kpi-card"><span>DERS DOZ UYUMU</span><strong>%${r.ders_compliance_pct}</strong></div>
            </div>
            <div class="report-panels-2">
                <div class="report-box">
                    <h3 style="margin-bottom:8px;">YATAK BAZLI SIVI DENGESİ</h3>
                    <table class="clinical-table"><thead><tr><th>YATAK</th><th>HASTA</th><th>POMPA</th><th>HIZ</th><th>TOPLAM</th></tr></thead><tbody>${bedRows || '<tr><td colspan="5">Veri yok</td></tr>'}</tbody></table>
                </div>
                <div class="report-box">
                    <h3 style="margin-bottom:8px;">ALARM DAĞILIMI</h3>
                    ${alarmRows}
                </div>
            </div>`;
    }

    // BED DETAIL MODAL
    openBedDetailModal(bedName) {
        if (!this.lastState) return;
        const bed = (this.lastState.beds || []).find(b => b.name === bedName);
        if (!bed) return;
        const pat = bed.patient || {};
        this.bedDetailTitle.textContent = `YATAK ${bed.name} (${bed.room_name})`;
        this.bedDetailSub.textContent = `Toplam İnfüzyon: ${bed.total_volume_ml || 0} ml | Anlık Hız: ${bed.total_rate_mlh || 0} ml/h`;

        const pumpsHtml = (bed.pumps || []).length > 0 ? bed.pumps.map(p => this.renderPumpCard(p)).join("") : `<p style="color:#657487;">Bağlı pompa verisi yok.</p>`;
        this.bedDetailBody.innerHTML = `
            <div class="bed-detail-grid">
                <div class="report-box">
                    <h4 style="margin-bottom:10px;color:#2ea8db;">HASTA KAYIT BİLGİLERİ</h4>
                    <form id="patientEditForm" class="modal-form">
                        <div class="form-row"><label>Hasta Adı Soyadı:</label><input type="text" id="patNameInput" value="${pat.name || ''}" required></div>
                        <div class="form-row grid-2">
                            <div><label>Protokol No:</label><input type="text" id="patProtoInput" value="${pat.protocol_no || ''}"></div>
                            <div><label>Kilo (kg):</label><input type="number" id="patWeightInput" value="${pat.weight_kg || ''}"></div>
                        </div>
                        <div class="form-row"><label>Klinik Not:</label><input type="text" id="patNoteInput" value="${pat.note || ''}"></div>
                        <div style="display:flex;gap:8px;margin-top:6px;">
                            <button type="submit" class="btn-ctrl btn-primary-solid">HASTAYI KAYDET</button>
                            <button type="button" class="btn-ctrl" onclick="window.app.resetBedVolume('${bed.name}')">24S HACİM SIFIRLA</button>
                        </div>
                    </form>
                </div>
                <div class="report-box">
                    <h4 style="margin-bottom:10px;color:#2ea8db;">KANALLAR (${(bed.pumps || []).length})</h4>
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
        if (!confirm(`Yatak ${bedName} 24 saatlik sıvı sayacı sıfırlansın mı?`)) return;
        await fetch(`/api/beds/${encodeURIComponent(bedName)}/reset_volume`, { method: "POST" });
        this.bedDetailModal.style.display = "none";
        await this.fetchAndRender();
    }

    // LICENSE INFO MODAL
    async openLicenseInfoModal() {
        const res = await fetch("/api/license/status");
        const lic = await res.json();
        this.licenseInfoBody.innerHTML = `
            <div class="report-kv-row"><span>DURUM</span><strong style="color:#4ade80;">${lic.valid ? 'AKTİF VE DOĞRULANDI' : 'KİLİTLİ'}</strong></div>
            <div class="report-kv-row"><span>KURUM</span><strong>${lic.customer}</strong></div>
            <div class="report-kv-row"><span>DONANIM KİMLİĞİ (HWID)</span><code>${lic.hwid}</code></div>
            <div class="report-kv-row"><span>YATAK LİMİTİ</span><strong>${lic.max_beds} Yatak</strong></div>
            <div class="report-kv-row"><span>BİTİŞ TARİHİ</span><strong>${lic.expires_date} (${lic.days_left} Gün)</strong></div>`;
        this.licenseInfoModal.style.display = "flex";
    }

    // DEVICE MANAGER MODAL
    openDeviceMgrModal(tab = "active-mappings") {
        this.deviceMgrModal.style.display = "flex";
        this.switchDeviceMgrTab(tab);
        if (this.lastState) {
            this.renderMappingsTable(this.lastState.mappings);
            this.renderDiscoveredPisTable(this.lastState.discovered_pis);
        }
    }

    switchDeviceMgrTab(tabKey) {
        document.querySelectorAll(".modal-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.tab === tabKey));
        document.querySelectorAll(".tab-pane").forEach(pane => { pane.style.display = (pane.id === `pane-${tabKey}`) ? "block" : "none"; });
    }

    renderMappingsTable(mappings) {
        if (!mappings) return;
        this.activeMappingsCount.textContent = mappings.length;
        if (mappings.length === 0) {
            this.mappingsTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#657487;padding:20px;">Kayıtlı cihaz eşleştirmesi yok.</td></tr>`;
            return;
        }
        this.mappingsTableBody.innerHTML = mappings.map(m => {
            const typeMap = { PI_IP: "AĞ GEÇİDİ", DIRECT_COM: "DOĞRUDAN COM", DOCK_IP: "LAN DOK", PUMP_SN: "SERİ NO" };
            const lastSeenStr = m.last_seen > 0 ? new Date(m.last_seen * 1000).toLocaleTimeString("tr-TR") : "Veri Bekleniyor";
            const statusBadge = m.is_online ? `<span class="badge-online">CANLI</span>` : `<span class="badge-offline">BEKLİYOR</span>`;
            return `
            <tr>
                <td><strong>Yatak ${m.bed_name}</strong></td>
                <td>${typeMap[m.source_type] || m.source_type}</td>
                <td><code>${m.address}</code></td>
                <td>${m.model || '-'}</td>
                <td>${m.label || m.drug_name || '-'}</td>
                <td>${lastSeenStr}</td>
                <td>${statusBadge}</td>
                <td><button class="btn-table-action" onclick="window.app.deleteMapping('${m.bed_name}')">Kaldır</button></td>
            </tr>`;
        }).join("");
    }

    renderDiscoveredPisTable(pis) {
        if (!pis) return;
        this.discoveredPisCount.textContent = pis.length;
        if (pis.length === 0) {
            this.discoveredPisTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#657487;padding:20px;">MQTT üzerinde aktif cihaz sinyali görülmedi.</td></tr>`;
            return;
        }
        this.discoveredPisTableBody.innerHTML = pis.map(p => {
            const timeStr = p.last_seen > 0 ? new Date(p.last_seen * 1000).toLocaleTimeString("tr-TR") : "-";
            const mappedText = p.mapped_bed ? `Yatak ${p.mapped_bed}` : "Bağlı Değil";
            return `
            <tr>
                <td><code>${p.ip}</code></td>
                <td>${timeStr}</td>
                <td>${p.device_label || p.device_type}</td>
                <td><small>${(p.last_payload || "").slice(0, 48)}</small></td>
                <td>${mappedText}</td>
                <td><button class="btn-table-bind" onclick="window.app.quickBindPi('${p.ip}', '${p.device_type || ''}')">Yatağa Bağla</button></td>
            </tr>`;
        }).join("");
    }

    quickBindPi(piIp, devType) {
        if (devType && devType !== "INFUSION_PUMP") {
            if (!confirm(`DİKKAT: ${piIp} adresindeki yayın ${devType} sınıfında görünüyor. İnfüzyon pompası olarak bağlamak istediğinizden emin misiniz?`)) return;
        }
        this.mapSourceTypeSelect.value = "PI_IP";
        this.mapAddressInput.value = piIp;
        this.mapLabelInput.value = `Pi ${piIp}`;
        this.switchDeviceMgrTab("add-mapping");
    }

    quickBindDevice(bedName) {
        if (this.mapBedSelect) this.mapBedSelect.value = bedName;
        this.openDeviceMgrModal("add-mapping");
    }

    async deleteMapping(bedName) {
        if (!confirm(`Yatak ${bedName} cihaz bağlantısı kaldırılsın mı?`)) return;
        await fetch(`/api/mappings/${encodeURIComponent(bedName)}`, { method: "DELETE" });
        await this.fetchAndRender();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.app = new MerkeziIzlemApp();
});
