import { useRef, useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import FounderCard from "../../components/FounderCard";

const MAP_URL     = "https://maps.app.goo.gl/wZU3hkUTgYLfEhK38";
const PHONE       = "0811733620";
const PHONE_DISPLAY = "081-173-3620";
const FACEBOOK_URL  = "https://www.facebook.com/Udomtongfarm";
const EMAIL         = "farmudomtong@gmail.com";

// Google Maps embed — search-based (no API key needed)
const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=%E0%B8%9F%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A1%E0%B8%97%E0%B8%AD%E0%B8%87+%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%AA%E0%B8%B5%E0%B8%A1%E0%B8%B2&t=&z=14&ie=UTF8&iwloc=&output=embed";

export default function Contact() {
  const { lang } = useSettingsStore();

  const t = {
    title:       lang === "th" ? "ติดต่อเรา" : "Contact Us",
    subtitle:    lang === "th"
      ? "ยินดีรับทุกคำถาม ข้อเสนอแนะ หรือการประสานงานเยี่ยมชมฟาร์ม"
      : "We welcome questions, suggestions, and farm visit arrangements.",
    phoneLabel:     lang === "th" ? "เบอร์ติดต่อ" : "Phone",
    phoneNote:      lang === "th" ? "โทรได้ทุกวัน 08:00 – 18:00 น." : "Available daily 08:00 – 18:00",
    facebookLabel:  lang === "th" ? "Facebook Page" : "Facebook Page",
    facebookNote:   lang === "th" ? "ติดตามข่าวสารและอัปเดตล่าสุด" : "Follow for latest news and updates",
    facebookBtn:    lang === "th" ? "เปิด Facebook" : "Open Facebook",
    emailLabel:     lang === "th" ? "อีเมล" : "Email",
    emailNote:      lang === "th" ? "ส่งอีเมลได้ตลอด 24 ชั่วโมง" : "Send email anytime, 24 hours",
    locationLabel:  lang === "th" ? "ที่ตั้งฟาร์ม" : "Farm Location",
    locationText:   lang === "th" ? "ฟาร์มอุดมทอง จ.นครราชสีมา" : "Udomtong Farm, Nakhon Ratchasima",
    openMap:        lang === "th" ? "เปิดใน Google Maps" : "Open in Google Maps",
    howToReach:     lang === "th" ? "วิธีการเดินทาง" : "How to Reach Us",
    directions:     lang === "th"
      ? "สามารถเดินทางมาได้ด้วยรถยนต์ส่วนตัว กรุณาติดต่อล่วงหน้าเพื่อนัดหมาย"
      : "Best reached by private vehicle. Please contact us in advance to schedule a visit.",
  };

  return (
    <div className="fade-in-up" style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px 100px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px",
          background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IconLeaf size={36} />
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "var(--text-main)", margin: 0 }}>
          {t.title}
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 12, fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 560, margin: "12px auto 0" }}>
          {t.subtitle}
        </p>
      </div>

      {/* Contact cards — 2×2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>

        {/* Phone */}
        <ContactCard
          icon={<IconPhone />}
          label={t.phoneLabel}
          note={t.phoneNote}
          delay={0}
        >
          <a href={`tel:${PHONE}`} style={{
            fontSize: "1.9rem", fontWeight: 900, color: "var(--primary-hover)",
            textDecoration: "none", letterSpacing: 1, display: "flex", alignItems: "center", gap: 8,
          }}>
            {PHONE_DISPLAY}
          </a>
        </ContactCard>

        {/* Email */}
        <ContactCard
          icon={<IconMail />}
          label={t.emailLabel}
          note={t.emailNote}
          delay={0.1}
        >
          <a href={`mailto:${EMAIL}`} style={{
            fontSize: "1.05rem", fontWeight: 800, color: "var(--primary-hover)",
            textDecoration: "none", wordBreak: "break-all",
          }}>
            {EMAIL}
          </a>
        </ContactCard>

        {/* Facebook */}
        <ContactCard
          icon={<IconFacebook />}
          label={t.facebookLabel}
          note={t.facebookNote}
          delay={0.2}
        >
          <div style={{ fontWeight: 800, color: "var(--text-main)", marginBottom: 12, fontSize: "0.95rem" }}>
            facebook.com/Udomtongfarm
          </div>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "10px 20px", borderRadius: 12, fontSize: "0.9rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content" }}
          >
            <IconFacebook size={16} color="#fff" /> {t.facebookBtn}
          </a>
        </ContactCard>

        {/* Location */}
        <ContactCard
          icon={<IconMapPin />}
          label={t.locationLabel}
          note={lang === "th" ? "คลิกเพื่อดูเส้นทางใน Google Maps" : "Click to open directions in Google Maps"}
          delay={0.3}
        >
          <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 12, fontSize: "1rem" }}>
            {t.locationText}
          </div>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "10px 20px", borderRadius: 12, fontSize: "0.9rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content" }}
          >
            <IconMapPin size={16} color="#fff" /> {t.openMap}
          </a>
        </ContactCard>

      </div>

      {/* Embedded Google Map */}
      <RevealDiv style={{ marginBottom: 32, borderRadius: 20, overflow: "hidden", border: "2px solid var(--border-color)", boxShadow: "var(--shadow-md)" }}>
        <div style={{ position: "relative" }}>
          <iframe
            title="Udomtong Farm Map"
            src={MAP_EMBED_SRC}
            width="100%"
            height="340"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* overlay link to open in Maps */}
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute", bottom: 12, right: 12,
              background: "var(--primary)", color: "#fff",
              padding: "8px 16px", borderRadius: 12,
              fontWeight: 700, fontSize: "0.85rem", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "var(--shadow-md)",
            }}
          >
            <IconMapPin size={14} color="#fff" /> {t.openMap}
          </a>
        </div>
      </RevealDiv>

      {/* Founder profile */}
      <FounderCard variant="full" />

      {/* How to reach */}
      <RevealDiv>
        <div className="glass-card" style={{ padding: 28, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: "var(--primary-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconLeaf size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-main)", marginBottom: 6 }}>{t.howToReach}</div>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.95rem" }}>{t.directions}</div>
          </div>
        </div>
      </RevealDiv>
    </div>
  );
}

// ─── Reusable contact card ───
function ContactCard({ icon, label, note, children, delay }: { icon: React.ReactNode; label: string; note: string; children: React.ReactNode; delay: number }) {
  return (
    <RevealDiv delay={delay}>
      <div className="glass-card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "var(--primary-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {icon}
          </div>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)" }}>{label}</div>
        </div>
        {children}
        <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "auto" }}>{note}</div>
      </div>
    </RevealDiv>
  );
}

// ─── Scroll-reveal wrapper ───
function RevealDiv({ children, style, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}s`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className="scroll-reveal" style={style}>{children}</div>;
}

// ─── SVG Icons ───
function IconLeaf({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
}
function IconPhone({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function IconMail({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function IconFacebook({ size = 20, color }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "var(--primary-hover)"}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function IconMapPin({ size = 20, color }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "var(--primary-hover)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
