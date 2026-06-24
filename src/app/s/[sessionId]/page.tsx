import type { Metadata } from "next";
import { SessionClient } from "./SessionClient";

const title = "Someone invited you to the 36 questions";
const description =
  "Answer Arthur Aron's 36 questions together, at your own pace. You can't see their answer until you've written yours.";

// Generic OG card for the share link. We deliberately don't read session data
// here (no answer content, no names) — that keeps the preview public-safe while
// the actual gating lives in Firestore rules.
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("You've been invited.")}&subtitle=${encodeURIComponent(
          "Answer the 36 questions together."
        )}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function SessionPage({ params }: { params: { sessionId: string } }) {
  return <SessionClient sessionId={params.sessionId} />;
}
