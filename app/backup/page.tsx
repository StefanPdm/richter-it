import { JsonLd } from "@/components/seo/json-ld";
import { Messung } from "@/components/sektionen/messung";
import { BackupAblauf } from "@/components/sektionen/backup-ablauf";
import { Kontakt } from "@/components/sektionen/kontakt";
import { ThemaKnopf } from "@/components/ui/thema-knopf";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = seitenMetadaten({
  titel: "Backup und Wiederherstellung mit Proxmox",
  beschreibung:
    "Sicherungen, die in ihr Zeitfenster passen: inkrementell, dedupliziert, an einem zweiten Standort und regelmäßig geprüft. Mit Proxmox Backup.",
  pfad: "/backup",
});

/**
 * Leistungsseite Backup (seitentypen.md): Seitenkopf, Messung aus dem Kundenfall,
 * Ablauf in fünf Schritten (3D-Szene), Kontakt. Von der Startseite über die
 * Leistungskarte "Backup" verlinkt.
 */
export default function Backup() {
  return (
    <>
      <JsonLd
        daten={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: "Backup und Wiederherstellung",
              serviceType: "Backup mit Proxmox Backup Server",
              provider: { "@type": "ProfessionalService", name: site.firma, url: site.url },
              areaServed: "DE",
              url: `${site.url}/backup`,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Start", item: site.url },
                { "@type": "ListItem", position: 2, name: "Backup", item: `${site.url}/backup` },
              ],
            },
          ],
        }}
      />
      <section aria-labelledby="backup-titel" className="relative isolate border-b border-border pt-[clamp(3rem,7vw,6rem)] pb-[clamp(2.5rem,5vw,4rem)]">
        <Sektionsgrund licht="links-oben" motiv="lineal" />
        <div className="mx-auto grid max-w-wide gap-6 px-(--gutter)">
          <h1 id="backup-titel" className="titel-linie max-w-[18ch] text-h2">
            Backup, das in sein Zeitfenster passt.
          </h1>
          <p className="max-w-measure text-lead text-text-muted">
            Nur geänderte Blöcke sichern, jeden Block nur einmal speichern, eine zweite Kopie an einem anderen Ort und
            regelmäßig prüfen, ob die Wiederherstellung funktioniert. Mit Proxmox Backup, im eigenen Rechenzentrum.
          </p>
          <ThemaKnopf
            thema={{ anliegen: "Backup-Check", betreff: "Backup-Check: Ablauf und Wiederherstellung prüfen" }}
            className="justify-self-start"
          >
            Backup-Check anfragen
          </ThemaKnopf>
        </div>
      </section>
      <Messung />
      <BackupAblauf />
      <Kontakt />
    </>
  );
}
