import Link from "next/link";
import { site } from "@/lib/site";
import { ThemaKnopf } from "@/components/ui/thema-knopf";

/** Footer: Anschrift, Rechtliches, KI-Hinweis. Unten Platz für Farbwelt-Wähler und Statusleiste. */
export function Footer() {
  const { adresse } = site;
  return (
    <footer className="border-t border-border pt-12 pb-[calc(9rem+var(--unten))] text-sm text-text-muted">
      <div className="mx-auto mb-10 flex max-w-wide flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-border px-(--gutter) pb-10">
        <p className="font-display text-h3 font-medium text-text [font-stretch:80%]">Mehr Leistung, ohne Neubau. Sprechen wir darüber.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ThemaKnopf thema={{ anliegen: "Erstgespräch" }}>Gespräch vereinbaren</ThemaKnopf>
          <a href={`tel:${site.telefon.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center font-mono text-text hover:text-brand-dark">
            {site.telefon}
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-wide flex-wrap items-center justify-between gap-x-8 gap-y-3 px-(--gutter)">
        <span>
          {site.firma} · {adresse.strasse} · {adresse.plz} {adresse.ort}
        </span>
        <nav aria-label="Rechtliches">
          <ul className="flex gap-6">
            {site.rechtliches.map((punkt) => (
              <li key={punkt.href}>
                <Link href={punkt.href} className="inline-flex min-h-11 items-center hover:text-text">
                  {punkt.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Social Media">
          <ul className="flex gap-6">
            {site.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="inline-flex min-h-11 items-center hover:text-text">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span>Bilder und Videos auf dieser Seite sind teilweise mit KI erstellt.</span>
      </div>
    </footer>
  );
}
