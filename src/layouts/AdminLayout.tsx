import { Link, Outlet, useLocation } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";

export default function AdminLayout() {
  const location = useLocation();
  const { lang } = useSettingsStore();

  const t = {
    title:     lang === "th" ? "ระบบแอดมิน" : "Admin Panel",
    dashboard: lang === "th" ? "แผงควบคุม" : "Dashboard",
    species:   lang === "th" ? "จัดการสายพันธุ์" : "Species Manager",
    products:  lang === "th" ? "ราคา & สต็อก" : "Price & Stock",
    orders:    lang === "th" ? "คำสั่งซื้อ" : "Orders",
    settings:  lang === "th" ? "ตั้งค่าระบบ" : "Settings",
    back:      lang === "th" ? "กลับหน้าหลัก" : "Back to Site",
  };

  const menuItems = [
    { path: "/admin",           label: t.dashboard, icon: <IconDashboard /> },
    { path: "/admin/species",   label: t.species,   icon: <IconSpecies />   },
    { path: "/admin/products",  label: t.products,  icon: <IconProduct />   },
    { path: "/admin/orders",    label: t.orders,    icon: <IconOrders />    },
    { path: "/admin/settings",  label: t.settings,  icon: <IconSettings />  },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-color)" }}>
      <aside style={{ width: "260px", background: "var(--card-bg)", borderRight: "1px solid var(--border-color)", padding: "28px 16px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", boxSizing: "border-box" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "36px", paddingLeft: "10px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconLeaf size={20} />
          </div>
          <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "var(--primary-hover)" }}>{t.title}</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 14px", borderRadius: "12px",
                  textDecoration: "none", fontWeight: 600,
                  transition: "all 0.2s ease",
                  background: isActive ? "var(--primary-light)" : "transparent",
                  color: isActive ? "var(--primary-hover)" : "var(--text-muted)",
                  borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--bg-color)"; e.currentTarget.style.color = "var(--text-main)"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; } }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", color: "var(--text-muted)", fontSize: "0.9rem", textDecoration: "none", fontWeight: 600, background: "var(--bg-color)", borderRadius: "12px", border: "1px solid var(--border-color)", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <IconArrowLeft size={16} /> {t.back}
          </Link>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "40px", overflowY: "auto", height: "100vh", boxSizing: "border-box" }}>
        <Outlet />
      </main>
    </div>
  );
}

function IconLeaf({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
}
function IconDashboard() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
}
function IconSpecies() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
}
function IconSettings() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}
function IconProduct() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
}
function IconOrders() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
}
function IconArrowLeft({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
}
