// src/store/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, type Role } from "../utils/roles";

// 1. สร้าง Type สำหรับ User ของระบบเราเอง (แทน User ของ Firebase)
export type CustomUser = {
  id: number;
  email: string;
  name: string;
  role: Role;
};

type AuthState = {
  user: CustomUser | null;
  role: Role;
  loading: boolean;
  logout: () => void; // เปลี่ยนจาก Promise เป็น void ธรรมดา
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลจากเครื่อง (localStorage)
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    // โหลดครั้งแรกตอนเปิดเว็บ
    loadUser();

    // ดักฟังเผื่อมีการ Login/Logout จากแท็บอื่น หรือจากคำสั่งของเรา
    window.addEventListener("storage", loadUser);
    window.addEventListener("auth-change", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  const role = user?.role || "user";

  // 2. ฟังก์ชัน Logout ของระบบเรา
  function logout() {
    localStorage.removeItem("user"); // ลบข้อมูลออกจากเครื่อง
    setUser(null); // ล้างค่าใน State
    window.dispatchEvent(new Event("auth-change")); // สั่งให้ทุกหน้าเว็บรู้ว่า "ออกระบบแล้วนะ!"
  }

  const value: AuthState = { user, role, loading, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}