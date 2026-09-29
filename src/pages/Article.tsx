import { useEffect, useId, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  ExternalLink,
  GitCompare,
  Link2,
  Printer,
  QrCode,
  Share2,
  X,
} from "lucide-react";
import Modal from "../components/Modal";
import SpeciesCard from "../components/SpeciesCard";
import { FacebookIcon, LineIcon, XIcon } from "../components/Icons";
import { SaveButton, SpeciesImage, StatusBadge, StatusScale, TypeLabel } from "../components/SpeciesBits";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../lib/i18n";
import { SITE_URL } from "../lib/site";
import {
  SPECIES_BY_ID,
  neighbours,
  readingMinutes,
  relatedSpecies,
  speciesBody,
  speciesName,
  speciesPath,
  speciesSummary,
  tagLabel,
  tagSlug,
  toParagraphs,
} from "../lib/species";
import { useLibrary } from "../store/library";
import { usePrefs } from "../store/prefs";
import { useUI } from "../store/ui";
import type { Species } from "../types/species";

export default function Article() {
  const { type, id } = useParams();
  const sp = id ? SPECIES_BY_ID.get(id) : undefined;
  if (!sp) return <ArticleNotFound />;
  // Old or mistyped links (e.g. /species/plant/black-swan) go to the right address.
  if (sp.type !== type) return <Navigate to={speciesPath(sp)} replace />;
  return <ArticleView key={sp.id} sp={sp} />;
}

