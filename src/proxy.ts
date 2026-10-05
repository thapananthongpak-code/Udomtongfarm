import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { refreshSession } from "@/lib/supabase/session";

const PROTECTED = ["/account", "/admin"];

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => part.trim().slice(0, 2).toLowerCase());
  return accepted.find(isLocale) ?? defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The sign-in callback has no language prefix. It only needs the session cookies kept fresh.
  if (pathname.startsWith("/auth/")) return (await refreshSession(request)).response;

  const [, first, ...rest] = pathname.split("/");
  if (!isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const { response, signedIn } = await refreshSession(request);

  const path = `/${rest.join("/")}`;
  const isProtected = PROTECTED.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  if (isProtected && !signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = `/${first}/login`;
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except Next.js internals, API routes and files with an extension (images, icons, sitemap.xml and so on).
    "/((?!_next/|api/|.*\\.[\\w]+$).*)",
  ],
};
