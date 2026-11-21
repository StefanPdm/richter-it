"use client";

import { useEffect, useRef, useState } from "react";

/** Farben aus den Tokens lesen (keine festen Werte im Code) */
function farben() {
  const s = getComputedStyle(document.documentElement);
  const f = (n: string) => s.getPropertyValue(n).trim();
  return {
    grund: f("--color-bg"),
    brand: f("--color-brand"),
    text: f("--color-text"),
    leise: f("--color-text-muted"),
    linie: f("--color-border-strong"),
    fehler: f("--color-error"),
    erfolg: f("--color-success"),
    cta: f("--color-cta"),
    mono: f("--font-mono") || "monospace",
  };
}

/** Canvas auf Größe des Elternteils bringen, scharf auf hochauflösenden Displays */
function anpassen(c: HTMLCanvasElement) {
  const r = c.parentElement!.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = Math.round(r.width * dpr);
  c.height = Math.round(r.height * dpr);
  c.style.width = `${r.width}px`;
  c.style.height = `${r.height}px`;
  const ctx = c.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, b: r.width, h: r.height };
}

type Props = { /** Rückkehr zur Konsole */ beenden: () => void };

/**
 * Easter Egg "matrix": Zeichenregen in Kobalt über der Ausgabe. Läuft, bis er über den
 * Knopf "Ausschalten" oder mit Esc beendet wird. "Vollbild" nutzt die Vollbild-Funktion
 * des Browsers; ohne sie füllt der Regen ersatzweise das Fenster. Esc verlässt erst das
 * Vollbild, ein zweites Esc kehrt zur Konsole zurück.
 */
