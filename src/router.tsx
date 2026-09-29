import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout, { RootError, RouteError } from "./components/Layout";
import About from "./pages/About";
import Article from "./pages/Article";
import Compare from "./pages/Compare";
import Encyclopedia from "./pages/Encyclopedia";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Saved from "./pages/Saved";
import Visit from "./pages/Visit";

// Paths from the previous version of the site (shop, accounts, admin) that no longer exist.
const legacyRedirects = [
  { path: "/wishlist", to: "/saved" },
  { path: "/contact", to: "/visit" },
  { path: "/map", to: "/visit" },
  { path: "/faq", to: "/visit" },
  ...["/login", "/register", "/forgot", "/profile", "/cart", "/checkout", "/orders/*", "/admin/*"].map((path) => ({ path, to: "/" })),
].map(({ path, to }) => ({ path, element: <Navigate to={to} replace /> }));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RootError />,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { index: true, element: <Home /> },
          { path: "/encyclopedia", element: <Encyclopedia /> },
          { path: "/species/:type/:id", element: <Article /> },
          { path: "/gallery", element: <Gallery /> },
          { path: "/compare", element: <Compare /> },
          { path: "/saved", element: <Saved /> },
          { path: "/about", element: <About /> },
          { path: "/visit", element: <Visit /> },
          ...legacyRedirects,
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);
