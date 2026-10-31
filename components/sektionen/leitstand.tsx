import { Reveal } from "@/components/motion/reveal";
import { Datenstrom } from "@/components/effekte/datenstrom";
import { MonitorKachel } from "@/components/effekte/monitor-kachel";
import { Terminal } from "@/components/effekte/terminal";
import { DekodierText } from "@/components/effekte/dekodier-text";
import { monitor, terminal } from "@/lib/inhalte";

/**
 * Leitstand: zeigt, wie Daniel arbeitet. Links Monitoring (Grafana-Stack als Idee),
 * rechts ein Ansible-Lauf. Werte und Ausgabe sind BEISPIELE für die Präsentation.
 */
export function Leitstand() {
  return (
    <section id="leitstand" aria-labelledby="leitstand-titel" className="relative isolate scroll-mt-(--header-h) overflow-hidden py-(--section-y)">
      {/* Hintergrund animiert: Datenstrom, dezent */}
      <Datenstrom className="absolute inset-0 -z-10 size-full opacity-60" />
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="leitstand-titel" className="titel-linie max-w-[14ch] text-h2">
            Messen. Eingreifen. Wieder messen.
          </h2>
          <div className="grid gap-4">
            <p className="max-w-measure text-lead text-text-muted">
              Jede Optimierung beginnt mit Zahlen und endet mit Zahlen. Monitoring zeigt, wo es hakt. Automatisierung sorgt
              dafür, dass die Lösung jeden Tag gleich zuverlässig läuft.
            </p>
            <span className="daten">
              <DekodierText text="Leitstand · Beispielansicht" />
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {monitor.map((m, i) => (
              <Reveal key={m.kennung} index={i}>
                <MonitorKachel {...m} />
              </Reveal>
            ))}
          </div>
          <Reveal index={2}>
            <Terminal zeilen={terminal} titel="pve-01 · ansible" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
