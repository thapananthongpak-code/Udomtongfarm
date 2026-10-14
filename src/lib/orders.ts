// Placing an order and reading it back. The database does the checking and the adding up
// (see place_order and get_order in supabase/schema.sql); this file only calls it.

import { supabase } from "@/lib/supabase";

export const ORDER_STATUSES = ["new", "confirmed", "ready", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["promptpay", "cash"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type OrderLine = { name_th: string; name_en: string; unit_price: number; quantity: number };

/** An order as the customer who placed it sees it. */
export type PublicOrder = {
  id: string;
  order_no: number;
  customer_name: string;
  table_no: number | null;
  note: string;
  payment_method: PaymentMethod;
  status: OrderStatus;
  total: number;
  paid: boolean;
  created_at: string;
  items: OrderLine[];
};

export type OrderErrorCode =
  | "ordering_closed"
  | "invalid_name"
  | "invalid_method"
  | "promptpay_unavailable"
  | "invalid_table"
  | "invalid_items"
  | "item_unavailable"
  | "too_many_orders"
  | "unknown";

const KNOWN_ERRORS: OrderErrorCode[] = [
  "ordering_closed",
  "invalid_name",
  "invalid_method",
  "promptpay_unavailable",
  "invalid_table",
  "invalid_items",
  "item_unavailable",
  "too_many_orders",
];

export type PlaceOrderInput = {
  name: string;
  table: number | null;
  note: string;
  method: PaymentMethod;
  items: { id: string; quantity: number }[];
};

export type PlaceOrderResult = { ok: true; id: string; orderNo: number; total: number } | { ok: false; code: OrderErrorCode };

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (!supabase) return { ok: false, code: "ordering_closed" };

  const { data, error } = await supabase.rpc("place_order", {
    p_name: input.name,
    p_table: input.table,
    p_note: input.note,
    p_method: input.method,
    p_items: input.items,
  });

  if (error) {
    const known = KNOWN_ERRORS.find((code) => error.message.includes(code));
    return { ok: false, code: known ?? "unknown" };
  }
  const result = data as { id: string; order_no: number; total: number } | null;
  if (!result?.id) return { ok: false, code: "unknown" };
  return { ok: true, id: result.id, orderNo: result.order_no, total: result.total };
}

/** The order with this id, null when there is none, or "error" when it could not be read. */
export async function fetchOrder(id: string): Promise<PublicOrder | null | "error"> {
  if (!supabase) return "error";
  const { data, error } = await supabase.rpc("get_order", { p_id: id });
  if (error) return "error";
  return (data as PublicOrder | null) ?? null;
}

// ── Remembering this browser's orders, so a customer can find theirs again ──

const RECENT_KEY = "recent-order";
const RECENT_HOURS = 12;

export function rememberOrder(id: string) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify({ id, at: Date.now() }));
  } catch {
    // Not remembering it only means the link is not offered again.
  }
}

/** The order id this browser placed within the last twelve hours, if any. */
export function recentOrderId(): string | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "null") as { id?: string; at?: number } | null;
    if (saved?.id && typeof saved.at === "number" && Date.now() - saved.at < RECENT_HOURS * 3600 * 1000) return saved.id;
  } catch {
    // Unreadable storage: nothing remembered.
  }
  return null;
}
