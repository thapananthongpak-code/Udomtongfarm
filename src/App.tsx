import { useEffect, useRef, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { useAuth } from "./store/AuthContext";
import { useSettingsStore } from "./store/settingsStore";

const GREETING_KEY = "uf_show_greeting";

function getTimeGreeting(lang: string) {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return {
    emoji: "☀️",
    text: lang === "th" ? "สวัสดีตอนเช้า" : "Good Morning",
    sub:  lang === "th" ? "ขอให้วันนี้เป็นวันที่ดี" : "Have a wonderful day!",
  };
  if (h >= 12 && h < 17) return {
    emoji: "🌤️",
    text: lang === "th" ? "สวัสดีตอนบ่าย" : "Good Afternoon",
    sub:  lang === "th" ? "ยินดีต้อนรับสู่ฟาร์มอุดมทอง" : "Welcome to Udomtong Farm",
  };
  if (h >= 17 && h < 21) return {
    emoji: "🌅",
    text: lang === "th" ? "สวัสดีตอนเย็น" : "Good Evening",
    sub:  lang === "th" ? "แวะมาชมสายพันธุ์สวยๆ กัน" : "Explore our beautiful species",
  };
  return {
    emoji: "🌙",
    text: lang === "th" ? "สวัสดีตอนดึก" : "Good Night",
    sub:  lang === "th" ? "ขอบคุณที่แวะมาเยี่ยมเยียน" : "Thanks for visiting us",
  };
}

function LoginGreeting() {
  const { user } = useAuth();
  const { lang } = useSettingsStore();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  function dismiss() {
    setExiting(true);
    setTimeout(() => setVisible(false), 400);
  }

  useEffect(() => {
    if (!sessionStorage.getItem(GREETING_KEY)) return;
    sessionStorage.removeItem(GREETING_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    const t = setTimeout(() => dismiss(), 3500);
    return () => clearTimeout(t);
  }, []);

  if (!visible || !user) return null;

  const g = getTimeGreeting(lang);
  const name = user.nickname || user.name || "User";
  const isUrl   = typeof user.avatar === "string" && user.avatar.startsWith("http");
  const isEmoji = typeof user.avatar === "string" && !user.avatar.startsWith("http") && user.avatar.trim().length > 0;

  return (
    <div className={`lgo-overlay${exiting ? " lgo-exit" : ""}`} onClick={dismiss}>
      <div className="lgo-card" onClick={(e) => e.stopPropagation()}>
        <div className="lgo-avatar">
          {isUrl
            ? <img src={user.avatar} alt={name} className="lgo-avatar-img" />
            : isEmoji
            ? <span className="lgo-avatar-emoji">{user.avatar}</span>
            : <span className="lgo-avatar-initial">{name.charAt(0).toUpperCase()}</span>
          }
        </div>
        <div className="lgo-greeting">{g.emoji} {g.text}</div>
        <div className="lgo-name">
          {lang === "th" ? "ยินดีต้อนรับ, " : "Welcome, "}
          <strong>{name}</strong>
        </div>
        <div className="lgo-sub">{g.sub}</div>
      </div>
    </div>
  );
}

function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ring    = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const mouse   = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const raf     = useRef(0);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hoverable = el?.closest("a, button, [role='button'], label, select, input, textarea, [tabindex]");
      dotRef.current?.classList.toggle("is-hover",  !!hoverable);
      ringRef.current?.classList.toggle("is-hover", !!hoverable);
    }

    function animate() {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top  = `${ring.current.y}px`;
      }
      raf.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

export default function App() {
  const [splash, setSplash] = useState(() => !sessionStorage.getItem("uf_splash_seen"));

  useEffect(() => {
    if (!splash) return;
    sessionStorage.setItem("uf_splash_seen", "1");
    const timer = setTimeout(() => setSplash(false), 1700);
    return () => clearTimeout(timer);
  }, [splash]);

  if (splash) return <SplashScreen />;
  return (
    <>
      <CustomCursor />
      <RouterProvider router={router} />
      <LoginGreeting />
    </>
  );
}

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-content fade-in-up">
        <div className="splash-icon">🌿</div>
        <div className="splash-title">Udomtong Farm</div>
        <div className="splash-sub">Nature Encyclopedia</div>
        <div className="spinner" style={{ marginTop: 28 }} />
      </div>
    </div>
  );
}
