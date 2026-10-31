"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * Magnet: das Element folgt dem Mauszeiger ein paar Pixel (max. 8px) und
 * federt beim Verlassen zurück. Nur mit Maus; Touch und Tastatur bleiben unberührt.
 */
export function Magnet({ children, staerke = 0.22 }: { children: ReactNode; staerke?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  function bewege(e: PointerEvent<HTMLSpanElement>) {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) * staerke));
    const dy = Math.max(-8, Math.min(8, (e.clientY - (r.top + r.height / 2)) * staerke));
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }
  function zurueck() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <span
      ref={ref}
      onPointerMove={bewege}
      onPointerLeave={zurueck}
      className="inline-block transition-transform duration-(--dur-base) ease-out"
    >
      {children}
    </span>
  );
}
