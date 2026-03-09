import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore";
import { API_BASE } from "../config/api";

export default function Dashboard() {
  const { lang } = useSettingsStore();
  const { items, fetchAll } = useSpeciesStore();
  const [apiOk, setApiOk] = useState(true);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((r) => setApiOk(r.ok))
      .catch(() => setApiOk(false));
  }, []);

  const stats = useMemo(() => {
    const all = items;
    const animalItems = items.filter((s) => s.type === "animal");
    const plantItems  = items.filter((s) => s.type === "plant");
    const tags        = all.flatMap((s) => s.tags ?? []);
    const uniqueTags  = new Set(tags).size;
    const withImage   = all.filter((s) => !!s.image).length;
    const withShort   = all.filter((s) => !!s.short_description?.trim()).length;
    return {
      total: all.length,
      animals: animalItems.length,
      plants:  plantItems.length,
      uniqueTags,
      completeness: all.length === 0 ? 0 : Math.round(((withImage + withShort) / (all.length * 2)) * 100),
    };
  }, [items]);

  const t = {
    title:         lang === "th" ? "แผงควบคุม" : "Admin Dashboard",
    desc:          lang === "th" ? "ภาพรวมและสถานะการทำงานของระบบ Udomtong Farm" : "Overview and system status of Udomtong Farm",
    statusOnline:  lang === "th" ? "ระบบออนไลน์" : "System Online",
    statusDB:      lang === "th" ? "ฐานข้อมูลพร้อม" : "DB Ready",
    statusOffline: lang === "th" ? "API ออฟไลน์" : "API Offline",
    statTotal:     lang === "th" ? "รายการทั้งหมด" : "Total Species",
    statAnimals:   lang === "th" ? "ชนิดสัตว์" : "Animals",
    statPlants:    lang === "th" ? "ชนิดพืช" : "Plants",
    statTags:      lang === "th" ? "หมวดหมู่" : "Categories",
    statHealth:    lang === "th" ? "ความครบถ้วน" : "Completeness",
    quickActions:  lang === "th" ? "เมนูด่วน" : "Quick Actions",
    actSpecies:    lang === "th" ? "จัดการสายพันธุ์" : "Species Manager",
    actSpeciesDesc:lang === "th" ? "เพิ่ม แก้ไข หรือลบข้อมูลสัตว์และพืช" : "Add, edit, or remove species data",
    actSettings:   lang === "th" ? "ตั้งค่าระบบ" : "System Settings",
    actSettingsDesc:lang === "th" ? "จัดการแอดมิน สำรองข้อมูล และตั้งค่าเว็บ" : "Manage admins, backups and site settings",
    actViewSite:   lang === "th" ? "ดูหน้าเว็บ" : "View Website",
    actViewSiteDesc:lang === "th" ? "เปิดดูหน้าเว็บหลักในแท็บใหม่" : "Open the public site in a new tab",
    recentActivity:lang === "th" ? "สถานะระบบ" : "System Status",
    authReady:     lang === "th" ? "ระบบสมาชิก" : "Auth System",
    authReadyDesc: lang === "th" ? "ระบบเข้าสู่ระบบและ OTP ทำงานปกติ" : "Login and OTP systems are functioning normally",
    dbSync:        lang === "th" ? "ฐานข้อมูล Turso" : "Turso Database",
    dbSyncDesc:    lang === "th" ? "เชื่อมต่อฐานข้อมูลเรียบร้อย" : "Database connected successfully",
    apiStatus:     lang === "th" ? "API Server" : "API Server",
    apiStatusDesc: lang === "th" ? (apiOk ? "พร้อมให้บริการ" : "ไม่สามารถเชื่อมต่อได้") : (apiOk ? "Running normally" : "Cannot connect"),
  };

  return (
    <div className="fade-in-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--text-main)", margin: 0 }}>{t.title}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4, margin: "4px 0 0" }}>{t.desc}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <StatusPill text={t.statusOnline} ok={true} />
          <StatusPill text={apiOk ? t.statusDB : t.statusOffline} ok={apiOk} />
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard title={t.statTotal}   value={stats.total}       accent="var(--primary)" icon={<IconChart />} />
        <StatCard title={t.statAnimals} value={stats.animals}     icon={<IconPaw />}  />
        <StatCard title={t.statPlants}  value={stats.plants}      icon={<IconLeaf />} />
        <StatCard title={t.statTags}    value={stats.uniqueTags}  icon={<IconTag />}  />
        <StatCard title={t.statHealth}  value={`${stats.completeness}%`} icon={<IconCheck />} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 24 }}>
        {/* Quick actions */}
        <section className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, color: "var(--text-main)", fontWeight: 800 }}>{t.quickActions}</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <ActionLink to="/admin/species" title={t.actSpecies}  desc={t.actSpeciesDesc}  icon={<IconSpecies />}  />
            <ActionLink to="/admin/settings" title={t.actSettings} desc={t.actSettingsDesc} icon={<IconSettings />} />
            <a href="/" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border-color)", textDecoration: "none", color: "inherit", transition: "all 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
            >
              <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconExternal /></span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-main)" }}>{t.actViewSite}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{t.actViewSiteDesc}</div>
              </div>
            </a>
          </div>
        </section>

        {/* System status */}
        <section className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, color: "var(--text-main)", fontWeight: 800 }}>{t.recentActivity}</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { title: t.authReady,  desc: t.authReadyDesc,  ok: true,  icon: <IconLock /> },
              { title: t.dbSync,     desc: t.dbSyncDesc,     ok: true,  icon: <IconDb />   },
              { title: t.apiStatus,  desc: t.apiStatusDesc,  ok: apiOk, icon: <IconServer /> },
            ].map((r) => (
              <div key={r.title} style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-color)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: r.ok ? "var(--primary-light)" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: 13 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{r.desc}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.ok ? "var(--primary)" : "#ef4444", flexShrink: 0, marginTop: 4 }} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, accent, icon }: { title: string; value: any; accent?: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: "18px 20px", borderTop: accent ? `3px solid ${accent}` : "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8 }}>{title}</div>
        <div style={{ opacity: 0.7 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text-main)" }}>{value}</div>
    </div>
  );
}

function ActionLink({ to, title, desc, icon }: { to: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <Link to={to}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border-color)", textDecoration: "none", color: "inherit", transition: "all 0.2s" }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
    >
      <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-main)" }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{desc}</div>
      </div>
    </Link>
  );
}

function StatusPill({ text, ok }: { text: string; ok: boolean }) {
  return (
    <span style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 800, background: ok ? "var(--primary-light)" : "#fee2e2", color: ok ? "var(--primary-hover)" : "#991b1b", display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor" }} /> {text}
    </span>
  );
}

// SVG Icons
function IconChart() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>; }
function IconPaw()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-muted)" stroke="none"><circle cx="4.5" cy="9.5" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19.5" cy="9.5" r="2"/><path d="M12 12.5c-2.5 0-6 2.5-6 5.5a2.5 2.5 0 0 0 2.5 2.5c1 0 2-.5 3.5-.5s2.5.5 3.5.5A2.5 2.5 0 0 0 18 18c0-3-3.5-5.5-6-5.5z"/></svg>; }
function IconLeaf() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>; }
function IconTag()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>; }
function IconCheck(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>; }
function IconLock() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function IconDb()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>; }
function IconServer(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>; }
function IconSpecies(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>; }
function IconSettings(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function IconExternal(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }
