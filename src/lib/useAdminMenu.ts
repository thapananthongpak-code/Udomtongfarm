import { useCallback, useEffect, useState } from "react";
import { sortMenu, type MenuItem } from "@/lib/menu";
import { supabase } from "@/lib/supabase";

/** Every menu item including hidden ones, in menu order (null while loading), and a way to read them again. */
export function useAdminMenu(): { menu: MenuItem[] | null; refresh: () => Promise<void> } {
  const [menu, setMenu] = useState<MenuItem[] | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.from("menu_items").select("*");
    setMenu(sortMenu((data ?? []) as MenuItem[]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    supabase
      ?.from("menu_items")
      .select("*")
      .then(({ data }) => {
        if (!cancelled) setMenu(sortMenu((data ?? []) as MenuItem[]));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { menu, refresh };
}
