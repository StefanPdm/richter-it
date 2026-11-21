"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KartenFuss } from "@/components/ui/karten-fuss";
import { fehlersuche } from "@/lib/wissen";

type Rueckmeldung = { ebene: number; richtig: boolean } | null;

/**
 * Fehlersuche zum Dossier "Proxmox ist ein Baukasten": Eine Störung wird beschrieben,
 * Besucher tippen auf die Ebene, in der sie die Ursache vermuten. Daneben gibt einen
 * Hinweis und einen neuen Versuch, richtig erklärt die Ursache. Drei Störungen nacheinander.
 */
export function Fehlersuche() {
  const { schichten, stoerungen } = fehlersuche;
  const [fall, setFall] = useState(0);
  const [antwort, setAntwort] = useState<Rueckmeldung>(null);
  const stoerung = stoerungen[fall];
  const geloest = antwort?.richtig ?? false;

  const waehle = (ebene: number) => {
    if (geloest) return;
    setAntwort({ ebene, richtig: ebene === stoerung.ursache });
  };
  const weiter = () => {
    setFall((f) => (f + 1) % stoerungen.length);
    setAntwort(null);
  };

  return (
    <div className="hud-rahmen grid gap-6 border border-border bg-bg-alt p-[clamp(1.25rem,3vw,2.25rem)]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="daten">Fehlersuche · Proxmox VE</span>
        <span className="daten text-text">
          Störung <span className="text-brand-dark">0{fall + 1}</span> / 0{stoerungen.length}
        </span>
      </div>

      <div className="grid gap-2">
        <p className="font-display text-h3 font-medium [font-stretch:80%]">„{stoerung.symptom}“</p>
        <p className="text-text-muted">Auf welcher Ebene liegt die Ursache?</p>
      </div>

      <ol className="grid gap-2" aria-label="Ebenen von oben nach unten">
        {schichten.map((name, i) => {
          const gewaehlt = antwort?.ebene === i;
          const zustand = gewaehlt ? (antwort.richtig ? "richtig" : "daneben") : geloest ? "ruhig" : "offen";
          return (
            <li key={name}>
              <button
                type="button"
                onClick={() => waehle(i)}
                aria-pressed={gewaehlt}
                disabled={geloest && !gewaehlt}
                className={`fehlersuche__ebene zucken flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 border px-4 py-3 text-left transition-[border-color,background-color,opacity] duration-(--dur-base) disabled:cursor-default ${
                  zustand === "richtig"
                    ? "border-success bg-success/15"
                    : zustand === "daneben"
                      ? "fehlersuche__ebene--daneben border-error bg-error/10"
                      : zustand === "ruhig"
                        ? "border-border bg-bg opacity-50"
                        : "border-border-strong bg-bg hover:border-brand"
                }`}
              >
                <span className="daten text-text">{name}</span>
                {zustand === "richtig" && <span className="daten text-success">Ursache</span>}
                {zustand === "daneben" && <span className="daten text-error">Nicht hier</span>}
              </button>
            </li>
          );
        })}
      </ol>

      <KartenFuss
        links={
          <p className={antwort ? (antwort.richtig ? "text-text" : "text-text-muted") : "text-text-muted"} aria-live="polite">
            {antwort ? (antwort.richtig ? stoerung.erklaerung : fehlersuche.daneben) : "Tippen Sie auf eine Ebene."}
          </p>
        }
      >
        <Button variante="secondary" onClick={weiter} className={geloest ? "vbs-locken" : ""}>
          {fall === stoerungen.length - 1 && geloest ? "Von vorn" : "Nächste Störung"}
        </Button>
      </KartenFuss>
    </div>
  );
}
