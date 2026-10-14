import { useCallback, useEffect, useRef, useState } from "react";
import { fetchOrder, fetchOrdersSince, type AdminOrder } from "@/lib/adminOrders";
import { supabase } from "@/lib/supabase";

/** How far back the board reads. Older orders are in the sales summary. */
const DAYS_BACK = 3;
/** The live feed is the main way new orders arrive; this catches anything it missed. */
const POLL_MS = 15_000;

export type OrdersFeed = {
  /** Null while the first read is under way. */
  orders: AdminOrder[] | null;
  /** True when the live feed is connected. */
  live: boolean;
  /** True when orders could not be read. */
  failed: boolean;
  refresh: () => Promise<void>;
  /** Puts a changed order straight into the list, without waiting for the feed. */
  replace: (order: AdminOrder) => void;
};

/**
 * Today's orders for the dashboard, kept up to date. New orders arrive through Supabase Realtime
 * (only admins can read orders, so only admins receive them), with a slow read as a back-up.
 * `onNewOrder` is called once for each order that appears after the first read.
 */
export function useAdminOrders(onNewOrder: (order: AdminOrder) => void): OrdersFeed {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const known = useRef<Set<string> | null>(null);
  const announce = useRef(onNewOrder);

  useEffect(() => {
    announce.current = onNewOrder;
  }, [onNewOrder]);

  /** Shows `list`, and announces any order not seen before (once the first read is done). */
  const apply = useCallback((list: AdminOrder[]) => {
    const seen = known.current;
    if (seen) {
      const fresh = list.filter((order) => !seen.has(order.id));
      // Oldest first, so the staff hear them in the order they came.
      fresh.reverse().forEach((order) => announce.current(order));
    }
    known.current = new Set(list.map((order) => order.id));
    setOrders(list);
  }, []);

  const refresh = useCallback(async () => {
    const since = new Date(Date.now() - DAYS_BACK * 24 * 60 * 60 * 1000);
    const list = await fetchOrdersSince(since);
    if (list === null) {
      setFailed(true);
      return;
    }
    setFailed(false);
    apply(list);
  }, [apply]);

  const replace = useCallback((order: AdminOrder) => {
    setOrders((current) => (current ? current.map((item) => (item.id === order.id ? order : item)) : current));
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let cancelled = false;

    // The first read, then a slow one as a back-up. Written as a promise chain because it sets state.
    const load = () =>
      fetchOrdersSince(new Date(Date.now() - DAYS_BACK * 24 * 60 * 60 * 1000)).then((list) => {
        if (cancelled) return;
        setFailed(list === null);
        if (list) apply(list);
      });
    void load();
    const poll = window.setInterval(() => void load(), POLL_MS);

    const channel = client
      .channel("orders-board")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, async (payload) => {
        if (cancelled) return;
        if (payload.eventType === "DELETE") {
          const id = (payload.old as { id?: string }).id;
          if (id) setOrders((current) => current?.filter((order) => order.id !== id) ?? current);
          return;
        }
        const id = (payload.new as { id?: string }).id;
        const order = id ? await fetchOrder(id) : null;
        if (cancelled || !order) return;

        // Announced here, outside the state update, so that it happens once.
        if (known.current && !known.current.has(order.id)) {
          known.current.add(order.id);
          announce.current(order);
        }
        setOrders((current) => {
          if (!current) return current;
          return current.some((item) => item.id === order.id)
            ? current.map((item) => (item.id === order.id ? order : item))
            : [order, ...current].sort((a, b) => b.created_at.localeCompare(a.created_at));
        });
      })
      .subscribe((status) => {
        if (!cancelled) setLive(status === "SUBSCRIBED");
      });

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      void client.removeChannel(channel);
    };
  }, [apply]);

  return { orders, live, failed, refresh, replace };
}
