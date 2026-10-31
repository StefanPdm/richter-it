/*
  Inhalte der Startseite.

  ACHTUNG PRÄSENTATIONSVERSION (Stand 31.10.2026):
  Alles, was mit "BEISPIEL" markiert ist, ist für die Präsentation bei Daniel
  erfunden (Kennzahlen, Referenzen, Zitate, Monitorwerte, Terminal-Ausgabe).
  Vor Livegang durch freigegebene Angaben ersetzen oder löschen.
  Belegt sind: Backup-Fall 5 TB 8 h -> 15 min (Chat 22.10.2026, Freigabe 31.10.2026),
  Technikliste und Team (bestehende Website), Zielgruppen (Antwort Daniel).
*/

/** Präsentationsversion: blendet den Hinweis auf Beispielinhalte ein. */
export const PRAESENTATION = true;

export const backupFall = {
  branche: "Landesanstalt", // BEISPIEL: Branche noch nicht freigegeben
  groesse: "5 TB",
  vorherMinuten: 480,
  nachherMinuten: 15,
  // BEISPIEL: technische Einordnung, von Daniel bestätigen lassen
  einordnung:
    "Statt jede Nacht die komplette Maschine zu kopieren, sichert das neue Verfahren nur geänderte Blöcke, dedupliziert und direkt auf schnellen Speicher im eigenen Rechenzentrum.",
} as const;

/** Laufband: Werkzeuge aus der bestehenden Website */
export const technik = [
  "Proxmox VE",
  "Proxmox Backup",
  "OPNsense",
  "Keycloak",
  "Ansible",
  "Grafana",
  "Prometheus",
  "Loki",
  "Tempo",
  "Docker",
  "Forgejo",
  "Linux",
] as const;

/** Kennzahlen. Quelle: bestehende Website (20+ Projekte, über 10 Jahre, bis zu 40 % Kosten),
    Backup-Faktor aus dem Kundenfall. Belege für 20+ und 40 % sind offen (siehe analyse.md). */
export const kennzahlen = [
  { wert: 20, vorsatz: "", nachsatz: "+", label: "Projekte abgeschlossen" },
  { wert: 10, vorsatz: "", nachsatz: "+", label: "Jahre Erfahrung mit Open Source" },
  { wert: 32, vorsatz: "", nachsatz: "×", label: "schnelleres Backup im Kundenprojekt" },
  { wert: 40, vorsatz: "", nachsatz: " %", label: "weniger Betriebskosten, bis zu" },
] as const;

/** Leistungen, Quelle: bestehende Website (Leistungen) und Antwort Daniel (Backup eigenes Angebot) */
export const leistungen = [
  {
    kennung: "PLAN",
    titel: "Planung und Architektur",
    text: "Manchmal liegt die Herausforderung im Detail. Ich betrachte das Gesamtbild und plane mit Ihnen die Lösung, bevor etwas umgebaut wird.",
    technik: ["Analyse", "Konzept", "Audit"],
  },
  {
    kennung: "PERF",
    titel: "Proxmox VE und Performance",
    text: "Die Stabilität eines Unternehmens ruht auf seiner Infrastruktur. Proxmox VE als Hypervisor, abgestimmt auf Ihre Hardware und Ihre Last.",
    technik: ["Proxmox VE", "Linux", "ZFS"],
  },
  {
    kennung: "BKP",
    titel: "Backup und Wiederherstellung",
    text: "Sicherungen, die in ihr Zeitfenster passen. Und ein geübter Weg, wie die Daten im Ernstfall zurückkommen.",
    technik: ["Proxmox Backup", "Deduplizierung"],
  },
  {
    kennung: "NET",
    titel: "Firewall mit OPNsense",
    text: "OPNsense ist mehr als eine Firewall. Mit dem Partnernetzwerk entstehen Lösungen, die Unternehmen auch intern absichern.",
    technik: ["OPNsense", "VPN", "Segmentierung"],
  },
  {
    kennung: "IAM",
    titel: "Identität und Zugang",
    text: "Keycloak als zentrale Anmeldung mit Single Sign-On und Mehrfaktor-Schutz. Manuell eingerichtet oder als angepasstes Docker-Compose-Template.",
    technik: ["Keycloak", "SSO", "MFA"],
  },
  {
    kennung: "OPS",
    titel: "Observability und Automatisierung",
    text: "Wiederkehrende Arbeit blockiert IT-Teams. Playbooks und ein vollständiger Blick auf alle Systeme schaffen wieder Raum für Weiterentwicklung.",
    technik: ["Ansible", "Grafana", "Semaphore UI"],
  },
] as const;

/** BEISPIEL: Werte des Leitstands (simuliert, schwanken leicht) */
export const monitor = [
  { kennung: "CPU", label: "Last Cluster", einheit: "%", basis: 34, spanne: 12 },
  { kennung: "IOPS", label: "Speicher", einheit: "k", basis: 182, spanne: 30 },
  { kennung: "NET", label: "Durchsatz", einheit: "Gbit/s", basis: 7.4, spanne: 1.6 },
  { kennung: "LAT", label: "Antwortzeit", einheit: "ms", basis: 0.8, spanne: 0.3 },
] as const;

