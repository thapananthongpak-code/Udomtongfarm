import { Link } from "react-router-dom";
import FarmOffers from "@/components/FarmOffers";
import PageLoading from "@/components/PageLoading";
import SectionHeading from "@/components/SectionHeading";
import SpeciesCard from "@/components/species/SpeciesCard";
import SpeciesImage from "@/components/species/SpeciesImage";
import { format, localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { isNew, newFirst, speciesName, speciesPath, speciesSummary } from "@/lib/species/helpers";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";

export default function Home() {
  const lang = useLang();
  const t = useT();
  const { status, species: all } = useData();
  usePageMeta();

  if (status === "loading") return <PageLoading />;

  const animals = all.filter((sp) => sp.type === "animal");
  const plants = all.filter((sp) => sp.type === "plant");
  const highlighted = all.filter((sp) => sp.featured);
  const highlights = (highlighted.length ? highlighted : all).slice(0, 6);
  // The opening photo is only drawn for an entry that has one.
  const lead = highlights.find((sp) => sp.image);
  const arrivals = newFirst(all.filter((sp) => isNew(sp))).slice(0, 3);

  const stats: { value: string | number; label: string }[] = [
    { value: t.farm.admissionValue, label: t.farm.admissionLabel },
    { value: all.length, label: t.home.statSpecies },
    { value: t.farm.roomsValue, label: t.farm.roomsLabel },
  ];

  const departments = [
    { type: "animal" as const, title: t.common.animals, body: t.home.animalsBody, list: animals },
    { type: "plant" as const, title: t.common.plants, body: t.home.plantsBody, list: plants },
  ].filter((department) => department.list.length > 0);

  return (
    <>
      {/* Opening: a pale green panel with the invitation, and a featured entry when one has a photo */}
      <section className="shell pt-5 md:pt-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-wall px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <Leaves className="pointer-events-none absolute -right-10 -top-6 hidden w-80 text-accent opacity-25 md:block lg:w-[26rem]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className={lead ? "lg:col-span-7" : "lg:col-span-8"}>
              <p className="eyebrow">{t.site.location}</p>
              <h1 className="display mt-4 text-[2.25rem] sm:text-5xl lg:text-6xl">{t.home.title}</h1>
              <p className="lede mt-5 max-w-xl">{t.home.lede}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={localePath(lang, "/gallery")} className="btn btn-primary">
                  {t.home.browse}
                </Link>
                <Link to={localePath(lang, "/visit")} className="btn">
                  {t.home.visit}
                </Link>
              </div>
            </div>

            {lead && (
              <figure className="lg:col-span-5">
                <Link to={localePath(lang, speciesPath(lead.id))} className="group lift block rounded-3xl bg-surface p-4 sm:p-6">
                  <SpeciesImage src={lead.image} alt={speciesName(lead, lang)} priority className="aspect-square" />
                  <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-[0.9375rem]">
                    <span className="font-serif text-lg transition-colors group-hover:text-accent">{speciesName(lead, lang)}</span>
                    <span className="eyebrow shrink-0">{t.home.onView}</span>
                  </figcaption>
                </Link>
              </figure>
            )}
          </div>
        </div>

        {/* The farm at a glance */}
        <dl aria-label={t.about.numbersTitle} className="mt-4 grid grid-cols-3 gap-3 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card flex flex-col-reverse px-4 py-4 sm:px-6 sm:py-5">
              <dt className="mt-0.5 text-[0.8125rem] text-muted">{stat.label}</dt>
              <dd className="text-2xl font-semibold text-accent sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* New arrivals */}
      {arrivals.length > 0 && (
        <section aria-label={t.home.newTitle} className="shell pt-14 md:pt-20">
          <SectionHeading eyebrow={t.home.newEyebrow} title={t.home.newTitle} />
          <p className="mt-3 max-w-xl text-[0.9375rem] text-muted">{t.home.newBody}</p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {arrivals.map((sp) => (
              <li key={sp.id}>
                <Link
                  to={localePath(lang, speciesPath(sp.id))}
                  className="group lift card flex h-full items-start justify-between gap-4 p-5 hover:border-accent"
                >
                  <span className="min-w-0">
                    <span className="block font-serif text-lg transition-colors group-hover:text-accent">
                      {speciesName(sp, lang)}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-[0.9375rem] text-muted">{speciesSummary(sp, lang)}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-[0.75rem] font-semibold text-on-accent">
                    {t.common.isNew}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* What is on the farm */}
      <section className="shell pt-14 md:pt-20">
        <SectionHeading eyebrow={t.home.offerEyebrow} title={t.farm.offerTitle} />
        <div className="mt-8">
          <FarmOffers offers={t.farm.offers} />
        </div>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="shell pt-14 md:pt-20">
          <SectionHeading eyebrow={t.home.highlightsEyebrow} title={t.home.highlightsTitle}>
            <Link to={localePath(lang, "/gallery")} className="link text-[0.9375rem]">
              {t.common.viewGallery}
            </Link>
          </SectionHeading>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8">
            {highlights.map((sp) => (
              <li key={sp.id}>
                <SpeciesCard species={sp} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Departments */}
      {departments.length > 0 && (
        <section className="shell pt-14 md:pt-20">
          <SectionHeading eyebrow={t.home.departmentsEyebrow} title={t.home.departmentsTitle} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
            {departments.map((department) => {
              const cover = department.list.find((sp) => sp.featured && sp.image) ?? department.list.find((sp) => sp.image);
              return (
                <Link
                  key={department.type}
                  to={localePath(lang, `/gallery?tab=${department.type === "animal" ? "animals" : "plants"}`)}
                  className="group lift card grid grid-cols-[6rem_1fr] items-center gap-5 p-4 hover:border-accent sm:grid-cols-[9rem_1fr] sm:gap-7 sm:p-5"
                >
                  <SpeciesImage src={cover?.image ?? ""} alt="" placeholder={department.type} className="aspect-square" />
                  <div>
                    <p className="text-[0.8125rem] text-muted">{format(t.common.speciesCount, { n: department.list.length })}</p>
                    <h3 className="display mt-1 text-2xl transition-colors group-hover:text-accent sm:text-3xl">
                      {department.title}
                      <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </h3>
                    <p className="mt-2 text-[0.9375rem] text-muted">{department.body}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* About and visit */}
      <section className="shell grid gap-4 pt-14 md:grid-cols-2 md:gap-6 md:pt-20">
        <div className="card p-6 sm:p-8">
          <p className="eyebrow">{t.home.aboutEyebrow}</p>
          <h2 className="display mt-3 text-2xl md:text-3xl">{t.home.aboutTitle}</h2>
          <p className="mt-4 text-muted">{t.home.aboutBody}</p>
          <Link to={localePath(lang, "/about")} className="link mt-5 inline-block text-[0.9375rem]">
            {t.home.aboutLink}
          </Link>
        </div>
        <div className="rounded-[var(--radius)] bg-accent p-6 text-on-accent sm:p-8">
          <p className="text-[0.875rem] font-semibold opacity-90">{t.nav.visit}</p>
          <h2 className="display mt-3 text-2xl md:text-3xl">{t.home.visitTitle}</h2>
          <p className="mt-4 opacity-90">{t.home.visitBody}</p>
          <p className="mt-2 text-[0.9375rem]">
            {t.visit.hoursValue} · {t.visit.hoursNote}
          </p>
          <Link
            to={localePath(lang, "/visit")}
            className="btn mt-6 border-on-accent bg-transparent text-on-accent hover:border-on-accent hover:bg-on-accent hover:text-accent"
          >
            {t.home.visit}
          </Link>
        </div>
      </section>
    </>
  );
}

/** A loose spray of leaves, drawn in outline for the corner of the opening panel. */
function Leaves({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <path d="M100 190C98 140 110 90 150 40" />
      <path d="M150 40c-20 2-36 14-40 34 20-2 36-14 40-34Z" />
      <path d="M132 70c18 2 34 14 38 32-19-1-34-13-38-32Z" />
      <path d="M118 102c-21 0-38 11-44 30 21 0 38-11 44-30Z" />
      <path d="M110 132c17 4 30 17 32 35-18-3-30-16-32-35Z" />
      <path d="M60 180c-4-30 6-58 30-80" />
      <path d="M90 100c-18-2-33 6-40 22 18 2 33-6 40-22Z" />
      <path d="M72 140c-16-6-32-2-42 12 16 6 32 2 42-12Z" />
    </svg>
  );
}
