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

        this.adminToken = sessionStorage.getItem("wtm_admin_token") || "";
        this.adminAuthed = false;
        this.usingDefaultPassword = false;
        this.currentAdminSubtab = "general";
        this.pendingAdminSubtab = null;

        this.initDOMElements();
        this.initEventListeners();
        this.startClock();
        this.pollLoop();
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
                this.adminLoginError.textContent = data.detail || "Oturum süresi doldu veya yetkisiz işlem. Lütfen tekrar giriş yapın.";
            }
            throw new Error(data.detail || "Yetkisiz");
        }
        return { ok: res.ok, status: res.status, data };
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

        this.btnOpenAdminPanel.addEventListener("click", () => this.openAdminSection("general"));
        this.btnEditDrugsInAdmin.addEventListener("click", () => this.openAdminSection("drugs"));

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
                this.adminLoginError.textContent = data.detail || "Giriş başarısız.";
                return;
            }
            this.adminLoginPassword.value = "";
            this.setAdminToken(data.token);
            this.adminAuthed = true;
            this.usingDefaultPassword = !!data.using_default_password;
            const targetSub = this.pendingAdminSubtab || this.currentAdminSubtab || "general";
            this.pendingAdminSubtab = null;
            this.updateAdminPanelVisibility();
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
                    this.setFeedback(this.adminFacilityMsg, data.detail || "Kaydedilemedi.", false);
                    return;
                }
                this.setFeedback(this.adminFacilityMsg, "Kurum ve birim başlığı güncellendi.", true);
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
                this.setFeedback(this.adminPasswordMsg, "Yeni şifreler birbiriyle eşleşmiyor.", false);
                return;
            }
            if (np1.trim().length < 6) {
                this.setFeedback(this.adminPasswordMsg, "Yeni şifre en az 6 karakter olmalıdır.", false);
                return;
            }
            try {
                const { ok, data } = await this.adminFetch("/api/admin/password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ current_password: cur, new_password: np1 })
                });
                if (!ok) {
                    this.setFeedback(this.adminPasswordMsg, data.detail || "Şifre güncellenemedi.", false);
                    return;
                }
                if (data.token) this.setAdminToken(data.token);
                this.usingDefaultPassword = false;
                this.adminCurPass.value = "";
                this.adminNewPass.value = "";
                this.adminNewPass2.value = "";
                this.updateAdminPanelVisibility();
                this.setFeedback(this.adminPasswordMsg, "Yönetici şifresi güncellendi ve yeni oturum açıldı.", true);
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
                    alert(data.detail || "Servis eklenemedi.");
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
                    alert(data.detail || "Yatak eklenemedi.");
                    return;
                }
                this.newBedNameInput.value = "";
                await this.fetchAndRender();
            } catch (err) { }
        });

        // Admin Device Mapping
        this.btnResetMappingForm.addEventListener("click", () => {
            this.saveMappingForm.reset();
            this.mapSourceTypeSelect.dispatchEvent(new Event("change"));
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
            try {
                const { ok, data } = await this.adminFetch("/api/mappings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (!ok) {
                    alert(data.detail || "Kayıt reddedildi.");
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
                    this.setFeedback(this.adminDrugMsg, data.detail || "İlaç kuralı eklenemedi.", false);
                    return;
                }
                document.getElementById("drugNameInput").value = "";
                document.getElementById("drugConcInput").value = "";
                this.setFeedback(this.adminDrugMsg, "DERS ilaç kuralı kaydedildi.", true);
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
                this.setFeedback(this.adminLicenseMsg, "Yeni lisans başarıyla doğrulandı.", true);
                await this.fetchAndRender();
                this.renderAdminLicense();
            } else {
                this.setFeedback(this.adminLicenseMsg, "Lisans doğrulanamadı: " + (data.message || data.reason), false);
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
            this.btnOpenAdminPanel.textContent = this.adminAuthed ? "ADMİN (AÇIK)" : "ADMİN PANELİ";
        }
        if (this.adminAuthed) {
            this.adminLoginBox.style.display = "none";
            this.adminWorkspace.style.display = "block";
            if (this.adminDefaultPassWarn) {
                this.adminDefaultPassWarn.style.display = this.usingDefaultPassword ? "block" : "none";
            }
            if (statusData) {
                if (this.adminFacilityInput && document.activeElement !== this.adminFacilityInput) {
                    this.adminFacilityInput.value = statusData.facility_name || "";
                }
                if (this.adminDepartmentInput && document.activeElement !== this.adminDepartmentInput) {
                    this.adminDepartmentInput.value = statusData.department_name || "";
                }
            } else if (this.lastState) {
                if (this.adminFacilityInput && document.activeElement !== this.adminFacilityInput) {
                    this.adminFacilityInput.value = this.lastState.facility_name || "";
                }
                if (this.adminDepartmentInput && document.activeElement !== this.adminDepartmentInput) {
                    this.adminDepartmentInput.value = this.lastState.department_name || "";
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
            this.renderDiscoveredPisTable(this.lastState.discovered_pis);
        } else if (subtab === "drugs") {
            this.renderAdminDrugs();
        } else if (subtab === "license") {
            this.renderAdminLicense();
        }
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

        // Update header facility/department branding
        const fac = (state.facility_name || "").trim();
        const dept = (state.department_name || "").trim() || "İNFÜZYON İZLEM VE KONTROL SİSTEMİ";
        if (this.headerFacilityName) this.headerFacilityName.textContent = fac || "MERKEZİ İZLEM";
        if (this.headerDepartmentName) this.headerDepartmentName.textContent = dept;
        if (this.headerBrandMark) this.headerBrandMark.textContent = (fac ? fac[0] : "M").toUpperCase();
        document.title = fac ? `${fac} — Merkezi İzlem` : "MERKEZİ İZLEM";

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
            this.renderDiscoveredPisTable(state.discovered_pis);
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
        this.roomTabs.innerHTML = `<button class="room-tab ${allActive}" data-room="ALL">TÜMÜ <span class="tab-badge">${beds ? beds.length : 0}</span></button>${roomBtns}`;
    }

    syncSelectDropdowns(rooms, beds) {
        if (this.newBedRoomSelect) {
            const prevR = this.newBedRoomSelect.value;
            this.newBedRoomSelect.innerHTML = (rooms || []).map(r => `<option value="${r.id}">${this.escapeHtml(r.name)}</option>`).join("");
            if (prevR && [...this.newBedRoomSelect.options].some(o => o.value === prevR)) this.newBedRoomSelect.value = prevR;
        }
        if (this.mapBedSelect) {
            const prevB = this.mapBedSelect.value;
            this.mapBedSelect.innerHTML = (beds || []).map(b => `<option value="${this.escapeHtml(b.name)}">Yatak ${this.escapeHtml(b.name)} (${this.escapeHtml(b.room_name)})</option>`).join("");
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
                <p style="margin-bottom: 14px;">Bu sistemde ön tanımlı sahte demo kaydı bulunmamaktadır. Servis/Oda ve yataklarınızı Yönetici Paneli üzerinden tanımladıktan sonra gerçek cihaz veya COM port bağlayabilirsiniz.</p>
                <button class="btn-ctrl btn-primary-solid" onclick="window.app.openAdminSection('wards')">ADMİN PANELİNDEN SERVİS / YATAK EKLE</button>
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
                    <span class="room-bed-count">${roomBeds.length} YATAK</span>
                </div>
                <div class="beds-grid">
                    ${roomBeds.length > 0 ? roomBeds.map(b => this.renderBedCard(b)).join("") : `<div class="empty-bed-slot">Bu serviste tanımlı yatak yok. <button class="btn-ctrl" onclick="window.app.openAdminSection('wards')">+ Yatak Ekle (Admin)</button></div>`}
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
            const tag = m.source_type === "PI_IP" ? "GW" : m.source_type === "DIRECT_COM" ? "COM" : m.source_type === "DOCK_IP" ? "DOK" : "SN";
            const stateTxt = m.is_online ? "CANLI" : "BEKLİYOR";
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
                <span>Cihaz Tanımlı (${this.escapeHtml(mapping.address)}) — Veri akışı bekleniyor...</span>
                <button class="btn-ctrl" onclick="window.app.openAdminSection('devices')">BAĞLANTI DURUMU</button>
            </div>`;
        }
        return `
        <div class="empty-bed-slot">
            <span>Bağlı Gerçek Pompa / Port Yok</span>
            <button class="btn-ctrl btn-primary-solid" onclick="window.app.quickBindDevice('${this.escapeHtml(bedName)}')">CİHAZ / PORT BAĞLA</button>
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
        <div class="pump-card ${statusClass}" id="pump-${this.escapeHtml(pump.id)}">
            <div class="pump-top-row">
                <div>
                    <span class="pump-model">${this.escapeHtml(pump.model || 'İnfüzyon Pompası')}</span>
                    <span class="pump-serial">${this.escapeHtml(pump.serial || '')}</span>
                </div>
                <span class="pump-status-badge ${statusBadgeClass}">${statusLabel}</span>
            </div>

            <div class="pump-drug-row">
                <span class="drug-name">${this.escapeHtml(pump.drug_name || 'Tanımsız')}</span>
                <span class="drug-conc">${this.escapeHtml(pump.drug_concentration || '')}</span>
            </div>

            ${dersWarn ? `<div class="ders-alert-bar ${dersWarn.level === 'HARD' ? 'ders-hard' : 'ders-soft'}">DERS: ${this.escapeHtml(dersWarn.message)}</div>` : ''}

            <div class="pump-telemetry-grid">
                <div class="rate-box">
                    <span class="rate-label">AKIŞ HIZI</span>
                    <div class="rate-value-group">
                        <span class="rate-number">${(pump.rate || 0).toFixed(1)}</span>
                        <span class="rate-unit">${this.escapeHtml(pump.rate_unit || 'ml/h')}</span>
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
        (rooms || []).forEach(r => {
            const rb = (beds || []).filter(b => b.room_id === r.id);
            if (rb.length === 0) {
                rows.push(`<tr><td><strong>${this.escapeHtml(r.name)}</strong></td><td style="color:#657487;">(Yatak Yok)</td><td><button class="btn-table-action" onclick="window.app.deleteRoom(${r.id})">Servisi Sil</button></td></tr>`);
            } else {
                rb.forEach(b => {
                    rows.push(`<tr><td>${this.escapeHtml(r.name)}</td><td><strong>Yatak ${this.escapeHtml(b.name)}</strong></td><td><button class="btn-table-action" onclick="window.app.deleteBed('${this.escapeHtml(b.name)}')">Yatağı Sil</button></td></tr>`);
                });
            }
        });
        this.wardBedsManageBody.innerHTML = rows.length ? rows.join("") : `<tr><td colspan="3" style="text-align:center;color:#657487;">Kayıtlı servis yok. Soldaki formdan ilk servisinizi ekleyin.</td></tr>`;
    }

    async deleteRoom(roomId) {
        if (!confirm("Bu servis ve altındaki tüm yataklar kaldırılsın mı?")) return;
        try {
            await this.adminFetch(`/api/rooms/${roomId}`, { method: "DELETE" });
            await this.fetchAndRender();
        } catch (err) { }
    }

    async deleteBed(bedName) {
        if (!confirm(`Yatak ${bedName} kaldırılsın mı?`)) return;
        try {
            await this.adminFetch(`/api/beds/${encodeURIComponent(bedName)}`, { method: "DELETE" });
            await this.fetchAndRender();
        } catch (err) { }
    }

    // FLOOR MAP
    renderFloorMap(state) {
        const beds = state.beds || [];
        if (beds.length === 0) {
            this.wardFloorCanvas.innerHTML = `<div style="padding:40px;color:#657487;text-align:center;">Yerleşim planı için Admin Paneli üzerinden servis ve yatak ekleyin.</div>`;
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
                 onclick="window.app.openBedDetailModal('${this.escapeHtml(b.name)}')">
                <div class="node-head"><span>YATAK ${this.escapeHtml(b.name)}</span><span>${hasAlarm ? 'ALARM' : activePumps > 0 ? 'AKTİF' : 'BOŞ'}</span></div>
                <div class="node-patient">${this.escapeHtml(patName)}</div>
                <div class="node-stats">${(b.pumps || []).length} Pompa | ${b.total_rate_mlh || 0} ml/h</div>
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
                <td><button class="btn-table-action" onclick="window.app.deleteDrug('${this.escapeHtml(d.id)}')">Sil</button></td>
            </tr>
        `).join("");
    }

    async deleteDrug(drugId) {
        if (!confirm("İlaç kuralı silinsin mi?")) return;
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

    // BED DETAIL MODAL (BEDSIDE CLINICAL WORKFLOW)
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
                        <div class="form-row"><label>Hasta Adı Soyadı:</label><input type="text" id="patNameInput" value="${this.escapeHtml(pat.name || '')}" required></div>
                        <div class="form-row grid-2">
                            <div><label>Protokol No:</label><input type="text" id="patProtoInput" value="${this.escapeHtml(pat.protocol_no || '')}"></div>
                            <div><label>Kilo (kg):</label><input type="number" id="patWeightInput" value="${pat.weight_kg || ''}"></div>
                        </div>
                        <div class="form-row"><label>Klinik Not:</label><input type="text" id="patNoteInput" value="${this.escapeHtml(pat.note || '')}"></div>
                        <div style="display:flex;gap:8px;margin-top:6px;">
                            <button type="submit" class="btn-ctrl btn-primary-solid">HASTAYI KAYDET</button>
                            <button type="button" class="btn-ctrl" onclick="window.app.resetBedVolume('${this.escapeHtml(bed.name)}')">24S HACİM SIFIRLA</button>
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

    // LICENSE INFO MODAL & ADMIN LICENSE PANE
    async openLicenseInfoModal() {
        const res = await fetch("/api/license/status");
        const lic = await res.json();
        this.licenseInfoBody.innerHTML = `
            <div class="report-kv-row"><span>DURUM</span><strong style="color:#4ade80;">${lic.valid ? 'AKTİF VE DOĞRULANDI' : 'KİLİTLİ'}</strong></div>
            <div class="report-kv-row"><span>KURUM</span><strong>${this.escapeHtml(lic.customer)}</strong></div>
            <div class="report-kv-row"><span>DONANIM KİMLİĞİ (HWID)</span><code>${this.escapeHtml(lic.hwid)}</code></div>
            <div class="report-kv-row"><span>YATAK LİMİTİ</span><strong>${lic.max_beds} Yatak</strong></div>
            <div class="report-kv-row"><span>BİTİŞ TARİHİ</span><strong>${this.escapeHtml(lic.expires_date)} (${lic.days_left} Gün)</strong></div>`;
        this.licenseInfoModal.style.display = "flex";
    }

    async renderAdminLicense() {
        if (!this.adminLicenseBody) return;
        const res = await fetch("/api/license/status");
        const lic = await res.json();
        this.adminLicenseBody.innerHTML = `
            <div class="report-kv-row"><span>DURUM</span><strong style="color:${lic.valid ? '#4ade80' : '#f87171'};">${lic.valid ? 'AKTİF VE DOĞRULANDI' : 'KİLİTLİ'}</strong></div>
            <div class="report-kv-row"><span>LİSANS SAHİBİ</span><strong>${this.escapeHtml(lic.customer || '-')}</strong></div>
            <div class="report-kv-row">
                <span>DONANIM KİMLİĞİ (HWID)</span>
                <span style="display:flex;gap:8px;align-items:center;">
                    <code>${this.escapeHtml(lic.hwid)}</code>
                    <button type="button" class="btn-table-action" onclick="window.app.copyText('${this.escapeHtml(lic.hwid)}', this)">Kopyala</button>
                </span>
            </div>
            <div class="report-kv-row"><span>YATAK LİMİTİ</span><strong>${lic.max_beds} Yatak</strong></div>
            <div class="report-kv-row"><span>SÜRÜM / BİTİŞ</span><strong>${this.escapeHtml(lic.edition || '-')} · ${this.escapeHtml(lic.expires_date || '-')} (${lic.days_left || 0} Gün)</strong></div>`;
    }

    copyText(text, btn) {
        if (navigator.clipboard) navigator.clipboard.writeText(text);
        if (btn) {
            const orig = btn.textContent;
            btn.textContent = "Kopyalandı";
            setTimeout(() => { btn.textContent = orig; }, 1800);
        }
    }

    // ADMIN DEVICE MAPPINGS & GATEWAY DISCOVERY
    renderMappingsTable(mappings) {
        if (!mappings || !this.mappingsTableBody) return;
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
                <td><strong>Yatak ${this.escapeHtml(m.bed_name)}</strong></td>
                <td>${typeMap[m.source_type] || this.escapeHtml(m.source_type)}</td>
                <td><code>${this.escapeHtml(m.address)}</code></td>
                <td>${this.escapeHtml(m.model || '-')}</td>
                <td>${this.escapeHtml(m.label || m.drug_name || '-')}</td>
                <td>${lastSeenStr}</td>
                <td>${statusBadge}</td>
                <td><button class="btn-table-action" onclick="window.app.deleteMapping('${this.escapeHtml(m.bed_name)}')">Kaldır</button></td>
            </tr>`;
        }).join("");
    }

    renderDiscoveredPisTable(pis) {
        if (!pis || !this.discoveredPisTableBody) return;
        this.discoveredPisCount.textContent = pis.length;
        if (pis.length === 0) {
            this.discoveredPisTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#657487;padding:20px;">MQTT üzerinde aktif cihaz sinyali görülmedi.</td></tr>`;
            return;
        }
        this.discoveredPisTableBody.innerHTML = pis.map(p => {
            const timeStr = p.last_seen > 0 ? new Date(p.last_seen * 1000).toLocaleTimeString("tr-TR") : "-";
            const mappedText = p.mapped_bed ? `Yatak ${this.escapeHtml(p.mapped_bed)}` : "Bağlı Değil";
            return `
            <tr>
                <td><code>${this.escapeHtml(p.ip)}</code></td>
                <td>${timeStr}</td>
                <td>${this.escapeHtml(p.device_label || p.device_type)}</td>
                <td><small>${this.escapeHtml((p.last_payload || "").slice(0, 48))}</small></td>
                <td>${mappedText}</td>
                <td><button class="btn-table-bind" onclick="window.app.quickBindPi('${this.escapeHtml(p.ip)}', '${this.escapeHtml(p.device_type || '')}')">Forma Aktar</button></td>
            </tr>`;
        }).join("");
    }

    quickBindPi(piIp, devType) {
        if (devType && devType !== "INFUSION_PUMP") {
            if (!confirm(`DİKKAT: ${piIp} adresindeki yayın ${devType} sınıfında görünüyor. İnfüzyon pompası olarak bağlamak istediğinizden emin misiniz?`)) return;
        }
        this.openAdminSection("devices");
        this.mapSourceTypeSelect.value = "PI_IP";
        this.mapSourceTypeSelect.dispatchEvent(new Event("change"));
        this.mapAddressInput.value = piIp;
        this.mapLabelInput.value = `GW ${piIp}`;
    }

    quickBindDevice(bedName) {
        this.openAdminSection("devices");
        if (this.mapBedSelect) this.mapBedSelect.value = bedName;
    }

    async deleteMapping(bedName) {
        if (!confirm(`Yatak ${bedName} cihaz bağlantısı kaldırılsın mı?`)) return;
        try {
            await this.adminFetch(`/api/mappings/${encodeURIComponent(bedName)}`, { method: "DELETE" });
            await this.fetchAndRender();
        } catch (err) { }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.app = new MerkeziIzlemApp();
});
