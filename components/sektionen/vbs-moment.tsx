"use client";

import { useState, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { MitBegriffen } from "@/components/ui/begriff";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { vbs } from "@/lib/inhalte";

const HOECHSTWERT = vbs.stufen[0].wert;
/** Farbe der Füllung je Stufe: ungeschützt leise, Einbruch rot, Feinschliff Akzent */
const FUELLUNG = ["bg-text-muted", "bg-error", "bg-brand"] as const;

/**
 * Signature-Moment VBS: Besucher schalten erst VBS ein (Schutz an, Datenrate bricht ein),
 * dann den Feinschliff (Schutz bleibt, Leistung kommt zurück). Links drei kurze Erklärungen,
 * rechts ein Messinstrument mit drei Balken, Schutzstatus und Schalter.
 */
export function VbsMoment() {
  const [stufe, setStufe] = useState(0);
  const aktuell = vbs.stufen[stufe];
  const weiter = () => setStufe((s) => (s + 1) % vbs.stufen.length);

  return (
    <section id="vbs" aria-labelledby="vbs-titel" className="relative isolate scroll-mt-(--header-h) py-(--section-y)">
      <Sektionsgrund licht="rechts-oben" motiv="raster" />
      <div className="mx-auto grid max-w-wide grid-cols-1 items-start gap-[clamp(2.5rem,5vw,5rem)] px-(--gutter) lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Aussage und Erklärung */}
        <Reveal className="grid gap-6">
          <h2 id="vbs-titel" className="titel-linie titel-glitch max-w-[14ch] text-h2">
            {vbs.titel}
          </h2>
          <p className="max-w-measure text-lead text-text-muted">
            <MitBegriffen text={vbs.einleitung} />
          </p>
          <ol className="mt-2 grid gap-6">
            {vbs.punkte.map((p, i) => (
              <li key={p.titel} className="grid gap-1.5 border-l-2 border-border pl-5">
                <span className="daten">
                  <span className="text-brand-dark">0{i + 1}</span> · {p.titel}
                </span>
                <p className="max-w-measure text-text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Messinstrument */}
        <Reveal index={1} className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <div className="hud-rahmen grid gap-7 border border-border bg-bg-alt p-[clamp(1.25rem,3vw,2.25rem)]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="grid gap-1.5">
                <span className="daten">{vbs.messgroesse}</span>
                <span className="daten text-text">
                  Stufe <span className="text-brand-dark">0{stufe + 1}</span> / 0{vbs.stufen.length} · {aktuell.name}
                </span>
              </div>
              <span className={`font-mono text-zahl font-medium transition-colors duration-(--dur-base) ${stufe === 1 ? "text-error" : "text-brand-dark"}`}>
                {aktuell.wert}
                <span className="ml-1.5 text-sm text-text-muted">{vbs.einheit}</span>
              </span>
            </div>

            {/* Drei Balken: erreicht = gefüllt, noch nicht erreicht = gestrichelt */}
            <ul className="grid gap-4" aria-label={`${vbs.messgroesse} in ${vbs.einheit}`}>
              {vbs.stufen.map((s, i) => {
                const erreicht = i <= stufe;
                return (
                  <li key={s.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_4rem]">
                    <span className={`daten ${i === stufe ? "text-text" : ""}`}>{s.name}</span>
                    <span className={`vbs-balken order-3 col-span-2 sm:order-none sm:col-span-1 ${erreicht ? "" : "vbs-balken--offen"}`} aria-hidden="true">
                      <span
                        className={`vbs-fuellung ${FUELLUNG[i]} ${erreicht && i === 1 && stufe === 1 ? "vbs-einbruch" : ""}`}
                        style={{ "--anteil": erreicht ? s.wert / HOECHSTWERT : 0 } as CSSProperties}
                      />
                    </span>
                    {/* Handy: Wert neben der Bezeichnung, Balken darunter über die volle Breite */}
                    <span className="text-right font-mono text-sm whitespace-nowrap">
                      {erreicht ? (
                        <>
                          {s.wert} <span className="text-text-muted">{vbs.einheit}</span>
                        </>
                      ) : (
                        <span className="text-text-muted">–</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Schutzstatus und Schalter */}
            <div className="grid gap-5 border-t border-border pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="daten">Schutz · {vbs.schutzName}</span>
                <span className={`daten flex items-center gap-2.5 ${aktuell.schutz ? "text-success" : "text-text-muted"}`}>
                  <span className={aktuell.schutz ? "status-punkt" : "vbs-punkt-aus"} aria-hidden="true" />
                  {aktuell.schutz ? "Aktiv" : "Aus"}
                </span>
              </div>
              <p className="min-h-[1.6em] text-text" aria-live="polite">
                {aktuell.zeile}
              </p>
              {/* Lockt bis zum Feinschliff alle paar Sekunden mit dem Zucken vom Hover */}
              <Button variante="secondary" onClick={weiter} className={`justify-self-start ${stufe < 2 ? "vbs-locken" : ""}`}>
                {aktuell.knopf}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
