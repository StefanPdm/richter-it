import { WerkzeugSeite } from "@/components/werkzeuge/werkzeug-seite";
import { AusfallNetz } from "@/components/werkzeuge/ausfall-netz";
import { AusfallNetzAnnahmen } from "@/components/werkzeuge/ausfall-netz-annahmen";
import { seitenMetadaten } from "@/lib/seo";

export const metadata = seitenMetadaten({
  titel: "Was fällt aus, wenn …? IT-Abhängigkeiten sichtbar",
  beschreibung: "Klicken Sie ein System an und sehen Sie, was mit ausfällt: Abhängigkeiten und Schwachstellen Ihrer IT auf einen Blick.",
  pfad: "/werkzeuge/ausfall",
});

export default function Seite() {
  return (
    <WerkzeugSeite
      slug="ausfall"
      einleitung="Wählen Sie die Systeme, die es bei Ihnen gibt. Dann klicken Sie eines an und sehen, was alles mit ausfällt, und wo ein einzelnes System ohne Ausweichweg den ganzen Betrieb trägt."
      annahmen={<AusfallNetzAnnahmen />}
    >
      <AusfallNetz />
    </WerkzeugSeite>
  );
}
