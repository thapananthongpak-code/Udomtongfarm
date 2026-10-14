import { useCallback, useEffect, useMemo, useState } from "react";
import { seedMenu } from "@/data/menu";
import { seedServices } from "@/data/services";
import { seedSpecies } from "@/data/species";
import { getDictionary } from "@/i18n";
import { applyContent, type ContentRow } from "@/lib/content";
import { DEFAULT_CONTACT, SETTINGS_FIELDS, type SiteSettings } from "@/lib/farm";
import type { MenuItem } from "@/lib/menu";
import type { FarmService } from "@/lib/services";
import type { Species } from "@/lib/species/types";
import { supabase } from "@/lib/supabase";
import { DataContext, type DataState } from "./data";

type Loaded = Pick<DataState, "status" | "species" | "menu" | "services" | "settings" | "content">;

// Without Supabase the bundled collection and menu are used straight away.
const START: Loaded = supabase
  ? { status: "loading", species: [], menu: [], services: [], settings: DEFAULT_CONTACT, content: [] }
  : { status: "ready", species: seedSpecies, menu: seedMenu, services: seedServices, settings: DEFAULT_CONTACT, content: [] };

// The photographs that used to ship with the site are gone. A database that still points at them
// (before supabase/update-2026-10.sql has been run) is read as having no photo.
const REMOVED_PHOTOS = /^\/images\/(animals|plants)\//;
const withoutRemovedPhotos = (list: Species[]) =>
  list.map((sp) => (REMOVED_PHOTOS.test(sp.image) ? { ...sp, image: "" } : sp));

async function readFromSupabase(): Promise<Loaded | null> {
  if (!supabase) return null;
  const [species, menu, services, settings, content] = await Promise.all([
    supabase.from("species").select("*").eq("published", true).order("name_en"),
    supabase.from("menu_items").select("*").eq("published", true),
    supabase.from("farm_services").select("*").eq("published", true),
    supabase.from("site_settings").select(SETTINGS_FIELDS.join(",")).eq("id", 1).maybeSingle(),
    supabase.from("site_content").select("key,th,en"),
  ]);

  // If the database cannot be read, most often because the schema has not been applied yet,
  // the bundled data keeps the site readable.
  if (species.error) console.error(`Could not load species, using the bundled data instead: ${species.error.message}`);
  return {
    status: "ready",
    species: species.error ? seedSpecies : withoutRemovedPhotos(species.data as Species[]),
    menu: menu.error ? seedMenu : (menu.data as MenuItem[]),
    // Until the table exists the bundled list is shown, so the activities and rates are never empty.
    services: services.error ? seedServices : (services.data as FarmService[]),
    settings: settings.error || !settings.data ? DEFAULT_CONTACT : (settings.data as unknown as SiteSettings),
    // Without the table, or without any edits, the site shows its built-in texts.
    content: content.error ? [] : (content.data as ContentRow[]),
  };
}

/** Loads the collection, the farm's contact details and its texts once, and shares them with every page. */
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

  const dictionaries = useMemo(
    () => ({
      th: applyContent(getDictionary("th"), loaded.content, "th"),
      en: applyContent(getDictionary("en"), loaded.content, "en"),
    }),
    [loaded.content],
  );

  const value = useMemo(() => ({ ...loaded, dictionaries, reload }), [loaded, dictionaries, reload]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
