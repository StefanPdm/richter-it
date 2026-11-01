import { Reveal } from "@/components/motion/reveal";
import { LichtkegelKarte } from "@/components/effekte/lichtkegel-karte";
import { partner } from "@/lib/inhalte";

/**
 * Partner-Netzwerk, Inhalte von der bestehenden Website (Seite Partner).
 * Hintergrund ruhig (zwischen Person und Kontakt).
 */
export function Partner() {
  return (
    <section id="partner" aria-labelledby="partner-titel" className="scroll-mt-(--header-h) bg-bg-alt py-(--section-y) transition-colors duration-(--dur-welt)">
      <div className="mx-auto grid max-w-wide gap-[clamp(2rem,5vw,5rem)] px-(--gutter) lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Reveal className="grid content-start gap-6">
          <h2 id="partner-titel" className="titel-linie titel-glitch text-h2">
            Ein Netzwerk für jedes Projekt
          </h2>
          <figure className="grid gap-3">
            <blockquote className="font-display text-h3 font-normal [font-stretch:85%]">„{partner.zitat}“</blockquote>
            <figcaption className="daten">Daniel Richter</figcaption>
          </figure>
          <p className="max-w-measure text-text-muted">{partner.text}</p>
        </Reveal>
        <div className="grid gap-(--gap-karten) sm:grid-cols-2">
          {partner.liste.map((p, i) => (
            <Reveal key={p.name} index={i}>
              <LichtkegelKarte className="grid h-full content-start gap-4 border border-border bg-surface p-[clamp(1.5rem,2.5vw,2.25rem)] transition-[border-color,background-color] duration-(--dur-base)">
                <span className="daten text-brand-dark">{p.kategorie}</span>
                <h3 className="text-h3">{p.name}</h3>
                <span className="daten">{p.person}</span>
                <p className="text-text-muted">{p.text}</p>
              </LichtkegelKarte>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
