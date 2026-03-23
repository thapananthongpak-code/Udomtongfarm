import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";
import { useCartStore } from "../../store/cartStore";
import { API_BASE } from "../../config/api";
import { Leaf as LeafIcon, Mail, Eye, EyeOff } from "lucide-react";

function getTimeGreeting(lang: string) {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { emoji: "☀️", text: lang === "th" ? "สวัสดีตอนเช้า" : "Good Morning" };
  if (h >= 12 && h < 17) return { emoji: "🌤️", text: lang === "th" ? "สวัสดีตอนบ่าย" : "Good Afternoon" };
  if (h >= 17 && h < 21) return { emoji: "🌅", text: lang === "th" ? "สวัสดีตอนเย็น" : "Good Evening" };
  return { emoji: "🌙", text: lang === "th" ? "สวัสดีตอนดึก" : "Good Night" };
}

export default function Login() {
  const navigate  = useNavigate();
  const { lang }  = useSettingsStore();

  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [showPass,      setShowPass]      = useState(false);
  const [rememberMe,    setRememberMe]    = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [errorField,    setErrorField]    = useState<"email" | "password" | "both" | "">("");
  const [verifyMsg,     setVerifyMsg]     = useState("");
  // Pre-fill remembered email
  useEffect(() => {
    localStorage.removeItem("saved_password");
    const saved = localStorage.getItem("saved_email");
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  /** Restore this account's cart + last path, then navigate */
  function handleLoginSuccess(user: { email: string; role: string }) {
    useCartStore.getState().switchUserCart(user.email);
    const savedPath = localStorage.getItem(`uf_last_path_${user.email}`);
    const dest = user.role === "admin" ? "/admin" : (savedPath || "/encyclopedia");
    navigate(dest, { replace: true });
  }

  // ─── Email/Password login ───
  async function onSubmitEmail(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setErrorField(""); setVerifyMsg("");
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res  = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (res.ok) {
        if (rememberMe) { localStorage.setItem("saved_email", email.trim()); }
        else            { localStorage.removeItem("saved_email"); }
        const cache  = JSON.parse(localStorage.getItem(`uf_profile_${data.user.email}`) || "{}");
        const merged = {
          ...data.user,
          avatar:    data.user.avatar    || cache.avatar,
          nickname:  data.user.nickname  ?? cache.nickname,
          phone:     data.user.phone     ?? cache.phone,
          birthDate: data.user.birthDate ?? cache.birthDate,
        };
        sessionStorage.setItem("user", JSON.stringify(merged));
        window.dispatchEvent(new Event("auth-change"));
        handleLoginSuccess(merged);
      } else if (res.status === 403) {
        setVerifyMsg(lang === "th"
          ? "กรุณายืนยันอีเมลก่อน — ตรวจสอบกล่องจดหมาย (รวมถึงโฟลเดอร์ Spam)"
          : "Please verify your email first — check your inbox (including Spam folder).");
        setErrorField("email");
      } else {
        setError(data.error || (lang === "th" ? "เข้าสู่ระบบไม่สำเร็จ" : "Login failed"));
        setErrorField(data.field || "");
      }
    } catch (err: unknown) {
      clearTimeout(timeout);
      const isTimeout = err instanceof Error && err.name === "AbortError";
      setError(isTimeout
        ? (lang === "th" ? "เซิร์ฟเวอร์ตอบสนองช้าเกินไป กรุณาลองใหม่อีกครั้ง" : "Server is taking too long. Please try again.")
        : (lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่" : "Cannot connect to server. Please try again.")
      );
    } finally { setLoading(false); }
  }

  const t = {
    title:        lang === "th" ? "เข้าสู่ระบบ"                  : "Login",
    desc:         lang === "th" ? "ยินดีต้อนรับกลับสู่ Udomtong Farm" : "Welcome back to Udomtong Farm",
    emailLabel:   lang === "th" ? "อีเมล"                         : "Email Address",
    passLabel:    lang === "th" ? "รหัสผ่าน"                      : "Password",
    forgotPass:   lang === "th" ? "ลืมรหัสผ่าน?"                  : "Forgot Password?",
    rememberMe:   lang === "th" ? "จดจำอีเมล"                     : "Remember my email",
    btnLogin:     lang === "th" ? "เข้าสู่ระบบ"                  : "Login",
    btnLoading:   lang === "th" ? "กำลังเข้าสู่ระบบ..."           : "Logging in...",
    noAccount:    lang === "th" ? "ยังไม่มีบัญชีใช่ไหม?"          : "Don't have an account?",
    registerLink: lang === "th" ? "สมัครสมาชิก"                   : "Register here",
  };

  const greeting = getTimeGreeting(lang);

  return (
    <div className="auth-container">
      <div className="auth-blob blob-1" />
      <div className="auth-blob blob-2" />

      <div className="auth-card auth-card-hover fade-in-up">
        {/* Time-based greeting banner */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          marginBottom: 20, padding: "8px 16px", borderRadius: 24,
          background: "var(--primary-light)", border: "1px solid var(--border-color)",
          fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-hover)",
        }}>
          <span style={{ fontSize: "1.1rem" }}>{greeting.emoji}</span>
          <span>{greeting.text}</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: "0 auto 14px",
            background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LeafIcon size={32} color="var(--primary-hover)" />
          </div>
          <h1 style={{ fontSize: "2.2rem", margin: 0, fontWeight: 900, color: "var(--text-main)" }}>{t.title}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: "0.95rem" }}>{t.desc}</p>
        </div>

        {/* Email form */}
        <form onSubmit={onSubmitEmail} style={{ display: "grid", gap: 18 }}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 700, color: "var(--text-main)", fontSize: "0.93rem" }}>{t.emailLabel}</div>
            <input
              value={email} onChange={e => { setEmail(e.target.value); setErrorField(""); setError(""); }}
              placeholder="name@email.com" type="email" required
              className="auth-input"
              style={(errorField === "email" || errorField === "both") ? { borderColor: "#dc2626", boxShadow: "0 0 0 2px #fee2e2" } : {}}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.93rem" }}>{t.passLabel}</span>
              <Link to="/forgot" style={{ color: "var(--primary-hover)", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none" }}>{t.forgotPass}</Link>
            </div>
            <div className="input-password-wrap">
              <input
                value={password} onChange={e => { setPassword(e.target.value); setErrorField(""); setError(""); }}
                placeholder="••••••••" type={showPass ? "text" : "password"} required
                className="auth-input"
                style={(errorField === "password" || errorField === "both") ? { borderColor: "#dc2626", boxShadow: "0 0 0 2px #fee2e2" } : {}}
              />
              <button type="button" className="btn-eye" onClick={() => setShowPass(v => !v)} tabIndex={-1} aria-label={showPass ? "Hide password" : "Show password"}>
                {showPass ? <EyeOff color="var(--text-muted)" /> : <Eye color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "var(--primary)" }} />
            <span style={{ fontSize: "0.93rem", fontWeight: 600, color: "var(--text-muted)" }}>{t.rememberMe}</span>
          </label>

          {verifyMsg && (
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: "var(--primary-light)", color: "var(--primary-hover)",
              border: "1px solid var(--border-color)",
              fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <Mail size={18} color="var(--primary-hover)" />
              <span>{verifyMsg}</span>
            </div>
          )}

          {error && <div className="alert-error">{error}</div>}

          <button disabled={loading} className="btn-primary" style={{ padding: "15px", fontSize: "1.05rem", borderRadius: 14, marginTop: 4 }}>
            {loading ? <><span className="spinner" style={{ width: 18, height: 18, marginRight: 8 }} />{t.btnLoading}</> : t.btnLogin}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", color: "var(--text-muted)", fontSize: "0.93rem" }}>
          {t.noAccount}{" "}
          <Link to="/register" style={{ color: "var(--primary-hover)", fontWeight: 800, textDecoration: "none", marginLeft: 4 }}>{t.registerLink}</Link>
        </div>
      </div>
    </div>
  );
}

