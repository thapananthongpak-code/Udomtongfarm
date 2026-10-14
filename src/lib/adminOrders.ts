// What the admin dashboard does with orders: reading them with their lines, and changing them.
// Only an admin's account is allowed any of this (see the policies in supabase/schema.sql), and every
// change asks for the row back, so a refused change is reported as failed and never as done.

import type { OrderStatus, PaymentMethod } from "@/lib/orders";
import { supabase } from "@/lib/supabase";

export type AdminOrderLine = {
  id: string;
  menu_item_id: string | null;
  name_th: string;
  name_en: string;
  unit_price: number;
  quantity: number;
  created_at: string;
};

export type AdminOrder = {
  id: string;
  order_no: number;
  customer_name: string;
  table_no: number | null;
  note: string;
  payment_method: PaymentMethod;
  status: OrderStatus;
  total: number;
  /** When an admin marked the money as received, or null while it has not been. */
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  order_items: AdminOrderLine[];
};

const SELECT =
  "*, order_items(id, menu_item_id, name_th, name_en, unit_price, quantity, created_at)";

const sortLines = (order: AdminOrder): AdminOrder => ({
  ...order,
  order_items: [...(order.order_items ?? [])].sort(
    (a, b) => a.created_at.localeCompare(b.created_at) || a.name_th.localeCompare(b.name_th, "th"),
  ),
});

/** Orders placed since `since`, newest first. Null when they could not be read. */
export async function fetchOrdersSince(since: Date): Promise<AdminOrder[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("orders")
    .select(SELECT)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });
  if (error || !data) return null;
  return (data as unknown as AdminOrder[]).map(sortLines);
}

export async function fetchOrder(id: string): Promise<AdminOrder | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("orders").select(SELECT).eq("id", id).maybeSingle();
  if (error || !data) return null;
  return sortLines(data as unknown as AdminOrder);
}

async function changed(request: PromiseLike<{ data: unknown[] | null; error: unknown }>): Promise<boolean> {
  const { data, error } = await request;
  return !error && Array.isArray(data) && data.length > 0;
}

export function setOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  if (!supabase) return Promise.resolve(false);
  return changed(supabase.from("orders").update({ status }).eq("id", id).select("id"));
}

/** Marks the money as received (now), or takes that back. */
export function setOrderPaid(id: string, paid: boolean): Promise<boolean> {
  if (!supabase) return Promise.resolve(false);
  return changed(
    supabase
      .from("orders")
      .update({ paid_at: paid ? new Date().toISOString() : null })
      .eq("id", id)
      .select("id"),
  );
}

export function setLineQuantity(lineId: string, quantity: number): Promise<boolean> {
  if (!supabase || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) return Promise.resolve(false);
  return changed(supabase.from("order_items").update({ quantity }).eq("id", lineId).select("id"));
}

export function removeLine(lineId: string): Promise<boolean> {
  if (!supabase) return Promise.resolve(false);
  return changed(supabase.from("order_items").delete().eq("id", lineId).select("id"));
}

/** Statuses an order moves through, in order. The step after `status`, or null at the end. */
export function nextStatus(status: OrderStatus): OrderStatus | null {
  return status === "new" ? "confirmed" : status === "confirmed" ? "ready" : status === "ready" ? "completed" : null;
}

/** Orders that still need work from the staff. */
export const isActive = (order: Pick<AdminOrder, "status">) =>
  order.status === "new" || order.status === "confirmed" || order.status === "ready";
