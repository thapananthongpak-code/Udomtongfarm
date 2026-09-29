import { create } from "zustand";
import { readJSON, readString, writeJSON } from "../lib/storage";

export type Theme = "light" | "dark";
export type Lang = "th" | "en";
export type TextSize = "small" | "medium" | "large";

const KEY = "uf_prefs";
const TEXT_SIZES: TextSize[] = ["small", "medium", "large"];

type Saved = Partial<{ theme: Theme; lang: Lang; textSize: TextSize }>;

function initialTheme(saved: Saved): Theme {
  const legacy = readString("theme");
  const value = saved.theme ?? legacy;
  if (value === "light" || value === "dark") return value;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

function initialLang(saved: Saved): Lang {
  const value = saved.lang ?? readString("lang");
  return value === "th" || value === "en" ? value : "en";
}

function initialTextSize(saved: Saved): TextSize {
  const value = saved.textSize ?? readString("fontSize");
  return TEXT_SIZES.includes(value as TextSize) ? (value as TextSize) : "medium";
}

function applyToDocument(theme: Theme, lang: Lang, textSize: TextSize) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("lang", lang);
  root.setAttribute("data-text-size", textSize);
}

type PrefsState = {
  theme: Theme;
  lang: Lang;
  textSize: TextSize;
  toggleTheme: () => void;
  toggleLang: () => void;
  setTextSize: (size: TextSize) => void;
  stepTextSize: (direction: 1 | -1) => void;
};

const saved = readJSON<Saved>(KEY, {});

export const usePrefs = create<PrefsState>((set, get) => ({
  theme: initialTheme(saved),
  lang: initialLang(saved),
  textSize: initialTextSize(saved),
  toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
  toggleLang: () => set({ lang: get().lang === "th" ? "en" : "th" }),
  setTextSize: (textSize) => set({ textSize }),
  stepTextSize: (direction) => {
    const index = TEXT_SIZES.indexOf(get().textSize) + direction;
    set({ textSize: TEXT_SIZES[Math.min(TEXT_SIZES.length - 1, Math.max(0, index))] });
  },
}));

// Keep <html> attributes and storage in sync with the store.
const initial = usePrefs.getState();
applyToDocument(initial.theme, initial.lang, initial.textSize);
usePrefs.subscribe(({ theme, lang, textSize }) => {
  applyToDocument(theme, lang, textSize);
  writeJSON(KEY, { theme, lang, textSize });
});
