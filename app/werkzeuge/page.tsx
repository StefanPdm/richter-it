import Link from "next/link";
import { Kontakt } from "@/components/sektionen/kontakt";
import { seitenMetadaten } from "@/lib/seo";
import { werkzeuge } from "@/lib/werkzeuge";
import { KartenFuss } from "@/components/ui/karten-fuss";

export const metadata = seitenMetadaten({
  titel: "Werkzeuge für Ihre IT-Infrastruktur",
  beschreibung:
    "Domain-Check mit KI-Sichtbarkeit, Souveränitäts-Check, Ausfall-Netz, VMware-Rechner und Cluster-Planer: Werkzeuge für eine erste Einschätzung Ihrer IT.",
  pfad: "/werkzeuge",
});

/** Übersicht der Werkzeuge: eine Karte je Werkzeug, je ein Satz und ein Link. */
export default function Werkzeuge() {
  return (
    <>
      <section aria-labelledby="werkzeuge-titel" className="py-(--section-y)">
        <div className="mx-auto grid max-w-wide gap-[clamp(2rem,4vw,3.5rem)] px-(--gutter)">
          <div className="grid gap-5">
            <span className="daten">Werkzeuge · ohne Anmeldung</span>
            <h1 id="werkzeuge-titel" className="titel-linie max-w-[16ch] text-h2">
              Erst selbst nachrechnen, dann reden.
            </h1>
            <p className="max-w-measure text-lead text-text-muted">
              Fünf kleine Werkzeuge für eine erste Einschätzung Ihrer IT. Keine Anmeldung, die Rechner laufen nur in Ihrem
              Browser. Wenn Sie möchten, übernehmen Sie das Ergebnis mit einem Klick in Ihre Anfrage.
            </p>
          </div>
          <ul className="grid gap-(--gap-karten) md:grid-cols-2">
            {werkzeuge.map((w, i) => (
              <li key={w.slug} className="md:first:col-span-2">
                <Link
                  href={`/werkzeuge/${w.slug}`}
                  className="hud-rahmen group flex h-full flex-col gap-4 border border-border bg-surface p-[clamp(1.5rem,3vw,2.5rem)] transition-colors duration-(--dur-base) hover:border-brand"
                >
                  <span className="daten text-brand-dark">
                    {String(i + 1).padStart(2, "0")} · {w.kennung}
                  </span>
                  <span className="text-h3 font-medium">{w.titel}</span>
                  <span className="text-text-muted">{w.satz}</span>
                  <KartenFuss links={<span className="daten">{w.dauer}</span>} className="mt-2">
                    <span className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
                      Werkzeug öffnen <span aria-hidden="true" className="transition-transform duration-(--dur-fast) group-hover:translate-x-1">→</span>
                    </span>
                  </KartenFuss>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Kontakt />
    </>
  );
}
