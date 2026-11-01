import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/reveal";
import { HorizontalSpur } from "@/components/motion/horizontal-spur";
import { LichtkegelKarte } from "@/components/effekte/lichtkegel-karte";
import { ThemaLink } from "@/components/ui/thema-knopf";
import { leistungen } from "@/lib/inhalte";

/**
 * Leistungen als Module eines Leitstands: Kennung, Titel, Satz, Technik. Lichtkegel folgt der Maus.
 * Die Module laufen als horizontale Spur durch (beim Scrollen von rechts nach links).
 */
export function Leistungen() {
  return (
    <section id="leistungen" aria-labelledby="leistungen-titel" className="scroll-mt-(--header-h) bg-bg-alt py-(--section-y) transition-colors duration-(--dur-welt)">
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="leistungen-titel" className="titel-linie titel-glitch max-w-[16ch] text-h2">
            Was ich für Ihre Infrastruktur tue
          </h2>
          <p className="max-w-measure text-lead text-text-muted">
            Proxmox-Experte für effiziente IT-Infrastrukturen: bestehende Systeme schneller und stabiler machen, mit Open
            Source und ohne Bindung an einen Hersteller.
          </p>
        </Reveal>
      </div>
      <HorizontalSpur label="Leistungen">
        {leistungen.map((l, i) => (
          /* Versatz nur für die ersten Karten, spätere fahren ohnehin seitlich herein */
          <Reveal as="li" key={l.titel} index={Math.min(i, 2)}>
            <LichtkegelKarte className="flex h-full flex-col gap-5 border border-border bg-surface p-[clamp(1.5rem,3vw,2.5rem)] transition-[border-color,background-color] duration-(--dur-base)">
              <div className="flex items-baseline justify-between gap-4">
                <span className="daten text-brand-dark">MOD-{String(i + 1).padStart(2, "0")} · {l.kennung}</span>
                <span className="status-punkt" aria-hidden="true" />
              </div>
              <h3 className="text-h3">{l.titel}</h3>
              <p className="max-w-measure text-text-muted">{l.text}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {l.technik.map((t, j) => (
                  <span key={t} className="tag daten border border-border px-2.5 py-1.5" style={{ "--i": j } as CSSProperties}>
                    {t}
                  </span>
                ))}
              </div>
              <ThemaLink thema={{ anliegen: "Angebot", betreff: `Anfrage: ${l.titel}` }} className="mt-auto">
                Dazu anfragen
              </ThemaLink>
            </LichtkegelKarte>
          </Reveal>
        ))}
      </HorizontalSpur>
    </section>
  );
}
