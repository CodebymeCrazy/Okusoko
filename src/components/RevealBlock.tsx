"use client";

import { useEffect, useState } from "react";
import { fetchResponse } from "@/lib/session";
import type { ResponseDoc, Seat } from "@/lib/types";

/**
 * Shows the partner's answer to one question. Fetches on demand (the rules let
 * the read through only once the reveal condition is met). Optionally shows the
 * caller's own answer above it for side-by-side context.
 */
export function RevealBlock({
  sessionId,
  qn,
  partnerSeat,
  partnerName,
  myName,
  myText,
}: {
  sessionId: string;
  qn: number;
  partnerSeat: Seat;
  partnerName: string;
  myName?: string;
  myText?: string;
}) {
  const [partner, setPartner] = useState<ResponseDoc | null | undefined>(undefined);

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
      {myText !== undefined && (
        <Answer who={myName ?? "You"} text={myText} mine />
      )}
      {partner === undefined ? (
        <div className="card animate-pulse p-4 text-sm text-dusk">Loading…</div>
      ) : partner === null ? (
        <div className="card p-4 text-sm text-dusk">
          {partnerName} hasn't answered this one yet.
        </div>
      ) : (
        <Answer who={partnerName} text={partner.text} />
      )}
    </div>
  );
}

function Answer({ who, text, mine = false }: { who: string; text: string; mine?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${mine ? "bg-ink/5" : "bg-blush/40"}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-dusk">{who}</p>
      <p className="mt-1 whitespace-pre-wrap text-ink">{text}</p>
    </div>
  );
}
