"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { KartenFuss } from "@/components/ui/karten-fuss";
import { bereiche, dossiers } from "@/lib/wissen";

/** Tiefe als vier Segmente: gefüllt bis zur Stufe */
export function Tiefe({ stufe }: { stufe: number }) {
  const namen = ["Einstieg", "Mittel", "Fortgeschritten", "Technik"];
  return (
    <span className="daten flex items-center gap-2">
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-2.5 w-1.5 ${n <= stufe ? "bg-brand" : "bg-border-strong"}`} />
        ))}
      </span>
      <span>
        <span className="sr-only">Tiefe: </span>
        {namen[stufe - 1]}
      </span>
    </span>
  );
}

/**
 * Übersicht der Dossiers mit Sofortsuche und Filter nach Bereich. Treffer bleiben voll
 * sichtbar, der Rest wird blass (wie eine Abfrage im Leitstand). Dossiers mit Status
 * "bald" sind angekündigt, aber noch nicht verlinkt.
 */
export function WissenListe() {
  const [suche, setSuche] = useState("");
  const [bereich, setBereich] = useState<string | null>(null);
  const suchId = useId();
  const begriff = suche.trim().toLowerCase();
  const trifft = (d: (typeof dossiers)[number]) =>
    (!bereich || d.bereich === bereich) && (!begriff || `${d.titel} ${d.kurz} ${d.kennung} ${d.bereich}`.toLowerCase().includes(begriff));
  const anzahl = dossiers.filter(trifft).length;

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:items-center">
        <label htmlFor={suchId} className="sr-only">
          Dossiers durchsuchen
        </label>
        <div className="relative">
          <span aria-hidden="true" className="daten pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-brand-dark">
            $
          </span>
          <input
            id={suchId}
            type="search"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Suchen, z. B. DNS"
            className="min-h-12 w-full border border-border-strong bg-bg py-3 pr-4 pl-9 font-mono text-sm text-text placeholder:text-text-muted focus-visible:border-brand"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Nach Bereich filtern">
          {[null, ...bereiche].map((b) => (
            <button
              key={b ?? "alle"}
              type="button"
              aria-pressed={bereich === b}
              onClick={() => setBereich(b)}
              className="daten inline-flex min-h-11 cursor-pointer items-center border border-border px-3.5 transition-colors duration-(--dur-fast) hover:border-text-muted aria-pressed:border-brand aria-pressed:bg-brand-soft aria-pressed:text-text"
            >
              {b ?? "Alle"}
            </button>
          ))}
        </div>
      </div>
      <p className="daten" aria-live="polite">
        {anzahl} Treffer von {dossiers.length} Dossiers
      </p>

      <ul className="grid gap-(--gap-karten) md:grid-cols-2 lg:grid-cols-3">
        {dossiers.map((d) => {
          const an = trifft(d);
          const bereit = d.status === "bereit";
          const inhalt = (
            <>
              <span className="flex items-baseline justify-between gap-3">
                <span className="daten text-brand-dark">
                  {d.kennung} · {d.bereich}
                </span>
                <span className="daten">{d.minuten} min</span>
              </span>
              <span className="font-display text-h3 font-medium [font-stretch:80%]">{d.titel}</span>
              <span className="text-text-muted">{d.kurz}</span>
              <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Tiefe stufe={d.tiefe} />
                {"ausprobieren" in d && d.ausprobieren && (
                  <span className="daten flex items-center gap-2 text-success">
                    <span className="status-punkt" aria-hidden="true" />
                    Zum Ausprobieren
                  </span>
                )}
              </span>
              <KartenFuss>
                {bereit ? (
                  <span className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
                    Lesen <span aria-hidden="true" className="transition-transform duration-(--dur-fast) group-hover:translate-x-1">→</span>
                  </span>
                ) : (
                  <span className="daten inline-flex min-h-11 items-center">In Arbeit</span>
                )}
              </KartenFuss>
            </>
          );
          const klassen = `hud-rahmen group flex h-full flex-col gap-4 border bg-surface p-[clamp(1.5rem,3vw,2.25rem)] transition-[opacity,border-color] duration-(--dur-base) ${
            an ? "opacity-100" : "opacity-30"
          } ${bereit ? "border-border hover:border-brand" : "border-dashed border-border"}`;
          return (
            <li key={d.slug} aria-hidden={!an || undefined}>
              {bereit ? (
                <Link href={`/wissen/${d.slug}`} className={klassen} tabIndex={an ? undefined : -1}>
                  {inhalt}
                </Link>
              ) : (
                <div className={klassen}>{inhalt}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
