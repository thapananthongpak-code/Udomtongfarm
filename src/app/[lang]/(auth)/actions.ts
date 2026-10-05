"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { localePath, type Locale } from "@/i18n";
import { safeNextPath } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

/** The address the visitor is using, so Google sends them back to the same place. */
async function requestOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) return SITE_URL;
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

/**
 * Starts sign-in with Google. Accounts only exist through Google, so there is
 * no password for anyone to forget.
 */
export async function signInWithGoogle(lang: Locale, next: string) {
  const loginPath = localePath(lang, "/login");
  const supabase = await createClient();
  if (!supabase) redirect(`${loginPath}?error=not_configured`);

  const destination = safeNextPath(next, localePath(lang, "/account"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await requestOrigin()}/auth/callback?next=${encodeURIComponent(destination)}` },
  });
  if (error || !data.url) redirect(`${loginPath}?error=sign_in_failed`);

  redirect(data.url);
}

export async function signOut(lang: Locale) {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect(localePath(lang));
}
