import { Link } from "react-router-dom";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { useAdminSpecies } from "@/lib/useAdminSpecies";
import { useVisitStats } from "@/lib/useVisitStats";

export default function Dashboard() {
  const lang = useLang();
  const t = useT().admin;
  const species = useAdminSpecies();
  const published = species?.filter((sp) => sp.published).length ?? 0;
  const visits = useVisitStats();
  const stats_ = visits === null || visits === "unavailable" ? null : visits;
  const biggest = Math.max(1, ...(stats_?.days.map((day) => day.visitors) ?? [0]));
  const dayFormat = new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

  const stats = [
    { label: t.total, value: species ? species.length : "–" },
    { label: t.published, value: species ? published : "–" },
    { label: t.drafts, value: species ? species.length - published : "–" },
  ];

  const areas = [
    { href: "/admin/species", title: t.species, body: t.speciesCard },
    { href: "/admin/menu", title: t.menu, body: t.menuCard },
    { href: "/admin/orders", title: t.orders.title, body: t.orders.card },
    { href: "/admin/sales", title: t.sales.title, body: t.sales.card },
    { href: "/admin/shop", title: t.shop, body: t.shopCard },
    { href: "/admin/services", title: t.services, body: t.servicesCard },
    { href: "/admin/site", title: t.site, body: t.siteCard },
    { href: "/admin/texts", title: t.texts, body: t.textsCard },
  ];

  return (
    <>
      <h1 className="display text-4xl md:text-5xl">{t.title}</h1>

      <dl className="mt-10 grid grid-cols-3 gap-x-6 md:gap-x-10">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse border-t border-ink pb-8 pt-4">
            <dt className="mt-1 text-[0.8125rem] text-muted">{stat.label}</dt>
            <dd className="font-serif text-4xl md:text-5xl">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="visitors" className="mt-14 border-t border-line pt-10">
        <h2 id="visitors" className="font-serif text-2xl">
          {t.visits.title}
        </h2>
        {visits === "unavailable" ? (
          <p className="notice mt-5 max-w-xl">{t.visits.unavailable}</p>
        ) : (
          <>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-x-10">
              {[
                { label: t.visits.online, value: stats_?.online },
                { label: t.visits.today, value: stats_?.today },
                { label: t.visits.lastSevenDays, value: stats_?.lastSevenDays },
                { label: t.visits.total, value: stats_?.total },
              ].map((item) => (
                <div key={item.label} className="flex flex-col-reverse border-t border-ink pt-4">
                  <dt className="mt-1 text-[0.8125rem] text-muted">{item.label}</dt>
                  <dd className="font-serif text-4xl md:text-5xl">{item.value ?? "–"}</dd>
                </div>
              ))}
            </dl>

            {stats_ && (
              <>
                <h3 className="eyebrow mt-10">{t.visits.lastFourteen}</h3>
                <ol className="mt-4 max-w-xl space-y-1.5">
                  {stats_.days.map((day) => (
                    <li key={day.day} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-3 text-[0.875rem]">
                      <span className="text-muted">{dayFormat.format(new Date(`${day.day}T00:00:00Z`))}</span>
                      <span aria-hidden className="h-3 bg-wall">
                        <span className="block h-full bg-ink" style={{ width: `${(day.visitors / biggest) * 100}%` }} />
                      </span>
                      <span className="text-right tabular-nums">{day.visitors}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            <p className="mt-6 max-w-xl text-[0.8125rem] text-faint">{t.visits.note}</p>
          </>
        )}
      </section>

      <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <li key={area.href}>
            <Link
              to={localePath(lang, area.href)}
              className="lift group block h-full border border-line-strong bg-surface p-7 hover:border-ink"
            >
              <h2 className="font-serif text-2xl">{area.title}</h2>
              <p className="mt-2 text-[0.9375rem] text-muted">{area.body}</p>
              <p className="link mt-5 inline-block text-[0.9375rem]">{t.manage}</p>
            </Link>
          </li>
        ))}
      </ul>

      <Link to={localePath(lang, "/admin/species/new")} className="btn btn-primary mt-8">
        {t.newSpecies}
      </Link>
    </>
  );
}
