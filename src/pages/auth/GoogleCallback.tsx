// src/pages/auth/GoogleCallback.tsx
// Landing page after Google OAuth redirect from backend
// Reads ?token=...&user=... from URL, sets session, restores account state
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useSettingsStore } from "../../store/settingsStore";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { lang } = useSettingsStore();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token   = params.get("token");
    const userStr = params.get("user");
    const error   = params.get("error");

    if (error || !token || !userStr) {
      const msg =
        error === "google_cancelled"
          ? (lang === "th" ? "ยกเลิกการเข้าสู่ระบบ" : "Sign-in cancelled")
          : (lang === "th" ? "Google Sign-In ล้มเหลว กรุณาลองใหม่" : "Google Sign-In failed. Please try again.");
      setErrMsg(msg);
      setTimeout(() => navigate("/login", { replace: true }), 2500);
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userStr)) as {
        email: string; role: string; [key: string]: unknown;
      };
      // Restore this account's cart
      useCartStore.getState().switchUserCart(user.email);
      // Save session
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("uf_show_greeting", "1");
      window.dispatchEvent(new Event("auth-change"));
      // Redirect to last saved path, or default
      const savedPath = localStorage.getItem(`uf_last_path_${user.email}`);
      const dest = user.role === "admin" ? "/admin" : (savedPath || "/encyclopedia");
      navigate(dest, { replace: true });
    } catch {
      setErrMsg(lang === "th" ? "เกิดข้อผิดพลาด กรุณาลองใหม่" : "Something went wrong. Please try again.");
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg-color)", gap: 16,
    }}>
      {errMsg ? (
        <>
          <div style={{ fontSize: "2.5rem" }}>⚠️</div>
          <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>{errMsg}</p>
        </>
      ) : (
        <>
          <span className="spinner" style={{ width: 40, height: 40 }} />
          <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>
            {lang === "th" ? "กำลังเข้าสู่ระบบด้วย Google..." : "Signing in with Google..."}
          </p>
        </>
      )}
    </div>
  );
}
