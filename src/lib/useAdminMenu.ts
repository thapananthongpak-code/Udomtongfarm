import { useEffect, useState } from "react";
import { sortMenu, type MenuItem } from "@/lib/menu";
import { supabase } from "@/lib/supabase";

/** Every menu item including hidden ones, in menu order. Null while loading. */
export function useAdminMenu(): MenuItem[] | null {
  const [menu, setMenu] = useState<MenuItem[] | null>(null);

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

  return menu;
}
