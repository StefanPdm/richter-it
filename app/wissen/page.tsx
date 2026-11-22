import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Kontakt } from "@/components/sektionen/kontakt";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { WissenListe } from "@/components/wissen/wissen-liste";
import { dossiers, fertigeDossiers } from "@/lib/wissen";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = seitenMetadaten({
  titel: "Wissen: IT-Infrastruktur erklärt",
  beschreibung:
    "Dossiers zu VBS, NTP und DNS, Proxmox und Firewalls: in 30 Sekunden für Entscheider, in der Tiefe für Techniker, mit Elementen zum Ausprobieren.",
  pfad: "/wissen",
});

/** Übersicht des Wissensbereichs: Kopf, Suche und Filter, Dossier-Karten, Glossar, Kontakt. */
export default function Wissen() {
  return (
    <>
      <JsonLd
        daten={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Wissen",
          url: `${site.url}/wissen`,
          hasPart: fertigeDossiers.map((d) => ({ "@type": "Article", headline: d.titel, url: `${site.url}/wissen/${d.slug}` })),
        }}
      />
      <section aria-labelledby="wissen-titel" className="relative isolate py-(--section-y)">
        <Sektionsgrund licht="links-oben" motiv="raster" />
        <div className="mx-auto grid max-w-wide grid-cols-1 gap-14 px-(--gutter)">
          <div className="grid gap-5">
            <span className="daten">
              Wissen · {dossiers.length} Dossiers · {fertigeDossiers.length} bereit
            </span>
            <h1 id="wissen-titel" className="titel-linie max-w-[16ch] text-h2">
              Erklärt, bevor es teuer wird.
            </h1>
            <p className="max-w-measure text-lead text-text-muted">
              Jedes Dossier lässt sich in 30 Sekunden als Entscheider lesen oder in der Tiefe als Techniker. Viele haben
              ein Element zum Ausprobieren.
            </p>
            <Link href="/wissen/begriffe" className="daten inline-flex min-h-11 items-center gap-2 justify-self-start hover:text-text">
              Glossar: alle Begriffe von A bis Z <span aria-hidden="true">→</span>
            </Link>
          </div>
          <WissenListe />
        </div>
      </section>
      <Kontakt />
    </>
  );
}
