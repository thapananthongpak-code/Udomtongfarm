import { createBrowserRouter } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public pages
import Home from "../pages/public/Home";
import Encyclopedia from "../pages/public/Encyclopedia";
import SpeciesPage from "../pages/public/SpeciesPage";
import Contact from "../pages/public/Contact";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Profile from "../pages/auth/Profile";

// Admin pages
import Dashboard from "../pages-admin/Dashboard";
import AdminSettings from "../pages-admin/AdminSettings";
import SpeciesManager from "../pages-admin/SpeciesManager";

// Guards
import AdminGuard from "../routes/AdminGuard";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/encyclopedia", element: <Encyclopedia /> },
      { path: "/species/:type/:id", element: <SpeciesPage /> },

      { path: "/contact", element: <Contact /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot", element: <ForgotPassword /> },
      { path: "/profile", element: <Profile /> },
      // 💡 ลบ path verify-email ออกไปเรียบร้อยแล้วครับ เพราะเราย้ายไปทำ OTP ในหน้า Register แทน
    ],
  },
  {
    element: <AdminGuard />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "species", element: <SpeciesManager /> }, // ✅ เพิ่ม
          { path: "settings", element: <AdminSettings /> },
        ],
      },
    ],
  },
]);