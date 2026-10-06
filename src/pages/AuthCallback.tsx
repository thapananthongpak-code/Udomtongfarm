import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isLocale, preferredLocale } from "@/i18n";
import { safeNextPath } from "@/lib/paths";
import { supabase } from "@/lib/supabase";

/**
 * Where Google sends the visitor back after sign-in. Supabase reads the code in the
 * address and creates the session; this page then sends the visitor on.
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fallbackLang = preferredLocale();
    const next = safeNextPath(searchParams.get("next"), `/${fallbackLang}/account`);
    const first = next.split("/")[1];
    const failure = `/${isLocale(first) ? first : fallbackLang}/login?error=sign_in_failed`;

    if (!supabase || searchParams.get("error")) {
      navigate(failure, { replace: true });
      return;
    }
    // getSession waits for Supabase to finish exchanging the code.
    supabase.auth.getSession().then(({ data }) => navigate(data.session ? next : failure, { replace: true }));
  }, [searchParams, navigate]);

  return <div className="shell py-28" aria-busy="true" />;
}
