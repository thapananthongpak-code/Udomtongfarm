import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { getDictionary, isLocale, localePath } from "@/i18n";
import { safeNextPath } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signInWithGoogle } from "../actions";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ next?: string; error?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).auth.loginTitle, robots: { index: false } };
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { next, error } = await searchParams;
  const t = getDictionary(lang).auth;
  const nextPath = safeNextPath(next, localePath(lang, "/account"));

  const messages: Record<string, string> = t.messages;
  const notice = !isSupabaseConfigured ? t.notConfigured : error ? (messages[error] ?? messages.unknown) : null;

  return (
    <AuthCard
      title={t.loginTitle}
      lede={t.loginLede}
      notice={notice}
      footer={
        <>
          <p>{t.noPassword}</p>
          <p>
            <Link href={localePath(lang, "/privacy")} className="link">
              {t.privacyLink}
            </Link>
          </p>
        </>
      }
    >
      <form action={signInWithGoogle.bind(null, lang, nextPath)}>
        <button type="submit" className="btn w-full gap-3" disabled={!isSupabaseConfigured}>
          <svg aria-hidden viewBox="0 0 18 18" className="size-[1.125rem]">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18Z" />
            <path fill="#FBBC05" d="M3.96 10.71a5.41 5.41 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3-2.33Z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58Z" />
          </svg>
          {t.google}
        </button>
      </form>
    </AuthCard>
  );
}
