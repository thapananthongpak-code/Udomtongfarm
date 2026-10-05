import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { safeNextPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Where Google sends the visitor back after sign-in.
 * Exchanges the code in the address for a session, then sends the visitor on.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"), `/${defaultLocale}/account`);
  const code = searchParams.get("code");

  const supabase = await createClient();
  if (supabase && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }

  const first = next.split("/")[1];
  const lang = isLocale(first) ? first : defaultLocale;
  return NextResponse.redirect(new URL(`/${lang}/login?error=sign_in_failed`, request.url));
}
