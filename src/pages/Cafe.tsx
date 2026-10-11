import { Link } from "react-router-dom";
import PageIntro from "@/components/PageIntro";
import PageLoading from "@/components/PageLoading";
import SpeciesImage from "@/components/species/SpeciesImage";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { formatPrice, groupMenu, menuDescription, menuName } from "@/lib/menu";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";

export default function Cafe() {
  const lang = useLang();
  const t = useT();
  const { status, menu } = useData();
  usePageMeta(t.cafe.title, t.meta.cafe);

  if (status === "loading") return <PageLoading />;

  const groups = groupMenu(menu);

  return (
    <>
      <PageIntro eyebrow={t.cafe.eyebrow} title={t.cafe.title} lede={t.cafe.lede}>
        <p className="notice mt-8 max-w-2xl">{t.cafe.notice}</p>
      </PageIntro>

      {groups.length === 0 && (
        <section className="border-t border-line">
          <p className="shell py-16 text-muted">{t.cafe.empty}</p>
        </section>
      )}

      {groups.map((group) => (
        <section key={group.category} className="border-t border-line">
          <div className="shell py-16 md:py-20">
            <h2 className="display text-3xl md:text-4xl">{t.cafe.categories[group.category]}</h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-10 lg:grid-cols-4">
              {group.items.map((item) => {
                const description = menuDescription(item, lang);
                return (
                  <li key={item.id}>
                    <SpeciesImage src={item.image} alt="" className="aspect-square" />
                    <div className="mt-4 flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-xl leading-snug">{menuName(item, lang)}</h3>
                      {item.price !== null && <p className="shrink-0 text-[0.9375rem]">{formatPrice(item.price)}</p>}
                    </div>
                    {description && <p className="mt-1 text-[0.9375rem] text-muted">{description}</p>}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ))}

      <section className="border-t border-line">
        <div className="shell py-16 md:py-20">
          <h2 className="display max-w-2xl text-3xl md:text-4xl">{t.home.visitTitle}</h2>
          <p className="mt-4 max-w-xl text-muted">{t.home.visitBody}</p>
          <Link to={localePath(lang, "/visit")} className="btn btn-primary mt-8">
            {t.home.visit}
          </Link>
        </div>
      </section>
    </>
  );
}
