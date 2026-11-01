import { WerkzeugSeite } from "@/components/werkzeuge/werkzeug-seite";
import { VmwareRechner } from "@/components/werkzeuge/vmware-rechner";
import { VmwareRechnerAnnahmen } from "@/components/werkzeuge/vmware-rechner-annahmen";
import { seitenMetadaten } from "@/lib/seo";

export const metadata = seitenMetadaten({
  titel: "VMware-Ausstiegsrechner: Kosten mit Proxmox",
  beschreibung: "Vergleichen Sie Ihre heutigen VMware-Kosten mit den offiziellen Proxmox-Subscription-Preisen je CPU-Sockel.",
  pfad: "/werkzeuge/vmware-ausstieg",
});

export default function Seite() {
  return (
    <WerkzeugSeite
      slug="vmware-ausstieg"
      einleitung="Seit der Übernahme durch Broadcom zahlen viele Unternehmen deutlich mehr für VMware. Geben Sie Ihre heutigen Kosten und die Zahl Ihrer CPU-Sockel ein und vergleichen Sie mit den offiziellen Proxmox-Preisen."
      annahmen={<VmwareRechnerAnnahmen />}
    >
      <VmwareRechner />
    </WerkzeugSeite>
  );
}
