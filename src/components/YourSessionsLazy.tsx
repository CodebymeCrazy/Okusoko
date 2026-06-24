"use client";

import dynamic from "next/dynamic";

// Lazy-load the Firebase-dependent "Your sessions" list so the landing page's
// first paint doesn't have to ship the whole Firebase SDK (~128 kB). It renders
// nothing until there's something to show, so deferring it is invisible to
// first-time visitors and costs nothing for returning ones.
const YourSessions = dynamic(
  () => import("./YourSessions").then((m) => m.YourSessions),
  { ssr: false }
);

export function YourSessionsLazy() {
  return <YourSessions />;
}
