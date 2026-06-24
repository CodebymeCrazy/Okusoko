"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { DEFAULT_PACK_ID, PACK_LIST, getPack, packTotal } from "@/lib/packs";
import type { RevealMode } from "@/lib/types";

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pack, setPack] = useState<string>(DEFAULT_PACK_ID);
  const [reveal, setReveal] = useState<RevealMode>("volley");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const total = packTotal(getPack(pack));
  const modes: { value: RevealMode; label: string; blurb: string }[] = [
    {
      value: "volley",
      label: "Volley",
      blurb:
        "The moment you answer a question, their answer to it unlocks. A little payoff on every question.",
    },
    {
      value: "sealed",
      label: "Sealed",
      blurb: `You both answer all ${total} blind. Everything reveals at once when you've both finished. One big payoff.`,
    },
  ];

  async function handleCreate() {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    setErr(null);
    try {
      // Firebase loads here, on demand — not on page load.
      const { createSessionFlow } = await import("@/lib/createFlow");
      const id = await createSessionFlow(name, reveal, pack);
      router.push(`/s/${id}`);
    } catch (e) {
      setErr(String((e as Error)?.message ?? e));
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <Link href="/" className="text-sm text-dusk hover:text-ink">
        ← Okusoko
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
        <legend className="text-sm font-medium">Which questions?</legend>
        <div className="mt-3 space-y-3">
          {PACK_LIST.map((p) => {
            const selected = pack === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPack(p.id)}
                aria-pressed={selected}
                className={`card w-full p-4 text-left transition ${
                  selected ? "border-ember ring-2 ring-ember/20" : "hover:border-ink/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-dusk">{packTotal(p)} questions</span>
                </div>
                <p className="mt-1 text-sm text-dusk">{p.tagline}</p>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium">How should answers reveal?</legend>
        <div className="mt-3 space-y-3">
          {modes.map((m) => {
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

      {err && <p className="mt-4 text-sm text-ember">{err}</p>}

      <div className="mt-8">
        <button
          className="btn-primary w-full sm:w-auto"
          disabled={submitting || !name.trim()}
          onClick={handleCreate}
        >
          {submitting ? "Creating…" : "Create session"}
        </button>
      </div>
    </main>
  );
}
