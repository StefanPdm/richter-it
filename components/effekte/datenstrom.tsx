"use client";

import { useEffect, useRef } from "react";
import { FARBWELT_EREIGNIS } from "@/lib/farbwelt";
import { rgba } from "@/components/medien/szenen";

type Paket = { spalte: number; y: number; laenge: number; tempo: number };

/**
 * Hintergrund "Datenstrom": feine Datenpakete laufen in Spalten nach unten.
 * Dezent (niedrige Deckkraft), pausiert außerhalb des Bildes, steht bei "weniger Bewegung".
 */
export function Datenstrom({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ABSTAND = 34;
    let farbe = getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim();
    let b = 0, h = 0, bild = 0, sichtbar = true, zuletzt = 0;
    let pakete: Paket[] = [];

    const neu = (spalte: number, oben = false): Paket => ({
      spalte,
      y: oben ? -Math.random() * h : Math.random() * h,
      laenge: 30 + Math.random() * 110,
      tempo: 18 + Math.random() * 46, // Pixel pro Sekunde: ruhig
    });

    const baue = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      b = rect.width;
      h = rect.height;
      canvas.width = Math.round(b * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const spalten = Math.ceil(b / ABSTAND);
      pakete = [];
      for (let s = 0; s < spalten; s++) if (Math.random() > 0.45) pakete.push(neu(s));
    };

    const zeichne = (dt: number) => {
      ctx.clearRect(0, 0, b, h);
      for (const p of pakete) {
        if (!ruhig) p.y += p.tempo * dt;
        if (p.y - p.laenge > h) Object.assign(p, neu(p.spalte, true));
        const x = p.spalte * ABSTAND + ABSTAND / 2;
        const verlauf = ctx.createLinearGradient(0, p.y - p.laenge, 0, p.y);
        verlauf.addColorStop(0, rgba(farbe, 0));
        verlauf.addColorStop(1, rgba(farbe, 0.35));
        ctx.fillStyle = verlauf;
        ctx.fillRect(x, p.y - p.laenge, 1.5, p.laenge);
        ctx.fillStyle = rgba(farbe, 0.7);
        ctx.fillRect(x - 0.5, p.y - 2, 2.5, 2.5); // Kopf des Pakets
      }
    };

    const schleife = (zeit: number) => {
      const dt = zuletzt ? Math.min(0.05, (zeit - zuletzt) / 1000) : 0;
      zuletzt = zeit;
      if (sichtbar) zeichne(dt);
      bild = requestAnimationFrame(schleife);
    };
    const neueWelt = () => window.setTimeout(() => {
      farbe = getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim();
      zeichne(0);
    }, 30);

    baue();
    zeichne(0);
    const beobachter = new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; zuletzt = 0; });
    beobachter.observe(canvas);
    const groesse = new ResizeObserver(() => { baue(); zeichne(0); });
    groesse.observe(canvas);
    window.addEventListener(FARBWELT_EREIGNIS, neueWelt);
    if (!ruhig) bild = requestAnimationFrame(schleife);

    return () => {
      cancelAnimationFrame(bild);
      beobachter.disconnect();
      groesse.disconnect();
      window.removeEventListener(FARBWELT_EREIGNIS, neueWelt);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`block ${className}`} />;
}
