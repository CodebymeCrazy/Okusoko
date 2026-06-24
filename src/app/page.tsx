import Link from "next/link";
import { YourSessions } from "@/components/YourSessions";
import { InstallHint } from "@/components/InstallHint";

const STEPS = [
  {
    title: "Both of you answer every question",
    body: "36 questions, three escalating sets. No skipping — the depth is the whole point.",
  },
  {
    title: "You can't peek",
    body: "You only unlock their answer to a question once you've written your own. Reciprocity, enforced.",
  },
  {
    title: "At your own pace",
    body: "No login, no scheduling. Answer some now, the rest tonight. It waits for both of you.",
  },
];

export default function Landing() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="mb-6">
        <p className="pill">奥底 · Okusoko</p>
      </header>

      <YourSessions />
      <InstallHint />

      <section className="mt-6 animate-fade-up">
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
          The 36 questions that make strangers fall in love — answered together.
        </h1>
        <p className="mt-4 text-base text-dusk">
          <span className="font-serif text-ink">奥底 (okusoko)</span> — the innermost
          depths; the very bottom of the heart. The part of someone almost no one reaches.
          That's where these questions take you.
        </p>
        <p className="mt-5 text-lg text-dusk">
          In 1997, the psychologist Arthur Aron showed that escalating, reciprocal
          self-disclosure can create remarkable closeness between two people — in about
          45 minutes. This is that study, built for two phones instead of one room.
        </p>
      </section>

      <ul className="mt-8 space-y-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="card flex gap-4 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember/10 font-serif text-lg text-ember">
              {i + 1}
            </span>
            <div>
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-1 text-sm text-dusk">{s.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link href="/create" className="btn-primary w-full sm:w-auto">
          Start
        </Link>
        <p className="mt-3 text-sm text-dusk">
          You'll get a private link to send to one person. Takes ~45 minutes, spread over
          as long as you like.
        </p>
      </div>

      <footer className="mt-auto pt-12 text-xs text-dusk/70">
        Based on Aron et al., “The Experimental Generation of Interpersonal Closeness”
        (1997). Okusoko hosts the questions; the depths are yours.
      </footer>
    </main>
  );
}
