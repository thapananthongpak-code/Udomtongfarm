import { useEffect, useState } from "react";
import { sortServices, type FarmService } from "@/lib/services";
import { supabase } from "@/lib/supabase";

/** Every activity and rate including hidden ones, in the order they are shown. Null while loading. */
export function useAdminServices(): FarmService[] | null {
  const [services, setServices] = useState<FarmService[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      ?.from("farm_services")
      .select("*")
      .then(({ data }) => {
        if (!cancelled) setServices(sortServices((data ?? []) as FarmService[]));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return services;
}
