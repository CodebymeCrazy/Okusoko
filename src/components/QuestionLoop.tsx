"use client";

import { useEffect, useMemo, useState } from "react";
import { getQuestion, setIntroBefore, TOTAL_QUESTIONS } from "@/lib/questions";
import { submitAnswer } from "@/lib/session";
import { getViewedUpTo, setViewedUpTo } from "@/lib/ledger";
import { nudgeText } from "@/lib/share";
import type { RevealMode, Seat, SeatState } from "@/lib/types";
import { Progress, WhatsAppButton } from "./ui";
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
}: {
  sessionId: string;
  uid: string;
  mySeat: Seat;
  myName: string;
  partnerName: string;
  mine: SeatState;
  partner: SeatState;
  reveal: RevealMode;
}) {
  const partnerSeat: Seat = mySeat === "a" ? "b" : "a";
  const currentN = mine.lastAnswered + 1;
  const question = getQuestion(currentN);
  const intro = setIntroBefore(currentN);

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
      await submitAnswer(sessionId, mySeat, currentN, uid, text);
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

  return (
    <main className="flex flex-1 flex-col">
      <TopBar
        current={Math.min(currentN, TOTAL_QUESTIONS)}
        unread={unread}
        partnerName={partnerName}
        onReview={openReview}
      />

      {justAnswered ? (
        <SubmittedView
          sessionId={sessionId}
          n={justAnswered.n}
          myText={justAnswered.text}
          myName={myName}
          partnerName={partnerName}
          partnerSeat={partnerSeat}
          partnerAnswered={partner.lastAnswered >= justAnswered.n}
          reveal={reveal}
          isLast={justAnswered.n >= TOTAL_QUESTIONS}
          onNext={() => setJustAnswered(null)}
        />
      ) : showIntro && intro ? (
        <SetIntroCard
          intro={intro}
          onContinue={() => setDismissedIntros((s) => new Set(s).add(currentN))}
        />
      ) : question ? (
        <section className="flex flex-1 animate-fade-up flex-col">
          <p className="mt-6 text-sm font-medium uppercase tracking-wide text-ember">
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
          mySeat={mySeat}
          partnerSeat={partnerSeat}
          myName={myName}
          partnerName={partnerName}
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
  unread,
  partnerName,
  onReview,
}: {
  current: number;
  unread: number;
  partnerName: string;
  onReview: () => void;
}) {
  return (
    <div className="sticky top-0 -mx-5 bg-paper/90 px-5 pb-3 pt-1 backdrop-blur">
      <div className="mb-2 flex items-center justify-between text-sm text-dusk">
        <span>
          Question {current} of {TOTAL_QUESTIONS}
        </span>
        {unread > 0 && (
          <button onClick={onReview} className="pill hover:bg-blush">
            {unread} new from {partnerName}
          </button>
        )}
      </div>
      <Progress value={current - 1} total={TOTAL_QUESTIONS} />
    </div>
  );
}

function SubmittedView({
  sessionId,
  n,
  myText,
  myName,
  partnerName,
  partnerSeat,
  partnerAnswered,
  reveal,
  isLast,
  onNext,
}: {
  sessionId: string;
  n: number;
  myText: string;
  myName: string;
  partnerName: string;
  partnerSeat: Seat;
  partnerAnswered: boolean;
  reveal: RevealMode;
  isLast: boolean;
  onNext: () => void;
}) {
  const question = getQuestion(n);
  return (
    <section className="flex flex-1 animate-fade-up flex-col pt-6">
      <p className="text-sm font-medium uppercase tracking-wide text-ember">Question {n}</p>
      <p className="mt-1 font-serif text-xl leading-snug text-dusk">{question?.text}</p>

      <div className="mt-5 flex-1 space-y-3">
        {reveal === "volley" && partnerAnswered ? (
          <RevealBlock
            sessionId={sessionId}
            qn={n}
            partnerSeat={partnerSeat}
            partnerName={partnerName}
            myName={myName}
            myText={myText}
          />
        ) : (
          <>
            <div className="rounded-2xl bg-ink/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-dusk">{myName}</p>
              <p className="mt-1 whitespace-pre-wrap text-ink">{myText}</p>
            </div>
            <div className="card p-4 text-sm text-dusk">
              {reveal === "sealed"
                ? `Answered. Everything reveals once you've both finished all ${TOTAL_QUESTIONS}.`
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
