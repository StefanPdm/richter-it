"use client";

import { useEffect, useRef, useState } from "react";
import { useRuhig, useSichtbar } from "@/lib/hooks";

type Props = { wert: number; nachkomma?: number; vorsatz?: string; nachsatz?: string; className?: string };

const format = (n: number, nachkomma: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: nachkomma, maximumFractionDigits: nachkomma });

/** Zählt einmal hoch, wenn die Zahl ins Bild kommt. Ruhezustand: der Endwert. */
export function Zaehler({ wert, nachkomma = 0, vorsatz = "", nachsatz = "", className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const sichtbar = useSichtbar(ref, { einmal: true, schwelle: 0.6 });
  const ruhig = useRuhig();
  const [anzeige, setAnzeige] = useState(wert);

  useEffect(() => {
    if (!sichtbar || ruhig || wert === 0) return;
    const start = performance.now();
    const DAUER = 1600;
    let bild = 0;
    const schritt = (jetzt: number) => {
      const t = Math.min(1, (jetzt - start) / DAUER);
      const sanft = 1 - Math.pow(1 - t, 4); // ease-out: schnell los, ruhig ans Ziel
      setAnzeige(wert * sanft);
      if (t < 1) bild = requestAnimationFrame(schritt);
    };
    bild = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(bild);
  }, [sichtbar, ruhig, wert]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={`${vorsatz}${format(wert, nachkomma)}${nachsatz}`}>
      <span aria-hidden="true">
        {vorsatz}
        {format(anzeige, nachkomma)}
        {nachsatz}
      </span>
    </span>
  );
}
