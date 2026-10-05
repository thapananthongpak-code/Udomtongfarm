import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "./env";

const hasAuthCookie = (request: NextRequest) => request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-"));

/**
 * Refreshes the visitor's session from the proxy and reports whether they are signed in.
 * Visitors without a session cookie are skipped, so public pages cost no extra request.
 */
export async function refreshSession(request: NextRequest): Promise<{ response: NextResponse; signedIn: boolean }> {
  let response = NextResponse.next({ request });
  if (!supabaseEnv || !hasAuthCookie(request)) return { response, signedIn: false };

  const supabase = createServerClient(supabaseEnv.url, supabaseEnv.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  return { response, signedIn: data.user !== null };
}
