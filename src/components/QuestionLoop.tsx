"use client";

import { useEffect, useMemo, useState } from "react";
import { getQuestionIn, packTotal, setIntroBeforeIn, type QuestionPack } from "@/lib/packs";
import { submitAnswer } from "@/lib/session";
import { getViewedUpTo, setViewedUpTo } from "@/lib/ledger";
import { nudgeText } from "@/lib/share";
import { setTheme } from "@/lib/setTheme";
import { isActive } from "@/lib/people";
import type { RevealMode, Seat, SeatState } from "@/lib/types";
import { Progress, WhatsAppButton } from "./ui";
import { Pair } from "./Avatar";
import { SetIntroCard } from "./SetIntroCard";
import { RevealBlock } from "./RevealBlock";
import { ReviewPanel } from "./ReviewPanel";

export function QuestionLoop({
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
  const currentN = mine.lastAnswered + 1;
  const question = getQuestionIn(pack, currentN);
  const intro = setIntroBeforeIn(pack, currentN);

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justAnswered, setJustAnswered] = useState<{ n: number; text: string } | null>(null);
  const [dismissedIntros, setDismissedIntros] = useState<Set<number>>(new Set());
  const [showReview, setShowReview] = useState(false);

  // Volley: questions both have answered are revealable. Track how many the user
  // has already seen for the unread badge.
  const revealable = Math.min(mine.lastAnswered, partner.lastAnswered);
  const [viewedUpTo, setViewed] = useState(0);
  useEffect(() => {
    setViewed(getViewedUpTo(sessionId, mySeat));
  }, [sessionId, mySeat]);
  const unread = reveal === "volley" ? Math.max(0, revealable - viewedUpTo) : 0;

  const showIntro = useMemo(
    () => Boolean(intro) && !dismissedIntros.has(currentN),
    [intro, dismissedIntros, currentN]
  );

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitAnswer(sessionId, mySeat, currentN, uid, text, total);
      setJustAnswered({ n: currentN, text: text.trim() });
      setText("");
    } catch (e) {
      setError(String((e as Error)?.message ?? e));
    } finally {
      setSubmitting(false);
    }
  }

  function openReview() {
    setViewedUpTo(sessionId, mySeat, revealable);
    setViewed(revealable);
    setShowReview(true);
  }

  const iAmAhead = mine.lastAnswered > partner.lastAnswered;

  // The screen deepens with each set. Track the set of whatever's on screen.
  const displaySet =
    (justAnswered ? getQuestionIn(pack, justAnswered.n)?.set : question?.set) ?? intro?.set ?? 1;
  const theme = setTheme(displaySet);

  const seatA = mySeat === "a" ? mine : partner;
  const seatB = mySeat === "a" ? partner : mine;
  const activeSeat = isActive(partner.lastSeen) ? partnerSeat : isActive(mine.lastSeen) ? mySeat : null;

  return (
    <main className="flex flex-1 flex-col">
      <div aria-hidden className={`fixed inset-0 -z-10 ${theme.backdrop}`} />
      <TopBar
        current={Math.min(currentN, total)}
        total={total}
        unread={unread}
        partnerName={partnerName}
        partnerActive={isActive(partner.lastSeen)}
        aName={seatA.name}
        bName={seatB.name}
        activeSeat={activeSeat}
        onReview={openReview}
      />

      {justAnswered ? (
        <SubmittedView
          sessionId={sessionId}
          uid={uid}
          n={justAnswered.n}
          myText={justAnswered.text}
          myName={myName}
          partnerName={partnerName}
          mySeat={mySeat}
          partnerSeat={partnerSeat}
          partnerAnswered={partner.lastAnswered >= justAnswered.n}
          reveal={reveal}
          pack={pack}
          total={total}
          isLast={justAnswered.n >= total}
          onNext={() => setJustAnswered(null)}
        />
      ) : showIntro && intro ? (
        <SetIntroCard
          intro={intro}
          onContinue={() => setDismissedIntros((s) => new Set(s).add(currentN))}
        />
      ) : question ? (
        <section className="flex flex-1 animate-fade-up flex-col">
          <p className={`mt-6 text-sm font-medium uppercase tracking-wide ${theme.accent}`}>
            Set {roman(question.set)}
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-snug">{question.text}</h1>
          <textarea
            className="field mt-6 min-h-[140px] flex-1 resize-none"
            placeholder="Take your time…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          {error && <p className="mt-3 text-sm text-ember">{error}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!text.trim() || submitting}
            >
              {submitting ? "Submitting…" : "Submit answer"}
            </button>
            {iAmAhead && (
              <WhatsAppButton
                className="px-4 py-2 text-sm"
                text={nudgeText(myName, mine.lastAnswered, sessionId)}
              >
                Nudge {partnerName}
              </WhatsAppButton>
            )}
          </div>
          <p className="mt-3 text-xs text-dusk">
            Once you submit, your answer locks — no edits after you've seen theirs.
          </p>
        </section>
      ) : null}

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

function TopBar({
  current,
  total,
  unread,
  partnerName,
  partnerActive,
  aName,
  bName,
  activeSeat,
  onReview,
}: {
  current: number;
  total: number;
  unread: number;
  partnerName: string;
  partnerActive: boolean;
  aName: string | null;
  bName: string | null;
  activeSeat: Seat | null;
  onReview: () => void;
}) {
  return (
    <div className="sticky top-0 -mx-5 bg-white/30 px-5 pb-3 pt-1 backdrop-blur">
      <div className="mb-2 flex items-center justify-between text-sm text-dusk">
        <div className="flex items-center gap-2">
          <Pair aName={aName} bName={bName} activeSeat={activeSeat} />
          <span>
            {partnerActive ? (
              <span className="text-emerald-600">{partnerName} is here</span>
            ) : (
              <>
                Question {current} of {total}
              </>
            )}
          </span>
        </div>
        {unread > 0 && (
          <button onClick={onReview} className="pill hover:bg-blush">
            {unread} new from {partnerName}
          </button>
        )}
      </div>
      <Progress value={current - 1} total={total} />
    </div>
  );
}

function SubmittedView({
  sessionId,
  uid,
  n,
  myText,
  myName,
  partnerName,
  mySeat,
  partnerSeat,
  partnerAnswered,
  reveal,
  pack,
  total,
  isLast,
  onNext,
}: {
  sessionId: string;
  uid: string;
  n: number;
  myText: string;
  myName: string;
  partnerName: string;
  mySeat: Seat;
  partnerSeat: Seat;
  partnerAnswered: boolean;
  reveal: RevealMode;
  pack: QuestionPack;
  total: number;
  isLast: boolean;
  onNext: () => void;
}) {
  const question = getQuestionIn(pack, n);
  return (
    <section className="flex flex-1 animate-fade-up flex-col pt-6">
      <p className="text-sm font-medium uppercase tracking-wide text-ember">Question {n}</p>
      <p className="mt-1 font-serif text-xl leading-snug text-dusk">{question?.text}</p>

      <div className="mt-5 flex-1 space-y-3">
        {reveal === "volley" && partnerAnswered ? (
          <RevealBlock
            sessionId={sessionId}
            qn={n}
            mySeat={mySeat}
            partnerSeat={partnerSeat}
            partnerName={partnerName}
            myName={myName}
            myText={myText}
            uid={uid}
          />
        ) : (
          <>
            <div className="rounded-2xl bg-ink/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-dusk">{myName}</p>
              <p className="mt-1 whitespace-pre-wrap text-ink">{myText}</p>
            </div>
            <div className="card p-4 text-sm text-dusk">
              {reveal === "sealed"
                ? `Answered. Everything reveals once you've both finished all ${total}.`
                : `Answered. Waiting for ${partnerName} on this one — it'll fill in when they reach it.`}
            </div>
          </>
        )}
      </div>

      <button className="btn-primary mt-6 self-start" onClick={onNext}>
        {isLast ? "Finish" : "Next question"}
      </button>
    </section>
  );
}

function roman(n: 1 | 2 | 3): string {
  return n === 1 ? "I" : n === 2 ? "II" : "III";
}
