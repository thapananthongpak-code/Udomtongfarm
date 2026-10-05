export const locales = ["th", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "th";
export const LOCALE_COOKIE = "lang";

export const isLocale = (value: string | null | undefined): value is Locale => value === "th" || value === "en";

export const otherLocale = (lang: Locale): Locale => (lang === "th" ? "en" : "th");

/** Prefixes an app path with the language: localePath("en", "/collection") gives "/en/collection". */
export const localePath = (lang: Locale, path = "/") => `/${lang}${path === "/" ? "" : path}`;

/** Fills {placeholders} in a dictionary string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export type Bilingual = Record<Locale, string>;
