import { Link } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";

import { getFounderData } from "../utils/founder";

interface FounderCardProps {
  /** "compact" = invitation strip for Home, "full" = detailed profile for Contact */
  variant?: "compact" | "full";
}

export default function FounderCard({ variant = "full" }: FounderCardProps) {
  const { lang } = useSettingsStore();
  const fd = getFounderData();

  const name    = lang === "th" ? fd.nameTh  : fd.nameEn;
  const title   = lang === "th" ? fd.titleTh : fd.titleEn;
  const org     = lang === "th" ? fd.orgTh   : fd.orgEn;
  const bio     = lang === "th" ? fd.bioTh   : fd.bioEn;
  const tags    = (lang === "th" ? fd.tagsTh : fd.tagsEn)
    .split(",").map((s) => s.trim()).filter(Boolean);

  const avatarIsImg = fd.avatar.startsWith("data:") || fd.avatar.startsWith("http");

  const renderAvatar = (size: number, radius: number | string) => (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: avatarIsImg ? "transparent" : "var(--primary)",
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 900, letterSpacing: -1,
      overflow: "hidden",
    }}>
      {avatarIsImg
        ? <img src={fd.avatar} alt="founder" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span>{fd.avatar}</span>
      }
    </div>
  );

  const t = {
    founderLabel: lang === "th" ? "เจ้าของและผู้ก่อตั้ง" : "Owner & Founder",
    inviteTitle:  lang === "th" ? "มาเยี่ยมชมฟาร์มอุดมทอง" : "Visit Udomtong Farm",
    inviteDesc:   lang === "th"
      ? "สัมผัสประสบการณ์ใกล้ชิดธรรมชาติ ชมสายพันธุ์หายากที่รวบรวมไว้อย่างพิถีพิถัน ณ ฟาร์มแห่งความรัก"
      : "Experience nature up close — explore a carefully curated collection of rare species at this passion project farm.",
    contactBtn: lang === "th" ? "นัดหมายเยี่ยมชม" : "Arrange a Visit",
  };

  /* ── COMPACT variant (Home page invitation strip) ── */
  if (variant === "compact") {
    return (
      <div className="glass-card fade-in-up" style={{
        padding: "40px 40px",
        background: "linear-gradient(135deg, var(--primary-light) 0%, var(--bg-color) 100%)",
        border: "1.5px solid var(--border-color)",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 32,
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        {renderAvatar(80, "50%")}
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary-hover)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            {t.inviteTitle}
          </div>
          <div style={{ fontWeight: 900, fontSize: "1.25rem", color: "var(--text-main)", marginBottom: 6 }}>
            {name}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: 520 }}>
            {t.inviteDesc}
          </div>
        </div>
        <Link to="/contact" className="btn-primary"
          style={{ padding: "14px 28px", borderRadius: 14, textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
          {t.contactBtn} →
        </Link>
      </div>
    );
  }

  /* ── FULL variant (Contact page) ── */
  return (
    <div className="glass-card" style={{ padding: 36, marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap" }}>
        {renderAvatar(88, 20)}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary-hover)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
            {t.founderLabel}
          </div>
          <div style={{ fontWeight: 900, fontSize: "1.5rem", color: "var(--text-main)", marginBottom: 4 }}>
            {name}
          </div>
          <div style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
            {title}
          </div>
          <div style={{ color: "var(--primary-hover)", fontSize: "0.85rem", fontWeight: 700, marginTop: 4 }}>
            {org}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "var(--border-color)", marginBottom: 20 }} />

      <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "0.95rem", margin: "0 0 20px" }}>
        {bio}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map((tag) => (
          <span key={tag} style={{
            padding: "5px 14px", borderRadius: 20,
            background: "var(--primary-light)", color: "var(--primary-hover)",
            fontSize: "0.82rem", fontWeight: 700,
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
