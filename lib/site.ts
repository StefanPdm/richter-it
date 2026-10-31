/* Zentrale Angaben zur Website. Quelle: bestehende Website daniel-richter.it
   (Impressum, Kontakt), Stand 31.10.2026. */
export const site = {
  name: "Daniel Richter",
  zusatz: "IT-Infrastruktur",
  firma: "Daniel Richter IT-Dienstleistungen",
  url: "https://daniel-richter.it",
  sprache: "de",
  locale: "de_DE",
  beschreibung:
    "Daniel Richter optimiert IT-Infrastrukturen für Mittelstand, Behörden und Landesanstalten: Open Source, im eigenen Haus, mit gezielten Eingriffen.",
  telefon: "+49 173 963 74 27",
  email: "kontakt@daniel-richter.it",
  adresse: { strasse: "Tiroler Damm 16B", plz: "14478", ort: "Potsdam", land: "DE" },
  github: "https://github.com/danielrichterit/grafana-stack",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/itisdanielrichter/" },
    { label: "Facebook", href: "https://www.facebook.com/itdanny" },
  ],
  navigation: [
    { label: "Leistungen", href: "/#leistungen" },
    { label: "Backup", href: "/#messung" },
    { label: "Referenzen", href: "/#referenzen" },
    { label: "Über mich", href: "/#ueber-mich" },
    { label: "Partner", href: "/#partner" },
  ],
  aktion: { label: "Gespräch vereinbaren", kurz: "Kontakt", href: "/#kontakt" },
  rechtliches: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
} as const;
