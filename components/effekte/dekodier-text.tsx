"use client";

import { useEffect, useRef, useState } from "react";
import { useRuhig, useSichtbar } from "@/lib/hooks";

const ZEICHEN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#_";

type Props = { text: string; className?: string };

/**
 * Kurze HUD-Beschriftung, die sich beim ersten Erscheinen "entschlüsselt".
 * Nur für kleine Deko-Labels, nie für Überschriften oder Fließtext.
 * Screenreader lesen sofort den echten Text.
 */
export function DekodierText({ text, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const sichtbar = useSichtbar(ref, { einmal: true, schwelle: 0.6 });
  const ruhig = useRuhig();
  const [anzeige, setAnzeige] = useState(text);

  useEffect(() => {
    if (!sichtbar || ruhig) return;
    const start = performance.now();
    const DAUER = 700;
    let bild = 0;
    const schritt = (jetzt: number) => {
      const fertig = Math.min(1, (jetzt - start) / DAUER);
      const aufgeloest = Math.floor(fertig * text.length);
      setAnzeige(
        text
          .split("")
          .map((z, i) => (i < aufgeloest || z === " " ? z : ZEICHEN[Math.floor(Math.random() * ZEICHEN.length)]))
          .join(""),
      );
      if (fertig < 1) bild = requestAnimationFrame(schritt);
    };
    bild = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(bild);
  }, [sichtbar, ruhig, text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{anzeige}</span>
    </span>
  );
}
