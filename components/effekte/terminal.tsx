"use client";

import { useEffect, useRef, useState } from "react";
import { useRuhig, useSichtbar } from "@/lib/hooks";

type Props = {
  /** Mehrere Läufe, die nacheinander in Schleife abgespielt werden */
  laeufe: readonly (readonly string[])[];
  titel: string;
};

/** Pause nach jedem Lauf, bevor der nächste beginnt */
const PAUSE_MS = 3000;

/**
 * Terminal, das Ansible-Läufe in Schleife abspielt, solange es im Bild ist.
 * Befehlszeile wird getippt, Ausgabezeilen erscheinen schneller.
 * Ruhezustand und "weniger Bewegung": erster Lauf vollständig, keine Schleife.
 */
export function Terminal({ laeufe, titel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const sichtbar = useSichtbar(ref, { schwelle: 0.3 });
  const ruhig = useRuhig();
  const [lauf, setLauf] = useState(0);
  const [zeichen, setZeichen] = useState(() => laeufe[0].join("\n").length);
  const [laeuft, setLaeuft] = useState(false);
  /* Position in der Ref, damit die Schleife beim Pausieren dort weitermacht */
  const stand = useRef({ lauf: 0, n: laeufe[0].join("\n").length, gestartet: false });

  useEffect(() => {
    if (!sichtbar || ruhig) return;
    let uhr = 0;

    const tippe = () => {
      const s = stand.current;
      const zeilen = laeufe[s.lauf];
      const gesamt = zeilen.join("\n").length;
      if (s.n >= gesamt) {
        /* Lauf fertig: Ergebnis stehen lassen, dann nächster Lauf */
        setLaeuft(false);
        uhr = window.setTimeout(() => {
          s.lauf = (s.lauf + 1) % laeufe.length;
          s.n = 0;
          setLauf(s.lauf);
          setZeichen(0);
          setLaeuft(true);
          uhr = window.setTimeout(tippe, 300);
        }, PAUSE_MS);
        return;
      }
      const befehl = zeilen[0].length;
      s.n = Math.min(gesamt, s.n + (s.n < befehl ? 1 : 4));
      setZeichen(s.n);
      setLaeuft(true);
      uhr = window.setTimeout(tippe, s.n < befehl ? 38 : 14);
    };

    /* Beim ersten Sichtbarwerden mit dem ersten Lauf von vorn beginnen */
    if (!stand.current.gestartet) {
      stand.current = { lauf: 0, n: 0, gestartet: true };
      uhr = window.setTimeout(() => {
        setZeichen(0);
        tippe();
      }, 300);
    } else {
      tippe();
    }
    return () => window.clearTimeout(uhr);
  }, [sichtbar, ruhig, laeufe]);

  const zeilen = laeufe[lauf];
  const text = zeilen.join("\n").slice(0, zeichen);

  return (
    <div ref={ref} className="hud-rahmen min-w-0 overflow-hidden border border-border bg-bg">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
        <span className="daten">{titel}</span>
        <span className="flex items-center gap-2">
          <span className="status-punkt" aria-hidden="true" />
          <span className="daten">
            {laeuft ? "läuft" : "fertig"} · {lauf + 1}/{laeufe.length}
          </span>
        </span>
      </div>
      <pre className="m-0 min-h-[19rem] overflow-x-auto p-4 font-mono text-[0.6875rem] leading-relaxed break-all whitespace-pre-wrap text-text-muted sm:min-h-[22rem] sm:p-5 sm:text-[0.8125rem] sm:break-normal sm:whitespace-pre">
        <code aria-label={laeufe[0].join("\n")}>
          <span aria-hidden="true">
            {text.split("\n").map((zeile, i) => (
              <span
                key={`${lauf}-${i}`}
                className={`block ${zeile.startsWith("$") ? "text-text" : ""} ${/changed|00:1|GB frei/.test(zeile) ? "text-brand-dark" : ""}`}
              >
                {zeile || " "}
              </span>
            ))}
            {laeuft && <span className="cursor-block" />}
          </span>
        </code>
      </pre>
    </div>
  );
}
