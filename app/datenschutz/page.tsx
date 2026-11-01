import { Rechtsseite } from "@/components/layout/rechtsseite";
import { seitenMetadaten } from "@/lib/seo";

export const metadata = seitenMetadaten({
  titel: "Datenschutz",
  beschreibung: "Informationen zur Verarbeitung personenbezogener Daten.",
  pfad: "/datenschutz",
});

/* Platzhalter. Text vom Kunden oder aus seinem Datenschutz-Generator übernehmen. */
export default function Datenschutz() {
  return (
    <Rechtsseite titel={"Datenschutz­erklärung"}>
      <h2>Verantwortliche Stelle</h2>
      <p>Name und Anschrift des Verantwortlichen</p>
      <h2>Hosting und Server-Logs</h2>
      <p>Anbieter, Zweck, Speicherdauer</p>
      <h2>Kontaktformular</h2>
      <p>Welche Daten, Zweck, Rechtsgrundlage, Speicherdauer</p>
      {/* Beschreibt, was app/api/check, ping, wetter und ich tun. Rechtsgrundlage legt der Kunde fest. */}
      <h2>Konsole: Sicherheits-Check, Ping, Wetter und whoami</h2>
      <p>
        Die Konsole dieser Website (unten über die Leiste „Konsole“ oder die Taste ^) bietet einige Befehle, für die eine
        Anfrage an unseren Server nötig ist. Die Befehle werden nur ausgeführt, wenn Sie sie selbst eingeben. Die
        Verarbeitung läuft in Serverfunktionen unseres Hosting-Anbieters Netlify, derzeit in einem Rechenzentrum in den USA
        (Ohio).
      </p>
      <p>
        <b>check &lt;domain&gt;:</b> Die eingegebene Domain wird an unseren Server übermittelt. Der Server fragt die
        öffentlichen DNS-Einträge der Domain bei Cloudflare (DNS over HTTPS, Cloudflare, Inc., USA) ab und ruft die
        Startseite der Domain sowie ihr TLS-Zertifikat ab. Cloudflare erhält dabei nur die Domain, nicht Ihre IP-Adresse.
        Das Ergebnis wird nur an Ihren Browser zurückgegeben und nicht gespeichert. Mit „kontakt --ergebnis“ übernehmen Sie
        es auf Wunsch in das Kontaktformular.
      </p>
      <p>
        <b>ping &lt;domain&gt;:</b> Die eingegebene Domain wird an unseren Server übermittelt. Der Server baut viermal eine
        Verbindung zu dieser Domain auf und misst die Antwortzeit. Ohne Domain misst „ping“ nur die Antwortzeit zwischen
        Ihrem Browser und dieser Website. Es wird nichts gespeichert.
      </p>
      <p>
        <b>wetter &lt;ort&gt;:</b> Der eingegebene Ortsname wird an unseren Server übermittelt. Der Server fragt Koordinaten
        und Wetterdaten bei Open-Meteo (open-meteo.com) ab. Open-Meteo erhält nur den Ortsnamen, nicht Ihre IP-Adresse. Die
        Antwort kann bis zu 10 Minuten zwischengespeichert werden, damit gleiche Abfragen nicht erneut gesendet werden.
      </p>
      <p>
        <b>whoami:</b> Der Server liest Ihre IP-Adresse aus der Anfrage und gibt sie nur an Ihren Browser zurück. Browser,
        System, Sprache, Zeitzone und Bildschirmgröße werden in Ihrem Browser ermittelt und nicht übertragen. Es wird nichts
        gespeichert.
      </p>
      <p>
        <b>Schutz vor Missbrauch:</b> Damit die Befehle nicht massenhaft genutzt werden können, hält der Server Ihre
        IP-Adresse und die Zeitpunkte Ihrer Anfragen höchstens eine Minute im Arbeitsspeicher. Danach werden sie verworfen.
      </p>
      <p>Rechtsgrundlage: vom Verantwortlichen festzulegen</p>
      <h2>Ihre Rechte</h2>
      <p>Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Beschwerde</p>
    </Rechtsseite>
  );
}
