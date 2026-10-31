"use client";

import { useEffect, useRef, useState } from "react";
import { useRuhig, useSichtbar } from "@/lib/hooks";

type Props = { zeilen: readonly string[]; titel: string };

/**
 * Terminal, das einen Lauf einmal abspielt, sobald es ins Bild kommt.
 * Ruhezustand und "weniger Bewegung": alle Zeilen sofort sichtbar.
 */
export function Terminal({ zeilen, titel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const sichtbar = useSichtbar(ref, { einmal: true, schwelle: 0.4 });
  const ruhig = useRuhig();
  const gesamt = zeilen.join("\n").length;
  const [zeichen, setZeichen] = useState(gesamt);
  const [laeuft, setLaeuft] = useState(false);

  useEffect(() => {
    if (!sichtbar || ruhig) return;
    let n = 0;
    let uhr = 0;
    const tick = () => {
      /* erste Zeile wird getippt, Ausgabezeilen erscheinen schneller */
      n += n < zeilen[0].length ? 1 : 4;
      setZeichen(Math.min(n, gesamt));
      setLaeuft(n < gesamt);
      if (n < gesamt) uhr = window.setTimeout(tick, n < zeilen[0].length ? 38 : 14);
    };
    uhr = window.setTimeout(() => { setZeichen(0); tick(); }, 300);
    return () => window.clearTimeout(uhr);
  }, [sichtbar, ruhig, zeilen, gesamt]);

  const text = zeilen.join("\n").slice(0, zeichen);

  return (
    <div ref={ref} className="hud-rahmen overflow-hidden border border-border bg-bg">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
        <span className="daten">{titel}</span>
        <span className="flex items-center gap-2">
          <span className="status-punkt" aria-hidden="true" />
          <span className="daten">{laeuft ? "läuft" : "fertig"}</span>
        </span>
      </div>
      <pre className="m-0 min-h-[22rem] overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed whitespace-pre text-text-muted">
        <code aria-label={zeilen.join("\n")}>
          <span aria-hidden="true">
            {text.split("\n").map((zeile, i) => (
              <span
                key={i}
                className={`block ${zeile.startsWith("$") ? "text-text" : ""} ${/changed|00:1/.test(zeile) ? "text-brand-dark" : ""}`}
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
