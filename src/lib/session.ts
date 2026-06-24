"use client";

import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentReference,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDb } from "./firebase";
import { DEFAULT_PACK_ID } from "./packs";
import type { ReactionDoc, ResponseDoc, RevealMode, Seat, Session } from "./types";

const SESSIONS = "sessions";

function sessionRef(sessionId: string): DocumentReference {
  return doc(getDb(), SESSIONS, sessionId);
}

function responseRef(sessionId: string, qn: number, seat: Seat): DocumentReference {
  return doc(getDb(), SESSIONS, sessionId, "questions", String(qn), "responses", seat);
}

function reactionRef(sessionId: string, qn: number, seat: Seat): DocumentReference {
  return doc(getDb(), SESSIONS, sessionId, "questions", String(qn), "reactions", seat);
}

/** Short, URL-friendly, unguessable-enough session id. */
function makeSessionId(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789"; // no look-alikes
  let id = "";
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  for (const b of bytes) id += alphabet[b % alphabet.length];
  return id;
}

export async function createSession(
  uid: string,
  name: string,
  reveal: RevealMode,
  pack: string = DEFAULT_PACK_ID
): Promise<string> {
  const sessionId = makeSessionId();
  const session: Session = {
    createdAt: serverTimestamp() as unknown as Session["createdAt"],
    status: "waiting",
    settings: { timing: "apart", reveal, pack },
    seatA: {
      uid,
      name: name.trim(),
      joinedAt: serverTimestamp() as unknown as Session["seatA"]["joinedAt"],
      lastAnswered: 0,
      finished: false,
    },
    seatB: { uid: null, name: null, joinedAt: null, lastAnswered: 0, finished: false },
  };
  await setDoc(sessionRef(sessionId), session);
  return sessionId;
}

/**
 * Claim seat B transactionally. Throws "seat-taken" if someone beat us to it.
 * Idempotent if the caller already holds seat B.
 */
export async function claimSeatB(sessionId: string, uid: string, name: string): Promise<void> {
  const ref = sessionRef(sessionId);
  await runTransaction(getDb(), async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("missing");
    const data = snap.data() as Session;
    if (data.seatB.uid && data.seatB.uid !== uid) {
      throw new Error("seat-taken");
    }
    if (data.seatB.uid === uid) return; // already ours
    tx.update(ref, {
      "seatB.uid": uid,
      "seatB.name": name.trim(),
      "seatB.joinedAt": serverTimestamp(),
      status: "active",
    });
  });
}

/** Submit your answer to a question and advance your progress counter. */
export async function submitAnswer(
  sessionId: string,
  seat: Seat,
  qn: number,
  uid: string,
  text: string,
  total: number
): Promise<void> {
  // Write the (immutable) answer doc first.
  const response: ResponseDoc = {
    text: text.trim(),
    at: serverTimestamp() as unknown as ResponseDoc["at"],
    uid,
  };
  await setDoc(responseRef(sessionId, qn, seat), response);

  // Then move our progress pointer forward (and flag finished / complete).
  const finished = qn >= total;
  const seatKey = seat === "a" ? "seatA" : "seatB";
  const updates: Record<string, unknown> = {
    [`${seatKey}.lastAnswered`]: qn,
  };
  if (finished) updates[`${seatKey}.finished`] = true;

  await updateDoc(sessionRef(sessionId), updates);

  if (finished) {
    // If both are now finished, mark the session complete. Re-read to check the
    // partner's flag (our local snapshot may be stale).
    const fresh = await getDoc(sessionRef(sessionId));
    const data = fresh.data() as Session | undefined;
    if (data?.seatA.finished && data?.seatB.finished && data.status !== "complete") {
      await updateDoc(sessionRef(sessionId), { status: "complete" }).catch(() => {});
    }
  }
}

/** Star (or change) which of the partner's answers you want on the keepsake. */
export async function setFavorite(
  sessionId: string,
  seat: Seat,
  qn: number | null
): Promise<void> {
  const seatKey = seat === "a" ? "seatA" : "seatB";
  await updateDoc(sessionRef(sessionId), { [`${seatKey}.favoriteQ`]: qn });
}

/** Heartbeat write so the partner can see "you're here right now". */
export async function touchPresence(sessionId: string, seat: Seat): Promise<void> {
  const seatKey = seat === "a" ? "seatA" : "seatB";
  await updateDoc(sessionRef(sessionId), { [`${seatKey}.lastSeen`]: serverTimestamp() });
}

/** React to your partner's answer (a heart and/or a short note back). */
export async function setReaction(
  sessionId: string,
  qn: number,
  seat: Seat,
  uid: string,
  data: { heart: boolean; note: string }
): Promise<void> {
  const reaction: ReactionDoc = {
    heart: data.heart,
    note: data.note.trim(),
    uid,
    at: serverTimestamp() as unknown as ReactionDoc["at"],
  };
  await setDoc(reactionRef(sessionId, qn, seat), reaction);
}

export async function fetchReaction(
  sessionId: string,
  qn: number,
  seat: Seat
): Promise<ReactionDoc | null> {
  const snap = await getDoc(reactionRef(sessionId, qn, seat));
  return snap.exists() ? (snap.data() as ReactionDoc) : null;
}

/** Keep this seat's presence fresh while the page is open and visible. */
export function usePresence(sessionId: string, seat: Seat | null): void {
  useEffect(() => {
    if (!seat) return;
    const ping = () => {
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        touchPresence(sessionId, seat).catch(() => {});
      }
    };
    ping();
    const iv = setInterval(ping, 30000);
    const onVis = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [sessionId, seat]);
}

/** One-shot read of a session doc (used by the "Your sessions" list). */
export async function fetchSession(sessionId: string): Promise<Session | null> {
  const snap = await getDoc(sessionRef(sessionId));
  return snap.exists() ? (snap.data() as Session) : null;
}

/** Read a single response doc (used on demand for reveals / recap). */
export async function fetchResponse(
  sessionId: string,
  qn: number,
  seat: Seat
): Promise<ResponseDoc | null> {
  const snap = await getDoc(responseRef(sessionId, qn, seat));
  return snap.exists() ? (snap.data() as ResponseDoc) : null;
}

/** Live subscription to a session document. */
export function useSession(sessionId: string | null): {
  session: Session | null;
  exists: boolean | null;
  error: string | null;
} {
  const [session, setSession] = useState<Session | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const unsub = onSnapshot(
      sessionRef(sessionId),
      (snap) => {
        setExists(snap.exists());
        setSession(snap.exists() ? (snap.data() as Session) : null);
        setError(null);
      },
      (e) => setError(String(e?.message ?? e))
    );
    return unsub;
  }, [sessionId]);

  return { session, exists, error };
}
