"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type SessionState = {
  /** "loading" until the browser has checked for a session. */
  status: "loading" | "anon" | "member";
  favorites: ReadonlySet<string>;
  /** Saves or removes a species. Resolves to false when the change could not be stored. */
  toggleFavorite: (speciesId: string) => Promise<boolean>;
};

const SessionContext = createContext<SessionState>({
  status: "anon",
  favorites: new Set(),
  toggleFavorite: async () => false,
});

export const useSession = () => useContext(SessionContext);

// The Supabase client is only downloaded for visitors who have a session cookie,
// so everyone else gets the pages without it.
const loadClient = () => import("@/lib/supabase/browser").then((module) => module.getBrowserClient());

const hasSessionCookie = () => document.cookie.split("; ").some((cookie) => cookie.startsWith("sb-"));

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<SessionState["status"]>(isSupabaseConfigured ? "loading" : "anon");
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const loadedFor = useRef<string | null>(null);

  // Signing in and out happens on the server, so the session is checked again after each navigation.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    async function check() {
      const supabase = hasSessionCookie() ? await loadClient() : null;
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      if (cancelled) return;

      if (!supabase || !session) {
        loadedFor.current = null;
        setStatus("anon");
        setFavorites(new Set());
        return;
      }

      setStatus("member");
      if (loadedFor.current === session.user.id) return;
      const { data } = await supabase.from("favorites").select("species_id");
      if (cancelled) return;
      loadedFor.current = session.user.id;
      setFavorites(new Set((data ?? []).map((row: { species_id: string }) => row.species_id)));
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const toggleFavorite = useCallback(
    async (speciesId: string) => {
      const supabase = await loadClient();
      if (!supabase) return false;

      const wasSaved = favorites.has(speciesId);
      const apply = (saved: boolean) =>
        setFavorites((current) => {
          const next = new Set(current);
          if (saved) next.add(speciesId);
          else next.delete(speciesId);
          return next;
        });

      apply(!wasSaved);
      const { error } = wasSaved
        ? await supabase.from("favorites").delete().eq("species_id", speciesId)
        : await supabase.from("favorites").insert({ species_id: speciesId });
      if (error) apply(wasSaved);
      return !error;
    },
    [favorites],
  );

  const value = useMemo(() => ({ status, favorites, toggleFavorite }), [status, favorites, toggleFavorite]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
