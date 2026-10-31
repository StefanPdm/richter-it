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

/** BEISPIEL: Kennzahlen für die Präsentation */
export const kennzahlen = [
  { wert: 40, vorsatz: "", nachsatz: "+", label: "Infrastrukturen optimiert" },
  { wert: 99.98, vorsatz: "", nachsatz: " %", label: "Verfügbarkeit betreuter Systeme", nachkomma: 2 },
  { wert: 32, vorsatz: "", nachsatz: "×", label: "schnellere Backups im besten Fall" },
  { wert: 0, vorsatz: "", nachsatz: " €", label: "Lizenzkosten für die Kernsoftware" },
] as const;

export const leistungen = [
  {
    kennung: "PERF",
    titel: "Open Source und Performance",
    text: "Virtualisierung, Speicher und Netzwerk so einstellen, dass vorhandene Hardware leistet, was sie kann.",
    technik: ["Proxmox VE", "Linux", "ZFS"],
  },
  {
    kennung: "BKP",
    titel: "Backup und Wiederherstellung",
    text: "Sicherungen, die in ihr Zeitfenster passen. Und ein geübter Weg, wie die Daten im Ernstfall zurückkommen.",
    technik: ["Proxmox Backup", "Deduplizierung"],
  },
  {
    kennung: "SEC",
    titel: "Netzwerk und Zugriff",
    text: "Firewall, zentrale Anmeldung und Mehrfaktor-Schutz, damit nur die Richtigen an die Systeme kommen.",
    technik: ["OPNsense", "Keycloak"],
  },
  {
    kennung: "OPS",
    titel: "Betrieb und Automatisierung",
    text: "Wiederkehrende Arbeit als Playbook, der Zustand aller Systeme auf einen Blick.",
    technik: ["Ansible", "Grafana", "Prometheus"],
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

/** Text mit "[" am Anfang ist offen und wird markiert. */
export const istOffen = (text: string) => text.startsWith("[");
