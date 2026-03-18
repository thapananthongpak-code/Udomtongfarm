import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useCartStore } from "../../store/cartStore";
import type { Species, SpeciesType } from "../../types/species";

type FilterTab = "all" | SpeciesType;
type SortMode = "default" | "az" | "za";

const HISTORY_KEY = "uf_search_history";
const FAVORITES_KEY = "uf_favorites";
const MAX_HISTORY = 8;
const PAGE_SIZE = 12;

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
function saveHistory(q: string) {
  const prev = getHistory().filter((h) => h !== q);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...prev].slice(0, MAX_HISTORY)));
}
function clearHistory() { localStorage.removeItem(HISTORY_KEY); }

function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); } catch { return []; }
}

export default function Encyclopedia() {
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore();
  const location = useLocation();
  const _initState = (location.state ?? {}) as { q?: string; type?: FilterTab };
  const [tab, setTab] = useState<FilterTab>(_initState.type || "all");
  const [query, setQuery] = useState(_initState.q || "");
  const [inputValue, setInputValue] = useState(_initState.q || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<string[]>(getHistory());
  const [sortMode, setSortMode] = useState<SortMode>("az");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>(getFavorites);
  const [activeTag, setActiveTag] = useState<string>("");
  const [showTop, setShowTop] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(document.documentElement.scrollTop > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Reset page on filter/search change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1); }, [tab, query, sortMode, activeTag]);

  // Close suggestions on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const t = {
    title:             lang === "th" ? "สารานุกรมธรรมชาติ" : "Nature Encyclopedia",
    subtitle:          lang === "th" ? "สำรวจและเรียนรู้ความหลากหลายของสิ่งมีชีวิตในฟาร์มของเรา" : "Explore and learn about the diversity of life in our farm.",
    searchPlaceholder: lang === "th" ? 'ค้นหา เช่น "หงส์", "สักทอง", "Cygnus"...' : 'Search e.g. "Swan", "Teak", "Cygnus"...',
    all:               lang === "th" ? "ทั้งหมด" : "All",
    animals:           lang === "th" ? "สัตว์" : "Animals",
    plants:            lang === "th" ? "พืช" : "Plants",
    showing:           lang === "th" ? "แสดงผล" : "Showing",
    of:                lang === "th" ? "จาก" : "of",
    unit:              lang === "th" ? "รายการ" : "items",
    noResult:          lang === "th" ? "ไม่พบข้อมูลที่คุณค้นหา" : "No results found.",
    noResultSub:       lang === "th" ? "ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น" : "Try a different keyword or category.",
    readMore:          lang === "th" ? "อ่านข้อมูล" : "Details",
    recentSearches:    lang === "th" ? "การค้นหาล่าสุด" : "Recent Searches",
    clearHistory:      lang === "th" ? "ล้างประวัติ" : "Clear",
    animalLabel:       lang === "th" ? "สัตว์" : "Animal",
    plantLabel:        lang === "th" ? "พืช" : "Plant",
    backHome:          lang === "th" ? "กลับหน้าแรก" : "Back to Home",
    sortLabel:         lang === "th" ? "เรียงลำดับ" : "Sort",
    sortAZ:            lang === "th" ? "ก-ฮ (A-Z)" : "A–Z",
    sortZA:            lang === "th" ? "ฮ-ก (Z-A)" : "Z–A",
    sortDefault:       lang === "th" ? "ค่าเริ่มต้น" : "Default",
    viewDetails:       lang === "th" ? "ดูรายละเอียด →" : "View Details →",
    prev:              lang === "th" ? "ก่อนหน้า" : "Prev",
    next:              lang === "th" ? "ถัดไป" : "Next",
    page:              lang === "th" ? "หน้า" : "Page",
  };

  const counts = useMemo(() => ({
    all: items.length,
    animal: items.filter((x) => x.type === "animal").length,
    plant: items.filter((x) => x.type === "plant").length,
  }), [items]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach(x => (x.tags ?? []).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  const filteredSpecies = useMemo(() => {
    let list: Species[] = items;
    if (tab !== "all") list = list.filter((x) => x.type === tab);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((x) => {
        const th  = x.name_th?.toLowerCase() ?? "";
        const en  = x.name_en?.toLowerCase() ?? "";
        const sci = x.scientific_name?.toLowerCase() ?? "";
        return th.includes(q) || en.includes(q) || sci.includes(q);
      });
    }
    if (activeTag) {
      list = list.filter(x => (x.tags ?? []).includes(activeTag));
    }
    if (sortMode === "az") {
      list = [...list].sort((a, b) => (lang === "th" ? a.name_th : a.name_en || "").localeCompare(lang === "th" ? b.name_th : b.name_en || ""));
    } else if (sortMode === "za") {
      list = [...list].sort((a, b) => (lang === "th" ? b.name_th : b.name_en || "").localeCompare(lang === "th" ? a.name_th : a.name_en || ""));
    }
    return list;
  }, [items, tab, query, sortMode, lang, activeTag]);

  const totalPages = Math.ceil(filteredSpecies.length / PAGE_SIZE);
  const pagedSpecies = filteredSpecies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function commitSearch(val: string) {
    const trimmed = val.trim();
    setQuery(trimmed);
    setInputValue(trimmed);
    setShowSuggestions(false);
    if (trimmed) {
      saveHistory(trimmed);
      setHistory(getHistory());
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitSearch(inputValue);
    if (e.key === "Escape") setShowSuggestions(false);
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  const suggestions = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return history;
    return history.filter((h) => h.toLowerCase().includes(q));
  }, [inputValue, history]);

  return (
    <div style={{ paddingBottom: "100px" }}>

      {/* Header */}
      <header style={{ padding: "80px 24px 48px", textAlign: "center", background: "linear-gradient(180deg, var(--primary-light) 0%, var(--bg-color) 100%)", borderRadius: "0 0 50px 50px", marginBottom: "48px" }}>
        <div style={{ marginBottom: 20, textAlign: "left", maxWidth: 1000, margin: "0 auto 20px" }}>
          <Link to="/" className="btn-back" style={{ display: "inline-flex" }}>
            <IconArrowLeft size={16} /> {t.backHome}
          </Link>
        </div>
        <h1 className="fade-in-up" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, color: "var(--primary-hover)", marginBottom: "16px" }}>
          {t.title}
        </h1>
        <p className="fade-in-up" style={{ color: "var(--text-muted)", fontSize: "1.05rem", animationDelay: "0.2s", maxWidth: 560, margin: "0 auto" }}>
          {t.subtitle}
        </p>
      </header>

      {/* Search & Filter */}
      <div className="fade-in-up" style={{ maxWidth: "1000px", margin: "0 auto 48px auto", padding: "0 20px", animationDelay: "0.3s" }}>
        <div className="glass-card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Search input */}
          <div ref={searchRef} style={{ position: "relative" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <IconSearch size={18} />
              </span>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder={t.searchPlaceholder}
                style={{ width: "100%", padding: "14px 44px 14px 48px", borderRadius: "14px", border: "1.5px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontSize: "1rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onMouseOver={e => (e.currentTarget.style.borderColor = "var(--primary)")}
                onMouseOut={e => (e.currentTarget.style.borderColor = inputValue ? "var(--primary)" : "var(--border-color)")}
              />
              {inputValue && (
                <button
                  onClick={() => { setInputValue(""); setQuery(""); inputRef.current?.focus(); }}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.1rem", padding: "4px", display: "flex", alignItems: "center" }}
                >
                  <IconX size={16} />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                <div style={{ padding: "10px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{t.recentSearches}</span>
                  <button onClick={handleClearHistory} style={{ fontSize: "0.78rem", color: "var(--primary-hover)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}>{t.clearHistory}</button>
                </div>
                {suggestions.map((s) => (
                  <div key={s} className="search-suggestion-item" onClick={() => commitSearch(s)}>
                    <IconClock size={14} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter pills + Sort */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <FilterPill active={tab === "all"}    onClick={() => setTab("all")}    label={t.all}     count={counts.all}    />
              <FilterPill active={tab === "animal"} onClick={() => setTab("animal")} label={t.animals} count={counts.animal} icon={<IconPaw size={14} color={tab === "animal" ? "#fff" : undefined} />} />
              <FilterPill active={tab === "plant"}  onClick={() => setTab("plant")}  label={t.plants}  count={counts.plant}  icon={<IconLeaf size={14} color={tab === "plant" ? "#fff" : undefined} />} />
            </div>
            <select
              className="sort-select"
              value={sortMode}
              onChange={e => setSortMode(e.target.value as SortMode)}
            >
              <option value="default">{t.sortDefault}</option>
              <option value="az">{t.sortAZ}</option>
              <option value="za">{t.sortZA}</option>
            </select>
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", flexShrink: 0 }}>
                🏷️ {lang === "th" ? "หมวดหมู่:" : "Tags:"}
              </span>
              {activeTag && (
                <button onClick={() => setActiveTag("")} style={{ padding: "4px 12px", borderRadius: 20, border: "1.5px solid var(--primary)", background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  #{activeTag} ✕
                </button>
              )}
              {allTags.filter(t => t !== activeTag).map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)} style={{ padding: "4px 12px", borderRadius: 20, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.color = "var(--primary-hover)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: "20px", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span>{t.showing} <strong style={{ color: "var(--text-main)" }}>{filteredSpecies.length}</strong> {t.of} {counts[tab === "all" ? "all" : tab]} {t.unit}</span>
          {favorites.length > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#f87171", fontWeight: 700 }}>
              <IconHeart size={14} filled /> {favorites.length} {lang === "th" ? "รายการที่บันทึก" : "saved"}
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card" style={{ padding: 16, overflow: "hidden", height: 360 }}>
                <div className="skeleton" style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 16 }} />
                <div className="skeleton" style={{ width: "40%", height: 20, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: "80%", height: 24, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: "60%", height: 16 }} />
              </div>
            ))}
          </div>
        ) : pagedSpecies.length > 0 ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {pagedSpecies.map((sp, idx) => (
                <SpeciesCard
                  key={`${sp.type}-${sp.id}`}
                  sp={sp}
                  lang={lang}
                  t={t}
                  idx={idx}
                  isFav={favorites.includes(sp.id)}
                  onToggleFav={toggleFavorite}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← {t.prev}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i-1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: "var(--text-muted)" }}>…</span>
                    ) : (
                      <button
                        key={p}
                        className={`page-btn${page === p ? " active" : ""}`}
                        onClick={() => setPage(p as number)}
                      >
                        {p}
                      </button>
                    )
                  )
                }
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  {t.next} →
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary-light)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconSearch size={28} />
            </div>
            <h3 style={{ color: "var(--text-main)", marginBottom: 8 }}>{t.noResult}</h3>
            <p style={{ fontSize: "0.9rem" }}>{t.noResultSub}</p>
          </div>
        )}
      </div>
      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
          fontSize: "1.2rem",
        }}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

// ─── Species Card (Flip) ───
function SpeciesCard({ sp, lang, t, idx, isFav, onToggleFav }: {
  sp: Species;
  lang: string;
  t: Record<string, string>;
  idx: number;
  isFav: boolean;
  onToggleFav: (id: string, e: React.MouseEvent) => void;
}) {
  const { addItem } = useCartStore();
  const name = lang === "th" ? sp.name_th : sp.name_en;
  const shortDesc = lang === "th" ? sp.short_description : sp.short_description_en || sp.short_description;
  const hasPrice = typeof sp.price === "number" && sp.price > 0;
  const inStock  = (sp.stock ?? 0) > 0 || sp.available !== false;
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty]             = useState(1);
  const [gender, setGender]       = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showModal) { setQty(1); setGender(sp.gender ?? ""); }
  }, [showModal, sp.gender]);

  useEffect(() => {
    if (!showModal) return;
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) setShowModal(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showModal]);

  const fmt = (n: number) => n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });
  const genderOptions = sp.type === "animal"
    ? (lang === "th" ? ["ผสม", "เพศผู้", "เพศเมีย", "คู่ผสมพันธุ์"] : ["Mixed", "Male", "Female", "Breeding Pair"])
    : [];

  function handleAdd() {
    if (!hasPrice || !inStock) return;
    addItem({
      cart_key: `${sp.id}|${gender}`,
      species_id: sp.id,
      species_name: sp.name_th,
      species_name_en: sp.name_en,
      species_image: sp.image,
      species_type: sp.type,
      unit_price: sp.price!,
      quantity: qty,
      unit: sp.unit ?? (sp.type === "animal" ? "ตัว" : "ต้น"),
      gender: gender || undefined,
    });
    setShowModal(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <Link
        to={`/species/${sp.type}/${sp.id}`}
        className="glass-card fade-in-up"
        style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", animationDelay: `${0.05 * (idx % 10)}s` }}
      >
        {/* Image */}
        <div style={{ width: "100%", height: "200px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
          <img src={sp.image} alt="" className="hover-zoom-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {hasPrice && !inStock && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ background: "#ef4444", color: "white", borderRadius: 8, padding: "4px 12px", fontWeight: 800, fontSize: "0.85rem" }}>{lang === "th" ? "สินค้าหมด" : "Out of Stock"}</span>
            </div>
          )}
          {hasPrice && typeof sp.stock === "number" && sp.stock > 0 && (
            <div style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(0,0,0,0.55)", color: "white", borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700 }}>
              {lang === "th" ? "เหลือ" : "Stock"} {sp.stock}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ background: sp.type === "animal" ? "var(--primary-light)" : "#fef3c7", color: sp.type === "animal" ? "var(--primary-hover)" : "#d97706", padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 5 }}>
              {sp.type === "animal"
                ? <><IconPaw size={12} />{t.animalLabel}</>
                : <><IconLeaf size={12} color="#d97706" />{t.plantLabel}</>}
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {hasPrice && inStock && (
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
                  style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", color: "white", border: "none", fontSize: "1.2rem", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", lineHeight: 1 }}
                  title={lang === "th" ? "เพิ่มเข้าตะกร้า" : "Add to Cart"}
                >+</button>
              )}
              <button
                className={`btn-fav${isFav ? " active" : ""}`}
                onClick={(e) => onToggleFav(sp.id, e)}
                aria-label="Toggle favorite"
              >
                <IconHeart size={16} filled={isFav} />
              </button>
            </div>
          </div>

          <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1.3 }}>
            {name}
          </h3>
          {sp.name_en && lang === "th" && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", fontWeight: 500, margin: "0 0 2px 0" }}>
              {sp.name_en}
            </p>
          )}
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic", margin: 0 }}>{sp.scientific_name}</p>

          {hasPrice && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8 }}>
              <span style={{ color: "var(--primary-hover)", fontWeight: 900, fontSize: "1rem" }}>{fmt(sp.price!)}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>/ {sp.unit ?? (sp.type === "animal" ? "ตัว" : "ต้น")}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Cart Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }}>
          <div ref={modalRef} style={{ background: "var(--card-bg)", borderRadius: 18, padding: 24, width: "min(360px, 92vw)", boxShadow: "0 8px 40px rgba(0,0,0,0.25)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
              <img src={sp.image} alt={sp.name_th} style={{ width: 54, height: 54, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "1rem" }}>{lang === "th" ? sp.name_th : sp.name_en}</div>
                <div style={{ color: "var(--primary-hover)", fontWeight: 900, fontSize: "1.1rem" }}>{fmt(sp.price!)}</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
            </div>
            {genderOptions.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 8, fontSize: "0.9rem" }}>⚥ {lang === "th" ? "เพศ" : "Gender"}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["", ...genderOptions].map(g => (
                    <button key={g} onClick={() => setGender(g)}
                      style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${gender === g ? "var(--primary)" : "var(--border-color)"}`, background: gender === g ? "var(--primary-light)" : "var(--bg-color)", color: gender === g ? "var(--primary-hover)" : "var(--text-muted)", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>
                      {g || (lang === "th" ? "ไม่ระบุ" : "Any")}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 8, fontSize: "0.9rem" }}>
                📦 {lang === "th" ? "จำนวน" : "Quantity"}
                {typeof sp.stock === "number" && sp.stock > 0 && (
                  <span style={{ marginLeft: 8, color: "var(--text-muted)", fontWeight: 400, fontSize: "0.8rem" }}>({lang === "th" ? "เหลือ" : "Stock"} {sp.stock})</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", fontWeight: 900, fontSize: "1.2rem", cursor: "pointer", color: "var(--text-main)" }}>−</button>
                <input type="number" min={1} max={sp.stock ?? 999} value={qty}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: 60, textAlign: "center", padding: "8px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 900, fontSize: "1.1rem" }} />
                <button onClick={() => setQty(q => q + 1)} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", fontWeight: 900, fontSize: "1.2rem", cursor: "pointer", color: "var(--text-main)" }}>+</button>
                <span style={{ marginLeft: 4, color: "var(--primary-hover)", fontWeight: 900, fontSize: "1rem" }}>= {fmt(sp.price! * qty)}</span>
              </div>
            </div>
            <button onClick={handleAdd} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "var(--primary)", color: "white", border: "none", fontWeight: 800, fontSize: "1rem", cursor: "pointer" }}>
              🛒 {lang === "th" ? "เพิ่มเข้าตะกร้า" : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Filter Pill ───
function FilterPill({ active, onClick, label, count, icon }: { active: boolean; onClick: () => void; label: string; count: number; icon?: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding: "10px 20px", borderRadius: "12px", border: active ? "1.5px solid var(--primary)" : "1.5px solid var(--border-color)", background: active ? "var(--primary)" : "var(--card-bg)", color: active ? "#fff" : "var(--text-main)", cursor: "pointer", fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s ease" }}>
      {icon}
      {label}
      <span style={{ background: active ? "rgba(255,255,255,0.2)" : "var(--primary-light)", color: active ? "#fff" : "var(--primary-hover)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.8rem" }}>
        {count}
      </span>
    </button>
  );
}

// ─── SVG Icons ───
function IconSearch({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function IconPaw({ size = 14, color }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "var(--primary-hover)"} stroke="none"><circle cx="4.5" cy="9.5" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19.5" cy="9.5" r="2"/><path d="M12 12.5c-2.5 0-6 2.5-6 5.5a2.5 2.5 0 0 0 2.5 2.5c1 0 2-.5 3.5-.5s2.5.5 3.5.5A2.5 2.5 0 0 0 18 18c0-3-3.5-5.5-6-5.5z"/></svg>;
}
function IconLeaf({ size = 14, color }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "var(--primary-hover)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
}
function IconArrowLeft({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
}
function IconX({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function IconClock({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconHeart({ size = 16, filled = false }: { size?: number; filled?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#f87171" : "none"} stroke={filled ? "#f87171" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
