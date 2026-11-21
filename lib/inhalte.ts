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

/** Hero: Kernbotschaft aus dem Gespräch am 19.11.2026, mehr Leistung bei voller Sicherheit.
    Fachbegriffe in {geschweiften Klammern} bekommen eine Erklärung (siehe begriffe). */
export const hero = {
  zeile1: "Mehr Leistung.",
  zeile2: "Volle Sicherheit.",
  text: "Ich hole mehr aus Ihrer IT-Infrastruktur heraus, ohne die Sicherheit zu opfern. Mit {Proxmox} und Open Source, auf der Technik, die Sie schon haben.",
} as const;

/** Kennzahlen aus dem Gespräch am 19.11.2026: 20+ größere Projekte (von Daniel bestätigt),
    bis zu 80 % Leistung mit aktiviertem VBS, Audit von etwa einer Stunde kostenlos.
    "10+ Jahre" stammt von der bestehenden Website, von Daniel bestätigen lassen. */
export const kennzahlen = [
  { wert: 20, vorsatz: "", nachsatz: "+", label: "größere Projekte abgeschlossen" },
  { wert: 80, vorsatz: "", nachsatz: " %", label: "Leistung trotz VBS" },
  { wert: 1, vorsatz: "", nachsatz: " h", label: "Audit, kostenlos" },
  { wert: 10, vorsatz: "", nachsatz: "+", label: "Jahre Erfahrung mit Open Source" },
] as const;

/** Glossar für Fachbegriffe im Text. Schreibweise im Text: {Schlüssel} oder {Anzeige|Schlüssel}.
    Ein Satz Erklärung, verständlich für Entscheider. Von Daniel fachlich prüfen lassen. */
