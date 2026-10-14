import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { seedMenu } from "@/data/menu";
import { seedServices } from "@/data/services";
import { seedSpecies } from "@/data/species";
import { getDictionary } from "@/i18n";
import { applyContent, type ContentRow } from "@/lib/content";
import { DEFAULT_CONTACT, SETTINGS_FIELDS, type SiteSettings } from "@/lib/farm";
import type { MenuItem } from "@/lib/menu";
import { DEFAULT_SHOP, SHOP_FIELDS, type ShopSettings } from "@/lib/shop";
import type { FarmService } from "@/lib/services";
import type { Species } from "@/lib/species/types";
import { supabase } from "@/lib/supabase";
import { DataContext, type DataState } from "./data";

type Loaded = Pick<DataState, "status" | "problem" | "species" | "menu" | "services" | "settings" | "shop" | "content">;

// Without Supabase the bundled collection and menu are used straight away.
const START: Loaded = supabase
  ? { status: "loading", problem: false, species: [], menu: [], services: [], settings: DEFAULT_CONTACT, shop: DEFAULT_SHOP, content: [] }
  : { status: "ready", problem: false, species: seedSpecies, menu: seedMenu, services: seedServices, settings: DEFAULT_CONTACT, shop: DEFAULT_SHOP, content: [] };

// The photographs that used to ship with the site are gone. A database that still points at them
// (before supabase/update-2026-10.sql has been run) is read as having no photo.
const REMOVED_PHOTOS = /^\/images\/(animals|plants)\//;
const withoutRemovedPhotos = (list: Species[]) =>
  list.map((sp) => (REMOVED_PHOTOS.test(sp.image) ? { ...sp, image: "" } : sp));

/** How long a first visit waits for the database before showing the saved copy. A late answer still replaces it. */
const FIRST_LOAD_WAIT_MS = 6_000;
/** How long a reload after a save waits before giving up and keeping what is on screen. */
const RELOAD_TIMEOUT_MS = 10_000;

const SAVED_COPY: Loaded = {
  status: "ready",
  problem: true,
  species: seedSpecies,
  menu: seedMenu,
  services: seedServices,
  settings: DEFAULT_CONTACT,
  shop: DEFAULT_SHOP,
  content: [],
};

/**
 * Reads everything from the database. Returns null when it could not be reached at all, and otherwise
 * what it read: a table that failed keeps what the page already had (`previous`), or the bundled copy.
 * `problem` says that something was not read, so that the pages can tell the customer.
 */
async function readFromSupabase(previous: Loaded | null, timeoutMs: number | null): Promise<Loaded | null> {
  if (!supabase) return null;
  const client = supabase;

  async function read(): Promise<Loaded> {
    const [species, menu, services, settings, shop, content] = await Promise.all([
      client.from("species").select("*").eq("published", true).order("name_en"),
      client.from("menu_items").select("*").eq("published", true),
      client.from("farm_services").select("*").eq("published", true),
      client.from("site_settings").select(SETTINGS_FIELDS.join(",")).eq("id", 1).maybeSingle(),
      client.from("shop_settings").select(SHOP_FIELDS.join(",")).eq("id", 1).maybeSingle(),
      client.from("site_content").select("key,th,en"),
    ]);

    // The activities and rates and the texts are left out of `problem`: before their tables exist,
    // showing the bundled ones is the normal state.
    const problem = Boolean(species.error || menu.error || settings.error);
    if (problem) {
      const reason = species.error ?? menu.error ?? settings.error;
      console.error(`Could not read all of the database, showing a saved copy of the rest: ${reason?.message}`);
    }
    return {
      status: "ready",
      problem,
      species: species.error ? (previous?.species ?? seedSpecies) : withoutRemovedPhotos(species.data as Species[]),
      menu: menu.error ? (previous?.menu ?? seedMenu) : (menu.data as MenuItem[]),
      services: services.error ? (previous?.services ?? seedServices) : (services.data as FarmService[]),
      settings:
        settings.error || !settings.data
          ? (previous?.settings ?? DEFAULT_CONTACT)
          : (settings.data as unknown as SiteSettings),
      // Without the table, ordering is simply closed.
      shop: shop.error || !shop.data ? (previous?.shop ?? DEFAULT_SHOP) : (shop.data as unknown as ShopSettings),
      content: content.error ? (previous?.content ?? []) : (content.data as ContentRow[]),
    };
  }

  try {
    if (timeoutMs === null) return await read();
    const waited = new Promise<null>((resolve) => window.setTimeout(() => resolve(null), timeoutMs));
    return await Promise.race([read(), waited]);
  } catch (error) {
    console.error("Could not reach the database:", error);
    return null;
  }
}

/** Loads the collection, the farm's contact details and its texts once, and shares them with every page. */
export default function DataProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState<Loaded>(START);
  // What is on screen, for a reload that cannot reach the database to fall back on.
  const loadedRef = useRef(loaded);
  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    let answered = false;

    // Slow or out of reach: show the bundled copy, and say so, rather than a blank page for ever.
    // If the database does answer after that, its data replaces the copy.
    const giveUpWaiting = window.setTimeout(() => {
      if (!cancelled && !answered) setLoaded(SAVED_COPY);
    }, FIRST_LOAD_WAIT_MS);

    readFromSupabase(null, null).then((fresh) => {
      if (cancelled) return;
      answered = true;
      window.clearTimeout(giveUpWaiting);
      setLoaded(fresh ?? SAVED_COPY);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(giveUpWaiting);
    };
  }, []);

  const reload = useCallback(async () => {
    const fresh = await readFromSupabase(loadedRef.current, RELOAD_TIMEOUT_MS);
    setLoaded((current) => fresh ?? { ...current, problem: true });
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
