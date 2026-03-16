import { Link } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";

export default function About() {
  const { lang } = useSettingsStore();

  const t = {
    tag:        lang === "th" ? "เกี่ยวกับเรา" : "About Us",
    title:      lang === "th" ? "ฟาร์มอุดมทอง" : "Udomtong Farm",
    subtitle:   lang === "th"
      ? "แหล่งอนุรักษ์และเพาะพันธุ์สิ่งมีชีวิตหายากแห่งจังหวัดชัยภูมิ"
      : "Conservation & breeding sanctuary for rare species in Chaiyaphum",
    historyTag: lang === "th" ? "ประวัติความเป็นมา" : "Our Story",
    historyTitle: lang === "th" ? "จุดเริ่มต้นของฟาร์มอุดมทอง" : "How Udomtong Farm Began",
    historyDesc: lang === "th"
      ? "ฟาร์มอุดมทองก่อตั้งขึ้นด้วยความรักและความหลงใหลในธรรมชาติ เริ่มต้นจากการเลี้ยงสัตว์เพื่อเพาะพันธุ์สายพันธุ์ที่หายากและใกล้สูญพันธุ์ ด้วยแนวคิดการอนุรักษ์ทรัพยากรธรรมชาติในพื้นที่จังหวัดชัยภูมิ ปัจจุบันฟาร์มได้ขยายขอบเขตการดูแลทั้งสัตว์และพืชหายากกว่า 100 สายพันธุ์ พร้อมเปิดให้ผู้สนใจเข้าเยี่ยมชมและเรียนรู้"
      : "Udomtong Farm was founded out of a deep love and passion for nature. Starting from breeding rare and endangered species, guided by the philosophy of conserving natural resources in Chaiyaphum. Today, the farm covers over 100 rare animal and plant species and welcomes visitors to learn and explore.",
    visionTag:  lang === "th" ? "วิสัยทัศน์" : "Vision",
    visionTitle: lang === "th" ? "สิ่งที่เรามุ่งมั่น" : "What We Stand For",
    values: [
      {
        emoji: "🌿",
        title: lang === "th" ? "อนุรักษ์ธรรมชาติ" : "Conservation",
        desc: lang === "th"
          ? "รักษาและขยายพันธุ์สิ่งมีชีวิตหายากเพื่อให้คงอยู่สำหรับคนรุ่นหลัง"
          : "Preserve and breed rare species so they survive for future generations.",
      },
      {
        emoji: "📚",
        title: lang === "th" ? "ให้ความรู้" : "Education",
        desc: lang === "th"
          ? "สร้างแหล่งเรียนรู้ให้ประชาชน เยาวชน และผู้สนใจในทุกระดับ"
          : "Create a learning hub for the public, youth, and interested individuals of all levels.",
      },
      {
        emoji: "🤝",
        title: lang === "th" ? "ชุมชนและความยั่งยืน" : "Community & Sustainability",
        desc: lang === "th"
          ? "ดำเนินงานด้วยแนวคิดเกษตรธรรมชาติที่เคารพระบบนิเวศและชุมชนท้องถิ่น"
          : "Operate with natural farming principles that respect the ecosystem and local community.",
      },
    ],
    statsTitle: lang === "th" ? "ตัวเลขที่ภาคภูมิใจ" : "Numbers We're Proud Of",
    stats: [
      { value: "100+", label: lang === "th" ? "สายพันธุ์ในการดูแล" : "Species in Care" },
      { value: "10+",  label: lang === "th" ? "ปีแห่งประสบการณ์" : "Years of Experience" },
      { value: "500+", label: lang === "th" ? "ผู้เยี่ยมชมต่อปี" : "Visitors per Year" },
      { value: "2",    label: lang === "th" ? "หมวดหมู่ (สัตว์/พืช)" : "Categories (Animal/Plant)" },
    ],
    teamTag:    lang === "th" ? "ทีมงาน" : "Our Team",
    teamTitle:  lang === "th" ? "ผู้อยู่เบื้องหลังฟาร์ม" : "People Behind the Farm",
    team: [
      { name: lang === "th" ? "ทีมดูแลสัตว์" : "Animal Care Team", role: lang === "th" ? "ผู้เชี่ยวชาญด้านสัตว์หายาก" : "Rare Animal Specialists", emoji: "🦢" },
      { name: lang === "th" ? "ทีมพืชพันธุ์" : "Plant Specialists", role: lang === "th" ? "นักพฤกษศาสตร์ประจำฟาร์ม" : "Farm Botanists", emoji: "🌿" },
      { name: lang === "th" ? "ทีมต้อนรับ" : "Visitor Team",      role: lang === "th" ? "ไกด์นำชมฟาร์ม" : "Farm Tour Guides", emoji: "🚶" },
    ],
    ctaTitle:   lang === "th" ? "มาเยี่ยมชมเราได้เลย" : "Come Visit Us",
    ctaDesc:    lang === "th" ? "นัดหมายล่วงหน้าผ่านช่องทางติดต่อของเรา" : "Book an appointment through our contact channels.",
    ctaBtn:     lang === "th" ? "ติดต่อเรา" : "Contact Us",
    ctaBtn2:    lang === "th" ? "ดูสารานุกรม" : "Browse Encyclopedia",
    breadHome:  lang === "th" ? "หน้าแรก" : "Home",
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* ── Hero ── */}
      <section style={{
        padding: "100px 24px 80px",
        textAlign: "center",
        background: "linear-gradient(180deg, var(--primary-light) 0%, var(--bg-color) 100%)",
        borderRadius: "0 0 60px 60px",
        marginBottom: 80,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, fontSize: 200, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>🌿</div>
        <nav className="breadcrumb" style={{ justifyContent: "center", marginBottom: 28 }}>
          <Link to="/">{t.breadHome}</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{t.tag}</span>
        </nav>
        <div className="fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 40, padding: "8px 20px", marginBottom: 24 }}>
          <span style={{ fontSize: 14 }}>🌾</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-hover)", letterSpacing: 0.5 }}>{t.tag}</span>
        </div>
        <h1 className="fade-in-up" style={{ fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 900, color: "var(--text-main)", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
          {t.title}
        </h1>
        <p className="fade-in-up" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "var(--text-muted)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6, animationDelay: "0.15s" }}>
          {t.subtitle}
        </p>
      </section>

      {/* ── History ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}>
        <div className="glass-card" style={{ padding: "56px 56px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary-light)", color: "var(--primary-hover)", borderRadius: 40, padding: "6px 16px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 20 }}>
              📖 {t.historyTag}
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "var(--text-main)", lineHeight: 1.2, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
              {t.historyTitle}
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "1.05rem", margin: 0 }}>
              {t.historyDesc}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {["🦢", "🦜", "🌳", "🐢"].map((e, i) => (
              <div key={i} style={{
                aspectRatio: "1", borderRadius: 20, background: "var(--primary-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "3.5rem", border: "1px solid var(--border-color)",
                transition: "transform 0.3s",
              }}
                onMouseEnter={el => (el.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={el => (el.currentTarget.style.transform = "scale(1)")}
              >{e}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "var(--text-main)", margin: "0 0 40px", letterSpacing: "-0.02em" }}>
          {t.statsTitle}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {t.stats.map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: "36px 24px", textAlign: "center", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "clamp(2.4rem, 5vw, 3.5rem)", fontWeight: 900, color: "var(--primary-hover)", marginBottom: 8, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.95rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Vision / Values ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary-light)", color: "var(--primary-hover)", borderRadius: 40, padding: "6px 16px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 16 }}>
            🌟 {t.visionTag}
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "var(--text-main)", margin: 0, letterSpacing: "-0.02em" }}>
            {t.visionTitle}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {t.values.map((v, i) => (
            <div key={i} className="glass-card" style={{ padding: "40px 32px", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: 28 }}>
              <div style={{ fontSize: "3rem", marginBottom: 20 }}>{v.emoji}</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", margin: "0 0 12px" }}>{v.title}</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: 0, fontSize: "0.95rem" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary-light)", color: "var(--primary-hover)", borderRadius: 40, padding: "6px 16px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 16 }}>
            👥 {t.teamTag}
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "var(--text-main)", margin: 0, letterSpacing: "-0.02em" }}>
            {t.teamTitle}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {t.team.map((m, i) => (
            <div key={i} className="glass-card" style={{ padding: "32px 24px", textAlign: "center", border: "1px solid var(--border-color)" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 16px", border: "2px solid var(--border-color)" }}>
                {m.emoji}
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 6 }}>{m.name}</div>
              <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", fontWeight: 500 }}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          background: "var(--gradient-primary)", borderRadius: 32, padding: "60px 48px",
          textAlign: "center", color: "#fff", boxShadow: "var(--shadow-primary)",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌱</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, margin: "0 0 12px" }}>{t.ctaTitle}</h2>
          <p style={{ opacity: 0.85, margin: "0 0 32px", fontSize: "1.05rem", lineHeight: 1.6 }}>{t.ctaDesc}</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/contact" style={{ padding: "14px 32px", borderRadius: 40, background: "#fff", color: "var(--primary-hover)", fontWeight: 800, textDecoration: "none", fontSize: "1rem" }}>
              {t.ctaBtn}
            </Link>
            <Link to="/encyclopedia" style={{ padding: "14px 32px", borderRadius: 40, background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: "1rem", border: "2px solid rgba(255,255,255,0.4)" }}>
              {t.ctaBtn2}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
