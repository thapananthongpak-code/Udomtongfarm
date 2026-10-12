import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet, ScrollRestoration, useLocation, useParams } from "react-router-dom";
import { isLocale } from "@/i18n";
import { useT } from "@/i18n/hooks";
import { withLocale } from "@/lib/paths";
import ChatWidget from "./chat/ChatWidget";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

/**
 * Tells screen-reader users that the page changed. In a single-page app the browser does not do this,
 * so the new page's title is read out and keyboard focus moves to the top of the page content.
 */
function RouteAnnouncer() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;

    // The new page sets its title in its own effect, so give it a moment first.
    const timer = window.setTimeout(() => {
      setMessage(document.title);
      document.getElementById("main")?.focus({ preventScroll: true });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}

/** The frame around every page: header, footer and the chat button. */
export default function Layout() {
  const { lang } = useParams();
  const { pathname, search, hash } = useLocation();
  const t = useT();

  useEffect(() => {
    if (isLocale(lang)) document.documentElement.lang = lang;
  }, [lang]);

  // Addresses without a language, including ones from earlier versions of the site, are sent to the right page.
  if (!isLocale(lang)) return <Navigate to={withLocale(pathname) + search + hash} replace />;

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        {t.site.skip}
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      <ChatWidget />
      <RouteAnnouncer />
      <ScrollRestoration />
    </div>
  );
}
