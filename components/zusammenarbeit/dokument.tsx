import type { CSSProperties, ReactNode } from "react";

type Props = {
  /** Welcher Schritt: 0 Audit-Notiz, 1 Projektplan, 2 Team, 3 Testprotokoll, 4 Abnahmeprotokoll */
  art: 0 | 1 | 2 | 3 | 4;
  /** Titel im Kopf des Blatts */
  titel: string;
};

/** Platzhalterzeile: graue Linie statt erfundenem Text */
function Zeile({ breite }: { breite: string }) {
  return <span className="dok-zeile" style={{ width: breite } as CSSProperties} aria-hidden="true" />;
}

/** Feld mit Beschriftung und Platzhalter */
function Feld({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <span className="daten">{label}</span>
      {children}
    </div>
  );
}

function Inhalt({ art }: { art: Props["art"] }) {
  switch (art) {
    case 0:
      return (
        <>
          <Feld label="Ist-Zustand">
            <Zeile breite="92%" />
            <Zeile breite="70%" />
          </Feld>
          <Feld label="Engpässe">
            {["80%", "64%", "74%"].map((b) => (
              <span key={b} className="flex items-center gap-2.5">
                <span className="size-1.5 shrink-0 bg-error" aria-hidden="true" />
                <Zeile breite={b} />
              </span>
            ))}
          </Feld>
          <Feld label="Lohnende Aufgaben">
            {["68%", "56%"].map((b) => (
              <span key={b} className="flex items-center gap-2.5">
                <span className="size-2.5 shrink-0 border border-brand" aria-hidden="true" />
                <Zeile breite={b} />
              </span>
            ))}
          </Feld>
        </>
      );
    case 1: {
      /* Balkenplan über sechs Wochen: Start und Länge in Wochen */
      const zeilen = [
        { name: "Analyse", start: 0, dauer: 2, farbe: "bg-brand" },
        { name: "Umsetzung", start: 1, dauer: 4, farbe: "bg-brand" },
        { name: "Tests", start: 3, dauer: 3, farbe: "bg-brand/60" },
        { name: "Abnahme", start: 5, dauer: 1, farbe: "bg-cta" },
      ];
      return (
        <div className="grid gap-2.5">
          <div className="grid grid-cols-[5.5rem_repeat(6,minmax(0,1fr))] gap-1">
            <span />
            {[1, 2, 3, 4, 5, 6].map((w) => (
              <span key={w} className="daten text-center">
                W{w}
              </span>
            ))}
          </div>
          {zeilen.map((z) => (
            <div key={z.name} className="grid grid-cols-[5.5rem_repeat(6,minmax(0,1fr))] items-center gap-1">
              <span className="daten truncate">{z.name}</span>
              <span
                className={`h-3 ${z.farbe}`}
                style={{ gridColumn: `${z.start + 2} / span ${z.dauer}` } as CSSProperties}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      );
    }
    case 2:
      return (
        <div className="grid gap-4">
          <div className="justify-self-center border border-brand px-4 py-2.5 text-center">
            <span className="daten block text-text">Daniel Richter</span>
            <span className="daten block">Ansprechpartner</span>
          </div>
          <span className="mx-auto h-4 w-px bg-border-strong" aria-hidden="true" />
          <div className="grid grid-cols-3 gap-2 border-t border-border-strong pt-4">
            {["Automatisierung", "Netzwerk", "Hardware"].map((r) => (
              <span key={r} className="daten border border-border px-2 py-2 text-center wrap-anywhere">
                {r}
              </span>
            ))}
          </div>
        </div>
      );
    case 3:
      return (
        <ul className="grid gap-3">
          {[
            ["Konfiguration", "78%"],
            ["Messung, Benchmark", "64%"],
            ["Wiederherstellung", "72%"],
            ["Dokumentation", "58%"],
          ].map(([name, b]) => (
            <li key={name} className="grid grid-cols-[1.25rem_minmax(0,9rem)_minmax(0,1fr)] items-center gap-2.5">
              <span className="font-mono text-sm text-success" aria-hidden="true">
                ✓
              </span>
              <span className="daten truncate text-text">{name}</span>
              <Zeile breite={b} />
            </li>
          ))}
        </ul>
      );
    case 4:
      return (
        <>
          <Feld label="Vereinbart">
            <Zeile breite="88%" />
            <Zeile breite="60%" />
          </Feld>
          <Feld label="Umgesetzt">
            <Zeile breite="84%" />
          </Feld>
          <div className="mt-2 grid grid-cols-2 gap-6">
            {["Auftraggeber", "Daniel Richter"].map((n) => (
              <div key={n} className="grid gap-1.5">
                <span className="h-6 border-b border-border-strong" aria-hidden="true" />
                <span className="daten">{n}</span>
              </div>
            ))}
          </div>
          <span className="dok-stempel daten" aria-hidden="true">
            Abgenommen
          </span>
        </>
      );
  }
}

/**
 * Stilisiertes Dokument zu einem Schritt der Zusammenarbeit: Kopf mit Titel, Inhalt aus
 * Feldnamen und grauen Platzhalterzeilen (keine erfundenen Kundendaten).
 */
export function Dokument({ art, titel }: Props) {
  return (
    <figure className={`dok ${art === 4 ? "dok--abnahme" : ""}`} aria-label={`Beispiel: ${titel}`}>
      <figcaption className="flex items-baseline justify-between gap-3 border-b border-border pb-3">
        <span className="daten text-text">{titel}</span>
        <span className="daten">Blatt 0{art + 1}</span>
      </figcaption>
      <div className="relative grid gap-5 pt-4">
        <Inhalt art={art} />
      </div>
    </figure>
  );
}
