"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";

type Unterpunkt = { label: string; href: string; satz: string };

type Props = {
  /** Beschriftung im Hauptmenü */
  label: string;
  /** Ziel für "Alle …" (Übersicht, z. B. die Sektion auf der Startseite) */
  href: string;
  unter: readonly Unterpunkt[];
};

/** Verweildauer der Maus, bevor das Menü auf- oder zugeht (ms) */
const VERWEILEN = 120;

/**
 * Aufklappmenü im Hauptmenü (Desktop): Knopf mit Pfeil, darunter ein HUD-Panel mit den
 * Unterseiten und einem Link zur Übersicht. Öffnet per Klick, Tastatur oder kurzem
 * Verweilen der Maus. Schließt mit Esc, Klick daneben oder wenn der Fokus das Menü verlässt.
 */
export function NavAufklapp({ label, href, unter }: Props) {
  const [offen, setOffen] = useState(false);
  const huelle = useRef<HTMLLIElement>(null);
  const knopf = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);
  const id = useId();

  useEffect(() => {
    if (!offen) return;
    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOffen(false);
        knopf.current?.focus();
      }
    };
    const klick = (e: MouseEvent) => {
      if (!huelle.current?.contains(e.target as Node)) setOffen(false);
    };
    document.addEventListener("keydown", taste);
    document.addEventListener("pointerdown", klick);
    return () => {
      document.removeEventListener("keydown", taste);
      document.removeEventListener("pointerdown", klick);
    };
  }, [offen]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const nachKurzem = (e: PointerEvent, ziel: boolean) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOffen(ziel), VERWEILEN);
  };

  return (
    <li
      ref={huelle}
      className="relative"
      onPointerEnter={(e) => nachKurzem(e, true)}
      onPointerLeave={(e) => nachKurzem(e, false)}
      onBlur={(e) => {
        if (!huelle.current?.contains(e.relatedTarget as Node)) setOffen(false);
      }}
    >
      <button
        ref={knopf}
        type="button"
        aria-expanded={offen}
        aria-controls={id}
        onClick={() => setOffen((o) => !o)}
        className="nav-link zucken inline-flex cursor-pointer items-center gap-1.5 text-text-muted transition-colors duration-(--dur-fast) hover:text-text aria-expanded:text-text"
      >
        {label}
        <svg aria-hidden="true" viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-(--dur-fast) ${offen ? "rotate-180" : ""}`}>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {/* Brücke: unsichtbarer Streifen zwischen Knopf und Panel, damit die Maus nicht "herausfällt" */}
      <div id={id} hidden={!offen} className="nav-panel absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4">
        <div className="hud-rahmen grid w-[22rem] gap-1 border border-border-strong bg-surface p-3 shadow-float">
          <ul className="grid">
            {unter.map((u, i) => (
              <li key={u.href}>
                <Link
                  href={u.href}
                  onClick={() => setOffen(false)}
                  className="group grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-2 px-3 py-2.5 transition-colors duration-(--dur-fast) hover:bg-bg"
                >
                  <span className="daten text-brand-dark">0{i + 1}</span>
                  <span className="text-text transition-colors duration-(--dur-fast) group-hover:text-brand-dark">{u.label}</span>
                  <span />
                  <span className="text-xs text-text-muted">{u.satz}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={href}
            onClick={() => setOffen(false)}
            className="daten mt-1 flex min-h-11 items-center justify-between border-t border-border px-3 pt-1 hover:text-text"
          >
            Alle Leistungen auf einen Blick <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </li>
  );
}
