import { create } from "zustand";

type SettingsState = {
  theme: "light" | "dark";
  lang: "th" | "en";
  fontSize: "small" | "medium" | "large";
  toggleTheme: () => void;
  toggleLang: () => void;
  setFontSize: (size: "small" | "medium" | "large") => void;
};

// ดึงค่าเก่าจากเครื่องผู้ใช้ ถ้าไม่มีให้ใช้ค่าเริ่มต้น
const getSavedTheme = () => (localStorage.getItem("theme") as "light" | "dark") || "light";
const getSavedLang = () => (localStorage.getItem("lang") as "th" | "en") || "en";
const getSavedFontSize = () => (localStorage.getItem("fontSize") as "small" | "medium" | "large") || "medium";

export const useSettingsStore = create<SettingsState>((set) => {
  // สั่งเปลี่ยนหน้าตาทันทีตอนเปิดเว็บ — ป้องกัน crash ในสภาพแวดล้อมที่ไม่มี DOM (SSR/test)
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", getSavedTheme());
    document.documentElement.setAttribute("data-font-size", getSavedFontSize());
  }

  return {
    theme: getSavedTheme(),
    lang: getSavedLang(),
    fontSize: getSavedFontSize(),

    toggleTheme: () => set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),

    toggleLang: () => set((state) => {
      const newLang = state.lang === "th" ? "en" : "th";
      localStorage.setItem("lang", newLang);
      return { lang: newLang };
    }),

    setFontSize: (size) => set(() => {
      document.documentElement.setAttribute("data-font-size", size);
      localStorage.setItem("fontSize", size);
      return { fontSize: size };
    }),
  };
});