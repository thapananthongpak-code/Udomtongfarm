import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useGalleryStore } from "../../store/galleryStore";
import type { Species, SpeciesType } from "../../types/species";

type FilterTab = "all" | SpeciesType | "other";

export default function Gallery() {
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore();
  const customItems = useGalleryStore((s) => s.items);
  const [tab, setTab] = useState<FilterTab>("all");
  const [lightbox, setLightbox] = useState<Species | null>(null);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const t = {
    tag:      lang === "th" ? "อัลบั้มภาพ" : "Gallery",
    title:    lang === "th" ? "แกลเลอรีฟาร์มอุดมทอง" : "Udomtong Farm Gallery",
    subtitle: lang === "th" ? "ชมภาพความสวยงามของสิ่งมีชีวิตในฟาร์มของเรา" : "Explore the beauty of species in our farm",
    all:      lang === "th" ? "ทั้งหมด" : "All",
    animals:  lang === "th" ? "สัตว์" : "Animals",
    plants:   lang === "th" ? "พืช" : "Plants",
    other:    lang === "th" ? "ทั่วไป" : "General",
    viewMore: lang === "th" ? "ดูรายละเอียด →" : "View Details →",
    close:    lang === "th" ? "ปิด" : "Close",
    breadHome: lang === "th" ? "หน้าแรก" : "Home",
    empty:    lang === "th" ? "ยังไม่มีภาพในหมวดนี้" : "No images in this category yet.",
  };

  // Merge species + custom gallery into one list for display
  type GridItem =
    | { kind: "species"; data: Species }
    | { kind: "custom"; data: import("../../store/galleryStore").GalleryItem };

  const allGridItems = useMemo<GridItem[]>(() => [
    ...items.map(d => ({ kind: "species" as const, data: d })),
    ...customItems.map(d => ({ kind: "custom" as const, data: d })),
  ], [items, customItems]);

  const filtered = useMemo<GridItem[]>(() => {
    if (tab === "all") return allGridItems;
    if (tab === "other") return allGridItems.filter(x => x.kind === "custom" && x.data.category === "other");
    return allGridItems.filter(x =>
      (x.kind === "species" && x.data.type === tab) ||
      (x.kind === "custom" && x.data.category === tab)
    );
  }, [allGridItems, tab]);

  const counts = useMemo(() => ({
    all: allGridItems.length,
    animal: allGridItems.filter(x => (x.kind === "species" && x.data.type === "animal") || (x.kind === "custom" && x.data.category === "animal")).length,
    plant:  allGridItems.filter(x => (x.kind === "species" && x.data.type === "plant")  || (x.kind === "custom" && x.data.category === "plant")).length,
    other:  customItems.filter(x => x.category === "other").length,
  }), [allGridItems, customItems]);

  const lb = lightbox;
  const lbName = lb ? (lang === "th" ? lb.name_th : lb.name_en) : "";
  const lbDesc = lb ? (lang === "th" ? lb.short_description : lb.short_description_en || lb.short_description) : "";

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <header style={{
        padding: "80px 24px 56px", textAlign: "center",
        background: "linear-gradient(180deg, var(--primary-light) 0%, var(--bg-color) 100%)",
        borderRadius: "0 0 50px 50px", marginBottom: 48,
      }}>
        <nav className="breadcrumb" style={{ justifyContent: "center", marginBottom: 24 }}>
          <Link to="/">{t.breadHome}</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{t.tag}</span>
        </nav>
        <h1 className="fade-in-up" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, color: "var(--primary-hover)", margin: "0 0 16px" }}>
          {t.title}
        </h1>
        <p className="fade-in-up" style={{ color: "var(--text-muted)", fontSize: "1.05rem", animationDelay: "0.15s", maxWidth: 500, margin: "0 auto" }}>
          {t.subtitle}
        </p>
      </header>

      {/* Filter tabs */}
      <div style={{ maxWidth: 900, margin: "0 auto 40px", padding: "0 24px", display: "flex", gap: 10, flexWrap: "wrap" }}>
        {([
          { f: "all",    label: t.all,     icon: "🖼️" },
          { f: "animal", label: t.animals, icon: "🐾" },
          { f: "plant",  label: t.plants,  icon: "🌿" },
          ...(counts.other > 0 ? [{ f: "other", label: t.other, icon: "📷" }] : []),
        ] as { f: FilterTab; label: string; icon: string }[]).map(({ f, label, icon }) => {
          const count = counts[f === "all" ? "all" : f === "animal" ? "animal" : f === "plant" ? "plant" : "other"];
          return (
            <button key={f} onClick={() => setTab(f)} style={{
              padding: "10px 22px", borderRadius: 14,
              border: tab === f ? "1.5px solid var(--primary)" : "1.5px solid var(--border-color)",
              background: tab === f ? "var(--primary)" : "var(--card-bg)",
              color: tab === f ? "#fff" : "var(--text-main)",
              fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s",
            }}>
              {icon} {label}
              <span style={{ background: tab === f ? "rgba(255,255,255,0.2)" : "var(--primary-light)", color: tab === f ? "#fff" : "var(--primary-hover)", padding: "2px 8px", borderRadius: 6, fontSize: "0.8rem" }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
        {loading ? (
          <div className="gallery-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton gallery-img-wrap" style={{ borderRadius: 16 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🖼️</div>
            <p style={{ fontSize: "1.05rem" }}>{t.empty}</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filtered.map((item, i) => {
              if (item.kind === "species") {
                const sp = item.data;
                const name = lang === "th" ? sp.name_th : sp.name_en;
                return (
                  <div key={`sp-${sp.id}`} className="gallery-img-wrap fade-in-up"
                    style={{ animationDelay: `${(i % 12) * 0.04}s` }}
                    onClick={() => setLightbox(sp)}>
                    <img src={sp.image} alt={name} className="gallery-img" loading="lazy" />
                    <div className="gallery-overlay">
                      <span className="gallery-overlay-type">
                        {sp.type === "animal" ? "🐾" : "🌿"} {sp.type === "animal" ? (lang === "th" ? "สัตว์" : "Animal") : (lang === "th" ? "พืช" : "Plant")}
                      </span>
                      <span className="gallery-overlay-name">{name}</span>
                      {sp.scientific_name && <span className="gallery-overlay-sci">{sp.scientific_name}</span>}
                    </div>
                  </div>
                );
              } else {
                const ci = item.data;
                const name = lang === "th" ? ci.titleTh : ci.titleEn;
                const catIcon = ci.category === "animal" ? "🐾" : ci.category === "plant" ? "🌿" : "📷";
                const catLabel = ci.category === "animal" ? (lang === "th" ? "สัตว์" : "Animal") : ci.category === "plant" ? (lang === "th" ? "พืช" : "Plant") : (lang === "th" ? "ทั่วไป" : "General");
                return (
                  <div key={`ci-${ci.id}`} className="gallery-img-wrap fade-in-up"
                    style={{ animationDelay: `${(i % 12) * 0.04}s` }}>
                    <img src={ci.image} alt={name} className="gallery-img" loading="lazy" />
                    <div className="gallery-overlay">
                      <span className="gallery-overlay-type">{catIcon} {catLabel}</span>
                      <span className="gallery-overlay-name">{name}</span>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lb && (
        <div
          className="gallery-lightbox"
          onClick={() => setLightbox(null)}
        >
          <button className="gallery-lb-close" onClick={() => setLightbox(null)} aria-label="Close">
            <IconX />
          </button>
          <div className="gallery-lb-card" onClick={e => e.stopPropagation()}>
            <img src={lb.image} alt={lbName} className="gallery-lb-img" />
            <div className="gallery-lb-info">
              <span style={{ background: lb.type === "animal" ? "var(--primary-light)" : "#fef3c7", color: lb.type === "animal" ? "var(--primary-hover)" : "#d97706", padding: "4px 12px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 800, display: "inline-block", marginBottom: 12 }}>
                {lb.type === "animal" ? "🐾 " : "🌿 "}
                {lb.type === "animal" ? (lang === "th" ? "สัตว์" : "Animal") : (lang === "th" ? "พืช" : "Plant")}
              </span>
              <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "var(--text-main)", margin: "0 0 6px" }}>{lbName}</h2>
              {lb.scientific_name && (
                <p style={{ fontSize: "1rem", fontStyle: "italic", color: "var(--text-muted)", margin: "0 0 12px" }}>{lb.scientific_name}</p>
              )}
              {lbDesc && (
                <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.95rem", margin: "0 0 20px" }}>{lbDesc}</p>
              )}
              <Link
                to={`/species/${lb.type}/${lb.id}`}
                className="btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 40, textDecoration: "none", fontWeight: 700 }}
                onClick={() => setLightbox(null)}
              >
                {t.viewMore}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconX() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
