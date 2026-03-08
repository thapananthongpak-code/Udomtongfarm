import { Link, Outlet, useLocation } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore"; // 🟢 ดึง Store ภาษามาใช้

export default function AdminLayout() {
  const location = useLocation();
  const { lang } = useSettingsStore();

  // 🟢 พจนานุกรมแปลเมนู
  const t = {
    title: lang === "th" ? "🌿 ระบบแอดมิน" : "🌿 Admin Panel",
    dashboard: lang === "th" ? "แผงควบคุม" : "Dashboard",
    species: lang === "th" ? "จัดการสายพันธุ์" : "Species Manager",
    settings: lang === "th" ? "ตั้งค่าระบบ" : "Admin Settings",
    back: lang === "th" ? "← กลับไปหน้าเว็บหลัก" : "← Back to site",
  };

  const menuItems = [
    { path: "/admin", label: t.dashboard, icon: "📊" },
    { path: "/admin/species", label: t.species, icon: "🐾" },
    { path: "/admin/settings", label: t.settings, icon: "⚙️" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-color)" }}>
      <aside style={{
        width: "280px", 
        background: "var(--card-bg)", 
        borderRight: "1px solid var(--border-color)",
        padding: "30px 20px", 
        display: "flex", 
        flexDirection: "column", 
        position: "sticky", 
        top: 0, 
        height: "100vh",
        boxSizing: "border-box" // 🟢 ป้องกันการล้นจอ
      }}>
        <div style={{ fontWeight: 900, fontSize: "1.5rem", color: "var(--primary-hover)", marginBottom: "40px", paddingLeft: "10px" }}>
          {t.title}
        </div>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", borderRadius: "12px",
                  textDecoration: "none", fontWeight: 600, transition: "all 0.3s ease",
                  background: isActive ? "var(--primary-light)" : "transparent",
                  color: isActive ? "var(--primary-hover)" : "var(--text-muted)",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span> {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 🟢 ปุ่มกลับหน้าหลัก (ปรับเป็นปุ่มสวยๆ) */}
        <div style={{ 
          marginTop: "auto", 
          paddingTop: "20px",
          borderTop: "1px solid var(--border-color)" 
        }}>
          <Link 
            to="/" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              padding: "12px 18px",
              color: "var(--text-main)", 
              fontSize: "0.95rem", 
              textDecoration: "none", 
              fontWeight: 700,
              background: "var(--bg-color)", 
              borderRadius: "12px", 
              border: "1px solid var(--border-color)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.color = "var(--primary-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--text-main)";
            }}
          >
            {t.back}
          </Link>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "40px", overflowY: "auto", height: "100vh", boxSizing: "border-box" }}>
        <Outlet />
      </main>
    </div>
  );
}