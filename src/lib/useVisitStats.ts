import { useEffect, useState, useSyncExternalStore } from "react";
import { getOnlineCount, subscribePresence } from "@/lib/presence";
import { supabase } from "@/lib/supabase";
import { bangkokToday } from "@/lib/visits";

export type VisitStats = {
  /** Other tabs open right now, not counting this one. */
  online: number;
  today: number;
  lastSevenDays: number;
  total: number;
  /** The last 14 days, oldest first, with zero for a day nobody came. */
  days: { day: string; visitors: number }[];
};

const dayOffset = (from: string, back: number) =>
  new Date(Date.parse(`${from}T00:00:00Z`) - back * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

/** The visit counts for the dashboard, or null while loading. Only an admin can read them. */
export function useVisitStats(): VisitStats | null | "unavailable" {
  const [rows, setRows] = useState<{ day: string; visitors: number }[] | null | "unavailable">(null);
  const everyone = useSyncExternalStore(subscribePresence, getOnlineCount);

  useEffect(() => {
    let cancelled = false;
    supabase
      ?.from("visit_days")
      .select("day,visitors")
      .order("day", { ascending: false })
      .then(({ data, error }) => {
        if (!cancelled) setRows(error || !data ? "unavailable" : (data as { day: string; visitors: number }[]));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (rows === null || rows === "unavailable") return rows;

  const today = bangkokToday();
  const byDay = new Map(rows.map((row) => [row.day, row.visitors]));
  const days = Array.from({ length: 14 }, (_, i) => {
    const day = dayOffset(today, 13 - i);
    return { day, visitors: byDay.get(day) ?? 0 };
  });
  const weekStart = dayOffset(today, 6);

  return {
    online: Math.max(0, everyone - 1),
    today: byDay.get(today) ?? 0,
    lastSevenDays: rows.filter((row) => row.day >= weekStart && row.day <= today).reduce((sum, row) => sum + row.visitors, 0),
    total: rows.reduce((sum, row) => sum + row.visitors, 0),
    days,
  };
}
