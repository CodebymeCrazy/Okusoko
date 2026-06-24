# Closer — Deeper (36 Questions)

Two people answer Arthur Aron's 36 questions for a partner, at their own pace, on
their own devices, with no login. The point isn't the questions — it's
**reciprocal, escalating vulnerability**.

**The one rule that makes it work:** you cannot see your partner's answer to a
question until you've answered it yourself. Reciprocity is enforced at the
Firestore security-rules level, not just suggested in the UI.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind**
- **Firebase** — Firestore + Anonymous Auth
- Deploy on **Vercel**

## How the gating works

Each answer is stored in its own document: `responses/a` and `responses/b`,
never a single doc holding both. A Firestore read returns a whole document, so
splitting the answers is what lets the rules hide one half until the reveal
condition is met:

- **Volley** — your partner's answer to a question unlocks the instant your own
  answer to that same question exists.
- **Sealed** — everything unlocks at once when both people have `finished`.
  (Sealed is only valid when timing is `apart`.)

See [`firestore.rules`](./firestore.rules) for the enforced logic and
[`src/lib/types.ts`](./src/lib/types.ts) for the data model.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in your Firebase web config
npm run dev
```

### Firebase setup

1. Create a Firebase project and a Web App; paste the config values into
   `.env.local` (all `NEXT_PUBLIC_FIREBASE_*`).
2. Enable **Anonymous** sign-in (Authentication → Sign-in method).
3. Create a **Firestore** database.
4. Deploy the rules:

   ```bash
   npm i -g firebase-tools
   firebase deploy --only firestore:rules
   ```

The Firebase web keys are public client keys by design — all security is
enforced by the rules.

## Project map

| Path | What it is |
| --- | --- |
| `src/app/page.tsx` | Mode intro / landing |
| `src/app/create/page.tsx` | Create a session (name + reveal mode) |
| `src/app/s/[sessionId]/` | The session: join, question loop, finale |
| `src/app/api/og/route.tsx` | Open Graph share-preview image (`next/og`) |
| `src/lib/questions.ts` | The 36 questions + set intros (async-adapted) |
| `src/lib/session.ts` | Firestore reads/writes + live session hook |
| `src/lib/useAuth.ts` | Anonymous auth → stable uid |
| `firestore.rules` | Rules-enforced reciprocal reveal |
| `src/components/` | Screens: invite, join, loop, reveal, finale |

## Scope

This is **v1** (async-first). Parked for later: live/"together" mode (the data
model already leaves room — `currentQuestion`, presence), Google sign-in to
reclaim sessions across devices, voice notes, push/email reminders, real
anti-hijack auth, and answer editing.

Based on Aron et al., "The Experimental Generation of Interpersonal Closeness"
(1997).
