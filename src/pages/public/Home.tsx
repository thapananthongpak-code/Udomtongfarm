import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import type { Species } from "../../types/species";
import { getRecentViewedKey } from "./SpeciesPage";
import { useAuth } from "../../store/AuthContext";
import { Search, Phone, PawPrint, Leaf, ChevronUp, ShoppingCart, Sparkles, Clock } from "lucide-react";

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
  useEffect(() => { fetchAll(); }, [fetchAll]);

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
    sotdLabel:     lang === "th" ? "สายพันธุ์แนะนำวันนี้" : "Species of the Day",
    sotdFlip:      lang === "th" ? "คลิกเพื่อดูข้อมูล" : "Click to reveal",
    sotdDetail:    lang === "th" ? "ดูรายละเอียด →" : "View Details →",
    spotlightTitle:lang === "th" ? "สายพันธุ์เด่น" : "Featured Species",
    spotlightSub:  lang === "th" ? "คัดสรรสายพันธุ์น่าสนใจสำหรับคุณ" : "Hand-picked interesting species for you",
    viewAll:       lang === "th" ? "ดูทั้งหมด →" : "View All →",
    animalLabel:   lang === "th" ? "สัตว์" : "Animal",
    plantLabel:    lang === "th" ? "พืช" : "Plant",
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
            <Leaf size={13} color="var(--primary-hover)" /><span>{t.badgeLoc}</span>
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
                { icon: <Leaf size={22} color="var(--primary-hover)" />,        val: items.length, label: t.statTotal },
                { icon: <PawPrint size={22} color="var(--primary-hover)" />,    val: animalCount,  label: t.statAnimal },
                { icon: <Leaf size={22} color="#16a34a" />,                      val: plantCount,   label: t.statPlant },
                { icon: <ShoppingCart size={22} color="var(--primary-hover)" />, val: availCount,   label: t.statAvail },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "10px 18px", minWidth: 80, border: "1px solid rgba(255,255,255,0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>{s.icon}</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-main)" }}>{s.val}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <form onSubmit={handleQuickSearch} className="fade-in-up" style={{ animationDelay: "0.33s", marginBottom: 20, display: "flex", justifyContent: "center" }}>
            <div className="home-search-bar" style={{ maxWidth: 500, width: "100%" }}>
              <Search size={17} color="var(--text-muted)" />
              <input value={quickSearch} onChange={e => setQuickSearch(e.target.value)} placeholder={t.searchPlaceholder} className="home-search-input" />
              <button type="submit" className="btn-primary home-search-btn"><Search size={15} /></button>
            </div>
          </form>

          {/* CTA buttons */}
          <div className="fade-in-up home-hero-btns" style={{ animationDelay: "0.4s", justifyContent: "center", marginBottom: 24 }}>
            <Link to="/encyclopedia" className="btn-primary" style={{ padding: "13px 28px", fontSize: "0.95rem", borderRadius: 40, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Search size={17} /> {t.btnExplore}
            </Link>
            <Link to="/encyclopedia?shop=1" className="btn-primary" style={{ padding: "13px 28px", fontSize: "0.95rem", borderRadius: 40, display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gradient-secondary, var(--primary-hover))" }}>
              <ShoppingCart size={17} /> {t.btnShop}
            </Link>
            <Link to="/contact" className="home-btn-outline"><Phone size={16} color="var(--primary-hover)" /> {t.btnContact}</Link>
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
          SPOTLIGHT GRID
      ════════════════════════════════════════ */}
      <section className="home-section home-container">
        <div className="home-section-head">
          <div>
            <div className="home-section-label" style={{ display: "flex", alignItems: "center", gap: 5 }}><Sparkles size={14} color="#f59e0b" /> {lang === "th" ? "คัดสรรพิเศษ" : "Hand-picked"}</div>
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
        <ChevronUp size={22} />
      </button>
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
            ? <><PawPrint size={11} color="#fff" />{t.animalLabel}</>
            : <><Leaf size={11} color="#fff" />{t.plantLabel}</>}
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
  const { user } = useAuth();
  const key = getRecentViewedKey(user?.email);
  const [viewed, setViewed] = useState<{ id: string; type: string }[]>([]);
  useEffect(() => {
    try { setViewed(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch { /* ignore */ }
  }, [key]);

  const recentSpecies = viewed
    .map(v => items.find(x => x.id === v.id && x.type === v.type))
    .filter((x): x is Species => !!x)
    .slice(0, 8);

  if (recentSpecies.length === 0) return null;

  return (
    <section className="home-section home-container">
      <div className="home-section-head">
        <div>
          <div className="home-section-label" style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={14} color="#f59e0b" /> {lang === "th" ? "ประวัติการดู" : "History"}</div>
          <h2 className="home-section-title">{t.recentTitle}</h2>
        </div>
        <button
          className="home-see-all"
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          onClick={() => { localStorage.removeItem(key); setViewed([]); }}
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
              <div className="home-recent-type" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {sp.type === "animal" ? <PawPrint size={12} color="var(--primary-hover)" /> : <Leaf size={12} color="#16a34a" />} {sp.type === "animal" ? (lang === "th" ? "สัตว์" : "Animal") : (lang === "th" ? "พืช" : "Plant")}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

