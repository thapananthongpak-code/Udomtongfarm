import { Link, useSearchParams } from "react-router-dom";
import ActivityGrid from "@/components/gallery/ActivityGrid";
import RateList from "@/components/gallery/RateList";
import PageIntro from "@/components/PageIntro";
import PageLoading from "@/components/PageLoading";
import SpeciesBrowser from "@/components/species/SpeciesBrowser";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { servicesOfKind } from "@/lib/services";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";

const TABS = ["animals", "plants", "activities", "rates"] as const;
type Tab = (typeof TABS)[number];

const isTab = (value: string | null): value is Tab => TABS.includes(value as Tab);

/** Animals, plants, activities and rates, one section at a time. The section is kept in the address (?tab=). */
export default function Gallery() {
  const lang = useLang();
  const t = useT();
  const labels = t.gallery;
  const { status, species, services } = useData();
  const [searchParams] = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: Tab = isTab(requested) ? requested : "animals";
  usePageMeta(labels.title, t.meta.gallery);

  const activities = servicesOfKind(services, "activity");
  const rates = servicesOfKind(services, "rate");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "animals", label: labels.tabAnimals, count: species.filter((sp) => sp.type === "animal").length },
    { id: "plants", label: labels.tabPlants, count: species.filter((sp) => sp.type === "plant").length },
    { id: "activities", label: labels.tabActivities, count: activities.length },
    { id: "rates", label: labels.tabRates, count: rates.length },
  ];

  return (
    <>
      <PageIntro eyebrow={labels.eyebrow} title={labels.title} lede={labels.lede} />

      <nav aria-label={labels.tabs} className="shell">
        <ul className="-mb-px flex gap-x-1 overflow-x-auto border-b border-line">
          {tabs.map((item) => {
            const active = item.id === tab;
            return (
              <li key={item.id} className="shrink-0">
                <Link
                  to={`${localePath(lang, "/gallery")}?tab=${item.id}`}
                  preventScrollReset
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center gap-2 border-b-2 px-4 text-[0.9375rem] transition-colors ${
                    active ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  {status === "ready" && <span className="text-[0.8125rem] text-faint">{item.count}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {status === "loading" ? (
        <PageLoading />
      ) : (
        <div className="pb-8 pt-8">
          {tab === "animals" && <SpeciesBrowser key="animal" species={species} type="animal" />}
          {tab === "plants" && <SpeciesBrowser key="plant" species={species} type="plant" />}
          {tab === "activities" && (
            <div className="shell">
              <p className="mb-8 max-w-xl text-muted">{labels.activitiesLede}</p>
              <ActivityGrid activities={activities} />
            </div>
          )}
          {tab === "rates" && (
            <div className="shell">
              <p className="mb-8 max-w-xl text-muted">{labels.ratesLede}</p>
              <RateList rates={rates} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
