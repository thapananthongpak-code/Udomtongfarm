import "server-only";

import { cache } from "react";
import seed from "@/data/species.json";
import { createClient, createPublicClient } from "@/lib/supabase/server";
import type { Species } from "./types";

const seedSpecies = seed as Species[];

/**
 * Every published species. Reads from Supabase when it is configured, and from the
 * bundled seed file otherwise, so the site works before a database exists.
 */
export const getAllSpecies = cache(async (): Promise<Species[]> => {
  const supabase = createPublicClient();
  if (!supabase) return seedSpecies;

  const { data, error } = await supabase.from("species").select("*").eq("published", true).order("name_en");
  if (error) {
    // Most often the schema has not been applied yet. Keep the site readable.
    console.error(`Could not load species from Supabase, using the bundled data instead: ${error.message}`);
    return seedSpecies;
  }
  return data as Species[];
});

export async function getSpecies(id: string): Promise<Species | null> {
  const all = await getAllSpecies();
  return all.find((sp) => sp.id === id) ?? null;
}

/** Every species including drafts, read as the signed-in admin. */
export async function getAllSpeciesForAdmin(): Promise<Species[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("species").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(`Could not load species: ${error.message}`);
  return data as Species[];
}

export async function getSpeciesForAdmin(id: string): Promise<Species | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("species").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not load species: ${error.message}`);
  return data as Species | null;
}
