import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { safeNextPath } from "@/lib/paths";
import { isSupabaseConfigured } from "@/lib/supabase";
import { usePageMeta } from "@/lib/usePageMeta";
import { useSession } from "@/state/session";

export default function Login() {
  const lang = useLang();
  const t = useT().auth;
  const [searchParams] = useSearchParams();
  const { status, signInWithGoogle } = useSession();
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  usePageMeta(t.loginTitle);

  const next = safeNextPath(searchParams.get("next"), localePath(lang, "/account"));
  if (status === "member") return <Navigate to={next} replace />;

  const messages: Record<string, string> = t.messages;
  const error = failed ? "sign_in_failed" : searchParams.get("error");
  const notice = !isSupabaseConfigured ? t.notConfigured : error ? (messages[error] ?? messages.unknown) : null;

  async function start() {
    setBusy(true);
    setFailed(false);
    // On success the browser leaves for Google, so there is nothing more to do here.
    if (!(await signInWithGoogle(next))) {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <div className="shell flex justify-center py-16 md:py-24">
      <div className="w-full max-w-sm">
        <h1 className="display text-4xl">{t.loginTitle}</h1>
        <p className="mt-3 text-[0.9375rem] text-muted">{t.loginLede}</p>
        {notice && <p className="notice mt-6">{notice}</p>}

        <button type="button" onClick={start} className="btn mt-8 w-full gap-3" disabled={!isSupabaseConfigured || busy}>
          <svg aria-hidden viewBox="0 0 18 18" className="size-[1.125rem]">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18Z" />
            <path fill="#FBBC05" d="M3.96 10.71a5.41 5.41 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3-2.33Z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58Z" />
          </svg>
          {t.google}
        </button>

        <div className="mt-8 space-y-2 border-t border-line pt-6 text-[0.9375rem] text-muted">
          <p>{t.noPassword}</p>
          <p>
            <Link to={localePath(lang, "/privacy")} className="link">
              {t.privacyLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
