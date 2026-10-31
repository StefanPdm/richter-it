import { Reveal } from "@/components/motion/reveal";
import { istOffen, referenzen } from "@/lib/inhalte";
import { site } from "@/lib/site";

/** Anonyme Referenzen: Branche, Ausgangslage, Vorgehen, Ergebnis. Keine Kundennamen. */
export function Referenzen() {
  return (
    <section id="referenzen" aria-labelledby="referenzen-titel" className="scroll-mt-(--header-h) bg-bg-alt py-(--section-y) transition-colors duration-(--dur-welt)">
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6">
          <h2 id="referenzen-titel" className="max-w-[16ch] text-h2">
            Referenzen, ohne Namen
          </h2>
          <p className="max-w-measure text-lead text-text-muted">
            Viele meiner Kunden darf ich nicht nennen. Deshalb beschreibe ich Projekte so, wie es zulässig ist: Branche,
            Ausgangslage, Vorgehen, Ergebnis.
          </p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {referenzen.map((r, i) => (
            <Reveal
              as="article"
              key={`${r.branche}-${i}`}
              index={i}
              className={`grid content-start gap-4.5 border border-border p-[clamp(1.5rem,2.5vw,2.25rem)] transition-colors duration-(--dur-welt) ${r.offen ? "border-dashed" : "bg-surface"}`}
            >
              <span className={`daten ${istOffen(r.branche) ? "offen" : ""}`}>{r.branche}</span>
              <h3 className={`text-h3 ${istOffen(r.titel) ? "offen" : ""}`}>{r.titel}</h3>
              <dl className="grid gap-3">
                {r.punkte.map((p) => (
                  <div key={p.label}>
                    <dt className="daten">{p.label}</dt>
                    <dd className={`mt-0.5 ${istOffen(p.wert) ? "offen" : ""}`}>{p.wert}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
        <p className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="daten">Offen einsehbar</span>
          <a href={site.github} className="underline underline-offset-4 hover:text-brand-dark">
            Observability-Stack auf GitHub: danielrichterit/grafana-stack
          </a>
        </p>
      </div>
    </section>
  );
}
