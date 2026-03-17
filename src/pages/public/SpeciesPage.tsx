import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore";

// ─── QR Code Modal ───────────────────────────────────────────
function QRModal({ url, onClose, lang }: { url: string; onClose: () => void; lang: string }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=1d402e&bgcolor=ffffff&data=${encodeURIComponent(url)}`;
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)" }}>
            {lang === "th" ? "📱 สแกน QR เปิดหน้านี้" : "📱 Scan QR to open this page"}
          </h3>
          <button onClick={onClose} style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "var(--text-muted)" }}>✕</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <img
            src={qrSrc}
            alt="QR Code"
            width={220}
            height={220}
            style={{ borderRadius: 12, border: "1px solid var(--border-color)", display: "block" }}
          />
        </div>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
          {lang === "th" ? "ใช้กล้องมือถือสแกน QR Code เพื่อเปิดหน้านี้บนโทรศัพท์" : "Use your phone camera to scan and open this page"}
        </p>
      </div>
    </div>
  );
}

const FAVORITES_KEY      = "uf_favorites";
const VIEWS_KEY          = "uf_views";
export const RECENTLY_VIEWED_KEY = "uf_recently_viewed";
const MAX_RECENTLY_VIEWED = 10;

function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); } catch { return []; }
}
function trackView(id: string, type: string) {
  try {
    const raw = JSON.parse(localStorage.getItem(VIEWS_KEY) || "{}");
    raw[id] = (raw[id] || 0) + 1;
    localStorage.setItem(VIEWS_KEY, JSON.stringify(raw));
  } catch { /* ignore */ }
  try {
    const prev: { id: string; type: string }[] = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
    const filtered = prev.filter((x) => x.id !== id);
    filtered.unshift({ id, type });
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(filtered.slice(0, MAX_RECENTLY_VIEWED)));
  } catch { /* ignore */ }
}

type Tab = "info" | "tags" | "refs";

export default function SpeciesPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { lang } = useSettingsStore();
  const { items, fetchAll, loading } = useSpeciesStore();

  useEffect(() => {
    if (items.length === 0) fetchAll();
  }, [items.length, fetchAll]);

  // Track view count + recently viewed when species loads
  useEffect(() => {
    if (id && type) trackView(id, type);
  }, [id, type]);

  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [favorites, setFavorites] = useState<string[]>(getFavorites);
  const [shareCopied, setShareCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const item = items.find((x) => x.id === id && x.type === type);

  const isFav = item ? favorites.includes(item.id) : false;

  const toggleFavorite = useCallback(() => {
    if (!item) return;
    setFavorites(prev => {
      const next = prev.includes(item.id) ? prev.filter(f => f !== item.id) : [...prev, item.id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, [item]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: item?.name_en || "Species", url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url).catch(() => {});
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }, [item]);

  const shareToFacebook = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400");
  }, []);

  const shareToLine = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(item ? (lang === "th" ? item.name_th : item.name_en) || "" : "");
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, "_blank", "width=600,height=500");
  }, [item, lang]);

  const t = {
    back: lang === "th" ? "← กลับหน้าสารานุกรม" : "← Back to Encyclopedia",
    home: lang === "th" ? "หน้าแรก" : "Home",
    encyclopedia: lang === "th" ? "สารานุกรม" : "Encyclopedia",
    notFound: lang === "th" ? "ไม่พบข้อมูล" : "Not Found",
    notFoundDesc: lang === "th" ? `ขออภัย ไม่พบข้อมูลสิ่งมีชีวิตที่คุณต้องการ (ID: ${id})` : `Sorry, the requested species was not found (ID: ${id})`,
    typeAnimal: lang === "th" ? "สัตว์" : "Animal",
    typePlant: lang === "th" ? "พืช" : "Plant",
    sciName: lang === "th" ? "ชื่อวิทยาศาสตร์:" : "Scientific Name:",
    tabInfo: lang === "th" ? "📖 รายละเอียด" : "📖 Info",
    tabTags: lang === "th" ? "🏷️ ป้ายกำกับ" : "🏷️ Tags",
    tabRefs: lang === "th" ? "🔗 อ้างอิง" : "🔗 References",
    noDesc: lang === "th" ? "ไม่มีข้อมูลคำอธิบาย" : "No description available.",
    noTags: lang === "th" ? "ไม่มีป้ายกำกับ" : "No tags.",
    noRefs: lang === "th" ? "ไม่มีแหล่งข้อมูลอ้างอิง" : "No references.",
    share: lang === "th" ? "แชร์" : "Share",
    copied: lang === "th" ? "คัดลอกแล้ว!" : "Copied!",
    save: lang === "th" ? "บันทึก" : "Save",
    saved: lang === "th" ? "บันทึกแล้ว" : "Saved",
    related: lang === "th" ? "สายพันธุ์ที่เกี่ยวข้อง" : "Related Species",
    viewAll: lang === "th" ? "ดูทั้งหมด →" : "View All →",
    compare: lang === "th" ? "เปรียบเทียบ" : "Compare",
  };

  // Related species — must be before early returns (Rules of Hooks)
  const related = useMemo(() => {
    if (!item) return [];
    const filtered = items.filter(x => x.type === item.type && x.id !== item.id);
    // eslint-disable-next-line react-hooks/purity
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [items, item]);

  // ── Skeleton loading ──
  if (loading && items.length === 0) {
    return (
      <div style={{ paddingBottom: "100px" }}>
        <div style={{ position: "relative", width: "100%", height: "50vh", minHeight: "400px" }}>
          <div className="skeleton" style={{ width: "100%", height: "100%", borderRadius: 0 }} />
        </div>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px", position: "relative", top: "-80px" }}>
          <div className="skeleton" style={{ height: 40, width: 180, borderRadius: 12, marginBottom: 20 }} />
          <div className="glass-card" style={{ padding: "40px", marginBottom: "40px" }}>
            <div className="skeleton" style={{ height: 28, width: "30%", borderRadius: 20, marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 56, width: "70%", borderRadius: 12, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 28, width: "50%", borderRadius: 8, marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 44, width: 240, borderRadius: 12 }} />
          </div>
          <div className="glass-card" style={{ padding: "40px" }}>
            <div className="skeleton" style={{ height: 32, width: "40%", borderRadius: 8, marginBottom: 20 }} />
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 18, width: `${90 - i * 10}%`, borderRadius: 8, marginBottom: 12 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !item) {
    return (
      <div className="fade-in-up" style={{ padding: "100px 24px", textAlign: "center" }}>
        <h1 style={{ marginTop: 0, fontSize: "3rem", color: "var(--text-main)" }}>{t.notFound}</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "30px", fontSize: "1.1rem" }}>{t.notFoundDesc}</p>
        <button onClick={() => navigate("/encyclopedia")} className="btn-primary">
          {t.back}
        </button>
      </div>
    );
  }

  if (!item) return null;

  const name = lang === "th" ? item.name_th : item.name_en;
  const altName = lang === "th" ? item.name_en : item.name_th;
  const description = (lang === "en" ? item.description_en : item.description) || t.noDesc;

  return (
    <div className="fade-in-up" style={{ paddingBottom: "100px" }}>

      {/* Hero Image */}
      <div style={{ position: "relative", width: "100%", height: "50vh", minHeight: "400px", maxHeight: "600px", backgroundColor: "var(--card-bg)" }}>
        <img
          src={item.image}
          alt={item.name_en}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg-color) 0%, transparent 50%)" }} />
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px", position: "relative", top: "-80px" }}>

        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">{t.home}</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/encyclopedia">{t.encyclopedia}</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{name}</span>
        </nav>

        {/* Header Card */}
        <div className="glass-card" style={{ padding: "40px", marginBottom: "28px", position: "relative", overflow: "hidden" }}>

          {/* Actions row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{
              background: item.type === "animal" ? "var(--primary-light)" : "#fef3c7",
              color: item.type === "animal" ? "var(--primary-hover)" : "#d97706",
              padding: "6px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 800,
              display: "inline-block",
            }}>
              {item.type === "animal" ? `🐾 ${t.typeAnimal}` : `🌿 ${t.typePlant}`}
            </span>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {/* Copy link */}
              <button onClick={handleShare} className="btn-share">
                <IconShare size={16} />
                {shareCopied ? t.copied : t.share}
              </button>
              {/* QR Code */}
              <button onClick={() => setShowQR(true)} className="btn-share" title="QR Code">
                <IconQR size={16} /> QR
              </button>
              {/* Facebook */}
              <button onClick={shareToFacebook} className="btn-share" style={{ background: "#1877f2", color: "#fff", borderColor: "#1877f2" }}
                title="Share on Facebook">
                <IconFacebook size={16} /> Facebook
              </button>
              {/* LINE */}
              <button onClick={shareToLine} className="btn-share" style={{ background: "#06c755", color: "#fff", borderColor: "#06c755" }}
                title="Share on LINE">
                <IconLine size={16} /> LINE
              </button>
              {/* Compare */}
              <Link
                to={`/compare?a=${item.id}`}
                className="btn-share"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                title="Compare species"
              >
                <IconCompare size={16} /> {t.compare}
              </Link>
              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className={`btn-fav${isFav ? " active" : ""}`}
                style={{ width: "auto", borderRadius: 12, padding: "10px 16px", gap: 8, display: "flex", alignItems: "center" }}
                aria-label="Toggle favorite"
              >
                <IconHeart size={16} filled={isFav} />
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: isFav ? "#f87171" : "var(--text-muted)" }}>
                  {isFav ? t.saved : t.save}
                </span>
              </button>
            </div>
          </div>

          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, margin: "0 0 8px 0", color: "var(--text-main)", lineHeight: 1.2 }}>
            {name}
          </h1>

          <div style={{ fontSize: "1.5rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "20px" }}>
            {altName}
          </div>

          {item.scientific_name && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "var(--bg-color)", padding: "8px 16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 700 }}>{t.sciName}</span>
              <span style={{ fontStyle: "italic", color: "var(--text-main)", fontSize: "1.1rem" }}>{item.scientific_name}</span>
            </div>
          )}

          {/* Watermark */}
          <div style={{ position: "absolute", top: -20, right: -20, fontSize: "10rem", opacity: 0.03, transform: "rotate(15deg)", pointerEvents: "none" }}>
            {item.type === "animal" ? "🐾" : "🌿"}
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card" style={{ padding: "32px", marginBottom: "32px" }}>
          <div className="species-tab-bar">
            <button className={`species-tab-btn${activeTab === "info" ? " active" : ""}`} onClick={() => setActiveTab("info")}>{t.tabInfo}</button>
            {(item.tags && item.tags.length > 0) && (
              <button className={`species-tab-btn${activeTab === "tags" ? " active" : ""}`} onClick={() => setActiveTab("tags")}>{t.tabTags}</button>
            )}
            {(item.references && item.references.length > 0) && (
              <button className={`species-tab-btn${activeTab === "refs" ? " active" : ""}`} onClick={() => setActiveTab("refs")}>{t.tabRefs}</button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === "info" && (
            <div style={{ lineHeight: 1.8, fontSize: "1.1rem", color: "var(--text-main)", whiteSpace: "pre-wrap" }}>
              {description}
            </div>
          )}

          {activeTab === "tags" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {item.tags && item.tags.length > 0 ? item.tags.map((tag, idx) => (
                <span key={idx} style={{
                  background: "var(--bg-color)", color: "var(--text-muted)", border: "1px solid var(--border-color)",
                  padding: "8px 16px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 600
                }}>
                  #{tag}
                </span>
              )) : <p style={{ color: "var(--text-muted)" }}>{t.noTags}</p>}
            </div>
          )}

          {activeTab === "refs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {item.references && item.references.length > 0 ? item.references.map((r, idx) => (
                <a
                  key={idx}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: "10px", color: "var(--primary-hover)",
                    textDecoration: "none", fontWeight: 600, fontSize: "0.95rem", padding: "10px 14px",
                    borderRadius: "10px", transition: "background 0.2s", border: "1px solid var(--border-color)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-light)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <span>🌐</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
                </a>
              )) : <p style={{ color: "var(--text-muted)" }}>{t.noRefs}</p>}
            </div>
          )}
        </div>

        {/* Related Species */}
        {related.length > 0 && (
          <div style={{ marginTop: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900, color: "var(--text-main)" }}>
                {t.related}
              </h2>
              <Link to="/encyclopedia" style={{ color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.9rem" }}>
                {t.viewAll}
              </Link>
            </div>
            <div className="related-species-grid">
              {related.map(rel => {
                const relName = lang === "th" ? rel.name_th : rel.name_en;
                return (
                  <Link
                    key={rel.id}
                    to={`/species/${rel.type}/${rel.id}`}
                    className="glass-card"
                    style={{ padding: "12px", textDecoration: "none", display: "block" }}
                  >
                    <div style={{ width: "100%", height: 130, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
                      <img src={rel.image} alt={relName} className="hover-zoom-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                      {relName}
                    </p>
                    {rel.scientific_name && (
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", fontStyle: "italic", color: "var(--text-muted)" }}>
                        {rel.scientific_name}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* QR Code Modal */}
      {showQR && (
        <QRModal
          url={window.location.href}
          onClose={() => setShowQR(false)}
          lang={lang}
        />
      )}
    </div>
  );
}

// ─── SVG Icons ───
function IconFacebook({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
}
function IconLine({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.627.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>;
}
function IconShare({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
}
function IconHeart({ size = 16, filled = false }: { size?: number; filled?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#f87171" : "none"} stroke={filled ? "#f87171" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function IconQR({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M17 17h4"/><path d="M17 21v-4"/><path d="M14 21h3"/></svg>;
}
function IconCompare({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M9 21H5a2 2 0 0 1-2-2v-4"/><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M15 21h4a2 2 0 0 0 2-2v-4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
}
