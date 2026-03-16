import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import type { Species } from "../../types/species";

export default function Compare() {
  const [searchParams] = useSearchParams();
  const { items } = useSpeciesStore();
  const { lang } = useSettingsStore();

  const defaultA = searchParams.get("a") || "";
  const defaultB = searchParams.get("b") || "";

  const [idA, setIdA] = useState(defaultA);
  const [idB, setIdB] = useState(defaultB);
  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");

  const speciesA = items.find((x) => x.id === idA) || null;
  const speciesB = items.find((x) => x.id === idB) || null;

  const filteredA = useMemo(() => {
    if (!queryA.trim()) return items.slice(0, 10);
    const q = queryA.toLowerCase();
    return items
      .filter((x) => x.name_th.toLowerCase().includes(q) || x.name_en.toLowerCase().includes(q))
      .slice(0, 10);
  }, [queryA, items]);

  const filteredB = useMemo(() => {
    if (!queryB.trim()) return items.slice(0, 10);
    const q = queryB.toLowerCase();
    return items
      .filter((x) => x.name_th.toLowerCase().includes(q) || x.name_en.toLowerCase().includes(q))
      .slice(0, 10);
  }, [queryB, items]);

  const t = {
    title: lang === "th" ? "เปรียบเทียบสายพันธุ์" : "Compare Species",
    subtitle: lang === "th" ? "เลือกสายพันธุ์ 2 ชนิดเพื่อดูความแตกต่าง" : "Select 2 species to compare side-by-side",
    pickA: lang === "th" ? "เลือกสายพันธุ์ A" : "Select Species A",
    pickB: lang === "th" ? "เลือกสายพันธุ์ B" : "Select Species B",
    search: lang === "th" ? "ค้นหา..." : "Search...",
    typeLabel: lang === "th" ? "ประเภท" : "Type",
    sciName: lang === "th" ? "ชื่อวิทยาศาสตร์" : "Scientific Name",
    tags: lang === "th" ? "แท็ก" : "Tags",
    available: lang === "th" ? "พร้อมจำหน่าย" : "Available",
    desc: lang === "th" ? "คำอธิบาย" : "Description",
    yes: lang === "th" ? "✅ ใช่" : "✅ Yes",
    no: lang === "th" ? "❌ ไม่มี" : "❌ No",
    none: lang === "th" ? "ไม่ระบุ" : "N/A",
    viewDetail: lang === "th" ? "ดูรายละเอียด →" : "View Details →",
    pickBoth: lang === "th" ? "กรุณาเลือกสายพันธุ์ทั้ง 2 ชนิดเพื่อดูการเปรียบเทียบ" : "Please select both species to see the comparison",
    animal: lang === "th" ? "🐾 สัตว์" : "🐾 Animal",
    plant: lang === "th" ? "🌿 พืช" : "🌿 Plant",
    breadHome: lang === "th" ? "หน้าแรก" : "Home",
    sameLabel: lang === "th" ? "เหมือนกัน" : "Same",
    diffLabel: lang === "th" ? "ต่างกัน" : "Different",
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <header style={{
        padding: "80px 24px 56px",
        textAlign: "center",
        background: "linear-gradient(180deg, var(--primary-light) 0%, var(--bg-color) 100%)",
        borderRadius: "0 0 50px 50px",
        marginBottom: 48,
      }}>
        <nav className="breadcrumb" style={{ justifyContent: "center", marginBottom: 24 }}>
          <Link to="/">{t.breadHome}</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{t.title}</span>
        </nav>
        <div className="fade-in-up" style={{ fontSize: "3rem", marginBottom: 12 }}>⚖️</div>
        <h1 className="fade-in-up" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--primary-hover)", margin: "0 0 12px" }}>
          {t.title}
        </h1>
        <p className="fade-in-up" style={{ color: "var(--text-muted)", fontSize: "1rem", animationDelay: "0.15s", maxWidth: 480, margin: "0 auto" }}>
          {t.subtitle}
        </p>
      </header>

      {/* Picker row */}
      <div style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 24px" }}>
        <div className="compare-picker-row">
          <SpeciesPicker
            label={t.pickA}
            selected={speciesA}
            items={filteredA}
            query={queryA}
            onQuery={setQueryA}
            onSelect={(s) => setIdA(s.id)}
            onClear={() => { setIdA(""); setQueryA(""); }}
            lang={lang}
            searchPlaceholder={t.search}
            color="var(--primary)"
          />
          <div className="compare-vs">VS</div>
          <SpeciesPicker
            label={t.pickB}
            selected={speciesB}
            items={filteredB}
            query={queryB}
            onQuery={setQueryB}
            onSelect={(s) => setIdB(s.id)}
            onClear={() => { setIdB(""); setQueryB(""); }}
            lang={lang}
            searchPlaceholder={t.search}
            color="#f59e0b"
          />
        </div>
      </div>

      {/* Comparison table */}
      {speciesA && speciesB ? (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <CompareTable a={speciesA} b={speciesB} lang={lang} t={t} />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔎</div>
          <p style={{ fontSize: "1.05rem", fontWeight: 600 }}>{t.pickBoth}</p>
        </div>
      )}
    </div>
  );
}