/** BEISPIEL: Terminal-Ausgabe eines Ansible-Laufs (gekürzt, plausibel, nicht echt) */
export const terminal = [
  "$ ansible-playbook backup-optimierung.yml -i produktion",
  "",
  "PLAY [Backup-Ziele vorbereiten] ****************************",
  "TASK [Speicher prüfen] .............................. ok",
  "TASK [Deduplizierung aktivieren] .................... changed",
  "TASK [Zeitfenster auf 01:00 setzen] ................. changed",
  "TASK [Testsicherung vm-104 (5 TB)] .................. ok  00:14:52",
  "TASK [Wiederherstellung prüfen] ..................... ok",
  "",
  "PLAY RECAP ************************************************",
  "pve-01   ok=12  changed=3  unreachable=0  failed=0",
  "pve-02   ok=12  changed=3  unreachable=0  failed=0",
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

/** BEISPIEL: Referenzen, anonymisiert und erfunden */
export const referenzen = [
  {
    branche: "Landesanstalt",
    kurz: "15 min statt 8 h",
    titel: "Backup in 15 statt 480 Minuten",
    punkte: [
      { label: "Ausgangslage", wert: "Die nächtliche Sicherung einer 5-TB-Maschine lief bis in den Arbeitstag." },
      { label: "Vorgehen", wert: "Inkrementelle Sicherung mit Deduplizierung, eigener Backup-Speicher." },
      { label: "Ergebnis", wert: "15 Minuten, ohne große Umbauten." },
    ],
  },
  {
    branche: "Kommunale Behörde",
    kurz: "0 € Lizenzen",
    titel: "Von VMware zu Proxmox in sechs Wochen",
    punkte: [
      { label: "Ausgangslage", wert: "Steigende Lizenzkosten, 60 virtuelle Maschinen." },
      { label: "Vorgehen", wert: "Schrittweise Migration auf einen Proxmox-Cluster, ohne Ausfall im Betrieb." },
      { label: "Ergebnis", wert: "Lizenzkosten für Virtualisierung auf null." },
    ],
  },
  {
    branche: "Mittelstand, Produktion",
    kurz: "1 Login, MFA",
    titel: "Ein Login für alle Systeme",
    punkte: [
      { label: "Ausgangslage", wert: "Zwölf Anwendungen, zwölf Passwörter, kein zweiter Faktor." },
      { label: "Vorgehen", wert: "Keycloak als zentrale Anmeldung mit Mehrfaktor-Schutz." },
      { label: "Ergebnis", wert: "Ein Login, MFA für alle, Zugänge an einer Stelle steuerbar." },
    ],
  },
] as const;

/** BEISPIEL: Kundenstimmen, erfunden, Rollen statt Namen */
export const stimmen = [
  {
    zitat: "Daniel hat in zwei Tagen gefunden, wonach unser Dienstleister ein Jahr gesucht hat.",
    rolle: "IT-Leitung, Landesanstalt",
  },
  {
    zitat: "Keine Folien, keine Versprechen. Er hat gemessen, umgebaut und dann wieder gemessen.",
    rolle: "Geschäftsführer, Maschinenbau",
  },
] as const;

/** Observability-Stack, Quelle: bestehende Website, Seite Leistungen */
export const observability = [
  { name: "Grafana", rolle: "Oberfläche" },
  { name: "Prometheus", rolle: "Metriken" },
  { name: "InfluxDB2", rolle: "Metriken" },
  { name: "Tempo", rolle: "Tracing" },
  { name: "Loki", rolle: "Logs" },
  { name: "Alloy", rolle: "Gateway" },
] as const;

/** Fertige Module, Quelle: bestehende Website, Seite Leistungen (Automatisierung, IAM, Ansible) */
export const fertigeModule = [
  { name: "Ansible-Playbooks", inhalt: "Linux Update/Upgrade, Linux KeyGen, Docker Handling, SSHKeyGen" },
  { name: "Keycloak-Vorlage", inhalt: "Docker-Compose-Template für SSO und MFA, angepasst an Ihre Umgebung" },
  { name: "Grafana-Stack", inhalt: "Observability in einem Paket, offen auf GitHub" },
  { name: "CI/CD und Compose", inhalt: "Docker-Compose-Pakete und CI/CD-Konfigurationen aus echten Projekten" },
] as const;

/** Partner, Quelle: bestehende Website, Seite Partner (gekürzt) */
export const partner = {
  zitat: "Man muss nicht alles wissen, nur wissen, wo es zu finden ist.",
  text: "Aus vielen Projektjahren ist ein unabhängiges Netzwerk entstanden. Für jedes Projekt findet sich das passende Fach-Team.",
  liste: [
    {
      kategorie: "Proxmox-Schulungen",
      name: "ProxForge",
      person: "Jonas Sterr",
      text: "Offizieller Proxmox-Trainings-Partner. Bringt Erfahrung aus Virtualisierungs- und Storage-Projekten in Workshops und offizielle Proxmox-VE-Trainings ein.",
    },
    {
      kategorie: "Hardware",
      name: "Thomas Krenn AG",
      person: "Freyung, seit 2002",
      text: "Einer der größten Hersteller individueller Server- und Storage-Systeme in Deutschland, gefertigt nach Bestellung. Zertifiziert nach DIN EN ISO 14001 und 27001.",
    },
  ],
} as const;

/** Text mit "[" am Anfang ist offen und wird markiert. */
export const istOffen = (text: string) => text.startsWith("[");
