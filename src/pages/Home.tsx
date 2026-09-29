import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Phone, Search } from "lucide-react";
import SpeciesCard from "../components/SpeciesCard";
import { SpeciesImage, StatusBadge, TypeLabel } from "../components/SpeciesBits";
import { LogoMark } from "../components/Icons";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../lib/i18n";
import { CONTACT, FOUNDER } from "../lib/site";
import {
  COUNTS,
  FEATURED_IDS,
  SPECIES_BY_ID,
  TAGS,
  THREATENED,
  readingMinutes,
  speciesName,
  speciesOfTheDay,
  speciesPath,
  speciesSummary,
  tagLabel,
  toParagraphs,
  speciesBody,
} from "../lib/species";
import { useLibrary } from "../store/library";
import { usePrefs } from "../store/prefs";
import type { Species } from "../types/species";

const FEATURED = FEATURED_IDS.map((id) => SPECIES_BY_ID.get(id)).filter((sp): sp is Species => !!sp);

export default function Home() {
  const t = useT();
  useDocumentMeta({ description: t.meta.homeDescription });

  return (
    <>
      <Hero />
      <SpeciesOfTheDay />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t.home.featuredEyebrow} title={t.home.featuredTitle} link={{ to: "/encyclopedia", label: t.common.viewAll }} />
          <div className="card-grid card-grid--three">
            {FEATURED.map((sp) => (
              <SpeciesCard key={sp.id} sp={sp} />
            ))}
          </div>
        </div>
      </section>
      <ConservationWatch />
      <Collections />
      <RecentlyViewed />
      <AboutTeaser />
    </>
  );
}

function SectionHead({ eyebrow, title, link, lede }: { eyebrow: string; title: string; lede?: string; link?: { to: string; label: string } }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-head__title">{title}</h2>
        {lede && <p className="section-head__lede">{lede}</p>}
      </div>
      {link && (
        <Link to={link.to} className="text-link">
          {link.label} <ArrowRight size={16} aria-hidden />
        </Link>
      )}
    </div>
  );
}

