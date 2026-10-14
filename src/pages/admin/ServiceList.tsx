import { Link } from "react-router-dom";
import SpeciesImage from "@/components/species/SpeciesImage";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { formatPrice } from "@/lib/menu";
import { serviceName } from "@/lib/services";
import { useAdminServices } from "@/lib/useAdminServices";

export default function ServiceList() {
  const lang = useLang();
  const dict = useT();
  const t = dict.admin;
  const services = useAdminServices();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-4xl md:text-5xl">{t.services}</h1>
        <Link to={localePath(lang, "/admin/services/new")} className="btn btn-primary">
          {t.newService}
        </Link>
      </div>

      {services === null ? (
        <div className="mt-10 h-40 animate-pulse bg-wall" aria-busy="true" />
      ) : services.length === 0 ? (
        <p className="mt-10 border-t border-line pt-8 text-muted">{t.servicesEmpty}</p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-ink text-[0.8125rem] text-muted">
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.name}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {t.kind}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {t.price}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {t.state}
                </th>
                <th scope="col" className="py-3 pl-4">
                  <span className="sr-only">{t.edit}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((item) => (
                <tr key={item.id} className="border-b border-line align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-4">
                      <SpeciesImage src={item.image} alt="" className="size-12 shrink-0" />
                      <p className="font-serif text-lg leading-snug">{serviceName(item, lang)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {item.kind === "activity" ? dict.gallery.tabActivities : dict.gallery.tabRates}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.price === null ? (
                      <span className="text-muted">{t.noPrice}</span>
                    ) : item.price === 0 ? (
                      t.free
                    ) : (
                      formatPrice(item.price)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.published ? t.statePublished : <span className="text-muted">{t.stateDraft}</span>}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-4 text-right">
                    <Link to={localePath(lang, `/admin/services/${item.id}`)} className="link">
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
