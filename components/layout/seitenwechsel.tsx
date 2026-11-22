"use client";

import { useEffect, ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/* Erster Aufruf ohne Scanlinie: Sie gehört zum Wechsel, nicht zum Laden */
let schonGeladen = false;

/**
 * Seitenwechsel: Inhalt und Seitenkopf werden bei jedem neuen Pfad abgelöst (View Transitions,
 * CSS in globals.css). Der Schlüssel am Pfad sorgt dafür, dass nur echte Seitenwechsel animieren,
 * nicht andere Übergänge innerhalb einer Seite. Header und Statusleiste stehen still.
 * Die Scanlinie läuft einmal über die neue Seite, auch in Browsern ohne View Transitions.
 * Weniger Bewegung: kein Übergang, keine Scanlinie (globals.css).
 */
export function Seitenwechsel({ children }: { children: ReactNode }) {
  const pfad = usePathname();
  const mitScan = schonGeladen;
  useEffect(() => {
    schonGeladen = true;
  }, []);

  return (
    <>
      <ViewTransition key={pfad} enter="seite-ein" exit="seite-aus" default="none">
        <div>{children}</div>
      </ViewTransition>
      {mitScan && <div key={`scan-${pfad}`} className="seitenscan" aria-hidden="true" />}
    </>
  );
}