function Hero() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/encyclopedia?q=${encodeURIComponent(q)}` : "/encyclopedia");
  }

  const stats = [
    { value: COUNTS.all, label: t.home.statSpecies, to: "/encyclopedia" },
    { value: COUNTS.animal, label: t.home.statAnimals, to: "/encyclopedia?type=animal" },
    { value: COUNTS.plant, label: t.home.statPlants, to: "/encyclopedia?type=plant" },
    { value: THREATENED.length, label: t.home.statThreatened, to: "/encyclopedia?status=threatened" },
  ];

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--icon">
            <MapPin size={15} aria-hidden /> {t.home.eyebrow}
          </p>
          <h1 className="hero__title">{t.home.title}</h1>
          <p className="hero__lede">{t.home.lede}</p>

          <form className="search-field search-field--hero" role="search" onSubmit={onSubmit}>
            <Search size={20} aria-hidden className="search-field__icon" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.home.searchPlaceholder}
              aria-label={t.home.searchPlaceholder}
            />
            <button type="submit" className="btn btn--primary">
              {t.home.searchButton}
            </button>
          </form>

          <div className="hero__actions">
            <Link to="/encyclopedia" className="btn btn--primary btn--lg">
              {t.home.ctaBrowse} <ArrowRight size={18} aria-hidden />
            </Link>
            <Link to="/visit" className="btn btn--secondary btn--lg">
              {t.home.ctaVisit}
            </Link>
          </div>
        </div>

        <div className="hero__media">
          <figure className="hero__photo">
            <img
              src="/images/farm-landscape.jpg"
              alt={lang === "th" ? "ภาพมุมกว้างของแปลงเกษตรและป่าเขาในฟาร์ม" : "Wide view of the farm gardens and forested hills"}
              width={640}
              height={640}
              fetchPriority="high"
            />
          </figure>
          <div className="hero__badge">
            <LogoMark size={40} />
            <div>
              <strong>{t.brand}</strong>
              <span>{t.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <ul className="stats">
          {stats.map((s) => (
            <li key={s.label}>
              <Link to={s.to} className="stats__item">
                <span className="stats__value">{s.value}</span>
                <span className="stats__label">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SpeciesOfTheDay() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const [today] = useState(() => new Date());
  const sp = speciesOfTheDay(today);
  const dateLabel = today.toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "long" });
  const excerpt = toParagraphs(speciesBody(sp, lang), lang)[0] ?? "";

  return (
    <section className="section section--tight">
      <div className="container">
        <article className="feature">
          <div className="feature__media">
            <SpeciesImage sp={sp} />
          </div>
          <div className="feature__body">
            <p className="eyebrow">
              {t.home.sotdEyebrow} <span className="eyebrow__sep" aria-hidden /> {dateLabel}
            </p>
            <h2 className="feature__title">
              <Link to={speciesPath(sp)}>{speciesName(sp, lang)}</Link>
            </h2>
            {sp.scientific_name && <p className="sci">{sp.scientific_name}</p>}
            <p className="feature__summary">{speciesSummary(sp, lang)}</p>
            <p className="feature__excerpt">{excerpt}</p>
            <div className="meta-row">
              <TypeLabel type={sp.type} />
              {sp.status && <StatusBadge status={sp.status} />}
              <span className="meta-row__item">
                <Clock size={14} aria-hidden /> {t.common.minRead(readingMinutes(sp, lang))}
              </span>
            </div>
            <Link to={speciesPath(sp)} className="btn btn--primary">
              {t.common.readArticle} <ArrowRight size={18} aria-hidden />
            </Link>
            <p className="feature__note">{t.home.sotdNote}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function ConservationWatch() {
  const t = useT();
  return (
    <section className="section section--band">
      <div className="container">
        <SectionHead
          eyebrow={t.home.watchEyebrow}
          title={t.home.watchTitle}
          lede={t.home.watchLede}
          link={{ to: "/encyclopedia?status=threatened&sort=status", label: t.common.viewAll }}
        />
        <div className="card-grid card-grid--four">
          {THREATENED.slice(0, 4).map((sp) => (
            <SpeciesCard key={sp.id} sp={sp} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Collections() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow={t.home.collectionsEyebrow} title={t.home.collectionsTitle} />
        <ul className="collections">
          {TAGS.slice(0, 8).map((tag) => (
            <li key={tag.slug}>
              <Link to={`/encyclopedia?tag=${tag.slug}`} className="collection">
                <SpeciesImage sp={tag.cover} className="collection__img" />
                <span className="collection__text">
                  <span className="collection__name">{tagLabel(tag.tag, lang)}</span>
                  <span className="collection__count">
                    {tag.count} {t.common.species}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RecentlyViewed() {
  const t = useT();
  const recent = useLibrary((s) => s.recent);
  const clearRecent = useLibrary((s) => s.clearRecent);
  const list = recent.map((id) => SPECIES_BY_ID.get(id)).filter((sp): sp is Species => !!sp).slice(0, 8);
  if (list.length === 0) return null;

  return (
    <section className="section section--tight">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">{t.home.recentEyebrow}</p>
            <h2 className="section-head__title">{t.home.recentTitle}</h2>
          </div>
          <button type="button" className="text-link" onClick={clearRecent}>
            {t.home.clearRecent}
          </button>
        </div>
        <div className="scroller">
          {list.map((sp) => (
            <SpeciesCard key={sp.id} sp={sp} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutTeaser() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  return (
    <section className="section">
      <div className="container split">
        <div className="split__main">
          <p className="eyebrow">{t.home.aboutEyebrow}</p>
          <h2 className="section-head__title">{t.home.aboutTitle}</h2>
          <p className="split__text">{t.home.aboutBody}</p>
          <div className="person">
            <span className="person__avatar" aria-hidden>
              {FOUNDER.initial}
            </span>
            <span>
              <strong className="person__name">{FOUNDER.name[lang]}</strong>
              <span className="person__role">{t.about.founderEyebrow}</span>
            </span>
          </div>
          <Link to="/about" className="text-link">
            {t.home.aboutLink} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <aside className="visit-card">
          <h2 className="visit-card__title">{t.home.visitTitle}</h2>
          <p>{t.home.visitBody}</p>
          <ul className="visit-card__list">
            <li>
              <Clock size={18} aria-hidden />
              <span>
                {t.visit.hoursValue}
                <small>{t.visit.hoursNote}</small>
              </span>
            </li>
            <li>
              <Phone size={18} aria-hidden />
              <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneDisplay}</a>
            </li>
            <li>
              <MapPin size={18} aria-hidden />
              <span>{CONTACT.address[lang]}</span>
            </li>
          </ul>
          <Link to="/visit" className="btn btn--light">
            {t.home.ctaVisit} <ArrowRight size={18} aria-hidden />
          </Link>
        </aside>
      </div>
    </section>
  );
}
