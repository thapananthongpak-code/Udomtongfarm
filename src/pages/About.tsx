import { Link } from "react-router-dom";
import FarmOffers from "@/components/FarmOffers";
import PageIntro from "@/components/PageIntro";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { FOUNDER } from "@/lib/farm";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";

export default function About() {
  const lang = useLang();
  const t = useT();
  const { status, species } = useData();
  usePageMeta(t.nav.about, t.meta.about);

  const numbers = [
    { value: t.farm.areaValue, label: t.farm.areaLabel },
    { value: t.farm.admissionValue, label: t.farm.admissionLabel },
    // The count is left out until the collection has been read.
    ...(status === "ready" ? [{ value: String(species.length), label: t.home.statSpecies }] : []),
  ];

  return (
    <>
      <PageIntro eyebrow={t.about.eyebrow} title={t.about.title} lede={t.about.lede} />

      <section className="border-t border-line">
        <div className="shell grid gap-10 py-16 md:py-24 lg:grid-cols-12">
          <h2 className="display text-3xl md:text-4xl lg:col-span-4">{t.about.storyTitle}</h2>
          <div className="prose lg:col-span-7 lg:col-start-6">
            {t.about.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-wall">
        <div className="shell py-16 md:py-20">
          <h2 className="eyebrow">{t.about.numbersTitle}</h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-3">
            {numbers.map((item) => (
              <div key={item.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-[0.9375rem] text-muted">{item.label}</dt>
                <dd className="font-serif text-5xl md:text-6xl">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className="shell py-16 md:py-24">
          <h2 className="display text-3xl md:text-4xl">{t.farm.offerTitle}</h2>
          <div className="mt-12">
            <FarmOffers offers={t.farm.offers} />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell grid gap-10 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t.about.founderEyebrow}</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">{FOUNDER.name[lang]}</h2>
            <p className="mt-4 text-[0.9375rem] text-muted">{FOUNDER.title[lang]}</p>
            <p className="text-[0.9375rem] text-muted">{FOUNDER.org[lang]}</p>
          </div>
          <div className="prose lg:col-span-7 lg:col-start-6">
            <p>{FOUNDER.bio[lang]}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-16 md:py-24">
          <h2 className="display text-3xl md:text-4xl">{t.about.valuesTitle}</h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {t.about.values.map((value) => (
              <li key={value.title} className="border-t border-ink pt-5">
                <h3 className="font-serif text-2xl">{value.title}</h3>
                <p className="mt-3 text-[0.9375rem] text-muted">{value.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-16 md:py-20">
          <h2 className="display max-w-2xl text-3xl md:text-4xl">{t.home.visitTitle}</h2>
          <p className="mt-4 max-w-xl text-muted">{t.home.visitBody}</p>
          <Link to={localePath(lang, "/visit")} className="btn btn-primary mt-8">
            {t.home.visit}
          </Link>
        </div>
      </section>
    </>
  );
}
