import { Reveal } from "@/components/motion/reveal";
import { BildPlatzhalter } from "@/components/ui/bild-platzhalter";

/** Daniel als Marke, das Team im Hintergrund. Porträt: echtes Foto, kein KI-Bild. */
export function Person() {
  return (
    <section id="ueber-mich" aria-labelledby="person-titel" className="scroll-mt-(--header-h) py-(--section-y)">
      <div className="mx-auto grid max-w-wide gap-[clamp(2rem,5vw,5rem)] px-(--gutter) md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end">
        <Reveal>
          <BildPlatzhalter motiv="Porträt Daniel, echtes Foto, Gegenlicht" format="4/5" className="border border-border" />
        </Reveal>
        <Reveal index={1} className="grid gap-5.5">
          <h2 id="person-titel" className="text-h2">
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
          <p className="offen max-w-measure">
            [Prüfen: Website nennt auch „über 10 Jahre Erfahrung“. Art der Partnerschaften klären.]
          </p>
        </Reveal>
      </div>
    </section>
  );
}
