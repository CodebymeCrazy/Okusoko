import type { Timestamp } from "firebase/firestore";
import type { Seat } from "./types";

/** Up-to-two-letter initials for an avatar. */
export function initials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Distinct (but warm, on-palette) colours for the two seats. */
export function seatColor(seat: Seat): { bg: string; ring: string } {
  return seat === "a"
    ? { bg: "bg-ember text-paper", ring: "ring-ember" }
    : { bg: "bg-dusk text-paper", ring: "ring-dusk" };
}

const ACTIVE_WINDOW_MS = 60_000;

export function isActive(lastSeen: Timestamp | null | undefined): boolean {
  if (!lastSeen?.toMillis) return false;
  return Date.now() - lastSeen.toMillis() < ACTIVE_WINDOW_MS;
}

/** Warm, human relative time: "just now", "5m ago", "yesterday". */
export function relativeTime(ts: Timestamp | null | undefined): string | null {
  if (!ts?.toMillis) return null;
  const diff = Date.now() - ts.toMillis();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}
