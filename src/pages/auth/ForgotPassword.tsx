import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";
import { API_BASE } from "../../config/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { lang } = useSettingsStore();

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState<"REQUEST_OTP" | "RESET_PASS">("REQUEST_OTP");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [done, setDone] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const t = {
    title:              lang === "th" ? "ลืมรหัสผ่าน" : "Forgot Password",
    desc:               lang === "th" ? "ไม่ต้องกังวล เราจะช่วยตั้งรหัสผ่านใหม่ให้" : "Don't worry, we'll help you reset your password.",
    step1Label:         lang === "th" ? "ยืนยันอีเมล" : "Verify Email",
    step2Label:         lang === "th" ? "ตั้งรหัสใหม่" : "New Password",
    emailLabel:         lang === "th" ? "อีเมลที่ใช้สมัครบัญชี" : "Registered Email",
    btnRequest:         lang === "th" ? "ขอรหัส OTP" : "Request OTP",
    btnSending:         lang === "th" ? "กำลังส่ง..." : "Sending...",
    otpLabel:           lang === "th" ? "รหัส OTP (6 หลัก)" : "OTP Code (6 digits)",
    otpHint:            lang === "th" ? "ตรวจสอบกล่องจดหมาย (รวมถึงโฟลเดอร์ Spam)" : "Check your inbox (including Spam folder)",
    newPassLabel:       lang === "th" ? "ตั้งรหัสผ่านใหม่" : "New Password",
    newPassPlaceholder: lang === "th" ? "อย่างน้อย 6 ตัวอักษร" : "At least 6 characters",
    btnReset:           lang === "th" ? "ยืนยันรหัสผ่านใหม่" : "Confirm New Password",
    btnSaving:          lang === "th" ? "กำลังบันทึก..." : "Saving...",
    backToLogin:        lang === "th" ? "← กลับไปหน้าเข้าสู่ระบบ" : "← Back to Login",
    sendingTo:          lang === "th" ? "ส่ง OTP ไปที่" : "Sending OTP to",
  };

  async function onRequestOTP(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setDone(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("RESET_PASS");
        setResendCooldown(60);
        setDone(lang === "th" ? "ส่งรหัส OTP ไปที่อีเมลแล้วครับ!" : "OTP sent to your email!");
      } else {
        setError(data.error || (lang === "th" ? "เกิดข้อผิดพลาดในการขอ OTP" : "Failed to request OTP"));
      }
    } catch {
      setError(lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" : "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  }

  async function onResetPassword(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otpCode, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(lang === "th"
          ? "🎉 เปลี่ยนรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่"
          : "🎉 Password reset successful! Please login with your new password.");
        navigate("/login", { replace: true });
      } else {
        setError(data.error || (lang === "th" ? "รหัส OTP ไม่ถูกต้อง" : "Invalid OTP code"));
      }
    } catch {
      setError(lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" : "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  }

  const isStep2 = step === "RESET_PASS";

  return (
    <div className="auth-container">
      <div className="auth-blob blob-1" />
      <div className="auth-blob blob-2" style={{ animationDelay: "-7s" }} />

      <div className="auth-card auth-card-hover fade-in-up">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "2.8rem", marginBottom: 10, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>
            {isStep2 ? "✉️" : "🔑"}
          </div>
          <h1 style={{ fontSize: "2rem", margin: 0, fontWeight: 900, color: "var(--text-main)" }}>{t.title}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: "0.92rem" }}>{t.desc}</p>
        </div>

        {/* Step Progress */}
        <div className="step-progress">
          <div className={`step-dot ${isStep2 ? "done" : "active"}`}>
            {isStep2 ? <IconCheck /> : "1"}
          </div>
          <div className={`step-line ${isStep2 ? "filled" : ""}`} />
          <div className={`step-dot ${isStep2 ? "active" : "inactive"}`}>2</div>
        </div>

        {/* Step labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: -20, marginBottom: 24, padding: "0 4px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isStep2 ? "var(--text-muted)" : "var(--primary-hover)" }}>
            {t.step1Label}
          </span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isStep2 ? "var(--primary-hover)" : "var(--text-muted)" }}>
            {t.step2Label}
          </span>
        </div>

        {/* ── Step 1: Request OTP ── */}
        {!isStep2 ? (
          <form onSubmit={onRequestOTP} style={{ display: "grid", gap: 20 }} className="slide-in-left">
            <div>
              <div style={{ marginBottom: 8, fontWeight: 700, color: "var(--text-main)", fontSize: "0.93rem" }}>{t.emailLabel}</div>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="name@email.com"
                type="email"
                required
                className="auth-input"
              />
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button disabled={loading} className="btn-primary" style={{ padding: "15px", fontSize: "1.05rem", borderRadius: 14 }}>
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18, marginRight: 8 }} />{t.btnSending}</>
                : t.btnRequest}
            </button>
          </form>
        ) : (
          /* ── Step 2: Enter OTP + New Password ── */
          <form onSubmit={onResetPassword} style={{ display: "grid", gap: 20 }} className="slide-in-right">
            {done && (
              <div className="alert-success" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconCheck /> <span>{done}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginLeft: 4 }}>({t.otpHint})</span>
              </div>
            )}

            <div>
              <div style={{ marginBottom: 8, fontWeight: 700, color: "var(--text-main)", fontSize: "0.93rem" }}>{t.otpLabel}</div>
              <input
                value={otpCode}
                onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="123456"
                required
                inputMode="numeric"
                maxLength={6}
                className="auth-input"
                style={{ textAlign: "center", letterSpacing: "8px", fontWeight: 900, fontSize: "1.3rem" }}
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 700, color: "var(--text-main)", fontSize: "0.93rem" }}>{t.newPassLabel}</div>
              <div className="input-password-wrap">
                <input
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                  placeholder={t.newPassPlaceholder}
                  type={showPass ? "text" : "password"}
                  required
                  minLength={6}
                  className="auth-input"
                />
                <button type="button" className="btn-eye" onClick={() => setShowPass(v => !v)} tabIndex={-1} aria-label={showPass ? "Hide" : "Show"}>
                  {showPass ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <button disabled={loading} className="btn-primary" style={{ padding: "15px", fontSize: "1.05rem", borderRadius: 14 }}>
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18, marginRight: 8 }} />{t.btnSaving}</>
                : t.btnReset}
            </button>

            <div style={{ textAlign: "center", fontSize: "0.88rem", color: "var(--text-muted)" }}>
              {lang === "th" ? "ไม่ได้รับ OTP?" : "Didn't receive OTP?"}{" "}
              <button
                type="button"
                onClick={() => { setStep("REQUEST_OTP"); setError(""); setDone(""); }}
                disabled={resendCooldown > 0}
                style={{
                  background: "none", border: "none",
                  cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                  color: resendCooldown > 0 ? "var(--text-muted)" : "var(--primary-hover)",
                  fontWeight: 700, fontSize: "0.88rem", padding: 0,
                }}
              >
                {resendCooldown > 0
                  ? `${lang === "th" ? "ส่งอีกครั้งใน" : "Resend in"} ${resendCooldown}s`
                  : (lang === "th" ? "← ส่ง OTP ใหม่" : "← Resend OTP")}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <Link to="/login" style={{ color: "var(--text-muted)", fontWeight: 700, textDecoration: "none", fontSize: "0.93rem", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--primary-hover)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
            {t.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Icons ───
function IconCheck() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function IconEye() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function IconEyeOff() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
