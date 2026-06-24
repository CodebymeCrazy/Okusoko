"use client";

import { useEffect, useState } from "react";
import { fetchReaction, setReaction } from "@/lib/session";
import type { ReactionDoc, Seat } from "@/lib/types";

/**
 * Leave a heart and/or a one-line note on your partner's answer — and see what
 * they left on yours. Turns two parallel monologues into a quiet exchange.
 */
export function Reactions({
  sessionId,
  qn,
  mySeat,
  partnerSeat,
  uid,
  partnerName,
}: {
  sessionId: string;
  qn: number;
  mySeat: Seat;
  partnerSeat: Seat;
  uid: string;
  partnerName: string;
}) {
  const [heart, setHeart] = useState(false);
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [theirs, setTheirs] = useState<ReactionDoc | null>(null);

  useEffect(() => {
    let active = true;
    fetchReaction(sessionId, qn, mySeat).then((r) => {
      if (!active || !r) return;
      setHeart(r.heart);
      setNote(r.note ?? "");
    });
    fetchReaction(sessionId, qn, partnerSeat).then((r) => {
      if (active) setTheirs(r);
    });
    return () => {
      active = false;
    };
  }, [sessionId, qn, mySeat, partnerSeat]);

  function persist(next: { heart: boolean; note: string }) {
    setReaction(sessionId, qn, mySeat, uid, next).catch(() => {});
  }

  function toggleHeart() {
    const next = !heart;
    setHeart(next);
    persist({ heart: next, note });
  }

  function saveNote() {
    setEditing(false);
    persist({ heart, note });
  }

  const theirNote = theirs?.note?.trim();
  const theyReacted = theirs && (theirs.heart || theirNote);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={toggleHeart}
          aria-pressed={heart}
          aria-label={heart ? "Remove heart" : `Heart ${partnerName}'s answer`}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm transition ${
            heart ? "bg-ember/15 text-ember" : "text-dusk/60 hover:text-ember"
          }`}
        >
          <span>{heart ? "❤️" : "🤍"}</span>
        </button>
        {!editing && !note && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-dusk/70 hover:text-ink"
          >
            Reply to {partnerName}…
          </button>
        )}
        {!editing && note && (
          <button
            onClick={() => setEditing(true)}
            className="rounded-full bg-ember/10 px-3 py-1 text-sm text-ink"
          >
            “{note}” <span className="text-dusk/60">· edit</span>
          </button>
        )}
      </div>

      {editing && (
        <div className="flex items-center gap-2">
          <input
            className="field py-2 text-sm"
            placeholder={`A few words back to ${partnerName}…`}
            value={note}
            maxLength={140}
            autoFocus
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveNote();
            }}
          />
          <button className="btn-primary px-4 py-2 text-sm" onClick={saveNote}>
            Save
          </button>
        </div>
      )}

      {theyReacted && (
        <p className="text-sm text-dusk">
          {theirs?.heart && <span className="mr-1">❤️</span>}
          {theirNote && (
            <span>
              {partnerName}: <span className="text-ink">“{theirNote}”</span>
            </span>
          )}
          {!theirNote && <span>{partnerName} hearted your answer</span>}
        </p>
      )}
    </div>
  );
}
