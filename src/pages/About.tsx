import { Link } from "react-router-dom";
import { ArrowRight, Bird, BookOpen, HandHeart, Sprout, TreeDeciduous, Users } from "lucide-react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../lib/i18n";
import { FOUNDER } from "../lib/site";
import { COUNTS } from "../lib/species";
import { usePrefs } from "../store/prefs";

const VALUE_ICONS = [Sprout, BookOpen, HandHeart];
const TEAM_ICONS = [Bird, TreeDeciduous, Users];

export default function About() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  useDocumentMeta({ title: t.nav.about, description: t.meta.aboutDescription });

  return (
    <>
      <section className="about-hero">
        <div className="container about-hero__inner">
          <div>
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h1 className="page-header__title">{t.about.title}</h1>
            <p className="page-header__lede">{t.about.lede}</p>
          </div>
          <figure className="about-hero__photo">
            <img
              src="/images/farm-landscape.jpg"
              alt={lang === "th" ? "แปลงเกษตรและป่าเขารอบฟาร์ม" : "Gardens and forested hills around the farm"}
              width={640}
              height={640}
            />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container story">
          <div>
            <p className="eyebrow">{t.about.storyEyebrow}</p>
            <h2 className="section-head__title">{t.about.storyTitle}</h2>
          </div>
          <div className="prose prose--plain">
            {t.about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <p className="eyebrow">{t.about.valuesEyebrow}</p>
          <h2 className="section-head__title">{t.about.valuesTitle}</h2>
          <ul className="value-grid">
            {t.about.values.map((value, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <li key={value.title} className="value">
                  <span className="value__icon">
                    <Icon size={24} aria-hidden />
                  </span>
                  <h3 className="value__title">{value.title}</h3>
                  <p>{value.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-head__title">{t.about.numbersTitle}</h2>
          <ul className="stats stats--plain">
            {t.about.numbers.map((n) => (
              <li key={n.label}>
                <div className="stats__item">
                  <span className="stats__value">{n.value}</span>
                  <span className="stats__label">{n.label}</span>
                </div>
              </li>
            ))}
            <li>
              <Link to="/encyclopedia" className="stats__item">
                <span className="stats__value">{COUNTS.all}</span>
                <span className="stats__label">{t.about.documented}</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <article className="founder">
            <span className="founder__avatar" aria-hidden>
              {FOUNDER.initial}
            </span>
            <div className="founder__body">
              <p className="eyebrow">{t.about.founderEyebrow}</p>
              <h2 className="founder__name">{FOUNDER.name[lang]}</h2>
              <p className="founder__title">{FOUNDER.title[lang]}</p>
              <p className="founder__org">{FOUNDER.org[lang]}</p>
              <p className="founder__bio">{FOUNDER.bio[lang]}</p>
              <ul className="tag-list">
                {FOUNDER.tags[lang].map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.about.teamEyebrow}</p>
          <h2 className="section-head__title">{t.about.teamTitle}</h2>
          <ul className="value-grid">
            {t.about.team.map((member, i) => {
              const Icon = TEAM_ICONS[i];
              return (
                <li key={member.name} className="value value--row">
                  <span className="value__icon">
                    <Icon size={24} aria-hidden />
                  </span>
                  <div>
                    <h3 className="value__title">{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2 className="cta-band__title">{t.about.ctaTitle}</h2>
              <p>{t.about.ctaBody}</p>
            </div>
            <div className="cta-band__actions">
              <Link to="/visit" className="btn btn--light">
                {t.home.ctaVisit} <ArrowRight size={18} aria-hidden />
              </Link>
              <Link to="/encyclopedia" className="btn btn--outline-light">
                {t.home.ctaBrowse}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
