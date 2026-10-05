import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

let client: ReturnType<typeof createBrowserClient> | null = null;

/** The browser client, created once. Returns null until Supabase is configured. */
export function getBrowserClient() {
  if (!supabaseEnv) return null;
  client ??= createBrowserClient(supabaseEnv.url, supabaseEnv.key);
  return client;
}
