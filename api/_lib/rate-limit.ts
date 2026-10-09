import { CHAT_LIMITS } from "../../src/lib/chat-limits.js";

// Recent request times per visitor address. This lives in memory, so it is counted
// separately on each server instance and resets when one restarts. It slows down
// casual overuse; a spending limit on the Google account is the real backstop.
const recent = new Map<string, number[]>();

export function isRateLimited(address: string, now = Date.now()): boolean {
  const cutoff = now - CHAT_LIMITS.windowMs;
  const times = (recent.get(address) ?? []).filter((time) => time > cutoff);

  if (times.length >= CHAT_LIMITS.requests) {
    recent.set(address, times);
    return true;
  }

  times.push(now);
  recent.set(address, times);

  // Forget addresses that have gone quiet, so the map cannot grow without bound.
  if (recent.size > 5000) {
    for (const [key, value] of recent) if (value.every((time) => time <= cutoff)) recent.delete(key);
  }
  return false;
}
