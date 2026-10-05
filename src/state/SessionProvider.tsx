import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SessionContext, type Profile, type SessionState } from "./session";

/**
 * Tracks who is signed in, with their profile and saved list.
 * Accounts only exist through Google, so there is no password for anyone to forget.
 */
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionState["status"]>(supabase ? "loading" : "anon");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    async function loadMember(userId: string) {
      // Supabase reports the same session again when a tab regains focus; read the member's data once.
      if (loadedFor.current === userId) return;
      loadedFor.current = userId;

      const [profileResult, favoritesResult] = await Promise.all([
        client.from("profiles").select("*").eq("id", userId).maybeSingle(),
        client.from("favorites").select("species_id"),
      ]);
      if (loadedFor.current !== userId) return;

      setProfile(profileResult.data as Profile | null);
      setFavorites(new Set((favoritesResult.data ?? []).map((row) => row.species_id as string)));
      setStatus("member");
    }

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        loadedFor.current = null;
        setProfile(null);
        setFavorites(new Set());
        setStatus("anon");
        return;
      }
      // Supabase calls must not run inside this callback, so the read is deferred.
      setTimeout(() => loadMember(session.user.id), 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const toggleFavorite = useCallback(
    async (speciesId: string) => {
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

  const signInWithGoogle = useCallback(async (next: string) => {
    if (!supabase) return false;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    return !error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
  }, []);

  const updateDisplayName = useCallback(
    async (name: string) => {
      if (!supabase || !profile) return false;
      const { error } = await supabase.from("profiles").update({ display_name: name }).eq("id", profile.id);
      if (!error) setProfile({ ...profile, display_name: name });
      return !error;
    },
    [profile],
  );

  const deleteAccount = useCallback(async () => {
    if (!supabase) return false;
    const { error } = await supabase.rpc("delete_own_account");
    if (error) return false;
    // The account no longer exists, so only this browser's session needs clearing.
    await supabase.auth.signOut({ scope: "local" });
    return true;
  }, []);

  const value = useMemo(
    () => ({ status, profile, favorites, toggleFavorite, signInWithGoogle, signOut, updateDisplayName, deleteAccount }),
    [status, profile, favorites, toggleFavorite, signInWithGoogle, signOut, updateDisplayName, deleteAccount],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
