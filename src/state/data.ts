import { createContext, useContext } from "react";
import { DEFAULT_CONTACT, type SiteSettings } from "@/lib/farm";
import type { Species } from "@/lib/species/types";

export type DataState = {
  /** "loading" while the first read from Supabase is in flight. */
  status: "loading" | "ready";
  /** Every published species. */
  species: Species[];
  settings: SiteSettings;
  /** Reads everything again, after an admin has saved a change. */
  reload: () => Promise<void>;
};

export const DataContext = createContext<DataState>({
  status: "ready",
  species: [],
  settings: DEFAULT_CONTACT,
  reload: async () => {},
});

export const useData = () => useContext(DataContext);
