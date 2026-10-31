import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sektionen/hero";
import { Messleiste, Messung } from "@/components/sektionen/messung";
import { Leistungen } from "@/components/sektionen/leistungen";
import { Haltung, Medienband } from "@/components/sektionen/haltung";
import { Referenzen } from "@/components/sektionen/referenzen";
import { Person } from "@/components/sektionen/person";
import { Kontakt } from "@/components/sektionen/kontakt";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";

/* Startseite als Erlebnisseite (DESIGN.md). Idee: Infrastruktur als Architektur,
   die Messwerte sind die Beweise. */

export const metadata = seitenMetadaten({
  titel: `${site.name} | IT-Infrastruktur mit Open Source`,
  beschreibung: site.beschreibung,
  pfad: "/",
});

export default function Startseite() {
  return (
    <>
      <JsonLd
        daten={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: site.firma,
          url: site.url,
          telephone: site.telefon,
          email: site.email,
          description: site.beschreibung,
          address: {
            "@type": "PostalAddress",
            streetAddress: site.adresse.strasse,
            postalCode: site.adresse.plz,
            addressLocality: site.adresse.ort,
            addressCountry: site.adresse.land,
          },
          founder: { "@type": "Person", name: "Daniel Richter" },
        }}
      />
      <Hero />
      <Messleiste />
      <Messung />
      <Leistungen />
      <Medienband />
      <Haltung />
      <Referenzen />
      <Person />
      <Kontakt />
    </>
  );
}
