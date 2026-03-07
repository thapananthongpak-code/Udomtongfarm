import { useSettingsStore } from "../../store/settingsStore";
import FounderCard from "../../components/FounderCard";

const MAP_URL = "https://maps.app.goo.gl/wZU3hkUTgYLfEhK38";
const PHONE = "0811733620";
const PHONE_DISPLAY = "081-173-3620";

export default function Contact() {
  const { lang } = useSettingsStore();

  const t = {
    title: lang === "th" ? "ติดต่อเรา" : "Contact Us",
    subtitle:
      lang === "th"
        ? "ยินดีรับทุกคำถาม ข้อเสนอแนะ หรือการประสานงานเยี่ยมชมฟาร์ม"
        : "We welcome questions, suggestions, and farm visit arrangements.",
    phoneLabel: lang === "th" ? "เบอร์ติดต่อ" : "Phone",
    phoneNote: lang === "th" ? "โทรได้ทุกวัน 08:00 – 18:00 น." : "Available daily 08:00 – 18:00",
    locationLabel: lang === "th" ? "ที่ตั้งฟาร์ม" : "Farm Location",
    locationText:
      lang === "th"
        ? "ฟาร์มอุดมทอง จ.นครราชสีมา"
        : "Udomtong Farm, Nakhon Ratchasima",
    openMap: lang === "th" ? "เปิดใน Google Maps" : "Open in Google Maps",
    mapNote:
      lang === "th"
        ? "คลิกปุ่มด้านล่างเพื่อดูเส้นทางนำทาง"
        : "Click the button below for directions.",
    howToReach: lang === "th" ? "วิธีการเดินทาง" : "How to Reach Us",
    directions:
      lang === "th"
        ? "สามารถเดินทางมาได้ด้วยรถยนต์ส่วนตัว กรุณาติดต่อล่วงหน้าเพื่อนัดหมาย"
        : "Best reached by private vehicle. Please contact us in advance to schedule a visit.",
  };

  return (
    <div className="fade-in-up" style={{ maxWidth: 860, margin: "0 auto", padding: "60px 20px 100px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "var(--text-main)", margin: 0 }}>
          {t.title}
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 12, fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 560, margin: "12px auto 0" }}>
          {t.subtitle}
        </p>
      </div>

      {/* Contact cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 32 }}>

        {/* Phone card */}
        <div className="glass-card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "var(--primary-light)", color: "var(--primary-hover)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>📞</div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)" }}>{t.phoneLabel}</div>
          </div>
          <a
            href={`tel:${PHONE}`}
            style={{
              fontSize: "2rem", fontWeight: 900, color: "var(--primary-hover)",
              textDecoration: "none", letterSpacing: 1,
            }}
          >
            {PHONE_DISPLAY}
          </a>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{t.phoneNote}</div>
        </div>

        {/* Location card */}
        <div className="glass-card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "var(--primary-light)", color: "var(--primary-hover)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>📍</div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)" }}>{t.locationLabel}</div>
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", lineHeight: 1.5 }}>
            {t.locationText}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{t.mapNote}</div>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 20px", borderRadius: 12, textDecoration: "none",
              fontWeight: 700, fontSize: "0.95rem", marginTop: 8,
              width: "fit-content",
            }}
          >
            🗺️ {t.openMap}
          </a>
        </div>
      </div>

      {/* Map preview — click-through to Google Maps */}
      <a
        href={MAP_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block", textDecoration: "none", borderRadius: 20, overflow: "hidden", marginBottom: 32 }}
      >
        <div
          className="glass-card"
          style={{
            padding: 0, borderRadius: 20, overflow: "hidden",
            border: "2px solid var(--border-color)",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
        >
          {/* Map placeholder with farm-theme styling */}
          <div style={{
            height: 260,
            background: "linear-gradient(135deg, var(--primary-light) 0%, var(--bg-color) 100%)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16,
          }}>
            <div style={{ fontSize: 56 }}>🗺️</div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--primary-hover)" }}>
              {t.locationText}
            </div>
            <div style={{
              padding: "10px 24px", borderRadius: 12,
              background: "var(--primary)", color: "#fff",
              fontWeight: 700, fontSize: "0.9rem",
            }}>
              {t.openMap} →
            </div>
          </div>
        </div>
      </a>

      {/* Founder profile */}
      <FounderCard variant="full" />

      {/* How to reach */}
      <div className="glass-card" style={{ padding: 28, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: "var(--primary-light)", color: "var(--primary-hover)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>🌱</div>
        <div>
          <div style={{ fontWeight: 800, color: "var(--text-main)", marginBottom: 6 }}>{t.howToReach}</div>
          <div style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.95rem" }}>{t.directions}</div>
        </div>
      </div>
    </div>
  );
}
