import { Reveal } from "@/components/motion/reveal";
import { istOffen, leistungen } from "@/lib/inhalte";

/** Leistungen als Index: keine Icon-Karten, Reihenfolge nach Daniels Antwort. */
export function Leistungen() {
  return (
    <section id="leistungen" aria-labelledby="leistungen-titel" className="scroll-mt-(--header-h) bg-bg-alt py-(--section-y) transition-colors duration-(--dur-welt)">
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6">
          <h2 id="leistungen-titel" className="max-w-[16ch] text-h2">
            Was ich für Ihre Infrastruktur tue
          </h2>
          <p className="max-w-measure text-lead text-text-muted">
            Schwerpunkt ist Leistung mit Open Source: bestehende Systeme schneller und stabiler machen, ohne Sie an einen
            Hersteller zu binden.
          </p>
        </Reveal>
        <ul className="border-t border-border">
          {leistungen.map((l, i) => (
            <Reveal as="li" key={l.titel} index={i} className="group border-b border-border">
              <div className="relative grid gap-x-10 gap-y-3 py-[clamp(1.75rem,3vw,2.75rem)] md:grid-cols-[minmax(0,5fr)_minmax(0,5fr)_minmax(0,3fr)] md:items-baseline">
                <h3 className="text-h3">{l.titel}</h3>
                <p className="max-w-measure text-text-muted">{l.text}</p>
                <div className="flex flex-wrap gap-x-3.5 gap-y-2">
                  {l.technik.map((t) => (
                    <span key={t} className={`daten ${istOffen(t) ? "offen" : ""}`}>
                      {t}
                    </span>
                  ))}
                </div>
                {/* Akzentlinie wächst beim Hover von links */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-brand transition-transform duration-(--dur-linie) ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-x-100"
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
