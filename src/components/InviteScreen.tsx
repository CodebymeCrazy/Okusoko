"use client";

import { inviteText, sessionUrl } from "@/lib/share";
import { CopyLinkButton, WhatsAppButton } from "./ui";

export function InviteScreen({
  sessionId,
  creatorName,
}: {
  sessionId: string;
  creatorName: string;
}) {
  const url = sessionUrl(sessionId);
  return (
    <main className="flex flex-1 flex-col">
      <p className="pill self-start">Waiting for your partner</p>
      <h1 className="mt-5 font-serif text-3xl leading-snug">
        Send this to the one person you're doing this with.
      </h1>
      <p className="mt-3 text-dusk">
        They open the link, add their name, and you're both in. You can start whenever —
        it'll be here when they arrive.
      </p>

      <div className="card mt-8 space-y-3 p-5">
        <div className="rounded-xl bg-ink/5 px-4 py-3 text-sm break-all text-dusk">{url}</div>
        <div className="flex flex-wrap gap-3">
          <WhatsAppButton text={inviteText(creatorName, sessionId)}>
            Invite on WhatsApp
          </WhatsAppButton>
          <CopyLinkButton url={url} />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 text-dusk">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ember" />
        <span className="text-sm">Waiting for your partner to join…</span>
      </div>

      <p className="mt-auto pt-12 text-xs text-dusk/70">
        Tip: bookmark this page. It's how you get back into your session — there's no
        login to fall back on.
      </p>
    </main>
  );
}
