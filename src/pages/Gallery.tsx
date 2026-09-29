import { useId, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { SpeciesImage, StatusBadge, TypeLabel } from "../components/SpeciesBits";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../lib/i18n";
import { ALL_SPECIES, COUNTS, isSpeciesType, sortSpecies, speciesName, speciesPath, speciesSummary } from "../lib/species";
import { usePrefs } from "../store/prefs";

export default function Gallery() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const [params, setParams] = useSearchParams();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  useDocumentMeta({ title: t.nav.gallery, description: t.meta.galleryDescription });

  const typeParam = params.get("type");
  const type = isSpeciesType(typeParam) ? typeParam : "all";
  const items = useMemo(
    () => sortSpecies(type === "all" ? ALL_SPECIES : ALL_SPECIES.filter((sp) => sp.type === type), "az", lang),
    [type, lang],
  );

  const options = [
    { value: "all", label: t.common.all, count: COUNTS.all },
    { value: "animal", label: t.common.animals, count: COUNTS.animal },
    { value: "plant", label: t.common.plants, count: COUNTS.plant },
  ] as const;

  return (
    <>
      <PageHeader eyebrow={t.gallery.eyebrow} title={t.gallery.title} lede={t.gallery.lede} />
      <div className="container">
        <div className="segmented segmented--standalone" role="radiogroup" aria-label={t.encyclopedia.type}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={type === opt.value}
              className={`segmented__option${type === opt.value ? " is-active" : ""}`}
              onClick={() => setParams(opt.value === "all" ? {} : { type: opt.value }, { replace: true, preventScrollReset: true })}
            >
              {opt.label} <span className="segmented__count">{opt.count}</span>
            </button>
          ))}
        </div>

        <ul className="masonry">
          {items.map((sp, index) => (
            <li key={sp.id} className="masonry__item">
              <button type="button" className="tile" onClick={() => setOpenIndex(index)}>
                <SpeciesImage sp={sp} className="tile__img" />
                <span className="tile__caption">
                  <span className="tile__name">{speciesName(sp, lang)}</span>
                  {sp.scientific_name && <span className="tile__sci">{sp.scientific_name}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox
        items={items}
        index={openIndex}
        onChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}

type LightboxProps = {
  items: typeof ALL_SPECIES;
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
};

function Lightbox({ items, index, onChange, onClose }: LightboxProps) {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const titleId = useId();
  const open = index !== null && items[index] !== undefined;
  const sp = open ? items[index] : null;
  const step = (delta: number) => index !== null && onChange((index + delta + items.length) % items.length);

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="modal--lightbox">
      {sp && index !== null && (
        <div
          className="lightbox"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <div className="lightbox__top">
            <span className="lightbox__counter">{t.gallery.counter(index + 1, items.length)}</span>
            <button type="button" className="icon-btn icon-btn--on-dark" onClick={onClose} aria-label={t.gallery.close} autoFocus>
              <X size={22} aria-hidden />
            </button>
          </div>

          <div className="lightbox__stage">
            <button type="button" className="icon-btn icon-btn--on-dark lightbox__nav" onClick={() => step(-1)} aria-label={t.gallery.previous}>
              <ChevronLeft size={26} aria-hidden />
            </button>
            <figure className="lightbox__figure">
              <SpeciesImage key={sp.id} sp={sp} eager className="lightbox__img" />
            </figure>
            <button type="button" className="icon-btn icon-btn--on-dark lightbox__nav" onClick={() => step(1)} aria-label={t.gallery.next}>
              <ChevronRight size={26} aria-hidden />
            </button>
          </div>

          <div className="lightbox__caption">
            <div>
              <div className="lightbox__meta">
                <TypeLabel type={sp.type} />
                {sp.status && <StatusBadge status={sp.status} compact />}
              </div>
              <h2 id={titleId} className="lightbox__title">
                {speciesName(sp, lang)}
              </h2>
              {sp.scientific_name && <p className="sci">{sp.scientific_name}</p>}
              <p className="lightbox__summary">{speciesSummary(sp, lang)}</p>
            </div>
            <Link to={speciesPath(sp)} className="btn btn--light" onClick={onClose}>
              {t.common.readArticle} <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
