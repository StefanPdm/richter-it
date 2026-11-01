"use client";

import { useEffect, useRef, useState } from "react";
import { useRuhig, useSichtbar } from "@/lib/hooks";

type Props = { kennung: string; label: string; einheit: string; basis: number; spanne: number };

const PUNKTE = 32;
const B = 240;
const H = 56;

/** Ruhiger Zufallsweg um den Basiswert, deterministisch für den ersten Render. */
function verlauf(basis: number, spanne: number) {
  let v = basis;
  return Array.from({ length: PUNKTE }, (_, i) => {
    v += Math.sin(i * 1.7 + basis) * spanne * 0.18;
    v = Math.max(basis - spanne, Math.min(basis + spanne, v));
    return v;
  });
}

/**
 * Monitorkachel des Leitstands (Beispielwerte). Die Kurve schiebt sich jede
 * Sekunde weiter, solange die Kachel sichtbar ist. Ruhig: stehende Kurve.
 */
export function MonitorKachel({ kennung, label, einheit, basis, spanne }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const sichtbar = useSichtbar(ref, { schwelle: 0.1 });
  const ruhig = useRuhig();
  const [werte, setWerte] = useState(() => verlauf(basis, spanne));

  useEffect(() => {
    if (!sichtbar || ruhig) return;
    const uhr = window.setInterval(() => {
      setWerte((alt) => {
        const letzter = alt[alt.length - 1];
        const neu = Math.max(basis - spanne, Math.min(basis + spanne, letzter + (Math.random() - 0.5) * spanne * 0.5));
        return [...alt.slice(1), neu];
      });
    }, 1000);
    return () => window.clearInterval(uhr);
  }, [sichtbar, ruhig, basis, spanne]);

  const min = basis - spanne, max = basis + spanne;
  const punkte = werte.map((v, i) => `${(i / (PUNKTE - 1)) * B},${H - ((v - min) / (max - min)) * (H - 6) - 3}`);
  const aktuell = werte[werte.length - 1];
  const stellen = basis < 10 ? 1 : 0;

  return (
    <div ref={ref} className="hud-rahmen grid gap-3 bg-bg/65 p-5 transition-colors duration-(--dur-welt)">
      <div className="flex items-baseline justify-between gap-3">
        <span className="daten">
          {kennung} · {label}
        </span>
        <span className="status-punkt" aria-hidden="true" />
      </div>
      <p className="m-0 font-mono text-zahl tabular-nums text-text">
        {aktuell.toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen })}
        <span className="ml-1.5 text-sm text-text-muted">{einheit}</span>
      </p>
      <svg viewBox={`0 0 ${B} ${H}`} preserveAspectRatio="none" className="h-14 w-full" aria-hidden="true">
        <polyline points={`0,${H} ${punkte.join(" ")} ${B},${H}`} fill="var(--color-brand-soft)" stroke="none" />
        <polyline points={punkte.join(" ")} fill="none" stroke="var(--color-brand)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
