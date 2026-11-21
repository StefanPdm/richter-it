"use client";

import { useState, type ReactNode } from "react";
import { KartenFuss } from "@/components/ui/karten-fuss";

type Props = {
  vorn: ReactNode;
  rueck: ReactNode;
  /** Beschriftung der Knöpfe, z. B. "Fall ansehen" / "Zurück" */
  labelVorn?: string;
  labelRueck?: string;
  className?: string;
};

/**
 * Drehkarte: Vorderseite mit dem Ergebnis, Rückseite mit dem Fall.
 * Dreht per Knopf (Tastatur, Touch, Maus). Die verdeckte Seite ist inert,
 * damit Screenreader und Tab nur die sichtbare Seite erreichen.
 * Weniger Bewegung: überblenden statt drehen (globals.css).
 */
export function Drehkarte({ vorn, rueck, labelVorn = "Fall ansehen", labelRueck = "Zurück", className = "" }: Props) {
  const [gedreht, setGedreht] = useState(false);
  const knopf =
    "daten inline-flex min-h-11 cursor-pointer items-center gap-2 border border-border px-3.5 transition-colors duration-(--dur-fast) hover:border-brand hover:text-text";

  return (
    <div className={`drehkarte h-full ${className}`} data-gedreht={gedreht}>
      <div className="drehkarte__innen">
        <div className="drehkarte__vorn hud-rahmen flex flex-col gap-4 border border-border bg-surface p-[clamp(1.5rem,2.5vw,2.25rem)]" inert={gedreht}>
          {vorn}
          <KartenFuss>
            <button type="button" className={knopf} onClick={() => setGedreht(true)} aria-expanded={gedreht}>
              {labelVorn} <span aria-hidden="true">↻</span>
            </button>
          </KartenFuss>
        </div>
        <div className="drehkarte__rueck hud-rahmen flex flex-col gap-4 border border-brand bg-surface p-[clamp(1.5rem,2.5vw,2.25rem)]" inert={!gedreht}>
          {rueck}
          <KartenFuss>
            <button type="button" className={knopf} onClick={() => setGedreht(false)}>
              <span aria-hidden="true">↺</span> {labelRueck}
            </button>
          </KartenFuss>
        </div>
      </div>
    </div>
  );
}
