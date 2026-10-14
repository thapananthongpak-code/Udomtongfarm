import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OrderCard from "@/components/admin/OrderCard";
import Receipt from "@/components/admin/Receipt";
import { format } from "@/i18n";
import { useT } from "@/i18n/hooks";
import { fetchOrder, isActive, type AdminOrder } from "@/lib/adminOrders";
import {
  askForNotifications,
  chime,
  notificationsAvailable,
  notify,
  rememberSound,
  soundWanted,
  unlockSound,
} from "@/lib/orderAlert";
import { useAdminOrders } from "@/lib/useAdminOrders";
import { bangkokToday } from "@/lib/visits";

type Filter = "active" | "unpaid" | "today" | "all";

/** The orders, live. New ones announce themselves with a chime; the staff move them along from here. */
export default function OrderBoard() {
  const t = useT();
  const labels = t.admin.orders;
  const [filter, setFilter] = useState<Filter>("active");
  const [sound, setSound] = useState(soundWanted);
  const [desktop, setDesktop] = useState(() => notificationsAvailable() && Notification.permission === "granted");
  const [unseen, setUnseen] = useState<Set<string>>(new Set());
  const [receipt, setReceipt] = useState<AdminOrder | null>(null);
  const soundRef = useRef(sound);
  const desktopRef = useRef(desktop);

  useEffect(() => {
    soundRef.current = sound;
    desktopRef.current = desktop;
  }, [sound, desktop]);

  const onNewOrder = useCallback(
    (order: AdminOrder) => {
      setUnseen((current) => new Set(current).add(order.id));
      if (soundRef.current) chime();
      if (desktopRef.current && document.visibilityState === "hidden") {
        notify(format(labels.notifyTitle, { n: order.order_no }), `${order.customer_name} · ${format(t.order.basketBar, { n: order.order_items.reduce((s, l) => s + l.quantity, 0) })}`);
      }
    },
    [labels.notifyTitle, t.order.basketBar],
  );

  const { orders, live, failed, refresh, replace } = useAdminOrders(onNewOrder);

  // The tab's title says how many orders are waiting, so they are noticed from another tab.
  const waiting = orders?.filter((order) => order.status === "new").length ?? 0;
  useEffect(() => {
    const original = document.title;
    if (waiting > 0) document.title = `(${waiting}) ${labels.title}`;
    return () => {
      document.title = original;
    };
  }, [waiting, labels.title]);

  // Printing: the receipt is drawn, then the browser's print window opens.
  useEffect(() => {
    if (!receipt) return;
    document.body.dataset.print = "receipt";
    const clear = () => {
      delete document.body.dataset.print;
      setReceipt(null);
    };
    window.addEventListener("afterprint", clear, { once: true });
    const timer = window.setTimeout(() => window.print(), 50);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("afterprint", clear);
      delete document.body.dataset.print;
    };
  }, [receipt]);

  async function changed(id: string) {
    const order = await fetchOrder(id);
    if (order) replace(order);
    setUnseen((current) => {
      if (!current.has(id)) return current;
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }

  function toggleSound() {
    const next = !sound;
    setSound(next);
    rememberSound(next);
    if (next) {
      unlockSound();
      chime();
    }
  }

  async function toggleDesktop() {
    if (desktop) return setDesktop(false);
    setDesktop(await askForNotifications());
  }

  const today = bangkokToday();
  const shown = useMemo(() => {
    const list = orders ?? [];
    const sameDay = (iso: string) => new Date(Date.parse(iso) + 7 * 3600 * 1000).toISOString().slice(0, 10) === today;
    switch (filter) {
      case "active":
        // Oldest first: the one that has waited longest is at the top.
        return list.filter(isActive).sort((a, b) => a.created_at.localeCompare(b.created_at));
      case "unpaid":
        return list.filter((order) => !order.paid_at && order.status !== "cancelled");
      case "today":
        return list.filter((order) => sameDay(order.created_at));
      default:
        return list;
    }
  }, [orders, filter, today]);

  const counts = {
    active: orders?.filter(isActive).length ?? 0,
    unpaid: orders?.filter((order) => !order.paid_at && order.status !== "cancelled").length ?? 0,
  };
  const tabs: { id: Filter; label: string; count?: number }[] = [
    { id: "active", label: labels.filterActive, count: counts.active },
    { id: "unpaid", label: labels.filterUnpaid, count: counts.unpaid },
    { id: "today", label: labels.filterToday },
    { id: "all", label: labels.filterAll },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="display text-4xl md:text-5xl">{labels.title}</h1>
          <p className="mt-3 max-w-xl text-[0.9375rem] text-muted">{labels.lede}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[0.8125rem] font-semibold ${live ? "bg-wall text-accent" : "bg-wall text-muted"}`}>
            ● {live ? labels.live : labels.polling}
          </span>
          <button type="button" className="btn btn-sm" aria-pressed={sound} onClick={toggleSound}>
            {sound ? labels.soundOn : labels.soundOff}
          </button>
          {notificationsAvailable() && (
            <button type="button" className="btn btn-sm btn-quiet" aria-pressed={desktop} onClick={toggleDesktop}>
              {desktop ? labels.notifyOn : labels.notifyOff}
            </button>
          )}
        </div>
      </div>

      {unseen.size > 0 && (
        <p role="status" className="notice mt-6 print:hidden">
          <strong>{format(labels.newBanner, { n: unseen.size })}</strong>
        </p>
      )}
      {failed && (
        <p role="alert" className="notice notice-error mt-6 print:hidden">
          {labels.loadFailed}
        </p>
      )}

      <nav aria-label={labels.title} className="mt-8 print:hidden">
        <ul className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                aria-pressed={filter === tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex min-h-10 items-center gap-2 rounded-full border px-4 text-[0.9375rem] transition-colors ${
                  filter === tab.id ? "border-accent bg-accent font-semibold text-on-accent" : "border-line bg-surface hover:border-accent"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && <span className="text-[0.8125rem] opacity-80">{tab.count}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {orders === null ? (
        <div className="mt-8 h-40 animate-pulse rounded-2xl bg-wall print:hidden" aria-busy="true" />
      ) : shown.length === 0 ? (
        <p className="mt-10 border-t border-line pt-8 text-muted print:hidden">
          {filter === "active" ? labels.emptyActive : labels.empty}
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 print:hidden xl:grid-cols-2">
          {shown.map((order) => (
            <OrderCard key={order.id} order={order} fresh={unseen.has(order.id)} onChanged={changed} onPrint={setReceipt} />
          ))}
        </ul>
      )}

      <button type="button" className="link mt-8 text-[0.875rem] text-muted print:hidden" onClick={() => void refresh()}>
        {labels.refresh}
      </button>

      {receipt && <Receipt order={receipt} />}
    </>
  );
}
