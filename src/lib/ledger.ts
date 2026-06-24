"use client";

// Tiny localStorage helpers for per-device, per-session UI memory:
// how many reveals the user has already seen (for the unread badge), and
// whether they've dismissed the "bookmark this link" hint.

import type { Seat } from "./types";

function key(sessionId: string, seat: Seat | "x", suffix: string): string {
  return `closer:${sessionId}:${seat}:${suffix}`;
}

export function getViewedUpTo(sessionId: string, seat: Seat): number {
  if (typeof window === "undefined") return 0;
  const v = window.localStorage.getItem(key(sessionId, seat, "viewed"));
  return v ? Number(v) || 0 : 0;
}

export function setViewedUpTo(sessionId: string, seat: Seat, n: number): void {
  if (typeof window === "undefined") return;
  const current = getViewedUpTo(sessionId, seat);
  if (n > current) window.localStorage.setItem(key(sessionId, seat, "viewed"), String(n));
}

export function bookmarkDismissed(sessionId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key(sessionId, "x", "bookmark")) === "1";
}

export function dismissBookmark(sessionId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key(sessionId, "x", "bookmark"), "1");
}
