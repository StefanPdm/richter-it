import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { werkzeuge } from "@/lib/werkzeuge";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";

/**
 * Startseite: kompakter Hinweis auf die Werkzeuge, eine Zeile je Werkzeug. Ruhiger Hintergrund.
 * Dazu der Domain-Check als Eingabefeld (Teaser): ein normales GET-Formular, das auf der
 * Werkzeugseite mit ?domain= landet und dort die Prüfung startet. Geht auch ohne JavaScript.
 */
export function WerkzeugeTeaser() {
  return (
    <section id="werkzeuge" aria-labelledby="werkzeuge-teaser-titel" className="relative isolate scroll-mt-(--header-h) py-(--section-y)">
      <Sektionsgrund licht="links-unten" motiv="marken" />
      <div className="mx-auto grid max-w-wide gap-[clamp(2rem,4vw,3.5rem)] px-(--gutter) lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        <Reveal className="grid gap-5">
          <span className="daten">Werkzeuge · ohne Anmeldung</span>
          <h2 id="werkzeuge-teaser-titel" className="titel-linie max-w-[14ch] text-h2">
            Erst selbst nachrechnen.
          </h2>
          <p className="max-w-measure text-text-muted">
            Fünf kleine Werkzeuge für eine erste Einschätzung. Ohne Anmeldung.
          </p>
          <form action="/werkzeuge/domain-check" method="get" className="grid max-w-md gap-2 border-l-2 border-brand py-1 pl-4">
            <label htmlFor="teaser-domain" className="daten text-text">
              Domain-Check · Sicherheit und KI-Sichtbarkeit
            </label>
            <div className="flex gap-2">
              <input
                id="teaser-domain"
                name="domain"
                placeholder="ihre-domain.de"
                inputMode="url"
                autoCapitalize="none"
                spellCheck={false}
                required
                className="w-full min-w-0 border border-border-strong bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-text-muted/70 transition-colors duration-(--dur-fast) focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                className="zucken inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 border border-border-strong px-4 font-medium text-brand-dark transition-colors duration-(--dur-fast) hover:border-brand"
              >
                Prüfen <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
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
