import { preferredLocale } from "@/i18n";

/** Only allows redirects to paths on this site. */
export function safeNextPath(next: string | null | undefined, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}

// Addresses from earlier versions of the site, mapped to where that content lives now.
const LEGACY: [RegExp, string][] = [
  [/^\/species\/(?:animal|plant)\/([^/]+)\/?$/, "/species/$1"],
  [/^\/(?:encyclopedia|gallery|compare)\/?$/, "/collection"],
  [/^\/(?:saved|wishlist|profile)\/?$/, "/account"],
  [/^\/(?:contact|map|faq)\/?$/, "/visit"],
  [/^\/(?:register|forgot|forgot-password|reset-password)\/?$/, "/login"],
  [/^\/(?:cart|checkout|orders)(?:\/.*)?$/, "/"],
];

/** Turns an address without a language into one with it, e.g. "/encyclopedia" into "/th/collection". */
export function withLocale(pathname: string): string {
  let path = pathname;
  for (const [pattern, replacement] of LEGACY) {
    if (pattern.test(path)) {
      path = path.replace(pattern, replacement);
      break;
    }
  }
  return `/${preferredLocale()}${path === "/" ? "" : path}`;
}
