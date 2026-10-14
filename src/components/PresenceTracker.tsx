import { useEffect } from "react";
import { joinPresence, leavePresence } from "@/lib/presence";
import { countVisitOncePerDay } from "@/lib/visits";
import { useSession } from "@/state/session";

/**
 * Counts this browser for today, and announces the tab as "here" while the page is visible.
 * It draws nothing. Admins are not counted, so that their own work does not inflate the numbers.
 */
export default function PresenceTracker() {
  const { status, profile } = useSession();
  const isAdmin = profile?.role === "admin";
  const ready = status !== "loading";

  useEffect(() => {
    if (ready && !isAdmin) countVisitOncePerDay();
  }, [ready, isAdmin]);

  useEffect(() => {
    // An admin's tab announces itself too, because the dashboard needs the connection to listen.
    // The dashboard takes its own tab off the count.
    const sync = () => (document.visibilityState === "visible" ? joinPresence() : leavePresence());
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      leavePresence();
    };
  }, []);

  return null;
}
