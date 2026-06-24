"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "okusoko:install-hint-dismissed";

/**
 * A gentle "add to home screen" nudge. On Chrome/Android it offers a real
 * Install button (via beforeinstallprompt); on iOS it shows the Share → Add to
 * Home Screen instruction. Hides itself when already installed or dismissed.
 */
export function InstallHint() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed / launched from the home screen → nothing to do.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    setIsIOS(ios);

    // iOS gives no install event — show the manual hint straight away.
    if (ios) setShow(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt as EventListener);

    const onInstalled = () => setShow(false);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setShow(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  }

  if (!show) return null;

  return (
    <div className="card mb-6 flex items-start gap-3 p-4">
      <span className="text-xl" aria-hidden>
        📲
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">Add Okusoko to your home screen</p>
        <p className="mt-1 text-sm text-dusk">
          {isIOS
            ? "Tap the Share button, then “Add to Home Screen” — it opens like an app, no store needed."
            : "Install it for an app-like, full-screen experience. No app store, no account."}
        </p>
        {!isIOS && deferred && (
          <button className="btn-primary mt-3 px-4 py-2 text-sm" onClick={install}>
            Install
          </button>
        )}
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-dusk/50 hover:text-ink"
      >
        ✕
      </button>
    </div>
  );
}
