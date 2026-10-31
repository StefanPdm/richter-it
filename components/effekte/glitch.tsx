import type { CSSProperties } from "react";

type Props = {
  text: string;
  /** Abstand zwischen zwei Störungen, z. B. "7s" */
  takt?: string;
  className?: string;
};

/**
 * Glitch-Text: Haupttext plus zwei versetzte Farbkanäle (Neon, Rot), die alle
 * paar Sekunden kurz aufreißen. Die Kanäle sind für Screenreader verborgen,
 * gelesen wird nur der Haupttext. Ohne Bewegung: nur der Haupttext.
 */
export function Glitch({ text, takt = "7s", className = "" }: Props) {
  return (
    <span className={`glitch ${className}`} style={{ "--glitch-takt": takt } as CSSProperties}>
      <span className="glitch__text">{text}</span>
      <span className="glitch__kanal glitch__kanal--a" aria-hidden="true">
        {text}
      </span>
      <span className="glitch__kanal glitch__kanal--b" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
