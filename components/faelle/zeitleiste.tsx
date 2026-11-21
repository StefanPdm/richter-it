import type { CSSProperties } from "react";

type Props = {
  /** Anzahl der Jahre im Betrieb */
  jahre: number;
};

/**
 * Zeitleiste zum Altsystem: ein Feld pro Jahr, die Felder füllen sich nacheinander,
 * das letzte pulsiert (läuft weiter). Bei "weniger Bewegung" sofort gefüllt.
 */
export function Zeitleiste({ jahre }: Props) {
  return (
    <div className="hud-rahmen grid gap-6 border border-border bg-bg-alt p-[clamp(1.25rem,3vw,2.25rem)]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="daten">Betriebszeit · Jahre</span>
        <span className="daten flex items-center gap-2.5 text-success">
          <span className="status-punkt" aria-hidden="true" />
          Läuft
        </span>
      </div>
      <ol className="zeitleiste grid gap-1" style={{ gridTemplateColumns: `repeat(${jahre}, minmax(0, 1fr))` } as CSSProperties} aria-label={`${jahre} Jahre im Betrieb`}>
        {Array.from({ length: jahre }, (_, i) => (
          <li key={i} className={`zeitleiste__jahr ${i === jahre - 1 ? "zeitleiste__jahr--heute" : ""}`} style={{ "--i": i } as CSSProperties}>
            <span className="sr-only">Jahr {i + 1}</span>
          </li>
        ))}
      </ol>
      <div className="flex justify-between gap-4">
        <span className="daten">Inbetriebnahme</span>
        <span className="daten text-text">Heute · {jahre} Jahre</span>
      </div>
    </div>
  );
}
