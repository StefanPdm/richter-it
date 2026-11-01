import { WerkzeugSeite } from "@/components/werkzeuge/werkzeug-seite";
import { ClusterPlaner } from "@/components/werkzeuge/cluster-planer";
import { ClusterPlanerAnnahmen } from "@/components/werkzeuge/cluster-planer-annahmen";
import { seitenMetadaten } from "@/lib/seo";

export const metadata = seitenMetadaten({
  titel: "Cluster-Planer für Proxmox VE",
  beschreibung: "Virtuelle Maschinen, Arbeitsspeicher und Speicher eingeben: Vorschlag für Knoten, Arbeitsspeicher und Speicher eines Proxmox-Clusters.",
  pfad: "/werkzeuge/cluster-planer",
});

export default function Seite() {
  return (
    <WerkzeugSeite
      slug="cluster-planer"
      einleitung="Wie viele Server braucht ein Proxmox-Cluster für Ihre Maschinen, mit Reserve für den Ausfall eines Knotens? Eine erste Größenordnung, bevor man ins Detail plant."
      annahmen={<ClusterPlanerAnnahmen />}
    >
      <ClusterPlaner />
    </WerkzeugSeite>
  );
}
