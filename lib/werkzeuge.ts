/** Werkzeuge: kleine Rechner und Checks, die nur im Browser rechnen. Reihenfolge = Anzeige. */
export const werkzeuge = [
  {
    slug: "souveraenitaet",
    kennung: "SOV",
    titel: "Souveränitäts-Check",
    kurz: "Wie abhängig ist Ihre IT von einzelnen Herstellern?",
    satz: "Zehn Fragen, ein Abhängigkeits-Profil und drei erste Schritte mit Open-Source-Alternativen.",
    dauer: "3 Minuten",
  },
  {
    slug: "ausfall",
    kennung: "SPOF",
    titel: "Was fällt aus, wenn …?",
    kurz: "Klicken Sie ein System an und sehen Sie, was alles mit ausfällt.",
    satz: "Ihre Umgebung als Netz: Abhängigkeiten und einzelne Schwachstellen ohne Ausweichweg auf einen Blick.",
    dauer: "2 Minuten",
  },
  {
    slug: "vmware-ausstieg",
    kennung: "VMX",
    titel: "VMware-Ausstiegsrechner",
    kurz: "Was kostet Proxmox im Vergleich zu Ihrer heutigen VMware-Lizenz?",
    satz: "Hosts und CPU-Sockel eingeben, Subscription-Stufe wählen, jährliche Kosten vergleichen.",
    dauer: "1 Minute",
  },
  {
    slug: "cluster-planer",
    kennung: "PVE",
    titel: "Cluster-Planer",
    kurz: "Wie groß muss ein Proxmox-Cluster für Ihre Maschinen sein?",
    satz: "Virtuelle Maschinen, Arbeitsspeicher und Speicher eingeben, Vorschlag für Knoten und Speicher erhalten.",
    dauer: "2 Minuten",
  },
] as const;

export type WerkzeugSlug = (typeof werkzeuge)[number]["slug"];

export function werkzeug(slug: WerkzeugSlug) {
  return werkzeuge.find((w) => w.slug === slug)!;
}

/** Proxmox VE Subscriptions, netto je CPU-Sockel und Jahr.
    Quelle: proxmox.com/en/products/proxmox-virtual-environment/pricing, Stand 01.11.2026. */
export const proxmoxPreise = {
  stand: "01.11.2026",
  quelle: "https://www.proxmox.com/en/products/proxmox-virtual-environment/pricing",
  stufen: [
    { id: "community", name: "Community", preis: 120, leistung: "Enterprise-Repository, Hilfe über das Forum, nicht für den Produktivbetrieb" },
    { id: "basic", name: "Basic", preis: 370, leistung: "3 Support-Tickets pro Jahr, Antwort binnen 1 Werktag" },
    { id: "standard", name: "Standard", preis: 550, leistung: "10 Support-Tickets pro Jahr, Antwort binnen 4 Stunden, Fernwartung per SSH" },
    { id: "premium", name: "Premium", preis: 1100, leistung: "Unbegrenzte Tickets, Antwort binnen 2 Stunden, 24/7, Fernwartung per SSH" },
  ],
} as const;
