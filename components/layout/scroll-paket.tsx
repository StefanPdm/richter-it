"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/*
 * Datenpaket auf dem Scroll-Balken: läuft an der Spitze mit, zeigt Fortschritt und Abschnitt,
 * dockt am Seitenende an den Port an (ACK). Position, Prozent und ACK laufen rein über CSS
 * (scroll-driven animations); hier wird nur der Name des sichtbaren Abschnitts ermittelt.
 */

const ABSCHNITTE: Record<string, string> = {
  leistungen: "Leistungen",
  messung: "Backup",
  leitstand: "Leitstand",
  werkzeuge: "Werkzeuge",
  referenzen: "Referenzen",
  "ueber-mich": "Über mich",
  partner: "Partner",
  kontakt: "Kontakt",
};

/** Name, wenn gerade kein bekannter Abschnitt in der Mitte steht */
function seitenName(pfad: string) {
  if (pfad === "/") return "Start";
  const teil = pfad.split("/")[1] ?? "";
  if (teil === "werkzeuge") return "Werkzeuge";
  if (teil === "impressum") return "Impressum";
  if (teil === "datenschutz") return "Datenschutz";
  return "Route";
}

export function ScrollPaket() {
  const pfad = usePathname();
  const [abschnitt, setAbschnitt] = useState<string | null>(null);

  useEffect(() => {
    const sichtbar = new Set<HTMLElement>();
    const reihenfolge = [...document.querySelectorAll<HTMLElement>("section[id]")].filter((s) => s.id in ABSCHNITTE);
    /* Footer als letzte Station: "EOF" */
    const fuss = document.querySelector("footer");
    if (fuss) {
      fuss.dataset.paket = "EOF";
      reihenfolge.push(fuss);
    }
    /* Beobachtet wird ein schmaler Streifen in der Bildschirmmitte */
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          if (e.isIntersecting) sichtbar.add(e.target as HTMLElement);
          else sichtbar.delete(e.target as HTMLElement);
        }
        const aktiv = reihenfolge.find((s) => sichtbar.has(s));
        setAbschnitt(aktiv ? (aktiv.dataset.paket ?? ABSCHNITTE[aktiv.id]) : null);
      },
      { rootMargin: "-50% 0px -49% 0px" },
    );
    reihenfolge.forEach((s) => beobachter.observe(s));
    return () => beobachter.disconnect();
  }, [pfad]);

  return (
    <div className="scroll-paket" aria-hidden="true">
      <div className="paket-kopf">
        <span className="paket-kennung daten">
          PKT <span className="paket-prozent" /> % · {abschnitt ?? seitenName(pfad)}
        </span>
      </div>
      <div className="paket-port">
        <svg viewBox="0 0 18 14" width="18" height="14">
          <path d="M1 1h16v9h-3v3H4v-3H1z" fill="var(--color-bg)" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 4v2M7.7 4v2M10.3 4v2M13 4v2" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="paket-ack daten">ACK</span>
      </div>
    </div>
  );
}
