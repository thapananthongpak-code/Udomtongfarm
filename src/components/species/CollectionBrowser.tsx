import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import {
  isSortMode,
  isSpeciesType,
  isStatus,
  isThreatened,
  listTags,
  searchSpecies,
  sortSpecies,
  tagLabel,
  type SortMode,
} from "@/lib/species/helpers";
import { STATUS_CODES, type SpeciesCardData, type SpeciesType, type Status } from "@/lib/species/types";
import SpeciesCard from "./SpeciesCard";

type Filters = {
  q: string;
  type: SpeciesType | "all";
  status: Status | "threatened" | "any";
  tag: string;
  sort: SortMode;
};

const DEFAULT_FILTERS: Filters = { q: "", type: "all", status: "any", tag: "", sort: "az" };

function readFilters(params: URLSearchParams): Filters {
  const type = params.get("type");
  const status = params.get("status");
  const sort = params.get("sort");
  return {
    q: params.get("q") ?? "",
    type: isSpeciesType(type) ? type : "all",
    status: isStatus(status) || status === "threatened" ? status : "any",
    tag: params.get("group") ?? "",
    sort: isSortMode(sort) ? sort : "az",
  };
}

function toParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.status !== "any") params.set("status", filters.status);
  if (filters.tag) params.set("group", filters.tag);
  if (filters.sort !== "az") params.set("sort", filters.sort);
  return params;
}

/** The searchable grid of species. Filters are kept in the address, so a filtered view can be shared as a link. */
export default function CollectionBrowser({ species }: { species: SpeciesCardData[] }) {
  const lang = useLang();
  const t = useT();
  const labels = t.collection;
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const tags = useMemo(() => listTags(species), [species]);

  const visible = useMemo(() => {
    let list = species;
    if (filters.type !== "all") list = list.filter((sp) => sp.type === filters.type);
    if (filters.status === "threatened") list = list.filter((sp) => isThreatened(sp.status));
    else if (filters.status !== "any") list = list.filter((sp) => sp.status === filters.status);
    if (filters.tag) list = list.filter((sp) => sp.tags.includes(filters.tag));
    // A search keeps its best-match order unless a sort other than the default is chosen.
    if (filters.q.trim() && filters.sort === "az") return searchSpecies(sortSpecies(list, "az", lang), filters.q);
    return sortSpecies(searchSpecies(list, filters.q), filters.sort, lang);
  }, [species, filters, lang]);

  const update = (next: Filters) => setSearchParams(toParams(next), { replace: true, preventScrollReset: true });
  const set = (patch: Partial<Filters>) => update({ ...filters, ...patch });
  const isFiltered = toParams(filters).toString() !== "";

  const departments: { value: Filters["type"]; label: string }[] = [
    { value: "all", label: t.common.all },
    { value: "animal", label: t.common.animals },
    { value: "plant", label: t.common.plants },
  ];

  return (
    <section className="shell">
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-x-6 gap-y-5 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_auto_1fr_1fr_1fr]"
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="collection-search" className="field-label">
            {labels.search}
          </label>
          <input
            id="collection-search"
            type="search"
            className="input"
            placeholder={labels.searchPlaceholder}
            value={filters.q}
            onChange={(event) => set({ q: event.target.value })}
          />
        </div>

        <fieldset className="sm:col-span-2 lg:col-span-1">
          <legend className="field-label">{labels.department}</legend>
          <div className="flex">
            {departments.map((department) => {
              const active = filters.type === department.value;
              return (
                <button
                  key={department.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set({ type: department.value })}
                  className={`-ml-px min-h-11 flex-1 border px-4 text-[0.9375rem] first:ml-0 lg:flex-none ${
                    active ? "relative border-ink bg-ink text-paper" : "border-line-strong bg-surface text-muted hover:text-ink"
                  }`}
                >
                  {department.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="collection-status" className="field-label">
            {labels.status}
          </label>
          <select
            id="collection-status"
            className="input"
            value={filters.status}
            onChange={(event) => set({ status: event.target.value as Filters["status"] })}
          >
            <option value="any">{labels.statusAny}</option>
            <option value="threatened">{labels.statusThreatened}</option>
            {STATUS_CODES.map((code) => (
              <option key={code} value={code}>
                {code} · {t.status[code]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="collection-group" className="field-label">
            {labels.group}
          </label>
          <select id="collection-group" className="input" value={filters.tag} onChange={(event) => set({ tag: event.target.value })}>
            <option value="">{labels.groupAny}</option>
            {tags.map(({ tag, count }) => (
              <option key={tag} value={tag}>
                {tagLabel(tag, lang)} ({count})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="collection-sort" className="field-label">
            {labels.sort}
          </label>
          <select
            id="collection-sort"
            className="input"
            value={filters.sort}
            onChange={(event) => set({ sort: event.target.value as SortMode })}
          >
            <option value="az">{labels.sortAZ}</option>
            <option value="za">{labels.sortZA}</option>
            <option value="status">{labels.sortStatus}</option>
          </select>
        </div>
      </form>

      <div className="flex min-h-14 items-center justify-between gap-4 text-[0.875rem] text-muted">
        <p aria-live="polite">{format(labels.results, { shown: visible.length, total: species.length })}</p>
        {isFiltered && (
          <button type="button" className="link" onClick={() => update(DEFAULT_FILTERS)}>
            {labels.clear}
          </button>
        )}
      </div>

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
