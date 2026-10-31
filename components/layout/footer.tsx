import Link from "next/link";
import { site } from "@/lib/site";

/** Footer: Anschrift, Rechtliches, KI-Hinweis. Unten Platz für den Farbwelt-Wähler. */
export function Footer() {
  const { adresse } = site;
  return (
    <footer className="border-t border-border pt-12 pb-36 text-sm text-text-muted">
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
