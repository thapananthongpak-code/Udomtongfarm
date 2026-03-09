import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";

export default function Home() {
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore();
  useEffect(() => { fetchAll(); }, [fetchAll]);

  const stats = useMemo(() => {
    const animals = items.filter((x) => x.type === "animal").length;
    const plants = items.filter((x) => x.type === "plant").length;
    return { total: items.length, animals, plants };
  }, [items]);

  const spotlight = useMemo(() => {
    if (items.length === 0) return [];
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [items]);

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
  };

  return (
    <div style={{ paddingBottom: "100px", overflowX: "hidden" }}>

      {/* ─── Hero ─── */}
      <section style={{
        padding: "100px 24px 80px 24px",
        textAlign: "center",
        background: "var(--gradient-hero)",
        borderRadius: "0 0 60px 60px",
        marginBottom: "60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "var(--primary)", opacity: 0.06, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "var(--accent)", opacity: 0.08, pointerEvents: "none" }} />

        {/* Farm badge */}
        <div className="fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary-light)", border: "1.5px solid var(--border-color)", borderRadius: 30, padding: "6px 18px", marginBottom: 24 }}>
          <IconLeaf size={14} />
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--primary-hover)", letterSpacing: 0.5 }}>
            {lang === "th" ? "จ.นครราชสีมา ประเทศไทย" : "Nakhon Ratchasima, Thailand"}
          </span>
        </div>

        <h1 className="fade-in-up" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 900, marginBottom: 16, color: "var(--primary-hover)", letterSpacing: "-1px" }}>
          {t.title}
        </h1>
        <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 style={{ fontSize: "1.4rem", color: "var(--text-main)", fontWeight: 600, marginBottom: 16 }}>{t.welcome}</h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", maxWidth: 680, margin: "0 auto 40px auto", lineHeight: 1.85 }}>
            {t.subtitle}
          </p>
        </div>
        <div className="fade-in-up" style={{ animationDelay: "0.4s", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/encyclopedia" className="btn-primary" style={{ padding: "16px 36px", fontSize: "1rem", borderRadius: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <IconSearch size={18} /> {t.btnExplore}
          </Link>
          <Link to="/contact" style={{ padding: "16px 32px", fontSize: "1rem", borderRadius: 16, border: "2px solid var(--primary)", color: "var(--primary-hover)", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.3s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--primary-light)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <IconPhone size={16} /> {t.btnContact}
          </Link>
        </div>
      </section>

      {/* ─── Farm Info Cards ─── */}
      <div style={{ maxWidth: 1100, margin: "0 auto 64px auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          <FarmInfoCard icon={<IconStar />} title={t.farmInfo1} desc={t.farmInfo1Desc} delay="0.1s" />
          <FarmInfoCard icon={<IconTree />} title={t.farmInfo2} desc={t.farmInfo2Desc} delay="0.2s" />
          <FarmInfoCard icon={<IconUsers />} title={t.farmInfo3} desc={t.farmInfo3Desc} delay="0.3s" />
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto 80px auto", padding: "0 20px" }}>
        <StatCard title={t.statAnimal} value={loading ? "..." : stats.animals} unit={t.unitSpecies} icon={<IconPaw />} delay="0.5s" />
        <StatCard title={t.statPlant}  value={loading ? "..." : stats.plants}  unit={t.unitSpecies} icon={<IconLeaf />} delay="0.6s" />
        <StatCard title={t.statTotal}  value={loading ? "..." : stats.total}   unit={t.unitItems}   icon={<IconChart />} delay="0.7s" />
      </div>

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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {spotlight.map((item, i) => (
              <AnnouncementCard key={item.id} item={item} lang={lang} t={t} delay={i * 0.12} />
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

// ─── Farm Info Card ───
function FarmInfoCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: string }) {
  return (
    <div className="glass-card fade-in-up" style={{ padding: "28px 24px", animationDelay: delay, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)" }}>{title}</div>
      <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

// ─── Announcement Card ───
function AnnouncementCard({ item, lang, t, delay }: { item: any; lang: string; t: any; delay: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Link ref={ref} to={`/species/${item.type}/${item.id}`} className="announce-card" style={{ textDecoration: "none", animationDelay: `${delay}s` } as any}>
      <div className="glass-card" style={{ overflow: "hidden", padding: 0 }}>
        <div className="img-wrap" style={{ height: 180, position: "relative" }}>
          <img src={item.image} alt={item.name_th} className="hover-zoom-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div className="badge-new" style={{ position: "absolute", top: 12, left: 12, background: "var(--primary)", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 800, letterSpacing: 1 }}>
            {t.announceNew}
          </div>
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.45)", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            {item.type === "animal" ? <><IconPaw size={11} color="#fff" />{t.animalLabel}</> : <><IconLeaf size={11} color="#fff" />{t.plantLabel}</>}
          </div>
        </div>
        <div style={{ padding: "18px 20px" }}>
          <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--text-main)", marginBottom: 4 }}>
            {lang === "th" ? item.name_th : item.name_en}
          </div>
          {item.scientific_name && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: 10 }}>
              {item.scientific_name}
            </div>
          )}
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "var(--primary-light)", color: "var(--primary-hover)", fontSize: "0.78rem", fontWeight: 700 }}>
            {t.announceLabel}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Stat Card ───
function StatCard({ title, value, unit, icon, delay }: { title: string; value: any; unit: string; icon: React.ReactNode; delay: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = typeof value === "number" ? value : 0;
    if (target === 0) { setDisplay(0); return; }
    let start = 0;
    const duration = 1200, step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else { setDisplay(Math.floor(start)); }
    }, step);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="glass-card fade-in-up" style={{ padding: 30, textAlign: "center", animationDelay: delay, position: "relative", overflow: "hidden" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
        {title}
      </div>
      <div className="stat-number" style={{ fontSize: 46, fontWeight: 900, color: "var(--text-main)" }}>
        {typeof value === "number" ? display : value}{" "}
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>{unit}</span>
      </div>
    </div>
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
function IconChart({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
}
function IconStar({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function IconTree({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 22V4l-5-2-5 2v18"/><path d="M7 14H3l7-7 7 7h-4"/><path d="M7 22h10"/></svg>;
}
function IconUsers({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
