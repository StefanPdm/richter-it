import type { ReactNode } from "react";

type Props = {
  /** Aktion der Karte, steht rechts (Button oder Link) */
  children: ReactNode;
  /** Nebensächliches links: Neben-Link, Dauer, Statuszeile */
  links?: ReactNode;
  className?: string;
};

/**
 * Fußleiste einer Karte: feine Trennlinie, links Nebensächliches, rechts die Aktion.
 * Sitzt immer am unteren Kartenrand (mt-auto), damit Aktionen in Kartenreihen auf einer
 * Linie stehen. Auf dem Handy linksbündig untereinander, dort sucht das Auge links.
 * Regel in docs/design/bausteine.md.
 */
export function KartenFuss({ children, links, className = "" }: Props) {
  return (
    <div
      className={`mt-auto flex flex-col items-start gap-x-6 gap-y-2 border-t border-border pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${className}`}
    >
      {links && <div className="min-w-0">{links}</div>}
      <div className="sm:ml-auto">{children}</div>
    </div>
  );
}
