import { WerkzeugSeite } from "@/components/werkzeuge/werkzeug-seite";
import { DomainCheck } from "@/components/werkzeuge/domain-check";
import { KI_CRAWLER } from "@/lib/ki-check";
import { seitenMetadaten } from "@/lib/seo";

export const metadata = seitenMetadaten({
  titel: "Domain-Check mit KI-Sichtbarkeit",
  beschreibung:
    "Prüfen Sie kostenlos Mail-Schutz, Zertifikat und Header Ihrer Domain und ob ChatGPT, Claude und Perplexity Ihre Website lesen dürfen und verstehen.",
  pfad: "/werkzeuge/domain-check",
});

export default function Seite() {
  return (
    <WerkzeugSeite
      slug="domain-check"
      einleitung="Eine Domain, zwei Antworten. Wie gut sind Website und E-Mail gegen Missbrauch geschützt? Und können Suchmaschinen und Sprachmodelle Ihre Seite lesen, wenn Kunden eine KI statt Google fragen?"
      annahmen={
        <>
          <p>
            <b className="text-text">Sicherheit:</b> öffentliche DNS-Einträge (über DNS over HTTPS bei Cloudflare), SPF, DMARC,
            DNSSEC, CAA, die Umleitung auf HTTPS, das TLS-Zertifikat und die Security-Header der Startseite.
          </p>
          <p>
            <b className="text-text">KI-Sichtbarkeit:</b> die Startseite sowie robots.txt, llms.txt und sitemap.xml, so wie ein
            Crawler sie abruft. Geprüft werden noindex, die Freigabe für {KI_CRAWLER.map(([name]) => name).join(", ")},
            strukturierte Daten (JSON-LD), Titel, Beschreibung, H1, Sprache und Canonical. Die Punktzahl gewichtet, was am
            meisten bewirkt.
          </p>
          <p>
            Der Check ersetzt kein Audit. Er zeigt in wenigen Sekunden, wo die größten Lücken liegen. Inhalte, die erst per
            JavaScript erscheinen, sieht er so wenig wie viele Crawler.
          </p>
        </>
      }
    >
      <DomainCheck />
    </WerkzeugSeite>
  );
}
