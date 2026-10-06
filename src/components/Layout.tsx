import { useEffect } from "react";
import { Navigate, Outlet, ScrollRestoration, useLocation, useParams } from "react-router-dom";
import { isLocale } from "@/i18n";
import { useT } from "@/i18n/hooks";
import { withLocale } from "@/lib/paths";
import ChatWidget from "./chat/ChatWidget";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

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
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ChatWidget />
      <ScrollRestoration />
    </div>
  );
}
