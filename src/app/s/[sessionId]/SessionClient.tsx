"use client";

import { useEffect } from "react";
import { firebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { useSession } from "@/lib/session";
import { recordMySession } from "@/lib/mySessions";
import { getPack } from "@/lib/packs";
import type { Seat } from "@/lib/types";
import { Spinner } from "@/components/ui";
import { InviteScreen } from "@/components/InviteScreen";
import { JoinScreen } from "@/components/JoinScreen";
import { QuestionLoop } from "@/components/QuestionLoop";
import { Finale } from "@/components/Finale";
import {
  ErrorScreen,
  MissingSession,
  NotConfigured,
  SeatsFull,
  WaitingToFinish,
} from "@/components/StatusScreens";

export function SessionClient({ sessionId }: { sessionId: string }) {
  const { uid, loading: authLoading, error: authError } = useAuth();
  const { session, exists, error: sessionError } = useSession(
    firebaseConfigured ? sessionId : null
  );

  // Remember any session this device holds a seat in, for the "Your sessions" list.
  useEffect(() => {
    if (!uid || !session) return;
    const seat: Seat | null =
      uid === session.seatA.uid ? "a" : uid === session.seatB.uid ? "b" : null;
    if (seat) recordMySession(sessionId, seat);
  }, [uid, session, sessionId]);

  if (!firebaseConfigured) return <NotConfigured />;
  if (authError) return <ErrorScreen message={authError} />;
  if (sessionError) return <ErrorScreen message={sessionError} />;
  if (authLoading || !uid || exists === null) return <Spinner label="Loading…" />;
  if (exists === false || !session) return <MissingSession />;

  const { seatA, seatB } = session;

  // Resolve the caller's relationship to this session from their uid.
  const mySeat: Seat | null =
    uid === seatA.uid ? "a" : uid === seatB.uid ? "b" : null;

  if (mySeat === null) {
    // Not a seat holder. Either the open seat is theirs to claim, or it's full.
    if (seatB.uid === null) {
      return <JoinScreen sessionId={sessionId} uid={uid} creatorName={seatA.name ?? "Someone"} />;
    }
    return <SeatsFull />;
  }

  // Seat A is waiting on an empty seat B.
  if (mySeat === "a" && seatB.uid === null) {
    return <InviteScreen sessionId={sessionId} creatorName={seatA.name ?? "You"} />;
  }

  const mine = mySeat === "a" ? seatA : seatB;
  const partner = mySeat === "a" ? seatB : seatA;
  const myName = mine.name ?? "You";
  const partnerName = partner.name ?? "Your partner";
  const reveal = session.settings.reveal;
  const pack = getPack(session.settings.pack);

  if (mine.finished && partner.finished) {
    return <Finale sessionId={sessionId} session={session} mySeat={mySeat} pack={pack} />;
  }

  if (mine.finished) {
    return (
      <WaitingToFinish
        sessionId={sessionId}
        uid={uid}
        mySeat={mySeat}
        myName={myName}
        partnerName={partnerName}
        mine={mine}
        partner={partner}
        reveal={reveal}
        pack={pack}
      />
    );
  }

  return (
    <QuestionLoop
      sessionId={sessionId}
      uid={uid}
      mySeat={mySeat}
      myName={myName}
      partnerName={partnerName}
      mine={mine}
      partner={partner}
      reveal={reveal}
      pack={pack}
    />
  );
}
