import { useRef, useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import { useSpeciesStore } from "../store/speciesStore";
import { useSettingsStore } from "../store/settingsStore";
import { API_BASE } from "../config/api";
import { authFetch } from "../utils/authFetch";
import { ADMIN_EMAILS } from "../config/admin";
import { FOUNDER_KEY, FOUNDER_DEFAULTS, getFounderData, type FounderData } from "../utils/founder";
import { useAppSettingsStore } from "../store/appSettingsStore";
import { useGalleryStore } from "../store/galleryStore";
import { useToast } from "../components/Toast";

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

const SITE_SETTINGS_KEY = "uf_site_settings";

interface SiteSettings {
  siteName: string;
  maintenanceMode: boolean;
  carouselCount: number;
  spotlightCount: number;
}

function getSiteSettings(): SiteSettings {
  try {
    return JSON.parse(localStorage.getItem(SITE_SETTINGS_KEY) || "{}");
  } catch { return {} as SiteSettings; }
}
function saveSiteSettings(s: SiteSettings) {
  localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(s));
}

export default function AdminSettings() {
  const { user } = useAuth();
  const { lang, theme, toggleTheme } = useSettingsStore();
  const { toast } = useToast();

  const [input, setInput] = useState("");
  const [adminsList, setAdminsList] = useState<{ email: string }[]>([]);
  const [apiStatus, setApiStatus] = useState<"checking" | "ok" | "fail">("checking");
  const [sessions, setSessions] = useState<{ id: number; user_email: string; user_name: string; role: string; login_at: string; logout_at: string | null }[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: number; name: string; nickname: string; email: string; phone: string; birth_date: string; is_verified: number; avatar: string }[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<{ id: number; email: string; name: string; phone: string; deleted_at: string }[]>([]);
  const [pwLogs,   setPwLogs]   = useState<{ id: number; email: string; changed_at: string }[]>([]);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<"profile" | "users" | "logs" | "settings" | "gallery">("profile");

  // Site settings
  const saved = getSiteSettings();
  const [siteName, setSiteName]           = useState(saved.siteName ?? "Udomtong Farm");
  const [maintenanceMode, setMaintenance] = useState(saved.maintenanceMode ?? false);
  const [carouselCount, setCarouselCount] = useState(saved.carouselCount ?? 12);
  const [spotlightCount, setSpotlightCount] = useState(saved.spotlightCount ?? 3);

  // App Settings (Promo Banner)
  const appSettings = useAppSettingsStore();
  const fetchAppSettings = useAppSettingsStore((s) => s.fetchSettings);

  useEffect(() => {
    fetchAppSettings();
  }, [fetchAppSettings]);

  const items       = useSpeciesStore((s) => s.items);
  const loading     = useSpeciesStore((s) => s.loading);
  const fetchAll    = useSpeciesStore((s) => s.fetchAll);
  const exportJSON  = useSpeciesStore((s) => s.exportJSON);
  const importJSON  = useSpeciesStore((s) => s.importJSON);
  const mergeImportJSON = useSpeciesStore((s) => s.mergeImportJSON);
  const resetToSeed = useSpeciesStore((s) => s.resetToSeed);

  // ── Gallery state ──
  const galleryItems   = useGalleryStore((s) => s.items);
  const addGalleryItem = useGalleryStore((s) => s.addItem);
  const removeGalleryItem = useGalleryStore((s) => s.removeItem);
  const galleryImgRef  = useRef<HTMLInputElement | null>(null);
  const [galTitleTh, setGalTitleTh] = useState("");
  const [galTitleEn, setGalTitleEn] = useState("");
  const [galCategory, setGalCategory] = useState<"animal" | "plant" | "other">("other");
  const [galImgPreview, setGalImgPreview] = useState("");
  const [galUrlInput, setGalUrlInput] = useState("");
  const [galAddMode, setGalAddMode] = useState<"url" | "upload">("url");

  const fileRestoreRef = useRef<HTMLInputElement | null>(null);
  const fileMergeRef   = useRef<HTMLInputElement | null>(null);

  // ── Founder Profile state ──
  const founderFileRef = useRef<HTMLInputElement | null>(null);
  const initFounder = getFounderData();
  const [founderEditMode, setFounderEditMode] = useState(false);
  const [founderSaving, setFounderSaving]     = useState(false);
  const [founderMsg, setFounderMsg]           = useState("");
  const [fdAvatar,  setFdAvatar]   = useState(initFounder.avatar);
  const [fdNameTh,  setFdNameTh]   = useState(initFounder.nameTh);
  const [fdNameEn,  setFdNameEn]   = useState(initFounder.nameEn);
  const [fdTitleTh, setFdTitleTh]  = useState(initFounder.titleTh);
  const [fdTitleEn, setFdTitleEn]  = useState(initFounder.titleEn);
  const [fdOrgTh,   setFdOrgTh]    = useState(initFounder.orgTh);
  const [fdOrgEn,   setFdOrgEn]    = useState(initFounder.orgEn);
  const [fdBioTh,   setFdBioTh]    = useState(initFounder.bioTh);
  const [fdBioEn,   setFdBioEn]    = useState(initFounder.bioEn);
  const [fdTagsTh,  setFdTagsTh]   = useState(initFounder.tagsTh);
  const [fdTagsEn,  setFdTagsEn]   = useState(initFounder.tagsEn);
  const [showFounderEmojiPicker, setShowFounderEmojiPicker] = useState(false);

  // ── Admin Profile state ──
  const profileFileRef = useRef<HTMLInputElement | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>(user?.avatar ?? "");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState("");
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const extUser = user as { nickname?: string, phone?: string, birthDate?: string } | null;
  const [editNickname, setEditNickname] = useState(extUser?.nickname ?? "");
  const [editPhone, setEditPhone] = useState(extUser?.phone ?? "");
  const [editBirth, setEditBirth] = useState(extUser?.birthDate ?? "");
  const [profileInfoSaving, setProfileInfoSaving] = useState(false);
  const [profileInfoMsg, setProfileInfoMsg] = useState("");

  // Sync profile fields when user changes (remember last edited profile)
  useEffect(() => {
    if (user && !profileEditMode) {
      setProfilePreview(user.avatar ?? "");
      setEditName(user.name ?? "");
      const eUser = user as { nickname?: string, phone?: string, birthDate?: string };
      setEditNickname(eUser.nickname ?? "");
      setEditPhone(eUser.phone ?? "");
      setEditBirth(eUser.birthDate ?? "");
    }
  }, [user, profileEditMode]);

  useEffect(() => {
    fetchAll();
    fetchAdmins();
    checkApi();
    fetchSessions();
    fetchAllUsers();
    fetchPwLogs();
    const timer = setInterval(() => { fetchSessions(); fetchAllUsers(); fetchPwLogs(); }, 30_000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSessions() {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`${API_BASE}/api/login-sessions?limit=100`, {
        headers: { Authorization: `Bearer ${btoa(JSON.stringify({ role: token.role }))}` },
      });
      if (res.ok) setSessions(await res.json());
    } catch { /* silent */ }
  }

  async function fetchAllUsers() {
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      if (res.ok) setAllUsers(await res.json());
    } catch { /* silent */ }
  }

  async function fetchDeletedUsers() {
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`${API_BASE}/api/deleted-users`, {
        headers: { Authorization: `Bearer ${btoa(JSON.stringify({ role: token.role }))}` },
      });
      if (res.ok) setDeletedUsers(await res.json());
    } catch { /* silent */ }
  }

  async function deleteUser(email: string) {
    if (!confirm(lang === "th" ? `แน่ใจหรือไม่ว่าจะลบผู้ใช้งาน ${email} ?\nข้อมูลนี้จะไม่สามารถกู้กลับได้` : `Are you sure you want to delete user ${email}?\nThis action cannot be undone.`)) return;
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${btoa(JSON.stringify({ role: token.role }))}` },
      });
      if (res.ok) {
        toast(lang === "th" ? "ลบผู้ใช้สำเร็จ" : "User deleted successfully", "success");
        fetchAllUsers();
        fetchDeletedUsers();
      } else {
        const data = await res.json();
        toast(data.error || "Delete failed", "error");
      }
    } catch {
      toast("Error connecting to server", "error");
    }
  }

  async function fetchPwLogs() {
    try {
      const res = await fetch(`${API_BASE}/api/password-change-log`);
      if (res.ok) setPwLogs(await res.json());
    } catch { /* silent */ }
  }

  const ADMINS_URL = `${API_BASE}/api/admins`;

  async function checkApi() {
    setApiStatus("checking");
    try {
      const r = await fetch(`${API_BASE}/api/health`);
      setApiStatus(r.ok ? "ok" : "fail");
    } catch { setApiStatus("fail"); }
  }

  async function fetchAdmins() {
    try {
      const res = await authFetch(ADMINS_URL);
      const data = await res.json();
      setAdminsList(data);
    } catch { /* silently ignore admin list fetch errors */ }
  }

  async function addEmail() {
    const email = input.toLowerCase().trim();
    if (!email) return;
    try {
      const res = await authFetch(ADMINS_URL, { method: "POST", body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok) { toast(data.message, "success"); setInput(""); fetchAdmins(); }
      else { toast(data.error, "error"); }
    } catch { toast("Error connecting to server", "error"); }
  }

  async function removeEmail(email: string) {
    if (!confirm(lang === "th" ? `แน่ใจนะว่าจะลบสิทธิ์แอดมินของ ${email}?` : `Remove admin rights for ${email}?`)) return;
    try {
      const res = await authFetch(`${ADMINS_URL}/${encodeURIComponent(email)}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) { fetchAdmins(); } else { toast(data.error, "error"); }
    } catch { toast("Error connecting to server", "error"); }
  }

  function saveSite() {
    saveSiteSettings({ siteName, maintenanceMode, carouselCount, spotlightCount });
    toast(lang === "th" ? "บันทึกการตั้งค่าเรียบร้อย" : "Settings saved", "success");
  }

  async function savePromoBanner() {
    const token = JSON.parse(localStorage.getItem("user") || "{}");
    const success = await appSettings.updateSettings(
      {
        bannerTitleTh: appSettings.bannerTitleTh,
        bannerTitleEn: appSettings.bannerTitleEn,
        bannerSubtitleTh: appSettings.bannerSubtitleTh,
        bannerSubtitleEn: appSettings.bannerSubtitleEn,
        bannerBgImage: appSettings.bannerBgImage,
        bannerItems: appSettings.bannerItems
      },
      btoa(JSON.stringify({ role: token.role }))
    );
    if(success) toast(lang === "th" ? "บันทึกแบนเนอร์เรียบร้อย" : "Banner saved successfully", "success");
  }

  function downloadBackup() {
    const text = exportJSON();
    const blob = new Blob([text], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `udomtong-species-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const MAX_JSON_MB = 5;

  async function handleImportFile(file: File) {
    if (file.size > MAX_JSON_MB * 1024 * 1024) { toast(`File too large (max ${MAX_JSON_MB} MB)`, "error"); return; }
    if (!confirm(lang === "th" ? "นำเข้าไฟล์จะทับข้อมูลเดิมทั้งหมด แน่ใจหรือไม่?" : "This will overwrite all existing data. Continue?")) return;
    const text = await file.text();
    const res  = await importJSON(text);
    if (!res.ok) { toast("Import failed: " + (res.error || ""), "error"); return; }
    toast(`Import success: ${res.count ?? 0} items`, "success");
  }

  async function handleMergeImportFile(file: File) {
    if (file.size > MAX_JSON_MB * 1024 * 1024) { toast(`File too large (max ${MAX_JSON_MB} MB)`, "error"); return; }
    if (!confirm(lang === "th" ? "ผสานข้อมูลกับของเดิม แน่ใจหรือไม่?" : "Merge data with existing? Continue?")) return;
    if (typeof mergeImportJSON !== "function") return;
    const text = await file.text();
    const res  = await mergeImportJSON(text);
    if (!res?.ok) { toast("Merge failed: " + (res?.error || ""), "error"); return; }
    toast(lang === "th" ? "ผสานข้อมูลสำเร็จ" : "Merge success", "success");
  }

  const t = {
    title:           lang === "th" ? "ตั้งค่าระบบ" : "System Settings",
    desc:            lang === "th" ? "ควบคุมและจัดการทุกส่วนของเว็บไซต์" : "Control and manage all aspects of the website",
    // Sections
    siteSection:     lang === "th" ? "ตั้งค่าเว็บไซต์" : "Website Settings",
    bannerSection:   lang === "th" ? "ตั้งค่าแบนเนอร์ประชาสัมพันธ์" : "Promo Banner Settings",
    appearSection:   lang === "th" ? "ธีมและการแสดงผล" : "Theme & Display",
    adminSection:    lang === "th" ? "จัดการผู้ดูแลระบบ" : "Admin Management",
    dataSection:     lang === "th" ? "ข้อมูลและสำรองข้อมูล" : "Data & Backup",
    recoverySection: lang === "th" ? "กู้คืนระบบ" : "System Recovery",
    apiSection:      lang === "th" ? "สถานะ API" : "API Status",
    // Fields
    siteName:        lang === "th" ? "ชื่อเว็บไซต์" : "Site Name",
    maintenance:     lang === "th" ? "โหมดปิดปรับปรุง" : "Maintenance Mode",
    maintenanceDesc: lang === "th" ? "เมื่อเปิด ผู้เยี่ยมชมจะเห็นหน้าปิดปรับปรุง" : "When on, visitors see a maintenance page",
    carouselCount:   lang === "th" ? "จำนวนสายพันธุ์ในแถบเลื่อน (หน้าหลัก)" : "Carousel species count (Home)",
    spotlightCount:  lang === "th" ? "จำนวนประชาสัมพันธ์แนะนำ (หน้าหลัก)" : "Spotlight count (Home)",
    btnSave:         lang === "th" ? "บันทึกการตั้งค่า" : "Save Settings",
    themeLight:      lang === "th" ? "โหมดสว่าง" : "Light Mode",
    themeDark:       lang === "th" ? "โหมดมืด" : "Dark Mode",
    toggleTheme:     lang === "th" ? "สลับธีม" : "Toggle Theme",
    loginAs:         lang === "th" ? "ล็อกอินด้วย:" : "Logged in as:",
    addAdmin:        lang === "th" ? "เพิ่มอีเมลผู้ดูแลระบบ" : "Add Admin Email",
    adminList:       lang === "th" ? "รายชื่อผู้ดูแลระบบ" : "Admin List",
    remove:          lang === "th" ? "ลบสิทธิ์" : "Remove",
    statDb:          lang === "th" ? "รายการในฐานข้อมูลปัจจุบัน" : "Current Database Records",
    items:           lang === "th" ? "รายการ" : "items",
    btnExport:       lang === "th" ? "ดาวน์โหลดไฟล์สำรอง" : "Export Backup",
    btnRestore:      lang === "th" ? "กู้คืน (ทับของเดิม)" : "Restore (Overwrite)",
    btnMerge:        lang === "th" ? "ผสานข้อมูล" : "Merge Data",
    recoveryDesc:    lang === "th" ? "กู้คืนข้อมูลสายพันธุ์ทั้งหมดกลับสู่ค่าเริ่มต้น" : "Restore all species data to system defaults",
    btnReset:        lang === "th" ? "คืนค่าเริ่มต้นฐานข้อมูล" : "Reset to Default Data",
    processing:      lang === "th" ? "กำลังดำเนินการ..." : "Processing...",
    checkApi:        lang === "th" ? "ตรวจสอบการเชื่อมต่อ" : "Check Connection",
    loginHistory:    lang === "th" ? "ประวัติการเข้าสู่ระบบ" : "Login History",
    lhEmail:         lang === "th" ? "อีเมล" : "Email",
    lhName:          lang === "th" ? "ชื่อ" : "Name",
    lhRole:          lang === "th" ? "บทบาท" : "Role",
    lhLoginAt:       lang === "th" ? "เวลาเข้า" : "Login",
    lhLogoutAt:      lang === "th" ? "เวลาออก" : "Logout",
    lhOnline:        lang === "th" ? "ออนไลน์" : "Online",
    lhRefresh:       lang === "th" ? "รีเฟรช" : "Refresh",
    lhEmpty:         lang === "th" ? "ยังไม่มีประวัติ" : "No history yet",
    apiOk:           lang === "th" ? "API ออนไลน์และพร้อมใช้งาน" : "API is online and ready",
    apiFail:         lang === "th" ? "ไม่สามารถเชื่อมต่อ API ได้" : "Cannot connect to API",
    apiChecking:     lang === "th" ? "กำลังตรวจสอบ..." : "Checking...",
    clearSearch:     lang === "th" ? "ล้างประวัติการค้นหาทั้งหมด" : "Clear All Search History",
    clearSearchDesc: lang === "th" ? "ลบประวัติการค้นหาของผู้ใช้ทุกคนในอุปกรณ์นี้" : "Remove search history stored in this device",
    btnClearSearch:  lang === "th" ? "ล้างประวัติการค้นหา" : "Clear Search History",
  };

  // ── Admin Profile save functions ──
  function saveProfileCache(patch: { avatar?: string; name?: string; nickname?: string; phone?: string; birthDate?: string }) {
    if (!user?.email) return;
    const key = `uf_profile_${user.email}`;
    const prev = JSON.parse(localStorage.getItem(key) || "{}");
    localStorage.setItem(key, JSON.stringify({ ...prev, ...patch }));
  }

  async function saveProfileAvatar(avatarVal: string) {
    const updated = { ...user, avatar: avatarVal };
    localStorage.setItem("user", JSON.stringify(updated));
    saveProfileCache({ avatar: avatarVal });
    window.dispatchEvent(new Event("auth-change"));
    setProfilePreview(avatarVal);
    setAvatarSaving(true);
    try {
      await fetch(`${API_BASE}/api/users/avatar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user!.email, avatar: avatarVal }),
      });
      setAvatarMsg(lang === "th" ? "บันทึกสำเร็จ!" : "Saved!");
    } catch {
      setAvatarMsg(lang === "th" ? "บันทึกสำเร็จ!" : "Saved!");
    } finally {
      setAvatarSaving(false);
      setTimeout(() => setAvatarMsg(""), 3000);
    }
  }

  function onProfileFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      toast(lang === "th" ? "รูปต้องไม่เกิน 500KB" : "Image must be under 500KB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => saveProfileAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function saveProfileInfo(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileInfoSaving(true); setProfileInfoMsg("");
    const name = editName.trim(), nickname = editNickname.trim(), phone = editPhone.trim(), birthDate = editBirth;
    try {
      await fetch(`${API_BASE}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user!.email, name, nickname, phone, birthDate }),
      });
      const updated = { ...user, name, nickname, phone, birthDate };
      localStorage.setItem("user", JSON.stringify(updated));
      saveProfileCache({ name, nickname, phone, birthDate });
      window.dispatchEvent(new Event("auth-change"));
      setProfileInfoMsg(lang === "th" ? "บันทึกสำเร็จ!" : "Saved!");
      setProfileEditMode(false);
    } catch {
      setProfileInfoMsg(lang === "th" ? "บันทึกสำเร็จ!" : "Saved!");
    } finally {
      setProfileInfoSaving(false);
      setTimeout(() => setProfileInfoMsg(""), 3000);
    }
  }

  // ── Founder Profile save functions ──
  function saveFounder(patch: Partial<FounderData>) {
    const prev = getFounderData();
    const next = { ...prev, ...patch };
    localStorage.setItem(FOUNDER_KEY, JSON.stringify(next));
    // sync local state
    if (patch.avatar  !== undefined) setFdAvatar(patch.avatar);
    if (patch.nameTh  !== undefined) setFdNameTh(patch.nameTh);
    if (patch.nameEn  !== undefined) setFdNameEn(patch.nameEn);
    if (patch.titleTh !== undefined) setFdTitleTh(patch.titleTh);
    if (patch.titleEn !== undefined) setFdTitleEn(patch.titleEn);
    if (patch.orgTh   !== undefined) setFdOrgTh(patch.orgTh);
    if (patch.orgEn   !== undefined) setFdOrgEn(patch.orgEn);
    if (patch.bioTh   !== undefined) setFdBioTh(patch.bioTh);
    if (patch.bioEn   !== undefined) setFdBioEn(patch.bioEn);
    if (patch.tagsTh  !== undefined) setFdTagsTh(patch.tagsTh);
    if (patch.tagsEn  !== undefined) setFdTagsEn(patch.tagsEn);
  }

  function onFounderFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast(lang === "th" ? "รูปต้องไม่เกิน 1MB" : "Image must be under 1MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => saveFounder({ avatar: ev.target?.result as string });
    reader.readAsDataURL(file);
  }

  function submitFounderInfo(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFounderSaving(true);
    saveFounder({ nameTh: fdNameTh, nameEn: fdNameEn, titleTh: fdTitleTh, titleEn: fdTitleEn, orgTh: fdOrgTh, orgEn: fdOrgEn, bioTh: fdBioTh, bioEn: fdBioEn, tagsTh: fdTagsTh, tagsEn: fdTagsEn });
    setFounderSaving(false);
    setFounderMsg(lang === "th" ? "บันทึกสำเร็จ!" : "Saved!");
    setFounderEditMode(false);
    setTimeout(() => setFounderMsg(""), 3000);
  }

  function resetFounderToDefault() {
    if (!confirm(lang === "th" ? "คืนค่าข้อมูลเจ้าของฟาร์มเป็นค่าเริ่มต้นหรือไม่?" : "Reset founder profile to defaults?")) return;
    localStorage.removeItem(FOUNDER_KEY);
    const d = FOUNDER_DEFAULTS;
    setFdAvatar(d.avatar); setFdNameTh(d.nameTh); setFdNameEn(d.nameEn);
    setFdTitleTh(d.titleTh); setFdTitleEn(d.titleEn); setFdOrgTh(d.orgTh); setFdOrgEn(d.orgEn);
    setFdBioTh(d.bioTh); setFdBioEn(d.bioEn); setFdTagsTh(d.tagsTh); setFdTagsEn(d.tagsEn);
    setFounderEditMode(false);
    setFounderMsg(lang === "th" ? "คืนค่าแล้ว" : "Reset done");
    setTimeout(() => setFounderMsg(""), 3000);
  }

  function clearAllSearchHistory() {
    localStorage.removeItem("uf_search_history");
    toast(lang === "th" ? "ล้างประวัติการค้นหาเรียบร้อย" : "Search history cleared", "success");
  }

  const founderAvatarIsImg = fdAvatar.startsWith("data:") || fdAvatar.startsWith("http");
  const profileIsUrl   = profilePreview.startsWith("http");
  const profileIsEmoji = profilePreview.length <= 4 && !profilePreview.startsWith("data:");
  const profileAge     = calcAge(editBirth || (user as { birthDate?: string })?.birthDate || "");

  return (
    <div className="fade-in-up" style={{ maxWidth: 900, paddingBottom: 60 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-main)", margin: "0 0 6px" }}>{t.title}</h1>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>{t.desc}</p>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-color)", overflowX: "auto", WebkitOverflowScrolling: "touch", padding: "4px" }}>
        {[
          { id: "profile", label: lang === "th" ? "โปรไฟล์ของฉัน" : "My Profile", icon: <IconUser /> },
          { id: "users", label: lang === "th" ? "จัดการผู้ใช้งาน" : "Manage Users", icon: <IconShield /> },
          { id: "gallery", label: lang === "th" ? "จัดการแกลเลอรี" : "Gallery", icon: <IconImage /> },
          { id: "logs", label: lang === "th" ? "ประวัติการเข้าใช้งาน" : "Activity Logs", icon: <IconHistory /> },
          { id: "settings", label: lang === "th" ? "ตั้งค่าระบบ" : "System Settings", icon: <IconGlobe /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "profile" | "users" | "gallery" | "logs" | "settings")}
            className={`admin-tab-btn${activeTab === tab.id ? " active" : ""}`}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 12,
              background: activeTab === tab.id ? "var(--primary)" : "var(--card-bg)",
              color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
              border: `1px solid ${activeTab === tab.id ? "var(--primary)" : "var(--border-color)"}`,
              fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
              transition: "all 0.25s ease", whiteSpace: "nowrap",
              boxShadow: activeTab === tab.id ? "var(--shadow-primary)" : "none",
              transform: activeTab === tab.id ? "translateY(-1px)" : "none",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Profile ── */}
      {activeTab === "profile" && (
        <div className="fade-in-up">
          {/* Admin Profile */}
      <Section title={lang === "th" ? "โปรไฟล์แอดมิน" : "Admin Profile"} icon={<IconUser />}>
        {/* Avatar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: 12 }}>
            {lang === "th" ? "รูปโปรไฟล์" : "Profile Picture"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: profileIsUrl || profilePreview.startsWith("data:") ? "transparent" : "var(--primary)",
              border: "3px solid var(--border-color)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0,
              fontSize: profileIsEmoji ? 36 : 28, fontWeight: 900, color: "#fff",
            }}>
              {profilePreview.startsWith("data:") || profileIsUrl ? (
                <img src={profilePreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : profilePreview ? (
                <span>{profilePreview}</span>
              ) : (
                <span style={{ fontSize: 24 }}>{user?.name?.[0]?.toUpperCase() ?? "A"}</span>
              )}
            </div>
            <div>
              {avatarMsg && <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-hover)", marginBottom: 4 }}>{avatarMsg}</div>}
              {avatarSaving && <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{lang === "th" ? "กำลังบันทึก..." : "Saving..."}</div>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <button onClick={() => setShowEmojiPicker((v) => !v)}
              style={{ ...ghostBtn, background: showEmojiPicker ? "var(--primary-light)" : "var(--card-bg)" }}>
              {lang === "th" ? "เลือกอีโมจิ" : "Pick Emoji"}
            </button>
            <button onClick={() => profileFileRef.current?.click()} style={ghostBtn}>
              {lang === "th" ? "อัปโหลดรูป" : "Upload Image"}
            </button>
            <input ref={profileFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onProfileFileChange} />
          </div>
          {showEmojiPicker && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 16, background: "var(--bg-color)", borderRadius: 12, border: "1px solid var(--border-color)" }}>
              {EMOJI_LIST.map((e) => (
                <button key={e} onClick={() => { saveProfileAvatar(e); setShowEmojiPicker(false); }}
                  style={{ width: 42, height: 42, borderRadius: 10, border: profilePreview === e ? "2px solid var(--primary)" : "1px solid var(--border-color)", background: profilePreview === e ? "var(--primary-light)" : "var(--card-bg)", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Personal Info */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.88rem" }}>
              {lang === "th" ? "ข้อมูลส่วนตัว" : "Personal Info"}
            </div>
            {!profileEditMode && (
              <button onClick={() => setProfileEditMode(true)} style={ghostBtn}>
                {lang === "th" ? "แก้ไขข้อมูล" : "Edit Info"}
              </button>
            )}
          </div>

          {!profileEditMode ? (
            <div>
              <AdminInfoRow label={lang === "th" ? "ชื่อ-นามสกุล" : "Full Name"} value={user?.name || "-"} />
              <AdminInfoRow label={lang === "th" ? "ชื่อเล่น" : "Nickname"} value={(user as { nickname?: string })?.nickname || "-"} />
              <AdminInfoRow label={lang === "th" ? "เบอร์โทรศัพท์" : "Phone"} value={(user as { phone?: string })?.phone || "-"} />
              <AdminInfoRow label={lang === "th" ? "วันเกิด" : "Date of Birth"} value={(user as { birthDate?: string })?.birthDate ? new Date((user as { birthDate?: string }).birthDate!).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB") : "-"} />
              {profileAge !== null && <AdminInfoRow label={lang === "th" ? "อายุ" : "Age"} value={`${profileAge} ${lang === "th" ? "ปี" : "years old"}`} />}
              <AdminInfoRow label={lang === "th" ? "อีเมล" : "Email"} value={user?.email || "-"} last />
              {profileInfoMsg && <div style={{ marginTop: 12, fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-hover)" }}>{profileInfoMsg}</div>}
            </div>
          ) : (
            <form onSubmit={saveProfileInfo} style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "ชื่อ-นามสกุล" : "Full Name"}</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} required style={profileInputStyle} />
              </div>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "ชื่อเล่น" : "Nickname"}</label>
                <input value={editNickname} onChange={(e) => setEditNickname(e.target.value)} style={profileInputStyle} />
              </div>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "เบอร์โทรศัพท์" : "Phone"}</label>
                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} type="tel" style={profileInputStyle} />
              </div>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "วันเกิด" : "Date of Birth"}</label>
                <input value={editBirth} onChange={(e) => setEditBirth(e.target.value)} type="date" style={profileInputStyle} />
                {editBirth && calcAge(editBirth) !== null && (
                  <div style={{ marginTop: 6, fontSize: "0.85rem", color: "var(--primary-hover)", fontWeight: 700 }}>
                    {lang === "th" ? "อายุ" : "Age"}: {calcAge(editBirth)} {lang === "th" ? "ปี" : "years old"}
                  </div>
                )}
              </div>
              {profileInfoMsg && <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-hover)" }}>{profileInfoMsg}</div>}
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" disabled={profileInfoSaving} className="btn-primary" style={{ flex: 1, padding: "11px", borderRadius: 12 }}>
                  {profileInfoSaving ? (lang === "th" ? "กำลังบันทึก..." : "Saving...") : (lang === "th" ? "บันทึกข้อมูล" : "Save Info")}
                </button>
                <button type="button"
                  onClick={() => { setProfileEditMode(false); setEditName(user?.name ?? ""); const eUser = user as { nickname?: string, phone?: string, birthDate?: string } | null; setEditNickname(eUser?.nickname ?? ""); setEditPhone(eUser?.phone ?? ""); setEditBirth(eUser?.birthDate ?? ""); }}
                  style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer" }}>
                  {lang === "th" ? "ยกเลิก" : "Cancel"}
                </button>
              </div>
            </form>
          )}
        </div>
      </Section>

      {/* ── 1. Founder Profile ── */}
      <Section title={lang === "th" ? "ข้อมูลเจ้าของฟาร์ม" : "Farm Owner Profile"} icon={<IconFarm />}>
        {/* Avatar preview + upload */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 18, flexShrink: 0,
            background: founderAvatarIsImg ? "transparent" : "var(--primary)",
            border: "2px solid var(--border-color)", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: fdAvatar.length <= 4 && !founderAvatarIsImg ? 36 : 28, fontWeight: 900, color: "#fff",
          }}>
            {founderAvatarIsImg
              ? <img src={fdAvatar} alt="founder" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span>{fdAvatar}</span>}
          </div>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
              {lang === "th" ? "รูปเจ้าของฟาร์ม (อัปโหลดรูปหรือใส่ตัวอักษร)" : "Owner photo (upload or set initial)"}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={ghostBtn} onClick={() => founderFileRef.current?.click()}>
                <IconUpload /> {lang === "th" ? "อัปโหลดรูป" : "Upload Photo"}
              </button>
              <input ref={founderFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFounderFileChange} />
              <button
                style={{ ...ghostBtn, background: showFounderEmojiPicker ? "var(--primary-light)" : undefined }}
                onClick={() => setShowFounderEmojiPicker((v) => !v)}>
                {lang === "th" ? "เลือกอีโมจิ" : "Pick Emoji"}
              </button>
              <input
                value={founderAvatarIsImg ? "" : fdAvatar}
                onChange={(e) => saveFounder({ avatar: e.target.value })}
                placeholder={lang === "th" ? "ตัวอักษร เช่น ธ" : "Initial e.g. T"}
                style={{ ...inputStyle, width: 80, textAlign: "center", fontSize: "1.1rem", fontWeight: 900 }}
              />
              {founderAvatarIsImg && (
                <button style={ghostBtn} onClick={() => saveFounder({ avatar: FOUNDER_DEFAULTS.avatar })}>
                  {lang === "th" ? "ล้างรูป" : "Clear"}
                </button>
              )}
            </div>
            {showFounderEmojiPicker && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 16, marginTop: 10, background: "var(--bg-color)", borderRadius: 12, border: "1px solid var(--border-color)" }}>
                {EMOJI_LIST.map((e) => (
                  <button key={e} onClick={() => { saveFounder({ avatar: e }); setShowFounderEmojiPicker(false); }}
                    style={{ width: 44, height: 44, borderRadius: 10, border: fdAvatar === e ? "2px solid var(--primary)" : "1px solid var(--border-color)", background: fdAvatar === e ? "var(--primary-light)" : "var(--card-bg)", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View / Edit toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12, gap: 10 }}>
          {founderMsg && <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-hover)", alignSelf: "center" }}>{founderMsg}</span>}
          {!founderEditMode ? (
            <button style={ghostBtn} onClick={() => setFounderEditMode(true)}>
              {lang === "th" ? "แก้ไขข้อมูล" : "Edit Info"}
            </button>
          ) : (
            <button style={ghostBtn} onClick={resetFounderToDefault}>
              {lang === "th" ? "คืนค่าเริ่มต้น" : "Reset to Default"}
            </button>
          )}
        </div>

        {!founderEditMode ? (
          /* ── View mode ── */
          <div style={{ display: "grid", gap: 0 }}>
            {lang === "en" ? (<>
              <AdminInfoRow label="Name (EN)" value={fdNameEn} />
              <AdminInfoRow label="Name (TH)" value={fdNameTh} />
              <AdminInfoRow label="Title (EN)" value={fdTitleEn} />
              <AdminInfoRow label="Title (TH)" value={fdTitleTh} />
              <AdminInfoRow label="Org (EN)" value={fdOrgEn} />
              <AdminInfoRow label="Org (TH)" value={fdOrgTh} />
              <AdminInfoRow label="Tags (EN)" value={fdTagsEn} />
              <AdminInfoRow label="Tags (TH)" value={fdTagsTh} last />
            </>) : (<>
              <AdminInfoRow label="ชื่อ (ไทย)" value={fdNameTh} />
              <AdminInfoRow label="ชื่อ (อังกฤษ)" value={fdNameEn} />
              <AdminInfoRow label="ตำแหน่ง (ไทย)" value={fdTitleTh} />
              <AdminInfoRow label="ตำแหน่ง (อังกฤษ)" value={fdTitleEn} />
              <AdminInfoRow label="หน่วยงาน (ไทย)" value={fdOrgTh} />
              <AdminInfoRow label="หน่วยงาน (อังกฤษ)" value={fdOrgEn} />
              <AdminInfoRow label="แท็ก (ไทย)" value={fdTagsTh} />
              <AdminInfoRow label="แท็ก (อังกฤษ)" value={fdTagsEn} last />
            </>)}
          </div>
        ) : (
          /* ── Edit mode ── */
          <form onSubmit={submitFounderInfo} style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "ชื่อ (ไทย)" : "Name (TH)"}</label>
                <input value={fdNameTh} onChange={(e) => setFdNameTh(e.target.value)} style={profileInputStyle} required />
              </div>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "ชื่อ (อังกฤษ)" : "Name (EN)"}</label>
                <input value={fdNameEn} onChange={(e) => setFdNameEn(e.target.value)} style={profileInputStyle} required />
              </div>
            </div>
            <div>
              <label style={profileLabelStyle}>{lang === "th" ? "ตำแหน่ง (ไทย)" : "Title (TH)"}</label>
              <input value={fdTitleTh} onChange={(e) => setFdTitleTh(e.target.value)} style={profileInputStyle} />
            </div>
            <div>
              <label style={profileLabelStyle}>{lang === "th" ? "ตำแหน่ง (อังกฤษ)" : "Title (EN)"}</label>
              <input value={fdTitleEn} onChange={(e) => setFdTitleEn(e.target.value)} style={profileInputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "หน่วยงาน (ไทย)" : "Org (TH)"}</label>
                <input value={fdOrgTh} onChange={(e) => setFdOrgTh(e.target.value)} style={profileInputStyle} />
              </div>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "หน่วยงาน (อังกฤษ)" : "Org (EN)"}</label>
                <input value={fdOrgEn} onChange={(e) => setFdOrgEn(e.target.value)} style={profileInputStyle} />
              </div>
            </div>
            <div>
              <label style={profileLabelStyle}>{lang === "th" ? "ประวัติย่อ (ไทย)" : "Bio (TH)"}</label>
              <textarea value={fdBioTh} onChange={(e) => setFdBioTh(e.target.value)} rows={4}
                style={{ ...profileInputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={profileLabelStyle}>{lang === "th" ? "ประวัติย่อ (อังกฤษ)" : "Bio (EN)"}</label>
              <textarea value={fdBioEn} onChange={(e) => setFdBioEn(e.target.value)} rows={4}
                style={{ ...profileInputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "แท็ก ไทย (คั่นด้วย ,)" : "Tags TH (comma separated)"}</label>
                <input value={fdTagsTh} onChange={(e) => setFdTagsTh(e.target.value)} style={profileInputStyle} placeholder="นโยบาย AI,Big Data" />
              </div>
              <div>
                <label style={profileLabelStyle}>{lang === "th" ? "แท็ก อังกฤษ (คั่นด้วย ,)" : "Tags EN (comma separated)"}</label>
                <input value={fdTagsEn} onChange={(e) => setFdTagsEn(e.target.value)} style={profileInputStyle} placeholder="AI Policy,Big Data" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={founderSaving} className="btn-primary" style={{ flex: 1, padding: "11px", borderRadius: 12 }}>
                {founderSaving ? (lang === "th" ? "กำลังบันทึก..." : "Saving...") : (lang === "th" ? "บันทึกข้อมูล" : "Save Info")}
              </button>
              <button type="button"
                onClick={() => { setFounderEditMode(false); const d = getFounderData(); setFdNameTh(d.nameTh); setFdNameEn(d.nameEn); setFdTitleTh(d.titleTh); setFdTitleEn(d.titleEn); setFdOrgTh(d.orgTh); setFdOrgEn(d.orgEn); setFdBioTh(d.bioTh); setFdBioEn(d.bioEn); setFdTagsTh(d.tagsTh); setFdTagsEn(d.tagsEn); }}
                style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer" }}>
                {lang === "th" ? "ยกเลิก" : "Cancel"}
              </button>
            </div>
          </form>
        )}
      </Section>
      </div>
      )}

      {/* ── Tab: Gallery ── */}
      {activeTab === "gallery" && (
      <div className="fade-in-up">
        <Section title={lang === "th" ? "เพิ่มรูปภาพในแกลเลอรี" : "Add Gallery Image"} icon={<IconImage />}>
          {/* Mode switch */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {(["url", "upload"] as const).map(m => (
              <button key={m} onClick={() => { setGalAddMode(m); setGalImgPreview(""); setGalUrlInput(""); }}
                style={{ ...ghostBtn, background: galAddMode === m ? "var(--primary-light)" : "var(--card-bg)", color: galAddMode === m ? "var(--primary-hover)" : "var(--text-muted)", border: `1px solid ${galAddMode === m ? "var(--primary)" : "var(--border-color)"}` }}>
                {m === "url" ? (lang === "th" ? "ใส่ URL รูป" : "Image URL") : (lang === "th" ? "อัปโหลดรูป" : "Upload File")}
              </button>
            ))}
          </div>

          {galAddMode === "url" ? (
            <div style={{ marginBottom: 16 }}>
              <label style={profileLabelStyle}>{lang === "th" ? "URL รูปภาพ" : "Image URL"}</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input value={galUrlInput} onChange={e => { setGalUrlInput(e.target.value); setGalImgPreview(e.target.value); }}
                  placeholder="https://example.com/image.jpg" style={{ ...profileInputStyle, flex: 1 }} />
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => galleryImgRef.current?.click()} style={ghostBtn}>
                <IconUpload /> {lang === "th" ? "เลือกรูปภาพ" : "Choose Image"}
              </button>
              <input ref={galleryImgRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 1024 * 1024) { toast(lang === "th" ? "รูปต้องไม่เกิน 1MB" : "Image must be under 1MB", "error"); return; }
                  const reader = new FileReader();
                  reader.onload = ev => setGalImgPreview(ev.target?.result as string);
                  reader.readAsDataURL(file);
                  e.currentTarget.value = "";
                }} />
            </div>
          )}

          {/* Preview */}
          {galImgPreview && (
            <div style={{ marginBottom: 16 }}>
              <img src={galImgPreview} alt="preview"
                style={{ width: 180, height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border-color)" }}
                onError={() => setGalImgPreview("")} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={profileLabelStyle}>{lang === "th" ? "ชื่อภาพ (ไทย)" : "Title (TH)"}</label>
              <input value={galTitleTh} onChange={e => setGalTitleTh(e.target.value)} style={profileInputStyle} placeholder="ชื่อภาพ" />
            </div>
            <div>
              <label style={profileLabelStyle}>{lang === "th" ? "ชื่อภาพ (อังกฤษ)" : "Title (EN)"}</label>
              <input value={galTitleEn} onChange={e => setGalTitleEn(e.target.value)} style={profileInputStyle} placeholder="Image title" />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={profileLabelStyle}>{lang === "th" ? "หมวดหมู่" : "Category"}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["animal", "plant", "other"] as const).map(c => (
                <button key={c} onClick={() => setGalCategory(c)}
                  style={{ ...ghostBtn, background: galCategory === c ? "var(--primary)" : "var(--card-bg)", color: galCategory === c ? "#fff" : "var(--text-muted)", border: `1px solid ${galCategory === c ? "var(--primary)" : "var(--border-color)"}` }}>
                  {c === "animal" ? "🐾 " : c === "plant" ? "🌿 " : "🖼️ "}
                  {c === "animal" ? (lang === "th" ? "สัตว์" : "Animal") : c === "plant" ? (lang === "th" ? "พืช" : "Plant") : (lang === "th" ? "ทั่วไป" : "General")}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary"
            disabled={!galImgPreview}
            onClick={() => {
              if (!galImgPreview) return;
              addGalleryItem({ image: galImgPreview, titleTh: galTitleTh || (lang === "th" ? "ภาพฟาร์ม" : "Farm Photo"), titleEn: galTitleEn || "Farm Photo", category: galCategory });
              setGalImgPreview(""); setGalUrlInput(""); setGalTitleTh(""); setGalTitleEn(""); setGalCategory("other");
            }}
            style={{ padding: "11px 28px", borderRadius: 12, opacity: !galImgPreview ? 0.5 : 1 }}>
            + {lang === "th" ? "เพิ่มรูปในแกลเลอรี" : "Add to Gallery"}
          </button>
        </Section>

        <Section title={lang === "th" ? `รูปในแกลเลอรีทั้งหมด (${galleryItems.length})` : `Gallery Images (${galleryItems.length})`} icon={<IconImage />}>
          {galleryItems.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{lang === "th" ? "ยังไม่มีรูปในแกลเลอรี" : "No gallery images yet"}</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
              {galleryItems.map(item => (
                <div key={item.id} style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-color)", background: "var(--card-bg)" }}>
                  <img src={item.image} alt={item.titleTh} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {lang === "th" ? item.titleTh : item.titleEn}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                      {item.category === "animal" ? "🐾" : item.category === "plant" ? "🌿" : "🖼️"} {item.category}
                    </div>
                  </div>
                  <button
                    onClick={() => { if (confirm(lang === "th" ? "ลบรูปนี้ออกจากแกลเลอรี?" : "Remove this image from gallery?")) removeGalleryItem(item.id); }}
                    style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "#dc2626", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}
                    title={lang === "th" ? "ลบรูปนี้" : "Delete"}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
      )}

      {/* ── Tab: Settings ── */}
      {activeTab === "settings" && (
      <div className="fade-in-up">
      {/* ── 2. Website Settings ── */}
      <Section title={t.siteSection} icon={<IconGlobe />}>
        <div style={{ display: "grid", gap: 16 }}>
          <FieldRow label={t.siteName}>
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)}
              style={inputStyle} />
          </FieldRow>
          <FieldRow label={t.carouselCount}>
            <input type="number" min={4} max={30} value={carouselCount} onChange={(e) => setCarouselCount(Number(e.target.value))}
              style={{ ...inputStyle, width: 90 }} />
          </FieldRow>
          <FieldRow label={t.spotlightCount}>
            <input type="number" min={1} max={6} value={spotlightCount} onChange={(e) => setSpotlightCount(Number(e.target.value))}
              style={{ ...inputStyle, width: 90 }} />
          </FieldRow>
          <FieldRow label={t.maintenance} desc={t.maintenanceDesc}>
            <Toggle checked={maintenanceMode} onChange={setMaintenance} />
          </FieldRow>
          <button className="btn-primary" onClick={saveSite} style={{ width: "fit-content", padding: "10px 28px", borderRadius: 12 }}>
            {t.btnSave}
          </button>
        </div>
      </Section>

      {/* ── 2.5 Promo Banner ── */}
      <Section title={t.bannerSection} icon={<IconStar />}>
        <div style={{ display: "grid", gap: 16 }}>
          <FieldRow label={lang === "th" ? "หัวข้อหลัก (TH)" : "Main Title (TH)"}>
            <input value={appSettings.bannerTitleTh} onChange={(e) => useAppSettingsStore.setState({ bannerTitleTh: e.target.value })} style={inputStyle} />
          </FieldRow>
          <FieldRow label={lang === "th" ? "หัวข้อหลัก (EN)" : "Main Title (EN)"}>
            <input value={appSettings.bannerTitleEn} onChange={(e) => useAppSettingsStore.setState({ bannerTitleEn: e.target.value })} style={inputStyle} />
          </FieldRow>
          <FieldRow label={lang === "th" ? "คำอธิบายรอง (TH)" : "Subtitle (TH)"}>
            <textarea value={appSettings.bannerSubtitleTh} onChange={(e) => useAppSettingsStore.setState({ bannerSubtitleTh: e.target.value })} style={{ ...inputStyle, minHeight: 60 }} />
          </FieldRow>
          <FieldRow label={lang === "th" ? "คำอธิบายรอง (EN)" : "Subtitle (EN)"}>
            <textarea value={appSettings.bannerSubtitleEn} onChange={(e) => useAppSettingsStore.setState({ bannerSubtitleEn: e.target.value })} style={{ ...inputStyle, minHeight: 60 }} />
          </FieldRow>
          <FieldRow label={lang === "th" ? "URL รูปพื้นหลัง (ไม่บังคับ)" : "Background Image URL (Optional)"}>
            <input value={appSettings.bannerBgImage} onChange={(e) => useAppSettingsStore.setState({ bannerBgImage: e.target.value })} style={inputStyle} placeholder="https://..." />
          </FieldRow>
          
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{lang === "th" ? "หัวข้อย่อยในแบนเนอร์" : "Banner Items"}</div>
              <button 
                onClick={() => useAppSettingsStore.setState({ bannerItems: [...appSettings.bannerItems, { id: Date.now().toString(), icon: "🌟", titleTh: "", titleEn: "", descTh: "", descEn: "" }] })}
                className="btn-primary" 
                style={{ padding: "6px 16px", borderRadius: 8, fontSize: "0.85rem" }}
              >
                + {lang === "th" ? "เพิ่มหัวข้อ" : "Add Item"}
              </button>
            </div>
            
            <div style={{ display: "grid", gap: 16 }}>
              {appSettings.bannerItems.map((item, idx) => (
                <div key={item.id} style={{ padding: 16, background: "var(--bg-color)", border: "1px solid var(--border-color)", borderRadius: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Item {idx + 1}</div>
                    <button onClick={() => useAppSettingsStore.setState({ bannerItems: appSettings.bannerItems.filter(i => i.id !== item.id) })} style={{ color: "var(--danger)", background: "transparent", border: "none", cursor: "pointer", fontWeight: 700 }}>X</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>Icon/Emoji</div>
                      <input value={item.icon} onChange={(e) => {
                        const newItems = [...appSettings.bannerItems];
                        newItems[idx].icon = e.target.value;
                        useAppSettingsStore.setState({ bannerItems: newItems });
                      }} style={{ ...inputStyle, width: 60, textAlign: "center", fontSize: "1.2rem" }} />
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      <input placeholder={lang === "th" ? "หัวข้อ (TH)" : "Title (TH)"} value={item.titleTh} onChange={(e) => {
                        const newItems = [...appSettings.bannerItems]; newItems[idx].titleTh = e.target.value; useAppSettingsStore.setState({ bannerItems: newItems });
                      }} style={inputStyle} />
                      <input placeholder={lang === "th" ? "หัวข้อ (EN)" : "Title (EN)"} value={item.titleEn} onChange={(e) => {
                        const newItems = [...appSettings.bannerItems]; newItems[idx].titleEn = e.target.value; useAppSettingsStore.setState({ bannerItems: newItems });
                      }} style={inputStyle} />
                      <input placeholder={lang === "th" ? "รายละเอียด (TH)" : "Description (TH)"} value={item.descTh} onChange={(e) => {
                        const newItems = [...appSettings.bannerItems]; newItems[idx].descTh = e.target.value; useAppSettingsStore.setState({ bannerItems: newItems });
                      }} style={inputStyle} />
                      <input placeholder={lang === "th" ? "รายละเอียด (EN)" : "Description (EN)"} value={item.descEn} onChange={(e) => {
                        const newItems = [...appSettings.bannerItems]; newItems[idx].descEn = e.target.value; useAppSettingsStore.setState({ bannerItems: newItems });
                      }} style={inputStyle} />
                    </div>
                  </div>
                </div>
              ))}
              {appSettings.bannerItems.length === 0 && (
                <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", border: "1px dashed var(--border-color)", borderRadius: 12 }}>
                  {lang === "th" ? "ยังไม่มีหัวข้อย่อย" : "No banner items added"}
                </div>
              )}
            </div>
          </div>
          <button className="btn-primary" onClick={savePromoBanner} disabled={appSettings.loading} style={{ width: "fit-content", padding: "10px 28px", borderRadius: 12, marginTop: 12 }}>
            {appSettings.loading ? t.processing : t.btnSave}
          </button>
        </div>
      </Section>

      {/* ── 2. Theme & Display ── */}
      <Section title={t.appearSection} icon={<IconPalette />}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {lang === "th" ? "ธีมปัจจุบัน:" : "Current theme:"}{" "}
            <strong style={{ color: "var(--text-main)" }}>{theme === "light" ? t.themeLight : t.themeDark}</strong>
          </div>
          <button onClick={toggleTheme} style={ghostBtn}>
            <IconMoon /> {t.toggleTheme}
          </button>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>{t.clearSearch}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: 10 }}>{t.clearSearchDesc}</div>
          <button onClick={clearAllSearchHistory} style={ghostBtn}>
            <IconX /> {t.btnClearSearch}
          </button>
        </div>
      </Section>

      {/* ── 3. API Status ── */}
      <Section title={t.apiSection} icon={<IconServer />}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: apiStatus === "ok" ? "var(--primary-light)" : apiStatus === "fail" ? "#fee2e2" : "var(--bg-color)", border: "1px solid var(--border-color)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: apiStatus === "ok" ? "var(--primary)" : apiStatus === "fail" ? "#ef4444" : "var(--text-muted)" }} />
            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: apiStatus === "ok" ? "var(--primary-hover)" : apiStatus === "fail" ? "#991b1b" : "var(--text-muted)" }}>
              {apiStatus === "ok" ? t.apiOk : apiStatus === "fail" ? t.apiFail : t.apiChecking}
            </span>
          </div>
          <button onClick={checkApi} style={ghostBtn}><IconRefresh /> {t.checkApi}</button>
        </div>
        <div style={{ marginTop: 10, fontSize: "0.82rem", color: "var(--text-muted)" }}>
          {API_BASE}
        </div>
      </Section>

      {/* ── 4. Database stat ── */}
      <Section title={t.statDb} icon={<IconDb />}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: "var(--text-main)" }}>{items.length}</span>
          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{t.items}</span>
        </div>
      </Section>

      {/* ── 5. Admin Management ── */}
      <Section title={t.adminSection} icon={<IconShield />}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="example@email.com"
            style={{ flex: 1, ...inputStyle }}
            onKeyDown={(e) => e.key === "Enter" && addEmail()}
          />
          <button className="btn-primary" onClick={addEmail} style={{ padding: "0 22px", borderRadius: 12 }}>
            {lang === "th" ? "เพิ่ม" : "Add"}
          </button>
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 16 }}>
          {t.loginAs} <strong>{user?.email}</strong>
        </div>
        <div style={{ border: "1px solid var(--border-color)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", background: "var(--bg-color)", fontWeight: 800, fontSize: "0.85rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {t.adminList}
          </div>
          {adminsList.map((admin) => (
            <div key={admin.email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 20px", borderBottom: "1px solid var(--border-color)" }}>
              <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>
                {admin.email}
                {admin.email === ADMIN_EMAILS[0] && <span style={{ color: "var(--primary-hover)", marginLeft: 8, fontSize: "0.78rem", fontWeight: 800 }}>(Owner)</span>}
              </div>
              <button onClick={() => removeEmail(admin.email)} disabled={admin.email === ADMIN_EMAILS[0]}
                style={{ ...ghostBtn, opacity: admin.email === ADMIN_EMAILS[0] ? 0.3 : 1, fontSize: "0.85rem", padding: "6px 14px" }}>
                {t.remove}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 6. Data & Backup ── */}
      <Section title={t.dataSection} icon={<IconArchive />}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={downloadBackup} style={{ padding: "10px 20px", borderRadius: 12, fontSize: "0.9rem" }}>
            <IconDownload /> {t.btnExport}
          </button>
          <button style={ghostBtn} onClick={() => fileRestoreRef.current?.click()}><IconUpload /> {t.btnRestore}</button>
          <button style={ghostBtn} onClick={() => fileMergeRef.current?.click()}><IconMerge /> {t.btnMerge}</button>
        </div>
        <input ref={fileRestoreRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); e.currentTarget.value = ""; }} />
        <input ref={fileMergeRef}   type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMergeImportFile(f); e.currentTarget.value = ""; }} />
      </Section>
      
      {/* ── 10. System Recovery ── */}
      <Section title={t.recoverySection} icon={<IconReset />} danger>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>{t.recoveryDesc}</p>
        <button onClick={resetToSeed} disabled={loading}
          style={{ padding: "13px 28px", borderRadius: 12, border: "none", background: "#dc2626", color: "#fff", fontWeight: 800, cursor: "pointer", opacity: loading ? 0.6 : 1, fontSize: "0.95rem" }}>
          {loading ? t.processing : t.btnReset}
        </button>
      </Section>
      </div>
      )}

      {/* ── Tab: Logs ── */}
      {activeTab === "logs" && (
      <div className="fade-in-up">
      {/* ── 7. Login History ── */}
      <Section title={t.loginHistory} icon={<IconHistory />}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--primary-hover)", fontWeight: 700 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", display: "inline-block", animation: "pulse 2s infinite" }} />
            {lang === "th" ? "อัปเดตอัตโนมัติทุก 30 วิ" : "Auto-updates every 30s"}
          </div>
          <button onClick={fetchSessions} style={ghostBtn}><IconRefresh /> {t.lhRefresh}</button>
        </div>
        {sessions.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{t.lhEmpty}</p>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 70px 1fr 1fr", padding: "10px 16px", background: "var(--bg-color)", borderBottom: "1px solid var(--border-color)", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              <span>{t.lhEmail}</span><span>{t.lhName}</span><span>{t.lhRole}</span><span>{t.lhLoginAt}</span><span>{t.lhLogoutAt}</span>
            </div>
            {sessions.map((s) => (
              <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 70px 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem", alignItems: "center" }}>
                <span style={{ color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.user_email}</span>
                <span style={{ color: "var(--text-muted)" }}>{s.user_name || "-"}</span>
                <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, background: s.role === "admin" ? "#fee2e2" : "var(--primary-light)", color: s.role === "admin" ? "#991b1b" : "var(--primary-hover)", width: "fit-content" }}>{s.role}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(s.login_at).toLocaleString()}</span>
                <span style={{ color: s.logout_at ? "var(--text-muted)" : "var(--primary-hover)", fontSize: "0.8rem", fontWeight: s.logout_at ? 400 : 700 }}>
                  {s.logout_at ? new Date(s.logout_at).toLocaleString() : `● ${t.lhOnline}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── 9. Password Change Log ── */}
      <Section title={lang === "th" ? "ประวัติการเปลี่ยนรหัสผ่าน" : "Password Change History"} icon={<IconHistory />}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {lang === "th" ? `${pwLogs.length} รายการล่าสุด` : `${pwLogs.length} recent entries`}
          </span>
          <button onClick={fetchPwLogs} style={ghostBtn}><IconRefresh /> {lang === "th" ? "รีเฟรช" : "Refresh"}</button>
        </div>
        {pwLogs.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{lang === "th" ? "ยังไม่มีการเปลี่ยนรหัสผ่าน" : "No password changes yet"}</p>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", padding: "10px 16px", background: "var(--bg-color)", borderBottom: "1px solid var(--border-color)", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              <span>{lang === "th" ? "อีเมล" : "Email"}</span>
              <span>{lang === "th" ? "เวลาที่เปลี่ยน" : "Changed At"}</span>
            </div>
            {pwLogs.map((log) => (
              <div key={log.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", padding: "10px 16px", borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem", alignItems: "center" }}>
                <span style={{ color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.email}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(log.changed_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
      </div>
      )}

      {/* ── Tab: Users ── */}
      {activeTab === "users" && (
      <div className="fade-in-up">
      {/* ── 8. All Users ── */}
      <Section title={lang === "th" ? "ผู้ใช้ทั้งหมด" : "All Users"} icon={<IconUser />}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {lang === "th" ? `ทั้งหมด ${allUsers.length} คน` : `${allUsers.length} users total`}
          </span>
          <button onClick={fetchAllUsers} style={ghostBtn}><IconRefresh /> {lang === "th" ? "รีเฟรช" : "Refresh"}</button>
        </div>
        {allUsers.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{lang === "th" ? "ไม่มีข้อมูล" : "No users found"}</p>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px", padding: "10px 16px", background: "var(--bg-color)", borderBottom: "1px solid var(--border-color)", fontSize: "0.78rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              <span>{lang === "th" ? "อีเมล / ชื่อ" : "Email / Name"}</span>
              <span>{lang === "th" ? "เบอร์โทร" : "Phone"}</span>
              <span>{lang === "th" ? "ยืนยันแล้ว" : "Verified"}</span>
              <span>{lang === "th" ? "สถานะ" : "Status"}</span>
            </div>
            {allUsers.map((u) => {
              const isOnline = sessions.some(s => s.user_email === u.email && !s.logout_at);
              return (
                <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px", padding: "10px 16px", borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {u.avatar ? (
                      <img src={u.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                        {u.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <div style={{ color: "var(--text-main)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{u.name || "-"}{u.nickname ? ` (${u.nickname})` : ""}</div>
                    </div>
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{u.phone || "-"}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: u.is_verified ? "#16a34a" : "#dc2626" }}>
                    {u.is_verified ? (lang === "th" ? "✓ ยืนยันแล้ว" : "✓ Verified") : (lang === "th" ? "✗ ยังไม่ยืนยัน" : "✗ Unverified")}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", fontWeight: 700, color: isOnline ? "var(--primary-hover)" : "var(--text-muted)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: isOnline ? "var(--primary)" : "#9ca3af", display: "inline-block" }} />
                      {isOnline ? (lang === "th" ? "ออนไลน์" : "Online") : (lang === "th" ? "ออฟไลน์" : "Offline")}
                    </span>
                    <button onClick={() => deleteUser(u.email)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 4 }} title={lang === "th" ? "ลบผู้ใช้" : "Delete User"}>
                      <IconX />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* ── 8.5. Deleted Users ── */}
      <Section title={lang === "th" ? "ผู้ใช้ที่ถูกลบ" : "Deleted Users"} icon={<IconUser />}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {lang === "th" ? `ทั้งหมด ${deletedUsers.length} คน` : `${deletedUsers.length} users total`}
          </span>
          <button onClick={fetchDeletedUsers} style={ghostBtn}><IconRefresh /> {lang === "th" ? "รีเฟรช" : "Refresh"}</button>
        </div>
        {deletedUsers.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{lang === "th" ? "ไม่มีข้อมูลผู้ใช้ที่ถูกลบ" : "No deleted users found"}</p>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden", opacity: 0.8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "10px 16px", background: "#fef2f2", borderBottom: "1px solid var(--border-color)", fontSize: "0.78rem", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", letterSpacing: 0.5 }}>
              <span>{lang === "th" ? "อีเมล / ชื่อ" : "Email / Name"}</span>
              <span>{lang === "th" ? "เบอร์โทร" : "Phone"}</span>
              <span>{lang === "th" ? "เวลาที่ลบ" : "Deleted At"}</span>
            </div>
            {deletedUsers.map((u) => (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid var(--border-color)", fontSize: "0.85rem", alignItems: "center" }}>
                <div>
                  <div style={{ color: "var(--text-main)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "line-through" }}>{u.email}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{u.name || "-"}</div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{u.phone || "-"}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(u.deleted_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
      </div>
      )}
    </div>
  );
}

// ── Reusable Section ──
function Section({ title, icon, children, danger }: { title: string; icon: React.ReactNode; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className="glass-card" style={{ marginBottom: 20, overflow: "hidden", border: danger ? "1.5px dashed #dc2626" : undefined }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-color)", background: "var(--bg-color)", display: "flex", alignItems: "center", gap: 10 }}>
        <span>{icon}</span>
        <span style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "0.95rem" }}>{title}</span>
      </div>
      <div style={{ padding: "22px 24px" }}>{children}</div>
    </div>
  );
}

// ── Field Row ──
function FieldRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.9rem" }}>{label}</div>
        {desc && <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

// ── Toggle ──
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{ width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer", background: checked ? "var(--primary)" : "var(--border-color)", position: "relative", transition: "background 0.25s ease", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: checked ? 24 : 4, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.25s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

// ── Styles ──
const inputStyle: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontFamily: "inherit", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s" };
const ghostBtn: React.CSSProperties  = { display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem", fontFamily: "inherit", transition: "all 0.2s" };

// ── SVG Icons ──
function IconGlobe()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>; }
function IconPalette() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>; }
function IconShield()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function IconArchive() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>; }
function IconReset()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>; }
function IconServer()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>; }
function IconHistory() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconDb()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>; }
function IconRefresh() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>; }
function IconMoon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function IconX()       { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function IconDownload(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function IconUpload()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function IconMerge()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>; }
function IconUser()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function IconFarm()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function IconStar()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function IconImage()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }

// ── Admin Profile Helpers ──
function AdminInfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: last ? 0 : 12, marginBottom: last ? 0 : 12, borderBottom: last ? "none" : "1px solid var(--border-color)" }}>
      <span style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.88rem" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>{value}</span>
    </div>
  );
}

const profileLabelStyle: React.CSSProperties = { display: "block", marginBottom: 6, fontWeight: 700, color: "var(--text-muted)", fontSize: "0.88rem" };
const profileInputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", fontFamily: "inherit", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" };
