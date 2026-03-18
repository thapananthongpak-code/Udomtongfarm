import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useAppSettingsStore } from "../../store/appSettingsStore";
import type { Species } from "../../types/species";
import { RECENTLY_VIEWED_KEY } from "./SpeciesPage";

// ─── Typewriter ─────────────────────────────────────────────
function Typewriter({ text, delay = 800, speed = 22 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  useEffect(() => {
    if (!started || displayed.length >= text.length) return;
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed]);
  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="typewriter-cursor">|</span>}
    </span>
  );
}

// ─── Particle positions ──────────────────────────────────────
const PARTICLES = [
  { left: "8%",  top: "22%", w: 3, dur: "8s",  del: "0s"   },
  { left: "18%", top: "65%", w: 2, dur: "11s", del: "1.2s" },
  { left: "30%", top: "38%", w: 4, dur: "9s",  del: "2.5s" },
  { left: "55%", top: "15%", w: 3, dur: "10s", del: "3s"   },
  { left: "74%", top: "82%", w: 3, dur: "12s", del: "4s"   },
  { left: "83%", top: "28%", w: 4, dur: "9s",  del: "2s"   },
  { left: "91%", top: "62%", w: 2, dur: "8s",  del: "0.5s" },
  { left: "62%", top: "90%", w: 2, dur: "10s", del: "1s"   },
];

