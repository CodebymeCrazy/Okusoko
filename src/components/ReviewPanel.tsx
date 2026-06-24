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
  favoritable = false,
  favoriteQ = null,
  onFavorite,
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
  /** When true, each partner answer shows a star to feature it on the keepsake. */
  favoritable?: boolean;
  favoriteQ?: number | null;
  onFavorite?: (qn: number) => void;
}) {
  const numbers = Array.from({ length: Math.max(0, upTo) }, (_, i) => i + 1);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-ink/40 backdrop-blur-sm">
      <div className="mx-auto my-8 w-full max-w-2xl px-4">
        <div className="card p-5">
          <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-4 flex items-center justify-between rounded-t-2xl border-b border-ink/10 bg-white/95 px-5 py-3 backdrop-blur">
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
                  favoritable={favoritable}
                  isFavorite={favoriteQ === n}
                  onFavorite={onFavorite}
                />
              ))}
            </ol>
          )}
        </div>
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
  favoritable,
  isFavorite,
  onFavorite,
}: {
  sessionId: string;
  n: number;
  mySeat: Seat;
  partnerSeat: Seat;
  myName: string;
  partnerName: string;
  favoritable: boolean;
  isFavorite: boolean;
  onFavorite?: (qn: number) => void;
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
        <Bubble
          who={partnerName}
          text={theirs?.text}
          star={
            favoritable && theirs?.text
              ? { active: isFavorite, onClick: () => onFavorite?.(n) }
              : undefined
          }
        />
      </div>
    </li>
  );
}

function Bubble({
  who,
  text,
  mine = false,
  star,
}: {
  who: string;
  text?: string;
  mine?: boolean;
  star?: { active: boolean; onClick: () => void };
}) {
  return (
    <div
      className={`rounded-2xl p-3 ${mine ? "bg-ink/5" : "bg-blush/40"} ${
        star?.active ? "ring-2 ring-ember" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-dusk">{who}</p>
        {star && (
          <button
            onClick={star.onClick}
            aria-pressed={star.active}
            aria-label={star.active ? "Remove favorite" : "Feature this on the keepsake"}
            className={`text-lg leading-none transition ${
              star.active ? "text-ember" : "text-dusk/40 hover:text-ember"
            }`}
          >
            {star.active ? "★" : "☆"}
          </button>
        )}
      </div>
      <p className="mt-1 whitespace-pre-wrap text-ink">{text ?? "—"}</p>
    </div>
  );
}
