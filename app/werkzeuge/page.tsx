import Link from "next/link";
import { Kontakt } from "@/components/sektionen/kontakt";
import { seitenMetadaten } from "@/lib/seo";
import { werkzeuge } from "@/lib/werkzeuge";

export const metadata = seitenMetadaten({
  titel: "Werkzeuge für Ihre IT-Infrastruktur",
  beschreibung:
    "Souveränitäts-Check, Ausfall-Netz, VMware-Ausstiegsrechner und Cluster-Planer: kleine Werkzeuge, die nur in Ihrem Browser rechnen.",
  pfad: "/werkzeuge",
});

/** Übersicht der Werkzeuge: vier Karten, je ein Satz und ein Link. */
export default function Werkzeuge() {
  return (
    <>
      <section aria-labelledby="werkzeuge-titel" className="py-(--section-y)">
        <div className="mx-auto grid max-w-wide gap-[clamp(2rem,4vw,3.5rem)] px-(--gutter)">
          <div className="grid gap-5">
            <span className="daten">Werkzeuge · rechnen nur in Ihrem Browser</span>
            <h1 id="werkzeuge-titel" className="titel-linie max-w-[16ch] text-h2">
              Erst selbst nachrechnen, dann reden.
            </h1>
            <p className="max-w-measure text-lead text-text-muted">
              Vier kleine Werkzeuge für eine erste Einschätzung Ihrer IT. Keine Anmeldung, keine Datenübertragung. Wenn
              Sie möchten, übernehmen Sie das Ergebnis mit einem Klick in Ihre Anfrage.
            </p>
          </div>
          <ul className="grid gap-(--gap-karten) md:grid-cols-2">
            {werkzeuge.map((w, i) => (
              <li key={w.slug}>
                <Link
                  href={`/werkzeuge/${w.slug}`}
                  className="hud-rahmen group grid h-full content-start gap-4 border border-border bg-surface p-[clamp(1.5rem,3vw,2.5rem)] transition-colors duration-(--dur-base) hover:border-brand"
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="daten text-brand-dark">
                      {String(i + 1).padStart(2, "0")} · {w.kennung}
                    </span>
                    <span className="daten">{w.dauer}</span>
                  </span>
                  <span className="text-h3 font-medium">{w.titel}</span>
                  <span className="text-text-muted">{w.satz}</span>
                  <span className="mt-2 inline-flex items-center gap-2 font-medium text-brand-dark">
                    Werkzeug öffnen <span aria-hidden="true" className="transition-transform duration-(--dur-fast) group-hover:translate-x-1">→</span>
                  </span>
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
