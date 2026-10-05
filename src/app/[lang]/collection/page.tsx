import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CollectionBrowser, { CollectionView, DEFAULT_FILTERS } from "@/components/species/CollectionBrowser";
import PageIntro from "@/components/PageIntro";
import { getDictionary, isLocale } from "@/i18n";
import { getAllSpecies } from "@/lib/species/repository";
import { toCardData } from "@/lib/species/types";

export const revalidate = 3600;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.collection.title,
    description: t.meta.collection,
    alternates: {
      canonical: `/${lang}/collection`,
      languages: { th: "/th/collection", en: "/en/collection", "x-default": "/th/collection" },
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const species = (await getAllSpecies()).map(toCardData);

  const shared = {
    species,
    lang,
    labels: { ...t.collection, all: t.common.all, animals: t.common.animals, plants: t.common.plants },
    statusLabels: t.status,
  };

  return (
    <>
      <PageIntro eyebrow={t.collection.eyebrow} title={t.collection.title} lede={t.collection.lede} />
      {/* Filters live in the URL, which is only known in the browser. The full list is rendered first so it is in the page's HTML. */}
      <Suspense fallback={<CollectionView {...shared} filters={DEFAULT_FILTERS} />}>
        <CollectionBrowser {...shared} />
      </Suspense>
    </>
  );
}