export const begriffe = {
  Proxmox: {
    lang: "Proxmox VE",
    text: "Open-Source-Plattform für virtuelle Maschinen und Container, aufgebaut auf Debian und KVM. Nutzbar ohne Lizenzkosten, Support ist optional.",
  },
  Hypervisor: {
    lang: "Hypervisor",
    text: "Die Software, auf der virtuelle Maschinen laufen. Sie teilt Prozessor, Speicher und Netz eines Servers auf viele Systeme auf. Beispiele: Proxmox VE, Hyper-V, VMware.",
  },
  VBS: {
    lang: "Virtualization Based Security",
    text: "Windows schottet Anmeldedaten und andere kritische Teile in einem eigenen, abgesicherten Bereich ab. Schützt vor dem Diebstahl von Zugangsdaten, kostet ohne Feinschliff viel Leistung.",
  },
  Cluster: {
    lang: "Cluster",
    text: "Mehrere Server, die als ein System arbeiten. Fällt einer aus, übernehmen die anderen seine virtuellen Maschinen.",
  },
  "Docker Compose": {
    lang: "Docker Compose",
    text: "Eine Vorlage, mit der sich mehrere zusammengehörige Dienste mit einem Befehl starten lassen. Jedes Mal gleich, auch auf einem neuen Server.",
  },
  Playbook: {
    lang: "Ansible-Playbook",
    text: "Eine Datei, die Schritt für Schritt beschreibt, wie Server eingerichtet werden. Läuft automatisch und auf allen Servern gleich.",
  },
} as const;
export type BegriffSchluessel = keyof typeof begriffe;

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
    text: "Die Stabilität eines Unternehmens ruht auf seiner Infrastruktur. {Proxmox VE|Proxmox} als {Hypervisor}, abgestimmt auf Ihre Hardware und Ihre Last.",
    technik: ["Proxmox VE", "Linux", "ZFS"],
  },
  {
    kennung: "BKP",
    titel: "Backup und Wiederherstellung",
    text: "Sicherungen, die in ihr Zeitfenster passen. Und ein geübter Weg, wie die Daten im Ernstfall zurückkommen.",
    technik: ["Proxmox Backup", "Deduplizierung"],
    /** Eigene Seite mit Messung und Ablauf, die Karte verweist darauf */
    seite: { pfad: "/backup", label: "Backup im Detail" },
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
    text: "Keycloak als zentrale Anmeldung mit Single Sign-On und Mehrfaktor-Schutz. Manuell eingerichtet oder als angepasste Vorlage für {Docker Compose}.",
    technik: ["Keycloak", "SSO", "MFA"],
  },
  {
    kennung: "OPS",
    titel: "Observability und Automatisierung",
    text: "Wiederkehrende Arbeit blockiert IT-Teams. {Playbooks|Playbook} und ein vollständiger Blick auf alle Systeme schaffen wieder Raum für Weiterentwicklung.",
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

/** BEISPIEL: weitere Läufe für die Terminal-Schleife. Playbook-Namen von der
    bestehenden Website (Linux Update/Upgrade, Docker Handling, SSHKeyGen), Ausgabe erfunden. */
export const terminalLaeufe = [
  terminal,
  [
    "$ ansible-playbook linux-update-upgrade.yml -i alle-server",
    "",
    "PLAY [Linux – Update/Upgrade] ******************************",
    "TASK [Paketquellen aktualisieren] ................... ok",
    "TASK [Sicherheitsupdates einspielen] ................ changed",
    "TASK [Kernel prüfen, Neustart planen] ............... ok",
    "TASK [Dienste nach Update testen] ................... ok",
    "",
    "PLAY RECAP ************************************************",
    "app-01   ok=9   changed=2  unreachable=0  failed=0",
    "app-02   ok=9   changed=2  unreachable=0  failed=0",
    "db-01    ok=9   changed=1  unreachable=0  failed=0",
  ],
  [
    "$ ansible-playbook docker-handling.yml --tags aufraeumen",
    "",
    "PLAY [Docker Handling] *************************************",
    "TASK [Laufende Container erfassen] .................. ok",
    "TASK [Images auf neuen Stand bringen] ............... changed",
    "TASK [Container neu starten, Healthcheck] ........... changed",
    "TASK [Ungenutzte Images entfernen] .................. changed  12,4 GB frei",
    "",
    "PLAY RECAP ************************************************",
    "docker-01   ok=8   changed=3  unreachable=0  failed=0",
  ],
  [
    "$ ansible-playbook sshkeygen.yml -e rotation=quartal",
    "",
    "PLAY [SSHKeyGen] *******************************************",
    "TASK [Neue Schlüssel erzeugen (ed25519)] ............ changed",
    "TASK [Schlüssel verteilen] .......................... changed",
    "TASK [Alte Schlüssel sperren] ....................... changed",
    "TASK [Anmeldung testen] ............................. ok",
    "",
    "PLAY RECAP ************************************************",
    "pve-01   ok=6   changed=3  unreachable=0  failed=0",
    "pve-02   ok=6   changed=3  unreachable=0  failed=0",
  ],
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

/* Referenzen: drei echte Fälle aus dem Gespräch am 19.11.2026, anonym (keine Kunden,
   keine Branche, die Rückschlüsse zulässt). Startseite zeigt die Kurzfassung als Drehkarte,
   jeder Fall hat eine eigene Seite unter /faelle/<slug>. Vor dem Livegang von Daniel
   prüfen lassen. Offene Angaben beginnen mit "[" und werden markiert. */
export const referenzen = [
  {
    slug: "vbs-leistung",
    bereich: "Virtualisierung",
    kurz: "80 % trotz VBS",
    titel: "Sicher und trotzdem schnell",
    punkte: [
      { label: "Ausgangslage", wert: "Mit aktiviertem VBS fiel die Datenrate eines virtuellen Windows-Servers von 25 auf 3 GB/s." },
      { label: "Vorgehen", wert: "Konfiguration im Labor nachgebaut, mit Proxmox-Entwicklern abgestimmt, mit Benchmarks gemessen." },
      { label: "Ergebnis", wert: "Credential Guard bleibt aktiv, bis zu 80 % der Leistung sind zurück." },
    ],
    seite: {
      beschreibung:
        "VBS schützt Zugangsdaten, kostete hier aber fast 90 % der Datenrate. Mit dem richtigen Feinschliff bleibt der Schutz an und die Leistung kommt zurück.",
      lead: "Ein Schutz, den Penetrationstests empfehlen, hat einen Windows-Server fast lahmgelegt. Abschalten war keine Option.",
      fakten: [
        { wert: "25 GB/s", label: "ohne VBS" },
        { wert: "3 GB/s", label: "mit VBS, ohne Feinschliff" },
        { wert: "bis 80 %", label: "Leistung mit Feinschliff" },
      ],
      abschnitte: [
        {
          titel: "Ausgangslage",
          text: "Credential Guard erkennt und blockiert Versuche, Zugangsdaten über einen Server abzugreifen. Dafür muss Windows VBS aktivieren, eine eigene, abgeschottete Virtualisierungsebene. Läuft der Server selbst schon virtuell, stapeln sich zwei Ebenen. Im gemessenen Fall fiel die Datenrate eines virtuellen Windows-Servers von 25 auf 3 GB/s. Für eine stark genutzte Datenbank wäre das kaum noch nutzbar.",
        },
        {
          titel: "Vorgehen",
          text: "Ich habe die Umgebung im eigenen Labor nachgebaut und die Einstellungen von Hypervisor und Gastsystem Schritt für Schritt angepasst. Jede Änderung wurde mit Benchmarks gemessen und mit Proxmox-Entwicklern und Kollegen abgestimmt. So bleibt nachvollziehbar, welche Einstellung wie viel bringt.",
        },
        {
          titel: "Ergebnis",
          text: "VBS und Credential Guard bleiben aktiv. Mit den passenden Einstellungen kommen bis zu 80 Prozent der ursprünglichen Leistung zurück. Die Sicherheit läuft im Hintergrund, die Leistung spüren die Anwender im Alltag.",
        },
      ],
    },
  },
  {
    slug: "firewall-engpass",
    bereich: "Netzwerk",
    kurz: "Flaschenhals gefunden",
    titel: "Die Firewall, die alles bremste",
    punkte: [
      { label: "Ausgangslage", wert: "Rund 2 PB Speicher, große Videodateien im internen Netz, zeitweise war die Infrastruktur nicht erreichbar." },
      { label: "Vorgehen", wert: "Monitoring ausgewertet: Interner Verkehr lief durch die Firewall, die jedes Paket prüfte." },
      { label: "Ergebnis", wert: "Verkehr zwischen internen Netzen über die Core-Switches, das Netz läuft wieder stabil." },
    ],
    seite: {
      beschreibung:
        "Interner Datenverkehr lief durch die Firewall und legte das Netz zeitweise lahm. Die Lösung lag in der Wegführung, nicht in neuer Hardware.",
      lead: "Große Videodateien auf dem Weg zum Speicher haben eine Firewall überlastet. Gefunden hat den Engpass das Monitoring.",
      fakten: [
        { wert: "2 PB", label: "Speicher im Netz" },
        { wert: "8K / 16K", label: "Videodateien" },
        { wert: "Core-Switch", label: "statt Firewall intern" },
      ],
      abschnitte: [
        {
          titel: "Ausgangslage",
          text: "Die Umgebung hatte rund 2 Petabyte Speicher. Die Marketingabteilung schob regelmäßig 8K- und 16K-Videos durch das Netz zum Speicher. Zeitweise waren Teile der Infrastruktur nicht erreichbar, ohne dass ein Gerät ausgefallen wäre.",
        },
        {
          titel: "Ursache",
          text: "Das Monitoring zeigte die Firewall unter Volllast. Durch eine Fehlkonfiguration lief auch der Verkehr zwischen internen Netzen über sie. Sie prüfte jedes Paket auf Viren und blockierte unter Last ganze Netze. Eingerichtet hatte sie eine Fachfirma, einen Wartungsvertrag gab es nicht. Neue Netze wurden mit kopierten Einstellungen angelegt, samt unnötiger Prüfungen.",
        },
        {
          titel: "Lösung und Ergebnis",
          text: "Der Verkehr zwischen den internen Netzen läuft jetzt über die Core-Switches, die dafür gebaut sind. Die Firewall kümmert sich um das, wofür sie da ist: den Übergang nach außen. Netz und Datenübertragung laufen wieder stabil.",
        },
      ],
    },
  },
  {
    slug: "altsystem",
    bereich: "Bestand",
    kurz: "18 Jahre in Betrieb",
    titel: "Weiter betreiben statt neu kaufen",
    punkte: [
      { label: "Ausgangslage", wert: "Ein 18 Jahre altes System, neue Hardware stand im Raum." },
      { label: "Vorgehen", wert: "Proxmox schrittweise aktualisiert, angepasst und optimiert." },
      { label: "Ergebnis", wert: "Nicht so schnell wie neue Hardware, aber ausreichend und deutlich günstiger." },
    ],
    seite: {
      beschreibung:
        "Ein 18 Jahre altes System läuft weiter, schrittweise aktualisiert und optimiert. Nicht so schnell wie neue Hardware, aber ausreichend und viel günstiger.",
      lead: "Nicht jede Infrastruktur muss neu gekauft werden. Manchmal reicht es, das Vorhandene sauber nachzuziehen.",
      fakten: [
        { wert: "18 Jahre", label: "im Betrieb" },
        { wert: "[Kosten neu]", label: "neue Hardware" },
        { wert: "[Kosten Optimierung]", label: "Optimierung" },
      ],
      abschnitte: [
        {
          titel: "Ausgangslage",
          text: "Ein System, das seit 18 Jahren läuft. Die naheliegende Antwort wäre neue Hardware gewesen, mit Beschaffung, Migration und dem Risiko, das jeder Umzug mit sich bringt.",
        },
        {
          titel: "Vorgehen",
          text: "Gemeinsam mit Kollegen habe ich Proxmox auf dem System schrittweise aktualisiert, an die Hardware angepasst und optimiert. Jeder Schritt wurde einzeln umgesetzt und geprüft, damit der Betrieb weiterlaufen konnte.",
        },
        {
          titel: "Ergebnis",
          text: "Das System läuft weiter. Die Leistung ist nicht mit neuer Hardware vergleichbar, reicht für die Aufgabe aber aus. Die Kosten lagen deutlich unter einer Neuanschaffung.",
        },
      ],
    },
  },
] as const;
export type Fall = (typeof referenzen)[number];

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

/** Backup-Ablauf (3D-Szene): fünf Schritte mit Proxmox Backup.
    Funktionen aus der Proxmox-Dokumentation, Einrichtung im Einzelfall von Daniel bestätigen lassen. */
export const backupAblauf = [
  {
    kurz: "Erfassen",
    titel: "Nur, was sich geändert hat.",
    text: "Die Sicherung liest nur die Blöcke, die sich seit dem letzten Lauf geändert haben. Die laufenden Maschinen merken davon kaum etwas.",
  },
  {
    kurz: "Deduplizieren",
    titel: "Jeder Block nur einmal.",
    text: "Gleiche Datenblöcke werden nur einmal gespeichert, über alle Maschinen und alle Stände hinweg. Das spart Speicher und Zeit.",
  },
  {
    kurz: "Verschlüsseln",
    titel: "Verschlüsselt, bevor es das Haus verlässt.",
    text: "Die Daten werden schon auf dem Quellsystem verschlüsselt, mit AES-256-GCM. Der Schlüssel bleibt bei Ihnen.",
  },
  {
    kurz: "Übertragen",
    titel: "Eine zweite Kopie an einem zweiten Ort.",
    text: "Ein Sync-Job spiegelt die Sicherung auf einen zweiten Backup-Server an einem anderen Standort. Fällt ein Gebäude aus, bleibt die Kopie.",
  },
  {
    kurz: "Wiederherstellen",
    titel: "Geprüft, nicht nur gesichert.",
    text: "Regelmäßige Prüfläufe lesen die Sicherungen zurück. Im Ernstfall ist klar, dass die Wiederherstellung funktioniert und wie lange sie dauert.",
  },
] as const;

/* 502 mit Absicht: Daniels Idee aus dem Gespräch am 19.11.2026, Vorbild seine eigene
   Fehlerseite auf formbricks.daniel-richter.info. Texte von Daniel bestätigen lassen. */
export const fehler502 = {
  titel: "502. Mit Absicht.",
  einleitung:
    "Ein 502 sieht aus wie ein Absturz. Oft ist er eine Entscheidung: Der Proxy vorne bleibt erreichbar, der Dienst dahinter ist bewusst getrennt. Lieber keine Antwort als eine ungeschützte.",
  /** Zustände des Schemas, die Statuszeilen sind echte HTTP-Antworten */
  verbunden: {
    status: "HTTP/2 200 OK",
    knopf: "Dienst trennen",
    bild: "Dienst antwortet",
    /** BEISPIEL: Anfragen-Protokoll im Bildschirm, illustrativ */
    protokoll: [
      "GET  /            200   14 ms",
      "GET  /status      200    3 ms",
      "POST /formular    200   41 ms",
      "GET  /dashboard   200   22 ms",
    ],
  },
  getrennt: {
    status: "HTTP/2 502 Bad Gateway",
    knopf: "Dienst wieder einschalten",
    zeile: "Verbindung bewusst getrennt",
    hinweis: "Der Dienst ist geschützt und kommt zurück, sobald er sicher ist.",
  },
  /** Einleitung über den Gründen: macht klar, warum der 502 eingeschaltet ist */
  gruendeTitel: "Warum ich einen Dienst bewusst trenne",
  gruendeText: "Drei typische Gründe, aus denen ein 502 gewollt ist. In jedem Fall ist er die sicherere Antwort.",
  gruende: [
    {
      titel: "Wartung",
      text: "Der Dienst bekommt ein Update. Der Proxy bleibt online und sagt ehrlich, dass dahinter gerade niemand antwortet, statt halbe Seiten auszuliefern.",
    },
    {
      titel: "Sicherheitslücke",
      text: "Eine Lücke ist bekannt, der Patch noch nicht da. Dann nehme ich den Dienst vom Netz, statt ihn offen laufen zu lassen.",
    },
    {
      titel: "Isolation",
      text: "Ein Dienst verhält sich auffällig. Er wird abgekoppelt und untersucht, der Rest der Infrastruktur läuft weiter.",
    },
  ],
} as const;

/* VBS-Moment: Fall aus dem Gespräch am 19.11.2026. Werte von Daniel: Datenrate eines
   virtuellen Windows-Servers 25 GB/s, mit VBS 3 GB/s, mit Feinschliff bis zu 80 %.
   Texte und Zahlen vor dem Livegang von Daniel bestätigen lassen. */
export const vbs = {
  titel: "Sicherheit kostet Leistung. Muss sie nicht.",
  einleitung:
    "{VBS} schützt Zugangsdaten vor Diebstahl. Ohne Feinschliff bremst es einen Server aber massiv aus. Ich sorge dafür, dass Sie beides bekommen.",
  messgroesse: "Datenrate Windows-Server",
  einheit: "GB/s",
  /** Drei Zustände, die Besucher nacheinander durchschalten. "vorher": Bezeichnung der Zeile,
      solange die Stufe noch nicht erreicht ist */
  stufen: [
    { name: "Ohne VBS", wert: 25, schutz: false, knopf: "VBS aktivieren", zeile: "Schnell, aber Zugangsdaten ungeschützt." },
    { name: "VBS (an)", vorher: "VBS (aus)", wert: 3, schutz: true, knopf: "Feinschliff anwenden", zeile: "Geschützt, aber die Leistung bricht ein." },
    { name: "Mit Feinschliff", wert: 20, schutz: true, knopf: "Noch einmal", zeile: "Geschützt und bis zu 80 % der Leistung." },
  ],
  schutzName: "Credential Guard",
  punkte: [
    {
      titel: "Was VBS schützt",
      text: "Virtualization Based Security legt Anmeldedaten in einen abgeschotteten Bereich. Credential Guard erkennt so Versuche, Zugangsdaten abzugreifen, und blockiert sie. Penetrationstests empfehlen genau das.",
    },
    {
      titel: "Warum es bremst",
      text: "Für VBS schaltet Windows eine zusätzliche Virtualisierungsebene ein. Läuft der Server selbst schon virtuell, etwa auf Proxmox, entsteht eine Verschachtelung. Im gemessenen Fall fiel die Datenrate von 25 auf 3 GB/s.",
    },
    {
      titel: "Was ich tue",
      text: "Ich baue die Konfiguration im eigenen Labor nach, stimme sie mit Proxmox-Entwicklern und Kollegen ab und messe mit Benchmarks. Der Schutz bleibt an, die Leistung kommt zurück.",
    },
  ],
} as const;

/* Zitat: sinngemäß aus dem Gespräch am 19.11.2026 (Installation ist Grundaufgabe,
   sein Angebot ist der Feinschliff). Kein Wortlaut, von Daniel freigeben lassen. */
export const zitat = {
  text: "Proxmox installieren kann heute fast jeder. Mein Job ist der Feinschliff, der ein System sicher und schnell macht.",
  von: "Daniel Richter",
  rolle: "IT-Infrastruktur, Potsdam",
} as const;
