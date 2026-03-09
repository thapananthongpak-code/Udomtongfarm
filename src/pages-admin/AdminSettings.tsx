import { useRef, useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore";
import { API_BASE } from "../config/api";
import { authFetch } from "../utils/authFetch";
import { ADMIN_EMAILS } from "../config/admin";

const SITE_SETTINGS_KEY = "uf_site_settings";

interface SiteSettings {
  siteName: string;
  maintenanceMode: boolean;
  carouselCount: number;
  spotlightCount: number;
}

function getSiteSettings(): SiteSettings {
  try {
    return JSON.parse(localStorage.getItem(SITE_SETTINGS_KEY) || "{}");
  } catch { return {} as SiteSettings; }
}
function saveSiteSettings(s: SiteSettings) {
  localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(s));
}

export default function AdminSettings() {
  const { user } = useAuth();
  const { lang, theme, toggleTheme } = useSettingsStore();

  const [input, setInput] = useState("");
  const [adminsList, setAdminsList] = useState<{ email: string }[]>([]);
  const [apiStatus, setApiStatus] = useState<"checking" | "ok" | "fail">("checking");
  const [sessions, setSessions] = useState<{ id: number; user_email: string; user_name: string; role: string; login_at: string; logout_at: string | null }[]>([]);

  // Site settings
  const saved = getSiteSettings();
  const [siteName, setSiteName]           = useState(saved.siteName ?? "Udomtong Farm");
  const [maintenanceMode, setMaintenance] = useState(saved.maintenanceMode ?? false);
  const [carouselCount, setCarouselCount] = useState(saved.carouselCount ?? 12);
  const [spotlightCount, setSpotlightCount] = useState(saved.spotlightCount ?? 3);

  const items       = useSpeciesStore((s) => s.items);
  const loading     = useSpeciesStore((s) => s.loading);
  const fetchAll    = useSpeciesStore((s) => s.fetchAll);
  const exportJSON  = useSpeciesStore((s) => s.exportJSON);
  const importJSON  = useSpeciesStore((s) => s.importJSON);
  const mergeImportJSON = useSpeciesStore((s: any) => s.mergeImportJSON);
  const resetToSeed = useSpeciesStore((s) => s.resetToSeed);

  const fileRestoreRef = useRef<HTMLInputElement | null>(null);
  const fileMergeRef   = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchAll();
    fetchAdmins();
    checkApi();
    fetchSessions();
    // auto-refresh login history ทุก 30 วินาที
    const timer = setInterval(fetchSessions, 30_000);
    return () => clearInterval(timer);
  }, [fetchAll]);

  async function fetchSessions() {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`${API_BASE}/api/login-sessions?limit=100`, {
        headers: { Authorization: `Bearer ${btoa(JSON.stringify({ role: token.role }))}` },
      });
      if (res.ok) setSessions(await res.json());
    } catch { /* silent */ }
  }

  const ADMINS_URL = `${API_BASE}/api/admins`;

  async function checkApi() {
    setApiStatus("checking");
    try {
      const r = await fetch(`${API_BASE}/api/health`);
      setApiStatus(r.ok ? "ok" : "fail");
    } catch { setApiStatus("fail"); }
  }

  async function fetchAdmins() {
    try {
      const res = await authFetch(ADMINS_URL);
      const data = await res.json();
      setAdminsList(data);
    } catch { console.error("Error loading admins"); }
  }

  async function addEmail() {
    const email = input.toLowerCase().trim();
    if (!email) return;
    try {
      const res = await authFetch(ADMINS_URL, { method: "POST", body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok) { alert(data.message); setInput(""); fetchAdmins(); }
      else { alert(data.error); }
    } catch { alert("Error connecting to server"); }
  }

  async function removeEmail(email: string) {
    if (!confirm(lang === "th" ? `แน่ใจนะว่าจะลบสิทธิ์แอดมินของ ${email}?` : `Remove admin rights for ${email}?`)) return;
    try {
      const res = await authFetch(`${ADMINS_URL}/${encodeURIComponent(email)}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) { fetchAdmins(); } else { alert(data.error); }
    } catch { alert("Error connecting to server"); }
  }

  function saveSite() {
    saveSiteSettings({ siteName, maintenanceMode, carouselCount, spotlightCount });
    alert(lang === "th" ? "บันทึกการตั้งค่าเรียบร้อย" : "Settings saved");
  }

  function downloadBackup() {
    const text = exportJSON();
    const blob = new Blob([text], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `udomtong-species-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const MAX_JSON_MB = 5;

  async function handleImportFile(file: File) {
    if (file.size > MAX_JSON_MB * 1024 * 1024) { alert(`File too large (max ${MAX_JSON_MB} MB)`); return; }
    if (!confirm(lang === "th" ? "นำเข้าไฟล์จะทับข้อมูลเดิมทั้งหมด แน่ใจหรือไม่?" : "This will overwrite all existing data. Continue?")) return;
    const text = await file.text();
    const res  = await importJSON(text);
    if (!res.ok) { alert("Import failed: " + (res.error || "")); return; }
    alert(`Import success: ${res.count ?? 0} items`);
  }

  async function handleMergeImportFile(file: File) {
    if (file.size > MAX_JSON_MB * 1024 * 1024) { alert(`File too large (max ${MAX_JSON_MB} MB)`); return; }
    if (!confirm(lang === "th" ? "ผสานข้อมูลกับของเดิม แน่ใจหรือไม่?" : "Merge data with existing? Continue?")) return;
    if (typeof mergeImportJSON !== "function") return;
    const text = await file.text();
    const res  = await mergeImportJSON(text);
    if (!res?.ok) { alert("Merge failed: " + (res?.error || "")); return; }
    alert("Merge success");
  }

  const t = {
    title:           lang === "th" ? "ตั้งค่าระบบ" : "System Settings",
    desc:            lang === "th" ? "ควบคุมและจัดการทุกส่วนของเว็บไซต์" : "Control and manage all aspects of the website",
    // Sections
    siteSection:     lang === "th" ? "ตั้งค่าเว็บไซต์" : "Website Settings",
    appearSection:   lang === "th" ? "ธีมและการแสดงผล" : "Theme & Display",
    adminSection:    lang === "th" ? "จัดการผู้ดูแลระบบ" : "Admin Management",
    dataSection:     lang === "th" ? "ข้อมูลและสำรองข้อมูล" : "Data & Backup",
    recoverySection: lang === "th" ? "กู้คืนระบบ" : "System Recovery",
    apiSection:      lang === "th" ? "สถานะ API" : "API Status",
    // Fields
    siteName:        lang === "th" ? "ชื่อเว็บไซต์" : "Site Name",
    maintenance:     lang === "th" ? "โหมดปิดปรับปรุง" : "Maintenance Mode",
    maintenanceDesc: lang === "th" ? "เมื่อเปิด ผู้เยี่ยมชมจะเห็นหน้าปิดปรับปรุง" : "When on, visitors see a maintenance page",
    carouselCount:   lang === "th" ? "จำนวนสายพันธุ์ในแถบเลื่อน (หน้าหลัก)" : "Carousel species count (Home)",
    spotlightCount:  lang === "th" ? "จำนวนประชาสัมพันธ์แนะนำ (หน้าหลัก)" : "Spotlight count (Home)",
    btnSave:         lang === "th" ? "บันทึกการตั้งค่า" : "Save Settings",
    themeLight:      lang === "th" ? "โหมดสว่าง" : "Light Mode",
    themeDark:       lang === "th" ? "โหมดมืด" : "Dark Mode",
    toggleTheme:     lang === "th" ? "สลับธีม" : "Toggle Theme",
    loginAs:         lang === "th" ? "ล็อกอินด้วย:" : "Logged in as:",
    addAdmin:        lang === "th" ? "เพิ่มอีเมลผู้ดูแลระบบ" : "Add Admin Email",
    adminList:       lang === "th" ? "รายชื่อผู้ดูแลระบบ" : "Admin List",
    remove:          lang === "th" ? "ลบสิทธิ์" : "Remove",
    statDb:          lang === "th" ? "รายการในฐานข้อมูลปัจจุบัน" : "Current Database Records",
    items:           lang === "th" ? "รายการ" : "items",
    btnExport:       lang === "th" ? "ดาวน์โหลดไฟล์สำรอง" : "Export Backup",
    btnRestore:      lang === "th" ? "กู้คืน (ทับของเดิม)" : "Restore (Overwrite)",
    btnMerge:        lang === "th" ? "ผสานข้อมูล" : "Merge Data",
    recoveryDesc:    lang === "th" ? "กู้คืนข้อมูลสายพันธุ์ทั้งหมดกลับสู่ค่าเริ่มต้น" : "Restore all species data to system defaults",
    btnReset:        lang === "th" ? "คืนค่าเริ่มต้นฐานข้อมูล" : "Reset to Default Data",
    processing:      lang === "th" ? "กำลังดำเนินการ..." : "Processing...",
    checkApi:        lang === "th" ? "ตรวจสอบการเชื่อมต่อ" : "Check Connection",
    loginHistory:    lang === "th" ? "ประวัติการเข้าสู่ระบบ" : "Login History",
    lhEmail:         lang === "th" ? "อีเมล" : "Email",
    lhName:          lang === "th" ? "ชื่อ" : "Name",
    lhRole:          lang === "th" ? "บทบาท" : "Role",
    lhLoginAt:       lang === "th" ? "เวลาเข้า" : "Login",
    lhLogoutAt:      lang === "th" ? "เวลาออก" : "Logout",
    lhOnline:        lang === "th" ? "ออนไลน์" : "Online",
    lhRefresh:       lang === "th" ? "รีเฟรช" : "Refresh",
    lhEmpty:         lang === "th" ? "ยังไม่มีประวัติ" : "No history yet",
    apiOk:           lang === "th" ? "API ออนไลน์และพร้อมใช้งาน" : "API is online and ready",
    apiFail:         lang === "th" ? "ไม่สามารถเชื่อมต่อ API ได้" : "Cannot connect to API",
    apiChecking:     lang === "th" ? "กำลังตรวจสอบ..." : "Checking...",
    clearSearch:     lang === "th" ? "ล้างประวัติการค้นหาทั้งหมด" : "Clear All Search History",
    clearSearchDesc: lang === "th" ? "ลบประวัติการค้นหาของผู้ใช้ทุกคนในอุปกรณ์นี้" : "Remove search history stored in this device",
    btnClearSearch:  lang === "th" ? "ล้างประวัติการค้นหา" : "Clear Search History",
  };

  function clearAllSearchHistory() {
    localStorage.removeItem("uf_search_history");
    alert(lang === "th" ? "ล้างประวัติการค้นหาเรียบร้อย" : "Search history cleared");
  }

  return (
    <div className="fade-in-up" style={{ maxWidth: 860, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-main)", margin: "0 0 4px" }}>{t.title}</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>{t.desc}</p>

      {/* ── 1. Website Settings ── */}
      <Section title={t.siteSection} icon={<IconGlobe />}>
        <div style={{ display: "grid", gap: 16 }}>
          <FieldRow label={t.siteName}>
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)}
              style={inputStyle} />
          </FieldRow>
          <FieldRow label={t.carouselCount}>
            <input type="number" min={4} max={30} value={carouselCount} onChange={(e) => setCarouselCount(Number(e.target.value))}
              style={{ ...inputStyle, width: 90 }} />
          </FieldRow>
          <FieldRow label={t.spotlightCount}>
            <input type="number" min={1} max={6} value={spotlightCount} onChange={(e) => setSpotlightCount(Number(e.target.value))}
              style={{ ...inputStyle, width: 90 }} />
          </FieldRow>
          <FieldRow label={t.maintenance} desc={t.maintenanceDesc}>
            <Toggle checked={maintenanceMode} onChange={setMaintenance} />
          </FieldRow>
          <button className="btn-primary" onClick={saveSite} style={{ width: "fit-content", padding: "10px 28px", borderRadius: 12 }}>
            {t.btnSave}
          </button>
        </div>
      </Section>

      {/* ── 2. Theme & Display ── */}
      <Section title={t.appearSection} icon={<IconPalette />}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {lang === "th" ? "ธีมปัจจุบัน:" : "Current theme:"}{" "}
            <strong style={{ color: "var(--text-main)" }}>{theme === "light" ? t.themeLight : t.themeDark}</strong>
          </div>
          <button onClick={toggleTheme} style={ghostBtn}>
            <IconMoon /> {t.toggleTheme}
          </button>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>{t.clearSearch}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: 10 }}>{t.clearSearchDesc}</div>
          <button onClick={clearAllSearchHistory} style={ghostBtn}>
            <IconX /> {t.btnClearSearch}
          </button>
        </div>
      </Section>

      {/* ── 3. API Status ── */}
      <Section title={t.apiSection} icon={<IconServer />}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: apiStatus === "ok" ? "var(--primary-light)" : apiStatus === "fail" ? "#fee2e2" : "var(--bg-color)", border: "1px solid var(--border-color)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: apiStatus === "ok" ? "var(--primary)" : apiStatus === "fail" ? "#ef4444" : "var(--text-muted)" }} />
            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: apiStatus === "ok" ? "var(--primary-hover)" : apiStatus === "fail" ? "#991b1b" : "var(--text-muted)" }}>
              {apiStatus === "ok" ? t.apiOk : apiStatus === "fail" ? t.apiFail : t.apiChecking}
            </span>
          </div>
          <button onClick={checkApi} style={ghostBtn}><IconRefresh /> {t.checkApi}</button>
        </div>
        <div style={{ marginTop: 10, fontSize: "0.82rem", color: "var(--text-muted)" }}>
          {API_BASE}
        </div>
      </Section>

      {/* ── 4. Database stat ── */}
      <Section title={t.statDb} icon={<IconDb />}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: "var(--text-main)" }}>{items.length}</span>
          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{t.items}</span>
        </div>
      </Section>

      {/* ── 5. Admin Management ── */}
      <Section title={t.adminSection} icon={<IconShield />}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="example@email.com"
            style={{ flex: 1, ...inputStyle }}
            onKeyDown={(e) => e.key === "Enter" && addEmail()}
          />
          <button className="btn-primary" onClick={addEmail} style={{ padding: "0 22px", borderRadius: 12 }}>
            {lang === "th" ? "เพิ่ม" : "Add"}
          </button>
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 16 }}>
          {t.loginAs} <strong>{user?.email}</strong>
        </div>
        <div style={{ border: "1px solid var(--border-color)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", background: "var(--bg-color)", fontWeight: 800, fontSize: "0.85rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {t.adminList}
          </div>
          {adminsList.map((admin) => (
            <div key={admin.email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 20px", borderBottom: "1px solid var(--border-color)" }}>
              <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>
                {admin.email}
                {admin.email === ADMIN_EMAILS[0] && <span style={{ color: "var(--primary-hover)", marginLeft: 8, fontSize: "0.78rem", fontWeight: 800 }}>(Owner)</span>}
              </div>
              <button onClick={() => removeEmail(admin.email)} disabled={admin.email === ADMIN_EMAILS[0]}
                style={{ ...ghostBtn, opacity: admin.email === ADMIN_EMAILS[0] ? 0.3 : 1, fontSize: "0.85rem", padding: "6px 14px" }}>
                {t.remove}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 6. Data & Backup ── */}
      <Section title={t.dataSection} icon={<IconArchive />}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={downloadBackup} style={{ padding: "10px 20px", borderRadius: 12, fontSize: "0.9rem" }}>
            <IconDownload /> {t.btnExport}
          </button>
          <button style={ghostBtn} onClick={() => fileRestoreRef.current?.click()}><IconUpload /> {t.btnRestore}</button>
          <button style={ghostBtn} onClick={() => fileMergeRef.current?.click()}><IconMerge /> {t.btnMerge}</button>
        </div>
        <input ref={fileRestoreRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); e.currentTarget.value = ""; }} />
        <input ref={fileMergeRef}   type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMergeImportFile(f); e.currentTarget.value = ""; }} />
      </Section>

      {/* ── 7. Login History ── */}
      <Section title={t.loginHistory} icon={<IconHistory />}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--primary-hover)", fontWeight: 700 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", display: "inline-block", animation: "pulse 2s infinite" }} />
            {lang === "th" ? "อัปเดตอัตโนมัติทุก 30 วิ" : "Auto-updates every 30s"}
          </div>
          <button onClick={fetchSessions} style={ghostBtn}><IconRefresh /> {t.lhRefresh}</button>
        </div>
        {sessions.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{t.lhEmpty}</p>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 70px 1fr 1fr", padding: "10px 16px", background: "var(--bg-color)", borderBottom: "1px solid var(--border-color)", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              <span>{t.lhEmail}</span><span>{t.lhName}</span><span>{t.lhRole}</span><span>{t.lhLoginAt}</span><span>{t.lhLogoutAt}</span>
            </div>
            {sessions.map((s) => (
              <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 70px 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem", alignItems: "center" }}>
                <span style={{ color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.user_email}</span>
                <span style={{ color: "var(--text-muted)" }}>{s.user_name || "-"}</span>
                <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, background: s.role === "admin" ? "#fee2e2" : "var(--primary-light)", color: s.role === "admin" ? "#991b1b" : "var(--primary-hover)", width: "fit-content" }}>{s.role}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(s.login_at).toLocaleString()}</span>
                <span style={{ color: s.logout_at ? "var(--text-muted)" : "var(--primary-hover)", fontSize: "0.8rem", fontWeight: s.logout_at ? 400 : 700 }}>
                  {s.logout_at ? new Date(s.logout_at).toLocaleString() : `● ${t.lhOnline}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── 8. System Recovery ── */}
      <Section title={t.recoverySection} icon={<IconReset />} danger>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>{t.recoveryDesc}</p>
        <button onClick={resetToSeed} disabled={loading}
          style={{ padding: "13px 28px", borderRadius: 12, border: "none", background: "#dc2626", color: "#fff", fontWeight: 800, cursor: "pointer", opacity: loading ? 0.6 : 1, fontSize: "0.95rem" }}>
          {loading ? t.processing : t.btnReset}
        </button>
      </Section>
    </div>
  );
}

// ── Reusable Section ──
function Section({ title, icon, children, danger }: { title: string; icon: React.ReactNode; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className="glass-card" style={{ marginBottom: 20, overflow: "hidden", border: danger ? "1.5px dashed #dc2626" : undefined }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-color)", background: "var(--bg-color)", display: "flex", alignItems: "center", gap: 10 }}>
        <span>{icon}</span>
        <span style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "0.95rem" }}>{title}</span>
      </div>
      <div style={{ padding: "22px 24px" }}>{children}</div>
    </div>
  );
}

// ── Field Row ──
function FieldRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.9rem" }}>{label}</div>
        {desc && <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

// ── Toggle ──
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{ width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer", background: checked ? "var(--primary)" : "var(--border-color)", position: "relative", transition: "background 0.25s ease", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: checked ? 24 : 4, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.25s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

// ── Styles ──
const inputStyle: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontFamily: "inherit", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s" };
const ghostBtn: React.CSSProperties  = { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem", fontFamily: "inherit", transition: "all 0.2s" };

// ── SVG Icons ──
function IconGlobe()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function IconPalette() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>; }
function IconShield()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function IconArchive() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>; }
function IconReset()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>; }
function IconServer()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>; }
function IconHistory() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconDb()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>; }
function IconRefresh() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>; }
function IconMoon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function IconX()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function IconDownload(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function IconUpload()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function IconMerge()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>; }
