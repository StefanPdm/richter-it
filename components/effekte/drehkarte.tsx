"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { KartenFuss } from "@/components/ui/karten-fuss";

type Props = {
  vorn: ReactNode;
  rueck: ReactNode;
  /** Beschriftung der Knöpfe, z. B. "Fall ansehen" / "Zurück" */
  labelVorn?: string;
  labelRueck?: string;
  /** Neben-Link in der Fußleiste der Rückseite, z. B. "Ganzer Fall" */
  rueckLink?: ReactNode;
  className?: string;
};

/** Verweildauer der Maus, bevor die Karte dreht oder zurückdreht (ms) */
const VERWEILEN = 150;

/**
 * Drehkarte: Vorderseite mit dem Ergebnis, Rückseite mit dem Fall.
 * Dreht beim Überfahren mit der Maus und per Knopf (Tastatur, Touch, Maus). Die verdeckte Seite ist inert,
 * damit Screenreader und Tab nur die sichtbare Seite erreichen.
 * Weniger Bewegung: überblenden statt drehen (globals.css).
 */
export function Drehkarte({ vorn, rueck, labelVorn = "Fall ansehen", labelRueck = "Zurück", rueckLink, className = "" }: Props) {
  const [gedreht, setGedreht] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  /* Maus: nach kurzem Verweilen drehen, beim Verlassen zurück. Die Verzögerung verhindert,
     dass beim Überfahren der Reihe alle Karten nacheinander umklappen. Touch nutzt den Knopf. */
  const nachKurzem = (e: PointerEvent, ziel: boolean) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setGedreht(ziel), VERWEILEN);
  };
  const knopf =
    "daten inline-flex min-h-11 cursor-pointer items-center gap-2 border border-border px-3.5 transition-colors duration-(--dur-fast) hover:border-brand hover:text-text";

  return (
    <div
      className={`drehkarte h-full min-w-0 ${className}`}
      data-gedreht={gedreht}
      onPointerEnter={(e) => nachKurzem(e, true)}
      onPointerLeave={(e) => nachKurzem(e, false)}
    >
      <div className="drehkarte__innen min-w-0">
        <div className="drehkarte__vorn hud-rahmen flex min-w-0 flex-col gap-4 border border-border bg-surface p-[clamp(1.75rem,3.5vw,2.25rem)]" inert={gedreht}>
          {vorn}
          <KartenFuss>
            <button type="button" className={knopf} onClick={() => setGedreht(true)} aria-expanded={gedreht}>
              {labelVorn} <span aria-hidden="true">↻</span>
            </button>
          </KartenFuss>
        </div>
        <div className="drehkarte__rueck hud-rahmen flex min-w-0 flex-col gap-4 border border-brand bg-surface p-[clamp(1.75rem,3.5vw,2.25rem)]" inert={!gedreht}>
          {rueck}
          <KartenFuss links={rueckLink}>
            <button type="button" className={knopf} onClick={() => setGedreht(false)}>
              <span aria-hidden="true">↺</span> {labelRueck}
            </button>
          </KartenFuss>
        </div>
      </div>
    </div>
  );
}
