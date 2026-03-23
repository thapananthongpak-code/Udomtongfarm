import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { useAuth } from "../store/AuthContext";

// Save last visited path per account so we can restore it on next login
function useLastPathTracker() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user?.email) return;
    // Don't save auth/checkout paths as "last state" to restore
    const skip = ["/login", "/register", "/forgot", "/checkout"];
    if (skip.some((p) => location.pathname.startsWith(p))) return;
    localStorage.setItem(`uf_last_path_${user.email}`, location.pathname + location.search);
  }, [location.pathname, location.search, user?.email]);
}

export default function PublicLayout() {
  useLastPathTracker();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
