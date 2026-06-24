"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { firebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { fetchSession } from "@/lib/session";
import { forgetMySession, getMySessions, type MySessionRef } from "@/lib/mySessions";
import { TOTAL_QUESTIONS } from "@/lib/questions";
import type { Seat, Session } from "@/lib/types";

interface Row extends MySessionRef {
  session: Session | null;
}

export function YourSessions() {
  const { uid } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (!firebaseConfigured || !uid) return;
    let active = true;
    const refs = getMySessions();
    if (refs.length === 0) {
      setRows([]);
      return;
    }
    Promise.all(
      refs.map(async (r) => ({ ...r, session: await fetchSession(r.id).catch(() => null) }))
    ).then((loaded) => {
      if (active) setRows(loaded);
    });
    return () => {
      active = false;
    };
  }, [uid]);

  function remove(id: string) {
    forgetMySession(id);
    setRows((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
  }

  // Render nothing until we know there's something to show — keeps the landing
  // clean for first-time visitors.
  if (!rows || rows.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-dusk">
        Your sessions
      </h2>
      <ul className="space-y-2">
        {rows.map((r) => (
          <SessionRow key={r.id} row={r} onRemove={() => remove(r.id)} />
        ))}
      </ul>
    </section>
  );
}

function SessionRow({ row, onRemove }: { row: Row; onRemove: () => void }) {
  const { id, seat, session } = row;
  const status = describe(session, seat);

  return (
    <li className="card flex items-center justify-between gap-3 p-4">
      <Link href={`/s/${id}`} className="min-w-0 flex-1">
        <p className="truncate font-medium">{status.title}</p>
        <p className="mt-0.5 text-sm text-dusk">{status.detail}</p>
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.chipClass}`}>
          {status.chip}
        </span>
        <button
          onClick={onRemove}
          aria-label="Remove from this list"
          title="Remove from this list (doesn't delete the session)"
          className="text-dusk/50 hover:text-ink"
        >
          ✕
        </button>
      </div>
    </li>
  );
}

function describe(session: Session | null, seat: Seat) {
  if (!session) {
    return {
      title: "Session unavailable",
      detail: "Couldn't load this one — it may have been removed.",
      chip: "—",
      chipClass: "bg-ink/5 text-dusk",
    };
  }

  const mine = seat === "a" ? session.seatA : session.seatB;
  const partner = seat === "a" ? session.seatB : session.seatA;
  const partnerName = partner.name ?? "your partner";
  const progress = `You ${mine.lastAnswered}/${TOTAL_QUESTIONS} · ${
    partner.name ?? "—"
  } ${partner.lastAnswered}/${TOTAL_QUESTIONS}`;

  if (partner.uid === null) {
    return {
      title: "Waiting for your partner to join",
      detail: "Open to resend the invite link.",
      chip: "Invite",
      chipClass: "bg-blush/60 text-emberdark",
    };
  }
  if (mine.finished && partner.finished) {
    return {
      title: `You & ${partnerName}`,
      detail: "All 36 answered — open your keepsake.",
      chip: "Done",
      chipClass: "bg-emerald-100 text-emerald-700",
    };
  }
  if (mine.finished) {
    return {
      title: `Waiting on ${partnerName}`,
      detail: progress,
      chip: "Their turn",
      chipClass: "bg-ink/5 text-dusk",
    };
  }
  const yourTurn = mine.lastAnswered <= partner.lastAnswered;
  return {
    title: `You & ${partnerName}`,
    detail: progress,
    chip: yourTurn ? "Your turn" : "Their turn",
    chipClass: yourTurn ? "bg-ember/15 text-ember" : "bg-ink/5 text-dusk",
  };
}
