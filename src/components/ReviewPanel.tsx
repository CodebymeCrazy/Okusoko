"use client";

import { useEffect, useState } from "react";
import { fetchResponse } from "@/lib/session";
import { getQuestion } from "@/lib/questions";
import type { ResponseDoc, Seat } from "@/lib/types";

/**
 * Overlay listing every question both people have answered, my answer beside
 * theirs. Used for the volley "unread reveals" review and as the finale recap.
 */
export function ReviewPanel({
  sessionId,
  mySeat,
  partnerSeat,
  myName,
  partnerName,
  upTo,
  title,
  onClose,
}: {
  sessionId: string;
  mySeat: Seat;
  partnerSeat: Seat;
  myName: string;
  partnerName: string;
  /** Highest question number revealable to the caller. */
  upTo: number;
  title: string;
  onClose: () => void;
}) {
  const numbers = Array.from({ length: Math.max(0, upTo) }, (_, i) => i + 1);
  return (
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm">
      <div className="card my-8 h-fit w-full max-w-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">{title}</h2>
          <button onClick={onClose} className="btn-secondary px-4 py-2 text-sm">
            Close
          </button>
        </div>
        {numbers.length === 0 ? (
          <p className="text-dusk">Nothing to review yet.</p>
        ) : (
          <ol className="space-y-6">
            {numbers.map((n) => (
              <ReviewRow
                key={n}
                sessionId={sessionId}
                n={n}
                mySeat={mySeat}
                partnerSeat={partnerSeat}
                myName={myName}
                partnerName={partnerName}
              />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function ReviewRow({
  sessionId,
  n,
  mySeat,
  partnerSeat,
  myName,
  partnerName,
}: {
  sessionId: string;
  n: number;
  mySeat: Seat;
  partnerSeat: Seat;
  myName: string;
  partnerName: string;
}) {
  const [mine, setMine] = useState<ResponseDoc | null>(null);
  const [theirs, setTheirs] = useState<ResponseDoc | null>(null);
  const question = getQuestion(n);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchResponse(sessionId, n, mySeat),
      fetchResponse(sessionId, n, partnerSeat),
    ]).then(([m, t]) => {
      if (!active) return;
      setMine(m);
      setTheirs(t);
    });
    return () => {
      active = false;
    };
  }, [sessionId, n, mySeat, partnerSeat]);

  return (
    <li className="border-b border-ink/10 pb-6 last:border-0">
      <p className="text-xs font-medium uppercase tracking-wide text-ember">Question {n}</p>
      <p className="mt-1 font-serif text-lg leading-snug">{question?.text}</p>
      <div className="mt-3 space-y-2">
        <Bubble who={myName} text={mine?.text} mine />
        <Bubble who={partnerName} text={theirs?.text} />
      </div>
    </li>
  );
}

function Bubble({ who, text, mine = false }: { who: string; text?: string; mine?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 ${mine ? "bg-ink/5" : "bg-blush/40"}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-dusk">{who}</p>
      <p className="mt-1 whitespace-pre-wrap text-ink">{text ?? "—"}</p>
    </div>
  );
}
