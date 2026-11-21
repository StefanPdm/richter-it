"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Beschriftung der Spur für Screenreader */
  label: string;
  /** Überschrift der Sektion: steht in der klebenden Bühne und bleibt, bis alle Karten durch sind */
  kopf?: ReactNode;
};

const RUHIG = "(prefers-reduced-motion: reduce)";
/* Unter dieser Höhe (Handy quer) passt die Spur nicht sicher ins Bild: dann Wischleiste */
const MIN_HOEHE = 560;
/* Höhe der Fußzeile (Beschriftung und Fortschrittsbalken), solange sie ausgeblendet ist */
const FUSS_HOEHE = 20;

/**
 * Horizontale Spur: Beim Scrollen nach unten fährt die Reihe von rechts nach links durch,
 * die Bühne klebt solange unter dem Header. Ohne JavaScript, bei "weniger Bewegung"
 * und bei niedrigen Bildschirmen bleibt es eine Wischleiste mit Einrasten.
 * Mit "kopf" klebt auch die Überschrift mit. Passt die Bühne nicht ins Fenster,
 * bleibt es ebenfalls eine Wischleiste. Die Kinder sind die Listeneinträge (li).
 */
export function HorizontalSpur({ children, label, kopf }: Props) {
  const aussen = useRef<HTMLDivElement>(null);
  const buehne = useRef<HTMLDivElement>(null);
  const spur = useRef<HTMLUListElement>(null);
  const balken = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const a = aussen.current, b = buehne.current, s = spur.current, z = balken.current;
    if (!a || !b || !s || !z) return;
    const ruhig = window.matchMedia(RUHIG);
    let weg = 0;
    let wartet = 0;

    const stelle = () => {
      wartet = 0;
      if (a.dataset.aktiv !== "true") return;
      const r = a.getBoundingClientRect();
      /* Fortschritt: wie weit die Sektion unter der klebenden Bühne schon durchgelaufen ist */
      const oben = parseFloat(getComputedStyle(b).top) || 0;
      const strecke = r.height - b.offsetHeight;
      const p = strecke > 0 ? Math.min(1, Math.max(0, (oben - r.top) / strecke)) : 0;
      s.style.transform = `translate3d(${-p * weg}px,0,0)`;
      z.style.transform = `scaleX(${p})`;
    };
    const beimScrollen = () => {
      if (!wartet) wartet = requestAnimationFrame(stelle);
    };

    /* Höhe des Inhalts der Bühne (Kopf, Spur, Fuß samt Abständen). Der Fuß ist nur im
       aktiven Zustand sichtbar: ausgeblendet zählt er mit seiner Zeilenhöhe. */
    const inhaltHoehe = () => {
      const kinder = Array.from(b.children) as HTMLElement[];
      const abstand = parseFloat(getComputedStyle(b).rowGap) || 0;
      const fuss = b.querySelector<HTMLElement>(".spur-fuss");
      const fussReserve = fuss && fuss.offsetHeight === 0 ? FUSS_HOEHE : 0;
      return kinder.reduce((summe, k) => summe + k.offsetHeight, 0) + fussReserve + abstand * (kinder.length - 1);
    };
    const messen = () => {
      /* Platz zwischen Header und Statusleiste, abzüglich Innenabstand der Bühne */
      const kopfzeile = document.querySelector("header")?.offsetHeight ?? 0;
      const fusszeile = document.querySelector<HTMLElement>(".statusleiste")?.offsetHeight ?? 0;
      const innen = parseFloat(getComputedStyle(b).paddingTop) || 0;
      const passt = inhaltHoehe() + innen <= window.innerHeight - kopfzeile - fusszeile;
      const aktiv = !ruhig.matches && window.innerHeight >= MIN_HOEHE && passt;
      a.dataset.aktiv = String(aktiv);
      if (!aktiv) {
        a.style.height = "";
        s.style.transform = "";
        return;
      }
      const letzte = s.lastElementChild as HTMLElement | null;
      const randRechts = parseFloat(getComputedStyle(s).paddingRight) || 0;
      const inhalt = letzte ? letzte.offsetLeft + letzte.offsetWidth + randRechts : 0;
      weg = Math.max(0, inhalt - b.clientWidth);
      /* Scrollstrecke = horizontaler Weg; dazu die Höhe der klebenden Bühne */
      a.style.height = `${weg + b.offsetHeight}px`;
      stelle();
    };

    const groesse = new ResizeObserver(messen);
    groesse.observe(b);
    ruhig.addEventListener("change", messen);
    window.addEventListener("scroll", beimScrollen, { passive: true });
    messen();
    return () => {
      cancelAnimationFrame(wartet);
      groesse.disconnect();
      ruhig.removeEventListener("change", messen);
      window.removeEventListener("scroll", beimScrollen);
    };
  }, []);

  return (
    <div ref={aussen} className="spur-aussen" data-aktiv="false">
      <div ref={buehne} className="spur-buehne">
        {kopf && <div className="spur-kopf">{kopf}</div>}
        <ul ref={spur} className="spur" aria-label={label}>
          {children}
        </ul>
        <div className="spur-fuss" aria-hidden="true">
          <span className="daten">Module · scrollen</span>
          <span className="spur-leiste">
            <span ref={balken} className="spur-balken" />
          </span>
        </div>
      </div>
    </div>
  );
}
