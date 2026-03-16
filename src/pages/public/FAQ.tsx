import { useState } from "react";
import { Link } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";

export default function FAQ() {
  const { lang } = useSettingsStore();
  const [open, setOpen] = useState<number | null>(null);

  const t = {
    tag:      lang === "th" ? "คำถามที่พบบ่อย" : "FAQ",
    title:    lang === "th" ? "คำถามที่พบบ่อย" : "Frequently Asked Questions",
    subtitle: lang === "th" ? "รวบรวมคำตอบสำหรับคำถามที่ผู้เยี่ยมชมถามบ่อย" : "Answers to the most common questions from our visitors",
    breadHome: lang === "th" ? "หน้าแรก" : "Home",
    ctaTitle: lang === "th" ? "ยังมีคำถามอีก?" : "Still have questions?",
    ctaDesc:  lang === "th" ? "ติดต่อเราได้โดยตรง ทีมงานยินดีตอบทุกคำถาม" : "Contact us directly — our team is happy to answer.",
    ctaBtn:   lang === "th" ? "ติดต่อเรา" : "Contact Us",
    faqs: [
      {
        q: lang === "th" ? "ฟาร์มอุดมทองเปิดให้เข้าชมได้ทุกวันไหม?" : "Is Udomtong Farm open every day?",
        a: lang === "th"
          ? "ฟาร์มเปิดให้เข้าชมได้ทุกวัน ตั้งแต่ 08:00 – 17:00 น. แต่กรุณานัดหมายล่วงหน้าก่อนเดินทางมาเพื่อให้เราเตรียมการต้อนรับอย่างดีที่สุด"
          : "The farm is open daily from 08:00 – 17:00. However, please book an appointment in advance so we can prepare a proper welcome for you.",
      },
      {
        q: lang === "th" ? "มีค่าเข้าชมไหม?" : "Is there an admission fee?",
        a: lang === "th"
          ? "ปัจจุบันเปิดให้เข้าชมโดยไม่มีค่าใช้จ่าย สำหรับผู้ที่สนใจซื้อหรือนัดชมสายพันธุ์โดยเฉพาะ กรุณาติดต่อสอบถามราคาล่วงหน้า"
          : "Currently, visits are free of charge. For those interested in purchasing or viewing specific species, please contact us for pricing in advance.",
      },
      {
        q: lang === "th" ? "สามารถซื้อสัตว์หรือพืชจากฟาร์มได้ไหม?" : "Can I purchase animals or plants from the farm?",
        a: lang === "th"
          ? "ใช่ ฟาร์มมีสายพันธุ์ที่พร้อมจำหน่าย กรุณาติดต่อสอบถามรายละเอียดและราคาโดยตรงผ่านช่องทางติดต่อของเรา เราจะแจ้งข้อมูลให้ครบถ้วน"
          : "Yes, the farm has species available for sale. Please contact us directly for details and pricing through our contact channels.",
      },
      {
        q: lang === "th" ? "ฟาร์มอยู่ที่ไหนในชัยภูมิ?" : "Where exactly is the farm in Chaiyaphum?",
        a: lang === "th"
          ? "ฟาร์มตั้งอยู่ในจังหวัดชัยภูมิ สามารถดูแผนที่และเส้นทางการเดินทางได้ในหน้าแผนที่ หรือติดต่อเราเพื่อรับข้อมูลที่ตั้งที่ชัดเจน"
          : "The farm is located in Chaiyaphum province. Visit our Map page for directions, or contact us for the exact location.",
      },
      {
        q: lang === "th" ? "สามารถพานักเรียน/กลุ่มมาเรียนรู้ได้ไหม?" : "Can I bring students or groups for educational visits?",
        a: lang === "th"
          ? "ยินดีต้อนรับกลุ่มนักเรียนและผู้สนใจด้านธรรมชาติ กรุณาติดต่อล่วงหน้าเพื่อนัดหมายและจัดโปรแกรมการเรียนรู้ที่เหมาะสม"
          : "We warmly welcome student groups and nature enthusiasts. Please contact us in advance to schedule and arrange an appropriate learning program.",
      },
      {
        q: lang === "th" ? "ข้อมูลในสารานุกรมมาจากไหน?" : "Where does the encyclopedia data come from?",
        a: lang === "th"
          ? "ข้อมูลสายพันธุ์ในสารานุกรมรวบรวมจากการดูแลจริงในฟาร์ม ร่วมกับข้อมูลทางวิทยาศาสตร์จากแหล่งอ้างอิงที่เชื่อถือได้ เราอัปเดตข้อมูลอย่างสม่ำเสมอ"
          : "The species data is compiled from actual farm care experience combined with scientific data from trusted references. We update it regularly.",
      },
      {
        q: lang === "th" ? "สมัครสมาชิกมีประโยชน์อะไร?" : "What are the benefits of registering an account?",
        a: lang === "th"
          ? "สมาชิกสามารถบันทึกสายพันธุ์ที่สนใจลงใน Wishlist รับการแจ้งเตือนเมื่อมีสายพันธุ์ใหม่ และเข้าถึงฟีเจอร์พิเศษในอนาคต"
          : "Members can save species to their Wishlist, receive notifications when new species are added, and access special features in the future.",
      },
    ],
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
        <div className="fade-in-up" style={{ fontSize: "3.5rem", marginBottom: 16 }}>🙋</div>
        <h1 className="fade-in-up" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--primary-hover)", margin: "0 0 12px" }}>
          {t.title}
        </h1>
        <p className="fade-in-up" style={{ color: "var(--text-muted)", fontSize: "1.05rem", animationDelay: "0.15s", maxWidth: 500, margin: "0 auto" }}>
          {t.subtitle}
        </p>
      </header>

      {/* FAQ Accordion */}
      <div style={{ maxWidth: 800, margin: "0 auto 60px", padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {t.faqs.map((faq, i) => (
            <div
              key={i}
              className="glass-card"
              style={{ border: open === i ? "1.5px solid var(--primary)" : "1px solid var(--border-color)", overflow: "hidden", transition: "border-color 0.25s" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", padding: "20px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                  background: "none", border: "none", cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                  background: open === i ? "var(--primary)" : "var(--primary-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.25s",
                }}>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={open === i ? "#fff" : "var(--primary-hover)"}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </span>
              </button>

              {open === i && (
                <div style={{ padding: "0 24px 20px", animation: "fadeIn 0.2s ease" }}>
                  <div style={{ height: 1, background: "var(--border-color)", marginBottom: 16 }} />
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.8, margin: 0, fontSize: "0.97rem" }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ background: "var(--gradient-primary)", borderRadius: 28, padding: "48px 40px", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>💬</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 900, margin: "0 0 10px" }}>{t.ctaTitle}</h2>
          <p style={{ opacity: 0.85, margin: "0 0 24px", fontSize: "1rem" }}>{t.ctaDesc}</p>
          <Link to="/contact" style={{ display: "inline-block", padding: "13px 32px", borderRadius: 40, background: "#fff", color: "var(--primary-hover)", fontWeight: 800, textDecoration: "none", fontSize: "0.97rem" }}>
            {t.ctaBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
