import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search, SearchX, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SpeciesCard from "../components/SpeciesCard";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../lib/i18n";
import {
  ALL_SPECIES,
  COUNTS,
  STATUS_ORDER,
  TAGS,
  findTag,
  isSpeciesType,
  isThreatened,
  searchSpecies,
  sortSpecies,
  tagLabel,
  type SortMode,
} from "../lib/species";
import { usePrefs } from "../store/prefs";
import type { ConservationStatus } from "../types/species";

const PAGE_SIZE = 12;
const SORT_MODES: SortMode[] = ["az", "za", "status", "length"];

type Params = Partial<Record<"q" | "type" | "tag" | "status" | "sort" | "view" | "page", string | null>>;

export default function Encyclopedia() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const [params, setParams] = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);
  useDocumentMeta({ title: t.nav.encyclopedia, description: t.meta.encyclopediaDescription });

  // ── Read state from the URL ──
  const q = params.get("q") ?? "";
  const typeParam = params.get("type");
  const type = isSpeciesType(typeParam) ? typeParam : "all";
  const tag = findTag(params.get("tag"));
  const statusParam = params.get("status") ?? "";
  const status: ConservationStatus | "threatened" | "" =
    statusParam === "threatened" || STATUS_ORDER.includes(statusParam as ConservationStatus)
      ? (statusParam as ConservationStatus | "threatened")
      : "";
  const sortParam = params.get("sort") as SortMode | null;
  const sort: SortMode | "relevance" = sortParam && SORT_MODES.includes(sortParam) ? sortParam : q ? "relevance" : "az";
  const view = params.get("view") === "list" ? "list" : "grid";

  function update(changes: Params, { resetPage = true } = {}) {
    // Read the live URL: this can run from a timer created during an earlier render.
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (resetPage) next.delete("page");
    setParams(next, { replace: true, preventScrollReset: true });
  }

  // ── Search box: typed text updates results instantly, the URL follows after a pause ──
  const [input, setInput] = useState(q);
  const [pushed, setPushed] = useState(q);
  const [seenQ, setSeenQ] = useState(q);
  if (q !== seenQ) {
    // The URL changed. If we did not cause it (back button, link), show the new value.
    setSeenQ(q);
    if (q !== pushed) {
      setInput(q);
      setPushed(q);
    }
  }
  useEffect(() => {
    const value = input.trim();
    if (value === q) return;
    const timer = window.setTimeout(() => {
      setPushed(value);
      update({ q: value || null });
    }, 300);
    return () => window.clearTimeout(timer);
    // `update` reads the latest params; re-running only on input changes is intended.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // ── Filtering ──
  const results = useMemo(() => {
    let list = ALL_SPECIES;
    if (type !== "all") list = list.filter((sp) => sp.type === type);
    if (tag) list = list.filter((sp) => sp.tags?.includes(tag.tag));
    if (status === "threatened") list = list.filter((sp) => isThreatened(sp.status));
    else if (status) list = list.filter((sp) => sp.status === status);
    const searched = searchSpecies(list, input);
    return sort === "relevance" && input.trim() ? searched : sortSpecies(searched, sort === "relevance" ? "az" : sort, lang);
  }, [type, tag, status, input, sort, lang]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1));
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = !!(input.trim() || type !== "all" || tag || status);

  function goToPage(next: number) {
    update({ page: next > 1 ? String(next) : null }, { resetPage: false });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearAll() {
    setInput("");
    setPushed("");
    setParams(view === "list" ? { view: "list" } : {}, { replace: true, preventScrollReset: true });
  }

  const typeOptions = [
    { value: "all", label: t.common.all, count: COUNTS.all },
    { value: "animal", label: t.common.animals, count: COUNTS.animal },
    { value: "plant", label: t.common.plants, count: COUNTS.plant },
  ] as const;

  return (
    <>
      <PageHeader eyebrow={t.encyclopedia.eyebrow} title={t.encyclopedia.title} lede={t.encyclopedia.lede} />

      <div className="container">
        <div className="toolbar">
          <div className="search-field" role="search">
            <Search size={19} aria-hidden className="search-field__icon" />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.encyclopedia.searchPlaceholder}
              aria-label={t.encyclopedia.searchPlaceholder}
              autoComplete="off"
            />
            {input && (
              <button type="button" className="search-field__clear" onClick={() => setInput("")} aria-label={t.encyclopedia.clearSearch}>
                <X size={16} aria-hidden />
              </button>
            )}
          </div>

          <div className="toolbar__row">
            <div className="segmented" role="radiogroup" aria-label={t.encyclopedia.type}>
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={type === opt.value}
                  className={`segmented__option${type === opt.value ? " is-active" : ""}`}
                  onClick={() => update({ type: opt.value === "all" ? null : opt.value })}
                >
                  {opt.label} <span className="segmented__count">{opt.count}</span>
                </button>
              ))}
            </div>

            <div className="toolbar__controls">
              <label className="select">
                <span className="sr-only">{t.encyclopedia.statusFilter}</span>
                <select value={status} onChange={(e) => update({ status: e.target.value || null })}>
                  <option value="">{t.encyclopedia.statusAny}</option>
                  <option value="threatened">{t.encyclopedia.statusThreatened}</option>
                  {STATUS_ORDER.map((code) => (
                    <option key={code} value={code}>
                      {code}: {t.status[code]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="select">
                <span className="sr-only">{t.encyclopedia.sort}</span>
                <select value={sort} onChange={(e) => update({ sort: e.target.value === "relevance" ? null : e.target.value })}>
                  {input.trim() && <option value="relevance">{t.encyclopedia.sortRelevance}</option>}
                  <option value="az">{t.encyclopedia.sortAZ}</option>
                  <option value="za">{t.encyclopedia.sortZA}</option>
                  <option value="status">{t.encyclopedia.sortStatus}</option>
                  <option value="length">{t.encyclopedia.sortLength}</option>
                </select>
              </label>
              <div className="view-toggle" role="group" aria-label={`${t.encyclopedia.viewGrid} / ${t.encyclopedia.viewList}`}>
                <button
                  type="button"
                  className={`icon-btn${view === "grid" ? " is-active" : ""}`}
                  aria-pressed={view === "grid"}
                  aria-label={t.encyclopedia.viewGrid}
                  title={t.encyclopedia.viewGrid}
                  onClick={() => update({ view: null }, { resetPage: false })}
                >
                  <LayoutGrid size={18} aria-hidden />
                </button>
                <button
                  type="button"
                  className={`icon-btn${view === "list" ? " is-active" : ""}`}
                  aria-pressed={view === "list"}
                  aria-label={t.encyclopedia.viewList}
                  title={t.encyclopedia.viewList}
                  onClick={() => update({ view: "list" }, { resetPage: false })}
                >
                  <List size={18} aria-hidden />
                </button>
              </div>
            </div>
          </div>

          <div className="chips" aria-label={t.encyclopedia.collections}>
            <span className="chips__label">{t.encyclopedia.collections}</span>
            {TAGS.map((info) => {
              const active = tag?.slug === info.slug;
              return (
                <button
                  key={info.slug}
                  type="button"
                  className={`chip${active ? " is-active" : ""}`}
                  aria-pressed={active}
                  onClick={() => update({ tag: active ? null : info.slug })}
                >
                  {tagLabel(info.tag, lang)}
                  <span className="chip__count">{info.count}</span>
                  {active && <X size={14} aria-hidden />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="results-bar" ref={resultsRef}>
          <p aria-live="polite">{t.encyclopedia.results(pageItems.length, results.length)}</p>
          {hasFilters && (
            <button type="button" className="text-link" onClick={clearAll}>
              {t.encyclopedia.clearFilters}
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <SearchX size={40} aria-hidden />
            <h2>{t.encyclopedia.emptyTitle}</h2>
            <p>{t.encyclopedia.emptyBody}</p>
            <button type="button" className="btn btn--secondary" onClick={clearAll}>
              {t.encyclopedia.clearFilters}
            </button>
          </div>
        ) : (
          <div className={view === "list" ? "card-list" : "card-grid"}>
            {pageItems.map((sp) => (
              <SpeciesCard key={sp.id} sp={sp} variant={view} headingLevel="h2" />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="pagination" aria-label="Pagination">
            <button type="button" className="btn btn--secondary btn--sm" disabled={page === 1} onClick={() => goToPage(page - 1)}>
              <ChevronLeft size={16} aria-hidden /> {t.encyclopedia.prev}
            </button>
            <ol className="pagination__pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <button
                    type="button"
                    className={`pagination__page${n === page ? " is-active" : ""}`}
                    aria-current={n === page ? "page" : undefined}
                    aria-label={t.encyclopedia.page(n)}
                    onClick={() => goToPage(n)}
                  >
                    {n}
                  </button>
                </li>
              ))}
            </ol>
            <button type="button" className="btn btn--secondary btn--sm" disabled={page === totalPages} onClick={() => goToPage(page + 1)}>
              {t.encyclopedia.next} <ChevronRight size={16} aria-hidden />
            </button>
          </nav>
        )}
      </div>
    </>
  );
}
