"use client";

import type { PointerEvent, ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

/**
 * Karte mit Lichtkegel unter dem Mauszeiger. Setzt --mx/--my nur auf sich selbst
 * (nicht auf Kinder), das Licht ist ein ::before der Karte (globals.css .lichtkegel).
 */
export function LichtkegelKarte({ children, className = "" }: Props) {
  function bewege(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }
  return (
    <div onPointerMove={bewege} className={`lichtkegel hud-rahmen ${className}`}>
      {children}
    </div>
  );
}
