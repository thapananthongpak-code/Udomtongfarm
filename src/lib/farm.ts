// Facts about the farm, shared by the pages and the chat assistant.
// This file has no dependencies so that the chat function can load it too.

import type { Locale } from "../i18n/config.js";

/**
 * Starting contact details. Once Supabase is connected these are edited in the
 * admin dashboard; the values here are only the fallback.
 */
export const DEFAULT_CONTACT = {
  phone: "0811733620",
  facebook_url: "https://www.facebook.com/profile.php?id=61584861394833",
  map_url: "https://maps.app.goo.gl/wZU3hkUTgYLfEhK38",
  address_th: "ตำบลห้วยบง อำเภอเมืองชัยภูมิ จังหวัดชัยภูมิ 36000",
  address_en: "Huai Bong, Mueang Chaiyaphum, Chaiyaphum 36000, Thailand",
};

/** Contact details an admin can change. The shape matches the `site_settings` table. */
export type SiteSettings = typeof DEFAULT_CONTACT;

export const SETTINGS_FIELDS = Object.keys(DEFAULT_CONTACT) as (keyof SiteSettings)[];

// Plus code R537+R9M, Huai Bong, Mueang Chaiyaphum
export const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=R537%2BR9M+%E0%B8%AB%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%9A%E0%B8%87+%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4+%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4&t=&z=15&ie=UTF8&iwloc=B&output=embed";

export const addressFor = (settings: SiteSettings, lang: Locale) =>
  (lang === "th" ? settings.address_th : settings.address_en) || settings.address_th;

/** 0811733620 becomes 081-173-3620. Other lengths are shown as entered. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  return phone;
}
