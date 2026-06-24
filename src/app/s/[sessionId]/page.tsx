import type { Metadata } from "next";
import { SessionClient } from "./SessionClient";

const description =
  "Answer Arthur Aron's 36 questions together, at your own pace. You can't see their answer until you've written yours.";

/** Keep a reflected name short and free of control characters before it lands in metadata. */
function cleanName(raw: string | string[] | undefined): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const trimmed = Array.from(value)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 && code !== 127; // drop control characters
    })
    .join("")
    .trim()
    .slice(0, 40);
  return trimmed.length ? trimmed : null;
}

// Personalize the link-preview card when the invite carries `?from=`. Crawlers
// run no JS, so we derive everything from the query param — no Firestore read,
// which keeps the preview public-safe (the gating lives in the rules).
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { from?: string | string[] };
}): Promise<Metadata> {
  const from = cleanName(searchParams.from);
  const title = from
    ? `${from} invited you to the 36 questions`
    : "Someone invited you to the 36 questions";
  const ogTitle = from ? `${from} invited you.` : "You've been invited.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(ogTitle)}&subtitle=${encodeURIComponent(
            "Answer the 36 questions together."
          )}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function SessionPage({ params }: { params: { sessionId: string } }) {
  return <SessionClient sessionId={params.sessionId} />;
}
