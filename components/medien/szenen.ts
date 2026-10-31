/*
  Gezeichnete Platzhalter für die KI-Videos (video-briefing.md).
  Reine Zeichenfunktionen: Farben kommen aus den Tokens der aktiven Farbwelt.
*/

export type Farben = { licht: string; dunst: string; turm: string; signal: string; grund: string };

export type Szene = {
  /** Einmal pro Größe: Formen festlegen */
  baue: (b: number, h: number) => void;
  /** Pro Bild: zeichnen zum Zeitpunkt t (Sekunden) */
  zeichne: (ctx: CanvasRenderingContext2D, b: number, h: number, t: number, f: Farben) => void;
};

export function rgba(hex: string, a: number) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Fester Zufall, damit die Szene bei jedem Laden gleich aussieht. */
function zufall(saat: number) {
  return () => {
    saat |= 0;
    saat = (saat + 0x6d2b79f5) | 0;
    let t = Math.imul(saat ^ (saat >>> 15), 1 | saat);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Turm = { x: number; b: number; h: number; stufen: number; antenne: boolean; fenster: { x: number; y: number; an: number }[] };

/** Video 01: Serverhalle als Megastruktur */
export function megastruktur(): Szene {
  let schichten: { tiefe: number; tuerme: Turm[] }[] = [];
  return {
    baue(b, h) {
      const r = zufall(7);
      schichten = [0.35, 0.6, 1].map((tiefe) => {
        const tuerme: Turm[] = [];
        let x = -60;
        while (x < b + 60) {
          const breite = (18 + r() * (tiefe < 1 ? 50 : 90)) * (0.6 + tiefe * 0.5);
          const hoehe = h * (0.25 + r() * (0.45 + tiefe * 0.25));
          const stufen = r() > 0.55 ? 1 + Math.floor(r() * 3) : 0;
          const fenster: Turm["fenster"] = [];
          if (tiefe > 0.5) {
            for (let i = 0; i < hoehe / 9; i++) if (r() > 0.86) fenster.push({ y: i * 9 + 6, x: 4 + r() * (breite - 10), an: r() });
          }
          tuerme.push({ x, b: breite, h: hoehe, stufen, antenne: r() > 0.7, fenster });
          x += breite + r() * 14 * tiefe;
        }
        return { tiefe, tuerme };
      });
    },
    zeichne(ctx, b, h, t, f) {
      const himmel = ctx.createLinearGradient(0, 0, 0, h);
      himmel.addColorStop(0, f.grund);
      himmel.addColorStop(0.45, f.dunst);
      himmel.addColorStop(0.7, f.licht);
      himmel.addColorStop(1, f.dunst);
      ctx.fillStyle = himmel;
      ctx.fillRect(0, 0, b, h);
      const sx = b * 0.68, sy = h * 0.62;
      const sonne = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(b, h) * 0.45);
      sonne.addColorStop(0, rgba(f.licht, 0.95));
      sonne.addColorStop(0.15, rgba(f.licht, 0.45));
      sonne.addColorStop(1, rgba(f.licht, 0));
      ctx.fillStyle = sonne;
      ctx.fillRect(0, 0, b, h);
      schichten.forEach((s, i) => {
        const versatz = Math.sin(t * 0.05 + i) * 18 * s.tiefe;
        ctx.fillStyle = s.tiefe < 1 ? rgba(f.turm, 0.35 + s.tiefe * 0.35) : f.turm;
        for (const tu of s.tuerme) {
          const x = tu.x + versatz, y = h - tu.h;
          ctx.fillRect(x, y, tu.b, tu.h);
          for (let k = 1; k <= tu.stufen; k++) {
            const eb = tu.b * (1 - k * 0.22);
            ctx.fillRect(x + (tu.b - eb) / 2, y - k * 14, eb, 14);
          }
          if (tu.antenne) ctx.fillRect(x + tu.b / 2 - 1, y - tu.stufen * 14 - 40 * s.tiefe, 2, 40 * s.tiefe);
        }
        if (s.tiefe > 0.5) {
          for (const tu of s.tuerme) {
            for (const fe of tu.fenster) {
              const puls = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.6 + fe.an * 9));
              ctx.fillStyle = rgba(f.signal, (s.tiefe === 1 ? 0.75 : 0.4) * puls);
              ctx.fillRect(tu.x + versatz + fe.x, h - tu.h + fe.y, 3, 2);
            }
          }
        }
        if (i < schichten.length - 1) {
          ctx.fillStyle = rgba(f.dunst, 0.28);
          ctx.fillRect(0, 0, b, h);
        }
      });
    },
  };
}

/** Video 02: Kamerafahrt durch Rack-Reihen */
export function rackreihen(): Szene {
  let leds: { seite: number; tiefe: number; hoehe: number; takt: number }[] = [];
  return {
    baue() {
      const r = zufall(21);
      leds = Array.from({ length: 260 }, () => ({ seite: r() > 0.5 ? 1 : -1, tiefe: r(), hoehe: r(), takt: r() }));
    },
    zeichne(ctx, b, h, t, f) {
      const fx = b / 2 + Math.sin(t * 0.04) * b * 0.02, fy = h * 0.5;
      ctx.fillStyle = f.grund;
      ctx.fillRect(0, 0, b, h);
      const ende = ctx.createRadialGradient(fx, fy, 0, fx, fy, b * 0.35);
      ende.addColorStop(0, rgba(f.licht, 0.9));
      ende.addColorStop(0.2, rgba(f.dunst, 0.6));
      ende.addColorStop(1, rgba(f.dunst, 0));
      ctx.fillStyle = ende;
      ctx.fillRect(0, 0, b, h);
      for (let i = 14; i >= 0; i--) {
        const s = 1 - (i / 14) * 0.92;
        for (const seite of [-1, 1]) {
          const x = fx + seite * (b * 0.5 * s + 10 * s), breite = b * 0.07 * s, oben = fy - h * 0.62 * s, unten = fy + h * 0.62 * s;
          const links = seite < 0 ? x - breite : x;
          ctx.fillStyle = rgba(f.turm, 0.55 + 0.45 * s);
          ctx.fillRect(links, oben, breite, unten - oben);
          ctx.fillStyle = rgba(f.dunst, 0.18 * (1 - s));
          ctx.fillRect(links, oben, breite, unten - oben);
        }
      }
      for (const l of leds) {
        const s = 1 - l.tiefe * 0.92;
        const x = fx + l.seite * (b * 0.5 * s + 10 * s) - (l.seite < 0 ? b * 0.035 * s : -b * 0.035 * s);
        const y = fy - h * 0.55 * s + l.hoehe * h * 1.1 * s;
        const an = 0.25 + 0.75 * Math.abs(Math.sin(t * (0.5 + l.takt) + l.takt * 20));
        ctx.fillStyle = rgba(f.signal, an * (0.4 + 0.6 * s));
        ctx.fillRect(x, y, Math.max(1, 3 * s), Math.max(1, 2 * s));
      }
      ctx.fillStyle = rgba(f.turm, 0.85);
      ctx.fillRect(0, fy + h * 0.62, b, h);
    },
  };
}
