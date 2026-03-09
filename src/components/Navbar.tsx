import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useSettingsStore } from "../store/settingsStore";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuth();
  const { lang, theme, fontSize, toggleLang, toggleTheme, setFontSize } = useSettingsStore();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function navLinkClass(path: string) {
    const exact = location.pathname === path;
    return "nav-link" + (exact ? " nav-active" : "");
  }

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
            padding: "6px 14px",
            borderRadius: 8,
            fontWeight: 800,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.3s ease",
          }}>
            <IconLeafLogo />
            Udomtong
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-desktop-links" style={{ display: "flex", gap: 20 }}>
          <Link to="/" className={navLinkClass("/")}>{t.home}</Link>
          <Link to="/encyclopedia" className={navLinkClass("/encyclopedia")}>{t.encyclo}</Link>
          <Link to="/contact" className={navLinkClass("/contact")}>{t.contact}</Link>
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
            {/* Avatar + email + role → /profile */}
            <Link to="/profile" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "4px 10px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)" }}>
              <AvatarBubble avatar={user.avatar} name={user.name} role={role} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 8px", borderRadius: 20, background: role === "admin" ? "#fee2e2" : "var(--primary-light)", color: role === "admin" ? "#991b1b" : "var(--primary-hover)" }}>
                  {role === "admin" ? t.adminBadge : t.memberBadge}
                </span>
              </div>
            </Link>
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
        {menuOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        )}
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
          <Link to="/" onClick={() => setMenuOpen(false)} className={navLinkClass("/")} style={{ fontSize: "1rem" }}>{t.home}</Link>
          <Link to="/encyclopedia" onClick={() => setMenuOpen(false)} className={navLinkClass("/encyclopedia")} style={{ fontSize: "1rem" }}>{t.encyclo}</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className={navLinkClass("/contact")} style={{ fontSize: "1rem" }}>{t.contact}</Link>

          {/* Controls row */}
          <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
            <button onClick={() => setFontSize("small")} style={{ background: fontSize === "small" ? "var(--primary-light)" : "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 12px", fontWeight: 700, cursor: "pointer" }}>A-</button>
            <button onClick={() => setFontSize("large")} style={{ background: fontSize === "large" ? "var(--primary-light)" : "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 12px", fontWeight: 700, cursor: "pointer" }}>A+</button>
            <button onClick={toggleLang} style={{ background: "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 12px", fontWeight: 800, cursor: "pointer" }}>{lang.toUpperCase()}</button>
            <button onClick={toggleTheme} style={{ background: "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 12px", fontSize: "1.1rem", cursor: "pointer" }}>{theme === "light" ? "🌙" : "☀️"}</button>
          </div>

          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <AvatarBubble avatar={user.avatar} name={user.name} role={role} />
                <div>
                  <div style={{ color: "var(--text-main)", fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{user.email}</div>
                </div>
              </Link>
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

function AvatarBubble({ avatar, name, role }: { avatar?: string; name: string; role: string }) {
  const isImg = avatar && (avatar.startsWith("http") || avatar.startsWith("data:"));
  const isEmoji = avatar && !isImg;
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: isImg ? "transparent" : role === "admin" ? "#fee2e2" : "var(--primary-light)",
      border: `2px solid ${role === "admin" ? "#fca5a5" : "var(--primary)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", fontSize: isEmoji ? 18 : 13, fontWeight: 900,
      color: role === "admin" ? "#991b1b" : "var(--primary-hover)",
      transition: "opacity 0.2s",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
    >
      {isImg ? (
        <img src={avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : isEmoji ? (
        <span>{avatar}</span>
      ) : (
        <span>{name?.[0]?.toUpperCase() ?? "U"}</span>
      )}
    </div>
  );
}

function IconLeafLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}
