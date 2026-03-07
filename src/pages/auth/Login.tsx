import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";
import { API_BASE } from "../../config/api";

export default function Login() {
  const navigate = useNavigate();
  const { lang } = useSettingsStore(); // 🟢

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("saved_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // 🟢 พจนานุกรมแปลภาษา
  const t = {
    title: lang === "th" ? "เข้าสู่ระบบ" : "Login",
    desc: lang === "th" ? "ยินดีต้อนรับกลับสู่ Udomtong Farm" : "Welcome back to Udomtong Farm",
    emailLabel: lang === "th" ? "อีเมล (Email)" : "Email Address",
    passLabel: lang === "th" ? "รหัสผ่าน (Password)" : "Password",
    forgotPass: lang === "th" ? "ลืมรหัสผ่าน?" : "Forgot Password?",
    rememberMe: lang === "th" ? "จดจำอีเมลนี้" : "Remember my email",
    btnLogin: lang === "th" ? "เข้าสู่ระบบ" : "Login",
    btnLoading: lang === "th" ? "กำลังเข้าสู่ระบบ..." : "Logging in...",
    noAccount: lang === "th" ? "ยังไม่มีบัญชีใช่ไหม?" : "Don't have an account?",
    registerLink: lang === "th" ? "สมัครสมาชิก" : "Register here",
  };

  async function onSubmitEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem("saved_email", email.trim());
        } else {
          localStorage.removeItem("saved_email");
        }
        localStorage.removeItem("saved_password"); // ลบรหัสผ่านเก่าที่อาจค้างอยู่
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("auth-change"));

        if (data.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/encyclopedia", { replace: true });
        }
      } else {
        setError(data.error || (lang === "th" ? "เข้าสู่ระบบไม่สำเร็จ" : "Login failed"));
      }
    } catch (err: any) {
      setError(lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (กรุณาเช็คว่า Node.js API รันอยู่)" : "Cannot connect to server (Is Node.js API running?)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      {/* เอฟเฟกต์แสงข้างหลัง */}
      <div className="auth-blob blob-1"></div>
      <div className="auth-blob blob-2"></div>

      <div className="auth-card fade-in-up">
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🌿</div>
          <h1 style={{ fontSize: "2.5rem", margin: 0, fontWeight: 900, color: "var(--text-main)" }}>{t.title}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>{t.desc}</p>
        </div>

        <form onSubmit={onSubmitEmail} style={{ display: "grid", gap: "20px" }}>
          <div>
            <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.emailLabel}</div>
            <input
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com" type="email" required
              className="auth-input"
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.passLabel}</span>
              <Link to="/forgot" style={{ color: "var(--primary-hover)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>{t.forgotPass}</Link>
            </div>
            <input
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" type="password" required
              className="auth-input"
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
            />
            <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-muted)" }}>{t.rememberMe}</span>
          </label>

          {error && (
            <div style={{ padding: "12px", borderRadius: "10px", background: "#fee2e2", color: "#991b1b", fontWeight: 700, fontSize: "0.9rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <button disabled={loading} className="btn-primary" style={{ padding: "16px", fontSize: "1.1rem", borderRadius: "14px", marginTop: "10px" }}>
            {loading ? t.btnLoading : t.btnLogin}
          </button>
        </form>

        <div style={{ marginTop: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.95rem" }}>
          {t.noAccount} <Link to="/register" style={{ color: "var(--primary-hover)", fontWeight: 800, textDecoration: "none", marginLeft: "4px" }}>{t.registerLink}</Link>
        </div>
      </div>
    </div>
  );
}