import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sektionen/hero";
import { Laufband } from "@/components/sektionen/laufband";
import { Messung } from "@/components/sektionen/messung";
import { Kennzahlen } from "@/components/sektionen/kennzahlen";
import { Leistungen } from "@/components/sektionen/leistungen";
import { Leitstand } from "@/components/sektionen/leitstand";
import { Haltung, Medienband } from "@/components/sektionen/haltung";
import { Referenzen } from "@/components/sektionen/referenzen";
import { Person } from "@/components/sektionen/person";
import { Kontakt } from "@/components/sektionen/kontakt";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";
import { Signallinie } from "@/components/effekte/signallinie";

/* Startseite, Präsentationsversion "Leitstand im Abendlicht" (DESIGN.md).
   Rhythmus der Hintergründe, abwechselnd bewegt (B) und ruhig (R):
   Hero B, Messung R, Kennzahlen B (Lichtfeger), Leistungen R, Leitstand B (Datenstrom),
   Haltung R, Medienband B (Video), Referenzen R, Person B (Netz), Kontakt R. */

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
      <Laufband />
      <Messung />
      <Kennzahlen />
      <Signallinie />
      <Leistungen />
      <Leitstand />
      <Signallinie />
      <Haltung />
      <Medienband />
      <Signallinie />
      <Referenzen />
      <Person />
      <Signallinie />
      <Kontakt />
    </>
  );
}
