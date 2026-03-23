import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

// Public pages
import Home from "../pages/public/Home";
import Encyclopedia from "../pages/public/Encyclopedia";
import SpeciesPage from "../pages/public/SpeciesPage";
import Contact from "../pages/public/Contact";
import FAQ from "../pages/public/FAQ";

import About from "../pages/public/About";
import Gallery from "../pages/public/Gallery";
import Wishlist from "../pages/public/Wishlist";
import MapPage from "../pages/public/MapPage";
import Compare from "../pages/public/Compare";
import Cart from "../pages/public/Cart";
import Checkout from "../pages/public/Checkout";
import Orders from "../pages/public/Orders";
import OrderDetail from "../pages/public/OrderDetail";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Profile from "../pages/auth/Profile";
import GoogleCallback from "../pages/auth/GoogleCallback";

// Admin pages
import Dashboard from "../pages-admin/Dashboard";
import AdminSettings from "../pages-admin/AdminSettings";
import SpeciesManager from "../pages-admin/SpeciesManager";
import ProductManager from "../pages-admin/ProductManager";
import OrderManager from "../pages-admin/OrderManager";

// Guards
import AdminGuard from "../routes/AdminGuard";
import UserGuard from "../routes/UserGuard";

export const router = createBrowserRouter([
  // ── Unauthenticated routes (fullscreen, no navbar) ───────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login",         element: <Login />          },
      { path: "/register",      element: <Register />       },
      { path: "/forgot",        element: <ForgotPassword /> },
      { path: "/auth/callback", element: <GoogleCallback /> },
    ],
  },

  // ── Authenticated user routes (require login) ────────────────────────────
  {
    element: <UserGuard />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true,                   element: <Home />        },
          { path: "/encyclopedia",         element: <Encyclopedia /> },
          { path: "/species/:type/:id",    element: <SpeciesPage />  },
          { path: "/about",                element: <About />        },
          { path: "/gallery",              element: <Gallery />      },
          { path: "/wishlist",             element: <Wishlist />     },
          { path: "/map",                  element: <MapPage />      },
          { path: "/compare",              element: <Compare />      },
          { path: "/contact",              element: <Contact />      },
          { path: "/faq",                  element: <FAQ />          },
          // Shop
          { path: "/cart",                 element: <Cart />         },
          { path: "/checkout",             element: <Checkout />     },
          { path: "/orders",               element: <Orders />       },
          { path: "/orders/:id",           element: <OrderDetail />  },
          // Profile
          { path: "/profile",              element: <Profile />      },
          // Fallback
          { path: "*",                     element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },

  // ── Admin routes (require login + admin role) ─────────────────────────────
  {
    element: <AdminGuard />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true,       element: <Dashboard />      },
          { path: "species",   element: <SpeciesManager />  },
          { path: "products",  element: <ProductManager />  },
          { path: "orders",    element: <OrderManager />    },
          { path: "settings",  element: <AdminSettings />   },
        ],
      },
    ],
  },
]);
