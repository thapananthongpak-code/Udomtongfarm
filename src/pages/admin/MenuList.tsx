import { useState } from "react";
import { Link } from "react-router-dom";
import SpeciesImage from "@/components/species/SpeciesImage";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { formatPrice, menuName } from "@/lib/menu";
import { setMenuAvailability } from "@/lib/admin";
import { useAdminMenu } from "@/lib/useAdminMenu";
import { useData } from "@/state/data";

export default function MenuList() {
  const lang = useLang();
  const dict = useT();
  const t = dict.admin;
  const { menu, refresh } = useAdminMenu();
  const { reload } = useData();
  const [failed, setFailed] = useState(false);

  async function toggleAvailable(id: string, available: boolean) {
    setFailed(false);
    if (!(await setMenuAvailability(id, available))) {
      setFailed(true);
      return;
    }
    // The page shows the change at once, and the site's own copy is read again for the customers.
    await Promise.all([refresh(), reload()]);
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-4xl md:text-5xl">{t.menu}</h1>
        <Link to={localePath(lang, "/admin/menu/new")} className="btn btn-primary">
          {t.newMenuItem}
        </Link>
      </div>

      {failed && (
        <p role="alert" className="notice notice-error mt-6 max-w-xl">
          {t.errors.unknown}
        </p>
      )}

      {menu === null ? (
        <div className="mt-10 h-40 animate-pulse bg-wall" aria-busy="true" />
      ) : menu.length === 0 ? (
        <p className="mt-10 border-t border-line pt-8 text-muted">{t.menuEmpty}</p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-ink text-[0.8125rem] text-muted">
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.name}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {t.category}
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
              {menu.map((item) => (
                <tr key={item.id} className="border-b border-line align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-4">
                      <SpeciesImage src={item.image} alt="" className="size-12 shrink-0" />
                      <p className="font-serif text-lg leading-snug">{menuName(item, lang)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{dict.cafe.categories[item.category]}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {item.price === null ? <span className="text-muted">{t.noPrice}</span> : formatPrice(item.price)}
                  </td>
                  <td className="px-4 py-3">
                    {item.published ? t.statePublished : <span className="text-muted">{t.stateDraft}</span>}
                    {!item.available && <span className="ml-2 rounded-full bg-wall px-2.5 py-0.5 text-[0.75rem] font-semibold">{t.soldOut}</span>}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-4 text-right">
                    <button type="button" className="btn btn-sm btn-quiet mr-4" onClick={() => toggleAvailable(item.id, !item.available)}>
                      {item.available ? t.markSoldOut : t.markAvailable}
                    </button>
                    <Link to={localePath(lang, `/admin/menu/${item.id}`)} className="link">
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
