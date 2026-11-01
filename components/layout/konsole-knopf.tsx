"use client";

/** Öffnet die Konsole, für alle ohne Tastatur. Die Konsole selbst hängt im Layout. */
export function KonsoleKnopf() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("konsole-oeffnen"))}
      className="daten zucken inline-flex min-h-11 cursor-pointer items-center gap-2 hover:text-text"
    >
      <span className="text-brand-dark">&gt;_</span> Konsole <span className="hidden md:inline">· Taste ^</span>
    </button>
  );
}
