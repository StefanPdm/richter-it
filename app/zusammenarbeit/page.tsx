import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Kontakt } from "@/components/sektionen/kontakt";
import { Dokument } from "@/components/zusammenarbeit/dokument";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { Reveal } from "@/components/motion/reveal";
import { ThemaKnopf } from "@/components/ui/thema-knopf";
import { zusammenarbeit } from "@/lib/inhalte";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = seitenMetadaten({
  titel: "So arbeiten wir: vom Audit bis zur Abnahme",
  beschreibung:
    "Kostenloses Audit, Projektplan, Team aus dem Partnernetz, Umsetzung mit Tests und ein unterschriebenes Abnahmeprotokoll. Jeder Schritt mit einem Ergebnis.",
  pfad: "/zusammenarbeit",
});

/**
 * Seite Zusammenarbeit: Seitenkopf, fünf Schritte abwechselnd neben ihrem Dokument
 * (stilisiert, ohne erfundene Kundendaten), Kontakt. Von der Startseite über das Band verlinkt.
 */
export default function Zusammenarbeit() {
  const { schritte } = zusammenarbeit;
  return (
    <>
      <JsonLd
        daten={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "HowTo",
              name: "Zusammenarbeit mit Daniel Richter: vom Audit bis zur Abnahme",
              description: zusammenarbeit.lead,
              step: schritte.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.titel, text: s.text })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Start", item: site.url },
                { "@type": "ListItem", position: 2, name: "Zusammenarbeit", item: `${site.url}/zusammenarbeit` },
              ],
            },
          ],
        }}
      />

      <section aria-labelledby="zusammenarbeit-seite-titel" className="relative isolate border-b border-border pt-[clamp(3rem,7vw,6rem)] pb-[clamp(2.5rem,5vw,4rem)]">
        <Sektionsgrund licht="links-oben" motiv="lineal" />
        <div className="mx-auto grid max-w-wide grid-cols-1 gap-6 px-(--gutter)">
          <nav aria-label="Brotkrumen" className="daten flex flex-wrap items-center gap-x-2">
            <Link href="/" className="inline-flex min-h-11 min-w-11 items-center hover:text-text">
              Start
            </Link>
            / <span className="text-text">Zusammenarbeit</span>
          </nav>
          <h1 id="zusammenarbeit-seite-titel" className="titel-linie max-w-[18ch] text-h2">
            {zusammenarbeit.titel}
          </h1>
          <p className="max-w-measure text-lead text-text-muted">{zusammenarbeit.lead}</p>
          <ThemaKnopf thema={{ anliegen: "Audit", betreff: "Kostenloses Audit" }} className="justify-self-start">
            Kostenloses Audit anfragen
          </ThemaKnopf>
        </div>
      </section>

      <section aria-labelledby="schritte-titel" className="relative isolate bg-bg-alt py-(--section-y)">
        <Sektionsgrund licht="rechts-oben" motiv="raster" />
        <h2 id="schritte-titel" className="sr-only">
          Die fünf Schritte
        </h2>
        <ol className="mx-auto grid max-w-wide gap-[clamp(4rem,9vw,8rem)] px-(--gutter)">
          {schritte.map((s, i) => {
            const gespiegelt = i % 2 === 1;
            return (
              <li key={s.kurz} className="grid grid-cols-1 items-center gap-[clamp(3.5rem,5vw,4rem)] md:grid-cols-2">
                <Reveal className={`grid gap-4 ${gespiegelt ? "md:order-2" : ""}`}>
                  <span className="daten">
                    <span className="text-brand-dark">0{i + 1}</span> / 0{schritte.length} · {s.kurz}
                  </span>
                  <h3 className="text-h3">{s.titel}</h3>
                  <p className="max-w-measure text-text-muted">{s.text}</p>
                </Reveal>
                <Reveal index={1} className={`w-full max-w-md justify-self-center ${gespiegelt ? "md:order-1 md:-rotate-1" : "md:rotate-1"}`}>
                  <Dokument art={i as 0 | 1 | 2 | 3 | 4} titel={s.dokument} />
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      <Kontakt />
    </>
  );
}
