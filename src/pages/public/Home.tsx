import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSpeciesStore } from "../../store/speciesStore";
import { useSettingsStore } from "../../store/settingsStore"; // 🟢 ดึงระบบตั้งค่ามาใช้
import type { Species } from "../../types/species";
import FounderCard from "../../components/FounderCard";

export default function Home() {
  const { items, fetchAll, loading } = useSpeciesStore();
  const { lang } = useSettingsStore(); // 🟢 ใช้ภาษาจาก Store
  const [randomItems, setRandomItems] = useState<Species[]>([]);

  // 🟢 1. โหลดข้อมูลจาก Database ทันที
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 🟢 2. สุ่มสัตว์/พืช 10 ชนิดสำหรับทำขบวนพาเหรด (Carousel)
  useEffect(() => {
    if (items.length > 0) {
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      setRandomItems(shuffled.slice(0, 10));
    }
  }, [items]);

  // 🟢 3. คำนวณสถิติ (ใช้ useMemo เพื่อความเร็ว)
  const stats = useMemo(() => {
    const animals = items.filter((x) => x.type === "animal").length;
    const plants = items.filter((x) => x.type === "plant").length;
    return { total: items.length, animals, plants };
  }, [items]);

  // 🟢 4. สุ่ม spotlight 3 ตัวสำหรับหน้าประชาสัมพันธ์
  const spotlight = useMemo(() => {
    if (items.length === 0) return [];
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [items]);

  // 🟢 5. พจนานุกรมแปลภาษาหน้า Home
  const t = {
    title: lang === "th" ? "Udomtong Farm" : "Udomtong Farm",
    welcome: lang === "th" ? "ยินดีต้อนรับสู่ระบบจัดการสารานุกรม" : "Welcome to the Encyclopedia System",
    subtitle: lang === "th" ? "ค้นพบข้อมูลและเรียนรู้วิธีการดูแลสิ่งมีชีวิตหลากหลายสายพันธุ์ในที่เดียว" : "Discover and learn how to care for various species in one place.",
    btnExplore: lang === "th" ? "เปิดดูสารานุกรม 🔍" : "Open Encyclopedia 🔍",
    statAnimal: lang === "th" ? "สัตว์ทั้งหมด" : "Total Animals",
    statPlant: lang === "th" ? "พืชทั้งหมด" : "Total Plants",
    statTotal: lang === "th" ? "ข้อมูลรวม" : "Total Data",
    unitSpecies: lang === "th" ? "ชนิด" : "Species",
    unitItems: lang === "th" ? "รายการ" : "Items",
    suggested: lang === "th" ? "🌱 สายพันธุ์แนะนำวันนี้" : "🌱 Today's Highlights",
    // Services section
    servicesTitle: lang === "th" ? "บริการของเรา" : "Our Services",
    svc1Title: lang === "th" ? "จำหน่ายสัตว์และพืช" : "Animals & Plants for Sale",
    svc1Desc: lang === "th" ? "คัดสายพันธุ์คุณภาพ หายาก และน่าสนใจ พร้อมให้ท่านเป็นเจ้าของ" : "Rare and quality species carefully selected, ready to find their new home.",
    svc1Btn: lang === "th" ? "ดูสายพันธุ์ทั้งหมด" : "Browse All Species",
    svc2Title: lang === "th" ? "เยี่ยมชมฟาร์ม" : "Farm Visit",
    svc2Desc: lang === "th" ? "สัมผัสบรรยากาศธรรมชาติ ชมสิ่งมีชีวิตในที่จริง เหมาะสำหรับทุกวัย" : "Immerse yourself in nature and see rare species up close — suitable for all ages.",
    svc2Btn: lang === "th" ? "นัดหมายเยี่ยมชม" : "Arrange a Visit",
    svc3Title: lang === "th" ? "ร้านอาหาร (เร็วๆ นี้)" : "Restaurant (Coming Soon)",
    svc3Desc: lang === "th" ? "เตรียมเปิดร้านอาหารในบรรยากาศฟาร์มธรรมชาติ ติดตามการอัปเดตเร็วๆ นี้" : "A farm-to-table dining experience in a natural setting — stay tuned for updates.",
    svc3Btn: lang === "th" ? "ติดตามข่าวสาร" : "Stay Updated",
    // Announcement section
    announceTitle: lang === "th" ? "ข่าวสารและประชาสัมพันธ์" : "News & Announcements",
    announceNew: lang === "th" ? "ใหม่" : "NEW",
    announceLabel: lang === "th" ? "พร้อมจำหน่าย" : "Available Now",
    announceDesc: lang === "th" ? "สนใจสอบถามราคาหรือนัดชม กรุณาติดต่อเรา" : "Interested in pricing or a viewing? Contact us.",
    announceContact: lang === "th" ? "ติดต่อสอบถาม" : "Contact Us",
    announceMore: lang === "th" ? "ดูทั้งหมดในสารานุกรม" : "View All in Encyclopedia",
  };

  return (
    <div style={{ paddingBottom: "100px", overflowX: "hidden" }}>
      
      {/* 🚀 ส่วนหัวข้อ Hero (ขาว-เขียวมินิมอล) */}
      <section style={{ 
        padding: "100px 24px 60px 24px", 
        textAlign: "center",
        background: "linear-gradient(180deg, var(--primary-light) 0%, var(--bg-color) 100%)",
        borderRadius: "0 0 60px 60px",
        marginBottom: "40px"
      }}>
        <h1 className="fade-in-up" style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 900, marginBottom: 16, color: "var(--primary-hover)" }}>
          {t.title}
        </h1>
        <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--text-main)", fontWeight: 600 }}>{t.welcome}</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: 700, margin: "16px auto 40px auto", lineHeight: 1.8 }}>
            {t.subtitle}
          </p>
        </div>

        <div className="fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Link to="/encyclopedia" className="btn-primary" style={{ padding: "18px 40px", fontSize: "1.2rem", borderRadius: 20 }}>
            {t.btnExplore}
          </Link>
        </div>
      </section>

      {/* 📊 ส่วนแสดงสถิติ (ใช้ Glass Card & Dynamic Color) */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: 24, 
        maxWidth: 1100, 
        margin: "0 auto 80px auto",
        padding: "0 20px"
      }}>
        <StatCard title={t.statAnimal} value={loading ? "..." : stats.animals} unit={t.unitSpecies} icon="🐾" delay="0.5s" />
        <StatCard title={t.statPlant} value={loading ? "..." : stats.plants} unit={t.unitSpecies} icon="🌿" delay="0.6s" />
        <StatCard title={t.statTotal} value={loading ? "..." : stats.total} unit={t.unitItems} icon="📊" delay="0.7s" />
      </div>

      {/* 🛒 บริการของเรา */}
      <div style={{ maxWidth: 1100, margin: "0 auto 80px auto", padding: "0 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: 900, color: "var(--text-main)", marginBottom: 36 }}>
          {t.servicesTitle}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>

          {/* ขายสัตว์/พืช */}
          <div className="glass-card fade-in-up" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 40 }}>🐾</div>
            <div style={{ fontWeight: 900, fontSize: "1.15rem", color: "var(--text-main)" }}>{t.svc1Title}</div>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.93rem", flex: 1 }}>{t.svc1Desc}</div>
            <Link to="/encyclopedia" style={{
              display: "inline-block", padding: "11px 20px", borderRadius: 12,
              background: "var(--primary)", color: "#fff", fontWeight: 700,
              textDecoration: "none", fontSize: "0.9rem", textAlign: "center",
            }}>{t.svc1Btn}</Link>
          </div>

          {/* เยี่ยมชมฟาร์ม */}
          <div className="glass-card fade-in-up" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 40 }}>🌿</div>
            <div style={{ fontWeight: 900, fontSize: "1.15rem", color: "var(--text-main)" }}>{t.svc2Title}</div>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.93rem", flex: 1 }}>{t.svc2Desc}</div>
            <Link to="/contact" style={{
              display: "inline-block", padding: "11px 20px", borderRadius: 12,
              background: "var(--primary)", color: "#fff", fontWeight: 700,
              textDecoration: "none", fontSize: "0.9rem", textAlign: "center",
            }}>{t.svc2Btn}</Link>
          </div>

          {/* ร้านอาหาร - Coming Soon */}
          <div className="glass-card fade-in-up" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16, opacity: 0.75 }}>
            <div style={{ fontSize: 40 }}>🍽️</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 900, fontSize: "1.15rem", color: "var(--text-main)" }}>{t.svc3Title}</div>
            </div>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.93rem", flex: 1 }}>{t.svc3Desc}</div>
            <Link to="/contact" style={{
              display: "inline-block", padding: "11px 20px", borderRadius: 12,
              border: "1.5px dashed var(--border-color)", color: "var(--text-muted)",
              fontWeight: 700, textDecoration: "none", fontSize: "0.9rem", textAlign: "center",
              background: "transparent",
            }}>{t.svc3Btn}</Link>
          </div>
        </div>
      </div>

      {/* 📢 ข่าวสารและประชาสัมพันธ์ */}
      <div style={{ maxWidth: 1100, margin: "0 auto 80px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text-main)", margin: 0 }}>
            {t.announceTitle}
          </h2>
          <Link to="/encyclopedia" style={{ color: "var(--primary-hover)", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}>
            {t.announceMore} →
          </Link>
        </div>

        {spotlight.length === 0 ? null : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {spotlight.map((item) => (
              <Link
                key={item.id}
                to={`/species/${item.type}/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="glass-card"
                  style={{ overflow: "hidden", padding: 0, transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.12))"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  {/* Image */}
                  <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
                    <img src={item.image} alt={item.name_th} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {/* NEW badge */}
                    <div style={{
                      position: "absolute", top: 12, left: 12,
                      background: "var(--primary)", color: "#fff",
                      padding: "3px 10px", borderRadius: 20,
                      fontSize: "0.72rem", fontWeight: 800, letterSpacing: 1,
                    }}>
                      {t.announceNew}
                    </div>
                    {/* Type badge */}
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: "rgba(0,0,0,0.45)", color: "#fff",
                      padding: "3px 10px", borderRadius: 20,
                      fontSize: "0.72rem", fontWeight: 700,
                    }}>
                      {item.type === "animal" ? "🐾" : "🌿"} {lang === "th" ? (item.type === "animal" ? "สัตว์" : "พืช") : (item.type === "animal" ? "Animal" : "Plant")}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ fontWeight: 900, fontSize: "1.05rem", color: "var(--text-main)", marginBottom: 4 }}>
                      {lang === "th" ? item.name_th : item.name_en}
                    </div>
                    {item.scientific_name && (
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: 10 }}>
                        {item.scientific_name}
                      </div>
                    )}
                    <div style={{
                      display: "inline-block", padding: "4px 12px", borderRadius: 20,
                      background: "var(--primary-light)", color: "var(--primary-hover)",
                      fontSize: "0.78rem", fontWeight: 700,
                    }}>
                      {t.announceLabel}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA strip */}
        <div style={{
          marginTop: 24, padding: "20px 28px", borderRadius: 16,
          background: "var(--primary-light)", border: "1.5px solid var(--border-color)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.95rem" }}>
            📞 {t.announceDesc}
          </div>
          <Link to="/contact" style={{
            padding: "10px 24px", borderRadius: 12,
            background: "var(--primary)", color: "#fff",
            fontWeight: 700, textDecoration: "none", fontSize: "0.9rem",
          }}>
            {t.announceContact} →
          </Link>
        </div>
      </div>

      {/* 🌿 ส่วนเชิญชวนมาเยี่ยมชมฟาร์ม / Founder invite strip */}
      <div style={{ maxWidth: 1100, margin: "0 auto 80px auto", padding: "0 20px" }}>
        <FounderCard variant="compact" />
      </div>

      {/* 🎢 ขบวนพาเหรดเลื่อนอัตโนมัติ (Infinite Carousel) */}
      <div className="fade-in-up" style={{ animationDelay: "0.8s" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "1.8rem" }}>{t.suggested}</h2>
        
        <div className="carousel-container">
          <div className="carousel-track">
            {/* เบิ้ลชุดข้อมูลเพื่อให้เลื่อนวนลูป */}
            {[...randomItems, ...randomItems].map((item, idx) => (
              <Link 
                to={`/species/${item.type}/${item.id}`} 
                key={`${item.id}-${idx}`} 
                className="glass-card" 
                style={{ display: "block", minWidth: 280, padding: 16, textDecoration: "none" }}
              >
                <div style={{ width: "100%", height: 180, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                  <img src={item.image} alt="" className="hover-zoom-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary-hover)", marginBottom: 4 }}>
                  {item.type === "animal" ? (lang === "th" ? "🐾 สัตว์" : "🐾 ANIMAL") : (lang === "th" ? "🌿 พืช" : "🌿 PLANT")}
                </div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--text-main)" }}>
                  {lang === "th" ? item.name_th : item.name_en}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

// Component บัตรสถิติ พร้อม count-up animation
function StatCard({ title, value, unit, icon, delay }: { title: string; value: any; unit: string; icon: string; delay: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = typeof value === "number" ? value : 0;
    if (target === 0) { setDisplay(0); return; }
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else { setDisplay(Math.floor(start)); }
    }, step);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="glass-card fade-in-up" style={{
      padding: 30,
      textAlign: "center",
      animationDelay: delay,
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{icon}</div>
      <div style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
        {title}
      </div>
      <div className="stat-number" style={{ fontSize: 48, fontWeight: 900, color: "var(--text-main)" }}>
        {typeof value === "number" ? display : value}{" "}
        <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-muted)" }}>{unit}</span>
      </div>
      <div style={{
        position: "absolute", bottom: -10, right: -10, fontSize: "5rem", opacity: 0.05, transform: "rotate(-15deg)"
      }}>{icon}</div>
    </div>
  );
}