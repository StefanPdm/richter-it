"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brotkrumen } from "@/lib/seitenpfad";

/**
 * Einheitlicher Seitenkopf jeder Unterseite: Brotkrumen links, Pfad im Konsolenstil rechts.
 * Schmale Leiste auf der Wechselfläche direkt unter dem Header, damit sofort klar ist:
 * Das ist nicht mehr die Startseite. Auf der Startseite nichts.
 */
export function Seitenkopf() {
  const pfad = usePathname();
  const glieder = brotkrumen(pfad);
  if (glieder.length === 0) return null;

  return (
    <div className="seitenkopf border-b border-border bg-bg-alt">
      <div className="mx-auto flex max-w-wide items-center justify-between gap-6 px-(--gutter)">
        <nav aria-label="Brotkrumen" className="daten min-w-0">
          <ol className="flex flex-wrap items-center gap-x-2">
            {glieder.map((g, i) => {
              const letztes = i === glieder.length - 1;
              return (
                <li key={`${g.label}-${i}`} className="flex min-w-0 items-center gap-x-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {g.href && !letztes ? (
                    <Link href={g.href} className="inline-flex min-h-11 min-w-11 items-center hover:text-text">
                      {g.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="inline-flex min-h-11 min-w-0 items-center text-text">
                      {g.kurz ? (
                        <>
                          <span className="truncate sm:hidden">{g.kurz}</span>
                          <span className="hidden truncate sm:inline">{g.label}</span>
                        </>
                      ) : (
                        <span className="truncate">{g.label}</span>
                      )}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <span aria-hidden="true" className="daten hidden shrink-0 normal-case text-brand-dark sm:inline">
          ~{pfad}
        </span>
      </div>
    </div>
  );
}
