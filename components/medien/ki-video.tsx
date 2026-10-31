"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { FARBWELT_EREIGNIS } from "@/lib/farbwelt";
import { megastruktur, rackreihen, type Farben, type Szene } from "./szenen";

type Props = {
  /** Platzhalter-Szene, solange kein Video da ist */
  szene: "megastruktur" | "rackreihen";
  /** Fertiges KI-Video (in /public/medien), sonst Platzhalter */
  video?: { mp4: string; webm?: string; poster: string };
  className?: string;
};

const SZENEN: Record<Props["szene"], () => Szene> = { megastruktur, rackreihen };

const RUHIG = "(prefers-reduced-motion: reduce)";
function abonnierenRuhig(melden: () => void) {
  const mq = window.matchMedia(RUHIG);
  mq.addEventListener("change", melden);
  return () => mq.removeEventListener("change", melden);
}

function farbenLesen(): Farben {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return {
    licht: v("--color-media-licht"),
    dunst: v("--color-media-dunst"),
    turm: v("--color-media-turm"),
    signal: v("--color-media-signal"),
    grund: v("--color-bg"),
  };
}

/**
 * Stummes Hintergrundvideo (Loop) mit Poster. Bei "weniger Bewegung" nur das Poster.
 * Ohne Video: gezeichnete Platzhalter-Szene, die außerhalb des Bildes pausiert.
 * Immer Deko: aria-hidden, Inhalt steht als Text daneben.
 */
export function KiVideo({ szene, video, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ruhig = useSyncExternalStore(abonnierenRuhig, () => window.matchMedia(RUHIG).matches, () => false);

  useEffect(() => {
    if (video) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const s = SZENEN[szene]();
    const bewegt = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let farben = farbenLesen();
    let b = 0, h = 0, sichtbar = true, bild = 0;

    const groesse = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      b = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(b * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.baue(b, h);
      canvas.parentElement?.style.setProperty("--scan-weg", `${Math.round(h)}px`);
    };
    const zeichne = (zeit = performance.now()) => s.zeichne(ctx, b, h, zeit / 1000, farben);
    const schleife = (zeit: number) => {
      if (sichtbar) zeichne(zeit);
      bild = requestAnimationFrame(schleife);
    };
    /* Farbwelt gewechselt: Farben nach dem Übergang neu lesen */
    const neueWelt = () => window.setTimeout(() => { farben = farbenLesen(); zeichne(); }, 30);

    groesse();
    zeichne();
    const beobachter = new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; });
    beobachter.observe(canvas);
    const groessenWaechter = new ResizeObserver(() => { groesse(); zeichne(); });
    groessenWaechter.observe(canvas);
    window.addEventListener(FARBWELT_EREIGNIS, neueWelt);
    if (bewegt) bild = requestAnimationFrame(schleife);

    return () => {
      cancelAnimationFrame(bild);
      beobachter.disconnect();
      groessenWaechter.disconnect();
      window.removeEventListener(FARBWELT_EREIGNIS, neueWelt);
    };
  }, [szene, video]);

  if (video) {
    return (
      <video
        className={`object-cover ${className}`}
        poster={video.poster}
        autoPlay={!ruhig}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        {video.webm && <source src={video.webm} type="video/webm" />}
        <source src={video.mp4} type="video/mp4" />
      </video>
    );
  }
  return <canvas ref={canvasRef} className={`block ${className}`} aria-hidden="true" />;
}
