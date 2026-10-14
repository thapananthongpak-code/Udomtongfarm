// The café menu, shared by the pages and the chat assistant.
// This file has no dependencies so that the chat function can load it too.

import type { Locale } from "../i18n/config.js";

/** The sections of the menu, in the order they are shown. */
export const MENU_CATEGORIES = ["coffee", "cocoa", "tea", "other", "food", "snack"] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

/** One drink on the menu. The shape matches the `menu_items` table in Supabase. */
export type MenuItem = {
  id: string;
  category: MenuCategory;

  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;

  /** In whole baht. Null until the café has set a price. */
  price: number | null;
  /** A path under /public or a full URL in Supabase Storage. Empty when there is no photo yet. */
  image: string;
  /** Lower numbers come first within a category. */
  sort_order: number;

  published: boolean;
  /** False while the item is sold out: it stays on the menu but cannot be ordered. */
  available: boolean;
  created_at?: string;
  updated_at?: string;
};

export const menuName = (item: Pick<MenuItem, "name_th" | "name_en">, lang: Locale) =>
  (lang === "th" ? item.name_th : item.name_en) || item.name_th;

export const menuDescription = (item: Pick<MenuItem, "description_th" | "description_en">, lang: Locale) =>
  (lang === "th" ? item.description_th : item.description_en) || item.description_th;

export const formatPrice = (price: number) => `฿${price.toLocaleString("en-US")}`;

/** Whether a customer can put the item in a basket: it has a price and is not sold out. */
export const isOrderable = (item: Pick<MenuItem, "price" | "available">) => item.price !== null && item.available;

/** Menu order: by category, then position, then Thai name. */
export const sortMenu = (items: MenuItem[]) =>
  [...items].sort(
    (a, b) =>
      MENU_CATEGORIES.indexOf(a.category) - MENU_CATEGORIES.indexOf(b.category) ||
      a.sort_order - b.sort_order ||
      a.name_th.localeCompare(b.name_th, "th"),
  );

/** The menu split into its sections, leaving out sections with nothing in them. */
export const groupMenu = (items: MenuItem[]) =>
  MENU_CATEGORIES.map((category) => ({
    category,
    items: sortMenu(items.filter((item) => item.category === category)),
  })).filter((group) => group.items.length > 0);
