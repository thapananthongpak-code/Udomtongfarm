// src/layouts/AuthLayout.tsx
// Fullscreen layout for Login / Register / ForgotPassword
// No Navbar or Footer — just the page content + floating theme/lang controls
import { Outlet } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useSettingsStore } from "../store/settingsStore";

export default function AuthLayout() {
  const { theme, lang, toggleTheme, toggleLang } = useSettingsStore();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-color)", position: "relative" }}>
      {/* Floating controls — top-right */}
      <div style={{
        position: "fixed", top: 14, right: 16, zIndex: 300,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <button
          onClick={toggleLang}
          style={{
            padding: "6px 14px", borderRadius: 20,
            border: "1.5px solid var(--border-color)",
            background: "var(--card-bg)", color: "var(--text-main)",
            fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
            transition: "border-color 0.2s",
          }}
        >
          {lang === "th" ? "EN" : "TH"}
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            width: 38, height: 38, borderRadius: 19,
            border: "1.5px solid var(--border-color)",
            background: "var(--card-bg)", color: "var(--text-main)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "border-color 0.2s",
          }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <Outlet />
    </div>
  );
}
