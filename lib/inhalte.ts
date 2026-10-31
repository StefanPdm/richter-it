/*
  Inhalte der Startseite. Quellen: Chatverlauf vom 22.10.2026, Antworten von
  Daniel vom 31.10.2026, bestehende Website (siehe analyse.md im Projektordner).
  Offene Stellen beginnen mit "[" und werden auf der Seite markiert.
*/

export const backupFall = {
  branche: "[Branche]",
  groesse: "5 TB",
  vorherMinuten: 480,
  nachherMinuten: 15,
  einordnung: "[Technische Einordnung von Daniel: was gemessen wurde und was geändert wurde, zwei bis drei Sätze]",
} as const;

export const leistungen = [
  {
    titel: "Open Source und Performance",
    text: "Virtualisierung, Speicher und Netzwerk so einstellen, dass vorhandene Hardware leistet, was sie kann.",
    technik: ["Proxmox VE", "Linux"],
  },
  {
    titel: "Backup und Wiederherstellung",
    text: "Sicherungen, die in ihr Zeitfenster passen. Und ein klarer Weg, wie die Daten im Ernstfall zurückkommen.",
    technik: ["[Werkzeuge nach Daniel]"],
  },
  {
    titel: "Netzwerk und Zugriff",
    text: "Firewall, zentrale Anmeldung und Mehrfaktor-Schutz, damit nur die Richtigen an die Systeme kommen.",
    technik: ["OPNsense", "Keycloak"],
  },
  {
    titel: "Betrieb und Automatisierung",
    text: "Wiederkehrende Arbeit als Playbook, der Zustand aller Systeme auf einen Blick.",
    technik: ["Ansible", "Grafana", "Prometheus", "Loki"],
  },
] as const;

export const grundsaetze = [
  {
    titel: "Open Source",
    text: "Software, deren Quellcode offen liegt. Keine Lizenzbindung an einen Hersteller, keine Überraschung bei der nächsten Preisrunde.",
  },
  {
    titel: "Im eigenen Haus",
    text: "Die Systeme laufen bei Ihnen vor Ort oder in Ihrem Rechenzentrum. Ihre Daten verlassen das Haus nicht.",
  },
] as const;

export const referenzen = [
  {
    branche: "[Branche]",
    titel: "Backup in 15 statt 480 Minuten",
    punkte: [
      { label: "Ausgangslage", wert: "Sicherung einer 5-TB-Maschine dauerte acht Stunden." },
      { label: "Vorgehen", wert: "[von Daniel]" },
      { label: "Ergebnis", wert: "15 Minuten, ohne große Umbauten." },
    ],
    offen: false,
  },
  {
    branche: "Behörde",
    titel: "[Projekt nach Freigabe]",
    punkte: [
      { label: "Ausgangslage", wert: "[offen]" },
      { label: "Ergebnis", wert: "[offen]" },
    ],
    offen: true,
  },
  {
    branche: "Landesanstalt",
    titel: "[Projekt nach Freigabe]",
    punkte: [
      { label: "Ausgangslage", wert: "[offen]" },
      { label: "Ergebnis", wert: "[offen]" },
    ],
    offen: true,
  },
] as const;

/** Text mit "[" am Anfang ist offen und wird markiert. */
export const istOffen = (text: string) => text.startsWith("[");
