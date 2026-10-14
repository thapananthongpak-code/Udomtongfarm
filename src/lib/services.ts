// Activities and service rates, shared by the pages and the chat assistant.
// This file has no dependencies beyond the menu helpers so that the chat function can load it too.

import type { Locale } from "../i18n/config.js";

/** An activity is shown with a photo; a rate is a line in the price list. */
export const SERVICE_KINDS = ["activity", "rate"] as const;
export type ServiceKind = (typeof SERVICE_KINDS)[number];

/** One activity or rate. The shape matches the `farm_services` table in Supabase. */
export type FarmService = {
  id: string;
  kind: ServiceKind;

  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  /** What the price is for, for example "per room". Empty when the price needs no explanation. */
  unit_th: string;
  unit_en: string;

  /** In whole baht. Zero means free. Null until the farm has set a price. */
  price: number | null;
  /** A path under /public or a full URL in Supabase Storage. Empty when there is no photo yet. */
  image: string;
  /** Lower numbers come first within a kind. */
  sort_order: number;

  published: boolean;
  created_at?: string;
  updated_at?: string;
};

export const serviceName = (item: Pick<FarmService, "name_th" | "name_en">, lang: Locale) =>
  (lang === "th" ? item.name_th : item.name_en) || item.name_th;

export const serviceDescription = (item: Pick<FarmService, "description_th" | "description_en">, lang: Locale) =>
  (lang === "th" ? item.description_th : item.description_en) || item.description_th;

export const serviceUnit = (item: Pick<FarmService, "unit_th" | "unit_en">, lang: Locale) =>
  (lang === "th" ? item.unit_th : item.unit_en) || item.unit_th;

/** The services of one kind, by position and then Thai name. */
export const servicesOfKind = (items: FarmService[], kind: ServiceKind) =>
  items
    .filter((item) => item.kind === kind)
    .sort((a, b) => a.sort_order - b.sort_order || a.name_th.localeCompare(b.name_th, "th"));

export const sortServices = (items: FarmService[]) =>
  SERVICE_KINDS.flatMap((kind) => servicesOfKind(items, kind));
