import { useCallback, useEffect, useMemo, useState } from "react";
import { seedSpecies } from "@/data/species";
import { DEFAULT_CONTACT, SETTINGS_FIELDS, type SiteSettings } from "@/lib/farm";
import type { Species } from "@/lib/species/types";
import { supabase } from "@/lib/supabase";
import { DataContext, type DataState } from "./data";

type Loaded = Pick<DataState, "status" | "species" | "settings">;

// Without Supabase the bundled collection is used straight away.
const START: Loaded = supabase
  ? { status: "loading", species: [], settings: DEFAULT_CONTACT }
  : { status: "ready", species: seedSpecies, settings: DEFAULT_CONTACT };

async function readFromSupabase(): Promise<Loaded | null> {
  if (!supabase) return null;
  const [species, settings] = await Promise.all([
    supabase.from("species").select("*").eq("published", true).order("name_en"),
    supabase.from("site_settings").select(SETTINGS_FIELDS.join(",")).eq("id", 1).maybeSingle(),
  ]);

  // If the database cannot be read, most often because the schema has not been applied yet,
  // the bundled data keeps the site readable.
  if (species.error) console.error(`Could not load species, using the bundled data instead: ${species.error.message}`);
  return {
    status: "ready",
    species: species.error ? seedSpecies : (species.data as Species[]),
    settings: settings.error || !settings.data ? DEFAULT_CONTACT : (settings.data as unknown as SiteSettings),
  };
}

/** Loads the collection and the farm's contact details once, and shares them with every page. */
export default function DataProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState<Loaded>(START);

  useEffect(() => {
    let cancelled = false;
    readFromSupabase().then((fresh) => {
      if (fresh && !cancelled) setLoaded(fresh);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(async () => {
    const fresh = await readFromSupabase();
    if (fresh) setLoaded(fresh);
  }, []);

  const value = useMemo(() => ({ ...loaded, reload }), [loaded, reload]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
