import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore"; // 🟢

export default function Dashboard() {
  const { lang } = useSettingsStore();
  const { items, fetchAll } = useSpeciesStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = useMemo(() => {
    const all = items;
    const animalItems = items.filter((s) => s.type === "animal");
    const plantItems = items.filter((s) => s.type === "plant");
    const tags = all.flatMap((s) => s.tags ?? []);
    const uniqueTags = new Set(tags).size;
    const withSci = all.filter((s) => !!s.scientific_name).length;
    const withImage = all.filter((s) => !!s.image).length;
    const withShort = all.filter((s) => !!s.short_description?.trim()).length;

    return {
      total: all.length, animals: animalItems.length, plants: plantItems.length,
      uniqueTags, withSci, completeness: all.length === 0 ? 0 : Math.round(((withImage + withShort) / (all.length * 2)) * 100)
    };
  }, [items]);

  // 🟢 พจนานุกรมแปล Dashboard
  const t = {
    title: lang === "th" ? "แผงควบคุม" : "Admin Dashboard",
    desc: lang === "th" ? "ภาพรวมและสถานะการทำงานของระบบ Udomtong Farm" : "Overview and system status of Udomtong Farm",
    statusOnline: lang === "th" ? "ระบบออนไลน์" : "System: Online",
    statusDB: lang === "th" ? "ฐานข้อมูลพร้อม" : "Turso DB: Ready",
    statTotal: lang === "th" ? "รายการทั้งหมด" : "Total Species",
    statAnimals: lang === "th" ? "ชนิดสัตว์" : "Animals",
    statPlants: lang === "th" ? "ชนิดพืช" : "Plants",
    statTags: lang === "th" ? "หมวดหมู่แท็ก" : "Unique Tags",
    statHealth: lang === "th" ? "ความครบถ้วน" : "Data Health",
    quickActions: lang === "th" ? "เมนูด่วน" : "Quick Actions",
    actSpecies: lang === "th" ? "จัดการสายพันธุ์" : "Species Manager",
    actSpeciesDesc: lang === "th" ? "เพิ่ม แก้ไข หรือลบ ข้อมูลสัตว์และพืชในระบบ" : "Add, edit, or remove species data in the system",
    actSecurity: lang === "th" ? "ตั้งค่าระบบ" : "Security & Backup",
    actSecurityDesc: lang === "th" ? "จัดการสิทธิ์ Admin และสำรองข้อมูล JSON" : "Manage Admin privileges and JSON backups",
    recentActivity: lang === "th" ? "กิจกรรมล่าสุด" : "Recent Activity",
    today: lang === "th" ? "วันนี้" : "Today",
    authReady: lang === "th" ? "ระบบสมาชิกพร้อม" : "Auth Ready",
    authReadyDesc: lang === "th" ? "ระบบเข้าสู่ระบบและ OTP ใช้งานได้ปกติ" : "Login and OTP systems are functioning normally",
    dbSync: lang === "th" ? "ฐานข้อมูลซิงค์แล้ว" : "Database Sync",
    dbSyncDesc: lang === "th" ? "เชื่อมต่อฐานข้อมูล Turso เรียบร้อย" : "Turso database connected successfully",
  };

  const recent = [
    { title: t.authReady, desc: t.authReadyDesc, time: t.today, icon: "🔒" },
    { title: t.dbSync, desc: t.dbSyncDesc, time: t.today, icon: "🌿" },
  ];

  return (
    <div className="fade-in-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: "var(--text-main)", margin: 0 }}>{t.title}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>{t.desc}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <StatusPill text={t.statusOnline} ok={true} />
          <StatusPill text={t.statusDB} ok={true} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 32 }}>
        <StatCard title={t.statTotal} value={stats.total} color="var(--primary)" />
        <StatCard title={t.statAnimals} value={stats.animals} />
        <StatCard title={t.statPlants} value={stats.plants} />
        <StatCard title={t.statTags} value={stats.uniqueTags} />
        <StatCard title={t.statHealth} value={`${stats.completeness}%`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
        <section className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20, color: "var(--text-main)" }}>{t.quickActions}</h3>
          <div style={{ display: "grid", gap: 12 }}>
            <ActionLink to="/admin/species" title={t.actSpecies} desc={t.actSpeciesDesc} icon="🐾" />
            <ActionLink to="/admin/settings" title={t.actSecurity} desc={t.actSecurityDesc} icon="🔒" />
          </div>
        </section>

        <section className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20, color: "var(--text-main)" }}>{t.recentActivity}</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {recent.map((r) => (
              <div key={r.title} style={{ padding: 16, borderRadius: 14, border: "1px solid var(--border-color)", background: "var(--bg-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 800, color: "var(--text-main)" }}>{r.icon} {r.title}</div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>{r.time}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: any) {
  return (
    <div className="glass-card" style={{ padding: 20, textAlign: "center", borderTop: color ? `4px solid ${color}` : "1px solid var(--border-color)" }}>
      <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8, color: "var(--text-main)" }}>{value}</div>
    </div>
  );
}

function ActionLink({ to, title, desc, icon }: any) {
  return (
    <Link to={to} style={{ display: "block", padding: 16, borderRadius: 14, border: "1px solid var(--border-color)", textDecoration: "none", color: "inherit", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}>
      <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text-main)" }}>{icon} {title}</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{desc}</div>
    </Link>
  );
}

function StatusPill({ text, ok }: any) {
  return (
    <span style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 800, background: ok ? "var(--primary-light)" : "#fee2e2", color: ok ? "var(--primary-hover)" : "#991b1b", display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: 10, background: "currentColor" }} /> {text}
    </span>
  );
}