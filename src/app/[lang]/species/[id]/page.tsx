import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLinkButton from "@/components/CopyLinkButton";
import FavoriteButton from "@/components/species/FavoriteButton";
import SpeciesCard from "@/components/species/SpeciesCard";
import SpeciesImage from "@/components/species/SpeciesImage";
import { StatusScale } from "@/components/species/StatusBadge";
import { getDictionary, isLocale, localePath, locales, otherLocale } from "@/i18n";
import { SITE_URL } from "@/lib/site";
import {
  neighbours,
  relatedSpecies,
  speciesBody,
  speciesName,
  speciesPath,
  speciesSummary,
  tagLabel,
  toParagraphs,
} from "@/lib/species/helpers";
import { getAllSpecies, getSpecies } from "@/lib/species/repository";
import { toCardData } from "@/lib/species/types";

export const revalidate = 3600;

type Props = { params: Promise<{ lang: string; id: string }> };

export async function generateStaticParams() {
  const all = await getAllSpecies();
  return locales.flatMap((lang) => all.map((sp) => ({ lang, id: sp.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) return {};
  const sp = await getSpecies(id);
  if (!sp) return {};

  const name = speciesName(sp, lang);
  const title = sp.scientific_name ? `${name} (${sp.scientific_name})` : name;
  const description = speciesSummary(sp, lang);
  const path = speciesPath(sp.id);

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { th: `/th${path}`, en: `/en${path}`, "x-default": `/th${path}` },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/${lang}${path}`,
      images: sp.image ? [{ url: sp.image, alt: name }] : undefined,
    },
  };
}

export default async function SpeciesPage({ params }: Props) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const [sp, all] = await Promise.all([getSpecies(id), getAllSpecies()]);
  if (!sp) notFound();

  const t = getDictionary(lang);
  const name = speciesName(sp, lang);
  const otherName = speciesName(sp, otherLocale(lang));
  const department = sp.type === "animal" ? t.common.animals : t.common.plants;
  const paragraphs = toParagraphs(speciesBody(sp, lang), lang);
  const around = neighbours(sp, all, lang);
  const related = relatedSpecies(sp, all, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: name,
    description: speciesSummary(sp, lang),
    inLanguage: lang,
    image: sp.image ? new URL(sp.image, SITE_URL).toString() : undefined,
    dateModified: sp.updated_at,
    mainEntityOfPage: `${SITE_URL}/${lang}${speciesPath(sp.id)}`,
    about: { "@type": "Taxon", name: sp.scientific_name ?? sp.name_en, alternateName: [sp.name_en, sp.name_th] },
    publisher: { "@type": "Organization", name: "Udomtong Farm", url: SITE_URL },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="shell pt-8 text-[0.8125rem] text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={localePath(lang, "/collection")} className="transition-colors hover:text-ink">
              {t.nav.collection}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={localePath(lang, `/collection?type=${sp.type}`)} className="transition-colors hover:text-ink">
              {department}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="shell grid gap-10 pb-16 pt-8 md:pb-24 lg:grid-cols-12 lg:gap-16">
        {/* The photograph */}
        <figure className="lg:col-span-6 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-wall p-6 sm:p-12">
            <SpeciesImage
              src={sp.image}
              alt={name}
              fit="contain"
              sizes="(min-width: 1024px) 30rem, 90vw"
              priority
              className="aspect-square"
            />
          </div>
          <figcaption className="mt-3 text-[0.8125rem] text-faint">{t.species.photoNote}</figcaption>
        </figure>

        {/* The label */}
        <div className="lg:col-span-6">
          <p className="eyebrow">{department}</p>
          <h1 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">{name}</h1>
          {sp.scientific_name && <p className="scientific mt-3 text-2xl text-muted">{sp.scientific_name}</p>}
          <p className="lede mt-7">{speciesSummary(sp, lang)}</p>

          <dl className="label-list mt-9 text-[0.9375rem]">
            {otherName && otherName !== name && (
              <>
                <dt>{t.species.alsoKnown}</dt>
                <dd lang={otherLocale(lang)}>{otherName}</dd>
              </>
            )}
            <dt>{t.species.department}</dt>
            <dd>{department}</dd>
            <dt>{t.status.label}</dt>
            <dd>
              {sp.status ? (
                <StatusScale status={sp.status} labels={t.status} />
              ) : (
                <span className="text-muted">{t.common.notEvaluated}</span>
              )}
            </dd>
            {sp.tags.length > 0 && (
              <>
                <dt>{t.species.groups}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {sp.tags.map((tag) => (
                      <li key={tag}>
                        <Link href={localePath(lang, `/collection?group=${encodeURIComponent(tag)}`)} className="link">
                          {tagLabel(tag, lang)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <FavoriteButton
              speciesId={sp.id}
              lang={lang}
              labels={{ save: t.species.save, saved: t.species.saved, signInToSave: t.species.signInToSave }}
            />
            <CopyLinkButton label={t.species.copyLink} copiedLabel={t.species.linkCopied} />
          </div>

          {paragraphs.length > 0 && (
            <section className="mt-14 border-t border-line pt-10">
              <h2 className="eyebrow">{t.species.about}</h2>
              <div className="prose mt-5">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {sp.sources.length > 0 && (
            <section className="mt-12 border-t border-line pt-10">
              <h2 className="eyebrow">{t.species.sources}</h2>
              <ul className="mt-5 space-y-2 text-[0.9375rem]">
                {sp.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer" className="link">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {around && (
        <nav aria-label={department} className="border-y border-line">
          <div className="shell grid grid-cols-2">
            <Link href={localePath(lang, speciesPath(around.prev.id))} className="group py-7 pr-4">
              <span className="eyebrow">← {t.species.previous}</span>
              <span className="mt-1.5 block font-serif text-xl decoration-1 underline-offset-4 group-hover:underline sm:text-2xl">
                {speciesName(around.prev, lang)}
              </span>
            </Link>
            <Link href={localePath(lang, speciesPath(around.next.id))} className="group border-l border-line py-7 pl-4 text-right">
              <span className="eyebrow">{t.species.next} →</span>
              <span className="mt-1.5 block font-serif text-xl decoration-1 underline-offset-4 group-hover:underline sm:text-2xl">
                {speciesName(around.next, lang)}
              </span>
            </Link>
          </div>
        </nav>
      )}

      {related.length > 0 && (
        <section className="shell py-20">
          <h2 className="display text-3xl md:text-4xl">{t.species.related}</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-8">
            {related.map((item) => (
              <li key={item.id}>
                <SpeciesCard species={toCardData(item)} lang={lang} statusLabels={t.status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
