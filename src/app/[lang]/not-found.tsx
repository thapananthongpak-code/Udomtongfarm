"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultLocale, getDictionary, isLocale, localePath } from "@/i18n";

// This file receives no props, so the language is read from the address.
export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const lang = isLocale(params.lang) ? params.lang : defaultLocale;
  const t = getDictionary(lang).notFound;

  return (
    <div className="shell py-28 md:py-40">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-4xl md:text-6xl">{t.title}</h1>
      <p className="lede mt-6 max-w-xl">{t.body}</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href={localePath(lang)} className="btn btn-primary">
          {t.home}
        </Link>
        <Link href={localePath(lang, "/collection")} className="btn">
          {t.browse}
        </Link>
      </div>
    </div>
  );
}
