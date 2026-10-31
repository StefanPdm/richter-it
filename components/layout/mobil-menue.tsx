"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Marke } from "@/components/marke/marke";
import { DekodierText } from "@/components/effekte/dekodier-text";
import { site } from "@/lib/site";
import { zumFormular } from "@/lib/kontakt-thema";

/**
 * Handymenü im Leitstand-Stil: bildschirmfüllendes <dialog> mit Raster,
 * HUD-Ecken und nummerierten Links, die nacheinander einfahren.
 * Natives Dialog-Verhalten: Escape schließt, Fokus bleibt im Menü, Seite scrollt nicht.
 */
export function MobilMenue() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [offen, setOffen] = useState(false);

  function oeffnen() {
    dialog.current?.showModal();
    setOffen(true);
  }
  function schliessen() {
    dialog.current?.close();
  }
  /* Link geklickt: Menü zu, dann zum Ziel (Browser übernimmt den Sprung) */
  function geheZu() {
    schliessen();
  }
  function kontakt(e: MouseEvent<HTMLAnchorElement>) {
    schliessen();
    zumFormular(e, { anliegen: "Erstgespräch" });
  }

  return (
    <>
      <button
        type="button"
        onClick={oeffnen}
        aria-expanded={offen}
        aria-controls="mobil-menue"
        aria-label="Menü öffnen"
        className="burger grid size-11 cursor-pointer place-content-center gap-1 border border-border text-text md:hidden"
      >
        <span />
        <span />
        <span />
      </button>

      <dialog id="mobil-menue" ref={dialog} className="menue md:hidden" aria-label="Menü" onClose={() => setOffen(false)}>
        <div className="relative isolate flex h-full flex-col overflow-y-auto">
          {/* Hintergrund: feines Raster und Scanlines, ruhig */}
          <div aria-hidden="true" className="hg-lichtfeger absolute inset-0 -z-10" />
          <div aria-hidden="true" className="scanlines -z-10" />

          <div className="flex min-h-(--header-h) items-center justify-between gap-4 border-b border-border px-(--gutter)">
            <Marke />
            <button
              type="button"
              onClick={schliessen}
              aria-label="Menü schließen"
              className="burger grid size-11 cursor-pointer place-content-center gap-1 border border-border"
              aria-expanded="true"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <div className="hud-rahmen m-4 flex flex-1 flex-col justify-between gap-10 p-6">
            <div className="grid gap-6">
              <p className="daten flex items-center gap-2.5 text-text">
                <span className="status-punkt" aria-hidden="true" />
                {offen && <DekodierText text="Navigation · System online" />}
              </p>
              <nav aria-label="Hauptmenü mobil">
                <ul className="grid">
                  {site.navigation.map((punkt, i) => (
                    <li key={punkt.href} className="menue__punkt border-b border-border" style={{ "--i": i } as CSSProperties}>
                      <a href={punkt.href} onClick={geheZu} className="zucken flex items-baseline gap-4 py-4">
                        <span className="daten text-brand-dark">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-display text-h2 leading-none font-medium [font-stretch:72%]">{punkt.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="menue__punkt grid gap-4" style={{ "--i": site.navigation.length } as CSSProperties}>
              <a
                href="#kontakt"
                onClick={kontakt}
                className="schnitt inline-flex min-h-12 items-center justify-center gap-2 bg-brand-dark px-6 font-medium text-text-inverse"
              >
                {site.aktion.label} <span aria-hidden="true">→</span>
              </a>
              <div className="grid gap-1">
                <a href={`tel:${site.telefon.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center font-mono">
                  {site.telefon}
                </a>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center font-mono text-sm text-text-muted">
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
