import { Link } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";

export default function MapPage() {
  const { lang } = useSettingsStore();

  const t = {
    tag:      lang === "th" ? "แผนที่และเส้นทาง" : "Map & Directions",
    title:    lang === "th" ? "วิธีเดินทางมาฟาร์ม" : "How to Get Here",
    subtitle: lang === "th" ? "ฟาร์มอุดมทอง ตำบลห้วยบง อำเภอเมืองชัยภูมิ" : "Udomtong Farm, Huay Bong, Mueang Chaiyaphum",
    address:  lang === "th" ? "ที่อยู่" : "Address",
    addressVal: lang === "th" ? "ตำบลห้วยบง อำเภอเมืองชัยภูมิ ชัยภูมิ 36000" : "Huay Bong, Mueang Chaiyaphum, Chaiyaphum 36000",
    phone:    lang === "th" ? "โทรศัพท์" : "Phone",
    phoneVal: "086-xxx-xxxx",
    hours:    lang === "th" ? "เวลาเปิด-ปิด" : "Opening Hours",
    hoursVal: lang === "th" ? "ทุกวัน 08:00 – 17:00 น. (นัดหมายล่วงหน้า)" : "Daily 08:00 – 17:00 (by appointment)",
    howTitle: lang === "th" ? "วิธีเดินทาง" : "Getting There",
    routes: [
      {
        icon: "🚗",
        title: lang === "th" ? "รถยนต์ส่วนตัว" : "By Car",
        desc: lang === "th"
          ? "จากกรุงเทพฯ ใช้ทางหลวงหมายเลข 2 (มิตรภาพ) ไปยังโคราช แล้วต่อทางหลวงหมายเลข 201 มุ่งหน้าชัยภูมิ ระยะทางรวมประมาณ 340 กม. ใช้เวลาประมาณ 4-5 ชั่วโมง"
          : "From Bangkok, take Highway 2 (Mittraphap) to Nakhon Ratchasima, then Highway 201 toward Chaiyaphum. Total approx. 340 km, about 4-5 hours.",
      },
      {
        icon: "🚌",
        title: lang === "th" ? "รถโดยสารประจำทาง" : "By Bus",
        desc: lang === "th"
          ? "มีรถโดยสารตรงจากสถานีขนส่งหมอชิตไปจังหวัดชัยภูมิ ใช้เวลาประมาณ 4-5 ชั่วโมง ติดต่อสอบถามเส้นทางเพิ่มเติมได้ทางโทรศัพท์"
          : "Direct buses from Mo Chit (Northern Bus Terminal) to Chaiyaphum, approx. 4-5 hours. Contact us for detailed directions.",
      },
      {
        icon: "🚂",
        title: lang === "th" ? "รถไฟ" : "By Train",
        desc: lang === "th"
          ? "ขึ้นรถไฟที่สถานีกรุงเทพ (หัวลำโพง) ไปยังสถานีบัวใหญ่หรือนครราชสีมา จากนั้นต่อรถโดยสารหรือรถเช่าไปจังหวัดชัยภูมิ ระยะทางจากโคราชถึงชัยภูมิประมาณ 100 กม."
          : "Take a train from Bangkok (Hua Lamphong) to Bua Yai or Nakhon Ratchasima, then a bus or hired car to Chaiyaphum (approx. 100 km from Korat).",
      },
    ],
    note:     lang === "th" ? "* กรุณานัดหมายล่วงหน้าก่อนเดินทางมาเยี่ยมชมฟาร์ม" : "* Please make an appointment before visiting the farm.",
    contactBtn: lang === "th" ? "ติดต่อนัดหมาย" : "Book a Visit",
    breadHome:  lang === "th" ? "หน้าแรก" : "Home",
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <header style={{
        padding: "80px 24px 56px", textAlign: "center",
        background: "linear-gradient(180deg, var(--primary-light) 0%, var(--bg-color) 100%)",
        borderRadius: "0 0 50px 50px", marginBottom: 56,
      }}>
        <nav className="breadcrumb" style={{ justifyContent: "center", marginBottom: 24 }}>
          <Link to="/">{t.breadHome}</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{t.tag}</span>
        </nav>
        <div className="fade-in-up" style={{ fontSize: "3.5rem", marginBottom: 16 }}>📍</div>
        <h1 className="fade-in-up" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--primary-hover)", margin: "0 0 12px" }}>
          {t.title}
        </h1>
        <p className="fade-in-up" style={{ color: "var(--text-muted)", fontSize: "1.05rem", animationDelay: "0.15s" }}>
          {t.subtitle}
        </p>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, marginBottom: 48 }}>

          {/* Google Maps embed */}
          <div className="glass-card" style={{ padding: 0, overflow: "hidden", borderRadius: 24, minHeight: 400 }}>
            <iframe
              title="Udomtong Farm Map"
              src="https://maps.google.com/maps?q=R537%2BR9M+%E0%B8%AB%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%9A%E0%B8%87+%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4+%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4&t=&z=17&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "📍", label: t.address, value: t.addressVal },
              { icon: "📞", label: t.phone,   value: t.phoneVal   },
              { icon: "🕐", label: t.hours,   value: t.hoursVal   },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: "24px 24px", display: "flex", gap: 16, alignItems: "flex-start", border: "1px solid var(--border-color)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary-hover)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.97rem", lineHeight: 1.5 }}>{item.value}</div>
                </div>
              </div>
            ))}
            <Link to="/contact" className="btn-primary" style={{ padding: "14px 24px", borderRadius: 16, textDecoration: "none", fontWeight: 700, textAlign: "center", display: "block" }}>
              {t.contactBtn}
            </Link>
          </div>
        </div>

        {/* How to get there */}
        <section>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "var(--text-main)", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
            {t.howTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 24 }}>
            {t.routes.map((r, i) => (
              <div key={i} className="glass-card" style={{ padding: "28px 24px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: 14 }}>{r.icon}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)", margin: "0 0 10px" }}>{r.title}</h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: 0, fontSize: "0.93rem" }}>{r.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--primary-hover)", fontWeight: 700, fontSize: "0.95rem", padding: "14px 20px", background: "var(--primary-light)", borderRadius: 12, margin: 0 }}>
            {t.note}
          </p>
        </section>
      </div>
    </div>
  );
}
