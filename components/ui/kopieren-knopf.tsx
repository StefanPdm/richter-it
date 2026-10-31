"use client";

import { useState } from "react";

type Props = { wert: string; label: string };

/** Kopiert Telefonnummer oder E-Mail. Fällt auf Markieren zurück, wenn die Zwischenablage gesperrt ist. */
export function KopierenKnopf({ wert, label }: Props) {
  const [meldung, setMeldung] = useState<string | null>(null);

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(wert);
      setMeldung("Kopiert");
    } catch {
      setMeldung("Bitte markieren und kopieren");
    }
    window.setTimeout(() => setMeldung(null), 2000);
  }

  return (
    <button
      type="button"
      onClick={kopieren}
      className="daten min-h-11 cursor-pointer justify-self-start border border-border px-3.5 transition-colors duration-(--dur-fast) hover:border-text-muted hover:text-text"
    >
      <span aria-live="polite">{meldung ?? label}</span>
    </button>
  );
}
