import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { Kontakt } from "@/components/sektionen/kontakt";
import { DossierAnsicht } from "@/components/wissen/dossier-ansicht";
import { Tiefe } from "@/components/wissen/wissen-liste";
import { VbsInstrument } from "@/components/sektionen/vbs-moment";
import { AusfallNetz } from "@/components/werkzeuge/ausfall-netz";
import { Fehler502Demo } from "@/components/sektionen/fehler-502";
import { Fehlersuche } from "@/components/leistungen/fehlersuche";
import { FirewallSchema } from "@/components/faelle/firewall-schema";
import { referenzen } from "@/lib/inhalte";
import { dossier, fertigeDossiers, type Ausprobieren } from "@/lib/wissen";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";

type Seite = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return fertigeDossiers.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Seite) {
  const d = dossier((await params).slug);
  if (!d || d.status !== "bereit") return {};
  return seitenMetadaten({ titel: d.titel.replace(/\.$/, ""), beschreibung: d.kurz, pfad: `/wissen/${d.slug}` });
}

/** Interaktives Element je Dossier, vorhandene Bausteine wiederverwendet */
function Element({ art }: { art: Ausprobieren }) {
  if (art === "vbs") return <VbsInstrument />;
  if (art === "ausfall") return <AusfallNetz />;
  if (art === "502") return <Fehler502Demo kompakt />;
  if (art === "schichten") return <Fehlersuche />;
  return <FirewallSchema />;
}

/** Dossier-Seite: Lesemodus, In 30 Sekunden, Kapitel mit Leiste, Ausprobieren, Fragen, Kontakt. */
export default async function DossierSeite({ params }: Seite) {
  const d = dossier((await params).slug);
  if (!d || d.status !== "bereit") notFound();
  const url = `${site.url}/wissen/${d.slug}`;
  const fall = d.fuerSie?.fall ? referenzen.find((f) => f.slug === d.fuerSie?.fall) : undefined;

  const kopf = (
    <>
      <span className="daten flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="text-brand-dark">
          {d.kennung} · {d.bereich}
        </span>
        <span>{d.minuten} min</span>
        <Tiefe stufe={d.tiefe} />
      </span>
      <h1 id="dossier-titel" className="titel-linie max-w-[20ch] text-h2">
        {d.titel}
      </h1>
    </>
  );

  const verweise = (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {fall && (
        <Link href={`/faelle/${fall.slug}`} className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
          Fall: {fall.titel} <span aria-hidden="true">→</span>
        </Link>
      )}
      {d.fuerSie?.leistung && (
        <Link href={d.fuerSie.leistung.pfad} className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
          Leistung: {d.fuerSie.leistung.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );

  return (
    <>
      <JsonLd
        daten={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: d.titel,
              description: d.kurz,
              url,
              dateModified: d.geaendert,
              author: { "@type": "Person", name: "Daniel Richter" },
              publisher: { "@type": "ProfessionalService", name: site.firma, url: site.url },
            },
            ...(d.fragen
              ? [
                  {
                    "@type": "FAQPage",
                    mainEntity: d.fragen.map((f) => ({ "@type": "Question", name: f.frage, acceptedAnswer: { "@type": "Answer", text: f.antwort } })),
                  },
                ]
              : []),
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Start", item: site.url },
                { "@type": "ListItem", position: 2, name: "Wissen", item: `${site.url}/wissen` },
                { "@type": "ListItem", position: 3, name: d.titel, item: url },
              ],
            },
          ],
        }}
      />
      <DossierAnsicht dossier={d} kopf={kopf} verweise={verweise} ausprobieren={d.ausprobieren ? <Element art={d.ausprobieren.art} /> : undefined} />
      <Kontakt />
    </>
  );
}
