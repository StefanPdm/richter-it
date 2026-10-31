import { Reveal } from "@/components/motion/reveal";
import { KiVideo } from "@/components/medien/ki-video";
import { grundsaetze } from "@/lib/inhalte";

/** Medienband mit KI-Video 02 "Kamerafahrt durch Rack-Reihen". */
export function Medienband() {
  return (
    <section aria-label="Rechenzentrum" className="relative aspect-[21/9] min-h-70 max-w-full overflow-hidden border-y border-border">
      <KiVideo szene="rackreihen" className="absolute inset-0 size-full" />
    </section>
  );
}

/** Haltung: drei Grundsätze, der dritte als Zitat von Daniel. */
export function Haltung() {
  return (
    <section aria-labelledby="haltung-titel" className="py-(--section-y)">
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)]">
          <h2 id="haltung-titel" className="max-w-[16ch] text-h2">
            Gezielt eingreifen statt neu bauen
          </h2>
        </Reveal>
        <div className="grid gap-[clamp(2rem,4vw,3.5rem)] md:grid-cols-3">
          {grundsaetze.map((g, i) => (
            <Reveal key={g.titel} index={i} className="grid content-start gap-3.5 border-t border-border pt-5.5">
              <h3 className="text-h3">{g.titel}</h3>
              <p className="text-text-muted">{g.text}</p>
            </Reveal>
          ))}
          <Reveal index={2} className="grid content-start gap-3.5 border-t border-border pt-5.5">
            <h3 className="text-h3">Kleine Eingriffe</h3>
            <figure className="grid gap-2">
              <blockquote className="font-display text-h3 font-normal [font-stretch:85%]">
                „Meistens ohne große Umbauarbeiten.“
              </blockquote>
              <figcaption className="daten">Daniel Richter</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
