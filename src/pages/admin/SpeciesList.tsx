import { Link } from "react-router-dom";
import SpeciesImage from "@/components/species/SpeciesImage";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { speciesName, speciesPath } from "@/lib/species/helpers";
import { useAdminSpecies } from "@/lib/useAdminSpecies";

export default function SpeciesList() {
  const lang = useLang();
  const dict = useT();
  const t = dict.admin;
  const species = useAdminSpecies();
  const dateFormat = new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", { dateStyle: "medium" });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-4xl md:text-5xl">{t.species}</h1>
        <Link to={localePath(lang, "/admin/species/new")} className="btn btn-primary">
          {t.newSpecies}
        </Link>
      </div>

      {species === null ? (
        <div className="mt-10 h-40 animate-pulse bg-wall" aria-busy="true" />
      ) : species.length === 0 ? (
        <p className="mt-10 border-t border-line pt-8 text-muted">{t.empty}</p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-ink text-[0.8125rem] text-muted">
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.name}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {t.department}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {t.state}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {t.updated}
                </th>
                <th scope="col" className="py-3 pl-4">
                  <span className="sr-only">{t.edit}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {species.map((sp) => (
                <tr key={sp.id} className="border-b border-line align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-4">
                      <SpeciesImage src={sp.image} alt="" className="size-12 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-serif text-lg leading-snug">{speciesName(sp, lang)}</p>
                        {sp.scientific_name && <p className="scientific text-[0.875rem] text-muted">{sp.scientific_name}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{sp.type === "animal" ? dict.common.animal : dict.common.plant}</td>
                  <td className="px-4 py-3">
                    {sp.published ? t.statePublished : <span className="text-muted">{t.stateDraft}</span>}
                    {sp.featured && <span className="ml-2 text-[0.8125rem] text-muted">· {t.featured}</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">
                    {sp.updated_at ? dateFormat.format(new Date(sp.updated_at)) : ""}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-4 text-right">
                    {sp.published && (
                      <Link to={localePath(lang, speciesPath(sp.id))} className="link mr-5 text-muted">
                        {t.view}
                      </Link>
                    )}
                    <Link to={localePath(lang, `/admin/species/${sp.id}`)} className="link">
                      {t.edit}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
