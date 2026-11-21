import { LeistungsSeite } from "@/components/leistungen/leistungs-seite";
import { Schichten } from "@/components/leistungen/schichten";
import { leistungsseiten } from "@/lib/inhalte";
import { seitenMetadaten } from "@/lib/seo";

const daten = leistungsseiten.proxmox;

export const metadata = seitenMetadaten({ titel: "Proxmox VE: Cluster, Upgrades, Leistung", beschreibung: daten.beschreibung, pfad: daten.pfad });

/** Leistungsseite Proxmox VE, Grafik: Schichtenmodell mit den Ansatzpunkten des Feinschliffs. */
export default function Proxmox() {
  return <LeistungsSeite daten={daten} grafik={<Schichten />} />;
}
