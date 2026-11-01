import { Rechtsseite } from "@/components/layout/rechtsseite";
import { seitenMetadaten } from "@/lib/seo";

export const metadata = seitenMetadaten({
  titel: "Datenschutz",
  beschreibung: "Informationen zur Verarbeitung personenbezogener Daten.",
  pfad: "/datenschutz",
});

/* Platzhalter. Text vom Kunden oder aus seinem Datenschutz-Generator übernehmen. */
export default function Datenschutz() {
  return (
    <Rechtsseite titel={"Datenschutz­erklärung"}>
      <h2>Verantwortliche Stelle</h2>
      <p>Name und Anschrift des Verantwortlichen</p>
      <h2>Hosting und Server-Logs</h2>
      <p>Anbieter, Zweck, Speicherdauer</p>
      <h2>Kontaktformular</h2>
      <p>Welche Daten, Zweck, Rechtsgrundlage, Speicherdauer</p>
      <h2>Ihre Rechte</h2>
      <p>Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Beschwerde</p>
    </Rechtsseite>
  );
}
