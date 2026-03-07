import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore"; // 🟢 ดึงระบบตั้งค่ามาใช้

export default function SpeciesPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { lang } = useSettingsStore(); // 🟢 ใช้ภาษาจาก Store

  // 🟢 ดึงรายการทั้งหมดจาก Store เพื่อหาข้อมูลที่ตรงกับ id ใน URL
  const { items, fetchAll, loading } = useSpeciesStore();
  
  // ให้โหลดข้อมูลถ้าเข้ามาหน้านี้โดยตรงแล้ว Store ยังว่างอยู่
  useEffect(() => {
    if (items.length === 0) fetchAll();
  }, [items.length, fetchAll]);

  const item = items.find((x) => x.id === id && x.type === type);

  // 🟢 พจนานุกรมแปลภาษา
  const t = {
    back: lang === "th" ? "← กลับหน้าสารานุกรม" : "← Back to Encyclopedia",
    notFound: lang === "th" ? "ไม่พบข้อมูล" : "Not Found",
    notFoundDesc: lang === "th" ? `ขออภัย ไม่พบข้อมูลสิ่งมีชีวิตที่คุณต้องการ (ID: ${id})` : `Sorry, the requested species was not found (ID: ${id})`,
    loading: lang === "th" ? "กำลังโหลดข้อมูล..." : "Loading data...",
    typeAnimal: lang === "th" ? "สัตว์" : "Animal",
    typePlant: lang === "th" ? "พืช" : "Plant",
    sciName: lang === "th" ? "ชื่อวิทยาศาสตร์:" : "Scientific Name:",
    desc: lang === "th" ? "รายละเอียด" : "Description",
    ref: lang === "th" ? "แหล่งข้อมูลอ้างอิง" : "References",
    tags: lang === "th" ? "ป้ายกำกับ" : "Tags",
  };

  if (loading) {
    return (
      <div style={{ padding: "100px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: "1.2rem" }}>
        {t.loading}
      </div>
    );
  }

  if (!item) {
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

  return (
    <div className="fade-in-up" style={{ paddingBottom: "100px" }}>
      
      {/* 🌿 Hero Image Section (ภาพหน้าปกแบบเต็มตา) */}
      <div style={{ position: "relative", width: "100%", height: "50vh", minHeight: "400px", maxHeight: "600px", backgroundColor: "var(--card-bg)" }}>
        <img
          src={item.image}
          alt={item.name_en}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
        {/* Gradient Overlay เพื่อให้ตัวหนังสือด้านล่างอ่านง่ายขึ้น */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg-color) 0%, transparent 50%)" }} />
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px", position: "relative", top: "-80px" }}>
        
        {/* 🔙 ปุ่มกลับ */}
        <button 
          onClick={() => navigate("/encyclopedia")}
          style={{ 
            background: "var(--card-bg)", color: "var(--text-main)", border: "1px solid var(--border-color)", 
            padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: 700, 
            marginBottom: "20px", display: "inline-block", boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
        >
          {t.back}
        </button>

        {/* 📇 Header Card (ส่วนหัวข้อหลัก) */}
        <div className="glass-card" style={{ padding: "40px", marginBottom: "40px", position: "relative", overflow: "hidden" }}>
          
          <span style={{ 
            background: item.type === 'animal' ? 'var(--primary-light)' : '#fef3c7', 
            color: item.type === 'animal' ? 'var(--primary-hover)' : '#d97706',
            padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
            display: "inline-block", marginBottom: "16px"
          }}>
            {item.type === 'animal' ? `🐾 ${t.typeAnimal}` : `🌿 ${t.typePlant}`}
          </span>
          
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, margin: "0 0 8px 0", color: "var(--text-main)", lineHeight: 1.2 }}>
            {lang === "th" ? item.name_th : item.name_en}
          </h1>
          
          <div style={{ fontSize: "1.5rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "20px" }}>
            {lang === "th" ? item.name_en : item.name_th}
          </div>

          {item.scientific_name && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "var(--bg-color)", padding: "8px 16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 700 }}>{t.sciName}</span>
              <span style={{ fontStyle: "italic", color: "var(--text-main)", fontSize: "1.1rem" }}>{item.scientific_name}</span>
            </div>
          )}
          
          {/* ลายน้ำบางๆ ตกแต่งหลังการ์ด */}
          <div style={{ position: "absolute", top: -20, right: -20, fontSize: "10rem", opacity: 0.03, transform: "rotate(15deg)", pointerEvents: "none" }}>
            {item.type === 'animal' ? '🐾' : '🌿'}
          </div>
        </div>

        {/* 📖 เนื้อหาหลัก */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px", alignItems: "start" }}>
          
          {/* ซ้าย: คำอธิบาย */}
          <div className="glass-card" style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "1.8rem", marginTop: 0, marginBottom: "24px", color: "var(--primary-hover)", display: "flex", alignItems: "center", gap: "10px" }}>
              📖 {t.desc}
            </h2>
            <div style={{ 
              lineHeight: 1.8, fontSize: "1.1rem", color: "var(--text-main)", whiteSpace: "pre-wrap" 
            }}>
              {(lang === "en" ? item.description_en : item.description) || (lang === "th" ? "ไม่มีข้อมูลคำอธิบาย" : "No description available.")}
            </div>
          </div>

          {/* ขวา: แถบข้อมูลเสริม (Sidebar) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "1.2rem", color: "var(--text-main)" }}>🏷️ {t.tags}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {item.tags.map((tag, idx) => (
                    <span key={idx} style={{ 
                      background: "var(--bg-color)", color: "var(--text-muted)", border: "1px solid var(--border-color)",
                      padding: "6px 12px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600 
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            {item.references && item.references.length > 0 && (
              <div className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "1.2rem", color: "var(--text-main)" }}>🔗 {t.ref}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {item.references.map((r, idx) => (
                    <a 
                      key={idx} 
                      href={r.url} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ 
                        display: "flex", alignItems: "center", gap: "8px", color: "var(--primary-hover)", 
                        textDecoration: "none", fontWeight: 600, fontSize: "0.95rem", padding: "8px", 
                        borderRadius: "8px", transition: "background 0.2s" 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-light)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span>🌐</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}