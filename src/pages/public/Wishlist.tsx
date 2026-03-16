import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";

const FAVORITES_KEY = "uf_favorites";
function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); } catch { return []; }
}

export default function Wishlist() {
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore();
  const [favorites, setFavorites] = useState<string[]>(getFavorites);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const toggleFav = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const savedItems = useMemo(() =>
    items.filter(x => favorites.includes(x.id)),
    [items, favorites]
  );

  const t = {
    tag:      lang === "th" ? "รายการที่บันทึก" : "Wishlist",
    title:    lang === "th" ? "รายการที่คุณบันทึกไว้" : "Your Saved Species",
    subtitle: lang === "th" ? "สายพันธุ์ที่คุณกดหัวใจไว้ทั้งหมด" : "All species you've saved with a heart",
    empty:    lang === "th" ? "ยังไม่มีรายการที่บันทึก" : "No saved species yet",
    emptySub: lang === "th" ? "กดไอคอนหัวใจ ❤️ ในสารานุกรมเพื่อบันทึกสายพันธุ์" : "Tap the ❤️ icon in the encyclopedia to save species",
    goExplore:lang === "th" ? "เปิดสารานุกรม" : "Browse Encyclopedia",
    remove:   lang === "th" ? "นำออก" : "Remove",
    view:     lang === "th" ? "ดูรายละเอียด →" : "View Details →",
    count:    lang === "th" ? `${savedItems.length} รายการที่บันทึก` : `${savedItems.length} saved`,
    breadHome: lang === "th" ? "หน้าแรก" : "Home",
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <header style={{
        padding: "80px 24px 56px", textAlign: "center",
        background: "linear-gradient(180deg, #fff1f2 0%, var(--bg-color) 100%)",
        borderRadius: "0 0 50px 50px", marginBottom: 48,
      }}>
        <nav className="breadcrumb" style={{ justifyContent: "center", marginBottom: 24 }}>
          <Link to="/">{t.breadHome}</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{t.tag}</span>
        </nav>
        <div className="fade-in-up" style={{ fontSize: "3.5rem", marginBottom: 16 }}>❤️</div>
        <h1 className="fade-in-up" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--text-main)", margin: "0 0 12px" }}>
          {t.title}
        </h1>
        <p className="fade-in-up" style={{ color: "var(--text-muted)", fontSize: "1.05rem", animationDelay: "0.15s" }}>
          {t.subtitle}
        </p>
        {savedItems.length > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "6px 18px", borderRadius: 40, background: "#fee2e2", color: "#b91c1c", fontWeight: 700, fontSize: "0.9rem" }}>
            ❤️ {t.count}
          </span>
        )}
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        {loading && savedItems.length === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card skeleton" style={{ height: 300 }} />
            ))}
          </div>
        ) : savedItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "5rem", marginBottom: 20 }}>🤍</div>
            <h3 style={{ color: "var(--text-main)", fontSize: "1.4rem", fontWeight: 800, margin: "0 0 10px" }}>{t.empty}</h3>
            <p style={{ color: "var(--text-muted)", margin: "0 0 32px", fontSize: "1rem" }}>{t.emptySub}</p>
            <Link to="/encyclopedia" className="btn-primary" style={{ padding: "14px 32px", borderRadius: 40, textDecoration: "none", fontWeight: 700 }}>
              {t.goExplore}
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {savedItems.map((sp, i) => {
              const name = lang === "th" ? sp.name_th : sp.name_en;
              const desc = lang === "th" ? sp.short_description : sp.short_description_en || sp.short_description;
              return (
                <div key={sp.id} className="glass-card fade-in-up" style={{ padding: 0, overflow: "hidden", animationDelay: `${i * 0.06}s`, position: "relative" }}>
                  {/* Remove button */}
                  <button
                    onClick={() => toggleFav(sp.id)}
                    style={{
                      position: "absolute", top: 10, right: 10, zIndex: 2,
                      width: 34, height: 34, borderRadius: "50%",
                      background: "#fee2e2", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "background 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fca5a5")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#fee2e2")}
                    title={t.remove}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                  <div style={{ height: 180, overflow: "hidden" }}>
                    <img src={sp.image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ padding: "20px 20px 24px" }}>
                    <span style={{ background: sp.type === "animal" ? "var(--primary-light)" : "#fef3c7", color: sp.type === "animal" ? "var(--primary-hover)" : "#d97706", padding: "3px 10px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 800 }}>
                      {sp.type === "animal" ? "🐾" : "🌿"} {sp.type === "animal" ? (lang === "th" ? "สัตว์" : "Animal") : (lang === "th" ? "พืช" : "Plant")}
                    </span>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)", margin: "10px 0 6px", lineHeight: 1.3 }}>{name}</h3>
                    {sp.scientific_name && (
                      <p style={{ fontSize: "0.8rem", fontStyle: "italic", color: "var(--text-muted)", margin: "0 0 8px" }}>{sp.scientific_name}</p>
                    )}
                    {desc && (
                      <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.5, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{desc}</p>
                    )}
                    <Link to={`/species/${sp.type}/${sp.id}`} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 24, textDecoration: "none", fontSize: "0.88rem", fontWeight: 700 }}>
                      {t.view}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
