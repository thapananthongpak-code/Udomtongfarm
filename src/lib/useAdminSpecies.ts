import { useEffect, useState } from "react";
import type { Species } from "@/lib/species/types";
import { supabase } from "@/lib/supabase";

/** Every species including drafts, newest change first. Null while loading. */
export function useAdminSpecies(): Species[] | null {
  const [species, setSpecies] = useState<Species[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      ?.from("species")
      .select("*")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setSpecies((data ?? []) as Species[]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return species;
}
