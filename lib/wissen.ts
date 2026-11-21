/* Wissensbereich: Dossiers mit Lesemodus (Entscheider / Technik).
   Inhalte aus dem Gespräch mit Daniel am 19.11.2026, fachlich ergänzt. Vor dem Livegang
   von Daniel prüfen lassen, besonders die Technik-Absätze.
   Fachbegriffe in {geschweiften Klammern} bekommen eine Erklärung (lib/inhalte.ts, begriffe). */

export type Ausprobieren = "vbs" | "ausfall" | "502" | "schichten" | "firewall";

type Kapitel = {
  titel: string;
  /** Für alle sichtbar */
  text: string;
  /** Nur im Lesemodus "Technik" */
  technik?: string;
};

type Dossier = {
  slug: string;
  kennung: string;
  bereich: "Sicherheit" | "Virtualisierung" | "Netzwerk" | "Betrieb";
  titel: string;
  /** Ein Satz für Karte, Abflugtafel und Beschreibung */
  kurz: string;
  /** 1 Einstieg bis 4 Technik */
  tiefe: 1 | 2 | 3 | 4;
  minuten: number;
  status: "bereit" | "bald";
  dreissig?: readonly string[];
  kapitel?: readonly Kapitel[];
  /** Interaktives Element und nach welchem Kapitel (Index) es steht */
  ausprobieren?: { art: Ausprobieren; nach: number; satz: string };
  fuerSie?: { text: string; fall?: string; leistung?: { pfad: string; label: string } };
  fragen?: readonly { frage: string; antwort: string }[];
  geaendert: string;
};