// ────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore();
  const appSettings = useAppSettingsStore();
  const fetchAppSettings = useAppSettingsStore((s) => s.fetchSettings);

  useEffect(() => { fetchAll(); fetchAppSettings(); }, [fetchAll, fetchAppSettings]);

  const [isDark, setIsDark] = useState(() => document.documentElement.dataset.theme === "dark");
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.dataset.theme === "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
      setShowTop(scrolled > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [orbPos, setOrbPos] = useState({ x: 60, y: 50 });
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setOrbPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const spotlight = useMemo(() => {
    if (items.length === 0) return [];
    return [...items].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [items]);

  const todaySpecies = useMemo(() => {
    if (items.length === 0) return null;
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return items[seed % items.length];
  }, [items]);

  const [quickSearch, setQuickSearch] = useState("");

  function handleQuickSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = quickSearch.trim();
    navigate("/encyclopedia", q ? { state: { q } } : undefined);
    setQuickSearch("");
  }

  const animalCount = items.filter(x => x.type === "animal").length;
  const plantCount  = items.filter(x => x.type === "plant").length;
  const availCount  = items.filter(x => (x as any).for_sale === 1 || (x as any).stock > 0).length;

  const t = {
    badgeLoc:      lang === "th" ? "จ.ชัยภูมิ ประเทศไทย" : "Chaiyaphum, Thailand",
    title:         lang === "th" ? "ฟาร์มอุดมทอง" : "Udomtong Farm",
    welcome:       lang === "th" ? "สารานุกรมธรรมชาติ" : "Nature Encyclopedia",
    subtitle:      lang === "th"
      ? "แหล่งรวบรวมและอนุรักษ์สัตว์และพืชหายากแห่งจังหวัดชัยภูมิ สัมผัสความหลากหลายทางชีวภาพใกล้ชิดธรรมชาติ"
      : "A dedicated space for collecting and conserving rare animals and plants in Chaiyaphum — explore biodiversity up close.",
    searchPlaceholder: lang === "th" ? "ค้นหาสายพันธุ์ เช่น หงส์, สักทอง..." : "Search species, e.g. Swan, Teak...",
    btnExplore:    lang === "th" ? "เปิดดูสารานุกรม" : "Browse Encyclopedia",
    btnShop:       lang === "th" ? "สั่งซื้อสินค้า" : "Shop Now",
    btnContact:    lang === "th" ? "ติดต่อเรา" : "Contact Us",
    statTotal:     lang === "th" ? "สายพันธุ์ทั้งหมด" : "Total Species",
    statAnimal:    lang === "th" ? "สัตว์" : "Animals",
    statPlant:     lang === "th" ? "พืช" : "Plants",
    statAvail:     lang === "th" ? "พร้อมจำหน่าย" : "Available",
    quickNavTitle: lang === "th" ? "เมนูด่วน" : "Quick Access",
    navEncyclopedia: lang === "th" ? "สารานุกรม" : "Encyclopedia",
    navShop:       lang === "th" ? "สั่งซื้อ" : "Shop",
    navGallery:    lang === "th" ? "แกลเลอรี" : "Gallery",
    navAbout:      lang === "th" ? "เกี่ยวกับเรา" : "About Us",
    navContact:    lang === "th" ? "ติดต่อ" : "Contact",
    navFaq:        lang === "th" ? "คำถามที่พบบ่อย" : "FAQ",
    navMap:        lang === "th" ? "แผนที่" : "Map",
    navWishlist:   lang === "th" ? "รายการโปรด" : "Wishlist",
    latestTitle:   lang === "th" ? "อัปเดตล่าสุด" : "Latest Updates",
    latestAnimal:  lang === "th" ? "สัตว์ใหม่" : "New Animals",
    latestPlant:   lang === "th" ? "พืชใหม่" : "New Plants",
    sotdLabel:     lang === "th" ? "สายพันธุ์แนะนำวันนี้" : "Species of the Day",
    sotdFlip:      lang === "th" ? "คลิกเพื่อดูข้อมูล" : "Click to reveal",
    sotdDetail:    lang === "th" ? "ดูรายละเอียด →" : "View Details →",
    spotlightTitle:lang === "th" ? "สายพันธุ์เด่น" : "Featured Species",
    spotlightSub:  lang === "th" ? "คัดสรรสายพันธุ์น่าสนใจสำหรับคุณ" : "Hand-picked interesting species for you",
    viewAll:       lang === "th" ? "ดูทั้งหมด →" : "View All →",
    animalLabel:   lang === "th" ? "สัตว์" : "Animal",
    plantLabel:    lang === "th" ? "พืช" : "Plant",
    bannerTitle:   lang === "th" ? "ข่าวสารและประชาสัมพันธ์" : "News & Announcements",
    ctaTitle:      lang === "th" ? "สนใจสายพันธุ์หรือนัดชมฟาร์ม?" : "Interested in species or a farm visit?",
    ctaDesc:       lang === "th" ? "เราพร้อมต้อนรับและให้ข้อมูลทุกสายพันธุ์ที่คุณสนใจ" : "We are ready to welcome you and provide info on any species.",
    ctaBtn:        lang === "th" ? "ติดต่อสอบถาม" : "Contact Us",
    recentTitle:   lang === "th" ? "ดูล่าสุด" : "Recently Viewed",
    recentClear:   lang === "th" ? "ล้าง" : "Clear",
  };

  return (
    <div className="home-wrap">

      {/* ── Scroll Progress Bar ── */}
      <div className="scroll-progress-track">
        <div className="scroll-progress-fill" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* ════════════════════════════════════════
          HERO BANNER — ครบในภาพเดียว
      ════════════════════════════════════════ */}
      <section ref={heroRef} className="home-hero" style={{ textAlign: "center", paddingBottom: 0 }}>
        <div className="cursor-orb" style={{ left: `${orbPos.x}%`, top: `${orbPos.y}%` }} />
        {PARTICLES.map((p, i) => (
          <div key={i} className="particle" style={{
            position: "absolute", left: p.left, top: p.top,
            width: p.w, height: p.w, borderRadius: "50%", background: "var(--primary)",
            animation: `${isDark ? "fireflyFloat" : "particleFloat"} ${p.dur} ease-in-out infinite`,
            animationDelay: p.del,
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          {/* Badge + Title */}
          <div className="fade-in-up home-hero-badge" style={{ margin: "0 auto 16px", width: "fit-content" }}>
            <IconLeaf size={13} /><span>{t.badgeLoc}</span>
          </div>
          <h1 className="fade-in-up home-hero-title" style={{ animationDelay: "0.1s", marginBottom: 6 }}>{t.title}</h1>
          <p className="fade-in-up home-hero-sub-label" style={{ animationDelay: "0.15s" }}>{t.welcome}</p>
          <p className="fade-in-up home-hero-subtitle" style={{ animationDelay: "0.22s", margin: "0 auto 20px" }}>
            <Typewriter key={t.subtitle} text={t.subtitle} delay={600} speed={18} />
          </p>

          {/* Stats row */}
          {items.length > 0 && (
            <div className="fade-in-up" style={{ animationDelay: "0.28s", display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              {[
                { icon: "🌿", val: items.length, label: t.statTotal },
                { icon: "🐾", val: animalCount,  label: t.statAnimal },
                { icon: "🌱", val: plantCount,   label: t.statPlant },
                { icon: "🛒", val: availCount,   label: t.statAvail },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "10px 18px", minWidth: 80, border: "1px solid rgba(255,255,255,0.2)" }}>
                  <div style={{ fontSize: "1.4rem" }}>{s.icon}</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-main)" }}>{s.val}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <form onSubmit={handleQuickSearch} className="fade-in-up" style={{ animationDelay: "0.33s", marginBottom: 20, display: "flex", justifyContent: "center" }}>
            <div className="home-search-bar" style={{ maxWidth: 500, width: "100%" }}>
              <IconSearch size={17} />
              <input value={quickSearch} onChange={e => setQuickSearch(e.target.value)} placeholder={t.searchPlaceholder} className="home-search-input" />
              <button type="submit" className="btn-primary home-search-btn"><IconSearch size={15} /></button>
            </div>
          </form>

          {/* CTA buttons */}
          <div className="fade-in-up home-hero-btns" style={{ animationDelay: "0.4s", justifyContent: "center", marginBottom: 24 }}>
            <Link to="/encyclopedia" className="btn-primary" style={{ padding: "13px 28px", fontSize: "0.95rem", borderRadius: 40, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <IconSearch size={17} /> {t.btnExplore}
            </Link>
            <Link to="/encyclopedia?shop=1" className="btn-primary" style={{ padding: "13px 28px", fontSize: "0.95rem", borderRadius: 40, display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gradient-secondary, var(--primary-hover))" }}>
              🛒 {t.btnShop}
            </Link>
            <Link to="/contact" className="home-btn-outline"><IconPhone size={16} /> {t.btnContact}</Link>
          </div>

          {/* Quick Nav links */}
          <div className="fade-in-up" style={{ animationDelay: "0.46s", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 8 }}>
            {[
              { to: "/encyclopedia", icon: "📚", label: t.navEncyclopedia },
              { to: "/gallery",      icon: "🖼️",  label: t.navGallery },
              { to: "/about",        icon: "🌿",  label: t.navAbout },
              { to: "/faq",          icon: "❓",  label: t.navFaq },
              { to: "/map",          icon: "🗺️",  label: t.navMap },
              { to: "/wishlist",     icon: "❤️",  label: t.navWishlist },
              { to: "/contact",      icon: "📞",  label: t.navContact },
            ].map(n => (
              <Link key={n.to} to={n.to} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 20, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", color: "var(--text-main)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 600, transition: "background 0.2s" }}>
                {n.icon} {n.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ width: "100%", height: 72, display: "block" }}>
            <path className="wave-fill" d="M0,36 C320,72 640,0 960,36 C1120,54 1280,18 1440,36 L1440,72 L0,72 Z" />
            <path className="wave-fill" d="M0,54 C480,18 960,72 1440,48 L1440,72 L0,72 Z" opacity="0.45" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BANNER 2 — ข่าวสาร + อัปเดตสายพันธุ์
      ════════════════════════════════════════ */}
      <section className="home-section home-container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }} className="home-two-col">

          {/* แบนเนอร์ประชาสัมพันธ์ */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="home-section-label" style={{ marginBottom: 10 }}>📣 {lang === "th" ? "ประชาสัมพันธ์" : "Announcements"}</div>
            <h2 className="home-section-title" style={{ marginBottom: 16, fontSize: "1.3rem" }}>
              {lang === "th" ? appSettings.bannerTitleTh || t.bannerTitle : appSettings.bannerTitleEn || t.bannerTitle}
            </h2>
            {appSettings.bannerItems.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {appSettings.bannerItems.slice(0, 4).map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--border-color)" }}>
                    <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.icon || "✨"}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 2 }}>{lang === "th" ? item.titleTh : item.titleEn}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{lang === "th" ? item.descTh : item.descEn}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "20px 0" }}>
                {lang === "th" ? "ยังไม่มีประกาศในขณะนี้" : "No announcements at this time."}
              </div>
            )}
            <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: "var(--primary-hover)", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              <IconPhone size={14} /> {t.btnContact} →
            </Link>
          </div>

          {/* อัปเดตสายพันธุ์ล่าสุด */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="home-section-label" style={{ marginBottom: 10 }}>🆕 {t.latestTitle}</div>
            <h2 className="home-section-title" style={{ marginBottom: 16, fontSize: "1.3rem" }}>
              🐾 {t.latestAnimal} & 🌱 {t.latestPlant}
            </h2>
            {loading && items.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[0,1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...items].slice(-6).reverse().map(sp => {
                  const name = lang === "th" ? sp.name_th : sp.name_en;
                  return (
                    <Link key={sp.id} to={`/species/${sp.type}/${sp.id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "var(--bg-color)", textDecoration: "none", border: "1px solid var(--border-color)" }}>
                      {sp.image ? <img src={sp.image} alt={name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} /> : <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{sp.type === "animal" ? "🐾" : "🌿"}</div>}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{sp.type === "animal" ? `🐾 ${t.animalLabel}` : `🌿 ${t.plantLabel}`}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            <Link to="/encyclopedia" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: "var(--primary-hover)", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              <IconSearch size={14} /> {t.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SOTD
      ════════════════════════════════════════ */}
      {items.length > 0 && todaySpecies && (
        <div className="home-container home-section">
          <SotdHeroCard species={todaySpecies} lang={lang} t={t} />
        </div>
      )}

      {/* ════════════════════════════════════════
          SPOTLIGHT GRID
      ════════════════════════════════════════ */}
      <section className="home-section home-container">
        <div className="home-section-head">
          <div>
            <div className="home-section-label">✨ {lang === "th" ? "คัดสรรพิเศษ" : "Hand-picked"}</div>
            <h2 className="home-section-title">{t.spotlightTitle}</h2>
          </div>
          <Link to="/encyclopedia" className="home-see-all">{t.viewAll}</Link>
        </div>
        {loading && items.length === 0 ? (
          <div className="home-spotlight-grid">
            {[0,1,2].map(i => (
              <div key={i} className="glass-card" style={{ height: 340, overflow: "hidden" }}>
                <div className="skeleton" style={{ height: 200, borderRadius: "12px 12px 0 0" }} />
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="skeleton" style={{ height: 18, width: "50%", borderRadius: 6 }} />
                  <div className="skeleton" style={{ height: 22, width: "80%", borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-spotlight-grid">
            {spotlight.map((sp, idx) => <SpotlightCard key={sp.id} sp={sp} lang={lang} t={t} idx={idx} />)}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          RECENTLY VIEWED
      ════════════════════════════════════════ */}
      <RecentlyViewed items={items} lang={lang} t={t} />

      {/* ════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════ */}
      <section className="home-cta-section">
        <div className="home-container">
          <div className="home-cta-inner">
            <div className="home-cta-decor">🌿</div>
            <div className="home-cta-text">
              <h2 className="home-cta-title">{t.ctaTitle}</h2>
              <p className="home-cta-desc">{t.ctaDesc}</p>
            </div>
            <Link to="/contact" className="home-cta-btn">
              <IconPhone size={18} /> {t.ctaBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Back to Top ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="back-to-top"
        style={{
          position: "fixed", bottom: 32, right: 28, zIndex: 900,
          width: 48, height: 48, borderRadius: "50%",
          background: "var(--gradient-primary)", color: "#fff", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow-primary)",
          opacity: showTop ? 1 : 0,
          transform: showTop ? "translateY(0) scale(1)" : "translateY(16px) scale(0.85)",
          transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: showTop ? "auto" : "none",
        }}
        aria-label="Back to top"
      >
        <IconChevronUp size={22} />
      </button>
    </div>
  );
}

// ─── SOTD Hero Card (right side flip card) ──────────────────
function SotdHeroCard({ species, lang, t }: { species: Species; lang: string; t: Record<string, string> }) {
  const [flipped, setFlipped] = useState(false);
  const name = lang === "th" ? species.name_th : species.name_en;
  const desc = (lang === "th" ? species.short_description : species.short_description_en) || species.short_description;

  return (
    <div className="sotd-hero-wrap">
      <div className="sotd-hero-label">
        <span>✨</span>
        <span>{t.sotdLabel}</span>
        <span className="sotd-hero-date">
          {new Date().toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { day: "numeric", month: "long" })}
        </span>
      </div>
      <div
        className={`sotd-hero-card${flipped ? " flipped" : ""}`}
        onClick={() => setFlipped(v => !v)}
        title={t.sotdFlip}
      >
        {/* Front */}
        <div className="sotd-hero-face sotd-hero-front">
          <img src={species.image} alt={name} className="sotd-hero-img" />
          <div className="sotd-hero-overlay">
            <span className="sotd-hero-type">{species.type === "animal" ? "🐾" : "🌿"}</span>
            <h3 className="sotd-hero-name">{name}</h3>
            {species.scientific_name && <em className="sotd-hero-sci">{species.scientific_name}</em>}
            <div className="sotd-hero-hint">{t.sotdFlip} 👆</div>
          </div>
        </div>
        {/* Back */}
        <div className="sotd-hero-face sotd-hero-back">
          <div className="sotd-hero-back-content">
            <h3 className="sotd-hero-name" style={{ color: "var(--text-main)" }}>{name}</h3>
            {species.scientific_name && <em className="sotd-hero-sci" style={{ color: "var(--text-muted)" }}>{species.scientific_name}</em>}
            <p className="sotd-hero-desc">{desc}</p>
            <Link
              to={`/species/${species.type}/${species.id}`}
              className="btn-primary"
              style={{ padding: "11px 24px", borderRadius: 32, fontSize: "0.9rem" }}
              onClick={e => e.stopPropagation()}
            >
              {t.sotdDetail}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Spotlight Card ──────────────────────────────────────────
function SpotlightCard({ sp, lang, t, idx }: { sp: Species; lang: string; t: Record<string, string>; idx: number }) {
  const name = lang === "th" ? sp.name_th : sp.name_en;
  const desc = (lang === "th" ? sp.short_description : sp.short_description_en) || sp.short_description;

  return (
    <Link
      to={`/species/${sp.type}/${sp.id}`}
      className="home-spotlight-card fade-in-up"
      style={{ textDecoration: "none", animationDelay: `${idx * 0.1}s` }}
    >
      <div className="home-spotlight-img-wrap">
        <img src={sp.image} alt={name} className="home-spotlight-img" />
        <span className="home-spotlight-badge">
          {sp.type === "animal"
            ? <><IconPaw size={11} color="#fff" />{t.animalLabel}</>
            : <><IconLeaf size={11} color="#fff" />{t.plantLabel}</>}
        </span>
      </div>
      <div className="home-spotlight-body">
        <h3 className="home-spotlight-name">{name}</h3>
        {sp.scientific_name && <em className="home-spotlight-sci">{sp.scientific_name}</em>}
        <p className="home-spotlight-desc">{desc}</p>
        <span className="home-spotlight-link">{lang === "th" ? "ดูรายละเอียด →" : "View Details →"}</span>
      </div>
    </Link>
  );
}

// ─── Recently Viewed ─────────────────────────────────────────
function RecentlyViewed({ items, lang, t }: { items: Species[]; lang: string; t: Record<string, string> }) {
  const [viewed, setViewed] = useState<{ id: string; type: string }[]>([]);
  useEffect(() => {
    try { setViewed(JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]")); }
    catch { /* ignore */ }
  }, []);

  const recentSpecies = viewed
    .map(v => items.find(x => x.id === v.id && x.type === v.type))
    .filter((x): x is Species => !!x)
    .slice(0, 8);

  if (recentSpecies.length === 0) return null;

  return (
    <section className="home-section home-container">
      <div className="home-section-head">
        <div>
          <div className="home-section-label">🕐 {lang === "th" ? "ประวัติการดู" : "History"}</div>
          <h2 className="home-section-title">{t.recentTitle}</h2>
        </div>
        <button
          className="home-see-all"
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          onClick={() => { localStorage.removeItem(RECENTLY_VIEWED_KEY); setViewed([]); }}
        >
          {t.recentClear}
        </button>
      </div>
      <div className="home-recent-scroll">
        {recentSpecies.map(sp => (
          <Link key={sp.id} to={`/species/${sp.type}/${sp.id}`} className="home-recent-card" style={{ textDecoration: "none" }}>
            <img src={sp.image} alt={lang === "th" ? sp.name_th : sp.name_en} className="home-recent-img" />
            <div className="home-recent-body">
              <div className="home-recent-name">{lang === "th" ? sp.name_th : sp.name_en}</div>
              <div className="home-recent-type">
                {sp.type === "animal" ? "🐾" : "🌿"} {sp.type === "animal" ? (lang === "th" ? "สัตว์" : "Animal") : (lang === "th" ? "พืช" : "Plant")}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────
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
function IconChevronUp({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
}
