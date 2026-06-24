"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { firebaseConfigured, getFirebaseAuth } from "./firebase";

export interface AuthState {
  uid: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Signs the device in anonymously and exposes a stable uid. The user never
 * sees a sign-in screen; every device just gets a durable uid for the rules.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    uid: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!firebaseConfigured) {
      setState({
        uid: null,
        loading: false,
        error: "Firebase is not configured for this deployment.",
      });
      return;
    }

    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setState({ uid: user.uid, loading: false, error: null });
      } else {
        signInAnonymously(auth).catch((e) => {
          setState({ uid: null, loading: false, error: String(e?.message ?? e) });
        });
      }
    });

    return unsub;
  }, []);

  return state;
}
