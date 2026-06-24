"use client";

import type { SetIntro } from "@/lib/questions";

export function SetIntroCard({ intro, onContinue }: { intro: SetIntro; onContinue: () => void }) {
  return (
    <div className="flex flex-1 animate-fade-up flex-col justify-center">
      <p className="pill self-start">Set {romanNumeral(intro.set)}</p>
      <h2 className="mt-4 font-serif text-3xl leading-snug">{intro.title}</h2>
      <p className="mt-4 text-lg text-dusk">{intro.blurb}</p>
      <button className="btn-primary mt-8 self-start" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}

function romanNumeral(n: 1 | 2 | 3): string {
  return n === 1 ? "I" : n === 2 ? "II" : "III";
}
