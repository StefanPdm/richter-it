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
    kurz: "Warum ein bewusst getrennter Dienst die sicherere Antwort sein kann, und was Besucher dann sehen sollten.",
    tiefe: 1,
    minuten: 3,
    status: "bereit",
    dreissig: [
      "Ein 502 heißt: Der Proxy vorne antwortet, der Dienst dahinter nicht.",
      "Oft ist das gewollt: bei Wartung, bei einer bekannten Lücke oder um einen auffälligen Dienst abzukoppeln.",
      "Eine gestaltete Fehlerseite sagt Besuchern ehrlich, was los ist, statt halbe Seiten zu zeigen.",
    ],
    kapitel: [
      {
        titel: "Was ein 502 bedeutet",
        text: "Viele Dienste stehen nicht direkt im Netz, sondern hinter einem Reverse Proxy. Er nimmt Anfragen an und reicht sie an den Dienst weiter. Antwortet der Dienst nicht, meldet der Proxy 502 Bad Gateway, sinngemäß: Ich bin da, aber hinter mir antwortet niemand.",
        technik:
          "Der Statuscode 502 gehört zu den Serverfehlern (5xx): Ein Gateway oder Proxy hat vom nachgelagerten Server keine oder eine ungültige Antwort bekommen. Verwandt sind 503 (Dienst vorübergehend nicht verfügbar) und 504 (Zeitüberschreitung am Gateway). Proxys wie nginx, Caddy oder HAProxy können dafür eine eigene Fehlerseite ausliefern.",
      },
      {
        titel: "Warum man bewusst trennt",
        text: "Ein 502 ist oft eine Entscheidung. Bei einem Update bleibt der Proxy online und sagt ehrlich, dass dahinter gerade niemand antwortet. Bei einer bekannten Lücke ohne Patch nehme ich den Dienst vom Netz, statt ihn offen laufen zu lassen. Und ein Dienst, der sich auffällig verhält, wird abgekoppelt und untersucht, während der Rest weiterläuft.",
      },
      {
        titel: "Was Besucher sehen sollten",
        text: "Eine leere Standardseite wirkt wie ein Absturz oder gar ein Angriff. Eine gestaltete Fehlerseite erklärt, dass der Dienst bewusst getrennt ist, dass er zurückkommt und wie man trotzdem jemanden erreicht. Besucher erschrecken weniger und schauen genauer hin.",
        technik:
          "Die Fehlerseite muss ohne den getrennten Dienst funktionieren: eine einzelne Datei ohne externe Abhängigkeiten, ausgeliefert vom Proxy selbst, in nginx etwa mit error_page 502 /502.html. Für geplante Wartung ist 503 mit Retry-After das sauberere Signal an Suchmaschinen.",
      },
    ],
    ausprobieren: { art: "502", nach: 1, satz: "Schalten Sie den Dienst wieder ein und sehen Sie, was beim Besucher ankommt." },
    fuerSie: {
      text: "Wenn Ihre Dienste bei Wartung einfach verschwinden oder Besucher dann eine nackte Fehlermeldung sehen, lässt sich das mit wenig Aufwand sauber lösen.",
      leistung: { pfad: "/automatisierung", label: "Automatisierung" },
    },
    fragen: [
      { frage: "Ist ein 502 immer gewollt?", antwort: "Nein. Er entsteht auch, wenn ein Dienst abstürzt oder überlastet ist. Bei einer bewussten Trennung wissen Sie es vorher und können Besucher darauf vorbereiten." },
      { frage: "Schadet ein 502 in Suchmaschinen?", antwort: "Kurze Unterbrechungen sind unkritisch. Für geplante Wartung ist 503 mit der Angabe, wann es weitergeht, das sauberere Signal." },
      { frage: "Was gehört auf die Fehlerseite?", antwort: "Was los ist, dass es gewollt ist, dass der Dienst zurückkommt und wie man Sie trotzdem erreicht." },
    ],
    geaendert: "2026-11-21",
  },
  {
    slug: "proxmox-baukasten",
    kennung: "WIS-04",
    bereich: "Virtualisierung",
    titel: "Proxmox ist ein Baukasten.",
    kurz: "KVM, QEMU, LXC und Debian: woraus Proxmox besteht, und warum die Ursache eines Fehlers oft eine Ebene tiefer liegt.",
    tiefe: 3,
    minuten: 5,
    status: "bereit",
    dreissig: [
      "Proxmox VE verbindet bewährte Open-Source-Bausteine zu einer Plattform.",
      "KVM und QEMU für virtuelle Maschinen, LXC für Container, Debian als Grundlage.",
      "Wer die Bausteine kennt, findet Fehler schneller: Oft liegt die Ursache eine Ebene tiefer.",
    ],
    kapitel: [
      {
        titel: "Die Bausteine",
        text: "{Proxmox} erfindet wenig neu. Es setzt bewährte Teile zusammen: KVM, die Virtualisierung im Linux-Kernel, QEMU für die virtuelle Hardware, LXC für leichte Container, dazu Speicher wie ZFS oder Ceph und eine Weboberfläche, die alles bedienbar macht.",
        technik:
          "Die Grundlage ist Debian, den Kernel übernimmt Proxmox aus Ubuntu und pflegt ihn selbst. {Cluster} laufen über Corosync, Hochverfügbarkeit über einen eigenen HA-Manager, Sicherungen über Proxmox Backup Server. Alles ist Open Source unter der AGPL.",
      },
      {
        titel: "Warum das zählt",
        text: "Jeder Baustein bringt eigene Eigenheiten mit. Ein Fehler, der wie ein Proxmox-Problem aussieht, kommt oft aus Debian oder dem Kernel darunter. Wer die Schichten kennt, sucht an der richtigen Stelle.",
      },
      {
        titel: "Ein Beispiel aus der Praxis",
        text: "Nach einem Kernel-Update unterstützte das System ältere Netzwerkkarten nicht mehr, nach dem Neustart war das Netz weg. Kein Fehler in Proxmox, sondern eine Ebene darunter. Wer das weiß, prüft vor dem Update die Hardware und hat einen Rückweg.",
        technik:
          "Ein Rückweg heißt etwa: den bisherigen Kernel als Startoption behalten und festsetzen, Treiber und Firmware vorher gegen die Versionshinweise prüfen und Updates erst auf einem Testknoten fahren.",
      },
      {
        titel: "Upgrades planen",
        text: "Ein großes Upgrade wie von Proxmox 8 auf 9 hebt auch Debian auf eine neue Version. Vorher prüfen, was sich ändert, dann ein Testlauf, dann Knoten für Knoten im laufenden Betrieb.",
        technik:
          "Proxmox liefert dafür ein Prüfskript (pve8to9), das bekannte Stolpersteine vor dem Upgrade meldet. Im Cluster werden die Knoten nacheinander aktualisiert, die virtuellen Maschinen ziehen vorher per Live-Migration auf andere Knoten um.",
      },
    ],
    ausprobieren: { art: "schichten", nach: 1, satz: "Drei Störungen aus der Praxis: Tippen Sie auf die Ebene, in der Sie die Ursache vermuten." },
    fuerSie: {
      text: "Wenn bei Ihnen ein großes Proxmox-Upgrade ansteht oder nach Updates Merkwürdiges passiert, lohnt ein Blick auf die Ebene darunter.",
      fall: "altsystem",
      leistung: { pfad: "/proxmox", label: "Proxmox VE" },
    },
    fragen: [
      { frage: "Ist Proxmox kostenlos?", antwort: "Die Software ist Open Source und ohne Lizenzkosten nutzbar. Für den Unternehmenseinsatz gibt es optionale Subscriptions mit stabilem Update-Kanal und Support." },
      { frage: "Was ist der Unterschied zwischen VM und Container?", antwort: "Eine virtuelle Maschine bringt ein eigenes Betriebssystem mit. Ein Container teilt sich den Kernel mit dem Host, ist dadurch leichter, aber weniger stark getrennt." },
      { frage: "Kann ich von VMware wechseln?", antwort: "Ja, Proxmox kann virtuelle Maschinen aus VMware übernehmen. Was der Wechsel bei Ihnen spart, zeigt der VMware-Ausstiegsrechner unter Werkzeuge." },
    ],
    geaendert: "2026-11-21",
  },
  {
    slug: "firewall-verkehr",
    kennung: "WIS-05",
    bereich: "Netzwerk",
    titel: "Welcher Verkehr gehört durch die Firewall?",
    kurz: "Die Firewall schützt den Weg nach außen. Läuft großer interner Verkehr durch sie, wird sie zum Flaschenhals.",
    tiefe: 2,
    minuten: 4,
    status: "bereit",
    dreissig: [
      "Die Firewall schützt den Übergang nach außen. Für Verkehr zwischen internen Netzen ist sie oft das falsche Gerät.",
      "Läuft großer interner Verkehr durch sie, wird sie zum Flaschenhals und blockiert unter Last ganze Netze.",
      "Die Lösung liegt meist in der Wegführung, nicht in neuer Hardware.",
    ],
    kapitel: [
      {
        titel: "Was eine Firewall tut",
        text: "Sie prüft Verkehr gegen Regeln, viele Modelle auch auf Viren und Angriffe. Das kostet Rechenleistung pro Paket. Für den Übergang ins Internet ist das genau richtig.",
        technik:
          "Moderne Firewalls arbeiten mit Deep Packet Inspection, Intrusion Prevention und Virenscan. Ihr Durchsatz mit allen Prüfungen liegt oft weit unter dem Wert, den das Datenblatt für reines Weiterleiten nennt.",
      },
      {
        titel: "Wenn interner Verkehr durchläuft",
        text: "Werden interne Netze über die Firewall verbunden, prüft sie auch jedes Paket zwischen Büro und Speicher. Bei großen Dateien wie 8K-Videos ist sie schnell am Limit, und dann blockiert sie unter Last ganze Netze.",
      },
      {
        titel: "Die bessere Wegführung",
        text: "Verkehr zwischen vertrauenswürdigen internen Netzen läuft über die Core-Switches, die für hohe Datenraten gebaut sind. Die Firewall prüft den Weg nach außen und gezielt die Übergänge, die wirklich Schutz brauchen.",
        technik:
          "Core-Switches mit Layer-3-Routing verbinden VLANs mit voller Geschwindigkeit. Wo zwischen internen Zonen trotzdem gefiltert werden soll, reichen oft Zugriffslisten auf dem Switch, oder die Firewall prüft nur die wenigen kritischen Übergänge.",
      },
      {
        titel: "Warum es so weit kommt",
        text: "Oft fehlt die Pflege: Eine Fachfirma richtet die Firewall ein, ein Wartungsvertrag entfällt, und neue Netze werden mit kopierten Einstellungen angelegt. So wandern unnötige Prüfungen von Netz zu Netz.",
      },
    ],
    ausprobieren: { art: "firewall", nach: 2, satz: "Stellen Sie den Weg um und sehen Sie, wie sich der Stau auflöst." },
    fuerSie: {
      text: "Wenn Ihr Netz bei großen Datenmengen zeitweise hakt, ohne dass ein Gerät ausfällt, lohnt ein Blick in das Monitoring der Firewall.",
      fall: "firewall-engpass",
      leistung: { pfad: "/automatisierung", label: "Monitoring und Automatisierung" },
    },
    fragen: [
      { frage: "Ist es nicht unsicherer, Verkehr an der Firewall vorbeizuleiten?", antwort: "Nicht bei vertrauenswürdigen internen Netzen. Wo eine Trennung nötig ist, prüft die Firewall gezielt diese Übergänge." },
      { frage: "Brauche ich dafür neue Hardware?", antwort: "Meist nicht. Core-Switches können das in vielen Netzen schon, es fehlt nur die passende Konfiguration." },
      { frage: "Woran erkenne ich den Engpass?", antwort: "Am Monitoring: Die Firewall steht bei großen Übertragungen unter Volllast, während die Switches kaum ausgelastet sind." },
    ],
    geaendert: "2026-11-21",
  },
];