// ─── Picker ───
function SpeciesPicker({
  label, selected, items, query, onQuery, onSelect, onClear, lang, searchPlaceholder, color,
}: {
  label: string; selected: Species | null; items: Species[];
  query: string; onQuery: (q: string) => void;
  onSelect: (s: Species) => void; onClear: () => void;
  lang: string; searchPlaceholder: string; color: string;
}) {
  const [open, setOpen] = useState(false);
  const name = selected ? (lang === "th" ? selected.name_th : selected.name_en) : null;

  return (
    <div className="compare-picker" style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
        {label}
      </div>

      {selected ? (
        <div className="compare-selected-card" style={{ borderColor: color }}>
          <img src={selected.image} alt={name || ""} className="compare-selected-img" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)", marginBottom: 2 }}>{name}</div>
            {selected.scientific_name && (
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>{selected.scientific_name}</div>
            )}
          </div>
          <button
            onClick={onClear}
            style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <input
            className="compare-search-input"
            style={{ borderColor: open ? color : undefined }}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => { onQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {open && (
            <div className="compare-dropdown">
              {items.map((item) => {
                const n = lang === "th" ? item.name_th : item.name_en;
                return (
                  <button
                    key={item.id}
                    className="compare-dropdown-item"
                    onMouseDown={() => { onSelect(item); setOpen(false); onQuery(""); }}
                  >
                    <img src={item.image} alt={n} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</div>
                      {item.scientific_name && (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>{item.scientific_name}</div>
                      )}
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: "0.75rem", background: "var(--primary-light)", color: "var(--primary-hover)", padding: "2px 8px", borderRadius: 20, flexShrink: 0 }}>
                      {item.type === "animal" ? "🐾" : "🌿"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Compare Table ───
function CompareTable({ a, b, lang, t }: { a: Species; b: Species; lang: string; t: Record<string, string> }) {
  const nameA = lang === "th" ? a.name_th : a.name_en;
  const nameB = lang === "th" ? b.name_th : b.name_en;
  const descA = (lang === "th" ? a.short_description : a.short_description_en) || a.short_description;
  const descB = (lang === "th" ? b.short_description : b.short_description_en) || b.short_description;

  type Row = { label: string; valA: string | null; valB: string | null };
  const rows: Row[] = [
    { label: t.typeLabel, valA: a.type === "animal" ? t.animal : t.plant, valB: b.type === "animal" ? t.animal : t.plant },
    { label: t.sciName, valA: a.scientific_name || t.none, valB: b.scientific_name || t.none },
    { label: t.available, valA: a.available !== false ? t.yes : t.no, valB: b.available !== false ? t.yes : t.no },
    { label: t.tags, valA: a.tags?.join(", ") || t.none, valB: b.tags?.join(", ") || t.none },
    { label: t.desc, valA: descA, valB: descB },
  ];

  return (
    <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Image header */}
      <div className="compare-img-header">
        <div className="compare-img-cell" style={{ borderRight: "1px solid var(--border-color)" }}>
          <div className="compare-img-wrap">
            <img src={a.image} alt={nameA} className="compare-hero-img" />
            <div className="compare-img-label" style={{ background: "var(--primary)" }}>{nameA}</div>
          </div>
          <Link to={`/species/${a.type}/${a.id}`} className="btn-primary" style={{ padding: "10px 22px", borderRadius: 30, fontSize: "0.88rem", margin: "16px auto", display: "block", width: "fit-content" }}>
            {t.viewDetail}
          </Link>
        </div>
        <div className="compare-img-cell compare-vs-center">
          <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-muted)" }}>VS</div>
        </div>
        <div className="compare-img-cell" style={{ borderLeft: "1px solid var(--border-color)" }}>
          <div className="compare-img-wrap">
            <img src={b.image} alt={nameB} className="compare-hero-img" />
            <div className="compare-img-label" style={{ background: "#f59e0b" }}>{nameB}</div>
          </div>
          <Link to={`/species/${b.type}/${b.id}`} className="btn-primary" style={{ padding: "10px 22px", borderRadius: 30, fontSize: "0.88rem", margin: "16px auto", display: "block", width: "fit-content", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
            {t.viewDetail}
          </Link>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => {
        const same = row.valA === row.valB;
        return (
          <div key={i} className={`compare-row${i % 2 === 0 ? "" : " compare-row-alt"}`}>
            <div className="compare-row-label">{row.label}</div>
            <div className={`compare-row-val${same ? " same" : " diff"}`}>{row.valA}</div>
            <div className="compare-row-badge">
              <span className={`compare-badge ${same ? "same" : "diff"}`}>
                {same ? t.sameLabel : t.diffLabel}
              </span>
            </div>
            <div className={`compare-row-val${same ? " same" : " diff"}`}>{row.valB}</div>
          </div>
        );
      })}
    </div>
  );
}
