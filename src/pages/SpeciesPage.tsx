import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import CopyLinkButton from "@/components/CopyLinkButton";
import NotFoundContent from "@/components/NotFoundContent";
import PageLoading from "@/components/PageLoading";
import FavoriteButton from "@/components/species/FavoriteButton";
import SpeciesCard from "@/components/species/SpeciesCard";
import SpeciesImage from "@/components/species/SpeciesImage";
import { localePath, otherLocale } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import {
  isNew,
  neighbours,
  relatedSpecies,
  speciesBody,
  speciesName,
  speciesPath,
  speciesSummary,
  tagLabel,
  toParagraphs,
} from "@/lib/species/helpers";
import { speciesQrUrl } from "@/lib/site";
import type { Species } from "@/lib/species/types";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";

// The QR library is only downloaded when a species page is opened.
const QrCode = lazy(() => import("@/components/QrCode"));

export default function SpeciesPage() {
  const { id } = useParams();
  const { status, species: all } = useData();
  const sp = all.find((item) => item.id === id);

  if (status === "loading") return <PageLoading />;
  if (!sp) return <NotFoundContent />;
  return <SpeciesEntry sp={sp} all={all} />;
}

function SpeciesEntry({ sp, all }: { sp: Species; all: Species[] }) {
  const lang = useLang();
  const t = useT();
  const name = speciesName(sp, lang);
  const otherName = speciesName(sp, otherLocale(lang));
  const department = sp.type === "animal" ? t.common.animals : t.common.plants;
  const paragraphs = toParagraphs(speciesBody(sp, lang), lang);
  const around = neighbours(sp, all, lang);
  const related = relatedSpecies(sp, all, 4);

  usePageMeta(sp.scientific_name ? `${name} (${sp.scientific_name})` : name, speciesSummary(sp, lang));

  return (
    <article>
      <nav aria-label="Breadcrumb" className="shell pt-8 text-[0.8125rem] text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to={localePath(lang, "/gallery")} className="transition-colors hover:text-ink">
              {t.nav.gallery}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link to={localePath(lang, `/gallery?tab=${sp.type === "animal" ? "animals" : "plants"}`)} className="transition-colors hover:text-ink">
              {department}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="shell grid gap-10 pb-16 pt-8 md:pb-24 lg:grid-cols-12 lg:gap-16">
        {/* The photograph */}
        {sp.image && (
          <figure className="lg:sticky lg:top-24 lg:col-span-6 lg:self-start">
            <div className="bg-wall p-6 sm:p-12">
              <SpeciesImage src={sp.image} alt={name} fit="contain" priority placeholder={sp.type} className="aspect-square" />
            </div>
            <figcaption className="mt-3 text-[0.8125rem] text-faint">{t.species.photoNote}</figcaption>
          </figure>
        )}

        {/* The label */}
        <div className={sp.image ? "lg:col-span-6" : "lg:col-span-8"}>
          <p className="eyebrow flex flex-wrap items-center gap-3">
            {department}
            {isNew(sp) && (
              <span className="bg-accent px-2 py-0.5 text-[0.75rem] font-medium normal-case tracking-normal text-on-accent">
                {t.common.isNew}
              </span>
            )}
          </p>
          <h1 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">{name}</h1>
          {sp.scientific_name && <p lang="la" className="scientific mt-3 text-2xl text-muted">{sp.scientific_name}</p>}
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
            {sp.tags.length > 0 && (
              <>
                <dt>{t.species.groups}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {sp.tags.map((tag) => (
                      <li key={tag}>
                        <Link to={localePath(lang, `/gallery?tab=${sp.type === "animal" ? "animals" : "plants"}&group=${encodeURIComponent(tag)}`)} className="link">
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
            <FavoriteButton speciesId={sp.id} />
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

          <section aria-labelledby="species-qr" className="mt-12 flex items-center gap-6 border-t border-line pt-10 print:break-inside-avoid">
            <Suspense fallback={<div aria-hidden className="size-28 shrink-0 bg-wall" />}>
              <QrCode url={speciesQrUrl(sp.id)} label={`${t.species.qrTitle}: ${name}`} className="size-28 shrink-0 border border-line-strong" />
            </Suspense>
            <div>
              <h2 id="species-qr" className="eyebrow">
                {t.species.qrTitle}
              </h2>
              <p className="mt-2 text-[0.9375rem] text-muted">{t.species.qrBody}</p>
            </div>
          </section>

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
            <Link to={localePath(lang, speciesPath(around.prev.id))} className="group py-7 pr-4">
              <span className="eyebrow">← {t.species.previous}</span>
              <span className="mt-1.5 block font-serif text-xl decoration-1 underline-offset-4 group-hover:underline sm:text-2xl">
                {speciesName(around.prev, lang)}
              </span>
            </Link>
            <Link to={localePath(lang, speciesPath(around.next.id))} className="group border-l border-line py-7 pl-4 text-right">
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
                <SpeciesCard species={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
