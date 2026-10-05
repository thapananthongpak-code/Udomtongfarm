"use client";

import { useParams } from "next/navigation";
import { defaultLocale, getDictionary, isLocale } from "@/i18n";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const params = useParams<{ lang?: string }>();
  const lang = isLocale(params.lang) ? params.lang : defaultLocale;
  const t = getDictionary(lang).error;

  return (
    <div className="shell py-28 md:py-40">
      <h1 className="display text-4xl md:text-6xl">{t.title}</h1>
      <p className="lede mt-6 max-w-xl">{t.body}</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-9">
        {t.retry}
      </button>
    </div>
  );
}
