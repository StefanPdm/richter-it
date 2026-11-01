"use client";

import { useState, useSyncExternalStore } from "react";
import { FARBWELTEN, FARBWELT_EREIGNIS, SPEICHER_SCHLUESSEL, STANDARD_WELT, istFarbwelt, type FarbweltId } from "@/lib/farbwelt";

/* Die aktive Welt steht im data-welt-Attribut von <html>, nicht in React. */
function abonnieren(melden: () => void) {
  window.addEventListener(FARBWELT_EREIGNIS, melden);
  return () => window.removeEventListener(FARBWELT_EREIGNIS, melden);
}
function lesen(): FarbweltId {
  const gesetzt = document.documentElement.getAttribute("data-welt");
  return istFarbwelt(gesetzt) ? gesetzt : STANDARD_WELT;
}

/**
 * Wähler für die drei Farbwelten. Nur im Entwurf sichtbar
 * (NEXT_PUBLIC_FARBWELT_WAEHLER=an). Merkt die Wahl im Browser und im Link (#kobalt).
 */
export function FarbweltWaehler() {
  const aktiv = useSyncExternalStore(abonnieren, lesen, () => STANDARD_WELT);
  const [offen, setOffen] = useState(false);

  function waehle(id: FarbweltId) {
    document.documentElement.setAttribute("data-welt", id);
    try {
      localStorage.setItem(SPEICHER_SCHLUESSEL, id);
      history.replaceState(null, "", `#${id}`);
    } catch {
      /* Speicher gesperrt: Wahl gilt nur für diese Ansicht */
    }
    window.dispatchEvent(new CustomEvent(FARBWELT_EREIGNIS, { detail: id }));
  }

  const muster = (welt: (typeof FARBWELTEN)[number]) => ({
    background: `linear-gradient(135deg, ${welt.muster[0]} 50%, ${welt.muster[1]} 50%)`,
  });
  const aktuelleWelt = FARBWELTEN.find((w) => w.id === aktiv) ?? FARBWELTEN[0];

  return (
    <>
      {/* Handy: eingeklappt nur ein kleines Feld mit der aktiven Farbe, Tipp klappt die drei auf */}
      <aside
        aria-label="Farbwelt wählen (nur im Entwurf)"
        className="fixed right-[max(10px,env(safe-area-inset-right,0px))] bottom-[calc(var(--unten)+10px)] z-30 flex items-center border border-border bg-surface/90 shadow-float sm:hidden"
      >
        {offen && (
          <div id="welt-mobil-liste" className="flex items-center border-r border-border" role="group" aria-label="Farbwelten">
            {FARBWELTEN.map((welt) => (
              <button
                key={welt.id}
                id={`welt-mobil-${welt.id}`}
                type="button"
                aria-label={`Farbwelt ${welt.name}`}
                aria-pressed={aktiv === welt.id}
                onClick={() => {
                  waehle(welt.id);
                  setOffen(false);
                }}
                className="grid size-11 cursor-pointer place-items-center border border-transparent aria-pressed:border-brand"
              >
                <span aria-hidden="true" className="size-6 border border-black/20" style={muster(welt)} />
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          aria-expanded={offen}
          aria-controls="welt-mobil-liste"
          aria-label={offen ? "Farbwahl schließen" : "Farbwelt wählen"}
          onClick={() => setOffen((o) => !o)}
          className="grid size-11 cursor-pointer place-items-center"
        >
          {offen ? (
            <span aria-hidden="true" className="font-mono text-sm text-text-muted">
              ×
            </span>
          ) : (
            <span aria-hidden="true" className="size-5 border border-black/20" style={muster(aktuelleWelt)} />
          )}
        </button>
      </aside>

      {/* Ab Tablet: ausführlich mit Namen und Herkunft */}
      <aside
        aria-label="Farbwelt wählen (nur im Entwurf)"
        className="fixed bottom-[calc(var(--unten)+16px)] left-1/2 z-30 hidden w-[min(760px,calc(100%-32px))] -translate-x-1/2 gap-2.5 border border-border bg-surface p-3.5 shadow-float transition-colors duration-(--dur-welt) sm:grid"
      >
      <div className="flex items-baseline justify-between gap-3">
        <span className="daten">Entwurf · Farbwelt wählen</span>
        <span className="daten hidden text-brand-dark sm:inline">Präsentation · Zahlen, Fälle, Zitate sind Beispiele</span>
      </div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Farbwelten">
        {FARBWELTEN.map((welt) => (
          <button
            key={welt.id}
            id={`welt-${welt.id}`}
            type="button"
            aria-pressed={aktiv === welt.id}
            onClick={() => waehle(welt.id)}
            className="grid min-h-13 cursor-pointer grid-cols-1 items-center justify-items-center gap-1 border border-border bg-bg p-2 text-center text-text transition-colors duration-(--dur-fast) aria-pressed:border-brand aria-pressed:shadow-[inset_0_0_0_1px_var(--color-brand)] sm:grid-cols-[auto_minmax(0,1fr)] sm:justify-items-start sm:gap-x-2.5 sm:px-3 sm:text-left"
          >
            <span aria-hidden="true" className="size-6.5 border border-black/20 sm:row-span-2" style={muster(welt)} />
            <span className="text-sm font-semibold">{welt.name}</span>
            <span className="hidden text-xs leading-snug text-text-muted sm:block">{welt.satz}</span>
          </button>
        ))}
      </div>
      </aside>
    </>
  );
}
