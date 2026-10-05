import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import PageIntro from "@/components/PageIntro";
import { getDictionary, isLocale } from "@/i18n";
import { addressFor, displayUrl, formatPhone, getSiteSettings } from "@/lib/settings";
import { MAP_EMBED_URL, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.visit.title,
    description: t.meta.visit,
    alternates: { canonical: `/${lang}/visit`, languages: { th: "/th/visit", en: "/en/visit", "x-default": "/th/visit" } },
  };
}

export default async function VisitPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const contact = await getSiteSettings();
  const address = addressFor(contact, lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: t.site.name,
    url: `${SITE_URL}/${lang}`,
    telephone: `+66${contact.phone.replace(/^0/, "")}`,
    address: { "@type": "PostalAddress", streetAddress: address, addressCountry: "TH" },
    openingHours: "Mo-Su 08:00-17:00",
    isAccessibleForFree: true,
    sameAs: contact.facebook_url ? [contact.facebook_url] : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageIntro eyebrow={t.visit.eyebrow} title={t.visit.title} lede={t.visit.lede} />

      <section className="shell grid gap-12 pb-16 md:pb-24 lg:grid-cols-12">
        <dl className="label-list self-start text-[0.9375rem] lg:col-span-5">
          <dt>{t.visit.admission}</dt>
          <dd>{t.visit.admissionValue}</dd>
          <dt>{t.visit.hours}</dt>
          <dd>
            {t.visit.hoursValue}
            <span className="block text-muted">{t.visit.hoursNote}</span>
          </dd>
          <dt>{t.visit.area}</dt>
          <dd>{t.farm.areaFull}</dd>
          <dt>{t.visit.onSite}</dt>
          <dd>
            {t.visit.onSiteValue}
            <span className="block text-muted">{t.visit.onSiteNote}</span>
          </dd>
          <dt>{t.visit.phone}</dt>
          <dd>
            <a href={`tel:${contact.phone}`} className="link">
              {formatPhone(contact.phone)}
            </a>
            <span className="block text-muted">{t.visit.phoneHours}</span>
          </dd>
          {contact.facebook_url && (
            <>
              <dt>{t.visit.facebook}</dt>
              <dd>
                <a href={contact.facebook_url} target="_blank" rel="noreferrer" className="link break-all">
                  {displayUrl(contact.facebook_url)}
                </a>
                <span className="block text-muted">{t.visit.facebookNote}</span>
              </dd>
            </>
          )}
          <dt>{t.visit.address}</dt>
          <dd>
            <address className="not-italic">{address}</address>
            {contact.map_url && (
              <a href={contact.map_url} target="_blank" rel="noreferrer" className="link mt-1 inline-block">
                {t.visit.openMaps}
              </a>
            )}
          </dd>
        </dl>

        <div className="lg:col-span-7">
          <iframe
            src={MAP_EMBED_URL}
            title={t.visit.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-[4/3] w-full border border-line bg-wall"
          />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-16 md:py-24">
          <h2 className="display text-3xl md:text-4xl">{t.farm.activitiesTitle}</h2>
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.farm.activities.map((activity) => (
              <li key={activity.title} className="border-t border-ink pt-5">
                <h3 className="font-serif text-2xl">{activity.title}</h3>
                <p className="mt-3 text-[0.9375rem] text-muted">{activity.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="stay" className="border-t border-line bg-wall">
        <div className="shell grid gap-10 py-16 md:py-24 lg:grid-cols-12">
          <h2 className="display text-3xl md:text-4xl lg:col-span-4">{t.farm.stayTitle}</h2>
          <dl className="label-list self-start text-[0.9375rem] lg:col-span-7 lg:col-start-6">
            {t.farm.stay.map((row) => (
              <Fragment key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-16 md:py-24">
          <h2 className="display text-3xl md:text-4xl">{t.visit.gettingThere}</h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {t.visit.routes.map((route) => (
              <li key={route.title} className="border-t border-ink pt-5">
                <h3 className="font-serif text-2xl">{route.title}</h3>
                <p className="mt-3 text-[0.9375rem] text-muted">{route.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell grid gap-10 py-16 md:py-24 lg:grid-cols-12">
          <h2 className="display text-3xl md:text-4xl lg:col-span-4">{t.visit.faqTitle}</h2>
          <div className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {t.visit.faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 font-serif text-xl [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span aria-hidden className="font-sans text-base text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-xl pb-6 text-[0.9375rem] text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