export function KonsoleMatrix({ beenden }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const huelle = useRef<HTMLDivElement>(null);
  const knopf = useRef<HTMLButtonElement>(null);
  const [voll, setVoll] = useState(false);
  /* Ersatz ohne Vollbild-Funktion: Fläche fest über das ganze Fenster */
  const [ersatz, setErsatz] = useState(false);
  /* Fokus auf den Ausschalter, damit Enter oder Leertaste ihn sofort bedienen */
  useEffect(() => knopf.current?.focus(), []);

  /* Vollbild-Zustand mit dem Browser abgleichen (Esc beendet es dort von selbst) */
  useEffect(() => {
    const el = huelle.current;
    const wechsel = () => setVoll(document.fullscreenElement === el);
    document.addEventListener("fullscreenchange", wechsel);
    return () => {
      document.removeEventListener("fullscreenchange", wechsel);
      if (el && document.fullscreenElement === el) void document.exitFullscreen().catch(() => {});
    };
  }, []);

  /* Ersatz-Vollbild: erstes Esc verkleinert nur, statt die Konsole zu verlassen */
  useEffect(() => {
    if (!ersatz) return;
    const taste = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setErsatz(false);
      setVoll(false);
    };
    window.addEventListener("keydown", taste, true);
    return () => window.removeEventListener("keydown", taste, true);
  }, [ersatz]);

  const umschalten = async () => {
    const el = huelle.current;
    if (!el) return;
    if (voll) {
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      setErsatz(false);
      setVoll(false);
      return;
    }
    if (el.requestFullscreen && document.fullscreenEnabled) {
      try {
        await el.requestFullscreen();
        return;
      } catch {
        /* abgelehnt: Ersatz nutzen */
      }
    }
    setErsatz(true);
    setVoll(true);
  };

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let { ctx, b, h } = anpassen(c);
    const f = farben();
    const ZEICHEN = "01ABCDEF0123456789<>/{}[]#$%&*+=";
    const GROESSE = 15;
    let spalten = Math.ceil(b / GROESSE);
    let y = Array.from({ length: spalten }, () => Math.random() * -40);
    let bild = 0;
    let zuletzt = 0;

    const schritt = (t: number) => {
      bild = requestAnimationFrame(schritt);
      if (t - zuletzt < 45) return;
      zuletzt = t;
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = f.grund;
      ctx.fillRect(0, 0, b, h);
      ctx.globalAlpha = 1;
      ctx.font = `${GROESSE - 2}px ${f.mono}`;
      for (let i = 0; i < spalten; i++) {
        const z = ZEICHEN[Math.floor(Math.random() * ZEICHEN.length)];
        const py = y[i] * GROESSE;
        ctx.fillStyle = Math.random() > 0.94 ? f.text : f.brand;
        ctx.fillText(z, i * GROESSE, py);
        y[i] = py > h && Math.random() > 0.96 ? 0 : y[i] + 1;
      }
    };
    bild = requestAnimationFrame(schritt);

    const groesse = new ResizeObserver(() => {
      ({ ctx, b, h } = anpassen(c));
      spalten = Math.ceil(b / GROESSE);
      y = Array.from({ length: spalten }, () => Math.random() * -40);
    });
    groesse.observe(c.parentElement!);
    return () => {
      cancelAnimationFrame(bild);
      groesse.disconnect();
    };
  }, []);

  const knopfKlasse =
    "daten inline-flex min-h-11 cursor-pointer items-center gap-2 border border-border-strong bg-bg/90 px-3.5 text-text transition-colors duration-(--dur-fast) hover:border-brand";

  return (
    <div ref={huelle} className={`${ersatz ? "fixed inset-0 z-[100]" : "absolute inset-0 z-10"} bg-bg`}>
      <canvas ref={ref} aria-hidden="true" className="block" />
      <div className="absolute right-4 bottom-3 flex gap-2">
        <button type="button" onClick={umschalten} aria-pressed={voll} className={knopfKlasse}>
          {/* Symbol: vier Ecken nach außen (Vollbild) oder nach innen (Normal) */}
          <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.4">
            {voll ? <path d="M4 1v3H1M8 1v3h3M4 11V8H1M8 11V8h3" /> : <path d="M1 4V1h3M11 4V1H8M1 8v3h3M11 8v3H8" />}
          </svg>
          {voll ? "Normal" : "Vollbild"}
        </button>
        <button ref={knopf} type="button" onClick={beenden} className={knopfKlasse}>
          <span aria-hidden="true" className="size-2 bg-brand" />
          Ausschalten
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Paketlauf */

const REKORD = "richter-paketlauf-rekord";
type Hindernis = { x: number; b: number; h: number; art: "spitze" | "firewall" };
type Ack = { x: number; y: number; weg: boolean };

/**
 * Jump and Run "Paketlauf": Ein Datenpaket läuft eine Leitung entlang, springt über
 * Latenzspitzen und Firewall-Blöcke und sammelt ACKs. Punkte = übertragene Kilobyte.
 * Leertaste, Pfeil hoch oder Tippen zum Springen. Rekord bleibt im Browser.
 */
export function Paketlauf({ beenden }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const flaeche = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = ref.current;
    const fl = flaeche.current;
    if (!c || !fl) return;
    fl.focus();
    let { ctx, b, h } = anpassen(c);
    const f = farben();
    const SCHWERE = 2200;
    const SPRUNG = -720;
    const PAKET = 18;

    let rekord = 0;
    try {
      rekord = Number(localStorage.getItem(REKORD)) || 0;
    } catch {
      /* ohne Speicher kein Rekord */
    }

    const neu = () => ({
      y: 0,
      v: 0,
      tempo: 260,
      kb: 0,
      acks: 0,
      hindernisse: [] as Hindernis[],
      acksListe: [] as Ack[],
      bisHindernis: 0.9,
      bisAck: 1.6,
      laeuft: false,
      vorbei: false,
      versatz: 0,
    });
    let s = neu();
    const boden = () => h - 46;
    const paketX = () => Math.min(120, b * 0.18);

    const springen = () => {
      if (s.vorbei) {
        s = neu();
        s.laeuft = true;
        return;
      }
      if (!s.laeuft) s.laeuft = true;
      if (s.y === 0) s.v = SPRUNG;
    };

    let bild = 0;
    let zuletzt = performance.now();
    const schritt = (t: number) => {
      bild = requestAnimationFrame(schritt);
      const dt = Math.min(0.033, (t - zuletzt) / 1000);
      zuletzt = t;

      if (s.laeuft && !s.vorbei) {
        s.tempo += dt * 9;
        s.kb += dt * s.tempo * 0.12;
        s.versatz = (s.versatz + s.tempo * dt) % 48;
        /* Sprungphysik: y ist Höhe über dem Boden, nach oben negativ gerechnet */
        s.v += SCHWERE * dt;
        s.y = Math.min(0, s.y + s.v * dt);
        if (s.y === 0) s.v = 0;

        s.bisHindernis -= dt;
        if (s.bisHindernis <= 0) {
          const firewall = Math.random() < 0.28;
          s.hindernisse.push(
            firewall
              ? { x: b + 20, b: 26, h: 44, art: "firewall" }
              : { x: b + 20, b: 14 + Math.random() * 10, h: 20 + Math.random() * 26, art: "spitze" },
          );
          s.bisHindernis = 0.75 + Math.random() * 0.9 - Math.min(0.35, s.tempo / 2000);
        }
        s.bisAck -= dt;
        if (s.bisAck <= 0) {
          s.acksListe.push({ x: b + 20, y: 60 + Math.random() * 50, weg: false });
          s.bisAck = 1.4 + Math.random() * 1.6;
        }
        for (const o of s.hindernisse) o.x -= s.tempo * dt;
        for (const a of s.acksListe) a.x -= s.tempo * dt;
        s.hindernisse = s.hindernisse.filter((o) => o.x + o.b > -10);
        s.acksListe = s.acksListe.filter((a) => a.x > -20 && !a.weg);

        /* Kollision: Paket als Quadrat gegen Hindernis-Rechteck */
        const px = paketX();
        const py = boden() + s.y - PAKET;
        for (const o of s.hindernisse) {
          if (px + PAKET - 3 > o.x && px + 3 < o.x + o.b && py + PAKET > boden() - o.h + 3) {
            s.vorbei = true;
            const punkte = Math.round(s.kb) + s.acks * 50;
            if (punkte > rekord) {
              rekord = punkte;
              try {
                localStorage.setItem(REKORD, String(rekord));
              } catch {
                /* ohne Speicher kein Rekord */
              }
            }
          }
        }
        for (const a of s.acksListe) {
          if (Math.abs(a.x - (px + PAKET / 2)) < 18 && Math.abs(boden() - a.y - (py + PAKET / 2)) < 20) {
            a.weg = true;
            s.acks += 1;
          }
        }
      }

      /* Zeichnen */
      ctx.fillStyle = f.grund;
      ctx.fillRect(0, 0, b, h);
      /* Leitung mit laufenden Markierungen */
      ctx.strokeStyle = f.linie;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, boden() + 0.5);
      ctx.lineTo(b, boden() + 0.5);
      ctx.stroke();
      ctx.fillStyle = f.linie;
      for (let x = -s.versatz; x < b; x += 48) ctx.fillRect(x, boden() + 8, 14, 1);

      /* Hindernisse */
      for (const o of s.hindernisse) {
        if (o.art === "spitze") {
          ctx.fillStyle = f.fehler;
          ctx.beginPath();
          ctx.moveTo(o.x, boden());
          ctx.lineTo(o.x + o.b / 2, boden() - o.h);
          ctx.lineTo(o.x + o.b, boden());
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.strokeStyle = f.fehler;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(o.x + 0.5, boden() - o.h + 0.5, o.b, o.h);
          ctx.fillStyle = f.fehler;
          for (let yy = boden() - o.h + 8; yy < boden(); yy += 9) ctx.fillRect(o.x + 4, yy, o.b - 8, 1);
        }
      }
      /* ACKs */
      ctx.font = `600 11px ${f.mono}`;
      for (const a of s.acksListe) {
        ctx.fillStyle = f.erfolg;
        ctx.fillText("ACK", a.x - 11, boden() - a.y + 4);
      }
      /* Paket */
      const px = paketX();
      const py = boden() + s.y - PAKET;
      ctx.fillStyle = s.vorbei ? f.fehler : f.brand;
      ctx.fillRect(px, py, PAKET, PAKET);
      ctx.fillStyle = f.grund;
      ctx.fillRect(px + 4, py + 5, PAKET - 8, 2);
      ctx.fillRect(px + 4, py + 10, PAKET - 12, 2);

      /* Anzeige */
      const punkte = Math.round(s.kb) + s.acks * 50;
      ctx.font = `12px ${f.mono}`;
      ctx.fillStyle = f.leise;
      ctx.fillText(`ÜBERTRAGEN ${punkte.toLocaleString("de-DE")} KB · ACK ${s.acks} · REKORD ${rekord.toLocaleString("de-DE")} KB`, 16, 24);
      ctx.textAlign = "center";
      if (!s.laeuft) {
        ctx.fillStyle = f.text;
        ctx.font = `600 16px ${f.mono}`;
        ctx.fillText("PAKETLAUF", b / 2, h / 2 - 30);
        ctx.font = `12px ${f.mono}`;
        ctx.fillStyle = f.leise;
        ctx.fillText("Leertaste, Pfeil hoch oder Tippen: springen · Esc: zurück", b / 2, h / 2 - 8);
      } else if (s.vorbei) {
        ctx.fillStyle = f.fehler;
        ctx.font = `600 16px ${f.mono}`;
        ctx.fillText(`PAKETVERLUST BEI ${punkte.toLocaleString("de-DE")} KB`, b / 2, h / 2 - 30);
        ctx.font = `12px ${f.mono}`;
        ctx.fillStyle = f.leise;
        ctx.fillText("Springen startet neu · Esc: zurück zur Konsole", b / 2, h / 2 - 8);
      }
      ctx.textAlign = "left";
    };
    bild = requestAnimationFrame(schritt);

    const groesse = new ResizeObserver(() => ({ ctx, b, h } = anpassen(c)));
    groesse.observe(fl);
    const taste = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault();
        springen();
      }
    };
    fl.addEventListener("keydown", taste);
    fl.addEventListener("pointerdown", springen);
    return () => {
      cancelAnimationFrame(bild);
      groesse.disconnect();
      fl.removeEventListener("keydown", taste);
      fl.removeEventListener("pointerdown", springen);
    };
  }, [beenden]);

  return (
    <div
      ref={flaeche}
      tabIndex={0}
      role="application"
      aria-label="Spiel Paketlauf. Leertaste zum Springen, Escape zurück zur Konsole."
      className="absolute inset-0 z-10 cursor-pointer touch-manipulation bg-bg outline-none"
    >
      <canvas ref={ref} className="block" />
    </div>
  );
}
