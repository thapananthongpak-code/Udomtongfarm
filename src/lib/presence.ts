// Who has the site open right now, using Supabase Realtime presence. Each open browser tab announces
// itself on one shared channel while the page is visible, with nothing attached to it. The admin
// dashboard counts the announcements. Nothing is stored: when the tab closes, it is gone.

import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const CHANNEL = "site-presence";

let channel: RealtimeChannel | null = null;
let online = 0;
const listeners = new Set<() => void>();
// A random name for this tab. It exists only to tell tabs apart while they are open.
const tabKey = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random());

const notify = () => listeners.forEach((listener) => listener());

/** Starts announcing this tab. Safe to call again. */
export function joinPresence() {
  if (!supabase || channel) return;
  const joined = supabase.channel(CHANNEL, { config: { presence: { key: tabKey } } });
  channel = joined;

  joined
    .on("presence", { event: "sync" }, () => {
      online = Object.keys(joined.presenceState()).length;
      notify();
    })
    .subscribe((status) => {
      if (status === "SUBSCRIBED") void joined.track({ here: true });
    });
}

/** Stops announcing this tab. */
export function leavePresence() {
  if (!supabase || !channel) return;
  void supabase.removeChannel(channel);
  channel = null;
  online = 0;
  notify();
}

export function subscribePresence(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** How many tabs are announcing themselves, this one included. */
export const getOnlineCount = () => online;
