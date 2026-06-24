"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { createSession } from "@/lib/session";
import type { RevealMode } from "@/lib/types";

const MODES: { value: RevealMode; label: string; blurb: string }[] = [
  {
    value: "volley",
    label: "Volley",
    blurb:
      "The moment you answer a question, their answer to it unlocks. A little payoff on every question.",
  },
  {
    value: "sealed",
    label: "Sealed",
    blurb:
      "You both answer all 36 blind. Everything reveals at once when you've both finished. One big payoff.",
  },
];

export default function CreatePage() {
  const router = useRouter();
  const { uid, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [reveal, setReveal] = useState<RevealMode>("volley");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleCreate() {
    if (!uid || !name.trim()) return;
    setSubmitting(true);
    setErr(null);
    try {
      const id = await createSession(uid, name, reveal);
      router.push(`/s/${id}`);
    } catch (e) {
      setErr(String((e as Error)?.message ?? e));
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <Link href="/" className="text-sm text-dusk hover:text-ink">
        ← Closer
      </Link>

      <h1 className="mt-6 font-serif text-3xl">Start a session</h1>
      <p className="mt-2 text-dusk">
        You're seat one. You'll get a link to send to the other person.
      </p>

      <label className="mt-8 block text-sm font-medium" htmlFor="name">
        Your name
      </label>
      <input
        id="name"
        className="field mt-2"
        placeholder="e.g. Alex"
        value={name}
        maxLength={40}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />

      <fieldset className="mt-8">
        <legend className="text-sm font-medium">How should answers reveal?</legend>
        <div className="mt-3 space-y-3">
          {MODES.map((m) => {
            const selected = reveal === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setReveal(m.value)}
                aria-pressed={selected}
                className={`card w-full p-4 text-left transition ${
                  selected ? "border-ember ring-2 ring-ember/20" : "hover:border-ink/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.label}</span>
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      selected ? "border-ember bg-ember" : "border-ink/30"
                    }`}
                  />
                </div>
                <p className="mt-1 text-sm text-dusk">{m.blurb}</p>
              </button>
            );
          })}
        </div>
      </fieldset>

      {(err || error) && (
        <p className="mt-4 text-sm text-ember">{err ?? error}</p>
      )}

      <div className="mt-8">
        <button
          className="btn-primary w-full sm:w-auto"
          disabled={loading || submitting || !name.trim() || !uid}
          onClick={handleCreate}
        >
          {submitting ? "Creating…" : "Create session"}
        </button>
      </div>
    </main>
  );
}
