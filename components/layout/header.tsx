import Link from "next/link";
import { site } from "@/lib/site";
import { ThemaKnopf } from "@/components/ui/thema-knopf";
import { Marke } from "@/components/marke/marke";
import { MobilMenue } from "@/components/layout/mobil-menue";
import { NavAufklapp } from "@/components/layout/nav-aufklapp";

/** Header: Marke, höchstens 6 Menüpunkte (einer davon mit Aufklappmenü), eine Aktion. Klebt oben. */
export function Header() {
  /* z-70: über Scroll-Balken und Paket-Anzeige (z 60), damit das Aufklappmenü darüber liegt */
  return (
    <header className="sticky top-0 z-70 border-b border-border bg-bg transition-colors duration-(--dur-welt)">
      <div className="mx-auto flex min-h-(--header-h) max-w-wide items-center justify-between gap-3 px-(--gutter) sm:gap-6">
        <Marke />
        <nav aria-label="Hauptmenü" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm">
            {site.navigation.map((punkt) =>
              "unter" in punkt ? (
                <NavAufklapp key={punkt.href} label={punkt.label} href={punkt.href} unter={punkt.unter} />
              ) : (
              <li key={punkt.href}>
                <Link
                  href={punkt.href}
                  className="nav-link zucken text-text-muted no-underline transition-colors duration-(--dur-fast) hover:text-text"
                >
                  {punkt.label}
                </Link>
              </li>
              ),
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ThemaKnopf thema={{ anliegen: "Erstgespräch" }} pfeil={false}>
            <span className="hidden sm:inline">{site.aktion.label}</span>
            <span className="sm:hidden">{site.aktion.kurz}</span>
          </ThemaKnopf>
          <MobilMenue />
        </div>
      </div>
    </header>
  );
}