export const dossiers: readonly Dossier[] = [
  {
    slug: "vbs",
    kennung: "WIS-01",
    bereich: "Sicherheit",
    titel: "VBS: Was es schützt, was es kostet.",
    kurz: "Virtualization Based Security schützt Zugangsdaten. Auf virtuellen Servern kann es ohne Feinschliff fast die ganze Leistung kosten.",
    tiefe: 3,
    minuten: 5,
    status: "bereit",
    dreissig: [
      "VBS schützt Zugangsdaten, indem Windows sie in einem abgeschotteten Bereich verwahrt.",
      "Auf virtuellen Servern kann es ohne Feinschliff fast 90 % der Datenrate kosten.",
      "Mit den richtigen Einstellungen bleibt der Schutz an und bis zu 80 % der Leistung erhalten.",
    ],
    kapitel: [
      {
        titel: "Was VBS ist",
        text: "Virtualization Based Security, kurz {VBS}, nutzt die Virtualisierungsfunktionen des Prozessors, um einen besonders geschützten Speicherbereich zu schaffen. Dort legt Windows sensible Daten ab, etwa Anmeldeinformationen. Selbst wer das normale System übernimmt, kommt an diesen Bereich nicht heran.",
        technik:
          "Technisch startet Windows dafür den Hyper-V-Hypervisor unterhalb des Betriebssystems. Funktionen wie Credential Guard und Speicherintegrität (HVCI) bauen darauf auf. Credential Guard isoliert die Geheimnisse des LSA-Prozesses in einem eigenen Bereich, Angriffe wie Pass-the-Hash werden damit deutlich schwerer.",
      },
      {
        titel: "Warum man es will",
        text: "In Penetrationstests zeigt sich immer wieder: Über einen einzelnen Server lassen sich Zugangsdaten abgreifen, und mit ihnen kommt man an Speichersysteme und Daten. Prüfer empfehlen deshalb Credential Guard. Und das setzt VBS voraus.",
      },
      {
        titel: "Warum es bremst",
        text: "VBS braucht eine eigene Virtualisierungsebene. Läuft der Windows-Server selbst schon als virtuelle Maschine, etwa auf {Proxmox}, entsteht eine zweite Ebene innerhalb der ersten. Diese Verschachtelung kostet Leistung. Im gemessenen Fall fiel die Datenrate von 25 auf 3 GB/s.",
        technik:
          "Bei verschachtelter Virtualisierung muss der äußere {Hypervisor} Befehle des inneren abfangen und nachbilden. Jeder Wechsel zwischen den Ebenen kostet Zeit, vor allem bei Ein- und Ausgabe. Wie stark das wirkt, hängt von Prozessor, Hypervisor-Einstellungen und Treibern ab. Das betrifft Proxmox, VMware und Hyper-V gleichermaßen.",
      },
      {
        titel: "Was hilft",
        text: "Abschalten ist keine Lösung, wenn ein Prüfbericht den Schutz verlangt. Der Weg führt über die Konfiguration von Host und Gast. Ich baue die Umgebung im Labor nach, messe jede Änderung und stimme mich mit Proxmox-Entwicklern ab. So bleiben bis zu 80 Prozent der Leistung.",
        technik:
          "Typische Stellschrauben sind der CPU-Typ der virtuellen Maschine (durchgereicht statt generisch), aktivierte Virtualisierungserweiterungen für den Gast, VirtIO-Treiber für Datenträger und Netz und die Verteilung auf NUMA-Knoten. Welche Kombination trägt, zeigt erst die Messung mit der eigenen Last.",
      },
    ],
    ausprobieren: { art: "vbs", nach: 2, satz: "Schalten Sie VBS selbst ein und sehen Sie, was mit der Datenrate passiert." },
    fuerSie: {
      text: "Wenn ein Prüfbericht Credential Guard fordert oder Ihre Windows-Server nach einer Sicherheitsänderung spürbar langsamer sind, lohnt ein Blick auf die Virtualisierung darunter.",
      fall: "vbs-leistung",
      leistung: { pfad: "/proxmox", label: "Proxmox VE" },
    },
    fragen: [
      { frage: "Kann ich VBS einfach abschalten?", antwort: "Technisch ja, dann fehlt aber der Schutz von Credential Guard. Empfiehlt ein Penetrationstest ihn, ist Abschalten meist keine Option." },
      { frage: "Betrifft das nur Proxmox?", antwort: "Nein. Verschachtelte Virtualisierung ist für alle großen Hypervisoren eine Herausforderung: Proxmox, VMware und Hyper-V." },
      { frage: "Woran erkenne ich, ob VBS bei mir bremst?", antwort: "Ein Vergleich der Datenrate mit und ohne VBS auf derselben Maschine zeigt es. Im kostenlosen Audit messe ich das mit Ihnen." },
    ],
    geaendert: "2026-11-21",
  },
  {
    slug: "ntp-dns",
    kennung: "WIS-03",
    bereich: "Netzwerk",
    titel: "NTP und DNS: die stillen Ausfallpunkte.",
    kurz: "Zeit und Namensauflösung laufen unauffällig im Hintergrund, bis sie fehlen. Dann steht oft mehr als gedacht.",
    tiefe: 2,
    minuten: 4,
    status: "bereit",
    dreissig: [
      "Zeit (NTP) und Namensauflösung (DNS) laufen unauffällig im Hintergrund, bis sie fehlen.",
      "Ohne eigenen Zeitserver kann ein Internetausfall die Infrastruktur aus dem Takt bringen.",
      "Ein einzelner DNS-Server ist ein Ausfallpunkt. Zwei synchronisierte Server lösen das.",
    ],
    kapitel: [
      {
        titel: "Warum Zeit wichtig ist",
        text: "Server, Anmeldedienste und {Cluster} müssen sich auf eine gemeinsame Uhrzeit verlassen. Weichen die Uhren auseinander, scheitern Anmeldungen, Zertifikate gelten als ungültig und Cluster verlieren den Überblick, wer gerade zuständig ist.",
        technik:
          "Kerberos, das Anmeldeverfahren im Active Directory, lehnt standardmäßig Anfragen ab, deren Zeit mehr als fünf Minuten abweicht. Proxmox-Cluster mit Corosync und Ceph reagieren empfindlich auf Zeitabweichungen. Ein eigener NTP-Server im Haus, am besten mit eigener Zeitquelle wie GPS oder DCF77, hält die Zeit auch ohne Internet.",
      },
      {
        titel: "Wenn das Internet weg ist",
        text: "Bei einem Kunden gab es keinen eigenen Zeitserver, alle Systeme holten die Zeit aus dem Internet. Die Frage, wie lange die Infrastruktur ohne Internet weiterläuft, konnte niemand beantworten. Genau das gehört in die Planung, bevor es passiert.",
      },
      {
        titel: "DNS: ein Name, ein Risiko",
        text: "DNS übersetzt Namen in Adressen. Fast jeder Dienst braucht es, oft unbemerkt. Hängt alles an einem einzigen DNS-Server, steht bei dessen Ausfall oder beim nächsten Update die halbe Infrastruktur.",
        technik:
          "Bewährt ist ein Verbund aus einem primären und mindestens einem sekundären Server, die ihre Zonen synchron halten. Die Clients kennen beide Adressen. Ein dritter Server erhöht die Reserve. So lässt sich ein Server warten, während der andere übernimmt.",
      },
      {
        titel: "Was ich prüfe",
        text: "Bei jeder Clusterplanung frage ich nach Zeit- und DNS-Servern und beziehe sie ein: Wie viele gibt es, woher beziehen sie ihre Daten, und was passiert, wenn einer ausfällt?",
      },
    ],
    ausprobieren: { art: "ausfall", nach: 1, satz: "Klicken Sie die Internetleitung an, einmal ohne und einmal mit eigenem Zeitserver (Haken bei „Zeitserver (NTP)“ setzen)." },
    fuerSie: {
      text: "Wenn Sie nicht sicher sagen können, woher Ihre Server die Zeit beziehen und wie viele DNS-Server Sie haben, lohnt ein kurzer Check.",
      leistung: { pfad: "/proxmox", label: "Proxmox VE" },
    },
    fragen: [
      { frage: "Reicht nicht ein öffentlicher Zeitserver?", antwort: "Für den Alltag ja. Fällt die Internetverbindung aus, fehlt er aber. Ein eigener Zeitserver im Haus überbrückt das." },
      { frage: "Brauche ich wirklich zwei DNS-Server?", antwort: "Wenn Ihre Dienste auch bei einem Update oder Ausfall erreichbar bleiben sollen, ja." },
      { frage: "Ist das aufwendig?", antwort: "Meist nicht. Beides lässt sich oft auf vorhandener Infrastruktur einrichten, ohne neue Hardware." },
    ],
    geaendert: "2026-11-21",
  },
  {
    slug: "502",
    kennung: "WIS-02",
    bereich: "Betrieb",
    titel: "502 ist kein Absturz.",
    kurz: "Warum ein bewusst getrennter Dienst die sicherere Antwort sein kann.",
    tiefe: 1,
    minuten: 3,
    status: "bald",
    geaendert: "2026-11-21",
  },
  {
    slug: "proxmox-baukasten",
    kennung: "WIS-04",
    bereich: "Virtualisierung",
    titel: "Proxmox ist ein Baukasten.",
    kurz: "KVM, QEMU, LXC und Debian: woraus Proxmox besteht und wo es klemmen kann.",
    tiefe: 3,
    minuten: 5,
    status: "bald",
    geaendert: "2026-11-21",
  },
  {
    slug: "firewall-verkehr",
    kennung: "WIS-05",
    bereich: "Netzwerk",
    titel: "Welcher Verkehr gehört durch die Firewall?",
    kurz: "Interner Verkehr über die Firewall kann ein ganzes Netz ausbremsen.",
    tiefe: 2,
    minuten: 4,
    status: "bald",
    geaendert: "2026-11-21",
  },
];

export const bereiche = ["Sicherheit", "Virtualisierung", "Netzwerk", "Betrieb"] as const;
export const fertigeDossiers = dossiers.filter((d) => d.status === "bereit");
export const dossier = (slug: string) => dossiers.find((d) => d.slug === slug);
