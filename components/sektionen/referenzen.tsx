import { Reveal } from "@/components/motion/reveal";
import { Drehkarte } from "@/components/effekte/drehkarte";
import { referenzen, stimmen } from "@/lib/inhalte";
import { site } from "@/lib/site";

/**
 * Anonyme Referenzen als Drehkarten: vorn das Ergebnis, hinten der Fall.
 * Kundenstimmen darunter. Alles BEISPIELE für die Präsentation.
 * Hintergrund ruhig (Wechsel zu Medienband und Person).
 */
export function Referenzen() {
  return (
    <section id="referenzen" aria-labelledby="referenzen-titel" className="scroll-mt-(--header-h) bg-bg-alt py-(--section-y) transition-colors duration-(--dur-welt)">
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="referenzen-titel" className="titel-linie titel-glitch max-w-[16ch] text-h2">
            Referenzen, ohne Namen
          </h2>
          <p className="max-w-measure text-lead text-text-muted">
            Viele meiner Kunden darf ich nicht nennen. Deshalb beschreibe ich Projekte so, wie es zulässig ist: Branche,
            Ausgangslage, Vorgehen, Ergebnis.
          </p>
        </Reveal>

        <div className="grid gap-(--gap-karten) md:grid-cols-3">
          {referenzen.map((r, i) => (
            <Reveal as="article" key={r.titel} index={i} className="md:min-h-[26rem]">
              <Drehkarte
                vorn={
                  <>
                    <span className="daten text-brand-dark">
                      Fall {String(i + 1).padStart(2, "0")} · {r.branche}
                    </span>
                    <p className="leuchten mt-6 font-display text-h2 font-medium text-brand-dark [font-stretch:72%]">{r.kurz}</p>
                    <h3 className="text-h3">{r.titel}</h3>
                  </>
                }
                rueck={
                  <>
                    <span className="daten text-brand-dark">
                      Fall {String(i + 1).padStart(2, "0")} · {r.branche}
                    </span>
                    <dl className="grid gap-3">
                      {r.punkte.map((p) => (
                        <div key={p.label}>
                          <dt className="daten">{p.label}</dt>
                          <dd className="mt-0.5">{p.wert}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                }
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-[clamp(3rem,6vw,6rem)] grid gap-10 md:grid-cols-2">
          {stimmen.map((s, i) => (
            <Reveal as="figure" key={s.rolle} index={i} className="grid gap-4 border-t border-brand pt-6">
              <blockquote className="font-display text-h3 font-normal [font-stretch:85%]">„{s.zitat}“</blockquote>
              <figcaption className="daten">{s.rolle}</figcaption>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="daten">Offen einsehbar</span>
          <a href={site.github} className="underline underline-offset-4 hover:text-brand-dark">
            Observability-Stack auf GitHub: danielrichterit/grafana-stack
          </a>
        </p>
      </div>
    </section>
  );
}
