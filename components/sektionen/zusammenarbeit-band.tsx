import Link from "next/link";
import { Fragment } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { zusammenarbeit } from "@/lib/inhalte";

/**
 * Teaser auf der Startseite: die fünf Schritte als Mini-Blätter, verbunden durch eine Leitung
 * mit laufendem Signal. Ausführlich auf /zusammenarbeit.
 */
export function ZusammenarbeitBand() {
  const { schritte } = zusammenarbeit;
  return (
    <section id="zusammenarbeit" aria-labelledby="zusammenarbeit-titel" className="relative isolate scroll-mt-(--header-h) border-y border-border py-[clamp(3rem,6vw,5rem)]">
      <Sektionsgrund licht="rechts-unten" motiv="puls" />
      <div className="mx-auto grid max-w-wide grid-cols-1 items-center gap-[clamp(2rem,4vw,4rem)] px-(--gutter) lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Reveal className="grid gap-4">
          <h2 id="zusammenarbeit-titel" className="font-display text-h3 font-medium [font-stretch:80%]">
            {zusammenarbeit.titel}
          </h2>
          <p className="max-w-measure text-text-muted">{zusammenarbeit.teaser}</p>
          <Link href="/zusammenarbeit" className="zucken group/ablauf inline-flex min-h-11 items-center gap-2 justify-self-start font-medium text-brand-dark">
            So arbeiten wir
            <span aria-hidden="true" className="transition-transform duration-(--dur-fast) ease-out [@media(hover:hover)]:group-hover/ablauf:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>

        <Reveal index={1}>
          <ol className="flex items-start">
            {schritte.map((s, i) => {
              const letzter = i === schritte.length - 1;
              return (
                <Fragment key={s.kurz}>
                  <li className="grid shrink-0 justify-items-center gap-2.5">
                    <span className={`ablauf-blatt ${letzter ? "ablauf-blatt--abnahme" : ""}`} aria-hidden="true">
                      {letzter && <span className="absolute right-1 bottom-0.5 font-mono text-sm text-cta">✓</span>}
                    </span>
                    <span className="daten text-center">
                      <span className="block text-brand-dark">0{i + 1}</span>
                      {s.kurz}
                    </span>
                  </li>
                  {!letzter && (
                    <li aria-hidden="true" className="mt-[1.7rem] min-w-2 flex-1 px-1.5">
                      <span className="f502-leitung" />
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
