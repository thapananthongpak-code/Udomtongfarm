import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useAppSettingsStore } from "../../store/appSettingsStore";
import type { Species } from "../../types/species";

export default function Home() {
  const { items, fetchAll } = useSpeciesStore();
  const { lang } = useSettingsStore();
  const appSettings = useAppSettingsStore();
  
  useEffect(() => { 
    fetchAll(); 
    appSettings.fetchSettings();
  }, [fetchAll, appSettings]);

  const [spotlight, setSpotlight] = useState<Species[]>([]);
  useEffect(() => {
    if (items.length === 0) {
      if (spotlight.length !== 0) {
         const t = setTimeout(() => setSpotlight([]), 0);
         return () => clearTimeout(t);
      }
      return;
    }
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpotlight(shuffled.slice(0, 3));
  }, [items, spotlight.length]);

  const t = {
    title:          lang === "th" ? "ฟาร์มอุดมทอง" : "Udomtong Farm",
    welcome:        lang === "th" ? "ยินดีต้อนรับสู่สารานุกรมธรรมชาติของเรา" : "Welcome to Our Nature Encyclopedia",
    subtitle:       lang === "th"
      ? "แหล่งรวบรวมและอนุรักษ์สัตว์และพืชหายากแห่งจังหวัดนครราชสีมา สัมผัสความหลากหลายทางชีวภาพใกล้ชิดธรรมชาติ"
      : "A dedicated space for collecting and conserving rare animals and plants in Nakhon Ratchasima — explore biodiversity up close.",
    btnExplore:     lang === "th" ? "เปิดดูสารานุกรม" : "Browse Encyclopedia",
    btnContact:     lang === "th" ? "ติดต่อเรา" : "Contact Us",
    statAnimal:     lang === "th" ? "สัตว์ทั้งหมด" : "Total Animals",
    statPlant:      lang === "th" ? "พืชทั้งหมด" : "Total Plants",
    statTotal:      lang === "th" ? "ข้อมูลรวม" : "Total Species",
    unitSpecies:    lang === "th" ? "ชนิด" : "species",
    unitItems:      lang === "th" ? "รายการ" : "items",
    suggested:      lang === "th" ? "สายพันธุ์แนะนำวันนี้" : "Today's Highlights",
    announceTitle:  lang === "th" ? "ข่าวสารและประชาสัมพันธ์" : "News & Announcements",
    announceNew:    lang === "th" ? "ใหม่" : "NEW",
    announceLabel:  lang === "th" ? "พร้อมจำหน่าย" : "Available Now",
    announceDesc:   lang === "th" ? "สนใจสอบถามราคาหรือนัดชมฟาร์ม กรุณาติดต่อเรา" : "Interested in pricing or a farm visit? Contact us.",
    announceContact:lang === "th" ? "ติดต่อสอบถาม" : "Contact Us",
    announceMore:   lang === "th" ? "ดูทั้งหมดในสารานุกรม" : "View All in Encyclopedia",
    farmInfo1:      lang === "th" ? "อนุรักษ์พันธุ์หายาก" : "Rare Species Conservation",
    farmInfo1Desc:  lang === "th" ? "รวบรวมและดูแลสายพันธุ์สัตว์และพืชที่หายากและใกล้สูญพันธุ์" : "Collecting and caring for rare and endangered animal and plant species.",
    farmInfo2:      lang === "th" ? "ฟาร์มเกษตรธรรมชาติ" : "Natural Farm",
    farmInfo2Desc:  lang === "th" ? "ดำเนินงานด้วยแนวคิดเกษตรธรรมชาติ เคารพระบบนิเวศ" : "Operating with a natural farming philosophy that respects the ecosystem.",
    farmInfo3:      lang === "th" ? "เปิดต้อนรับผู้เยี่ยมชม" : "Open for Visits",
    farmInfo3Desc:  lang === "th" ? "ยินดีต้อนรับผู้สนใจเข้าชมและเรียนรู้ นัดหมายล่วงหน้า" : "Welcome visitors by appointment — come learn and explore nature.",
    animalLabel:    lang === "th" ? "สัตว์" : "Animal",
    plantLabel:     lang === "th" ? "พืช" : "Plant",
    badgeLoc:       lang === "th" ? "จ.นครราชสีมา ประเทศไทย" : "Nakhon Ratchasima, Thailand"
  };

  return (
    <div style={{ paddingBottom: "100px", overflowX: "hidden" }}>

      {/* ─── Hero ─── */}
      <section style={{
        padding: "120px 24px 100px 24px",
        textAlign: "center",
        background: "var(--gradient-hero)",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid var(--border-color)",
        marginBottom: "80px"
      }}>
        {/* Soft glowing ambient orbs */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translate(-50%, -50%)", width: "90vw", maxWidth: 800, height: 400, background: "var(--primary)", opacity: 0.03, filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none" }} />

        {/* Farm badge */}
        <div className="fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 40, padding: "8px 20px", marginBottom: 32, boxShadow: "var(--shadow-sm)" }}>
          <IconLeaf size={14} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)", letterSpacing: 0.5 }}>
            {t.badgeLoc}
          </span>
        </div>

        <h1 className="fade-in-up" style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", fontWeight: 900, marginBottom: 24, color: "var(--text-main)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          {t.title}
        </h1>
        <div className="fade-in-up" style={{ animationDelay: "0.15s" }}>
          <p style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", color: "var(--text-muted)", maxWidth: 700, margin: "0 auto 48px auto", lineHeight: 1.6, fontWeight: 400 }}>
            <span style={{ display: "block", color: "var(--text-main)", fontWeight: 600, marginBottom: 8 }}>{t.welcome}</span>
            {t.subtitle}
          </p>
        </div>
        <div className="fade-in-up hero-buttons" style={{ animationDelay: "0.3s", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/encyclopedia" className="btn-primary" style={{ padding: "18px 40px", fontSize: "1.05rem", borderRadius: 40, display: "inline-flex", alignItems: "center", gap: 10 }}>
            <IconSearch size={20} /> {t.btnExplore}
          </Link>
          <Link to="/contact" style={{ padding: "18px 40px", fontSize: "1.05rem", borderRadius: 40, border: "2px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-main)", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.3s ease", boxShadow: "var(--shadow-sm)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.color = "var(--text-main)"; }}
          >
            <IconPhone size={18} /> {t.btnContact}
          </Link>
        </div>
      </section>

      {/* ─── Promotional Banner (Clean Redesign) ─── */}
      {appSettings.bannerItems.length > 0 && (
        <div style={{ position: "relative", marginBottom: "100px", paddingBottom: "20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
            
            {/* Header Area */}
            {((lang === "th" && (appSettings.bannerTitleTh || appSettings.bannerSubtitleTh)) || 
              (lang === "en" && (appSettings.bannerTitleEn || appSettings.bannerSubtitleEn))) && (
              <div className="fade-in-up" style={{ textAlign: "center", marginBottom: 48, maxWidth: 800, margin: "0 auto 48px auto" }}>
                <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 900, marginBottom: 16, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                  {lang === "th" ? (appSettings.bannerTitleTh || "เกี่ยวกับเรา") : (appSettings.bannerTitleEn || "About Us")}
                </h2>
                {((lang === "th" && appSettings.bannerSubtitleTh) || (lang === "en" && appSettings.bannerSubtitleEn)) && (
                  <p style={{ fontSize: "clamp(1.05rem, 2vw, 1.15rem)", color: "var(--text-muted)", lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                    {lang === "th" ? appSettings.bannerSubtitleTh : appSettings.bannerSubtitleEn}
                  </p>
                )}
              </div>
            )}

            {/* Cards Area */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
              {appSettings.bannerItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="glass-card fade-in-up hover-zoom"
                  style={{ 
                    padding: "40px 32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "20px",
                    animationDelay: `${idx * 0.15}s`,
                    border: "1px solid var(--border-color)",
                    borderRadius: "28px",
                    background: "var(--card-bg)"
                  }}
                >
                  <div style={{ 
                    width: 72, height: 72, 
                    borderRadius: "24px", 
                    background: "var(--primary-light)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: "2rem",
                    color: "var(--primary)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                    marginBottom: "8px"
                  }}>
                    {item.icon || "✨"}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: 12, color: "var(--text-main)", lineHeight: 1.3 }}>
                      {lang === "th" ? item.titleTh : item.titleEn}
                    </h3>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                      {lang === "th" ? item.descTh : item.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── ข่าวสารและประชาสัมพันธ์ ─── */}
      <div style={{ maxWidth: 1100, margin: "0 auto 80px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <h2 className="scroll-reveal" style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text-main)", margin: 0 }}>
            {t.announceTitle}
          </h2>
          <Link to="/encyclopedia" style={{ color: "var(--primary-hover)", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}>
            {t.announceMore} →
          </Link>
        </div>

        {spotlight.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {spotlight.map((item, i) => (
              <AnnouncementBanner key={item.id} item={item} lang={lang} t={t} delay={i * 0.15} />
            ))}
          </div>
        )}

        {/* CTA strip */}
        <div className="scroll-reveal" style={{ marginTop: 24, padding: "20px 28px", borderRadius: 16, background: "var(--primary-light)", border: "1.5px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 8 }}>
            <IconPhone size={16} /> {t.announceDesc}
          </div>
          <Link to="/contact" className="btn-primary" style={{ padding: "10px 24px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
            {t.announceContact} →
          </Link>
        </div>
      </div>


    </div>
  );
}



// ─── Announcement Banner ───
function AnnouncementBanner({ item, lang, t, delay }: { item: Species; lang: string; t: Record<string, string>; delay: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const title = lang === "th" ? item.name_th : item.name_en;
  const desc = lang === "th" ? item.short_description || item.description : item.short_description_en || item.description_en;

  return (
    <Link ref={ref} to={`/species/${item.type}/${item.id}`} className="announce-card" style={{ textDecoration: "none", animationDelay: `${delay}s`, display: "block" }}>
      <div className="glass-card hover-zoom" style={{ overflow: "hidden", padding: 0, display: "flex", flexDirection: "row", flexWrap: "wrap", minHeight: 320, alignItems: "stretch", boxShadow: "var(--shadow-md)" }}>
        {/* Left: Image */}
        <div className="img-wrap" style={{ flex: "1 1 300px", minWidth: 280, position: "relative", minHeight: 280 }}>
          <img src={item.image} alt={title} className="hover-zoom-img" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          <div className="badge-new" style={{ position: "absolute", top: 20, left: 20, background: "var(--primary)", color: "#fff", padding: "6px 16px", borderRadius: 24, fontSize: "0.85rem", fontWeight: 800, letterSpacing: 1, boxShadow: "var(--shadow-sm)" }}>
            {t.announceNew}
          </div>
          <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: "#fff", padding: "6px 14px", borderRadius: 24, fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            {item.type === "animal" ? <><IconPaw size={14} color="#fff" />{t.animalLabel}</> : <><IconLeaf size={14} color="#fff" />{t.plantLabel}</>}
          </div>
        </div>
        {/* Right: Content */}
        <div style={{ flex: "2 1 400px", padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1, background: "var(--card-bg)" }}>
          <div style={{ fontWeight: 900, fontSize: "clamp(1.5rem, 4vw, 2.2rem)", color: "var(--text-main)", marginBottom: 8, lineHeight: 1.2 }}>
            {title}
          </div>
          {item.scientific_name && (
            <div style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: 16 }}>
              {item.scientific_name}
            </div>
          )}
          {desc && (
            <div style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 32 }}>
              {desc}
            </div>
          )}
          <div style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 30, background: "var(--primary-light)", border: "1px solid var(--border-color)", color: "var(--primary-hover)", fontSize: "0.95rem", fontWeight: 800, width: "fit-content", transition: "all 0.3s" }} className="banner-btn">
            {t.announceLabel} <span style={{ fontSize: "1.2em", marginLeft: 4 }}>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}



// ─── SVG Icons ───
function IconSearch({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function IconPhone({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function IconPaw({ size = 20, color }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "var(--primary-hover)"} stroke="none"><circle cx="4.5" cy="9.5" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19.5" cy="9.5" r="2"/><path d="M12 12.5c-2.5 0-6 2.5-6 5.5a2.5 2.5 0 0 0 2.5 2.5c1 0 2-.5 3.5-.5s2.5.5 3.5.5A2.5 2.5 0 0 0 18 18c0-3-3.5-5.5-6-5.5z"/></svg>;
}
function IconLeaf({ size = 20, color }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "var(--primary-hover)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
}
