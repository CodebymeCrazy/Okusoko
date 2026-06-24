"use client";

/** Base URL for share links — env override, else the current origin. */
export function baseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function sessionUrl(sessionId: string): string {
  return `${baseUrl()}/s/${sessionId}`;
}

/** wa.me deep link with pre-filled text. Works inside and outside WhatsApp. */
export function whatsappLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function inviteText(creatorName: string, sessionId: string): string {
  return `I started the 36 questions on Closer 👀 answer them with me → ${sessionUrl(sessionId)}`;
}

export function nudgeText(myName: string, count: number, sessionId: string): string {
  return `I just answered ${count} on Closer — your turn 👀 → ${sessionUrl(sessionId)}`;
}

export function spreadText(): string {
  return `The 36 questions, but you answer them async — you can't see their answer until you've written yours. Try it → ${baseUrl()}`;
}
