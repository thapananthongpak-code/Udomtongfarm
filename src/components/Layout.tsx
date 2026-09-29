import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { ArrowUp, RotateCcw } from "lucide-react";
import { useT } from "../lib/i18n";
import { useUI } from "../store/ui";
import CommandPalette from "./CommandPalette";
import Footer from "./Footer";
import Header from "./Header";

function isEditable(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}

function useGlobalShortcuts() {
  const toggleSearch = useUI((s) => s.toggleSearch);
  const openSearch = useUI((s) => s.openSearch);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleSearch();
      } else if (event.key === "/" && !isEditable(event.target) && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        openSearch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSearch, openSearch]);
}

function Toaster() {
  const toasts = useUI((s) => s.toasts);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function BackToTop() {
  const t = useT();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      className={`back-to-top${visible ? " is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t.footer.backToTop}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={20} aria-hidden />
    </button>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const t = useT();
  useGlobalShortcuts();
  return (
    <>
      <a href="#main" className="skip-link">
        {t.skipToContent}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CommandPalette />
      <Toaster />
      <BackToTop />
      <ScrollRestoration />
    </>
  );
}

export default function Layout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

/** Shown when a page throws while rendering. Keeps the header and footer around it. */
export function RouteError() {
  const t = useT();
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  if (import.meta.env.DEV) console.error(error);
  return (
    <section className="container state-page">
      <p className="eyebrow">{notFound ? "404" : "Error"}</p>
      <h1 className="state-page__title">{notFound ? t.notFound.title : t.common.loadingError}</h1>
      <div className="state-page__actions">
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          <RotateCcw size={18} aria-hidden /> {t.common.reload}
        </button>
        <Link to="/" className="btn btn--secondary">
          {t.common.backHome}
        </Link>
      </div>
    </section>
  );
}

/** Root-level fallback used if the layout itself fails, so it avoids the shared chrome. */
export function RootError() {
  return (
    <main id="main">
      <RouteError />
    </main>
  );
}
