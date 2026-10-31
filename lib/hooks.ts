"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const RUHIG = "(prefers-reduced-motion: reduce)";

function abonnierenRuhig(melden: () => void) {
  const mq = window.matchMedia(RUHIG);
  mq.addEventListener("change", melden);
  return () => mq.removeEventListener("change", melden);
}

/** true bei "weniger Bewegung". Auf dem Server false. */
export function useRuhig() {
  return useSyncExternalStore(abonnierenRuhig, () => window.matchMedia(RUHIG).matches, () => false);
}

/**
 * Meldet, sobald das Element ins Bild kommt.
 * einmal = true: bleibt danach true (für Abläufe, die nur einmal spielen).
 */
export function useSichtbar(ref: RefObject<Element | null>, { einmal = false, schwelle = 0.3 } = {}) {
  const [sichtbar, setSichtbar] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const beobachter = new IntersectionObserver(
      ([e]) => {
        setSichtbar(e.isIntersecting);
        if (einmal && e.isIntersecting) beobachter.disconnect();
      },
      { threshold: schwelle },
    );
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [ref, einmal, schwelle]);
  return sichtbar;
}
