import { useId, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeftRight, ArrowRight, Search, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { SpeciesImage, StatusScale, TypeLabel } from "../components/SpeciesBits";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../lib/i18n";
import {
  ALL_SPECIES,
  SPECIES_BY_ID,
  readingMinutes,
  searchSpecies,
  sortSpecies,
  speciesName,
  speciesPath,
  speciesSummary,
  tagLabel,
} from "../lib/species";
import { usePrefs } from "../store/prefs";
import type { Species } from "../types/species";

const SUGGESTED_PAIRS: [string, string][] = [
  ["black-swan", "mute-swan"],
  ["teak", "siamese-rosewood"],
  ["scarlet-macaw", "amazon-parrot"],
  ["golden-pheasant", "white-eared-pheasant"],
];

export default function Compare() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const [params, setParams] = useSearchParams();
  useDocumentMeta({ title: t.nav.compare, description: t.meta.compareDescription });

  const a = SPECIES_BY_ID.get(params.get("a") ?? "");
  const b = SPECIES_BY_ID.get(params.get("b") ?? "");

  function set(key: "a" | "b", sp: Species | undefined) {
    const next = new URLSearchParams(params);
    if (sp) next.set(key, sp.id);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  }

  function swap() {
    const next = new URLSearchParams();
    if (b) next.set("a", b.id);
    if (a) next.set("b", a.id);
    setParams(next, { replace: true, preventScrollReset: true });
  }

  return (
    <>
      <PageHeader eyebrow={t.compare.eyebrow} title={t.compare.title} lede={t.compare.lede} />
      <div className="container">
        <div className="compare-pickers">
          <SpeciesPicker label={t.compare.pickA} value={a} exclude={b} onChange={(sp) => set("a", sp)} />
          <button type="button" className="icon-btn icon-btn--outline compare-pickers__swap" onClick={swap} disabled={!a && !b} aria-label={t.compare.swap} title={t.compare.swap}>
            <ArrowLeftRight size={18} aria-hidden />
          </button>
          <SpeciesPicker label={t.compare.pickB} value={b} exclude={a} onChange={(sp) => set("b", sp)} />
        </div>

        {a && b ? (
          <CompareTable a={a} b={b} />
        ) : (
          <div className="empty-state empty-state--left">
            <p>{t.compare.empty}</p>
            <p className="chips__label">{t.compare.suggestions}</p>
            <ul className="suggestions">
              {SUGGESTED_PAIRS.map(([x, y]) => {
                const sx = SPECIES_BY_ID.get(x);
                const sy = SPECIES_BY_ID.get(y);
                if (!sx || !sy) return null;
                return (
                  <li key={`${x}-${y}`}>
                    <Link to={`/compare?a=${x}&b=${y}`} className="chip chip--link" replace preventScrollReset>
                      {speciesName(sx, lang)} <span aria-hidden>/</span> {speciesName(sy, lang)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

function SpeciesPicker({
  label,
  value,
  exclude,
  onChange,
}: {
  label: string;
  value?: Species;
  exclude?: Species;
  onChange: (sp: Species | undefined) => void;
}) {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const options = useMemo(() => {
    const pool = ALL_SPECIES.filter((sp) => sp.id !== exclude?.id);
    return (query.trim() ? searchSpecies(pool, query) : sortSpecies(pool, "az", lang)).slice(0, 8);
  }, [query, exclude, lang]);
  const activeIndex = Math.min(active, Math.max(0, options.length - 1));

  function choose(sp: Species) {
    onChange(sp);
    setQuery("");
    setOpen(false);
  }

  if (value) {
    return (
      <div className="picker">
        <span className="picker__label">{label}</span>
        <div className="picker__chosen">
          <span className="picker__thumb">
            <SpeciesImage sp={value} />
          </span>
          <span className="picker__text">
            <strong>{speciesName(value, lang)}</strong>
            {value.scientific_name && <em>{value.scientific_name}</em>}
          </span>
          <button type="button" className="icon-btn" onClick={() => onChange(undefined)} aria-label={`${t.compare.clear}: ${speciesName(value, lang)}`}>
            <X size={18} aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="picker">
      <label className="picker__label" htmlFor={`${id}-input`}>
        {label}
      </label>
      <div className="search-field search-field--picker">
        <Search size={18} aria-hidden className="search-field__icon" />
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && options[activeIndex] ? `${id}-opt-${activeIndex}` : undefined}
          value={query}
          placeholder={t.compare.placeholder}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((activeIndex + 1) % Math.max(1, options.length));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((activeIndex - 1 + options.length) % Math.max(1, options.length));
            } else if (e.key === "Enter" && open && options[activeIndex]) {
              e.preventDefault();
              choose(options[activeIndex]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
      </div>
      {open && (
        <ul className="picker__list" id={`${id}-list`} role="listbox" aria-label={label}>
          {options.length === 0 && <li className="picker__empty">{t.compare.noMatches}</li>}
          {options.map((sp, i) => (
            <li
              key={sp.id}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={`picker__option${i === activeIndex ? " is-active" : ""}`}
              // Choose on mousedown so the input's blur does not close the list first.
              onMouseDown={(e) => {
                e.preventDefault();
                choose(sp);
              }}
              onMouseMove={() => i !== activeIndex && setActive(i)}
            >
              <span className="picker__thumb">
                <SpeciesImage sp={sp} />
              </span>
              <span className="picker__text">
                <strong>{speciesName(sp, lang)}</strong>
                {sp.scientific_name && <em>{sp.scientific_name}</em>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CompareTable({ a, b }: { a: Species; b: Species }) {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const shared = (a.tags ?? []).filter((tag) => b.tags?.includes(tag));

  const rows: { label: string; render: (sp: Species) => React.ReactNode }[] = [
    { label: t.common.scientificName, render: (sp) => (sp.scientific_name ? <em className="sci">{sp.scientific_name}</em> : "-") },
    { label: t.common.category, render: (sp) => <TypeLabel type={sp.type} /> },
    { label: t.common.status, render: (sp) => <StatusScale status={sp.status} /> },
    {
      label: t.common.tags,
      render: (sp) => (
        <span className="tag-list">
          {(sp.tags ?? []).map((tag) => (
            <span key={tag} className={`chip${shared.includes(tag) ? " is-active" : ""}`}>
              {tagLabel(tag, lang)}
            </span>
          ))}
        </span>
      ),
    },
    { label: t.compare.summary, render: (sp) => speciesSummary(sp, lang) },
    { label: t.article.readingTime, render: (sp) => t.common.minRead(readingMinutes(sp, lang)) },
  ];

  return (
    <div className="compare">
      <div className="compare__heads">
        {[a, b].map((sp) => (
          <Link key={sp.id} to={speciesPath(sp)} className="compare__head">
            <span className="compare__img">
              <SpeciesImage sp={sp} />
            </span>
            <span className="compare__name">{speciesName(sp, lang)}</span>
            <span className="text-link">
              {t.common.readArticle} <ArrowRight size={15} aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <dl className="compare__rows">
        {rows.map((row) => (
          <div key={row.label} className="compare__row">
            <dt>{row.label}</dt>
            <dd>{row.render(a)}</dd>
            <dd>{row.render(b)}</dd>
          </div>
        ))}
        <div className="compare__row compare__row--full">
          <dt>{t.compare.sharedTags}</dt>
          <dd>{shared.length ? shared.map((tag) => tagLabel(tag, lang)).join(", ") : t.compare.none}</dd>
        </div>
      </dl>
    </div>
  );
}