export const bereiche = ["Sicherheit", "Virtualisierung", "Netzwerk", "Betrieb"] as const;
export const fertigeDossiers = dossiers.filter((d) => d.status === "bereit");
export const dossier = (slug: string) => dossiers.find((d) => d.slug === slug);

/* Fehlersuche im Dossier WIS-04: Schichten von oben nach unten, drei Störungen mit der
   Ebene, in der die Ursache liegt. Von Daniel prüfen lassen. */
export const fehlersuche = {
  schichten: ["VMs · Container", "KVM · QEMU · LXC", "Proxmox VE · Debian", "Hardware"],
  stoerungen: [
    {
      symptom: "Nach einem Kernel-Update ist das Netzwerk weg.",
      ursache: 2,
      erklaerung: "Richtig: Der neue Kernel unterstützt die ältere Netzwerkkarte nicht mehr. Kein Proxmox-Fehler, sondern eine Ebene darunter. Ich prüfe vor Updates die Hardware gegen die Versionshinweise und halte den alten Kernel als Rückweg bereit.",
    },
    {
      symptom: "Ein Windows-Server wird nach dem Aktivieren von VBS sehr langsam.",
      ursache: 1,
      erklaerung: "Richtig: VBS öffnet eine zweite Virtualisierungsebene innerhalb der ersten. Hier entscheidet die Konfiguration von KVM und QEMU, wie viel Leistung ankommt, etwa der CPU-Typ der virtuellen Maschine.",
    },
    {
      symptom: "Mehrere VMs hängen zeitweise, im Protokoll tauchen Lesefehler auf.",
      ursache: 3,
      erklaerung: "Richtig: Lesefehler deuten auf einen Datenträger, der aufgibt. Die VMs zeigen das Symptom, die Ursache ist die Hardware. Ich prüfe den Zustand der Datenträger und ersetze sie, bevor Daten verloren gehen.",
    },
  ],
  daneben: "Hier zeigt sich das Problem, die Ursache liegt woanders. Versuchen Sie eine andere Ebene.",
} as const;
