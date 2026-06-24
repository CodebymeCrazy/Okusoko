"use client";

import { useEffect, useState } from "react";
import { spreadText } from "@/lib/share";
import { fetchResponse, setFavorite } from "@/lib/session";
import { TOTAL_QUESTIONS } from "@/lib/questions";
import type { ResponseDoc, Seat, Session } from "@/lib/types";
import { KeepsakeCard } from "./KeepsakeCard";
import { ReviewPanel } from "./ReviewPanel";
import { WhatsAppButton } from "./ui";

/**
 * Shown to both people once both have finished. The keepsake is the real
 * ending; the eye-contact note is a gentle, do-it-yourselves suggestion; the
 * side-by-side review reads all 36 (partner reads are unlocked for both modes
 * once both are finished). Reveal mode only changes the framing.
 */
export function Finale({
  sessionId,
  session,
  mySeat,
}: {
  sessionId: string;
  session: Session;
  mySeat: Seat;
}) {
  const partnerSeat: Seat = mySeat === "a" ? "b" : "a";
  const myName = (mySeat === "a" ? session.seatA.name : session.seatB.name) ?? "You";
  const partnerName =
    (partnerSeat === "a" ? session.seatA.name : session.seatB.name) ?? "Your partner";
  const sealed = session.settings.reveal === "sealed";

  const [showAll, setShowAll] = useState(false);
  const [favoritePicker, setFavoritePicker] = useState(false);
  const dateLabel = formatDate(session.createdAt?.toDate?.() ?? new Date());

  // The answer I starred (my partner's) — featured on the keepsake.
  const mine = mySeat === "a" ? session.seatA : session.seatB;
  const favoriteQ = mine.favoriteQ ?? null;
  const [favoriteText, setFavoriteText] = useState<string | null>(null);
  useEffect(() => {
    if (!favoriteQ) {
      setFavoriteText(null);
      return;
    }
    let active = true;
    fetchResponse(sessionId, favoriteQ, partnerSeat).then((r: ResponseDoc | null) => {
      if (active) setFavoriteText(r?.text ?? null);
    });
    return () => {
      active = false;
    };
  }, [sessionId, favoriteQ, partnerSeat]);

  async function chooseFavorite(qn: number) {
    await setFavorite(sessionId, mySeat, favoriteQ === qn ? null : qn);
  }

  return (
    <main className="flex flex-1 flex-col">
      <p className="pill self-start">You both made it</p>
      <h1 className="mt-5 font-serif text-3xl leading-snug">
        {sealed
          ? `All 36, answered blind. Here's everything, ${myName}.`
          : `You and ${partnerName} answered all ${TOTAL_QUESTIONS}.`}
      </h1>

      <div className="mt-8">
        <KeepsakeCard
          nameA={session.seatA.name ?? "—"}
          nameB={session.seatB.name ?? "—"}
          dateLabel={dateLabel}
          favorite={
            favoriteQ && favoriteText
              ? { author: partnerName, question: favoriteQ, text: favoriteText }
              : undefined
          }
        />
      </div>

      <section className="card mt-8 p-5">
        <h2 className="font-serif text-xl">Feature an answer on your keepsake</h2>
        <p className="mt-2 text-dusk">
          {favoriteQ
            ? `You starred ${partnerName}'s answer to Question ${favoriteQ}.`
            : `Pick the one of ${partnerName}'s answers that stayed with you — it'll be highlighted on your card.`}
        </p>
        <button className="btn-secondary mt-3" onClick={() => setFavoritePicker(true)}>
          {favoriteQ ? "Change your pick" : "Choose a favorite"}
        </button>
      </section>

      <button className="btn-primary mt-8 self-start" onClick={() => setShowAll(true)}>
        {sealed ? "Read everything, side by side" : "Reread all 36 together"}
      </button>

      <section className="card mt-8 p-5">
        <h2 className="font-serif text-xl">One more thing, when you're together</h2>
        <p className="mt-2 text-dusk">
          Aron's study ended with four minutes of unbroken eye contact. Next time you're in
          the same room — or on a video call — try it. We don't host it; it's just the
          ending the research suggests.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl">Pass it on</h2>
        <p className="mt-2 text-dusk">
          Know two people who should do this? Send them Okusoko.
        </p>
        <div className="mt-3">
          <WhatsAppButton text={spreadText()}>Share Okusoko</WhatsAppButton>
        </div>
      </section>

      {showAll && (
        <ReviewPanel
          sessionId={sessionId}
          mySeat={mySeat}
          partnerSeat={partnerSeat}
          myName={myName}
          partnerName={partnerName}
          upTo={TOTAL_QUESTIONS}
          title="All 36, together"
          onClose={() => setShowAll(false)}
        />
      )}

      {favoritePicker && (
        <ReviewPanel
          sessionId={sessionId}
          mySeat={mySeat}
          partnerSeat={partnerSeat}
          myName={myName}
          partnerName={partnerName}
          upTo={TOTAL_QUESTIONS}
          title={`Star one of ${partnerName}'s answers`}
          onClose={() => setFavoritePicker(false)}
          favoritable
          favoriteQ={favoriteQ}
          onFavorite={chooseFavorite}
        />
      )}
    </main>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
