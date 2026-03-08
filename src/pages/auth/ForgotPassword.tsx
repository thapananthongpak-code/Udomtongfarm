import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore"; // 🟢

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { lang } = useSettingsStore(); // 🟢

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"REQUEST_OTP" | "RESET_PASS">("REQUEST_OTP");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [done, setDone] = useState<string>("");

  // 🟢 พจนานุกรมแปลภาษา
  const t = {
    title: lang === "th" ? "ลืมรหัสผ่าน" : "Forgot Password",
    desc: lang === "th" ? "ไม่ต้องกังวล เราจะช่วยคุณตั้งรหัสผ่านใหม่เอง" : "Don't worry, we'll help you reset your password.",
    emailLabel: lang === "th" ? "อีเมลที่ใช้สมัครบัญชี (Email)" : "Registered Email",
    btnRequest: lang === "th" ? "ขอรหัส OTP" : "Request OTP",
    btnSending: lang === "th" ? "กำลังส่งข้อมูล..." : "Sending...",
    otpLabel: lang === "th" ? "รหัส OTP (6 หลัก)" : "OTP Code (6 digits)",
    newPassLabel: lang === "th" ? "ตั้งรหัสผ่านใหม่" : "New Password",
    newPassPlaceholder: lang === "th" ? "อย่างน้อย 6 ตัวอักษร" : "At least 6 characters",
    btnReset: lang === "th" ? "ยืนยันรหัสผ่านใหม่" : "Confirm New Password",
    btnSaving: lang === "th" ? "กำลังบันทึก..." : "Saving...",
    backToLogin: lang === "th" ? "← กลับไปหน้าเข้าสู่ระบบ" : "← Back to Login",
  };

  async function onRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setDone(""); setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep("RESET_PASS"); setDone(lang === "th" ? "ส่งรหัส OTP ไปที่อีเมลแล้วครับ!" : "OTP sent to your email!");
      } else { setError(data.error || (lang === "th" ? "เกิดข้อผิดพลาดในการขอ OTP" : "Failed to request OTP")); }
    } catch (err) { setError(lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" : "Cannot connect to server"); } finally { setLoading(false); }
  }

  async function onResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), otpCode, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(lang === "th" ? "🎉 เปลี่ยนรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ครับ" : "🎉 Password reset successful! Please login with your new password.");
        navigate("/login", { replace: true });
      } else { setError(data.error || (lang === "th" ? "รหัส OTP ไม่ถูกต้อง" : "Invalid OTP code")); }
    } catch (err) { setError(lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" : "Cannot connect to server"); } finally { setLoading(false); }
  }

  return (
    <div className="auth-container">
      <div className="auth-blob blob-1"></div>
      <div className="auth-blob blob-2" style={{ animationDelay: "-7s" }}></div>

      <div className="auth-card fade-in-up">
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🔑</div>
          <h1 style={{ fontSize: "2.2rem", margin: 0, fontWeight: 900, color: "var(--text-main)" }}>{t.title}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>{t.desc}</p>
        </div>

        {step === "REQUEST_OTP" ? (
          <form onSubmit={onRequestOTP} style={{ display: "grid", gap: "20px" }}>
            <div>
              <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.emailLabel}</div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" type="email" required className="auth-input" />
            </div>
            {error && <div style={{ color: "#991b1b", fontWeight: 700, textAlign: "center", fontSize: "0.9rem" }}>{error}</div>}
            <button disabled={loading} className="btn-primary" style={{ padding: "16px", fontSize: "1.1rem", borderRadius: "14px" }}>
              {loading ? t.btnSending : t.btnRequest}
            </button>
          </form>
        ) : (
          <form onSubmit={onResetPassword} style={{ display: "grid", gap: "20px" }}>
            {done && <div style={{ padding: "12px", borderRadius: "10px", background: "#dcfce7", color: "#166534", fontWeight: 700, textAlign: "center", fontSize: "0.9rem" }}>✅ {done}</div>}
            <div>
              <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.otpLabel}</div>
              <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="123456" required maxLength={6} className="auth-input" style={{ textAlign: "center", letterSpacing: "5px", fontWeight: 900 }} />
            </div>
            <div>
              <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.newPassLabel}</div>
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t.newPassPlaceholder} type="password" required minLength={6} className="auth-input" />
            </div>
            {error && <div style={{ color: "#991b1b", fontWeight: 700, textAlign: "center", fontSize: "0.9rem" }}>{error}</div>}
            <button disabled={loading} className="btn-primary" style={{ padding: "16px", fontSize: "1.1rem", borderRadius: "14px", background: "var(--primary-hover)" }}>
              {loading ? t.btnSaving : t.btnReset}
            </button>
          </form>
        )}

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Link to="/login" style={{ color: "var(--text-muted)", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}>
            {t.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}