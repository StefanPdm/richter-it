import type { CSSProperties } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { HorizontalSpur } from "@/components/motion/horizontal-spur";
import { LichtkegelKarte } from "@/components/effekte/lichtkegel-karte";
import { ThemaLink } from "@/components/ui/thema-knopf";
import { leistungen } from "@/lib/inhalte";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { MitBegriffen } from "@/components/ui/begriff";
import { KartenFuss } from "@/components/ui/karten-fuss";

/**
 * Leistungen als Module eines Leitstands: Kennung, Titel, Satz, Technik. Lichtkegel folgt der Maus.
 * Die Module laufen als horizontale Spur durch (beim Scrollen von rechts nach links),
 * die Überschrift klebt mit und bleibt stehen, bis alle Module durch sind.
 */
export function Leistungen() {
  return (
    <section id="leistungen" aria-labelledby="leistungen-titel" className="relative isolate scroll-mt-(--header-h) bg-bg-alt py-(--section-y) transition-colors duration-(--dur-welt)">
      <Sektionsgrund licht="rechts-unten" motiv="lineal" />
      <HorizontalSpur
        label="Leistungen"
        kopf={
          <Reveal className="mx-auto grid max-w-wide gap-6 px-(--gutter) md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
            <h2 id="leistungen-titel" className="titel-linie titel-glitch max-w-[16ch] text-h2 [@media(max-height:50rem)]:text-[clamp(2.25rem,1.4rem+2.2vw,3rem)]">
              Was ich für Ihre Infrastruktur tue
            </h2>
            <p className="max-w-measure text-lead text-text-muted">
              Proxmox-Experte für effiziente IT-Infrastrukturen: bestehende Systeme schneller und stabiler machen, mit
              Open Source und ohne Bindung an einen Hersteller.
            </p>
          </Reveal>
        }
      >
        {leistungen.map((l, i) => (
          /* Versatz nur für die ersten Karten, spätere fahren ohnehin seitlich herein */
          <Reveal as="li" key={l.titel} index={Math.min(i, 2)}>
            <LichtkegelKarte className="flex h-full flex-col gap-5 border border-border bg-surface p-[clamp(1.5rem,3vw,2.5rem)] [@media(max-height:50rem)]:gap-4 [@media(max-height:50rem)]:p-6 transition-[border-color,background-color] duration-(--dur-base)">
              <div className="flex items-baseline justify-between gap-4">
                <span className="daten text-brand-dark">MOD-{String(i + 1).padStart(2, "0")} · {l.kennung}</span>
                <span className="status-punkt" aria-hidden="true" />
              </div>
              <h3 className="text-h3">{l.titel}</h3>
              <p className="max-w-measure text-text-muted">
                <MitBegriffen text={l.text} />
              </p>
              <div className="flex flex-wrap gap-2 pt-2 [@media(max-height:44rem)]:hidden">
                {l.technik.map((t, j) => (
                  <span key={t} className="tag daten border border-border px-2.5 py-1.5" style={{ "--i": j } as CSSProperties}>
                    {t}
                  </span>
                ))}
              </div>
              <KartenFuss
                links={
                  "seite" in l && (
                    <Link href={l.seite.pfad} className="zucken group/seite inline-flex min-h-11 items-center gap-2 text-sm font-medium text-text hover:text-brand-dark">
                      {l.seite.label}
                      <span aria-hidden="true" className="transition-transform duration-(--dur-fast) ease-out [@media(hover:hover)]:group-hover/seite:translate-x-1">
                        →
                      </span>
                    </Link>
                  )
                }
              >
                <ThemaLink thema={{ anliegen: "Angebot", betreff: `Anfrage: ${l.titel}` }}>Jetzt anfragen</ThemaLink>
              </KartenFuss>
            </LichtkegelKarte>
          </Reveal>
        ))}
      </HorizontalSpur>
    </section>
  );
}
