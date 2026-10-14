import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { isSortMode, listTags, searchSpecies, sortSpecies, tagLabel, type SortMode } from "@/lib/species/helpers";
import type { SpeciesCardData, SpeciesType } from "@/lib/species/types";
import SpeciesCard from "./SpeciesCard";

type Filters = { q: string; tag: string; sort: SortMode };

const DEFAULT_FILTERS: Filters = { q: "", tag: "", sort: "az" };

function readFilters(params: URLSearchParams): Filters {
  const sort = params.get("sort");
  return {
    q: params.get("q") ?? "",
    tag: params.get("group") ?? "",
    sort: isSortMode(sort) ? sort : "az",
  };
}

/** The address keeps the chosen gallery section (`tab`) next to the filters. */
function toParams(filters: Filters, tab: string | null): URLSearchParams {
  const params = new URLSearchParams();
  if (tab) params.set("tab", tab);
  if (filters.q) params.set("q", filters.q);
  if (filters.tag) params.set("group", filters.tag);
  if (filters.sort !== "az") params.set("sort", filters.sort);
  return params;
}

/** The searchable grid of one department. Filters are kept in the address, so a filtered view can be shared as a link. */
export default function SpeciesBrowser({ species, type }: { species: SpeciesCardData[]; type: SpeciesType }) {
  const lang = useLang();
  const labels = useT().gallery;
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const tab = searchParams.get("tab");
  const inDepartment = useMemo(() => species.filter((sp) => sp.type === type), [species, type]);
  const tags = useMemo(() => listTags(inDepartment), [inDepartment]);

  const visible = useMemo(() => {
    let list = inDepartment;
    if (filters.tag) list = list.filter((sp) => sp.tags.includes(filters.tag));
    // A search keeps its best-match order unless a sort other than the default is chosen.
    if (filters.q.trim() && filters.sort === "az") return searchSpecies(sortSpecies(list, "az", lang), filters.q);
    return sortSpecies(searchSpecies(list, filters.q), filters.sort, lang);
  }, [inDepartment, filters, lang]);

  const update = (next: Filters) => setSearchParams(toParams(next, tab), { replace: true, preventScrollReset: true });
  const set = (patch: Partial<Filters>) => update({ ...filters, ...patch });
  const isFiltered = filters.q !== "" || filters.tag !== "" || filters.sort !== "az";

  return (
    <section className="shell">
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-x-6 gap-y-5 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]"
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="gallery-search" className="field-label">
            {labels.search}
          </label>
          <input
            id="gallery-search"
            type="search"
            className="input"
            placeholder={labels.searchPlaceholder}
            value={filters.q}
            onChange={(event) => set({ q: event.target.value })}
          />
        </div>

        <div>
          <label htmlFor="gallery-group" className="field-label">
            {labels.group}
          </label>
          <select id="gallery-group" className="input" value={filters.tag} onChange={(event) => set({ tag: event.target.value })}>
            <option value="">{labels.groupAny}</option>
            {tags.map(({ tag, count }) => (
              <option key={tag} value={tag}>
                {tagLabel(tag, lang)} ({count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="gallery-sort" className="field-label">
            {labels.sort}
          </label>
          <select
            id="gallery-sort"
            className="input"
            value={filters.sort}
            onChange={(event) => set({ sort: event.target.value as SortMode })}
          >
            <option value="az">{labels.sortAZ}</option>
            <option value="za">{labels.sortZA}</option>
          </select>
        </div>
      </form>

      <div className="flex min-h-14 items-center justify-between gap-4 text-[0.875rem] text-muted">
        <p aria-live="polite">{format(labels.results, { shown: visible.length, total: inDepartment.length })}</p>
        {isFiltered && (
          <button type="button" className="link" onClick={() => update(DEFAULT_FILTERS)}>
            {labels.clear}
          </button>
        )}
      </div>

      <h2 className="sr-only">{labels.listHeading}</h2>
      {visible.length > 0 ? (
        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 pt-4 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {visible.map((sp, index) => (
            <li key={sp.id}>
              <SpeciesCard species={sp} priority={index < 4} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-t border-line py-24 text-center">
          <h2 className="display text-2xl">{labels.emptyTitle}</h2>
          <p className="mt-3 text-muted">{labels.emptyBody}</p>
        </div>
      )}
    </section>
  );
}
