"use client";

import { useEffect, useState } from "react";
import { fetchResponse } from "@/lib/session";
import type { ResponseDoc, Seat } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Reactions } from "./Reactions";

/**
 * Shows the partner's answer to one question, as a small ceremony: their answer
 * arrives face-down ("tap to read") so opening it feels like receiving
 * something. Reading is rules-gated; we only fetch once unlocked.
 */
export function RevealBlock({
  sessionId,
  qn,
  mySeat,
  partnerSeat,
  partnerName,
  myName,
  myText,
  uid,
}: {
  sessionId: string;
  qn: number;
  mySeat: Seat;
  partnerSeat: Seat;
  partnerName: string;
  myName?: string;
  myText?: string;
  uid: string;
}) {
  const [partner, setPartner] = useState<ResponseDoc | null | undefined>(undefined);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    let active = true;
    fetchResponse(sessionId, qn, partnerSeat).then((r) => {
      if (active) setPartner(r);
    });
    return () => {
      active = false;
    };
  }, [sessionId, qn, partnerSeat]);

  return (
    <div className="space-y-3">
      {myText !== undefined && <Answer who={myName ?? "You"} seat={mySeat} text={myText} mine />}

      {partner === undefined ? (
        <div className="card animate-pulse p-4 text-sm text-dusk">Loading…</div>
      ) : partner === null ? (
        <div className="card p-4 text-sm text-dusk">
          {partnerName} hasn't answered this one yet.
        </div>
      ) : !opened ? (
        <button
          onClick={() => setOpened(true)}
          className="group w-full rounded-2xl border border-ember/30 bg-blush/40 p-5 text-left transition hover:bg-blush/60"
        >
          <div className="flex items-center gap-3">
            <Avatar name={partnerName} seat={partnerSeat} />
            <div>
              <p className="font-medium text-ink">{partnerName} answered.</p>
              <p className="text-sm text-ember">Tap to read their answer →</p>
            </div>
          </div>
        </button>
      ) : (
        <div className="animate-fade-up space-y-2">
          <Answer who={partnerName} seat={partnerSeat} text={partner.text} />
          <Reactions
            sessionId={sessionId}
            qn={qn}
            mySeat={mySeat}
            partnerSeat={partnerSeat}
            uid={uid}
            partnerName={partnerName}
          />
        </div>
      )}
    </div>
  );
}

function Answer({
  who,
  seat,
  text,
  mine = false,
}: {
  who: string;
  seat: Seat;
  text: string;
  mine?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 ${mine ? "bg-ink/5" : "bg-blush/40"}`}>
      <div className="flex items-center gap-2">
        <Avatar name={who} seat={seat} size="sm" />
        <p className="text-xs font-medium uppercase tracking-wide text-dusk">{who}</p>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-ink">{text}</p>
    </div>
  );
}
