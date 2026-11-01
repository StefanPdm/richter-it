import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { werkzeuge } from "@/lib/werkzeuge";

/** Startseite: kompakter Hinweis auf die Werkzeuge, eine Zeile je Werkzeug. Ruhiger Hintergrund. */
export function WerkzeugeTeaser() {
  return (
    <section id="werkzeuge" aria-labelledby="werkzeuge-teaser-titel" className="scroll-mt-(--header-h) py-(--section-y)">
      <div className="mx-auto grid max-w-wide gap-[clamp(2rem,4vw,3.5rem)] px-(--gutter) lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        <Reveal className="grid gap-5">
          <span className="daten">Werkzeuge · im Browser</span>
          <h2 id="werkzeuge-teaser-titel" className="titel-linie max-w-[14ch] text-h2">
            Erst selbst nachrechnen.
          </h2>
          <p className="max-w-measure text-text-muted">
            Vier kleine Werkzeuge für eine erste Einschätzung. Ohne Anmeldung, ohne Datenübertragung.
          </p>
          <Link href="/werkzeuge" className="zucken inline-flex min-h-11 items-center gap-2 justify-self-start font-medium text-brand-dark">
            Alle Werkzeuge <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <Reveal index={1} as="ul" className="grid border-t border-border">
          {werkzeuge.map((w) => (
            <li key={w.slug} className="border-b border-border">
              <Link
                href={`/werkzeuge/${w.slug}`}
                className="group grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-baseline gap-4 py-5 transition-colors duration-(--dur-fast) hover:text-brand-dark"
              >
                <span className="daten text-brand-dark">{w.kennung}</span>
                <span className="grid gap-1">
                  <span className="font-medium">{w.titel}</span>
                  <span className="text-sm text-text-muted">{w.kurz}</span>
                </span>
                <span aria-hidden="true" className="transition-transform duration-(--dur-fast) group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
