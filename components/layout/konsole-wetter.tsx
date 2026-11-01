import type { WetterErgebnis } from "@/app/api/wetter/route";

/*
 * Wetterbericht im Konsolen-Look: ASCII-Bild für das aktuelle Wetter, Kennwerte daneben,
 * darunter drei Tage mit Balken für die Regenwahrscheinlichkeit. Farben nur aus Tokens.
 */

type Art = "sonne" | "heiter" | "wolken" | "nebel" | "niesel" | "regen" | "schnee" | "gewitter";

/** WMO-Wettercodes (Open-Meteo) auf Bild und Wort */
function deute(code: number): { art: Art; wort: string } {
  if (code === 0) return { art: "sonne", wort: "klar" };
  if (code <= 2) return { art: "heiter", wort: code === 1 ? "überwiegend klar" : "teils bewölkt" };
  if (code === 3) return { art: "wolken", wort: "bedeckt" };
  if (code <= 48) return { art: "nebel", wort: "Nebel" };
  if (code <= 57) return { art: "niesel", wort: "Nieselregen" };
  if (code <= 67) return { art: "regen", wort: code >= 65 ? "starker Regen" : "Regen" };
  if (code <= 77) return { art: "schnee", wort: "Schnee" };
  if (code <= 82) return { art: "regen", wort: "Regenschauer" };
  if (code <= 86) return { art: "schnee", wort: "Schneeschauer" };
  return { art: "gewitter", wort: "Gewitter" };
}

/* Je 5 Zeilen à 13 Zeichen. "s" = Sonne (Markenfarbe), "w" = Wolke, "n" = Niederschlag */
const BILD: Record<Art, [string, "s" | "w" | "n"][]> = {
  sonne: [
    ["    \\   /    ", "s"],
    ["     .-.     ", "s"],
    ["  - (   ) -  ", "s"],
    ["     `-'     ", "s"],
    ["    /   \\    ", "s"],
  ],
  heiter: [
    ["   \\  /      ", "s"],
    [' _ /"".-.    ', "w"],
    ["   \\_(   ).  ", "w"],
    ["   /(___(__) ", "w"],
    ["             ", "w"],
  ],
  wolken: [
    ["             ", "w"],
    ["     .--.    ", "w"],
    ["  .-(    ).  ", "w"],
    [" (___.__)__) ", "w"],
    ["             ", "w"],
  ],
  nebel: [
    ["             ", "w"],
    [" _ - _ - _ - ", "w"],
    ["  _ - _ - _  ", "w"],
    [" _ - _ - _ - ", "w"],
    ["             ", "w"],
  ],
  niesel: [
    ["     .-.     ", "w"],
    ["    (   ).   ", "w"],
    ["   (___(__)  ", "w"],
    ["    ' ' ' '  ", "n"],
    ["   ' ' ' '   ", "n"],
  ],
  regen: [
    ["     .-.     ", "w"],
    ["    (   ).   ", "w"],
    ["   (___(__)  ", "w"],
    ["   ,',',','  ", "n"],
    ["  ,',',','   ", "n"],
  ],
  schnee: [
    ["     .-.     ", "w"],
    ["    (   ).   ", "w"],
    ["   (___(__)  ", "w"],
    ["    *  *  *  ", "n"],
    ["   *  *  *   ", "n"],
  ],
  gewitter: [
    ["     .-.     ", "w"],
    ["    (   ).   ", "w"],
    ["   (___(__)  ", "w"],
    ["    /_ /_    ", "s"],
    ["     /  /    ", "s"],
  ],
};

const FARBE = { s: "text-brand-dark", w: "text-text", n: "text-text-muted" } as const;
const RICHTUNG = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"];
const TAG = new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });

function balken(prozent: number) {
  const voll = Math.round(prozent / 10);
  return "█".repeat(voll) + "░".repeat(10 - voll);
}

export function KonsoleWetter({ daten }: { daten: Extract<WetterErgebnis, { ok: true }> }) {
  const a = daten.aktuell;
  const jetzt = deute(a.code);
  const richtung = RICHTUNG[Math.round(a.richtung / 45) % 8];
  const werte: [string, string][] = [
    ["Wetter", jetzt.wort],
    ["Temperatur", `${a.temp} °C (gefühlt ${a.gefuehlt} °C)`],
    ["Wind", `${a.wind} km/h aus ${richtung}`],
    ["Feuchte", `${a.feuchte} %`],
  ];

  return (
    <div className="grid gap-3 py-1">
      <div className="text-text">
        wetter · <span className="text-brand-dark uppercase">{daten.ort}</span>
        <span className="text-text-muted">
          {" "}
          · {daten.breite.toFixed(2)}°N {daten.laenge.toFixed(2)}°E · Stand {a.zeit}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <pre className="m-0 font-mono leading-tight" aria-hidden="true">
          {BILD[jetzt.art].map(([zeile, f], i) => (
            <span key={i} className={`block ${FARBE[f]}`}>
              {zeile}
            </span>
          ))}
        </pre>
        <dl className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-5 gap-y-0.5">
          {werte.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-brand-dark">{k}</dt>
              <dd className="text-text">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-0.5">
        <span className="text-text-muted">--- nächste Tage ------------------------</span>
        {daten.tage.map((t) => {
          const d = deute(t.code);
          return (
            <div key={t.datum} className="flex flex-wrap gap-x-4">
              <span className="w-[11ch] whitespace-nowrap text-brand-dark uppercase">{TAG.format(new Date(`${t.datum}T12:00:00`)).replace(",", "")}</span>
              <span className="w-[15ch] text-text">{d.wort}</span>
              <span className="w-[10ch] text-text tabular-nums">
                {t.max}° / {t.min}°
              </span>
              <span className="text-text-muted" aria-label={`Regenwahrscheinlichkeit ${t.regen} Prozent`}>
                <span aria-hidden="true">{balken(t.regen)}</span> {t.regen} %
              </span>
            </div>
          );
        })}
      </div>
      <span className="text-text-muted">Daten: open-meteo.com</span>
    </div>
  );
}
