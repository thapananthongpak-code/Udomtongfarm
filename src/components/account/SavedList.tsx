"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/components/SessionProvider";
import SpeciesCard from "@/components/species/SpeciesCard";
import type { Dictionary, Locale } from "@/i18n";
import type { SpeciesCardData } from "@/lib/species/types";

type Props = {
  items: SpeciesCardData[];
  lang: Locale;
  statusLabels: Dictionary["status"];
  labels: { empty: string; emptyCta: string; remove: string };
  collectionHref: string;
};

export default function SavedList({ items, lang, statusLabels, labels, collectionHref }: Props) {
  const { toggleFavorite } = useSession();
  const [removed, setRemoved] = useState<ReadonlySet<string>>(new Set());
  const visible = items.filter((item) => !removed.has(item.id));

  async function remove(id: string) {
    setRemoved((current) => new Set(current).add(id));
    const stored = await toggleFavorite(id);
    if (!stored)
      setRemoved((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
  }

  if (visible.length === 0) {
    return (
      <div className="border-t border-line py-10">
        <p className="text-muted">{labels.empty}</p>
        <Link href={collectionHref} className="btn mt-5">
          {labels.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {visible.map((item) => (
        <li key={item.id}>
          <SpeciesCard species={item} lang={lang} statusLabels={statusLabels} />
          <button type="button" onClick={() => remove(item.id)} className="link mt-2 text-[0.8125rem] text-muted">
            {labels.remove}
          </button>
        </li>
      ))}
    </ul>
  );
}
