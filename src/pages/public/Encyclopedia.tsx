import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import type { Species, SpeciesType } from "../../types/species";

type FilterTab = "all" | SpeciesType;

const HISTORY_KEY = "uf_search_history";
const MAX_HISTORY = 8;

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
function saveHistory(q: string) {
  const prev = getHistory().filter((h) => h !== q);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...prev].slice(0, MAX_HISTORY)));
}
function clearHistory() { localStorage.removeItem(HISTORY_KEY); }

export default function Encyclopedia() {
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore();
  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<string[]>(getHistory());
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchAll(); }, [fetchAll]);

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
  };

  const counts = useMemo(() => ({
    all: items.length,
    animal: items.filter((x) => x.type === "animal").length,
    plant: items.filter((x) => x.type === "plant").length,
  }), [items]);

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
    return [...list].sort((a, b) => (a.name_en || "").localeCompare(b.name_en || ""));
  }, [items, tab, query]);

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
        {/* Back button */}
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

          {/* Filter pills */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <FilterPill active={tab === "all"}    onClick={() => setTab("all")}    label={t.all}     count={counts.all}    />
            <FilterPill active={tab === "animal"} onClick={() => setTab("animal")} label={t.animals} count={counts.animal} icon={<IconPaw size={14} color={tab === "animal" ? "#fff" : undefined} />} />
            <FilterPill active={tab === "plant"}  onClick={() => setTab("plant")}  label={t.plants}  count={counts.plant}  icon={<IconLeaf size={14} color={tab === "plant" ? "#fff" : undefined} />} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: "20px", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.9rem" }}>
          {t.showing} <strong style={{ color: "var(--text-main)" }}>{filteredSpecies.length}</strong> {t.of} {counts[tab === "all" ? "all" : tab]} {t.unit}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card" style={{ padding: 16, overflow: "hidden" }}>
                <div className="skeleton" style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 16 }} />
                <div className="skeleton" style={{ width: "40%", height: 20, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: "80%", height: 24, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: "60%", height: 16 }} />
              </div>
            ))}
          </div>
        ) : filteredSpecies.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {filteredSpecies.map((sp, idx) => (
              <Link
                to={`/species/${sp.type}/${sp.id}`}
                key={`${sp.type}-${sp.id}`}
                className="glass-card fade-in-up"
                style={{ padding: "16px", textDecoration: "none", animationDelay: `${0.05 * (idx % 10)}s` }}
              >
                <div style={{ width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
                  <img src={sp.image} alt="" className="hover-zoom-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <span style={{ background: sp.type === "animal" ? "var(--primary-light)" : "#fef3c7", color: sp.type === "animal" ? "var(--primary-hover)" : "#d97706", padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  {sp.type === "animal"
                    ? <><IconPaw size={12} />{t.animalLabel}</>
                    : <><IconLeaf size={12} color="#d97706" />{t.plantLabel}</>}
                </span>

                <h3 style={{ marginTop: "12px", marginBottom: "4px", fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1.3 }}>
                  {lang === "th" ? sp.name_th : sp.name_en}
                </h3>
                {sp.name_en && lang === "th" && (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "4px", fontWeight: 500 }}>
                    {sp.name_en}
                  </p>
                )}
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontStyle: "italic", marginBottom: "16px" }}>
                  {sp.scientific_name}
                </p>

                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.88rem" }}>
                  {t.readMore} <IconArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
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
function IconArrowRight({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
function IconX({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function IconClock({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
