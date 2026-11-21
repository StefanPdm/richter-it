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
    "Daniel Richter holt mehr Leistung aus bestehender IT-Infrastruktur, ohne die Sicherheit zu opfern: Proxmox, Open Source, im eigenen Haus.",
  telefon: "+49 173 963 74 27",
  email: "kontakt@daniel-richter.it",
  adresse: { strasse: "Tiroler Damm 16B", plz: "14478", ort: "Potsdam", land: "DE" },
  github: "https://github.com/danielrichterit/grafana-stack",
  /* Keine Social-Media-Links: Daniels berufliche Auflagen (Gespräch 19.11.2026) */
  /* Hauptmenü: höchstens 6 Punkte (Vorgabe Stefan). "unter" öffnet ein Aufklappmenü,
     auf dem Handy eingerückt unter dem Punkt. */
  navigation: [
    {
      label: "Leistungen",
      href: "/#leistungen",
      unter: [
        { label: "Proxmox VE", href: "/proxmox", satz: "Cluster, Upgrades, Leistung" },
        { label: "Backup", href: "/backup", satz: "Sichern im Zeitfenster" },
        { label: "Automatisierung", href: "/automatisierung", satz: "Playbooks, Patches, Monitoring" },
        { label: "So arbeiten wir", href: "/zusammenarbeit", satz: "Vom Audit bis zur Abnahme" },
      ],
    },
    { label: "Werkzeuge", href: "/werkzeuge" },
    { label: "Wissen", href: "/wissen" },
    { label: "Referenzen", href: "/#referenzen" },
    { label: "Über mich", href: "/#ueber-mich" },
  ],
  aktion: { label: "Gespräch vereinbaren", kurz: "Kontakt", href: "/#kontakt" },
  rechtliches: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
} as const;
