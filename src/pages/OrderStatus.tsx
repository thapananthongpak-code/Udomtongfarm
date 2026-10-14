import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFoundContent from "@/components/NotFoundContent";
import PageLoading from "@/components/PageLoading";
import QrCode from "@/components/QrCode";
import { format, localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { formatPrice } from "@/lib/menu";
import { fetchOrder, type OrderStatus as Status, type PublicOrder } from "@/lib/orders";
import { promptPayPayload } from "@/lib/promptpay";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";

const POLL_MS = 5000;
const STEPS: Status[] = ["new", "confirmed", "ready", "completed"];

/** One order, for the customer who placed it. It refreshes itself while the order is still going. */
export default function OrderStatus() {
  const { id } = useParams();
  const lang = useLang();
  const t = useT();
  const labels = t.order;
  const { shop, status: dataStatus } = useData();
  // undefined while loading, null when there is no such order.
  const [order, setOrder] = useState<PublicOrder | null | undefined>(undefined);
  const [failing, setFailing] = useState(false);
  usePageMeta(order ? format(labels.orderNo, { n: order.order_no }) : labels.title);

  const finished = order?.status === "completed" || order?.status === "cancelled";

  useEffect(() => {
    if (!id || finished) return;
    let cancelled = false;
    let timer: number | undefined;

    async function load() {
      const result = await fetchOrder(id!);
      if (cancelled) return;
      if (result === "error") setFailing(true);
      else {
        setFailing(false);
        setOrder(result);
      }
      timer = window.setTimeout(load, POLL_MS);
    }
    void load();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [id, finished]);

  if (order === undefined || dataStatus === "loading") return <PageLoading />;
  if (order === null) return <NotFoundContent />;

  const statusText: Record<Status, string> = {
    new: labels.statusNew,
    confirmed: labels.statusConfirmed,
    ready: labels.statusReady,
    completed: labels.statusCompleted,
    cancelled: labels.statusCancelled,
  };
  const cancelled = order.status === "cancelled";
  const reached = STEPS.indexOf(order.status);
  const payload = order.payment_method === "promptpay" ? promptPayPayload(shop.promptpay_id, order.total) : null;
  const needsPayment = !order.paid && !cancelled && order.total > 0;

  return (
    <div className="shell pb-8 pt-10 md:pt-14">
      <p className="eyebrow">{t.cafe.eyebrow}</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">{format(labels.orderNo, { n: order.order_no })}</h1>
      <p className="mt-2 text-muted">
        {order.customer_name} · {order.table_no ? format(labels.tableN, { n: order.table_no }) : labels.counter}
      </p>

      <div className={`mt-8 rounded-[var(--radius)] p-5 sm:p-6 ${cancelled ? "notice notice-error" : "bg-wall"}`} role="status">
        <p className="text-xl font-semibold">{statusText[order.status]}</p>
        {!cancelled && (
          <ol aria-hidden className="mt-4 grid grid-cols-4 gap-2">
            {STEPS.map((step, index) => (
              <li key={step} className={`h-1.5 rounded-full ${index <= reached ? "bg-accent" : "bg-line-strong"}`} />
            ))}
          </ol>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <section aria-label={labels.items}>
          <ul className="card divide-y divide-line px-5">
            {order.items.map((line, index) => (
              <li key={index} className="flex items-baseline justify-between gap-4 py-3">
                <span>
                  {(lang === "th" ? line.name_th : line.name_en || line.name_th)}
                  <span className="ml-2 text-muted">× {line.quantity}</span>
                </span>
                <span className="font-semibold tabular-nums">{formatPrice(line.unit_price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-baseline justify-between gap-4 px-1 text-lg">
            <span>{labels.total}</span>
            <span className="text-3xl font-semibold text-accent">{formatPrice(order.total)}</span>
          </p>
          {order.note && <p className="mt-3 px-1 text-[0.9375rem] text-muted">{order.note}</p>}
        </section>

        <section>
          {order.paid ? (
            <p className="notice">{labels.paid}</p>
          ) : cancelled ? null : payload && needsPayment ? (
            <div className="card p-5 text-center sm:p-6">
              <h2 className="text-lg font-semibold">{labels.scanTitle}</h2>
              <QrCode url={payload} label={labels.scanTitle} className="mx-auto mt-4 w-full max-w-64 rounded-xl border border-line" />
              <p className="mt-4 text-xl font-semibold text-accent">{format(labels.scanAmount, { n: order.total })}</p>
              <p className="mt-2 text-[0.875rem] text-muted">{labels.scanHint}</p>
            </div>
          ) : needsPayment ? (
            <div className="card p-5 sm:p-6">
              <p className="font-semibold">{labels.unpaid}</p>
              <p className="mt-2 text-muted">{format(labels.cashHint, { n: order.total })}</p>
            </div>
          ) : null}

          {!finished && <p className="mt-4 text-[0.875rem] text-faint">{failing ? labels.loadError : labels.keepPage}</p>}
          <Link to={localePath(lang, "/cafe")} className="btn mt-6">
            {labels.orderMore}
          </Link>
        </section>
      </div>
    </div>
  );
}
