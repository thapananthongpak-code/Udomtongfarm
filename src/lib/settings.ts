import "server-only";

import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { DEFAULT_CONTACT } from "@/lib/site";
import { createPublicClient } from "@/lib/supabase/server";

/** Contact details an admin can change. The shape matches the `site_settings` table. */
export type SiteSettings = typeof DEFAULT_CONTACT;

export const SETTINGS_FIELDS = Object.keys(DEFAULT_CONTACT) as (keyof SiteSettings)[];

/** The farm's contact details: from Supabase when connected, otherwise the defaults in site.ts. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_CONTACT;

  const { data, error } = await supabase.from("site_settings").select(SETTINGS_FIELDS.join(",")).eq("id", 1).maybeSingle();
  if (error || !data) return DEFAULT_CONTACT;
  return data as unknown as SiteSettings;
});

export const addressFor = (settings: SiteSettings, lang: Locale) =>
  (lang === "th" ? settings.address_th : settings.address_en) || settings.address_th;

/** 0811733620 becomes 081-173-3620. Other lengths are shown as entered. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  return phone;
}

/** A link without its protocol, for display: "facebook.com/Udomtongfarm". */
export const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");
