import { Reveal } from "@/components/motion/reveal";
import { Fallblatt } from "@/components/effekte/fallblatt";
import { kennzahlen } from "@/lib/inhalte";

const alsText = (k: (typeof kennzahlen)[number]) => `${k.wert.toLocaleString("de-DE")}${k.nachsatz}`;

/**
 * BEISPIEL-Kennzahlen (Präsentation) als Fallblatt-Anzeige.
 * Hintergrund animiert: "Lichtfeger" über einer Punktmatrix.
 */
export function Kennzahlen() {
  return (
    <section aria-label="Kennzahlen" className="hg-lichtfeger border-y border-border">
      <div className="mx-auto grid max-w-wide grid-cols-2 px-(--gutter) md:grid-cols-4">
        {kennzahlen.map((k, i) => (
          <Reveal
            key={k.label}
            index={i}
            className={`grid content-start gap-3 border-border py-[clamp(2rem,4vw,3.5rem)] pr-4 ${i > 0 ? "md:border-l md:pl-8" : ""} ${i % 2 === 1 ? "border-l pl-4 md:pl-8" : ""} ${i > 1 ? "border-t md:border-t-0" : ""}`}
          >
            <Fallblatt text={alsText(k)} className="font-mono text-[clamp(1.15rem,0.75rem+1.35vw,2.1rem)] font-medium text-brand-dark" />
            <span className="daten">{k.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
