import { createContext, useContext } from "react";
import { getDictionary, type Dictionary, type Locale } from "@/i18n";
import type { ContentRow } from "@/lib/content";
import { DEFAULT_CONTACT, type SiteSettings } from "@/lib/farm";
import type { MenuItem } from "@/lib/menu";
import type { FarmService } from "@/lib/services";
import type { Species } from "@/lib/species/types";

export type DataState = {
  /** "loading" while the first read from Supabase is in flight. */
  status: "loading" | "ready";
  /** True when the database could not be read and the bundled data is shown instead. */
  problem: boolean;
  /** Every published species. */
  species: Species[];
  /** Every published item on the café menu. */
  menu: MenuItem[];
  /** Every published activity and rate. */
  services: FarmService[];
  settings: SiteSettings;
  /** The texts an admin has changed. */
  content: ContentRow[];
  /** The interface text of each language, with the admin's texts in place. */
  dictionaries: Record<Locale, Dictionary>;
  /** Reads everything again, after an admin has saved a change. */
  reload: () => Promise<void>;
};

export const DataContext = createContext<DataState>({
  status: "ready",
  problem: false,
  species: [],
  menu: [],
  services: [],
  settings: DEFAULT_CONTACT,
  content: [],
  dictionaries: { th: getDictionary("th"), en: getDictionary("en") },
  reload: async () => {},
});

export const useData = () => useContext(DataContext);
