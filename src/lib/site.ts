/** Public address of the site, without a trailing slash. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://udomtongfarm.vercel.app").replace(/\/+$/, "");

/**
 * The address a species' QR code opens. It carries no language, so the site opens in the language of the
 * phone that scans it. It stays the same for as long as the entry's id and the site address do.
 */
export const speciesQrUrl = (id: string) => `${SITE_URL}/species/${id}`;
