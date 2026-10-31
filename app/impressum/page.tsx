import { Rechtsseite } from "@/components/layout/rechtsseite";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = seitenMetadaten({
  titel: "Impressum",
  beschreibung: "Anbieterkennzeichnung von Daniel Richter IT-Dienstleistungen, Potsdam.",
  pfad: "/impressum",
});

/* Übernommen aus dem Impressum von daniel-richter.it (Stand 31.10.2026).
   Vor Livegang von Daniel bestätigen lassen. */
export default function Impressum() {
  const { adresse } = site;
  return (
    <Rechtsseite titel="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {site.firma}
        <br />
        Daniel Richter
        <br />
        {adresse.strasse}
        <br />
        {adresse.plz} {adresse.ort}
      </p>
      <h2>Kontakt</h2>
      <p>
        Telefon: {site.telefon}
        <br />
        E-Mail: {site.email}
      </p>
      <h2>Berufsbezeichnung</h2>
      <p>Freiberufler, keine Eintragung im Handelsregister erforderlich.</p>
      <h2>Umsatzsteuer</h2>
      <p className="offen">[USt-IdNr. oder Hinweis auf Kleinunternehmerregelung von Daniel]</p>
      <h2>KI-Hinweis</h2>
      <p>Videos und Teile der Grafiken auf dieser Website wurden mit Künstlicher Intelligenz erstellt.</p>
    </Rechtsseite>
  );
}
