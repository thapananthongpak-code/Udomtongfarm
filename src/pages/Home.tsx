import { Link } from "react-router-dom";
import FarmOffers from "@/components/FarmOffers";
import PageLoading from "@/components/PageLoading";
import SectionHeading from "@/components/SectionHeading";
import SpeciesCard from "@/components/species/SpeciesCard";
import SpeciesImage from "@/components/species/SpeciesImage";
import { StatusBadge } from "@/components/species/StatusBadge";
import { format, localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { isThreatened, sortSpecies, speciesName, speciesPath } from "@/lib/species/helpers";
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
  const lead = highlights[0];
  const threatened = sortSpecies(
    all.filter((sp) => isThreatened(sp.status)),
    "status",
    lang,
  );

  const stats: { value: string | number; label: string }[] = [
    { value: t.farm.areaValue, label: t.farm.areaLabel },
    { value: t.farm.admissionValue, label: t.farm.admissionLabel },
    { value: all.length, label: t.home.statSpecies },
    { value: threatened.length, label: t.home.statThreatened },
  ];

  const departments = [
    { type: "animal", title: t.common.animals, body: t.home.animalsBody, list: animals },
    { type: "plant", title: t.common.plants, body: t.home.plantsBody, list: plants },
  ].filter((department) => department.list.length > 0);

  return (
    <>
      {/* Opening */}
      <section className="shell grid items-center gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="eyebrow">{t.site.location}</p>
          <h1 className="display mt-5 text-[2.5rem] sm:text-6xl lg:text-7xl">{t.home.title}</h1>
          <p className="lede mt-7 max-w-xl">{t.home.lede}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link to={localePath(lang, "/collection")} className="btn btn-primary">
              {t.home.browse}
            </Link>
            <Link to={localePath(lang, "/visit")} className="link text-[0.9375rem]">
              {t.home.visit}
            </Link>
          </div>
        </div>

        {lead && (
          <figure className="lg:col-span-5">
            <Link to={localePath(lang, speciesPath(lead.id))} className="group block bg-wall p-6 sm:p-10">
              <SpeciesImage
                src={lead.image}
                alt={speciesName(lead, lang)}
                priority
                className="aspect-square shadow-[0_18px_40px_-22px_rgb(0_0_0/0.45)] transition-opacity duration-300 group-hover:opacity-90"
              />
            </Link>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-[0.9375rem]">
              <span>
                <span className="font-serif text-lg">{speciesName(lead, lang)}</span>
                {lead.scientific_name && <span className="scientific ml-2 text-muted">{lead.scientific_name}</span>}
              </span>
              <span className="eyebrow shrink-0">{t.home.onView}</span>
            </figcaption>
          </figure>
        )}
      </section>

      {/* The farm at a glance */}
      <section aria-label={t.about.numbersTitle} className="shell">
        <dl className="grid grid-cols-2 gap-x-6 md:grid-cols-4 md:gap-x-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse border-t border-ink pb-8 pt-4">
              <dt className="mt-1 text-[0.8125rem] text-muted">{stat.label}</dt>
              <dd className="font-serif text-4xl md:text-5xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What is on the farm */}
      <section className="shell pb-4 pt-12 md:pt-20">
        <SectionHeading eyebrow={t.home.offerEyebrow} title={t.farm.offerTitle} />
        <div className="mt-12">
          <FarmOffers offers={t.farm.offers} />
        </div>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="shell py-20 md:py-28">
          <SectionHeading eyebrow={t.home.highlightsEyebrow} title={t.home.highlightsTitle}>
            <Link to={localePath(lang, "/collection")} className="link text-[0.9375rem]">
              {t.common.viewCollection}
            </Link>
          </SectionHeading>
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-10">
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
        <section className="border-t border-line">
          <div className="shell py-20 md:py-28">
            <SectionHeading eyebrow={t.home.departmentsEyebrow} title={t.home.departmentsTitle} />
            <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
              {departments.map((department) => {
                const cover = department.list.find((sp) => sp.featured && sp.image) ?? department.list.find((sp) => sp.image);
                return (
                  <Link
                    key={department.type}
                    to={localePath(lang, `/collection?type=${department.type}`)}
                    className="group grid grid-cols-[7rem_1fr] items-center gap-6 border-t border-ink pt-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
                  >
                    <SpeciesImage
                      src={cover?.image ?? ""}
                      alt=""
                      className="aspect-square transition-opacity duration-300 group-hover:opacity-85"
                    />
                    <div>
                      <p className="text-[0.8125rem] text-muted">{format(t.common.speciesCount, { n: department.list.length })}</p>
                      <h3 className="display mt-1 text-3xl decoration-1 underline-offset-8 group-hover:underline sm:text-4xl">
                        {department.title}
                      </h3>
                      <p className="mt-3 text-[0.9375rem] text-muted">{department.body}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Conservation */}
      {threatened.length > 0 && (
        <section className="border-t border-line">
          <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">{t.home.watchEyebrow}</p>
              <h2 className="display mt-3 text-3xl md:text-4xl">{t.home.watchTitle}</h2>
              <p className="mt-5 text-[0.9375rem] text-muted">{t.home.watchLede}</p>
            </div>
            <ul className="border-t border-ink lg:col-span-7 lg:col-start-6">
              {threatened.map((sp) => (
                <li key={sp.id} className="border-b border-line">
                  <Link to={localePath(lang, speciesPath(sp.id))} className="group flex items-baseline justify-between gap-4 py-4">
                    <span className="min-w-0">
                      <span className="font-serif text-xl decoration-1 underline-offset-4 group-hover:underline">
                        {speciesName(sp, lang)}
                      </span>
                      {sp.scientific_name && <span className="scientific ml-3 hidden text-muted sm:inline">{sp.scientific_name}</span>}
                    </span>
                    {sp.status && <StatusBadge status={sp.status} labels={t.status} full />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* About and visit */}
      <section className="border-t border-line">
        <div className="shell grid gap-16 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="eyebrow">{t.home.aboutEyebrow}</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">{t.home.aboutTitle}</h2>
            <p className="mt-5 max-w-md text-muted">{t.home.aboutBody}</p>
            <Link to={localePath(lang, "/about")} className="link mt-6 inline-block text-[0.9375rem]">
              {t.home.aboutLink}
            </Link>
          </div>
          <div>
            <p className="eyebrow">{t.nav.visit}</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">{t.home.visitTitle}</h2>
            <p className="mt-5 max-w-md text-muted">{t.home.visitBody}</p>
            <p className="mt-2 text-[0.9375rem]">
              {t.visit.hoursValue}
              <span className="text-muted"> · {t.visit.hoursNote}</span>
            </p>
            <Link to={localePath(lang, "/visit")} className="link mt-6 inline-block text-[0.9375rem]">
              {t.home.visit}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
