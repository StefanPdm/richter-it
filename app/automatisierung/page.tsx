import { LeistungsSeite } from "@/components/leistungen/leistungs-seite";
import { Terminal } from "@/components/effekte/terminal";
import { leistungsseiten, terminalLaeufe } from "@/lib/inhalte";
import { seitenMetadaten } from "@/lib/seo";

const daten = leistungsseiten.automatisierung;

export const metadata = seitenMetadaten({ titel: "Automatisierung mit Ansible und Monitoring", beschreibung: daten.beschreibung, pfad: daten.pfad });

/** Leistungsseite Automatisierung, Grafik: das Ansible-Terminal aus dem Leitstand (BEISPIEL-Läufe). */
export default function Automatisierung() {
  return <LeistungsSeite daten={daten} grafik={<Terminal laeufe={terminalLaeufe} titel="pve-01 · ansible" />} />;
}
