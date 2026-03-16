import { Link } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";

export default function Footer() {
  const { lang } = useSettingsStore();
  const year = new Date().getFullYear();

  const t = {
    desc: lang === "th"
      ? "ระบบสารานุกรมสิ่งมีชีวิตในฟาร์มอุดมทอง รวบรวมข้อมูลสัตว์และพืชพันธุ์หายากอย่างครบถ้วน"
      : "Udomtong Farm Encyclopedia — a comprehensive database of rare animals and plants.",
    quickLinks: lang === "th" ? "ลิงก์ด่วน" : "Quick Links",
    home: lang === "th" ? "หน้าแรก" : "Home",
    encyclo: lang === "th" ? "สารานุกรม" : "Encyclopedia",
    login: lang === "th" ? "เข้าสู่ระบบ" : "Login",
    contact: lang === "th" ? "ติดต่อเรา" : "Contact",
    address: lang === "th" ? "ที่อยู่" : "Address",
    addressText: lang === "th" ? "ฟาร์มอุดมทอง จ.ชัยภูมิ" : "Udomtong Farm, Chaiyaphum",
    rights: lang === "th" ? "สงวนลิขสิทธิ์" : "All rights reserved",
  };

  return (
    <footer style={{
      background: "var(--card-bg)",
      borderTop: "1px solid var(--border-color)",
      padding: "60px 24px 30px 24px",
      marginTop: "40px",
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 40,
        marginBottom: 40,
      }}>
        {/* Brand column */}
        <div>
          <div style={{
            background: "var(--primary-light)",
            color: "var(--primary-hover)",
            padding: "6px 14px",
            borderRadius: 8,
            fontWeight: 800,
            fontSize: 20,
            display: "inline-block",
            marginBottom: 16,
          }}>
            🌿 Udomtong
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>
            {t.desc}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{ color: "var(--text-main)", fontWeight: 800, marginTop: 0, marginBottom: 16, fontSize: "1rem" }}>
            {t.quickLinks}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { to: "/", label: t.home },
              { to: "/encyclopedia", label: t.encyclo },
              { to: "/contact", label: t.contact },
              { to: "/login", label: t.login },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                → {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: "var(--text-main)", fontWeight: 800, marginTop: 0, marginBottom: 16, fontSize: "1rem" }}>
            {t.contact}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, color: "var(--text-muted)", fontSize: "0.9rem" }}>
            <div>📍 {t.addressText}</div>
            <a href="tel:0811733620" style={{ color: "var(--text-muted)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
              📞 081-173-3620
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        paddingTop: 20,
        borderTop: "1px solid var(--border-color)",
        display: "flex",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: "0.85rem",
      }}>
        © {year} Udomtong Farm — {t.rights}
      </div>
    </footer>
  );
}
