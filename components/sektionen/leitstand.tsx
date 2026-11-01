import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { MonitorKachel } from "@/components/effekte/monitor-kachel";
import { Terminal } from "@/components/effekte/terminal";
import { DekodierText } from "@/components/effekte/dekodier-text";
import { fertigeModule, monitor, observability, terminalLaeufe } from "@/lib/inhalte";
import { site } from "@/lib/site";
import { ThemaKnopf } from "@/components/ui/thema-knopf";
import kontrollraum from "@/public/images/kontrollraum-hologramm.jpg";

/**
 * Leitstand: Wie Daniel arbeitet. Observability (Stack von der bestehenden Website),
 * Monitorkacheln und Ansible-Lauf (BEISPIELWERTE), fertige Module (bestehende Website).
 * Hintergrund bewegt: Kontrollraum mit langsamer Kamerafahrt und Scan-Strahl.
 */
export function Leitstand() {
  return (
    <section id="leitstand" aria-labelledby="leitstand-titel" className="relative isolate scroll-mt-(--header-h) overflow-hidden py-(--section-y)">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <Image src={kontrollraum} alt="" sizes="100vw" className="kamerafahrt size-full object-cover" />
      </div>
      {/* Scrim: Kontrollraum bleibt als Stimmung, Inhalte stehen auf ruhigem Grund */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--color-bg)_0%,color-mix(in_srgb,var(--color-bg)_72%,transparent)_18%,color-mix(in_srgb,var(--color-bg)_42%,transparent)_45%,color-mix(in_srgb,var(--color-bg)_70%,transparent)_80%,var(--color-bg)_100%)]" />
      <div className="scan-strahl -z-10" aria-hidden="true" />

      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="leitstand-titel" className="titel-linie titel-glitch max-w-[14ch] text-h2">
            Messen. Eingreifen. Wieder messen.
          </h2>
          <div className="grid gap-4">
            <p className="max-w-measure text-lead">
              Monitoring ist nicht alles. Observability wertet nicht nur die CPU-Last aus, sondern auch Logs, Traces und
              Metriken aller Systeme. So werden Störungen und Optimierungspunkte sichtbar, bevor sie jemand meldet.
            </p>
            <span className="daten">
              <DekodierText text="Leitstand · Beispielansicht" />
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-(--gap-karten) lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="grid grid-cols-1 gap-(--gap-karten) sm:grid-cols-2">
            {monitor.map((m, i) => (
              <Reveal key={m.kennung} index={i}>
                <MonitorKachel {...m} />
              </Reveal>
            ))}
          </div>
          <Reveal index={2}>
            <Terminal laeufe={terminalLaeufe} titel="pve-01 · ansible" />
          </Reveal>
        </div>

        {/* Stack und fertige Module, Inhalte von der bestehenden Website */}
        <div className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-10 border-t border-border pt-10 md:grid-cols-2">
          <Reveal className="grid content-start gap-5">
            <h3 className="text-h3">Der Observability-Stack</h3>
            <ul className="grid gap-x-6 sm:grid-cols-2">
              {observability.map((o) => (
                <li key={o.name} className="flex items-baseline justify-between gap-3 border-b border-border py-2.5">
                  <span className="font-medium">{o.name}</span>
                  <span className="daten">{o.rolle}</span>
                </li>
              ))}
            </ul>
            <p className="max-w-measure text-text-muted">
              Auf Basis von Docker Compose vorbereitet, Alloy als Gateway. Vorlagen für Node-Exporter und Alloy binden neue
              Systeme in Minuten an.{" "}
              <a href={site.github} className="text-brand-dark underline underline-offset-4">
                Auf GitHub ansehen
              </a>
            </p>
          </Reveal>
          <Reveal index={1} className="grid content-start gap-5">
            <h3 className="text-h3">Fertige Module</h3>
            <ul className="grid gap-2.5">
              {fertigeModule.map((m) => (
                <li key={m.name} className="grid gap-1 border-b border-border pb-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-sm text-text-muted">{m.inhalt}</span>
                </li>
              ))}
            </ul>
            <p className="max-w-measure text-text-muted">
              Auf Wunsch mit Semaphore UI oder Forgejo als Oberfläche für die Automatisierung. Neue Playbooks entstehen
              laufend, auch angepasst an Ihre Infrastruktur.
            </p>
            <ThemaKnopf thema={{ anliegen: "Audit", betreff: "Monitoring- und Automatisierungs-Check" }} variante="secondary" className="justify-self-start">
              Monitoring-Check anfragen
            </ThemaKnopf>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
