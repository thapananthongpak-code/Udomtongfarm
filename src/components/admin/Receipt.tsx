import { createPortal } from "react-dom";
import { format } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import type { AdminOrder } from "@/lib/adminOrders";
import { addressFor, formatPhone } from "@/lib/farm";
import { formatPrice } from "@/lib/menu";
import { useData } from "@/state/data";

/**
 * A receipt for an 80 mm thermal printer. It is drawn into the page's body, outside the app, and is
 * hidden on screen; printing shows only this (see "receipt" in src/index.css).
 */
export default function Receipt({ order }: { order: AdminOrder }) {
  const lang = useLang();
  const t = useT();
  const labels = t.admin.orders.receipt;
  const { settings } = useData();
  const when = new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(order.created_at));

  return createPortal(
    <div className="receipt-root" aria-hidden>
      <p className="receipt-center receipt-title">{t.site.name}</p>
      <p className="receipt-center">{addressFor(settings, lang)}</p>
      <p className="receipt-center">{formatPhone(settings.phone)}</p>
      <hr />
      <p className="receipt-center receipt-strong">{labels.title}</p>
      <p>
        {format(t.order.orderNo, { n: order.order_no })} · {when}
      </p>
      <p>
        {order.customer_name} · {order.table_no ? format(t.order.tableN, { n: order.table_no }) : t.admin.orders.counter}
      </p>
      <hr />
      <table>
        <tbody>
          {order.order_items.map((line) => (
            <tr key={line.id}>
              <td>
                {(lang === "th" ? line.name_th : line.name_en || line.name_th)} × {line.quantity}
              </td>
              <td className="receipt-right">{formatPrice(line.unit_price * line.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <p className="receipt-total">
        <span>{t.order.total}</span>
        <span>{formatPrice(order.total)}</span>
      </p>
      <p>
        {order.payment_method === "promptpay" ? t.admin.orders.promptpay : t.admin.orders.cash} ·{" "}
        {order.paid_at ? t.order.paid : t.order.unpaid}
      </p>
      {order.note && <p>{order.note}</p>}
      <hr />
      <p className="receipt-center">{labels.thanks}</p>
    </div>,
    document.body,
  );
}
