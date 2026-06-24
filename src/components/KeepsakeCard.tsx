"use client";

import { useRef, useState } from "react";

/**
 * A tasteful, screenshot-bait recap card. Rendered as real DOM so we can both
 * show it and export it to a PNG via html2canvas (lazy-loaded on click).
 */
export function KeepsakeCard({
  nameA,
  nameB,
  dateLabel,
}: {
  nameA: string;
  nameB: string;
  dateLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function download() {
    if (!ref.current) return;
    setBusy(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `closer-${nameA}-and-${nameB}.png`.replace(/\s+/g, "-").toLowerCase();
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blush to-paper p-8 text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">奥底 Okusoko</p>
        <p className="mt-8 font-serif text-3xl leading-snug text-ink">
          {nameA} &amp; {nameB}
        </p>
        <p className="mt-3 font-serif text-lg text-dusk">answered all 36 questions.</p>
        <div className="mx-auto mt-6 h-px w-16 bg-ember/40" />
        <p className="mt-6 text-sm text-dusk">{dateLabel}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-dusk/70">
          The 36 questions · Aron, 1997
        </p>
      </div>
      <button className="btn-secondary mt-4" onClick={download} disabled={busy}>
        {busy ? "Saving…" : "Save keepsake image"}
      </button>
    </div>
  );
}
