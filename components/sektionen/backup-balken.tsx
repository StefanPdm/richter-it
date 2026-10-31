"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Props = { vorherMinuten: number; nachherMinuten: number };

/** 480 min entsprechen 6,4 s Animation, 15 min dann 0,2 s: das Verhältnis bleibt sichtbar. */
const DAUER_VORHER_MS = 6400;
/** Pause nach jedem Durchlauf, dann beginnt die Messung von vorn. */
const PAUSE_MS = 2000;

function uhr(minuten: number) {
  const s = Math.round(minuten * 60);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * Signature-Moment: Beide Balken starten gleichzeitig, "Nachher" ist fertig,
 * während "Vorher" noch läuft. Wiederholt sich nach 2 s Pause, solange sichtbar. Ruhezustand (ohne JS, Reduced Motion) = Endstand.
 */
export function BackupBalken({ vorherMinuten, nachherMinuten }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const faktor = Math.round(vorherMinuten / nachherMinuten);
  const zeilen = [
    { label: "Vorher", minuten: vorherMinuten, akzent: false },
    { label: "Nachher", minuten: nachherMinuten, akzent: true },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let bild = 0;
    let pause = 0;
    let sichtbar = false;
    let laeuft = false;

    /* Ein Durchlauf; danach 2 s Endstand stehen lassen, dann neu, solange im Bild.
       Außerhalb des Bildes wartet die Schleife und startet beim Wiederkommen. */
    const lauf = () => {
      laeuft = true;
      const fuellungen = el.querySelectorAll<HTMLElement>("[data-fuell]");
      const uhren = el.querySelectorAll<HTMLElement>("[data-uhr]");
      const start = performance.now();
      const schritt = (jetzt: number) => {
        let fertig = true;
        zeilen.forEach((z, i) => {
          const anteil = Math.min(1, (jetzt - start) / (DAUER_VORHER_MS * (z.minuten / vorherMinuten)));
          if (anteil < 1) fertig = false;
          fuellungen[i].style.setProperty("--anteil", String(anteil * (z.minuten / vorherMinuten)));
          uhren[i].textContent = uhr(z.minuten * anteil);
        });
        if (!fertig) {
          bild = requestAnimationFrame(schritt);
          return;
        }
        laeuft = false;
        pause = window.setTimeout(() => {
          if (sichtbar) lauf();
        }, PAUSE_MS);
      };
      bild = requestAnimationFrame(schritt);
    };

    const beobachter = new IntersectionObserver(
      ([e]) => {
        sichtbar = e.isIntersecting;
        if (sichtbar && !laeuft) {
          window.clearTimeout(pause);
          lauf();
        }
      },
      { threshold: 0.5 },
    );
    beobachter.observe(el);
    return () => {
      beobachter.disconnect();
      cancelAnimationFrame(bild);
      window.clearTimeout(pause);
    };
    // zeilen ergibt sich aus den Props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vorherMinuten, nachherMinuten]);

  return (
    <div ref={ref} className="grid gap-8">
      {zeilen.map((z) => (
        <div key={z.label} className="grid gap-2.5">
          <div className="flex items-baseline justify-between gap-4">
            <span className="daten">{z.label}</span>
            <span data-uhr className={`font-mono text-zahl tabular-nums ${z.akzent ? "text-brand-dark" : ""}`}>
              {uhr(z.minuten)}
            </span>
          </div>
          <div className="relative h-3.5 overflow-hidden border border-border bg-surface">
            <div
              data-fuell
              className={`absolute inset-0 origin-left scale-x-(--anteil) ${z.akzent ? "bg-brand" : "bg-text-muted"}`}
              style={{ "--anteil": z.minuten / vorherMinuten } as CSSProperties}
            />
          </div>
        </div>
      ))}
      <div className="flex flex-wrap items-baseline gap-4 border-t border-border pt-6">
        <strong className="font-display text-faktor font-medium text-brand-dark [font-stretch:72%]">{faktor}×</strong>
        <span className="daten">
          schneller · {vorherMinuten} min → {nachherMinuten} min
        </span>
      </div>
    </div>
  );
}
