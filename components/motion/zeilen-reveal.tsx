import type { CSSProperties } from "react";
import { Reveal } from "./reveal";

type Props = {
  /** Überschrift in Zeilen, höchstens zwei (stilrichtungen.md, Paket 5) */
  zeilen: string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
};

/** Überschrift, deren Zeilen nacheinander aus einer Maske steigen. Text bleibt HTML. */
export function ZeilenReveal({ zeilen, as = "h2", className = "" }: Props) {
  return (
    <Reveal as={as} art="zeilen" className={className}>
      {zeilen.map((zeile, i) => (
        <span key={zeile} className="zeile" style={{ "--zeile-i": i } as CSSProperties}>
          <span>{zeile}</span>
        </span>
      ))}
    </Reveal>
  );
}
