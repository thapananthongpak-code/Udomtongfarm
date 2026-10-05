"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { localePath, type Locale } from "@/i18n";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AccountState = { status: "idle" | "saved" | "error" };

export async function updateProfile(lang: Locale, _prev: AccountState, formData: FormData): Promise<AccountState> {
  const displayName = String(formData.get("display_name") ?? "").trim().slice(0, 80);
  const [supabase, user] = await Promise.all([createClient(), getSessionUser()]);
  if (!supabase || !user || !displayName) return { status: "error" };

  const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", user.id);
  if (error) return { status: "error" };

  revalidatePath(localePath(lang, "/account"));
  return { status: "saved" };
}

export async function deleteAccount(lang: Locale, _prev: AccountState, formData: FormData): Promise<AccountState> {
  if (String(formData.get("confirm") ?? "").trim() !== "DELETE") return { status: "error" };

  const supabase = await createClient();
  if (!supabase) return { status: "error" };

  const { error } = await supabase.rpc("delete_own_account");
  if (error) return { status: "error" };

  // The account no longer exists, so only this browser's cookies need clearing.
  await supabase.auth.signOut({ scope: "local" });
  redirect(localePath(lang));
}
