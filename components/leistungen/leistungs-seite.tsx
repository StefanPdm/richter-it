import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import { Kontakt } from "@/components/sektionen/kontakt";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { KartenFuss } from "@/components/ui/karten-fuss";
import { ThemaKnopf } from "@/components/ui/thema-knopf";
import { Reveal } from "@/components/motion/reveal";
import { referenzen, type Leistungsseite } from "@/lib/inhalte";
import { werkzeug } from "@/lib/werkzeuge";
import { site } from "@/lib/site";

type Props = {
  /** Inhalte der Seite aus lib/inhalte.ts (leistungsseiten) */
  daten: Leistungsseite;
  /** Grafik rechts neben den Abschnitten */
  grafik: ReactNode;
};

/** Karte für einen weiterführenden Link (Fall oder Werkzeug) */
function Verweis({ href, kennung, titel, satz, aktion }: { href: string; kennung: string; titel: string; satz: string; aktion: string }) {
  return (
    <li>
      <Link
        href={href}
        className="hud-rahmen group flex h-full flex-col gap-4 border border-border bg-surface p-[clamp(1.5rem,3vw,2.25rem)] transition-colors duration-(--dur-base) hover:border-brand"
      >
        <span className="daten text-brand-dark">{kennung}</span>
        <span className="font-display text-h3 font-medium [font-stretch:80%]">{titel}</span>
        <span className="text-text-muted">{satz}</span>
        <KartenFuss>
          <span className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
            {aktion} <span aria-hidden="true" className="transition-transform duration-(--dur-fast) group-hover:translate-x-1">→</span>
          </span>
        </KartenFuss>
      </Link>
    </li>
  );
}

/**
 * Vorlage für Leistungsseiten (seitentypen.md, Leistungsseite): Seitenkopf mit Kennzahlen,
 * Abschnitte neben einer Grafik, passende Fälle und Werkzeuge, Kontakt.
 */
export function LeistungsSeite({ daten, grafik }: Props) {
  const url = `${site.url}${daten.pfad}`;
  const faelle = daten.faelle.map((slug) => referenzen.find((f) => f.slug === slug)!);
  const thema = { anliegen: "Angebot" as const, betreff: `Anfrage: ${daten.name}` };

  return (
    <>
      <JsonLd
        daten={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: daten.name,
              description: daten.beschreibung,
              provider: { "@type": "ProfessionalService", name: site.firma, url: site.url },
              areaServed: "DE",
              url,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Start", item: site.url },
                { "@type": "ListItem", position: 2, name: "Leistungen", item: `${site.url}/#leistungen` },
                { "@type": "ListItem", position: 3, name: daten.name, item: url },
              ],
            },
          ],
        }}
      />

      {/* Seitenkopf */}
      <section aria-labelledby="leistung-titel" className="relative isolate border-b border-border pt-[clamp(3rem,7vw,6rem)] pb-[clamp(2.5rem,5vw,4rem)]">
        <Sektionsgrund licht="links-oben" motiv="lineal" />
        <div className="mx-auto grid max-w-wide grid-cols-1 gap-6 px-(--gutter)">
          <nav aria-label="Brotkrumen" className="daten flex flex-wrap items-center gap-x-2">
            <Link href="/" className="inline-flex min-h-11 min-w-11 items-center hover:text-text">
              Start
            </Link>
            /
            <Link href="/#leistungen" className="inline-flex min-h-11 items-center hover:text-text">
              Leistungen
            </Link>
            / <span className="text-text">{daten.name}</span>
          </nav>
          <h1 id="leistung-titel" className="titel-linie max-w-[18ch] text-h2">
            {daten.titel}
          </h1>
          <p className="max-w-measure text-lead text-text-muted">{daten.lead}</p>
          <ThemaKnopf thema={thema} className="justify-self-start">
            Jetzt anfragen
          </ThemaKnopf>
          <dl className="mt-4 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
            {daten.fakten.map((f) => (
              <div key={f.label} className="grid min-w-0 gap-1.5">
                <dt className="daten order-2">{f.label}</dt>
                <dd className="order-1 font-mono text-zahl font-medium wrap-anywhere text-brand-dark">{f.wert}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Abschnitte neben der Grafik */}
      <section aria-label={`${daten.name} im Detail`} className="relative isolate bg-bg-alt py-(--section-y)">
        <Sektionsgrund licht="rechts-unten" motiv="puls" />
        <div className="mx-auto grid max-w-wide grid-cols-1 items-start gap-[clamp(2.5rem,5vw,5rem)] px-(--gutter) lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
          <div className="grid gap-[clamp(2rem,4vw,3rem)]">
            {daten.abschnitte.map((a, i) => (
              <Reveal key={a.titel} index={i} as="article" className="grid gap-3 border-l-2 border-border pl-5">
                <span className="daten text-brand-dark">0{i + 1}</span>
                <h2 className="text-h3">{a.titel}</h2>
                <p className="max-w-measure text-text-muted">{a.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal index={1} className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            {grafik}
          </Reveal>
        </div>
      </section>

      {/* Passende Fälle und Werkzeuge */}
      <section aria-labelledby="passend-titel" className="py-(--section-y)">
        <div className="mx-auto grid max-w-wide gap-8 px-(--gutter)">
          <h2 id="passend-titel" className="text-h3">
            Passend dazu
          </h2>
          <ul className="grid gap-(--gap-karten) md:grid-cols-2 lg:grid-cols-3">
            {faelle.map((f) => (
              <Verweis
                key={f.slug}
                href={`/faelle/${f.slug}`}
                kennung={`Fall ${String(referenzen.indexOf(f) + 1).padStart(2, "0")} · ${f.bereich}`}
                titel={f.titel}
                satz={f.punkte[0].wert}
                aktion="Fall lesen"
              />
            ))}
            {daten.werkzeuge.map((slug) => {
              const w = werkzeug(slug);
              return <Verweis key={slug} href={`/werkzeuge/${slug}`} kennung={`Werkzeug · ${w.kennung}`} titel={w.titel} satz={w.satz} aktion="Werkzeug öffnen" />;
            })}
          </ul>
        </div>
      </section>

      <Kontakt />
    </>
  );
}
