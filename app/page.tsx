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
import { Partner } from "@/components/sektionen/partner";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";
import { Signallinie } from "@/components/effekte/signallinie";
import { CtaBand } from "@/components/ui/cta-band";

/* Startseite, Präsentationsversion "Leitstand im Abendlicht" (DESIGN.md).
   Rhythmus der Hintergründe, abwechselnd bewegt (B) und ruhig (R):
   Hero B, Messung R, Kennzahlen B (Lichtfeger), Leistungen R, Leitstand B (Datenstrom),
   Haltung R, Medienband B (Video), Referenzen R, Person B (Netz), Partner R,
   Kontakt B (Kontrollraum). Leitstand: Kontrollraum mit Kamerafahrt und Scan-Strahl. */

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
      <CtaBand
        satz="Nicht sicher, wo es hakt?"
        zusatz="Ein kostenloses Audit von bis zu einer Stunde zeigt, wo sich ein Eingriff lohnt."
        knopf="Kostenloses Audit anfragen"
        thema={{ anliegen: "Audit", betreff: "Kostenloses Audit" }}
      />
      <Leitstand />
      <Signallinie />
      <Haltung />
      <Medienband />
      <Signallinie />
      <Referenzen />
      <CtaBand
        satz="Ihr Projekt könnte Fall 04 sein."
        zusatz="Beschreiben Sie kurz Ihre Ausgangslage, Sie bekommen ein konkretes Angebot."
        knopf="Angebot anfordern"
        thema={{ anliegen: "Angebot", betreff: "Angebot für mein Projekt" }}
      />
      <Person />
      <Signallinie />
      <Partner />
      <Kontakt />
    </>
  );
}
