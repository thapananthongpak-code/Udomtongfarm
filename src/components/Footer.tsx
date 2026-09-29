import { Link } from "react-router-dom";
import { ArrowUp, Clock, MapPin, Phone, Rss } from "lucide-react";
import { useT } from "../lib/i18n";
import { CONTACT } from "../lib/site";
import { usePrefs } from "../store/prefs";
import { FacebookIcon, LogoMark } from "./Icons";

export default function Footer() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link to="/" className="brand brand--footer">
            <LogoMark size={40} />
            <span className="brand__text">
              <span className="brand__name">{t.brand}</span>
              <span className="brand__sub">{t.brandSub}</span>
            </span>
          </Link>
          <p>{t.footer.about}</p>
        </div>

        <nav aria-label={t.footer.explore}>
          <h2 className="site-footer__title">{t.footer.explore}</h2>
          <ul className="site-footer__list">
            <li><Link to="/encyclopedia">{t.nav.encyclopedia}</Link></li>
            <li><Link to="/gallery">{t.nav.gallery}</Link></li>
            <li><Link to="/compare">{t.nav.compare}</Link></li>
            <li><Link to="/saved">{t.nav.saved}</Link></li>
            <li><Link to="/about">{t.nav.about}</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__title">{t.footer.visit}</h2>
          <ul className="site-footer__list site-footer__list--icons">
            <li>
              <MapPin size={16} aria-hidden />
              <Link to="/visit">{CONTACT.address[lang]}</Link>
            </li>
            <li>
              <Phone size={16} aria-hidden />
              <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneDisplay}</a>
            </li>
            <li>
              <Clock size={16} aria-hidden />
              <span>
                {t.visit.hoursValue}
                <br />
                {t.visit.hoursNote}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="site-footer__title">{t.footer.follow}</h2>
          <ul className="site-footer__list site-footer__list--icons">
            <li>
              <FacebookIcon size={16} />
              <a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <Rss size={16} aria-hidden />
              <a href="/feed.xml">{t.footer.rss}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>{t.footer.rights(year)}</p>
        <button type="button" className="link-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          {t.footer.backToTop} <ArrowUp size={15} aria-hidden />
        </button>
      </div>
    </footer>
  );
}
