import { Link } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";

export default function NotFound() {
  const { lang } = useSettingsStore();

  return (
    <div className="fade-in-up" style={{
      minHeight: "70vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 24px", textAlign: "center"
    }}>
      <div style={{ fontSize: "7rem", lineHeight: 1, marginBottom: 24, animation: "float 3s ease-in-out infinite" }}>
        🌿
      </div>
      <h1 style={{ fontSize: "clamp(5rem, 15vw, 9rem)", fontWeight: 900, color: "var(--primary)", margin: "0 0 8px 0", letterSpacing: "-0.04em", lineHeight: 1 }}>
        404
      </h1>
      <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 12 }}>
        {lang === "th" ? "ไม่พบหน้าที่คุณต้องการ" : "Page Not Found"}
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: 40, maxWidth: 440, lineHeight: 1.6 }}>
        {lang === "th"
          ? "ดูเหมือนหน้านี้จะหลงป่าไปแล้ว ลองกลับไปหน้าแรกหรือสำรวจสารานุกรมธรรมชาติของเรา"
          : "This page seems to have wandered off into the wilderness. Head back home or explore our nature encyclopedia."}
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/" className="btn-primary" style={{ padding: "14px 32px", borderRadius: 14 }}>
          {lang === "th" ? "🏠 กลับหน้าแรก" : "🏠 Go Home"}
        </Link>
        <Link to="/encyclopedia" className="btn-back" style={{ padding: "14px 28px" }}>
          {lang === "th" ? "📚 สารานุกรม" : "📚 Encyclopedia"}
        </Link>
      </div>
    </div>
  );
}
