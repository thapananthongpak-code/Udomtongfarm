import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import { CollectionRedirect, OldSpeciesAddress, RootRedirect } from "@/components/Redirects";
import About from "@/pages/About";
import Account from "@/pages/Account";
import AuthCallback from "@/pages/AuthCallback";
import Cafe from "@/pages/Cafe";
import Gallery from "@/pages/Gallery";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import SpeciesPage from "@/pages/SpeciesPage";
import Visit from "@/pages/Visit";

/** Loads a page's code the first time its route is visited. */
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default });

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  { path: "/auth/callback", element: <AuthCallback /> },
  {
    // Every page lives under its language: /th/... or /en/...
    // Layout sends any other first segment to the right place.
    path: "/:lang",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "gallery", element: <Gallery /> },
      { path: "collection", element: <CollectionRedirect /> },
      { path: "species/:id", element: <SpeciesPage /> },
      { path: "species/:type/:id", element: <OldSpeciesAddress /> },
      { path: "cafe", element: <Cafe /> },
      { path: "order", lazy: page(() => import("@/pages/Order")) },
      { path: "order/:id", lazy: page(() => import("@/pages/OrderStatus")) },
      { path: "about", element: <About /> },
      { path: "visit", element: <Visit /> },
      { path: "privacy", element: <Privacy /> },
      { path: "login", element: <Login /> },
      { path: "account", element: <Account /> },
      {
        // The dashboard is only downloaded when an admin opens it.
        path: "admin",
        lazy: page(() => import("@/pages/admin/AdminLayout")),
        children: [
          { index: true, lazy: page(() => import("@/pages/admin/Dashboard")) },
          { path: "species", lazy: page(() => import("@/pages/admin/SpeciesList")) },
          { path: "qr", lazy: page(() => import("@/pages/admin/QrSheet")) },
          { path: "species/new", lazy: page(() => import("@/pages/admin/SpeciesEdit")) },
          { path: "species/:id", lazy: page(() => import("@/pages/admin/SpeciesEdit")) },
          { path: "menu", lazy: page(() => import("@/pages/admin/MenuList")) },
          { path: "menu/new", lazy: page(() => import("@/pages/admin/MenuEdit")) },
          { path: "menu/:id", lazy: page(() => import("@/pages/admin/MenuEdit")) },
          { path: "services", lazy: page(() => import("@/pages/admin/ServiceList")) },
          { path: "services/new", lazy: page(() => import("@/pages/admin/ServiceEdit")) },
          { path: "services/:id", lazy: page(() => import("@/pages/admin/ServiceEdit")) },
          { path: "shop", lazy: page(() => import("@/pages/admin/ShopSettings")) },
          { path: "site", lazy: page(() => import("@/pages/admin/SiteSettings")) },
          { path: "texts", lazy: page(() => import("@/pages/admin/SiteContent")) },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
