import Image from "next/image";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Netzwerk } from "@/components/effekte/netzwerk";
import { DekodierText } from "@/components/effekte/dekodier-text";
import { Uhr } from "@/components/effekte/uhr";
import { Magnet } from "@/components/effekte/magnet";
import { site } from "@/lib/site";
import abendlicht from "@/public/images/daniel-richter-abendlicht.jpg";

/**
 * Hero "Leitstand im Abendlicht": Daniel vor der Skyline als Bühne,
 * darüber Knoten-Netz (Logo-Motiv), Raster-Boden und HUD-Zeilen.
 * H1 sofort sichtbar, das Bild ist das LCP-Element (priority).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-titel" className="relative isolate overflow-hidden border-b border-border">
      <Image
        src={abendlicht}
        alt="Daniel Richter vor der Skyline im Abendlicht"
        priority
        placeholder="blur"
        sizes="100vw"
        className="absolute inset-0 -z-20 size-full object-cover object-[70%_30%]"
      />
      {/* Scrim: links dunkel für den Text, rechts bleibt Daniel im Licht */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-bg)_0%,color-mix(in_srgb,var(--color-bg)_82%,transparent)_38%,transparent_70%),linear-gradient(to_top,var(--color-bg)_2%,transparent_40%)]"
      />
      <Netzwerk className="absolute inset-y-0 left-0 -z-10 h-full w-full md:w-[62%]" />
      <div className="raster-boden -z-10" aria-hidden="true" />
      <div className="scan" aria-hidden="true" />

      <div className="relative mx-auto max-w-wide px-(--gutter)">
        {/* HUD-Zeile: fährt beim Laden ein */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6" aria-hidden="true">
          <span className="hud-ein daten flex items-center gap-2.5 bg-bg/75 px-2.5 py-1.5 text-text" style={{ "--i": 0 } as CSSProperties}>
            <span className="status-punkt" />
            <DekodierText text="System online · daniel-richter.it" />
          </span>
          <span className="hud-ein daten bg-bg/75 px-2.5 py-1.5 text-text" style={{ "--i": 1 } as CSSProperties}>
            Potsdam · 52.39°N 13.06°E · <Uhr />
          </span>
        </div>

        <div className="grid min-h-[min(88svh,56rem)] content-end gap-8 pt-24 pb-[clamp(3rem,7vw,6rem)] md:max-w-[min(62%,52rem)]">
          <h1 id="hero-titel" className="text-display">
            Mehr Leistung.
            <br />
            <span className="leuchten text-brand-dark">Ohne Neubau.</span>
          </h1>
          <p className="max-w-measure text-lead">
            Ich optimiere IT-Infrastrukturen für mittelständische Unternehmen, Behörden und Landesanstalten. Mit
            Open-Source-Software, die bei Ihnen im Haus läuft, und mit gezielten Eingriffen statt großer Umbauten.
          </p>
          <div className="flex flex-wrap gap-3">
            <Magnet>
              <Button href={site.aktion.href} pfeil>
                {site.aktion.label}
              </Button>
            </Magnet>
            <Button href="#leitstand" variante="secondary">
              Live in den Leitstand
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
