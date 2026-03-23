// src/routes/UserGuard.tsx
// Protects all content routes — unauthenticated users are redirected to /login
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function UserGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "var(--bg-color)", color: "var(--text-muted)",
        fontSize: "1rem", gap: 12,
      }}>
        <span className="spinner" />
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
