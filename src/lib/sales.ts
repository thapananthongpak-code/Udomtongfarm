// Reading the sales summary. The adding up is done by the database (sales_by_day and top_items in
// supabase/schema.sql), which only answers admins. A sale is an order the staff marked as paid and
// that was not cancelled, counted on the day it was paid.

import { supabase } from "@/lib/supabase";

export type SalesDay = { day: string; orders: number; revenue: number; cash: number; promptpay: number };
export type TopItem = { name_th: string; name_en: string | null; quantity: number; revenue: number };

export type SalesTotals = { orders: number; revenue: number; cash: number; promptpay: number };

export const sumDays = (days: SalesDay[]): SalesTotals =>
  days.reduce(
    (total, day) => ({
      orders: total.orders + day.orders,
      revenue: total.revenue + day.revenue,
      cash: total.cash + day.cash,
      promptpay: total.promptpay + day.promptpay,
    }),
    { orders: 0, revenue: 0, cash: 0, promptpay: 0 },
  );

/** Daily sales from `from` to `to`, both included. Null when they could not be read. */
export async function fetchSalesDays(from: string, to: string): Promise<SalesDay[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("sales_by_day", { p_from: from, p_to: to });
  if (error || !data) return null;
  return (data as SalesDay[]).map((row) => ({ ...row, day: String(row.day).slice(0, 10) }));
}

export async function fetchTopItems(from: string, to: string, limit = 10): Promise<TopItem[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("top_items", { p_from: from, p_to: to, p_limit: limit });
  if (error || !data) return null;
  return data as TopItem[];
}

/** Orders that have not been paid for and are not cancelled: money still to come in. */
export async function fetchPending(): Promise<{ orders: number; amount: number } | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("orders").select("total").is("paid_at", null).neq("status", "cancelled");
  if (error || !data) return null;
  return { orders: data.length, amount: data.reduce((sum, row) => sum + (row.total as number), 0) };
}

/** Daily rows as a CSV file's text, with a byte order mark so that Excel reads the Thai correctly. */
export function salesCsv(days: SalesDay[]): string {
  const rows = [["date", "orders", "revenue", "cash", "promptpay"], ...days.map((d) => [d.day, d.orders, d.revenue, d.cash, d.promptpay])];
  return `${String.fromCharCode(0xfeff)}${rows.map((row) => row.join(",")).join("\r\n")}\r\n`;
}
