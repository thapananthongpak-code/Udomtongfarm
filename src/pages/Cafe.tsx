import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CartBar from "@/components/order/CartBar";
import QuantityStepper from "@/components/order/QuantityStepper";
import PageIntro from "@/components/PageIntro";
import PageLoading from "@/components/PageLoading";
import SpeciesImage from "@/components/species/SpeciesImage";
import { format, localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { formatPrice, groupMenu, menuDescription, menuName, type MenuItem } from "@/lib/menu";
import { recentOrderId } from "@/lib/orders";
import { usePageMeta } from "@/lib/usePageMeta";
import { useCart } from "@/state/cart";
import { useData } from "@/state/data";

/** What sits under a menu item: its price, and the way to order it when ordering is open. */
function ItemOrder({ item, open }: { item: MenuItem; open: boolean }) {
  const lang = useLang();
  const t = useT().order;
  const { quantityOf, setQuantity } = useCart();
  const quantity = quantityOf(item.id);
  const name = menuName(item, lang);

  if (!item.available) {
    return <p className="mt-3 inline-block rounded-full bg-wall px-3 py-1 text-[0.8125rem] font-semibold text-muted">{t.soldOut}</p>;
  }
  if (!open) return null;
  if (item.price === null) return <p className="mt-3 text-[0.8125rem] text-faint">{t.noPrice}</p>;

  return quantity > 0 ? (
    <QuantityStepper className="mt-3" quantity={quantity} name={name} onChange={(next) => setQuantity(item.id, next)} />
  ) : (
    <button type="button" className="btn btn-sm mt-3" onClick={() => setQuantity(item.id, 1)} aria-label={`${t.add}: ${name}`}>
      + {t.add}
    </button>
  );
}

export default function Cafe() {
  const lang = useLang();
  const t = useT();
  const { status, menu, shop } = useData();
  const { table, setTable, count } = useCart();
  const [searchParams] = useSearchParams();
  usePageMeta(t.cafe.title, t.meta.cafe);

  // A table's QR code opens this page with ?table=5. The number is remembered for the basket.
  const scanned = Number(searchParams.get("table"));
  useEffect(() => {
    if (status !== "ready" || !searchParams.has("table")) return;
    if (Number.isInteger(scanned) && scanned >= 1 && scanned <= shop.table_count) setTable(scanned);
  }, [status, searchParams, scanned, shop.table_count, setTable]);

  if (status === "loading") return <PageLoading />;

  const groups = groupMenu(menu);
  const open = shop.ordering_open;
  const lastOrder = recentOrderId();

  return (
    <>
      <PageIntro eyebrow={t.cafe.eyebrow} title={t.cafe.title} lede={t.cafe.lede}>
        {open ? (
          <div className="mt-8 flex max-w-2xl flex-wrap items-center gap-x-6 gap-y-3">
            <p className="notice grow">
              {t.order.open}
              {table !== null && <strong className="ml-2">{format(t.order.fromTable, { n: table })}</strong>}
            </p>
            {lastOrder && (
              <Link to={localePath(lang, `/order/${lastOrder}`)} className="link text-[0.9375rem]">
                {t.order.lastOrder}
              </Link>
            )}
          </div>
        ) : (
          <p className="notice mt-8 max-w-2xl">{t.cafe.notice}</p>
        )}
      </PageIntro>

      {groups.length === 0 && (
        <section className="border-t border-line">
          <p className="shell py-16 text-muted">{t.cafe.empty}</p>
        </section>
      )}

      {groups.map((group) => (
        <section key={group.category} className="shell pt-12 md:pt-16">
          <h2 className="display text-2xl md:text-3xl">{t.cafe.categories[group.category]}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {group.items.map((item) => {
              const description = menuDescription(item, lang);
              return (
                <li key={item.id} className={item.available ? "" : "opacity-70"}>
                  <SpeciesImage src={item.image} alt="" className="aspect-square" />
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold leading-snug">{menuName(item, lang)}</h3>
                    {item.price !== null && <p className="shrink-0 font-semibold text-accent">{formatPrice(item.price)}</p>}
                  </div>
                  {description && <p className="mt-1 text-[0.9375rem] text-muted">{description}</p>}
                  <ItemOrder item={item} open={open} />
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="shell pt-14 md:pt-20">
        <div className="rounded-[var(--radius)] bg-wall p-6 sm:p-8">
          <h2 className="display text-2xl md:text-3xl">{t.home.visitTitle}</h2>
          <p className="mt-3 max-w-xl text-muted">{t.home.visitBody}</p>
          <Link to={localePath(lang, "/visit")} className="btn btn-primary mt-6">
            {t.home.visit}
          </Link>
        </div>
      </section>

      {/* Room under the page, so the basket bar never covers the last lines. */}
      {count > 0 && <div aria-hidden className="h-20" />}
      <CartBar />
    </>
  );
}
