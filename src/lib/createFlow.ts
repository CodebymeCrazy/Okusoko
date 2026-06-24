"use client";

// Pulled in only when the user actually submits the create form, via a dynamic
// import — that's what keeps the whole Firebase SDK off the create page's first
// load. (Anything this module touches transitively imports Firebase.)

import { signInAnonymously } from "firebase/auth";
import { firebaseConfigured, getFirebaseAuth } from "./firebase";
import { createSession } from "./session";
import type { RevealMode } from "./types";

/** Reuse the device's anonymous user, or create one now. */
async function ensureUid(): Promise<string> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) return auth.currentUser.uid;
  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}

export async function createSessionFlow(
  name: string,
  reveal: RevealMode,
  pack: string
): Promise<string> {
  if (!firebaseConfigured) {
    throw new Error("Firebase is not configured for this deployment.");
  }
  const uid = await ensureUid();
  return createSession(uid, name, reveal, pack);
}
