"use client";

import { useState } from "react";
import { claimSeatB } from "@/lib/session";

export function JoinScreen({
  sessionId,
  uid,
  creatorName,
}: {
  sessionId: string;
  uid: string;
  creatorName: string;
}) {
  const [name, setName] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function join() {
    if (!name.trim() || joining) return;
    setJoining(true);
    setError(null);
    try {
      await claimSeatB(sessionId, uid, name);
      // The session snapshot will update and re-route this screen to the loop.
    } catch (e) {
      const msg = (e as Error)?.message;
      setError(
        msg === "seat-taken"
          ? "Someone already claimed this invite."
          : String(msg ?? e)
      );
      setJoining(false);
      setConfirming(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <p className="pill self-start">You've been invited</p>
      <h1 className="mt-5 font-serif text-3xl leading-snug">
        {creatorName} invited you to answer the 36 questions together.
      </h1>
      <p className="mt-3 text-dusk">
        You'll each answer all 36 — and you can't read {creatorName}'s answer to a question
        until you've written your own. Add your name to join.
      </p>

      <label className="mt-8 block text-sm font-medium" htmlFor="name">
        Your name
      </label>
      <input
        id="name"
        className="field mt-2"
        placeholder="e.g. Sam"
        value={name}
        maxLength={40}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />

      {error && <p className="mt-3 text-sm text-ember">{error}</p>}

      {!confirming ? (
        <button
          className="btn-primary mt-6 self-start"
          disabled={!name.trim()}
          onClick={() => setConfirming(true)}
        >
          Join {creatorName}
        </button>
      ) : (
        <div className="card mt-6 p-5">
          <p className="text-dusk">
            You're joining as {creatorName}'s partner — that's you, right? This seat is
            yours alone once you take it.
          </p>
          <div className="mt-4 flex gap-3">
            <button className="btn-primary" disabled={joining} onClick={join}>
              {joining ? "Joining…" : "Yes, that's me"}
            </button>
            <button
              className="btn-secondary"
              disabled={joining}
              onClick={() => setConfirming(false)}
            >
              Back
            </button>
          </div>
        </div>
      )}

      <p className="mt-auto pt-12 text-xs text-dusk/70">
        Tip: bookmark this page once you're in — it's how you get back to your session.
      </p>
    </main>
  );
}
