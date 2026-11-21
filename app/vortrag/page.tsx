import Link from "next/link";
import { Kontakt } from "@/components/sektionen/kontakt";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { KartenFuss } from "@/components/ui/karten-fuss";
import { ThemaKnopf } from "@/components/ui/thema-knopf";
import { Reveal } from "@/components/motion/reveal";
import { vortrag } from "@/lib/inhalte";
import { fertigeDossiers } from "@/lib/wissen";
import { seitenMetadaten } from "@/lib/seo";

/* Nur über den QR-Code der Folie erreichbar: nicht indexieren, nicht in der Sitemap */
export const metadata = {
  ...seitenMetadaten({
    titel: "Danke fürs Zuhören",
    beschreibung: "Für Teilnehmer von Daniel Richters Workshops: Dossiers zum Nachlesen, Werkzeuge zum Nachrechnen und der Weg zum kostenlosen Audit.",
    pfad: "/vortrag",
  }),
  robots: { index: false, follow: true },
};

/**
 * Seite für Workshop-Teilnehmer (QR-Code auf der letzten Folie): Begrüßung, Kontakt
 * speichern statt Visitenkarte, drei Wege weiter, alle Dossiers, Kontakt.
 */
export default function Vortrag() {
  const thema = { anliegen: "Erstgespräch" as const, betreff: "Nach dem Workshop" };
  return (
    <>
      <section aria-labelledby="vortrag-titel" className="relative isolate overflow-hidden border-b border-border py-(--section-y)">
        <Sektionsgrund licht="links-oben" motiv="marken" warm />
        <div className="raster-boden -z-10" aria-hidden="true" />
        <div className="mx-auto grid max-w-wide grid-cols-1 gap-6 px-(--gutter)">
          <span className="daten flex items-center gap-2.5 text-text">
            <span className="status-punkt" aria-hidden="true" />
            Vortrag · Danke fürs Zuhören
          </span>
          <h1 id="vortrag-titel" className="titel-linie max-w-[16ch] text-h2">
            {vortrag.titel}
          </h1>
          <p className="max-w-measure text-lead text-text-muted">{vortrag.lead}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ThemaKnopf thema={thema}>Gespräch vereinbaren</ThemaKnopf>
            <a href="/daniel-richter.vcf" download className="zucken inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
              Kontakt speichern <span className="daten">vCard</span>
            </a>
          </div>
          <p className="max-w-measure text-sm text-text-muted">{vortrag.statt}</p>
        </div>
      </section>

      <section aria-labelledby="wege-titel" className="relative isolate bg-bg-alt py-(--section-y)">
        <Sektionsgrund licht="rechts-unten" motiv="puls" />
        <div className="mx-auto grid max-w-wide grid-cols-1 gap-10 px-(--gutter)">
          <h2 id="wege-titel" className="text-h3">
            Wie es weitergeht
          </h2>
          <ul className="grid gap-(--gap-karten) md:grid-cols-3">
            {vortrag.wege.map((w, i) => (
              <Reveal as="li" key={w.pfad} index={i}>
                <Link
                  href={w.pfad}
                  className="hud-rahmen group flex h-full flex-col gap-4 border border-border bg-surface p-[clamp(1.5rem,3vw,2.25rem)] transition-colors duration-(--dur-base) hover:border-brand"
                >
                  <span className="daten text-brand-dark">{w.kennung}</span>
                  <span className="font-display text-h3 font-medium [font-stretch:80%]">{w.titel}</span>
                  <span className="text-text-muted">{w.satz}</span>
                  <KartenFuss>
                    <span className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
                      {w.aktion} <span aria-hidden="true" className="transition-transform duration-(--dur-fast) group-hover:translate-x-1">→</span>
                    </span>
                  </KartenFuss>
                </Link>
              </Reveal>
            ))}
          </ul>

          <div className="grid gap-4">
            <span className="daten">Zum Nachlesen</span>
            <ul className="grid border-t border-border">
              {fertigeDossiers.map((d) => (
                <li key={d.slug} className="border-b border-border">
                  <Link
                    href={`/wissen/${d.slug}`}
                    className="group grid min-h-12 grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-4 py-3 transition-colors duration-(--dur-fast) hover:text-brand-dark"
                  >
                    <span className="daten text-brand-dark">{d.kennung}</span>
                    <span>{d.titel}</span>
                    <span className="daten">{d.minuten} min →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Kontakt />
    </>
  );
}
