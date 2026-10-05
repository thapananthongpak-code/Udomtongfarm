export const locales = ["th", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "th";

export const isLocale = (value: string | null | undefined): value is Locale => value === "th" || value === "en";

export const otherLocale = (lang: Locale): Locale => (lang === "th" ? "en" : "th");

/** Prefixes an app path with the language: localePath("en", "/collection") gives "/en/collection". */
export const localePath = (lang: Locale, path = "/") => `/${lang}${path === "/" ? "" : path}`;

/** Fills {placeholders} in a dictionary string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export type Bilingual = Record<Locale, string>;

const LANGUAGE_KEY = "lang";

/** The language a visitor chose last time, or the first of their browser languages that the site has. */
export function preferredLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // Storage can be blocked. Fall through to the browser's languages.
  }
  const fromBrowser = navigator.languages.map((tag) => tag.slice(0, 2).toLowerCase()).find(isLocale);
  return fromBrowser ?? defaultLocale;
}

export function rememberLocale(lang: Locale) {
  try {
    window.localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // Not being able to remember the choice is harmless.
  }
}
