import { Link } from "react-router-dom";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { useAdminSpecies } from "@/lib/useAdminSpecies";

export default function Dashboard() {
  const lang = useLang();
  const t = useT().admin;
  const species = useAdminSpecies();
  const published = species?.filter((sp) => sp.published).length ?? 0;

  const stats = [
    { label: t.total, value: species ? species.length : "–" },
    { label: t.published, value: species ? published : "–" },
    { label: t.drafts, value: species ? species.length - published : "–" },
  ];

  const areas = [
    { href: "/admin/species", title: t.species, body: t.speciesCard },
    { href: "/admin/menu", title: t.menu, body: t.menuCard },
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

      <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
