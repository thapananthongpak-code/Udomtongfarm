// src/routes/AdminGuard.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function AdminGuard() {
  const location = useLocation();
  const { user, role, loading } = useAuth();

  // รอ auth โหลดก่อน ป้องกัน redirect ผิดพลาดตอน refresh
  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  // 🔒 ยังไม่ login → ไปหน้า login ก่อน
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // 🔒 login แล้ว แต่ไม่ใช่ admin (เตะกลับหน้า Home)
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ เป็น admin เข้าได้
  return <Outlet />;
}