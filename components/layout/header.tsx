import Link from "next/link";
import { site } from "@/lib/site";
import { ThemaKnopf } from "@/components/ui/thema-knopf";
import { Marke } from "@/components/marke/marke";
import { MobilMenue } from "@/components/layout/mobil-menue";

/** Header: Marke, 4 Links, eine Aktion. Klebt oben. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg transition-colors duration-(--dur-welt)">
      <div className="mx-auto flex min-h-(--header-h) max-w-wide items-center justify-between gap-3 px-(--gutter) sm:gap-6">
        <Marke />
        <nav aria-label="Hauptmenü" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm">
            {site.navigation.map((punkt) => (
              <li key={punkt.href}>
                <Link
                  href={punkt.href}
                  className="nav-link zucken text-text-muted no-underline transition-colors duration-(--dur-fast) hover:text-text"
                >
                  {punkt.label}
                </Link>
              </li>
            ))}
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
