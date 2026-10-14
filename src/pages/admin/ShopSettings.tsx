import ShopSettingsForm from "@/components/admin/ShopSettingsForm";
import PageLoading from "@/components/PageLoading";
import QrCode from "@/components/QrCode";
import { format } from "@/i18n";
import { useT } from "@/i18n/hooks";
import { tableQrUrl } from "@/lib/site";
import { useData } from "@/state/data";

/** Whether and how customers can order, and the QR codes for the tables. */
export default function ShopSettings() {
  const t = useT();
  const labels = t.admin.shopForm;
  const { status, shop } = useData();

  if (status === "loading") return <PageLoading />;

  const tables = Array.from({ length: shop.table_count }, (_, i) => i + 1);

  return (
    <>
      <div className="print:hidden">
        <h1 className="display text-4xl md:text-5xl">{labels.title}</h1>
        <p className="mt-4 max-w-xl text-[0.9375rem] text-muted">{labels.lede}</p>
        {/* A new form is made when the saved settings change, so it never shows a stale copy. */}
        <ShopSettingsForm key={JSON.stringify(shop)} shop={shop} />
      </div>

      <section aria-labelledby="table-qr" className="mt-14 border-t border-line pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
          <div>
            <h2 id="table-qr" className="text-2xl font-semibold">
              {labels.tablesTitle}
            </h2>
            <p className="mt-2 max-w-xl text-[0.9375rem] text-muted">{labels.tablesLede}</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => window.print()} disabled={tables.length === 0}>
            {labels.print}
          </button>
        </div>

        {tables.length === 0 ? (
          <p className="mt-6 text-muted print:hidden">{labels.noTables}</p>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-5 print:mt-0 print:grid-cols-3 sm:grid-cols-3 lg:grid-cols-4">
            {tables.map((n) => (
              <li key={n} className="card break-inside-avoid p-4 text-center print:rounded-none print:border-black">
                <QrCode url={tableQrUrl(n)} label={format(t.order.tableN, { n })} className="mx-auto w-full max-w-44" />
                <p className="mt-3 text-xl font-semibold print:text-black">{format(t.order.tableN, { n })}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
