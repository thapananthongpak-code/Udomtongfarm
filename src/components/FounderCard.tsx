import { Link } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";

interface FounderCardProps {
  /** "compact" = invitation strip for Home, "full" = detailed profile for Contact */
  variant?: "compact" | "full";
}

export default function FounderCard({ variant = "full" }: FounderCardProps) {
  const { lang } = useSettingsStore();

  const t = {
    founderLabel: lang === "th" ? "เจ้าของและผู้ก่อตั้ง" : "Owner & Founder",
    name: lang === "th" ? "นายธีรวุฒิ ธงภักดิ์" : "Mr. Terawut Thongpak",
    title:
      lang === "th"
        ? "รองเลขาธิการคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ"
        : "Deputy Secretary-General, National Digital Economy and Society Commission",
    org: lang === "th" ? "สำนักงาน สดช. (BDE)" : "Office of the NDES Commission (BDE)",
    bioBrief:
      lang === "th"
        ? "ผู้บริหารภาครัฐด้านดิจิทัลของประเทศไทย ผู้ขับเคลื่อนนโยบาย AI รัฐบาลดิจิทัล และโครงสร้างพื้นฐานดิจิทัลแห่งชาติ และยังเป็นผู้ที่มีความรักในธรรมชาติ จึงก่อตั้งฟาร์มอุดมทองเป็นแหล่งรวบรวมและอนุรักษ์สิ่งมีชีวิตหายาก"
        : "A senior Thai government official driving national AI policy, digital government, and digital infrastructure — and a nature enthusiast who founded Udomtong Farm to preserve and document rare species.",
    bioFull:
      lang === "th"
        ? "นายธีรวุฒิ ธงภักดิ์ มีประสบการณ์ยาวนานในสายงานเทคโนโลยีสารสนเทศและระบบเครือข่ายภาครัฐ ก่อนพัฒนาบทบาทสู่การเป็นผู้บริหารระดับสูงที่วางนโยบายด้านดิจิทัล ครอบคลุมประเด็น AI ข้อมูลขนาดใหญ่ (Big Data) และการผลักดันสังคมดิจิทัลในระดับประเทศ นอกจากบทบาทด้านราชการแล้ว ท่านยังมีความหลงใหลในธรรมชาติและสิ่งมีชีวิตหายาก จึงก่อตั้งฟาร์มอุดมทองขึ้นเพื่อเป็นแหล่งรวบรวม ศึกษา และอนุรักษ์พันธุ์สัตว์และพืชหายาก ณ จังหวัดนครราชสีมา"
        : "Mr. Terawut Thongpak brings extensive experience in government IT and network systems, rising to senior leadership roles in national digital policy encompassing AI, Big Data, and digital infrastructure. Beyond his public service, his passion for nature and rare species led to the founding of Udomtong Farm — a dedicated space for collecting, studying, and conserving rare animals and plants in Nakhon Ratchasima.",
    tags:
      lang === "th"
        ? ["นโยบาย AI", "รัฐบาลดิจิทัล", "Big Data", "อนุรักษ์ธรรมชาติ"]
        : ["AI Policy", "Digital Government", "Big Data", "Nature Conservation"],
    inviteTitle: lang === "th" ? "มาเยี่ยมชมฟาร์มอุดมทอง" : "Visit Udomtong Farm",
    inviteDesc:
      lang === "th"
        ? "สัมผัสประสบการณ์ใกล้ชิดธรรมชาติ ชมสายพันธุ์หายากที่รวบรวมไว้อย่างพิถีพิถัน ณ ฟาร์มแห่งความรัก"
        : "Experience nature up close — explore a carefully curated collection of rare species at this passion project farm.",
    contactBtn: lang === "th" ? "นัดหมายเยี่ยมชม" : "Arrange a Visit",
  };

  /* ── COMPACT variant (Home page invitation strip) ── */
  if (variant === "compact") {
    return (
      <div
        className="glass-card fade-in-up"
        style={{
          padding: "40px 40px",
          background: "linear-gradient(135deg, var(--primary-light) 0%, var(--bg-color) 100%)",
          border: "1.5px solid var(--border-color)",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 32,
          alignItems: "center",
          flexWrap: "wrap" as any,
        }}
      >
        {/* Avatar placeholder */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "var(--primary)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 900, flexShrink: 0, letterSpacing: -1,
        }}>
          ธ
        </div>

        {/* Text */}
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary-hover)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            {t.inviteTitle}
          </div>
          <div style={{ fontWeight: 900, fontSize: "1.25rem", color: "var(--text-main)", marginBottom: 6 }}>
            {t.name}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: 520 }}>
            {t.inviteDesc}
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/contact"
          className="btn-primary"
          style={{ padding: "14px 28px", borderRadius: 14, textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}
        >
          {t.contactBtn} →
        </Link>
      </div>
    );
  }

  /* ── FULL variant (Contact page) ── */
  return (
    <div className="glass-card" style={{ padding: 36, marginBottom: 24 }}>
      {/* Header row */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap" as any }}>
        {/* Avatar */}
        <div style={{
          width: 88, height: 88, borderRadius: 20, flexShrink: 0,
          background: "var(--primary)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, fontWeight: 900, letterSpacing: -1,
        }}>
          ธ
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary-hover)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
            {t.founderLabel}
          </div>
          <div style={{ fontWeight: 900, fontSize: "1.5rem", color: "var(--text-main)", marginBottom: 4 }}>
            {t.name}
          </div>
          <div style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
            {t.title}
          </div>
          <div style={{ color: "var(--primary-hover)", fontSize: "0.85rem", fontWeight: 700, marginTop: 4 }}>
            {t.org}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border-color)", marginBottom: 20 }} />

      {/* Full bio */}
      <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "0.95rem", margin: "0 0 20px" }}>
        {t.bioFull}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 8 }}>
        {t.tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "5px 14px", borderRadius: 20,
              background: "var(--primary-light)", color: "var(--primary-hover)",
              fontSize: "0.82rem", fontWeight: 700,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
