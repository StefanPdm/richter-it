import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { DekodierText } from "@/components/effekte/dekodier-text";
import { Netzwerk } from "@/components/effekte/netzwerk";
import freigestellt from "@/public/images/daniel-richter-freigestellt.png";

const profil = [
  { label: "Rolle", wert: "Inhaber" },
  { label: "Standort", wert: "Potsdam" },
  { label: "Seit", wert: "2019" },
  { label: "Schwerpunkt", wert: "Open Source, On-Premises" },
  { label: "Aufgaben", wert: "Consulting, Strategie, Umsetzung" },
  { label: "Team", wert: "Steffen (System Engineer), Benjamin (Backoffice)" },
] as const;

/**
 * Profil im Leitstand-Stil. Freigestelltes Porträt mit goldenem Kantenlicht
 * steht vor einem Lichtkegel und dem Knoten-Netz in der Akzentfarbe.
 */
export function Person() {
  return (
    <section id="ueber-mich" aria-labelledby="person-titel" className="relative isolate scroll-mt-(--header-h) overflow-hidden py-(--section-y)">
      {/* Hintergrund animiert: Knoten-Netz über die ganze Sektion, dezent */}
      <Netzwerk className="absolute inset-0 -z-10 size-full opacity-45" dichte={0.7} />
      <div className="mx-auto grid max-w-wide gap-[clamp(2rem,5vw,5rem)] px-(--gutter) md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center">
        <Reveal className="hud-rahmen relative aspect-[4/5] max-w-full overflow-hidden border border-border p-2">
          <div className="relative size-full overflow-hidden bg-bg-alt">
            {/* Lichtkegel hinter Daniel, Farbe aus der Welt */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(60%_55%_at_55%_40%,color-mix(in_srgb,var(--color-brand)_30%,transparent),transparent_70%)]"
            />
            <Image
              src={freigestellt}
              alt="Daniel Richter, Inhaber von Daniel Richter IT-Dienstleistungen"
              sizes="(min-width: 56rem) 40vw, 100vw"
              className="absolute inset-x-0 bottom-0 h-[94%] w-full object-contain object-bottom"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_0%,transparent_30%)]" />
            <span className="daten absolute bottom-4 left-4 bg-bg/75 px-2.5 py-1.5 text-text">
              <DekodierText text="ID · D.RICHTER · VERIFIZIERT" />
            </span>
          </div>
        </Reveal>
        <Reveal index={1} className="grid gap-6">
          <h2 id="person-titel" className="titel-linie titel-glitch text-h2">
            Daniel Richter
          </h2>
          <p className="max-w-measure text-lead">
            Als Inhaber baue ich seit 2019 IT-Infrastrukturen mit Open-Source-Werkzeugen auf und mache bestehende schneller und
            stabiler.
          </p>
          <p className="max-w-measure text-text-muted">
            Kunden kommen meist über Empfehlung zu mir, und viele kommen wieder. Im Hintergrund arbeiten Steffen
            (Systemadministration und Wartung) und Benjamin (Backoffice) mit. Hardware beziehe ich über die Thomas Krenn
            AG, Proxmox-Schulungen gibt es mit ProxForge.
          </p>
          <dl className="grid border-t border-border sm:grid-cols-2">
            {profil.map((p) => (
              <div key={p.label} className="flex items-baseline justify-between gap-4 border-b border-border py-3 sm:odd:pr-6 sm:even:border-l sm:even:pl-6">
                <dt className="daten">{p.label}</dt>
                <dd className="m-0 text-right">{p.wert}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
