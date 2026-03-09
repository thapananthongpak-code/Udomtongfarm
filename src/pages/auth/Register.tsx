import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";
import { API_BASE } from "../../config/api";

const EMOJI_LIST = [
  "🐦","🦜","🦚","🦋","🐸","🐢","🌿","🌸","🌺","🌻","🍃","🌾",
  "🐆","🦁","🐘","🦒","🐊","🦎","🌴","🌵","🍀","🌱","🐠","🦀",
  "🐧","🦩","🦔","🐿️","🌍","⭐","🔥","💎",
];

export default function Register() {
  const navigate = useNavigate();
  const { lang } = useSettingsStore(); // 🟢

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pdpa, setPdpa] = useState(false);
  const [avatar, setAvatar] = useState("🌿");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"REGISTER" | "OTP">("REGISTER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // 🟢 พจนานุกรมแปลภาษา
  const t = {
    title: lang === "th" ? "สร้างบัญชีผู้ใช้" : "Create Account",
    desc: lang === "th" ? "เข้าร่วมเป็นส่วนหนึ่งของ Udomtong Farm" : "Join the Udomtong Farm community",
    nameLabel: lang === "th" ? "ชื่อ-นามสกุล" : "Full Name",
    nickLabel: lang === "th" ? "ชื่อเล่น" : "Nickname",
    phoneLabel: lang === "th" ? "เบอร์โทรศัพท์" : "Phone Number",
    birthLabel: lang === "th" ? "วันเกิด" : "Date of Birth",
    emailLabel: lang === "th" ? "อีเมล (Email)" : "Email Address",
    passLabel: lang === "th" ? "รหัสผ่าน (Password)" : "Password",
    passPlaceholder: lang === "th" ? "ตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร" : "At least 6 characters",
    pdpaDesc: lang === "th" ? "ข้าพเจ้ายินยอมให้ Udomtongfarm เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล เพื่อวัตถุประสงค์ในการให้บริการ ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)" : "I consent to Udomtongfarm collecting, using, and disclosing my personal data for service purposes according to the PDPA.",
    btnRegister: lang === "th" ? "สมัครสมาชิกเลย" : "Register Now",
    btnCreating: lang === "th" ? "กำลังสร้างบัญชี..." : "Creating account...",
    otpTitle: lang === "th" ? "ยืนยันอีเมลของคุณ" : "Verify Your Email",
    otpDesc1: lang === "th" ? "เราได้ส่งรหัส OTP 6 หลักไปที่" : "We have sent a 6-digit OTP code to",
    btnVerify: lang === "th" ? "ยืนยันรหัส OTP" : "Verify OTP",
    btnVerifying: lang === "th" ? "กำลังตรวจสอบ..." : "Verifying...",
    haveAccount: lang === "th" ? "มีบัญชีผู้ใช้อยู่แล้ว?" : "Already have an account?",
    loginLink: lang === "th" ? "เข้าสู่ระบบ" : "Login",
  };

  async function onSubmitRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!pdpa) return setError(lang === "th" ? "กรุณากดยอมรับเงื่อนไข PDPA ก่อนสมัครสมาชิก" : "Please accept the PDPA terms before registering.");
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), nickname: nickname.trim(), phone: phone.trim(), birthDate, email: email.trim(), password, pdpa, avatar })
      });
      const data = await response.json();
      if (response.ok) { setStep("OTP"); } else { setError(data.error || (lang === "th" ? "เกิดข้อผิดพลาดในการสมัครสมาชิก" : "Registration failed")); }
    } catch (err: any) {
      setError(lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (โปรดตรวจสอบว่าเปิด API ทิ้งไว้หรือยัง)" : "Cannot connect to server (Is the API running?)");
    } finally { setLoading(false); }
  }

  async function onSubmitVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otpCode })
      });
      const data = await response.json();
      if (response.ok) {
        alert(lang === "th" ? "🎉 ยืนยันอีเมลสำเร็จ! กรุณาเข้าสู่ระบบ" : "🎉 Email verified successfully! Please login.");
        navigate("/login", { replace: true });
      } else {
        setError(data.error || (lang === "th" ? "รหัส OTP ไม่ถูกต้อง" : "Invalid OTP code"));
      }
    } catch (err: any) { setError(lang === "th" ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" : "Cannot connect to server"); } finally { setLoading(false); }
  }

  return (
    <div className="auth-container">
      <div className="auth-blob blob-1"></div>
      <div className="auth-blob blob-2" style={{ animationDelay: "-3s" }}></div>

      <div className="auth-card auth-card-wide fade-in-up">
        
        {step === "REGISTER" && (
          <>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h1 style={{ fontSize: "2.5rem", margin: 0, fontWeight: 900, color: "var(--text-main)" }}>{t.title}</h1>
              <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>{t.desc}</p>
            </div>

            <form onSubmit={onSubmitRegister} style={{ display: "grid", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div>
                  <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.nameLabel}</div>
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder={t.nameLabel} className="auth-input" />
                </div>
                <div>
                  <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.nickLabel}</div>
                  <input value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder={t.nickLabel} className="auth-input" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div>
                  <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.phoneLabel}</div>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required type="tel" placeholder="08X-XXX-XXXX" className="auth-input" />
                </div>
                <div>
                  <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.birthLabel}</div>
                  <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required type="date" className="auth-input" />
                </div>
              </div>

              <div>
                <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.emailLabel}</div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" type="email" required className="auth-input" />
              </div>

              <div>
                <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>{t.passLabel}</div>
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.passPlaceholder} type="password" required minLength={6} className="auth-input" />
              </div>

              {/* Avatar picker */}
              <div>
                <div style={{ marginBottom: "8px", fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>
                  {lang === "th" ? "รูปโปรไฟล์เริ่มต้น" : "Default Profile Picture"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--primary-light)", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                    {avatar}
                  </div>
                  <button type="button" onClick={() => setShowAvatarPicker((v) => !v)}
                    style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border-color)", background: showAvatarPicker ? "var(--primary-light)" : "var(--bg-color)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem" }}>
                    {lang === "th" ? "เลือกอีโมจิ" : "Pick Emoji"}
                  </button>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {lang === "th" ? "หรือเปลี่ยนได้ภายหลังในหน้าโปรไฟล์" : "or change later in Profile"}
                  </span>
                </div>
                {showAvatarPicker && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 14, marginTop: 10, background: "var(--bg-color)", borderRadius: 12, border: "1px solid var(--border-color)" }}>
                    {EMOJI_LIST.map((e) => (
                      <button type="button" key={e} onClick={() => { setAvatar(e); setShowAvatarPicker(false); }}
                        style={{ width: 42, height: 42, borderRadius: 10, border: avatar === e ? "2px solid var(--primary)" : "1px solid var(--border-color)", background: avatar === e ? "var(--primary-light)" : "var(--card-bg)", fontSize: 20, cursor: "pointer" }}>
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginTop: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={pdpa} onChange={(e) => setPdpa(e.target.checked)} style={{ width: "20px", height: "20px", accentColor: "var(--primary)", marginTop: "2px", flexShrink: 0 }} />
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {t.pdpaDesc}
                </div>
              </label>

              {error && <div style={{ padding: "12px", borderRadius: "10px", background: "#fee2e2", color: "#991b1b", fontWeight: 700, fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}

              <button disabled={loading} className="btn-primary" style={{ padding: "16px", fontSize: "1.1rem", borderRadius: "14px", marginTop: "10px" }}>
                {loading ? t.btnCreating : t.btnRegister}
              </button>
            </form>
          </>
        )}

        {step === "OTP" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📧</div>
            <h2 style={{ color: "var(--text-main)", marginBottom: "10px" }}>{t.otpTitle}</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "30px", lineHeight: 1.6 }}>{t.otpDesc1} <br/><b style={{color: "var(--primary-hover)"}}>{email}</b></p>
            
            <form onSubmit={onSubmitVerifyOTP} style={{ display: "grid", gap: "20px" }}>
              <input
                value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456" type="text" required maxLength={6}
                className="auth-input" style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px", fontWeight: 900 }}
              />
              {error && <div style={{ color: "#991b1b", fontWeight: 700, fontSize: "0.9rem" }}>{error}</div>}
              <button disabled={loading} className="btn-primary" style={{ padding: "16px", fontSize: "1.1rem", borderRadius: "14px" }}>
                {loading ? t.btnVerifying : t.btnVerify}
              </button>
            </form>
          </div>
        )}

        <div style={{ marginTop: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.95rem" }}>
          {t.haveAccount} <Link to="/login" style={{ color: "var(--primary-hover)", fontWeight: 800, textDecoration: "none", marginLeft: "4px" }}>{t.loginLink}</Link>
        </div>
      </div>
    </div>
  );
}