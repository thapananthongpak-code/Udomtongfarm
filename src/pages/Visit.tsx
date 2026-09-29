import { Bus, CarFront, ChevronDown, Clock, Copy, ExternalLink, Info, MapPin, Phone, TrainFront } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { FacebookIcon } from "../components/Icons";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../lib/i18n";
import { CONTACT } from "../lib/site";
import { usePrefs } from "../store/prefs";
import { useUI } from "../store/ui";

const ROUTE_ICONS = { car: CarFront, bus: Bus, train: TrainFront } as const;

export default function Visit() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const showToast = useUI((s) => s.showToast);
  useDocumentMeta({ title: t.nav.visit, description: t.meta.visitDescription });

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(`${t.brand}, ${CONTACT.address[lang]}`);
      showToast(t.visit.addressCopied);
    } catch {
      showToast(t.article.copyFailed);
    }
  }

  return (
    <>
      <PageHeader eyebrow={t.visit.eyebrow} title={t.visit.title} lede={t.visit.lede} />

      <div className="container">
        <ul className="info-grid">
          <li className="info-card">
            <span className="info-card__icon"><MapPin size={20} aria-hidden /></span>
            <h2 className="info-card__label">{t.visit.address}</h2>
            <p className="info-card__value">{CONTACT.address[lang]}</p>
            <button type="button" className="text-link" onClick={copyAddress}>
              <Copy size={15} aria-hidden /> {t.visit.copyAddress}
            </button>
          </li>
          <li className="info-card">
            <span className="info-card__icon"><Phone size={20} aria-hidden /></span>
            <h2 className="info-card__label">{t.visit.phone}</h2>
            <a className="info-card__value info-card__value--big" href={`tel:${CONTACT.phone}`}>
              {CONTACT.phoneDisplay}
            </a>
            <p className="info-card__note">{t.visit.phoneHours}</p>
          </li>
          <li className="info-card">
            <span className="info-card__icon"><Clock size={20} aria-hidden /></span>
            <h2 className="info-card__label">{t.visit.hours}</h2>
            <p className="info-card__value">{t.visit.hoursValue}</p>
            <p className="info-card__note">{t.visit.hoursNote}</p>
          </li>
          <li className="info-card">
            <span className="info-card__icon"><FacebookIcon size={20} /></span>
            <h2 className="info-card__label">{t.visit.facebook}</h2>
            <p className="info-card__value">{CONTACT.facebookHandle}</p>
            <a className="text-link" href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer">
              {t.visit.openFacebook} <ExternalLink size={15} aria-hidden />
            </a>
          </li>
        </ul>

        <p className="notice">
          <Info size={18} aria-hidden /> {t.visit.appointment}
        </p>
      </div>

      <section className="section section--tight">
        <div className="container map-layout">
          <div className="map-frame">
            <iframe
              title={`${t.visit.mapTitle}: ${t.brand}`}
              src={CONTACT.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div>
            <h2 className="section-head__title">{t.visit.gettingThere}</h2>
            <ul className="routes">
              {t.visit.routes.map((route) => {
                const Icon = ROUTE_ICONS[route.mode as keyof typeof ROUTE_ICONS];
                return (
                  <li key={route.mode} className="route">
                    <span className="route__icon"><Icon size={20} aria-hidden /></span>
                    <div>
                      <h3 className="route__title">{route.title}</h3>
                      <p>{route.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="button-row">
              <a className="btn btn--primary" href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPin size={18} aria-hidden /> {t.visit.openMaps}
              </a>
              <a className="btn btn--secondary" href={`tel:${CONTACT.phone}`}>
                <Phone size={18} aria-hidden /> {t.visit.call}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container faq">
          <h2 className="section-head__title">{t.visit.faqTitle}</h2>
          <div className="faq__list">
            {t.visit.faqs.map((item) => (
              <details key={item.q} className="faq__item">
                <summary>
                  {item.q}
                  <ChevronDown size={20} aria-hidden className="faq__chevron" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
