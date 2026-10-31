"use client";

import { useSyncExternalStore } from "react";

function abonnieren(melden: () => void) {
  const id = window.setInterval(melden, 1000);
  return () => window.clearInterval(id);
}
const jetzt = () =>
  new Date().toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", second: "2-digit" });

/** Live-Uhr (Potsdam) für die HUD-Zeile. Auf dem Server ein Platzhalter. */
export function Uhr({ className = "" }: { className?: string }) {
  const zeit = useSyncExternalStore(abonnieren, jetzt, () => "--:--:--");
  return (
    <time className={`tabular-nums ${className}`} suppressHydrationWarning>
      {zeit}
    </time>
  );
}
