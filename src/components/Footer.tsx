import { Link } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";
import { Leaf, MapPin, Phone, Map } from "lucide-react";

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
    followUs: lang === "th" ? "ติดตามเรา" : "Follow Us",
    mapLink: lang === "th" ? "ดูแผนที่ฟาร์ม" : "View Farm Map",
  };

  return (
    <footer style={{
      background: "var(--card-bg)",
      borderTop: "1px solid var(--border-color)",
      padding: "60px 24px 30px 24px",
      marginTop: "40px",
    }}>
      <div className="footer-grid" style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
            <Leaf size={18} color="var(--primary-hover)" /> Udomtong
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
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} color="#ef4444" /> {t.addressText}</div>
            <a href="tel:0811733620" style={{ color: "var(--text-muted)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
              <Phone size={14} color="#16a34a" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} /> 081-173-3620
            </a>
            <Link to="/map" style={{ color: "var(--text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
              <Map size={14} color="#0369a1" /> {t.mapLink}
            </Link>
          </div>
        </div>

        {/* Social */}
        <div>
          <h4 style={{ color: "var(--text-main)", fontWeight: 800, marginTop: 0, marginBottom: 16, fontSize: "1rem" }}>
            {t.followUs}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a
              href="https://www.facebook.com/udomtongfarm"
              target="_blank" rel="noopener noreferrer"
              className="footer-social-link"
            >
              <span className="footer-social-icon footer-social-fb">f</span>
              Facebook
            </a>
            <a
              href="https://line.me/ti/p/~udomtongfarm"
              target="_blank" rel="noopener noreferrer"
              className="footer-social-link"
            >
              <span className="footer-social-icon footer-social-line">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.952 9.026c0-4.59-4.601-8.326-10.252-8.326C4.05.7-.5 4.436-.5 9.026c0 4.115 3.65 7.56 8.581 8.21.334.072.79.22.904.505.103.26.068.666.033.928l-.146.876c-.044.26-.204 1.017.891.554s5.916-3.484 8.073-5.97c1.49-1.635 2.116-3.295 2.116-5.103z"/></svg>
              </span>
              LINE
            </a>
            <a
              href="https://www.youtube.com/@udomtongfarm"
              target="_blank" rel="noopener noreferrer"
              className="footer-social-link"
            >
              <span className="footer-social-icon footer-social-yt">▶</span>
              YouTube
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