function ArticleView({ sp }: { sp: Species }) {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const recordView = useLibrary((s) => s.recordView);
  const articleRef = useRef<HTMLElement>(null);

  const name = speciesName(sp, lang);
  const summary = speciesSummary(sp, lang);
  const paragraphs = toParagraphs(speciesBody(sp, lang), lang);
  const minutes = readingMinutes(sp, lang);
  const { prev, next } = neighbours(sp, lang);
  const related = relatedSpecies(sp, 4);

  useDocumentMeta({ title: name, description: summary, image: sp.image, type: "article" });
  useEffect(() => recordView(sp.id), [sp.id, recordView]);

  return (
    <>
      <ReadingProgress target={articleRef} />
      <article ref={articleRef} className="article">
        <header className="article-hero">
          <div className="container article-hero__inner">
            <div className="article-hero__copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <ol>
                  <li>
                    <Link to="/">{t.article.breadcrumbHome}</Link>
                  </li>
                  <li>
                    <ChevronRight size={14} aria-hidden />
                    <Link to="/encyclopedia">{t.article.breadcrumbList}</Link>
                  </li>
                  <li>
                    <ChevronRight size={14} aria-hidden />
                    <Link to={`/encyclopedia?type=${sp.type}`}>{sp.type === "animal" ? t.common.animals : t.common.plants}</Link>
                  </li>
                </ol>
              </nav>

              <h1 className="article-hero__title">{name}</h1>
              {sp.scientific_name && <p className="sci sci--lg">{sp.scientific_name}</p>}
              <p className="article-hero__lede">{summary}</p>

              <div className="meta-row">
                <TypeLabel type={sp.type} />
                {sp.status && <StatusBadge status={sp.status} />}
                <span className="meta-row__item">
                  <Clock size={14} aria-hidden /> {t.common.minRead(minutes)}
                </span>
              </div>

              <ArticleActions sp={sp} name={name} />
            </div>

            <figure className="article-hero__figure">
              <SpeciesImage sp={sp} eager />
              <figcaption>
                {sp.scientific_name ? <em>{sp.scientific_name}</em> : name}. {t.article.photoCredit}
              </figcaption>
            </figure>
          </div>
        </header>

        <div className="container article-layout">
          <div className="prose">
            {paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}

            {sp.references.length > 0 && (
              <section className="sources" aria-labelledby="sources-title">
                <h2 id="sources-title">{t.article.sources}</h2>
                <ol>
                  {sp.references.map((ref) => (
                    <li key={ref.url}>
                      <a href={ref.url} target="_blank" rel="noopener noreferrer">
                        {ref.title} <ExternalLink size={14} aria-hidden />
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          <aside className="field-notes" aria-labelledby="field-notes-title">
            <h2 id="field-notes-title" className="field-notes__title">
              {t.article.fieldNotes}
            </h2>
            <dl>
              {sp.scientific_name && (
                <div>
                  <dt>{t.common.scientificName}</dt>
                  <dd className="sci">{sp.scientific_name}</dd>
                </div>
              )}
              <div>
                <dt>{t.common.category}</dt>
                <dd>
                  <TypeLabel type={sp.type} />
                </dd>
              </div>
              <div>
                <dt>{t.common.status}</dt>
                <dd>
                  <StatusScale status={sp.status} />
                </dd>
              </div>
              {sp.tags && sp.tags.length > 0 && (
                <div>
                  <dt>{t.common.tags}</dt>
                  <dd className="tag-list">
                    {sp.tags.map((tag) => (
                      <Link key={tag} to={`/encyclopedia?tag=${tagSlug(tag)}`} className="chip chip--link">
                        {tagLabel(tag, lang)}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt>{t.article.readingTime}</dt>
                <dd>{t.common.minRead(minutes)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </article>

      <nav className="container article-pager" aria-label={`${t.article.previous} / ${t.article.next}`}>
        <Link to={speciesPath(prev)} className="pager-card pager-card--prev" rel="prev">
          <span className="pager-card__dir">
            <ArrowLeft size={16} aria-hidden /> {t.article.previous}
          </span>
          <span className="pager-card__name">{speciesName(prev, lang)}</span>
        </Link>
        <Link to={speciesPath(next)} className="pager-card pager-card--next" rel="next">
          <span className="pager-card__dir">
            {t.article.next} <ArrowRight size={16} aria-hidden />
          </span>
          <span className="pager-card__name">{speciesName(next, lang)}</span>
        </Link>
      </nav>

      <section className="section section--tight related">
        <div className="container">
          <p className="eyebrow">{t.article.relatedEyebrow}</p>
          <h2 className="section-head__title">{t.article.relatedTitle}</h2>
          <div className="card-grid card-grid--four">
            {related.map((other) => (
              <SpeciesCard key={other.id} sp={other} />
            ))}
          </div>
        </div>
      </section>

      <StructuredData sp={sp} name={name} summary={summary} />
    </>
  );
}

// ── Actions ──────────────────────────────────────────────────

function ArticleActions({ sp, name }: { sp: Species; name: string }) {
  const t = useT();
  const stepTextSize = usePrefs((s) => s.stepTextSize);
  const textSize = usePrefs((s) => s.textSize);
  const showToast = useUI((s) => s.showToast);
  const [shareOpen, setShareOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const url = `${window.location.origin}${speciesPath(sp)}`;

  useEffect(() => {
    if (!shareOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setShareOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShareOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [shareOpen]);

  async function copyLink() {
    setShareOpen(false);
    try {
      await navigator.clipboard.writeText(url);
      showToast(t.article.linkCopied);
    } catch {
      showToast(t.article.copyFailed);
    }
  }

  async function nativeShare() {
    setShareOpen(false);
    try {
      await navigator.share({ title: name, url });
    } catch {
      /* the user closed the share sheet */
    }
  }

  function openWindow(shareUrl: string) {
    setShareOpen(false);
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=640,height=560");
  }

  const encoded = encodeURIComponent(url);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="article-actions">
      <SaveButton sp={sp} variant="button" />

      <div className="menu" ref={menuRef}>
        <button
          type="button"
          className="btn btn--secondary"
          aria-haspopup="menu"
          aria-expanded={shareOpen}
          aria-controls={menuId}
          onClick={() => setShareOpen((v) => !v)}
        >
          <Share2 size={18} aria-hidden /> {t.article.share}
        </button>
        {shareOpen && (
          <div className="menu__panel" id={menuId} role="menu">
            {canNativeShare && (
              <button type="button" role="menuitem" className="menu__item" onClick={nativeShare}>
                <Share2 size={17} aria-hidden /> {t.article.share}
              </button>
            )}
            <button type="button" role="menuitem" className="menu__item" onClick={copyLink}>
              <Link2 size={17} aria-hidden /> {t.article.copyLink}
            </button>
            <button
              type="button"
              role="menuitem"
              className="menu__item"
              onClick={() => openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`)}
            >
              <FacebookIcon size={17} /> {t.article.shareFacebook}
            </button>
            <button
              type="button"
              role="menuitem"
              className="menu__item"
              onClick={() => openWindow(`https://social-plugins.line.me/lineit/share?url=${encoded}`)}
            >
              <LineIcon size={17} /> {t.article.shareLine}
            </button>
            <button
              type="button"
              role="menuitem"
              className="menu__item"
              onClick={() => openWindow(`https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(name)}`)}
            >
              <XIcon size={16} /> {t.article.shareX}
            </button>
            <button
              type="button"
              role="menuitem"
              className="menu__item"
              onClick={() => {
                setShareOpen(false);
                setQrOpen(true);
              }}
            >
              <QrCode size={17} aria-hidden /> {t.article.qr}
            </button>
          </div>
        )}
      </div>

      <Link to={`/compare?a=${sp.id}`} className="icon-btn icon-btn--outline" aria-label={t.article.compare} title={t.article.compare}>
        <GitCompare size={18} aria-hidden />
      </Link>
      <button type="button" className="icon-btn icon-btn--outline" onClick={() => window.print()} aria-label={t.article.print} title={t.article.print}>
        <Printer size={18} aria-hidden />
      </button>
      <div className="text-size" role="group" aria-label={t.article.textSize}>
        <button
          type="button"
          onClick={() => stepTextSize(-1)}
          disabled={textSize === "small"}
          aria-label={t.article.textSmaller}
          title={t.article.textSmaller}
        >
          A<span aria-hidden>-</span>
        </button>
        <button
          type="button"
          onClick={() => stepTextSize(1)}
          disabled={textSize === "large"}
          aria-label={t.article.textLarger}
          title={t.article.textLarger}
        >
          A<span aria-hidden>+</span>
        </button>
      </div>

      <QRDialog open={qrOpen} onClose={() => setQrOpen(false)} url={url} />
    </div>
  );
}

function QRDialog({ open, onClose, url }: { open: boolean; onClose: () => void; url: string }) {
  const t = useT();
  const titleId = useId();
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=440x440&margin=12&color=1b2119&bgcolor=ffffff&data=${encodeURIComponent(url)}`;
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="modal--small">
      <div className="dialog-panel">
        <button type="button" className="icon-btn dialog-panel__close" onClick={onClose} aria-label={t.gallery.close}>
          <X size={20} aria-hidden />
        </button>
        <h2 id={titleId} className="dialog-panel__title">
          {t.article.qrTitle}
        </h2>
        <p className="dialog-panel__text">{t.article.qrBody}</p>
        <img className="qr-image" src={src} alt={t.article.qr} width={220} height={220} />
        <p className="qr-url">{url.replace(/^https?:\/\//, "")}</p>
      </div>
    </Modal>
  );
}

// ── Reading progress ─────────────────────────────────────────

function ReadingProgress({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = target.current;
      const bar = barRef.current;
      if (!el || !bar) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);
  return (
    <div className="reading-progress" aria-hidden>
      <div ref={barRef} className="reading-progress__bar" />
    </div>
  );
}

// ── Not found and structured data ────────────────────────────

function ArticleNotFound() {
  const t = useT();
  useDocumentMeta({ title: t.article.notFoundTitle, description: t.article.notFoundBody });
  return (
    <section className="container state-page">
      <p className="eyebrow">404</p>
      <h1 className="state-page__title">{t.article.notFoundTitle}</h1>
      <p className="state-page__text">{t.article.notFoundBody}</p>
      <div className="state-page__actions">
        <Link to="/encyclopedia" className="btn btn--primary">
          {t.notFound.browse}
        </Link>
        <Link to="/" className="btn btn--secondary">
          {t.notFound.home}
        </Link>
      </div>
    </section>
  );
}

function StructuredData({ sp, name, summary }: { sp: Species; name: string; summary: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: name,
    alternativeHeadline: sp.scientific_name,
    description: summary,
    image: `${SITE_URL}${sp.image}`,
    url: `${SITE_URL}${speciesPath(sp)}`,
    inLanguage: ["en", "th"],
    about: { "@type": "Taxon", name: sp.scientific_name ?? sp.name_en, alternateName: [sp.name_en, sp.name_th] },
    publisher: { "@type": "Organization", name: "Udomtong Farm", logo: `${SITE_URL}/icons/icon-512.png` },
  };
  // Escape "<" so the JSON cannot close the script element.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
