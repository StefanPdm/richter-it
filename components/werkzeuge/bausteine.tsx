"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { zumFormular, type Thema } from "@/lib/kontakt-thema";

/*
 * Gemeinsame Bausteine aller Werkzeuge. Werkzeuge bauen nur hieraus und aus den
 * vorhandenen Klassen (daten, hud-rahmen, schnitt ...), damit alle gleich aussehen.
 */

const zahl = new Intl.NumberFormat("de-DE");

/** Zahl deutsch formatiert, optional mit Nachkommastellen */
export function format(wert: number, nachkomma = 0) {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: nachkomma, maximumFractionDigits: nachkomma }).format(wert);
}
export function euro(wert: number) {
  return `${zahl.format(Math.round(wert))} €`;
}

type ReglerProps = {
  label: string;
  wert: number;
  min: number;
  max: number;
  schritt?: number;
  einheit?: string;
  /** Anzeige des Werts, Standard: deutsch formatiert + Einheit */
  anzeige?: (wert: number) => string;
  hinweis?: string;
  onChange: (wert: number) => void;
};

/** Schieberegler mit Beschriftung und Wertanzeige. Pfeiltasten gehen in Schritten. */
export function Regler({ label, wert, min, max, schritt = 1, einheit = "", anzeige, hinweis, onChange }: ReglerProps) {
  const id = useId();
  const text = anzeige ? anzeige(wert) : `${zahl.format(wert)}${einheit ? ` ${einheit}` : ""}`;
  const anteil = ((wert - min) / (max - min)) * 100;
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="daten">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm text-text">
          {text}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={schritt}
        value={wert}
        aria-valuetext={text}
        onChange={(e) => onChange(Number(e.target.value))}
        className="regler"
        style={{ "--anteil": `${anteil}%` } as CSSProperties}
      />
      {hinweis && <p className="text-xs text-text-muted">{hinweis}</p>}
    </div>
  );
}

type WahlProps<T extends string> = {
  legende: string;
  optionen: readonly { wert: T; label: string }[];
  wert: T;
  onChange: (wert: T) => void;
};

/** Einfachauswahl als Chips (Radiogruppe), Stil wie die Anliegen im Kontaktformular */
export function Wahl<T extends string>({ legende, optionen, wert, onChange }: WahlProps<T>) {
  const name = useId();
  return (
    <fieldset className="grid gap-2">
      <legend className="daten mb-2">{legende}</legend>
      <div className="flex flex-wrap gap-2">
        {optionen.map((o) => (
          <label key={o.wert} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.wert}
              checked={wert === o.wert}
              onChange={() => onChange(o.wert)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 items-center border border-border px-3.5 text-sm transition-colors duration-(--dur-fast) peer-checked:border-brand peer-checked:bg-brand-soft peer-checked:text-text peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-text-muted">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Ergebnis-Kennwert: Beschriftung, große Zahl, optional Zusatz */
export function Kennwert({ label, wert, zusatz, betont = false }: { label: string; wert: string; zusatz?: string; betont?: boolean }) {
  return (
    <div className="grid content-start gap-1.5 border-t border-border pt-4">
      <span className="daten">{label}</span>
      <span className={`font-mono text-[clamp(1.5rem,1rem+1.6vw,2.25rem)] leading-none font-medium ${betont ? "text-brand-dark" : "text-text"}`}>
        {wert}
      </span>
      {zusatz && <span className="text-sm text-text-muted">{zusatz}</span>}
    </div>
  );
}

/** Fläche für Eingaben oder Ergebnis */
export function Feld({ titel, children, className = "" }: { titel?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`hud-rahmen grid content-start gap-6 border border-border bg-surface p-[clamp(1.25rem,3vw,2.25rem)] ${className}`}>
      {titel && <h2 className="text-h3">{titel}</h2>}
      {children}
    </div>
  );
}

/** Ergebnis besprechen: springt zum Formular, Ergebnis steht schon in der Nachricht */
export function ErgebnisKnopf({ thema, children = "Ergebnis besprechen" }: { thema: Thema; children?: ReactNode }) {
  return (
    <a
      href="#kontakt"
      onClick={(e) => zumFormular(e, thema)}
      className="schnitt zucken inline-flex min-h-12 items-center justify-center gap-2 justify-self-start bg-brand-dark px-6 font-medium text-text-inverse transition-colors duration-(--dur-fast) hover:bg-brand-darker"
    >
      {children} <span aria-hidden="true">→</span>
    </a>
  );
}
