import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useSettingsStore } from "../../store/settingsStore";
import { useCartStore } from "../../store/cartStore";
import { API_BASE } from "../../config/api";
import { auth, googleProvider } from "../../config/firebase";
import { LockKeyhole, Leaf as LeafIcon, Mail, Eye, EyeOff } from "lucide-react";

/** Restore cart and return the saved last path for this account */
function restoreAccountState(email: string): string | null {
  useCartStore.getState().switchUserCart(email);
  return localStorage.getItem(`uf_last_path_${email}`);
}

function getTimeGreeting(lang: string) {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { emoji: "☀️", text: lang === "th" ? "สวัสดีตอนเช้า" : "Good Morning" };
  if (h >= 12 && h < 17) return { emoji: "🌤️", text: lang === "th" ? "สวัสดีตอนบ่าย" : "Good Afternoon" };
  if (h >= 17 && h < 21) return { emoji: "🌅", text: lang === "th" ? "สวัสดีตอนเย็น" : "Good Evening" };
  return { emoji: "🌙", text: lang === "th" ? "สวัสดีตอนดึก" : "Good Night" };
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useSettingsStore();
  const googleLoginPending = useRef(false);

  /** After a successful login, restore state and decide where to go */
  function handleLoginSuccess(user: { email: string; role: string }) {
    const savedPath = restoreAccountState(user.email);
    const from = (location.state as { from?: string } | null)?.from;
    // Admin always goes to /admin; users go to last path, or referring page, or encyclopedia
    const dest = user.role === "admin"
      ? "/admin"
      : (savedPath || from || "/encyclopedia");
    navigate(dest, { replace: true });
  }

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);
  const [error,      setError]      = useState<string>("");
  const [errorField, setErrorField] = useState<"email" | "password" | "both" | "">("");
  const [verifyMsg,  setVerifyMsg]  = useState<string>("");
  const [needs2fa,   setNeeds2fa]   = useState(false);
  const [admin2faEmail, setAdmin2faEmail] = useState("");
  const [otpCode,    setOtpCode]    = useState("");

  // Remove any previously stored plaintext password (security cleanup)
  useEffect(() => {
    localStorage.removeItem("saved_password");
    const savedEmail = localStorage.getItem("saved_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Handle Google Sign-In result via onAuthStateChanged
  // Only runs when googleLoginPending ref is true (user explicitly clicked Google button)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!googleLoginPending.current) return;
      if (!firebaseUser?.email) return;
      // Ensure the user signed in with Google, not email/password
      const isGoogleUser = firebaseUser.providerData.some(p => p.providerId === "google.com");
      if (!isGoogleUser) return;
      googleLoginPending.current = false;

      const { email: gEmail, displayName, uid, photoURL } = firebaseUser;
      setGoogleLoad(true);
      try {
        const res  = await fetch(`${API_BASE}/api/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: gEmail, name: displayName ?? gEmail, uid, photoURL }),
        });
        const data = await res.json();
        if (res.ok) {
          const cache  = JSON.parse(localStorage.getItem(`uf_profile_${data.user.email}`) || "{}");
          const merged = { ...data.user, avatar: data.user.avatar || photoURL || cache.avatar, nickname: data.user.nickname ?? cache.nickname, phone: data.user.phone ?? cache.phone, birthDate: data.user.birthDate ?? cache.birthDate };
          sessionStorage.setItem("user", JSON.stringify(merged));
          sessionStorage.setItem("uf_show_greeting", "1");
          window.dispatchEvent(new Event("auth-change"));
          handleLoginSuccess(merged);
        } else {
          setError(data.error || (lang === "th" ? "Google Sign-In ล้มเหลว" : "Google Sign-In failed"));
          setGoogleLoad(false);
        }
      } catch {
        setError(lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" : "Cannot connect to server");
        setGoogleLoad(false);
      }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = {
    title:       lang === "th" ? "เข้าสู่ระบบ" : "Login",
    desc:        lang === "th" ? "ยินดีต้อนรับกลับสู่ Udomtong Farm" : "Welcome back to Udomtong Farm",
    emailLabel:  lang === "th" ? "อีเมล" : "Email Address",
    passLabel:   lang === "th" ? "รหัสผ่าน" : "Password",
    forgotPass:  lang === "th" ? "ลืมรหัสผ่าน?" : "Forgot Password?",
    rememberMe:  lang === "th" ? "จดจำอีเมล" : "Remember my email",
    btnLogin:    lang === "th" ? "เข้าสู่ระบบ" : "Login",
    btnLoading:  lang === "th" ? "กำลังเข้าสู่ระบบ..." : "Logging in...",
    orDivider:   lang === "th" ? "หรือ" : "or",
    googleBtn:   lang === "th" ? "เข้าสู่ระบบด้วย Google" : "Sign in with Google",
    noAccount:   lang === "th" ? "ยังไม่มีบัญชีใช่ไหม?" : "Don't have an account?",
    registerLink: lang === "th" ? "สมัครสมาชิก" : "Register here",
    verifyNote:  lang === "th"
      ? "กรุณายืนยันอีเมลก่อน — ตรวจสอบกล่องจดหมาย (รวมถึงโฟลเดอร์ Spam)"
      : "Please verify your email first — check your inbox (including Spam folder).",
  };

  // ─── Email/Password login ───
  async function onSubmitEmail(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setErrorField(""); setVerifyMsg("");
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.needs_2fa) {
        setNeeds2fa(true);
        setAdmin2faEmail(data.email || email.trim());
        return;
      }
      if (res.ok) {
        if (rememberMe) {
          localStorage.setItem("saved_email", email.trim());
        } else {
          localStorage.removeItem("saved_email");
        }
        // merge กับ profile cache ที่บันทึกแยกไว้ (ไม่โดน logout ลบ)
        const cache = JSON.parse(localStorage.getItem(`uf_profile_${data.user.email}`) || "{}");
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
        setVerifyMsg(t.verifyNote);
        setErrorField("email");
      } else {
        setError(data.error || (lang === "th" ? "เข้าสู่ระบบไม่สำเร็จ" : "Login failed"));
        setErrorField(data.field || "");
      }
    } catch {
      setError(lang === "th"
        ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (กรุณาเช็คว่า API รันอยู่)"
        : "Cannot connect to server (Is the API running?)");
    } finally {
      setLoading(false);
    }
  }

  // ─── Google Sign-In (popup) ───
  async function onGoogleLogin() {
    setError(""); setVerifyMsg("");
    setGoogleLoad(true);
    googleLoginPending.current = true;
    try {
      await signInWithPopup(auth, googleProvider);
      // result handled by onAuthStateChanged
    } catch (err: unknown) {
      googleLoginPending.current = false;
      if ((err as {code?: string})?.code !== "auth/popup-closed-by-user") {
        setError(lang === "th"
          ? "Google Sign-In ล้มเหลว กรุณาลองใหม่อีกครั้ง"
          : "Google Sign-In failed. Please try again.");
      }
      setGoogleLoad(false);
    }
  }

  // ─── Admin 2FA verify ───
  async function onVerify2fa(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: admin2faEmail, otpCode: otpCode.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("auth-change"));
        handleLoginSuccess(data.user);
      } else {
        setError(data.error || "OTP ไม่ถูกต้อง");
      }
    } catch {
      setError(lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" : "Cannot connect to server");
    } finally { setLoading(false); }
  }

  // ─── 2FA step UI ───
  if (needs2fa) {
    return (
      <div className="auth-container">
        <div className="auth-blob blob-1" />
        <div className="auth-blob blob-2" />
        <div className="auth-card auth-card-hover fade-in-up">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ marginBottom: 8, color: "var(--primary-hover)" }}><LockKeyhole size={48} /></div>
            <h2 style={{ margin: "0 0 6px", fontWeight: 900, color: "var(--text-main)" }}>
              {lang === "th" ? "ยืนยันตัวตน Admin" : "Admin 2FA Verification"}
            </h2>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
              {lang === "th" ? `ส่งรหัส OTP ไปยัง ${admin2faEmail} แล้ว` : `OTP sent to ${admin2faEmail}`}
            </p>
          </div>
          <form onSubmit={onVerify2fa}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                {lang === "th" ? "รหัส OTP (6 หลัก)" : "OTP Code (6 digits)"}
              </label>
              <input
                type="text" inputMode="numeric" maxLength={6} autoFocus
                value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1.5px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-main)", fontSize: "1.5rem", textAlign: "center", letterSpacing: "0.3em", fontWeight: 900, boxSizing: "border-box" }}
              />
            </div>
            {error && <div style={{ color: "#991b1b", background: "#fee2e2", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: "0.88rem" }}>{error}</div>}
            <button type="submit" disabled={loading || otpCode.length < 6}
              style={{ width: "100%", padding: "14px", borderRadius: 12, background: otpCode.length === 6 ? "var(--primary)" : "var(--border-color)", color: otpCode.length === 6 ? "white" : "var(--text-muted)", border: "none", fontWeight: 800, fontSize: "1rem", cursor: otpCode.length === 6 ? "pointer" : "not-allowed" }}>
              {loading ? "..." : (lang === "th" ? "ยืนยัน OTP" : "Verify OTP")}
            </button>
            <button type="button" onClick={() => { setNeeds2fa(false); setOtpCode(""); setError(""); }}
              style={{ width: "100%", padding: "10px", marginTop: 10, borderRadius: 12, border: "1px solid var(--border-color)", background: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
              {lang === "th" ? "← กลับ" : "← Back"}
            </button>
          </form>
        </div>
      </div>
    );
  }

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

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={googleLoad}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, marginBottom: 4,
            border: "1.5px solid var(--border-color)", background: "var(--card-bg)",
            cursor: googleLoad ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontWeight: 700, fontSize: "1rem", color: "var(--text-main)",
            transition: "all 0.25s ease", opacity: googleLoad ? 0.6 : 1,
            fontFamily: "inherit",
          }}
          onMouseEnter={e => { if (!googleLoad) (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; }}
        >
          {googleLoad ? <span className="spinner" /> : <GoogleIcon />}
          {googleLoad ? (lang === "th" ? "กำลังเชื่อมต่อ..." : "Connecting...") : t.googleBtn}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>{t.orDivider}</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
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

          {/* Email verify notice */}
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

          {error && (
            <div className="alert-error">{error}</div>
          )}

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

// ─── Google "G" Icon ───
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );
}

