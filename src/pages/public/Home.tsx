import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useAppSettingsStore } from "../../store/appSettingsStore";
import type { Species } from "../../types/species";
import { RECENTLY_VIEWED_KEY } from "./SpeciesPage";

// ─── Species of the Day ──────────────────────────────────────
function SpeciesOfTheDay({ items, lang }: { items: Species[]; lang: string }) {
  const [flipped, setFlipped] = useState(false);
  const todaySpecies = useMemo(() => {
    if (items.length === 0) return null;
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return items[seed % items.length];
  }, [items]);

  if (!todaySpecies) return null;
  const name = lang === "th" ? todaySpecies.name_th : todaySpecies.name_en;
  const desc =
    (lang === "th" ? todaySpecies.short_description : todaySpecies.short_description_en) ||
    todaySpecies.short_description;

  return (
    <div className="sotd-section">
      <div className="sotd-header">
        <span className="sotd-tag">✨</span>
        <h2 className="sotd-title">
          {lang === "th" ? "สายพันธุ์แนะนำวันนี้" : "Species of the Day"}
        </h2>
        <span className="sotd-date">
          {new Date().toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { day: "numeric", month: "long" })}
        </span>
      </div>
      <div
        className={`sotd-flip-card${flipped ? " flipped" : ""}`}
        onClick={() => setFlipped((v) => !v)}
        title={lang === "th" ? "คลิกเพื่อพลิกดู" : "Click to flip"}
      >
        {/* Front */}
        <div className="sotd-face sotd-front">
          <img src={todaySpecies.image} alt={name} className="sotd-img" />
          <div className="sotd-front-overlay">
            <span className="sotd-type-badge">
              {todaySpecies.type === "animal" ? "🐾" : "🌿"}
            </span>
            <h3 className="sotd-name">{name}</h3>
            {todaySpecies.scientific_name && (
              <em className="sotd-sci">{todaySpecies.scientific_name}</em>
            )}
            <div className="sotd-hint">
              {lang === "th" ? "คลิกเพื่อดูข้อมูล 👆" : "Click to reveal 👆"}
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="sotd-face sotd-back">
          <div className="sotd-back-content">
            <h3 className="sotd-name" style={{ color: "var(--text-main)" }}>{name}</h3>
            {todaySpecies.scientific_name && (
              <em className="sotd-sci" style={{ color: "var(--text-muted)" }}>{todaySpecies.scientific_name}</em>
            )}
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.97rem", margin: "16px 0 24px" }}>
              {desc}
            </p>
            <Link
              to={`/species/${todaySpecies.type}/${todaySpecies.id}`}
              className="btn-primary"
              style={{ padding: "12px 28px", borderRadius: 32, fontSize: "0.92rem" }}
              onClick={(e) => e.stopPropagation()}
            >
              {lang === "th" ? "ดูรายละเอียด →" : "View Details →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Animated Stats ──────────────────────────────────────────
function AnimatedStats({ items, lang }: { items: Species[]; lang: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const animalCount = items.filter((x) => x.type === "animal").length;
  const plantCount = items.filter((x) => x.type === "plant").length;
  const availCount = items.filter((x) => x.available !== false).length;

  const stats = [
    { label: lang === "th" ? "สายพันธุ์ทั้งหมด" : "Total Species", value: items.length, icon: "🌿" },
    { label: lang === "th" ? "สัตว์" : "Animals",                  value: animalCount,   icon: "🐾" },
    { label: lang === "th" ? "พืช" : "Plants",                     value: plantCount,    icon: "🌱" },
    { label: lang === "th" ? "พร้อมจำหน่าย" : "Available",         value: availCount,    icon: "🏷️" },
  ];

  return (
    <div ref={ref} className="stats-section">
      {stats.map((s, i) => (
        <div key={i} className="stat-card fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="stat-icon">{s.icon}</div>
          <div className="stat-value" style={{ color: "var(--primary-hover)" }}>
            {visible ? <CountUp to={s.value} duration={1000 + i * 200} /> : 0}
            <span style={{ fontSize: "1.5rem" }}>+</span>
          </div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function CountUp({ to, duration }: { to: number; duration: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <>{count}</>;
}

// ─── Pre-defined particle positions ───
const PARTICLES = [
  { left: "8%",  top: "22%", w: 3, dur: "8s",  del: "0s"    },
  { left: "18%", top: "65%", w: 2, dur: "11s", del: "1.2s"  },
  { left: "30%", top: "38%", w: 4, dur: "9s",  del: "2.5s"  },
  { left: "45%", top: "78%", w: 2, dur: "13s", del: "0.8s"  },
  { left: "55%", top: "15%", w: 3, dur: "10s", del: "3s"    },
  { left: "67%", top: "52%", w: 2, dur: "7s",  del: "1.8s"  },
  { left: "74%", top: "82%", w: 3, dur: "12s", del: "4s"    },
  { left: "83%", top: "28%", w: 4, dur: "9s",  del: "2s"    },
  { left: "91%", top: "62%", w: 2, dur: "8s",  del: "0.5s"  },
  { left: "38%", top: "48%", w: 3, dur: "14s", del: "3.5s"  },
  { left: "62%", top: "90%", w: 2, dur: "10s", del: "1s"    },
  { left: "78%", top: "10%", w: 3, dur: "11s", del: "2.8s"  },
];

export default function Home() {
  const navigate = useNavigate();
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore();
  const appSettings = useAppSettingsStore();
  const fetchAppSettings = useAppSettingsStore((s) => s.fetchSettings);

  useEffect(() => {
    fetchAll();
    fetchAppSettings();
  }, [fetchAll, fetchAppSettings]);

  // ── Dark mode detection ──
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.dataset.theme === "dark"
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.dataset.theme === "dark");
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // ── Scroll Progress + Back to Top + Parallax ──────────────────
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [heroParallax, setHeroParallax] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
      setShowTop(scrolled > 400);
      setHeroParallax(scrolled * 0.28);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Cursor orb tracking ──────────────────────────────────────
  const [orbPos, setOrbPos] = useState({ x: 50, y: 50 });
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrbPos({ x, y });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Spotlight ──────────────────────────────────────────────────
  const [spotlight, setSpotlight] = useState<Species[]>([]);
  useEffect(() => {
    if (items.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpotlight([...items].sort(() => 0.5 - Math.random()).slice(0, 3));
  }, [items]);

  // ── Quick Search ────────────────────────────────────────────
  const [quickSearch, setQuickSearch] = useState("");
  function handleQuickSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = quickSearch.trim();
    navigate("/encyclopedia", q ? { state: { q } } : undefined);
    setQuickSearch("");
  }

  const t = {
    title:          lang === "th" ? "ฟาร์มอุดมทอง" : "Udomtong Farm",
    welcome:        lang === "th" ? "ยินดีต้อนรับสู่สารานุกรมธรรมชาติของเรา" : "Welcome to Our Nature Encyclopedia",
    subtitle:       lang === "th"
      ? "แหล่งรวบรวมและอนุรักษ์สัตว์และพืชหายากแห่งจังหวัดชัยภูมิ สัมผัสความหลากหลายทางชีวภาพใกล้ชิดธรรมชาติ"
      : "A dedicated space for collecting and conserving rare animals and plants in Chaiyaphum — explore biodiversity up close.",
    btnExplore:     lang === "th" ? "เปิดดูสารานุกรม" : "Browse Encyclopedia",
    btnContact:     lang === "th" ? "ติดต่อเรา" : "Contact Us",
    announceTitle:  lang === "th" ? "ข่าวสารและประชาสัมพันธ์" : "News & Announcements",
    announceNew:    lang === "th" ? "ใหม่" : "NEW",
    announceLabel:  lang === "th" ? "พร้อมจำหน่าย" : "Available for Sale",
    announceDesc:   lang === "th" ? "สนใจสอบถามราคาหรือนัดชมฟาร์ม กรุณาติดต่อเรา" : "Interested in pricing or a farm visit? Contact us.",
    announceContact:lang === "th" ? "ติดต่อสอบถาม" : "Inquire Now",
    announceMore:   lang === "th" ? "ดูทั้งหมดในสารานุกรม" : "View All in Encyclopedia",
    farmInfo1:      lang === "th" ? "อนุรักษ์พันธุ์หายาก" : "Rare Species Conservation",
    farmInfo1Desc:  lang === "th" ? "รวบรวมและดูแลสายพันธุ์สัตว์และพืชที่หายากและใกล้สูญพันธุ์" : "Collecting and caring for rare and endangered animal and plant species.",
    farmInfo2:      lang === "th" ? "ฟาร์มเกษตรธรรมชาติ" : "Natural Farm",
    farmInfo2Desc:  lang === "th" ? "ดำเนินงานด้วยแนวคิดเกษตรธรรมชาติ เคารพระบบนิเวศ" : "Operating with a natural farming philosophy that respects the ecosystem.",
    farmInfo3:      lang === "th" ? "เปิดต้อนรับผู้เยี่ยมชม" : "Open for Visits",
    farmInfo3Desc:  lang === "th" ? "ยินดีต้อนรับผู้สนใจเข้าชมและเรียนรู้ นัดหมายล่วงหน้า" : "Welcome visitors by appointment — come learn and explore nature.",
    animalLabel:    lang === "th" ? "สัตว์" : "Animal",
    plantLabel:     lang === "th" ? "พืช" : "Plant",
    badgeLoc:       lang === "th" ? "จ.ชัยภูมิ ประเทศไทย" : "Chaiyaphum, Thailand",
    searchPlaceholder: lang === "th" ? "ค้นหาสายพันธุ์ เช่น หงส์, สักทอง..." : "Search species, e.g. Swan, Teak...",
  };

  return (
    <div style={{ paddingBottom: "100px", overflowX: "hidden" }}>

      {/* ── Scroll Progress Bar ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 3,
        background: "var(--border-color)", zIndex: 9999, pointerEvents: "none"
      }}>
        <div style={{
          height: "100%",
          width: `${scrollProgress}%`,
          background: "var(--gradient-primary)",
          transition: "width 0.1s linear",
          boxShadow: "0 0 8px var(--primary)",
        }} />
      </div>

      {/* ─── Hero ─── */}
      <section
        ref={heroRef}
        id="hero-section"
        style={{
          padding: "120px 24px 160px 24px",
          textAlign: "center",
          background: "var(--gradient-hero)",
          position: "relative",
          overflow: "hidden",
          marginBottom: "80px",
        }}
      >
        {/* Parallax background layer */}
        <div style={{
          position: "absolute", inset: 0,
          background: "var(--gradient-hero)",
          transform: `translateY(${heroParallax * 0.4}px)`,
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Cursor-following orb */}
        <div
          className="cursor-orb"
          style={{
            left: `${orbPos.x}%`,
            top: `${orbPos.y}%`,
          }}
        />

        {/* Firefly / Dot particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} className="particle" style={{
            position: "absolute",
            left: p.left, top: p.top,
            width: p.w, height: p.w,
            borderRadius: "50%",
            background: "var(--primary)",
            animation: `${isDark ? "fireflyFloat" : "particleFloat"} ${p.dur} ease-in-out infinite`,
            animationDelay: p.del,
          }} />
        ))}

        {/* Soft glowing ambient orb */}
        <div style={{
          position: "absolute", top: "10%", left: "50%",
          transform: `translate(-50%, -50%) translateY(${heroParallax * 0.15}px)`,
          width: "90vw", maxWidth: 800, height: 400,
          background: "var(--primary)", opacity: 0.03, filter: "blur(100px)",
          borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
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

          {/* Typewriter subtitle */}
          <div className="fade-in-up" style={{ animationDelay: "0.15s" }}>
            <p style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", color: "var(--text-muted)", maxWidth: 700, margin: "0 auto 48px auto", lineHeight: 1.6, fontWeight: 400 }}>
              <span style={{ display: "block", color: "var(--text-main)", fontWeight: 600, marginBottom: 8 }}>{t.welcome}</span>
              <Typewriter key={t.subtitle} text={t.subtitle} delay={900} speed={22} />
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

          {/* Quick Search */}
          <form onSubmit={handleQuickSearch} className="fade-in-up" style={{ animationDelay: "0.45s", marginTop: 32, display: "flex", justifyContent: "center", position: "relative", zIndex: 2 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--card-bg)", backdropFilter: "blur(16px)",
              border: "1px solid var(--border-color)", borderRadius: 40,
              padding: "6px 6px 6px 22px",
              boxShadow: "var(--shadow-md)",
              maxWidth: 480, width: "100%",
              transition: "border-color 0.25s, box-shadow 0.25s",
            }}
              onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 4px var(--primary-light), var(--shadow-md)"; }}
              onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
            >
              <input
                value={quickSearch}
                onChange={e => setQuickSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                style={{
                  flex: 1, border: "none", background: "transparent",
                  fontSize: "0.95rem", color: "var(--text-main)",
                  outline: "none", fontFamily: "inherit", minWidth: 0,
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: "10px 22px", borderRadius: 32, fontSize: "0.9rem", flexShrink: 0 }}>
                <IconSearch size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Wave SVG Divider */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0, pointerEvents: "none" }}>
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ width: "100%", height: 72, display: "block" }}>
            <path className="wave-fill" d="M0,36 C320,72 640,0 960,36 C1120,54 1280,18 1440,36 L1440,72 L0,72 Z" />
            <path className="wave-fill" d="M0,54 C480,18 960,72 1440,48 L1440,72 L0,72 Z" opacity="0.45" />
          </svg>
        </div>
      </section>

      {/* ── Animated Stats ── */}
      {items.length > 0 && (
        <div style={{ maxWidth: 1100, margin: "0 auto 64px auto", padding: "0 20px" }}>
          <AnimatedStats items={items} lang={lang} />
        </div>
      )}

      {/* ── Species of the Day + Admin Promo (side by side if both exist) ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto 64px auto", padding: "0 20px", display: "grid", gridTemplateColumns: appSettings.bannerItems.length > 0 ? "1fr 1fr" : "1fr", gap: 28 }}>
        {items.length > 0 && (
          <SpeciesOfTheDay items={items} lang={lang} />
        )}

        {/* Admin Promotional Cards (compact) */}
        {appSettings.bannerItems.length > 0 && (
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 28, padding: "24px", boxShadow: "var(--shadow-md)" }}>
            {((lang === "th" && appSettings.bannerTitleTh) || (lang === "en" && appSettings.bannerTitleEn)) && (
              <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--text-main)", margin: "0 0 16px", paddingBottom: 12, borderBottom: "1px solid var(--border-color)" }}>
                {lang === "th" ? appSettings.bannerTitleTh : appSettings.bannerTitleEn}
              </h3>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {appSettings.bannerItems.slice(0, 4).map((item) => (
                <div key={item.id} className="fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 14, background: "var(--bg-color)", border: "1px solid var(--border-color)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                    {item.icon || "✨"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: 2 }}>
                      {lang === "th" ? item.titleTh : item.titleEn}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                      {lang === "th" ? item.descTh : item.descEn}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── สายพันธุ์เด่น + CTA ─── */}
      <div style={{ maxWidth: 1100, margin: "0 auto 64px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h2 className="scroll-reveal" style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-main)", margin: 0 }}>
            {t.announceTitle}
          </h2>
          <Link to="/encyclopedia" style={{ color: "var(--primary-hover)", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
            {t.announceMore} →
          </Link>
        </div>

        {loading && items.length === 0 ? (
          <div className="glass-card" style={{ overflow: "hidden", padding: 0, display: "flex", flexDirection: "row", flexWrap: "wrap", minHeight: 280, opacity: 0.7 }}>
            <div className="skeleton" style={{ flex: "1 1 280px", minWidth: 260, minHeight: 260 }} />
            <div style={{ flex: "2 1 380px", padding: "36px 40px", display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
              <div className="skeleton" style={{ height: 36, width: "65%", borderRadius: 10 }} />
              <div className="skeleton" style={{ height: 18, width: "40%", borderRadius: 8 }} />
              <div className="skeleton" style={{ height: 14, width: "90%", borderRadius: 8 }} />
              <div className="skeleton" style={{ height: 40, width: 160, borderRadius: 24, marginTop: 12 }} />
            </div>
          </div>
        ) : spotlight.length > 0 ? (
          <AnnouncementBanner item={spotlight[0]} lang={lang} t={t} delay={0} />
        ) : null}

        {/* CTA strip */}
        <div className="scroll-reveal" style={{ marginTop: 20, padding: "16px 24px", borderRadius: 14, background: "var(--primary-light)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 8 }}>
            <IconPhone size={15} /> {t.announceDesc}
          </div>
          <Link to="/contact" className="btn-primary" style={{ padding: "9px 20px", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: "0.88rem" }}>
            {t.announceContact} →
          </Link>
        </div>
      </div>

      {/* ── Recently Viewed ── */}
      <RecentlyViewed items={items} lang={lang} />

      {/* ── Back to Top Button ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="back-to-top"
        style={{
          position: "fixed", bottom: 32, right: 28, zIndex: 900,
          width: 48, height: 48, borderRadius: "50%",
          background: "var(--gradient-primary)",
          color: "#fff", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
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



// ─── Recently Viewed ─────────────────────────────────────────
function RecentlyViewed({ items, lang }: { items: Species[]; lang: string }) {
  const [viewed, setViewed] = useState<{ id: string; type: string }[]>([]);

  useEffect(() => {
    try {
      setViewed(JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]"));
    } catch { /* ignore */ }
  }, []);

  const recentSpecies = viewed
    .map((v) => items.find((x) => x.id === v.id && x.type === v.type))
    .filter((x): x is Species => !!x)
    .slice(0, 6);

  if (recentSpecies.length === 0) return null;

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto 60px", padding: "0 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-main)", margin: 0 }}>
          🕐 {lang === "th" ? "ดูล่าสุด" : "Recently Viewed"}
        </h2>
        <button
          onClick={() => { localStorage.removeItem(RECENTLY_VIEWED_KEY); setViewed([]); }}
          style={{ fontSize: "0.8rem", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          {lang === "th" ? "ล้าง" : "Clear"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
        {recentSpecies.map((sp) => (
          <Link
            key={sp.id}
            to={`/species/${sp.type}/${sp.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="glass-card" style={{ padding: 0, overflow: "hidden", transition: "transform 0.2s ease" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
            >
              <img
                src={sp.image}
                alt={lang === "th" ? sp.name_th : sp.name_en}
                style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {lang === "th" ? sp.name_th : sp.name_en}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {sp.type === "animal" ? (lang === "th" ? "🐾 สัตว์" : "🐾 Animal") : (lang === "th" ? "🌿 พืช" : "🌿 Plant")}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Announcement Banner (with diagonal ribbon) ───
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
        {/* Image section with ribbon */}
        <div className="img-wrap ribbon-wrap" style={{ flex: "1 1 300px", minWidth: 280, position: "relative", minHeight: 280 }}>
          <img src={item.image} alt={title} className="hover-zoom-img" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          {/* Diagonal ribbon instead of square badge */}
          <div className="ribbon-corner">{t.announceNew}</div>
          <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: "#fff", padding: "6px 14px", borderRadius: 24, fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            {item.type === "animal" ? <><IconPaw size={14} color="#fff" />{t.animalLabel}</> : <><IconLeaf size={14} color="#fff" />{t.plantLabel}</>}
          </div>
        </div>
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



// ─── Typewriter ───
function Typewriter({ text, delay = 800, speed = 22 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started || displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="typewriter-cursor">|</span>}
    </span>
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
function IconChevronUp({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
}
