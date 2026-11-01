import Link from "next/link";
import type { ReactNode } from "react";
import { Kontakt } from "@/components/sektionen/kontakt";
import { werkzeug, werkzeuge, type WerkzeugSlug } from "@/lib/werkzeuge";

type Props = {
  slug: WerkzeugSlug;
  /** Einleitung unter der Überschrift */
  einleitung: string;
  /** Annahmen und Quellen, steht unter dem Werkzeug */
  annahmen?: ReactNode;
  children: ReactNode;
};

/**
 * Rahmen jeder Werkzeugseite: Pfad, Überschrift, Einleitung, Werkzeug, Annahmen,
 * Hinweis "rechnet nur im Browser", Links zu den anderen Werkzeugen, Kontakt.
 */
export function WerkzeugSeite({ slug, einleitung, annahmen, children }: Props) {
  const w = werkzeug(slug);
  const andere = werkzeuge.filter((x) => x.slug !== slug);
  return (
    <>
      <section aria-labelledby="werkzeug-titel" className="py-(--section-y)">
        <div className="mx-auto grid max-w-wide gap-[clamp(2rem,4vw,3.5rem)] px-(--gutter)">
          <div className="grid gap-5">
            <nav aria-label="Pfad" className="daten">
              <Link href="/werkzeuge" className="inline-flex min-h-11 items-center hover:text-text">
                Werkzeuge
              </Link>{" "}
              / <span className="text-brand-dark">{w.kennung}</span>
            </nav>
            <h1 id="werkzeug-titel" className="titel-linie max-w-[18ch] text-h2">
              {w.titel}
            </h1>
            <p className="max-w-measure text-lead text-text-muted">{einleitung}</p>
            <p className="daten flex items-center gap-2.5">
              <span className="status-punkt" aria-hidden="true" />
              Rechnet nur in Ihrem Browser · keine Daten werden gesendet
            </p>
          </div>

          {children}

          {annahmen && (
            <details className="max-w-measure border-t border-border pt-5 text-sm text-text-muted">
              <summary className="daten cursor-pointer text-text">Annahmen und Quellen</summary>
              <div className="mt-4 grid gap-3">{annahmen}</div>
            </details>
          )}

          <nav aria-label="Weitere Werkzeuge" className="grid gap-4 border-t border-border pt-8">
            <span className="daten">Weitere Werkzeuge</span>
            <ul className="grid gap-(--gap-karten) sm:grid-cols-3">
              {andere.map((x) => (
                <li key={x.slug}>
                  <Link href={`/werkzeuge/${x.slug}`} className="zucken grid gap-1 border-l-2 border-border py-1 pl-4 hover:border-brand">
                    <span className="daten text-brand-dark">{x.kennung}</span>
                    <span className="font-medium">{x.titel}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <Kontakt />
    </>
  );
}
