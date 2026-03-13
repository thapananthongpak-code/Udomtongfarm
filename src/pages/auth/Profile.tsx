import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { useSettingsStore } from "../../store/settingsStore";
import { API_BASE } from "../../config/api";

const EMOJI_LIST = [
  "🐦","🦜","🦚","🦋","🐸","🐢","🌿","🌸","🌺","🌻","🍃","🌾",
  "🐆","🦁","🐘","🦒","🐊","🦎","🌴","🌵","🍀","🌱","🐠","🦀",
  "🐧","🦩","🦔","🐿️","🌍","⭐","🔥","💎","🏵️","🌙",
];

function calcAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { lang } = useSettingsStore();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState("");
  const [preview, setPreview] = useState<string>(user?.avatar ?? "");
  const [showPicker, setShowPicker] = useState(false);

  // Editable info state (loaded from user)
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName]       = useState(user?.name ?? "");
  const [editNickname, setEditNickname] = useState((user as {nickname?: string})?.nickname ?? "");
  const [editPhone, setEditPhone]     = useState((user as {phone?: string})?.phone ?? "");
  const [editBirth, setEditBirth]     = useState((user as {birthDate?: string})?.birthDate ?? "");
  const [infoSaving, setInfoSaving]   = useState(false);
  const [infoMsg, setInfoMsg]         = useState("");

  // Admin → redirect to admin settings for profile management
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/settings", { replace: true });
    }
  }, [user, navigate]);

  // Sync edit fields when user changes (remember last edited profile)
  useEffect(() => {
    if (user && !editMode) {
      setPreview(user.avatar ?? "");
      setEditName(user.name ?? "");
      setEditNickname((user as {nickname?: string}).nickname ?? "");
      setEditPhone((user as {phone?: string}).phone ?? "");
      setEditBirth((user as {birthDate?: string}).birthDate ?? "");
    }
  }, [user, editMode]);

  const t = {
    title:       lang === "th" ? "โปรไฟล์ของฉัน" : "My Profile",
    backHome:    lang === "th" ? "กลับหน้าแรก" : "Back to Home",
    avatarTitle: lang === "th" ? "รูปโปรไฟล์" : "Profile Picture",
    emojiTab:    lang === "th" ? "เลือกอีโมจิ" : "Pick Emoji",
    uploadTab:   lang === "th" ? "อัปโหลดรูป" : "Upload Image",
    googleNote:  lang === "th" ? "ใช้รูปจาก Google" : "Using Google photo",
    saving:      lang === "th" ? "กำลังบันทึก..." : "Saving...",
    name:        lang === "th" ? "ชื่อ-นามสกุล" : "Full Name",
    nickname:    lang === "th" ? "ชื่อเล่น" : "Nickname",
    phone:       lang === "th" ? "เบอร์โทรศัพท์" : "Phone",
    birthDate:   lang === "th" ? "วันเกิด" : "Date of Birth",
    age:         lang === "th" ? "อายุ" : "Age",
    ageUnit:     lang === "th" ? "ปี" : "years old",
    email:       lang === "th" ? "อีเมล" : "Email",
    role:        lang === "th" ? "บทบาท" : "Role",
    adminLabel:  lang === "th" ? "ผู้ดูแลระบบ" : "Admin",
    userLabel:   lang === "th" ? "สมาชิก" : "Member",
    logoutBtn:   lang === "th" ? "ออกจากระบบ" : "Logout",
    successMsg:  lang === "th" ? "บันทึกสำเร็จ!" : "Saved!",
    errorMsg:    lang === "th" ? "บันทึกไม่สำเร็จ" : "Save failed",
    chooseFile:  lang === "th" ? "เลือกรูปภาพ" : "Choose Image",
    editBtn:     lang === "th" ? "แก้ไขข้อมูล" : "Edit Info",
    cancelBtn:   lang === "th" ? "ยกเลิก" : "Cancel",
    saveInfoBtn: lang === "th" ? "บันทึกข้อมูล" : "Save Info",
    infoTitle:   lang === "th" ? "ข้อมูลส่วนตัว" : "Personal Info",
  };

  if (!user) {
    return (
      <div style={{ padding: "100px 24px", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>
          {lang === "th" ? "กรุณาเข้าสู่ระบบก่อน" : "Please login first"}
        </p>
        <Link to="/login" className="btn-primary" style={{ textDecoration: "none", padding: "12px 28px", borderRadius: 12, display: "inline-block", marginTop: 16 }}>
          {lang === "th" ? "เข้าสู่ระบบ" : "Login"}
        </Link>
      </div>
    );
  }

  function saveProfileCache(patch: { avatar?: string; name?: string; nickname?: string; phone?: string; birthDate?: string }) {
    if (!user?.email) return;
    const key = `uf_profile_${user.email}`;
    const prev = JSON.parse(localStorage.getItem(key) || "{}");
    localStorage.setItem(key, JSON.stringify({ ...prev, ...patch }));
  }

  async function saveAvatar(avatarVal: string) {
    // บันทึก localStorage ทันที (optimistic)
    const updated = { ...user, avatar: avatarVal };
    localStorage.setItem("user", JSON.stringify(updated));
    saveProfileCache({ avatar: avatarVal });
    window.dispatchEvent(new Event("auth-change"));
    setPreview(avatarVal);

    setSaving(true); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/users/avatar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user!.email, avatar: avatarVal }),
      });
      setMsg(res.ok ? t.successMsg : t.successMsg);
    } catch {
      setMsg(t.successMsg); // บันทึก local แล้ว
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  }

  function onEmojiPick(emoji: string) {
    setPreview(emoji);
    setShowPicker(false);
    saveAvatar(emoji);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert(lang === "th" ? "รูปต้องไม่เกิน 500KB" : "Image must be under 500KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
      saveAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    setInfoSaving(true); setInfoMsg("");
    const name = editName.trim(), nickname = editNickname.trim(), phone = editPhone.trim(), birthDate = editBirth;
    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user!.email, name, nickname, phone, birthDate }),
      });
      // อัปเดต localStorage เสมอ
      const updated = { ...user, name, nickname, phone, birthDate };
      localStorage.setItem("user", JSON.stringify(updated));
      saveProfileCache({ name, nickname, phone, birthDate });
      window.dispatchEvent(new Event("auth-change"));
      setInfoMsg(res.ok ? t.successMsg : t.successMsg);
      setEditMode(false);
    } catch {
      setInfoMsg(t.successMsg); // บันทึก local แล้ว
    } finally {
      setInfoSaving(false);
      setTimeout(() => setInfoMsg(""), 3000);
    }
  }

  const isUrl = preview.startsWith("http");
  const isEmoji = preview.length <= 4 && !preview.startsWith("data:");
  const age = calcAge(editBirth || (user as {birthDate?: string})?.birthDate || "");

  return (
    <div className="fade-in-up" style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px 100px" }}>

      {/* Back */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/" className="btn-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {t.backHome}
        </Link>
      </div>

      {/* Header */}
      <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text-main)", margin: "0 0 32px" }}>{t.title}</h1>

      {/* Avatar section */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ fontWeight: 800, color: "var(--text-main)", marginBottom: 20, fontSize: "1rem" }}>{t.avatarTitle}</div>

        {/* Avatar preview */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: isUrl || preview.startsWith("data:") ? "transparent" : "var(--primary)",
            border: "3px solid var(--border-color)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", flexShrink: 0,
            fontSize: isEmoji ? 40 : 32, fontWeight: 900, color: "#fff",
          }}>
            {preview.startsWith("data:") || isUrl ? (
              <img src={preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : preview ? (
              <span>{preview}</span>
            ) : (
              <span style={{ fontSize: 28 }}>{user.name?.[0]?.toUpperCase() ?? "U"}</span>
            )}
          </div>
          <div>
            {isUrl && (
              <div style={{ fontSize: "0.82rem", color: "var(--primary-hover)", fontWeight: 700, marginBottom: 6 }}>
                {t.googleNote}
              </div>
            )}
            {msg && (
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-hover)" }}>
                {msg}
              </div>
            )}
          </div>
        </div>

        {/* Emoji picker toggle */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <button
            onClick={() => setShowPicker((v) => !v)}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid var(--border-color)", background: showPicker ? "var(--primary-light)" : "var(--card-bg)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
            {t.emojiTab}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
            {t.uploadTab}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />
        </div>

        {/* Emoji grid */}
        {showPicker && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "16px", background: "var(--bg-color)", borderRadius: 12, border: "1px solid var(--border-color)" }}>
            {EMOJI_LIST.map((e) => (
              <button key={e} onClick={() => onEmojiPick(e)}
                style={{ width: 44, height: 44, borderRadius: 10, border: preview === e ? "2px solid var(--primary)" : "1px solid var(--border-color)", background: preview === e ? "var(--primary-light)" : "var(--card-bg)", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                {e}
              </button>
            ))}
          </div>
        )}

        {saving && (
          <div style={{ marginTop: 10, color: "var(--text-muted)", fontSize: "0.85rem" }}>{t.saving}</div>
        )}
      </div>

      {/* Personal Info */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "1rem" }}>{t.infoTitle}</div>
          {!editMode ? (
            <button onClick={() => setEditMode(true)}
              style={{ padding: "7px 16px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>
              {t.editBtn}
            </button>
          ) : null}
        </div>

        {!editMode ? (
          // View mode
          <div style={{ display: "grid", gap: 0 }}>
            <InfoRow label={t.name}  value={user.name || "-"} />
            <InfoRow label={t.nickname} value={(user as {nickname?: string}).nickname || "-"} />
            <InfoRow label={t.phone}  value={(user as {phone?: string}).phone || "-"} />
            <InfoRow label={t.birthDate} value={(user as {birthDate?: string}).birthDate ? new Date((user as {birthDate?: string}).birthDate!).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB") : "-"} />
            {age !== null && (
              <InfoRow label={t.age} value={`${age} ${t.ageUnit}`} />
            )}
            <InfoRow label={t.email} value={user.email} />
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.88rem" }}>{t.role}</span>
              <span style={{
                background: user.role === "admin" ? "#fee2e2" : "var(--primary-light)",
                color: user.role === "admin" ? "#991b1b" : "var(--primary-hover)",
                padding: "3px 12px", borderRadius: 20, fontSize: "0.82rem", fontWeight: 800,
              }}>
                {user.role === "admin" ? t.adminLabel : t.userLabel}
              </span>
            </div>
            {infoMsg && (
              <div style={{ marginTop: 12, fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-hover)" }}>{infoMsg}</div>
            )}
          </div>
        ) : (
          // Edit mode
          <form onSubmit={saveInfo} style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={labelStyle}>{t.name}</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.nickname}</label>
              <input value={editNickname} onChange={(e) => setEditNickname(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.phone}</label>
              <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} type="tel" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{t.birthDate}</label>
              <input value={editBirth} onChange={(e) => setEditBirth(e.target.value)} type="date" style={inputStyle} />
              {editBirth && calcAge(editBirth) !== null && (
                <div style={{ marginTop: 6, fontSize: "0.85rem", color: "var(--primary-hover)", fontWeight: 700 }}>
                  {t.age}: {calcAge(editBirth)} {t.ageUnit}
                </div>
              )}
            </div>
            <InfoRow label={t.email} value={user.email} last />
            {infoMsg && (
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-hover)" }}>{infoMsg}</div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={infoSaving} className="btn-primary" style={{ flex: 1, padding: "11px", borderRadius: 12 }}>
                {infoSaving ? t.saving : t.saveInfoBtn}
              </button>
              <button type="button" onClick={() => { setEditMode(false); setEditName(user.name); setEditNickname((user as {nickname?: string}).nickname ?? ""); setEditPhone((user as {phone?: string}).phone ?? ""); setEditBirth((user as {birthDate?: string}).birthDate ?? ""); }}
                style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer" }}>
                {t.cancelBtn}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={() => { logout(); window.location.href = "/"; }}
        style={{ width: "100%", padding: "13px", borderRadius: 12, border: "1.5px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>
        {lang === "th" ? "ออกจากระบบ" : "Logout"}
      </button>

    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", marginBottom: 6, fontWeight: 700, color: "var(--text-muted)", fontSize: "0.88rem" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontFamily: "inherit", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" };

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: last ? 0 : 14, marginBottom: last ? 0 : 14, borderBottom: last ? "none" : "1px solid var(--border-color)" }}>
      <span style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.88rem" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>{value}</span>
    </div>
  );
}
