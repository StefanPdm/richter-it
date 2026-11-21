"use client";

import { useEffect, useRef, useState } from "react";
import { useRuhig, useSichtbar } from "@/lib/hooks";

const ZIFFERN = "0123456789";
const ZEICHEN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

type Props = {
  text: string;
  className?: string;
  /** Auch Buchstaben klappen durch (Abflugtafel), sonst nur Ziffern (Kennzahlen) */
  buchstaben?: boolean;
  /** Versatz zwischen den Stellen in Klappschritten, kleiner = schneller fertig */
  versatz?: number;
};

/**
 * Fallblatt-Anzeige wie am Bahnhof: Jede Stelle klappt einige Male durch,
 * dann steht der Zielwert. Stellen laufen versetzt (links zuerst fertig).
 * Ruhezustand und "weniger Bewegung": Zielwert sofort.
 */
export function Fallblatt({ text, className = "", buchstaben = false, versatz = 2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const sichtbar = useSichtbar(ref, { einmal: true, schwelle: 0.6 });
  const ruhig = useRuhig();
  const zeichen = text.split("");
  const [stand, setStand] = useState(zeichen);
  const [takt, setTakt] = useState(0); // erzwingt das Neu-Klappen

  useEffect(() => {
    if (!sichtbar || ruhig) return;
    let schritt = 0;
    const SCHRITTE = 9;
    const uhr = window.setInterval(() => {
      schritt += 1;
      setStand(
        zeichen.map((z, i) => {
          const fertigBei = SCHRITTE - 3 + Math.round(i * versatz); // jede Stelle etwas später fertig
          const klappt = buchstaben ? z !== " " : /\d/.test(z);
          if (schritt >= fertigBei || !klappt) return z;
          const vorrat = buchstaben ? ZEICHEN : ZIFFERN;
          return vorrat[Math.floor(Math.random() * vorrat.length)];
        }),
      );
      setTakt(schritt);
      if (schritt >= SCHRITTE + zeichen.length * versatz) window.clearInterval(uhr);
    }, 190); // Takt pro Klappschritt, ruhig genug zum Mitlesen
    return () => window.clearInterval(uhr);
    // zeichen ergibt sich aus text
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sichtbar, ruhig, text, buchstaben, versatz]);

  return (
    <span ref={ref} className={`fallblatt ${className}`}>
      <span className="sr-only">{text}</span>
      {stand.map((z, i) =>
        z === " " ? (
          <span key={i} className="fallblatt__zelle fallblatt__zelle--leer" aria-hidden="true" />
        ) : (
          <span key={i} className="fallblatt__zelle" aria-hidden="true">
            {/* neuer key pro Wechsel: die Klapp-Animation startet jedes Mal neu */}
            <span key={`${takt}-${z}`} className="fallblatt__zeichen">
              {z}
            </span>
          </span>
        ),
      )}
    </span>
  );
}
