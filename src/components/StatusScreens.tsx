"use client";

import Link from "next/link";
import { useState } from "react";
import { nudgeText } from "@/lib/share";
import { packTotal, type QuestionPack } from "@/lib/packs";
import type { RevealMode, Seat, SeatState } from "@/lib/types";
import { WhatsAppButton } from "./ui";
import { ReviewPanel } from "./ReviewPanel";

export function NotConfigured() {
  return (
    <Centered title="Not configured yet">
      <p className="text-dusk">
        This deployment is missing its Firebase keys. Copy{" "}
        <code className="rounded bg-ink/5 px-1">.env.local.example</code> to{" "}
        <code className="rounded bg-ink/5 px-1">.env.local</code> and fill them in.
      </p>
    </Centered>
  );
}

export function MissingSession() {
  return (
    <Centered title="We couldn't find that session">
      <p className="text-dusk">
        The link may be mistyped, or the session was never created.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Start a new one
      </Link>
    </Centered>
  );
}

export function SeatsFull() {
  return (
    <Centered title="This invite's already been claimed">
      <p className="text-dusk">
        Both seats in this session are taken. If you're meant to be in it, open the link on
        the same device you joined from — there's no login to recover it.
      </p>
      <Link href="/" className="btn-secondary mt-6">
        Start your own
      </Link>
    </Centered>
  );
}

export function ErrorScreen({ message }: { message: string }) {
  return (
    <Centered title="Something went wrong">
      <p className="text-dusk">{message}</p>
      <Link href="/" className="btn-secondary mt-6">
        Back to start
      </Link>
    </Centered>
  );
}

/** You've answered everything; your partner hasn't finished yet. */
export function WaitingToFinish({
  sessionId,
  uid,
  mySeat,
  myName,
  partnerName,
  mine,
  partner,
  reveal,
  pack,
}: {
  sessionId: string;
  uid: string;
  mySeat: Seat;
  myName: string;
  partnerName: string;
  mine: SeatState;
  partner: SeatState;
  reveal: RevealMode;
  pack: QuestionPack;
}) {
  const total = packTotal(pack);
  const partnerSeat: Seat = mySeat === "a" ? "b" : "a";
  const [showReview, setShowReview] = useState(false);
  const revealable = Math.min(mine.lastAnswered, partner.lastAnswered);

  return (
    <main className="flex flex-1 flex-col">
      <p className="pill self-start">You're done</p>
      <h1 className="mt-5 font-serif text-3xl leading-snug">
        All {total} answered. Now it's on {partnerName}.
      </h1>
      <p className="mt-3 text-dusk">
        {partnerName} is on question {Math.min(partner.lastAnswered + 1, total)} of {total}.{" "}
        {reveal === "sealed"
          ? "Everything reveals at once the moment they finish."
          : "Their last answers will reveal as soon as they catch up."}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <WhatsAppButton text={nudgeText(myName, mine.lastAnswered, sessionId)}>
          Nudge {partnerName}
        </WhatsAppButton>
        {reveal === "volley" && revealable > 0 && (
          <button className="btn-secondary" onClick={() => setShowReview(true)}>
            Reread your answers so far
          </button>
        )}
      </div>

      {showReview && (
        <ReviewPanel
          sessionId={sessionId}
          uid={uid}
          mySeat={mySeat}
          partnerSeat={partnerSeat}
          myName={myName}
          partnerName={partnerName}
          pack={pack}
          upTo={revealable}
          title={`You & ${partnerName} so far`}
          onClose={() => setShowReview(false)}
        />
      )}
    </main>
  );
}

function Centered({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center">
      <h1 className="font-serif text-3xl">{title}</h1>
      <div className="mt-3 flex flex-col items-center">{children}</div>
    </main>
  );
}
