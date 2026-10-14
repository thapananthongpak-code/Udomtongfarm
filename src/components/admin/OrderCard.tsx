import { useState } from "react";
import { format } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import {
  isActive,
  nextStatus,
  removeLine,
  setLineQuantity,
  setOrderPaid,
  setOrderStatus,
  type AdminOrder,
} from "@/lib/adminOrders";
import { setMenuAvailability } from "@/lib/admin";
import { formatPrice } from "@/lib/menu";
import type { OrderStatus } from "@/lib/orders";

type Props = {
  order: AdminOrder;
  /** Reads this order again after a change, and shows it. */
  onChanged: (id: string) => Promise<void>;
  onPrint: (order: AdminOrder) => void;
  /** True for an order that arrived while the page was open and has not been looked at. */
  fresh: boolean;
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: "bg-accent text-on-accent",
  confirmed: "bg-wall text-ink",
  ready: "bg-wall text-accent",
  completed: "bg-wall text-muted",
  cancelled: "bg-wall text-danger",
};

/** One order on the board: who, what, how it is paid, and the buttons to move it along. */
export default function OrderCard({ order, onChanged, onPrint, fresh }: Props) {
  const lang = useLang();
  const t = useT();
  const labels = t.admin.orders;
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState(false);
  const [editing, setEditing] = useState(false);

  const active = isActive(order);
  const next = nextStatus(order.status);
  const time = new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(new Date(order.created_at));

  const statusName: Record<OrderStatus, string> = {
    new: labels.statusNew,
    confirmed: labels.statusConfirmed,
    ready: labels.statusReady,
    completed: labels.statusCompleted,
    cancelled: labels.statusCancelled,
  };
  const nextLabel: Partial<Record<OrderStatus, string>> = {
    confirmed: labels.accept,
    ready: labels.markReady,
    completed: labels.complete,
  };

  /** Runs a change, then shows what the database now holds. A failure is shown, never hidden. */
  async function run(action: () => Promise<boolean>) {
    setBusy(true);
    setProblem(false);
    const ok = await action();
    if (ok) await onChanged(order.id);
    else setProblem(true);
    setBusy(false);
  }

  function advance() {
    if (!next) return;
    if (next === "completed" && !order.paid_at && !window.confirm(format(labels.confirmCompleteUnpaid, { n: order.order_no }))) return;
    void run(() => setOrderStatus(order.id, next));
  }

  function cancel() {
    if (!window.confirm(format(labels.confirmCancel, { n: order.order_no }))) return;
    void run(() => setOrderStatus(order.id, "cancelled"));
  }

  return (
    <li
      className={`card p-5 ${fresh ? "border-accent ring-2 ring-accent/30" : ""} ${order.status === "cancelled" ? "opacity-70" : ""}`}
      aria-label={format(t.order.orderNo, { n: order.order_no })}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold">
            {format(t.order.orderNo, { n: order.order_no })}
            <span className="ml-3 text-base font-normal text-muted">{time}</span>
          </p>
          <p className="mt-0.5 text-[0.9375rem]">
            {order.customer_name} ·{" "}
            <strong>{order.table_no ? format(labels.table, { n: order.table_no }) : labels.counter}</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[0.8125rem] font-semibold">
          <span className={`rounded-full px-3 py-1 ${STATUS_STYLE[order.status]}`}>{statusName[order.status]}</span>
          <span className="rounded-full bg-wall px-3 py-1">
            {order.payment_method === "promptpay" ? labels.promptpay : labels.cash}
          </span>
          <span className={`rounded-full px-3 py-1 ${order.paid_at ? "bg-accent text-on-accent" : "bg-wall text-danger"}`}>
            {order.paid_at ? labels.paid : labels.unpaid}
          </span>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-line border-y border-line">
        {order.order_items.map((line) => (
          <li key={line.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5">
            <span className="min-w-0">
              <span className="font-semibold tabular-nums">{line.quantity} ×</span>{" "}
              {(lang === "th" ? line.name_th : line.name_en || line.name_th)}
            </span>
            <span className="flex items-center gap-2">
              {editing && active && (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-quiet !min-h-8 !px-2.5"
                    disabled={busy || line.quantity <= 1}
                    aria-label={`${labels.fewer}: ${line.name_th}`}
                    onClick={() => run(() => setLineQuantity(line.id, line.quantity - 1))}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-quiet !min-h-8 !px-2.5"
                    disabled={busy || line.quantity >= 20}
                    aria-label={`${labels.more}: ${line.name_th}`}
                    onClick={() => run(() => setLineQuantity(line.id, line.quantity + 1))}
                  >
                    +
                  </button>
                  {line.menu_item_id && (
                    <button
                      type="button"
                      className="btn btn-sm btn-quiet !min-h-8"
                      disabled={busy}
                      onClick={() => {
                        if (!window.confirm(format(labels.confirmSoldOut, { name: line.name_th }))) return;
                        void run(async () => (await setMenuAvailability(line.menu_item_id!, false)) && (await removeLine(line.id)));
                      }}
                    >
                      {labels.soldOutLine}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger !min-h-8"
                    disabled={busy || order.order_items.length <= 1}
                    title={order.order_items.length <= 1 ? labels.lastLine : undefined}
                    onClick={() => run(() => removeLine(line.id))}
                  >
                    {labels.removeLine}
                  </button>
                </>
              )}
              <span className="w-20 text-right tabular-nums">{formatPrice(line.unit_price * line.quantity)}</span>
            </span>
          </li>
        ))}
      </ul>
      {editing && order.order_items.length <= 1 && <p className="field-hint">{labels.lastLine}</p>}

      <p className="mt-3 flex items-baseline justify-between gap-4">
        <span className="text-muted">{t.order.total}</span>
        <span className="text-2xl font-semibold text-accent tabular-nums">{formatPrice(order.total)}</span>
      </p>
      {order.note && <p className="notice mt-3">{order.note}</p>}

      {problem && (
        <p role="alert" className="notice notice-error mt-3">
          {labels.actionFailed}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {next && nextLabel[next] && (
          <button type="button" className="btn btn-primary" disabled={busy} onClick={advance}>
            {nextLabel[next]}
          </button>
        )}
        {order.status !== "cancelled" && (
          <button
            type="button"
            className={`btn ${order.paid_at ? "btn-quiet" : ""}`}
            disabled={busy}
            onClick={() => run(() => setOrderPaid(order.id, !order.paid_at))}
          >
            {order.paid_at ? labels.markUnpaid : labels.markPaid}
          </button>
        )}
        {active && (
          <button type="button" className="btn btn-quiet" disabled={busy} aria-pressed={editing} onClick={() => setEditing((v) => !v)}>
            {labels.editLines}
          </button>
        )}
        <button type="button" className="btn btn-quiet" onClick={() => onPrint(order)}>
          {labels.print}
        </button>
        {order.status !== "cancelled" && order.status !== "completed" && (
          <button type="button" className="btn btn-danger ml-auto" disabled={busy} onClick={cancel}>
            {labels.cancel}
          </button>
        )}
      </div>
    </li>
  );
}
