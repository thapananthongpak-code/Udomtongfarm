import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useSettingsStore } from "../store/settingsStore";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { lang, theme, fontSize, toggleLang, toggleTheme, setFontSize } = useSettingsStore();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = {
    home: lang === "th" ? "หน้าแรก" : "Home",
    encyclo: lang === "th" ? "สารานุกรม" : "Encyclopedia",
    contact: lang === "th" ? "ติดต่อเรา" : "Contact",
    adminBadge: lang === "th" ? "แอดมิน" : "Admin",
    memberBadge: lang === "th" ? "สมาชิก" : "Member",
    sysSettings: lang === "th" ? "ตั้งค่าระบบ" : "Settings",
    logoutBtn: lang === "th" ? "ออกจากระบบ" : "Logout",
    loginBtn: lang === "th" ? "เข้าสู่ระบบ" : "Login",
    regBtn: lang === "th" ? "สมัครสมาชิก" : "Register",
  };

  function onLogout() {
    logout();
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <nav
      style={{
        background: "var(--card-bg)",
        borderBottom: "1px solid var(--border-color)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.10)" : "0 2px 10px rgba(0,0,0,0.02)",
        transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Left: Logo + Desktop nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{
            background: "var(--primary-light)",
            color: "var(--primary-hover)",
            padding: "6px 12px",
            borderRadius: 8,
            fontWeight: 800,
            fontSize: 20,
            transition: "all 0.3s ease",
          }}>
            🌿 Udomtong
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-desktop-links" style={{ display: "flex", gap: 16 }}>
          <Link to="/" style={{ color: "var(--text-muted)", fontWeight: 500 }}>{t.home}</Link>
          <Link to="/encyclopedia" style={{ color: "var(--text-muted)", fontWeight: 500 }}>{t.encyclo}</Link>
          <Link to="/contact" style={{ color: "var(--text-muted)", fontWeight: 500 }}>{t.contact}</Link>
        </div>
      </div>

      {/* Right: Controls + Auth (desktop) */}
      <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Control panel */}
        <div style={{ display: "flex", background: "var(--bg-color)", padding: "4px", borderRadius: "12px", gap: "4px", border: "1px solid var(--border-color)" }}>
          <button onClick={() => setFontSize("small")} style={{ background: fontSize === "small" ? "var(--primary-light)" : "transparent", color: "var(--text-main)", border: "none", borderRadius: "8px", padding: "4px 10px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>A-</button>
          <button onClick={() => setFontSize("large")} style={{ background: fontSize === "large" ? "var(--primary-light)" : "transparent", color: "var(--text-main)", border: "none", borderRadius: "8px", padding: "4px 10px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>A+</button>
          <div style={{ width: "1px", background: "var(--border-color)", margin: "4px" }} />
          <button onClick={toggleLang} style={{ background: "transparent", color: "var(--text-main)", border: "none", padding: "4px 10px", fontWeight: 800, cursor: "pointer" }}>{lang.toUpperCase()}</button>
          <button onClick={toggleTheme} style={{ background: "transparent", color: "var(--text-main)", border: "none", padding: "4px 10px", fontSize: "1.1rem", cursor: "pointer" }}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        {user ? (
          <>
            <div style={{ color: "var(--text-main)", fontWeight: 500, fontSize: 14 }}>
              {user.email}{" "}
              <span style={{
                background: role === "admin" ? "#fee2e2" : "var(--primary-light)",
                color: role === "admin" ? "#991b1b" : "var(--primary-hover)",
                padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 700,
              }}>
                {role === "admin" ? t.adminBadge : t.memberBadge}
              </span>
            </div>
            {role === "admin" && (
              <Link to="/admin" style={{ color: "var(--text-muted)", fontWeight: 600 }}>{t.sysSettings}</Link>
            )}
            <button onClick={onLogout} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s ease" }}>
              {t.logoutBtn}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "var(--text-main)", fontWeight: 600 }}>{t.loginBtn}</Link>
            <Link to="/register" style={{ background: "var(--primary)", color: "white", padding: "8px 16px", borderRadius: 10, fontWeight: 600, textDecoration: "none", transition: "all 0.2s ease" }}>
              {t.regBtn}
            </Link>
          </>
        )}
      </div>

      {/* Mobile: hamburger button */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen((v) => !v)}
        style={{
          display: "none",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          color: "var(--text-main)",
          padding: "4px 8px",
        }}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--card-bg)",
            borderBottom: "1px solid var(--border-color)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            zIndex: 99,
          }}
        >
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: "var(--text-main)", fontWeight: 600, textDecoration: "none" }}>{t.home}</Link>
          <Link to="/encyclopedia" onClick={() => setMenuOpen(false)} style={{ color: "var(--text-main)", fontWeight: 600, textDecoration: "none" }}>{t.encyclo}</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} style={{ color: "var(--text-main)", fontWeight: 600, textDecoration: "none" }}>{t.contact}</Link>

          {/* Controls row */}
          <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
            <button onClick={() => setFontSize("small")} style={{ background: fontSize === "small" ? "var(--primary-light)" : "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 12px", fontWeight: 700, cursor: "pointer" }}>A-</button>
            <button onClick={() => setFontSize("large")} style={{ background: fontSize === "large" ? "var(--primary-light)" : "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 12px", fontWeight: 700, cursor: "pointer" }}>A+</button>
            <button onClick={toggleLang} style={{ background: "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 12px", fontWeight: 800, cursor: "pointer" }}>{lang.toUpperCase()}</button>
            <button onClick={toggleTheme} style={{ background: "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 12px", fontSize: "1.1rem", cursor: "pointer" }}>{theme === "light" ? "🌙" : "☀️"}</button>
          </div>

          {user ? (
            <>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{user.email}</div>
              {role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ color: "var(--primary-hover)", fontWeight: 600, textDecoration: "none" }}>{t.sysSettings}</Link>
              )}
              <button onClick={onLogout} style={{ padding: "10px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", cursor: "pointer", fontWeight: 600 }}>
                {t.logoutBtn}
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 600, textDecoration: "none" }}>{t.loginBtn}</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, background: "var(--primary)", color: "white", fontWeight: 600, textDecoration: "none" }}>{t.regBtn}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
