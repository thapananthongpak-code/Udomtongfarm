// Counting how many browsers open the site each day. The count is a plain number per day in the
// `visit_days` table; nothing about the visitor is sent or stored. The browser keeps the date it
// last counted, so that one browser is counted once a day.

import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "visit-counted-on";

/** Today's date in Thailand, as 2026-10-14. The database counts by the same clock. */
export const bangkokToday = () => new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);

/** Adds this browser to today's count, unless it was already counted today. */
export function countVisitOncePerDay() {
  if (!supabase) return;
  const today = bangkokToday();

  try {
    if (window.localStorage.getItem(STORAGE_KEY) === today) return;
  } catch {
    // Without storage there is no way to avoid counting every page load, so nothing is counted.
    return;
  }

  void supabase.rpc("record_visit").then(({ error }) => {
    if (error) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, today);
    } catch {
      // Not remembering only means this browser may be counted again today.
    }
  });
}
