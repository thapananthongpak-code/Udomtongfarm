import { Fragment } from "react";
import PageIntro from "@/components/PageIntro";
import { useLang, useT } from "@/i18n/hooks";
import { MAP_EMBED_URL, addressFor, displayUrl, formatPhone } from "@/lib/farm";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";

export default function Visit() {
  const lang = useLang();
  const t = useT();
  const { settings: contact } = useData();
  usePageMeta(t.visit.title, t.meta.visit);

  return (
    <>
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
            <address className="not-italic">{addressFor(contact, lang)}</address>
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
