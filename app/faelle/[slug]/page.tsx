import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { Kontakt } from "@/components/sektionen/kontakt";
import { VbsMoment } from "@/components/sektionen/vbs-moment";
import { FirewallSchema } from "@/components/faelle/firewall-schema";
import { Zeitleiste } from "@/components/faelle/zeitleiste";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { KartenFuss } from "@/components/ui/karten-fuss";
import { Reveal } from "@/components/motion/reveal";
import { referenzen, istOffen, type Fall } from "@/lib/inhalte";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";

type Seite = { params: Promise<{ slug: string }> };

const finde = (slug: string) => referenzen.find((f) => f.slug === slug);

export function generateStaticParams() {
  return referenzen.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Seite) {
  const fall = finde((await params).slug);
  if (!fall) return {};
  return seitenMetadaten({ titel: `Fall: ${fall.titel}`, beschreibung: fall.seite.beschreibung, pfad: `/faelle/${fall.slug}` });
}

/** Grafik je Fall. VBS nutzt das Messinstrument der Startseite als eigene Sektion. */
function Grafik({ fall }: { fall: Fall }) {
  if (fall.slug === "firewall-engpass") return <FirewallSchema />;
  if (fall.slug === "altsystem") return <Zeitleiste jahre={18} />;
  return null;
}

/**
 * Fallseite (Leistungsseite aus seitentypen.md, angepasst): Seitenkopf mit Kennzahlen,
 * Ausgangslage, Vorgehen und Ergebnis neben der Grafik, weitere Fälle, Kontakt.
 * Anonym: keine Kunden, keine Branche mit Rückschluss.
 */
export default async function FallSeite({ params }: Seite) {
  const fall = finde((await params).slug);
  if (!fall) notFound();
  const nummer = String(referenzen.indexOf(fall) + 1).padStart(2, "0");
  const andere = referenzen.filter((f) => f.slug !== fall.slug);
  const url = `${site.url}/faelle/${fall.slug}`;
  const mitVbs = fall.slug === "vbs-leistung";

  return (
    <>
      <JsonLd
        daten={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: fall.titel,
              description: fall.seite.beschreibung,
              url,
              author: { "@type": "Person", name: "Daniel Richter" },
              publisher: { "@type": "ProfessionalService", name: site.firma, url: site.url },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Start", item: site.url },
                { "@type": "ListItem", position: 2, name: "Referenzen", item: `${site.url}/#referenzen` },
                { "@type": "ListItem", position: 3, name: fall.titel, item: url },
              ],
            },
          ],
        }}
      />

      {/* Seitenkopf */}
      <section aria-labelledby="fall-titel" className="relative isolate border-b border-border pt-[clamp(3rem,7vw,6rem)] pb-[clamp(2.5rem,5vw,4rem)]">
        <Sektionsgrund licht="links-oben" motiv="lineal" />
        {/* grid-cols-1: Spalte folgt der Breite, nicht dem längsten Wort (sonst Überbreite) */}
        <div className="mx-auto grid max-w-wide grid-cols-1 gap-6 px-(--gutter)">
          <nav aria-label="Brotkrumen" className="daten flex flex-wrap items-center gap-x-2">
            <Link href="/" className="inline-flex min-h-11 min-w-11 items-center hover:text-text">
              Start
            </Link>
            /
            <Link href="/#referenzen" className="inline-flex min-h-11 items-center hover:text-text">
              Referenzen
            </Link>
            / <span className="text-text">Fall {nummer}</span>
          </nav>
          <span className="daten text-brand-dark">
            Fall {nummer} · {fall.bereich}
          </span>
          <h1 id="fall-titel" className="titel-linie max-w-[18ch] text-h2">
            {fall.titel}
          </h1>
          <p className="max-w-measure text-lead text-text-muted">{fall.seite.lead}</p>
          <dl className="mt-4 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
            {fall.seite.fakten.map((f) => (
              <div key={f.label} className="grid min-w-0 gap-1.5">
                <dt className="daten order-2">{f.label}</dt>
                <dd className={`order-1 font-mono text-zahl font-medium wrap-anywhere ${istOffen(f.wert) ? "offen" : "text-brand-dark"}`}>{f.wert}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {mitVbs && <VbsMoment />}

      {/* Ausgangslage, Vorgehen, Ergebnis neben der Grafik */}
      <section aria-labelledby="fall-verlauf" className="relative isolate bg-bg-alt py-(--section-y)">
        <Sektionsgrund licht="rechts-unten" motiv="puls" />
        <div className={`mx-auto grid max-w-wide grid-cols-1 items-start gap-[clamp(2.5rem,5vw,5rem)] px-(--gutter) ${mitVbs ? "" : "lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]"}`}>
          <div className="grid gap-[clamp(2rem,4vw,3rem)]">
            <h2 id="fall-verlauf" className="sr-only">
              Verlauf des Falls
            </h2>
            {fall.seite.abschnitte.map((a, i) => (
              <Reveal key={a.titel} index={i} as="article" className="grid gap-3 border-l-2 border-border pl-5">
                <span className="daten text-brand-dark">0{i + 1}</span>
                <h3 className="text-h3">{a.titel}</h3>
                <p className="max-w-measure text-text-muted">{a.text}</p>
              </Reveal>
            ))}
          </div>
          {!mitVbs && (
            <Reveal index={1} className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <Grafik fall={fall} />
            </Reveal>
          )}
        </div>
      </section>

      {/* Weitere Fälle */}
      <section aria-labelledby="weitere-faelle" className="py-(--section-y)">
        <div className="mx-auto grid max-w-wide gap-8 px-(--gutter)">
          <h2 id="weitere-faelle" className="text-h3">
            Weitere Fälle
          </h2>
          <ul className="grid gap-(--gap-karten) md:grid-cols-2">
            {andere.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/faelle/${f.slug}`}
                  className="hud-rahmen group flex h-full flex-col gap-4 border border-border bg-surface p-[clamp(1.5rem,3vw,2.25rem)] transition-colors duration-(--dur-base) hover:border-brand"
                >
                  <span className="daten text-brand-dark">
                    Fall {String(referenzen.indexOf(f) + 1).padStart(2, "0")} · {f.bereich}
                  </span>
                  <span className="font-display text-h3 font-medium [font-stretch:80%]">{f.titel}</span>
                  <span className="text-text-muted">{f.punkte[0].wert}</span>
                  <KartenFuss links={<span className="daten">{f.kurz}</span>}>
                    <span className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
                      Fall lesen <span aria-hidden="true" className="transition-transform duration-(--dur-fast) group-hover:translate-x-1">→</span>
                    </span>
                  </KartenFuss>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Kontakt />
    </>
  );
}
