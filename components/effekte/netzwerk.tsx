"use client";

import { useEffect, useRef } from "react";
import { FARBWELT_EREIGNIS } from "@/lib/farbwelt";
import { rgba } from "@/components/medien/szenen";

type Knoten = { x: number; y: number; vx: number; vy: number; r: number };

type Props = { className?: string; dichte?: number };

/**
 * Knoten-Netz wie in Daniels Logo. Knoten treiben langsam, nahe Knoten verbinden sich,
 * unter dem Mauszeiger leuchtet das Netz auf (Deko, Marketing-Fläche).
 * Pausiert außerhalb des Bildes, steht bei "weniger Bewegung".
 */
export function Netzwerk({ className = "", dichte = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let farbe = getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim();
    let b = 0, h = 0, bild = 0, sichtbar = true;
    let knoten: Knoten[] = [];
    const maus = { x: -9999, y: -9999 };
    const REICHWEITE = 130;

    const baue = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      b = rect.width;
      h = rect.height;
      canvas.width = Math.round(b * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const anzahl = Math.round(Math.min(110, (b * h) / 14000) * dichte);
      knoten = Array.from({ length: anzahl }, () => ({
        x: Math.random() * b,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() > 0.9 ? 3 + Math.random() * 2.5 : 1.2 + Math.random() * 1.4,
      }));
    };

    const zeichne = () => {
      ctx.clearRect(0, 0, b, h);
      for (const k of knoten) {
        if (!ruhig) {
          k.x += k.vx;
          k.y += k.vy;
          if (k.x < 0 || k.x > b) k.vx *= -1;
          if (k.y < 0 || k.y > h) k.vy *= -1;
        }
      }
      for (let i = 0; i < knoten.length; i++) {
        const a = knoten[i];
        for (let j = i + 1; j < knoten.length; j++) {
          const c = knoten[j];
          const d = Math.hypot(a.x - c.x, a.y - c.y);
          if (d > REICHWEITE) continue;
          const nahMaus = Math.hypot((a.x + c.x) / 2 - maus.x, (a.y + c.y) / 2 - maus.y) < 180;
          ctx.strokeStyle = rgba(farbe, (1 - d / REICHWEITE) * (nahMaus ? 0.7 : 0.22));
          ctx.lineWidth = nahMaus ? 1.2 : 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
        }
      }
      for (const k of knoten) {
        const nah = Math.hypot(k.x - maus.x, k.y - maus.y) < 180;
        ctx.fillStyle = rgba(farbe, nah ? 0.95 : 0.55);
        ctx.beginPath();
        ctx.arc(k.x, k.y, nah ? k.r * 1.4 : k.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const schleife = () => {
      if (sichtbar) zeichne();
      bild = requestAnimationFrame(schleife);
    };

    const bewegt = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      maus.x = e.clientX - rect.left;
      maus.y = e.clientY - rect.top;
      if (ruhig) zeichne();
    };
    const raus = () => { maus.x = -9999; maus.y = -9999; };
    const neueWelt = () => window.setTimeout(() => {
      farbe = getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim();
      zeichne();
    }, 30);

    baue();
    zeichne();
    const flaeche = canvas.parentElement ?? canvas;
    const zeiger = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (zeiger) {
      flaeche.addEventListener("pointermove", bewegt);
      flaeche.addEventListener("pointerleave", raus);
    }
    const beobachter = new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; });
    beobachter.observe(canvas);
    const groesse = new ResizeObserver(() => { baue(); zeichne(); });
    groesse.observe(canvas);
    window.addEventListener(FARBWELT_EREIGNIS, neueWelt);
    if (!ruhig) bild = requestAnimationFrame(schleife);

    return () => {
      cancelAnimationFrame(bild);
      beobachter.disconnect();
      groesse.disconnect();
      flaeche.removeEventListener("pointermove", bewegt);
      flaeche.removeEventListener("pointerleave", raus);
      window.removeEventListener(FARBWELT_EREIGNIS, neueWelt);
    };
  }, [dichte]);

  return <canvas ref={ref} aria-hidden="true" className={`block ${className}`} />;
}
