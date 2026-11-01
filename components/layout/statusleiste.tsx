"use client";

import { Uhr } from "@/components/effekte/uhr";

/**
 * Statusleiste unten auf jeder Seite. Die ganze Leiste öffnet die Konsole,
 * die von unten hochfährt. Status rechts: BEISPIELWERTE im Stil des Leitstands.
 */
export function Statusleiste() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("konsole-oeffnen"))}
      aria-haspopup="dialog"
      aria-label="Konsole öffnen"
      className="statusleiste daten fixed inset-x-0 bottom-0 z-30 flex cursor-pointer items-center justify-between gap-4 px-(--gutter) pb-[env(safe-area-inset-bottom,0px)] hover:text-text"
    >
      <span className="flex items-center gap-2.5">
        <span className="text-brand-dark">&gt;_</span>
        Konsole
        <span className="hidden text-text-muted md:inline">· Taste ^</span>
      </span>
      <span aria-hidden="true" className="flex items-center gap-2.5">
        <span className="status-punkt" />
        <span className="hidden sm:inline">pve-01 ok ·</span>
        <Uhr />
      </span>
    </button>
  );
}
