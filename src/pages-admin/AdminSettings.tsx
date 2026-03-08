import { useRef, useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore";
import { API_BASE } from "../config/api";
import { authFetch } from "../utils/authFetch";
import { ADMIN_EMAILS } from "../config/admin";

export default function AdminSettings() {
  const { user } = useAuth();
  const { lang } = useSettingsStore(); // 🟢

  const [input, setInput] = useState("");
  const [adminsList, setAdminsList] = useState<{email: string}[]>([]);

  const items = useSpeciesStore((s) => s.items); 
  const loading = useSpeciesStore((s) => s.loading);
  const fetchAll = useSpeciesStore((s) => s.fetchAll); 
  const exportJSON = useSpeciesStore((s) => s.exportJSON);
  const importJSON = useSpeciesStore((s) => s.importJSON);
  const mergeImportJSON = useSpeciesStore((s: any) => s.mergeImportJSON);
  const resetToSeed = useSpeciesStore((s) => s.resetToSeed);

  const fileRestoreRef = useRef<HTMLInputElement | null>(null);
  const fileMergeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchAll();
    fetchAdmins();
  }, [fetchAll]);

  const ADMINS_URL = `${API_BASE}/api/admins`;

  async function fetchAdmins() {
    try {
      const res = await authFetch(ADMINS_URL);
      const data = await res.json();
      setAdminsList(data);
    } catch (e) { console.error("Error loading admins"); }
  }

  async function addEmail() {
    const email = input.toLowerCase().trim();
    if (!email) return;
    try {
      const res = await authFetch(ADMINS_URL, { method: "POST", body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok) { alert(data.message); setInput(""); fetchAdmins(); } else { alert(data.error); }
    } catch (e) { alert("Error connecting to server"); }
  }

  async function removeEmail(email: string) {
    if (!confirm(lang === "th" ? `แน่ใจนะว่าจะลบสิทธิ์แอดมินของ ${email}?` : `Are you sure you want to remove admin rights for ${email}?`)) return;
    try {
      const res = await authFetch(`${ADMINS_URL}/${encodeURIComponent(email)}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) { fetchAdmins(); } else { alert(data.error); }
    } catch (e) { alert("Error connecting to server"); }
  }

  function downloadBackup() {
    const text = exportJSON();
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `udomtong-species-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const MAX_JSON_MB = 5;

  async function handleImportFile(file: File) {
    if (file.size > MAX_JSON_MB * 1024 * 1024) {
      alert(lang === "th" ? `ไฟล์ใหญ่เกินไป (สูงสุด ${MAX_JSON_MB} MB)` : `File too large (max ${MAX_JSON_MB} MB)`);
      return;
    }
    const msgImport = lang === "th" ? "นำเข้าไฟล์จะทับข้อมูลเดิมทั้งหมด แน่ใจหรือไม่?" : "Importing will overwrite all existing data. Are you sure?";
    if (!confirm(msgImport)) return;
    const text = await file.text();
    const res = await importJSON(text);
    if (!res.ok) { alert("Import failed: " + (res.error || "")); return; }
    alert(`Import success: ${res.count ?? 0} items`);
  }

  async function handleMergeImportFile(file: File) {
    if (file.size > MAX_JSON_MB * 1024 * 1024) {
      alert(lang === "th" ? `ไฟล์ใหญ่เกินไป (สูงสุด ${MAX_JSON_MB} MB)` : `File too large (max ${MAX_JSON_MB} MB)`);
      return;
    }
    if (!confirm(lang === "th" ? "นำเข้าแบบ MERGE จะ 'รวมเข้ากับของเดิม' แน่ใจหรือไม่?" : "Merge import will combine data. Are you sure?")) return;
    if (typeof mergeImportJSON !== "function") return;
    const text = await file.text();
    const res = await mergeImportJSON(text);
    if (!res?.ok) { alert("Merge failed: " + (res?.error || "")); return; }
    alert(`Merge success ✅`);
  }

  // 🟢 พจนานุกรมแปลหน้า Settings
  const t = {
    title: lang === "th" ? "ตั้งค่าระบบผู้ดูแล" : "Admin Settings",
    desc: lang === "th" ? "จัดการสิทธิ์ผู้ดูแลระบบและสำรองข้อมูลฐานข้อมูล" : "Manage admin privileges and database backups",
    statDb: lang === "th" ? "สถิติข้อมูลในฐานข้อมูลปัจจุบัน" : "Current Database Statistics",
    items: lang === "th" ? "รายการ" : "items",
    addAdmin: lang === "th" ? "เพิ่มอีเมลผู้ดูแลระบบ (Admin)" : "Add Admin Email",
    loginAs: lang === "th" ? "ล็อกอินด้วย:" : "Logged in as:",
    adminList: lang === "th" ? "รายชื่อผู้ดูแลระบบ (Whitelist)" : "Admin List (Whitelist)",
    remove: lang === "th" ? "ลบสิทธิ์" : "Remove",
    recovery: lang === "th" ? "กู้คืนระบบ (System Recovery)" : "System Recovery",
    recoveryDesc: lang === "th" ? "กู้คืนข้อมูลสายพันธุ์ทั้งหมดกลับสู่ค่าเริ่มต้นของระบบ" : "Restore all species data to system defaults",
    btnReset: lang === "th" ? "🔄 คืนค่าเริ่มต้นฐานข้อมูล" : "🔄 Reset to Database Seed",
    backupTitle: lang === "th" ? "สำรองและกู้คืนไฟล์ข้อมูล (JSON)" : "Backup and Restore Data (JSON)",
    btnExport: lang === "th" ? "ดาวน์โหลดไฟล์สำรอง" : "Export Backup",
    btnRestore: lang === "th" ? "กู้คืนข้อมูล (ทับของเดิม)" : "Restore (Overwrite)",
    btnMerge: lang === "th" ? "ผสานข้อมูล (ไม่ทับ)" : "Merge Data",
    loading: lang === "th" ? "กำลังดำเนินการ..." : "Processing...",
  };

  return (
    <div className="fade-in-up" style={{ maxWidth: 900, paddingBottom: 40 }}>
      <h1 style={{ fontSize: 34, fontWeight: 900, color: "var(--text-main)" }}>{t.title}</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 6 }}>{t.desc}</p>

      <div className="glass-card" style={{ marginTop: 24, padding: 24, background: "var(--primary-light)", border: "none" }}>
        <div style={{ fontWeight: 800, color: "var(--primary-hover)" }}>{t.statDb}</div>
        <div style={{ fontSize: 32, marginTop: 8, fontWeight: 900, color: "var(--text-main)" }}>
          {items.length} <span style={{ fontSize: 16, fontWeight: 500 }}>{t.items}</span>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: 24, padding: 24 }}>
        <div style={{ fontWeight: 800, marginBottom: 16, color: "var(--text-main)" }}>{t.addAdmin}</div>
        <div style={{ display: "flex", gap: 12 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="example@email.com" style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)" }} />
          <button className="btn-primary" onClick={addEmail} style={{ padding: "0 24px" }}>Add</button>
        </div>
        <div style={{ marginTop: 12, color: "var(--text-muted)", fontSize: 13 }}>
          {t.loginAs} <b>{user?.email}</b>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: 24, overflow: "hidden", padding: 0 }}>
        <div style={{ padding: "16px 24px", background: "var(--bg-color)", fontWeight: 800, borderBottom: "1px solid var(--border-color)", color: "var(--text-main)" }}>
          {t.adminList}
        </div>
        {adminsList.map((admin) => (
          <div key={admin.email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid var(--border-color)" }}>
            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {admin.email} {admin.email === ADMIN_EMAILS[0] && <span style={{color: 'var(--primary-hover)', marginLeft: 8}}>(Owner)</span>}
            </div>
            <button onClick={() => removeEmail(admin.email)} disabled={admin.email === ADMIN_EMAILS[0]}
              style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border-color)", background: "transparent", cursor: "pointer", fontWeight: 700, color: "var(--text-main)", opacity: admin.email === ADMIN_EMAILS[0] ? 0.3 : 1 }}
            >
              {t.remove}
            </button>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: 24, padding: 24, border: "2px dashed var(--primary)" }}>
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8, color: "var(--text-main)" }}>{t.recovery}</div>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>{t.recoveryDesc}</p>
        <button onClick={resetToSeed} disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", background: "var(--primary)", color: "#fff", fontWeight: 800, cursor: "pointer" }}>
          {loading ? t.loading : t.btnReset}
        </button>
      </div>

      <div className="glass-card" style={{ marginTop: 24, padding: 24 }}>
        <div style={{ fontWeight: 800, marginBottom: 16, color: "var(--text-main)" }}>{t.backupTitle}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={downloadBackup}>{t.btnExport}</button>
          <button style={btnGhost} onClick={() => fileRestoreRef.current?.click()}>{t.btnRestore}</button>
          <button style={btnGhost} onClick={() => fileMergeRef.current?.click()}>{t.btnMerge}</button>
        </div>
        <input ref={fileRestoreRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImportFile(file); e.currentTarget.value = ""; }} />
        <input ref={fileMergeRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleMergeImportFile(file); e.currentTarget.value = ""; }} />
      </div>
    </div>
  );
}

const btnGhost = { padding: "10px 16px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer" };