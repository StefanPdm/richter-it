"use client";

import { useSyncExternalStore } from "react";

/* Sichtbar, sobald der Hero (etwa eine Bildschirmhöhe) durchgescrollt ist */
function abonnieren(melden: () => void) {
  window.addEventListener("scroll", melden, { passive: true });
  window.addEventListener("resize", melden);
  return () => {
    window.removeEventListener("scroll", melden);
    window.removeEventListener("resize", melden);
  };
}
const unterHero = () => window.scrollY > window.innerHeight * 0.9;

type Props = {
  /** Farbwähler ist eingeblendet: Knopf sitzt darüber statt daneben */
  ueberWaehler?: boolean;
};

/**
 * Zurück zum Seitenanfang. Weiches Scrollen kommt aus html { scroll-behavior },
 * das bei "weniger Bewegung" ausgeschaltet ist. Fokus landet danach auf der Marke im Header.
 */
export function NachOben({ ueberWaehler = false }: Props) {
  const sichtbar = useSyncExternalStore(abonnieren, unterHero, () => false);

  function hoch() {
    window.scrollTo({ top: 0 });
    document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  }

  /* Abstand unten: Handy über dem kleinen Wählerfeld, Tablet über der Wählerleiste, breit daneben */
  const unten = ueberWaehler
    ? "bottom-[calc(var(--unten)+10px+3.5rem)] sm:bottom-[calc(var(--unten)+16px+10.5rem)] min-[60rem]:bottom-[calc(var(--unten)+16px)]"
    : "bottom-[calc(var(--unten)+16px)]";

  return (
    <button
      type="button"
      onClick={hoch}
      aria-label="Nach oben"
      aria-hidden={!sichtbar}
      tabIndex={sichtbar ? 0 : -1}
      className={`nach-oben schnitt fixed right-[max(10px,env(safe-area-inset-right,0px))] z-30 grid size-11 cursor-pointer place-items-center border border-border bg-surface/90 text-text shadow-float sm:right-[max(16px,env(safe-area-inset-right,0px))] sm:size-12 ${unten}`}
      data-sichtbar={sichtbar}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" strokeLinecap="square" />
      </svg>
    </button>
  );
}
