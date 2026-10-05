import "server-only";

import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { localePath, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

export type Role = "member" | "admin";

export type Profile = {
  id: string;
  email: string;
  display_name: string;
  role: Role;
  created_at: string;
};

/** The signed-in visitor, verified with Supabase. Null when signed out. */
export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSessionUser();
  if (!user) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return data as Profile | null;
});

export async function requireProfile(lang: Locale, next: string): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect(`${localePath(lang, "/login")}?next=${encodeURIComponent(localePath(lang, next))}`);
  return profile;
}

/** Admin pages answer "not found" to everyone else, so their existence is not advertised. */
export async function requireAdmin(): Promise<Profile> {
  const profile = await getProfile();
  if (profile?.role !== "admin") notFound();
  return profile;
}

/** Only allows redirects to paths on this site. */
export function safeNextPath(next: string | null | undefined, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
