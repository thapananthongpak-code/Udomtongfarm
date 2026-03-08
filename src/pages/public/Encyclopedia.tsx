import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore"; // 🟢 ดึงระบบตั้งค่ามาใช้
import type { Species, SpeciesType } from "../../types/species";

type FilterTab = "all" | SpeciesType;

export default function Encyclopedia() {
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore(); // 🟢 ใช้ภาษาจาก Store

  const [tab, setTab] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");

  // 🟢 1. สั่งให้โหลดข้อมูลจาก Database ทันทีที่เปิดหน้าเว็บ
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 🟢 2. พจนานุกรมแปลภาษาสำหรับหน้านี้
  const t = {
    title: lang === "th" ? "สารานุกรมธรรมชาติ" : "Full Encyclopedia",
    subtitle: lang === "th" ? "สำรวจและเรียนรู้ความหลากหลายของสิ่งมีชีวิตในฟาร์มของเรา" : "Explore and learn about the diversity of life in our farm.",
    searchPlaceholder: lang === "th" ? 'ค้นหา เช่น "หงส์", "สักทอง", "Cygnus"...' : 'Search e.g. "Swan", "Teak", "Cygnus"...',
    all: lang === "th" ? "ทั้งหมด" : "All",
    animals: lang === "th" ? "สัตว์" : "Animals",
    plants: lang === "th" ? "พืช" : "Plants",
    showing: lang === "th" ? "กำลังแสดง" : "Showing",
    unit: lang === "th" ? "รายการ" : "items",
    loading: lang === "th" ? "กำลังดึงข้อมูลจากฟาร์ม... 🌿" : "Fetching farm data... 🌿",
    noResult: lang === "th" ? "ไม่พบข้อมูลที่คุณค้นหา" : "No results found.",
    readMore: lang === "th" ? "อ่านข้อมูล" : "Details",
  };

  // 🟢 3. นับจำนวนจาก store (ไม่ hardcode)
  const counts = useMemo(() => {
    const animalCount = items.filter((x) => x.type === "animal").length;
    const plantCount = items.filter((x) => x.type === "plant").length;
    return {
      all: items.length,
      animal: animalCount,
      plant: plantCount,
    };
  }, [items]);

  // 🟢 4. ระบบกรองข้อมูล (Filter & Search)
  const filteredSpecies = useMemo(() => {
    let list: Species[] = items;

    if (tab !== "all") {
      list = list.filter((x) => x.type === tab);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((x) => {
        const th = x.name_th?.toLowerCase() ?? "";
        const en = x.name_en?.toLowerCase() ?? "";
        const sci = x.scientific_name?.toLowerCase() ?? "";
        return th.includes(q) || en.includes(q) || sci.includes(q);
      });
    }

    // Sort A-Z ตามชื่ออังกฤษ
    return [...list].sort((a, b) => (a.name_en || "").localeCompare(b.name_en || ""));
  }, [items, tab, query]);

  return (
    <div style={{ paddingBottom: "100px" }}>
      
      {/* 🌿 Header Section */}
      <header style={{ 
        padding: "80px 24px 40px 24px", 
        textAlign: "center",
        background: "linear-gradient(180deg, var(--primary-light) 0%, var(--bg-color) 100%)",
        borderRadius: "0 0 50px 50px",
        marginBottom: "40px"
      }}>
        <h1 className="fade-in-up" style={{ fontSize: "3.5rem", fontWeight: 900, color: "var(--primary-hover)", marginBottom: "16px" }}>
          {t.title}
        </h1>
        <p className="fade-in-up" style={{ color: "var(--text-muted)", fontSize: "1.1rem", animationDelay: "0.2s" }}>
          {t.subtitle}
        </p>
      </header>

      {/* 🔍 Search & Filter Bar (Glass UI) */}
      <div className="fade-in-up" style={{ maxWidth: "1000px", margin: "0 auto 50px auto", padding: "0 20px", animationDelay: "0.4s" }}>
        <div className="glass-card" style={{ 
          padding: "24px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "20px" 
        }}>
          {/* ช่องค้นหา */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}>🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              style={{
                width: "100%",
                padding: "14px 14px 14px 45px",
                borderRadius: "14px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-color)",
                color: "var(--text-main)",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* ปุ่มตัวกรอง (Pills) */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <FilterPill active={tab === "all"} onClick={() => setTab("all")} label={t.all} count={counts.all} />
            <FilterPill active={tab === "animal"} onClick={() => setTab("animal")} label={t.animals} count={counts.animal} />
            <FilterPill active={tab === "plant"} onClick={() => setTab("plant")} label={t.plants} count={counts.plant} />
          </div>
        </div>
      </div>

      {/* 🎴 Grid แสดงรายการ */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: "20px", color: "var(--text-muted)", fontWeight: 600 }}>
          {t.showing} {filteredSpecies.length} {t.unit}
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
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: "24px" 
          }}>
            {filteredSpecies.map((sp, idx) => (
              <Link 
                to={`/species/${sp.type}/${sp.id}`} 
                key={`${sp.type}-${sp.id}`}
                className="glass-card fade-in-up"
                style={{ 
                  padding: "16px", 
                  textDecoration: "none",
                  animationDelay: `${0.1 * (idx % 8)}s` // 🟢 ค่อยๆ เด้งขึ้นมาทีละใบ
                }}
              >
                <div style={{ width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
                  <img src={sp.image} alt="" className="hover-zoom-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                
                <span style={{ 
                  background: sp.type === "animal" ? "var(--primary-light)" : "#fef3c7", 
                  color: sp.type === "animal" ? "var(--primary-hover)" : "#d97706", 
                  padding: "4px 10px", 
                  borderRadius: "8px", 
                  fontSize: "0.75rem", 
                  fontWeight: 800 
                }}>
                  {sp.type === "animal" ? `🐾 ${t.animals}` : `🌿 ${t.plants}`}
                </span>

                <h3 style={{ marginTop: "12px", marginBottom: "4px", fontSize: "1.3rem", color: "var(--text-main)" }}>
                  {lang === "th" ? sp.name_th : sp.name_en}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic", marginBottom: "16px" }}>
                  {sp.scientific_name}
                </p>

                <div style={{ textAlign: "right", color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.9rem" }}>
                  {t.readMore} →
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* กรณีค้นหาไม่เจอ */}
        {!loading && filteredSpecies.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔭</div>
            <h3>{t.noResult}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

// 🟢 Component ย่อยสำหรับปุ่มตัวกรอง
function FilterPill({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: "12px",
        border: active ? "1px solid var(--primary)" : "1px solid var(--border-color)",
        background: active ? "var(--primary)" : "var(--card-bg)",
        color: active ? "#fff" : "var(--text-main)",
        cursor: "pointer",
        fontSize: "0.95rem",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s ease"
      }}
    >
      {label}
      <span style={{ 
        background: active ? "rgba(255,255,255,0.2)" : "var(--primary-light)", 
        color: active ? "#fff" : "var(--primary-hover)",
        padding: "2px 8px", 
        borderRadius: "6px", 
        fontSize: "0.8rem" 
      }}>
        {count}
      </span>
    </button>
  );
}