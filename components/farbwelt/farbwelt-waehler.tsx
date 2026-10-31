"use client";

import { useSyncExternalStore } from "react";
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

  return (
    <aside
      aria-label="Farbwelt wählen (nur im Entwurf)"
      className="fixed bottom-[max(16px,env(safe-area-inset-bottom,0px))] left-1/2 z-30 grid w-[min(760px,calc(100%-32px))] -translate-x-1/2 gap-2.5 border border-border bg-surface p-3.5 shadow-float transition-colors duration-(--dur-welt)"
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
            <span
              aria-hidden="true"
              className="size-6.5 border border-black/20 sm:row-span-2"
              style={{ background: `linear-gradient(135deg, ${welt.muster[0]} 50%, ${welt.muster[1]} 50%)` }}
            />
            <span className="text-sm font-semibold">{welt.name}</span>
            <span className="hidden text-xs leading-snug text-text-muted sm:block">{welt.satz}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
