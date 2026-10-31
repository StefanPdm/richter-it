import { Button } from "@/components/ui/button";
import { KiVideo } from "@/components/medien/ki-video";
import { site } from "@/lib/site";

/**
 * Signature-Hero: H1 sofort sichtbar (LCP), dahinter KI-Video 01
 * "Serverhalle als Megastruktur" (bis dahin gezeichneter Platzhalter).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-titel" className="relative overflow-hidden border-b border-border">
      <KiVideo szene="megastruktur" className="absolute inset-0 size-full" />
      {/* Scrim: nur unter dem Text, damit er auf jedem Bild lesbar bleibt */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_8%,color-mix(in_srgb,var(--color-bg)_70%,transparent)_42%,transparent_75%)]"
      />
      <div className="scan" aria-hidden="true" />

      <div className="relative mx-auto max-w-wide px-(--gutter)">
        <div className="flex flex-wrap justify-between gap-4 pt-6" aria-hidden="true">
          <span className="daten text-text opacity-85">Open Source · On-Premises</span>
          <span className="daten text-text opacity-85">Potsdam · seit 2019</span>
        </div>

        <div className="grid gap-7 pt-[clamp(9rem,22vw,20rem)] pb-[clamp(3rem,6vw,5rem)]">
          <h1 id="hero-titel" className="text-display">
            Mehr Leistung.
            <br />
            Ohne Neubau.
          </h1>
          <div className="grid items-end gap-7 md:grid-cols-[minmax(0,1fr)_auto]">
            <p className="max-w-measure text-lead">
              Ich optimiere IT-Infrastrukturen für mittelständische Unternehmen, Behörden und Landesanstalten. Mit
              Open-Source-Software, die bei Ihnen im Haus läuft, und mit gezielten Eingriffen statt großer Umbauten.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={site.aktion.href} pfeil>
                {site.aktion.label}
              </Button>
              <Button href="#messung" variante="secondary">
                Ein Beispiel ansehen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
