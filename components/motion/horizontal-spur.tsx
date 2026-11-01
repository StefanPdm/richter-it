"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Beschriftung der Spur für Screenreader */
  label: string;
};

const RUHIG = "(prefers-reduced-motion: reduce)";
/* Unter dieser Höhe (Handy quer) passt die Spur nicht sicher ins Bild: dann Wischleiste */
const MIN_HOEHE = 560;

/**
 * Horizontale Spur: Beim Scrollen nach unten fährt die Reihe von rechts nach links durch,
 * die Bühne klebt solange unter dem Header. Ohne JavaScript, bei "weniger Bewegung"
 * und bei niedrigen Bildschirmen bleibt es eine Wischleiste mit Einrasten.
 * Die Kinder sind die Listeneinträge (li).
 */
export function HorizontalSpur({ children, label }: Props) {
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

    const messen = () => {
      const aktiv = !ruhig.matches && window.innerHeight >= MIN_HOEHE;
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
