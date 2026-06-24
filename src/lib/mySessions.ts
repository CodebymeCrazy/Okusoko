"use client";

// Device-local memory of the sessions this person has created or joined. There's
// no login in v1, so this list lives in localStorage — it powers the "Your
// sessions" view on the home page. The sessions themselves live in Firestore;
// this is just a convenience index so you don't have to bookmark every link.

import type { Seat } from "./types";

const KEY = "okusoko:my-sessions";

export interface MySessionRef {
  id: string;
  seat: Seat;
  /** ms epoch when first recorded — for sorting newest first. */
  savedAt: number;
}

export function getMySessions(): MySessionRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as MySessionRef[]) : [];
    return list.sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
}

export function recordMySession(id: string, seat: Seat): void {
  if (typeof window === "undefined") return;
  const list = getMySessions();
  const existing = list.find((s) => s.id === id);
  if (existing) {
    existing.seat = seat; // keep seat in sync if it resolved later
  } else {
    list.push({ id, seat, savedAt: Date.now() });
  }
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function forgetMySession(id: string): void {
  if (typeof window === "undefined") return;
  const list = getMySessions().filter((s) => s.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(list));
}
