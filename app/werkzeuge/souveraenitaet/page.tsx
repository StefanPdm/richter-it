import { WerkzeugSeite } from "@/components/werkzeuge/werkzeug-seite";
import { SouveraenitaetCheck } from "@/components/werkzeuge/souveraenitaet-check";
import { SouveraenitaetCheckAnnahmen } from "@/components/werkzeuge/souveraenitaet-check-annahmen";
import { seitenMetadaten } from "@/lib/seo";

export const metadata = seitenMetadaten({
  titel: "Souveränitäts-Check für Ihre IT",
  beschreibung: "Zehn Fragen zu Daten, Lizenzen und Anmeldung: Ihr Abhängigkeits-Profil und drei erste Schritte mit Open-Source-Alternativen.",
  pfad: "/werkzeuge/souveraenitaet",
});

export default function Seite() {
  return (
    <WerkzeugSeite
      slug="souveraenitaet"
      einleitung="Wie abhängig ist Ihre IT von einzelnen Herstellern und Cloud-Anbietern? Zehn Fragen zu Daten, Lizenzen, Anmeldung und Ausstiegswegen. Am Ende sehen Sie Ihr Abhängigkeits-Profil und drei erste Schritte."
      annahmen={<SouveraenitaetCheckAnnahmen />}
    >
      <SouveraenitaetCheck />
    </WerkzeugSeite>
  );
}
