"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { begriffe, type BegriffSchluessel } from "@/lib/inhalte";

type Props = {
  /** Schlüssel im Glossar (lib/inhalte.ts, begriffe) */
  schluessel: BegriffSchluessel;
  /** Angezeigter Text, Standard: der Schlüssel */
  children?: ReactNode;
};

/** Abstand der Karte zum Begriff und zum Fensterrand */
const ABSTAND = 8;

/**
 * Fachbegriff mit Erklärung. Gepunktet unterstrichen, Hover (Maus) oder Tipp öffnet eine
 * kleine Karte mit einem Satz. Nutzt die Popover-API: liegt in der obersten Ebene, wird von
 * scrollenden Spuren nicht abgeschnitten, schließt mit Esc oder Klick daneben.
 */
export function Begriff({ schluessel, children }: Props) {
  const eintrag = begriffe[schluessel];
  const id = useId();
  const knopf = useRef<HTMLButtonElement>(null);
  const karte = useRef<HTMLSpanElement>(null);
  const zuTimer = useRef(0);
  const letzterZeiger = useRef("");

  useEffect(() => {
    const k = karte.current;
    const b = knopf.current;
    if (!k || !b) return;

    /* Unter den Begriff setzen, im Fenster halten, notfalls darüber */
    const platzieren = () => {
      const r = b.getBoundingClientRect();
      const breite = k.offsetWidth;
      const hoehe = k.offsetHeight;
      const x = Math.min(Math.max(r.left, ABSTAND), window.innerWidth - breite - ABSTAND);
      let y = r.bottom + ABSTAND;
      if (y + hoehe > window.innerHeight - ABSTAND) y = r.top - hoehe - ABSTAND;
      k.style.setProperty("--x", `${x}px`);
      k.style.setProperty("--y", `${y}px`);
    };
    const schliessen = () => k.matches(":popover-open") && k.hidePopover();
    const umschalten = (e: Event) => {
      const offen = (e as ToggleEvent).newState === "open";
      if (offen) {
        platzieren();
        window.addEventListener("scroll", schliessen, { passive: true, once: true });
      }
      b.setAttribute("aria-expanded", String(offen));
    };
    k.addEventListener("toggle", umschalten);
    return () => {
      k.removeEventListener("toggle", umschalten);
      window.removeEventListener("scroll", schliessen);
      window.clearTimeout(zuTimer.current);
    };
  }, []);

  /* Maus: beim Überfahren öffnen, kurz nach dem Verlassen schließen */
  const istMaus = (e: React.PointerEvent) => e.pointerType === "mouse";
  const auf = (e: React.PointerEvent) => {
    if (!istMaus(e)) return;
    window.clearTimeout(zuTimer.current);
    if (!karte.current?.matches(":popover-open")) karte.current?.showPopover();
  };
  const zu = (e: React.PointerEvent) => {
    if (!istMaus(e)) return;
    zuTimer.current = window.setTimeout(() => {
      if (karte.current?.matches(":popover-open")) karte.current.hidePopover();
    }, 150);
  };

  /* Maus: Karte ist durchs Überfahren schon offen, der Klick soll sie nicht wieder schließen.
     Tastatur und Touch schalten normal um. */
  const klick = (e: React.MouseEvent) => {
    if (letzterZeiger.current === "mouse" && karte.current?.matches(":popover-open")) e.preventDefault();
  };

  return (
    <>
      <button
        ref={knopf}
        type="button"
        popoverTarget={id}
        aria-expanded="false"
        aria-describedby={id}
        onPointerEnter={auf}
        onPointerLeave={zu}
        onPointerDown={(e) => (letzterZeiger.current = e.pointerType)}
        onKeyDown={() => (letzterZeiger.current = "")}
        onClick={klick}
        className="begriff"
      >
        {children ?? schluessel}
      </button>
      <span ref={karte} id={id} popover="auto" role="tooltip" className="begriff-karte hud-rahmen" onPointerEnter={auf} onPointerLeave={zu}>
        <span className="daten mb-1.5 block text-brand-dark">{eintrag.lang}</span>
        <span className="block text-sm leading-relaxed text-text">{eintrag.text}</span>
      </span>
    </>
  );
}

/** Zerlegt Text mit {Schlüssel} oder {Anzeige|Schlüssel} in Text und Begriffe. */
export function MitBegriffen({ text }: { text: string }) {
  const teile = text.split(/\{([^}]+)\}/);
  return (
    <>
      {teile.map((teil, i) => {
        if (i % 2 === 0) return teil;
        const [anzeige, schluessel = anzeige] = teil.split("|");
        return schluessel in begriffe ? (
          <Begriff key={i} schluessel={schluessel as BegriffSchluessel}>
            {anzeige}
          </Begriff>
        ) : (
          anzeige
        );
      })}
    </>
  );
}
