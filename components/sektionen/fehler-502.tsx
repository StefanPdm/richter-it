"use client";

import { useState, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Glitch } from "@/components/effekte/glitch";
import { Button } from "@/components/ui/button";
import { fehler502 } from "@/lib/inhalte";

/** Ein Knoten im Schema Besucher → Proxy → Dienst */
function Knoten({ name, aus = false }: { name: string; aus?: boolean }) {
  return (
    <span
      className={`daten grid min-h-11 place-items-center border px-3 transition-colors duration-(--dur-base) ${
        aus ? "border-border text-text-muted/60" : "border-border-strong text-text"
      }`}
    >
      {name}
    </span>
  );
}

/** Verbindung zwischen zwei Knoten. Getrennt: gestrichelt mit Trennmarke. */
function Leitung({ getrennt = false }: { getrennt?: boolean }) {
  return (
    <span aria-hidden="true" className="relative flex h-11 min-w-6 flex-1 items-center">
      <span className={`f502-leitung w-full ${getrennt ? "f502-leitung--getrennt" : ""}`} />
      {getrennt && (
        <span className="absolute left-1/2 -translate-x-1/2 bg-bg-alt px-1 font-mono text-sm text-error">×</span>
      )}
    </span>
  );
}

/* Zahnradform aus Daniels Fehlerseite (formbricks.daniel-richter.info), viewBox 200 */
const ZAHNRAD =
  "M86 8L114 8L118 25L132 30L145 18L166 34L157 49L166 62L183 63L190 90L174 97L174 112L190 120L183 147L166 148L157 162L166 177L145 192L132 180L118 185L114 200L86 200L82 185L68 180L55 192L34 177L43 162L34 148L17 147L10 120L26 112L26 97L10 90L17 63L34 62L43 49L34 34L55 18L68 30L82 25Z" +
  "M100 48A52 52 0 1 0 100 152A52 52 0 1 0 100 48Z";

/**
 * Drehendes Zahnrad nach Daniels Entwurf: Ringe, ein umlaufender Bogen, das Zahnrad
 * selbst und die Nabe. Leichter Glow als bewusste Ausnahme für diese Stelle.
 * Bei "weniger Bewegung" steht alles.
 */
export function Zahnrad({ stockt = false }: { /** ruckelt statt gleichmäßig zu drehen (Fehlerseite 500) */ stockt?: boolean }) {
  return (
    <span aria-hidden="true" className={`f502-feld size-[clamp(6rem,4rem+5vw,9rem)] ${stockt ? "f502-feld--stockt" : ""}`}>
      <span className="f502-kreis f502-kreis--1" />
      <span className="f502-kreis f502-kreis--2" />
      <span className="f502-kreis f502-kreis--3" />
      <span className="f502-bogen" />
      <svg viewBox="0 0 200 200" className="f502-zahnrad">
        <defs>
          <linearGradient id="zahnrad-verlauf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--color-brand-darker)" }} />
            <stop offset="45%" style={{ stopColor: "var(--color-brand)" }} />
            <stop offset="100%" style={{ stopColor: "var(--color-brand-soft)" }} />
          </linearGradient>
        </defs>
        <path d={ZAHNRAD} fill="url(#zahnrad-verlauf)" fillRule="evenodd" className="stroke-brand" strokeWidth="2" />
        <circle cx="100" cy="100" r="37" className="fill-bg stroke-brand" strokeWidth="4" />
        <circle cx="100" cy="100" r="25" className="fill-bg stroke-brand-darker" strokeWidth="2" />
      </svg>
      <span className="f502-nabe" />
    </span>
  );
}

/**
 * Schema mit Schalter und Monitor: Besucher sehen zuerst die 502 und schalten den Dienst
 * selbst wieder ein. Eigenständig, damit es auch im Wissens-Dossier stehen kann.
 */
export function Fehler502Demo({ kompakt = false }: { /** untereinander statt nebeneinander (schmale Spalte) */ kompakt?: boolean }) {
  /* Startet getrennt: Besucher sehen zuerst die 502 und schalten den Dienst selbst wieder ein */
  const [getrennt, setGetrennt] = useState(true);
  const z = getrennt ? fehler502.getrennt : fehler502.verbunden;

  return (
    <div className={`grid grid-cols-1 items-center gap-[clamp(2rem,4vw,4rem)] ${kompakt ? "" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"}`}>
      {/* Schema und Schalter */}
      <Reveal className="grid gap-6">
        <div className="flex items-center" role="img" aria-label={getrennt ? "Besucher erreicht den Proxy, der Dienst dahinter ist getrennt" : "Besucher erreicht über den Proxy den Dienst"}>
          <Knoten name="Besucher" />
          <Leitung />
          <Knoten name="Proxy" />
          <Leitung getrennt={getrennt} />
          <Knoten name="Dienst" aus={getrennt} />
        </div>
        <p className="font-mono text-sm" aria-live="polite">
          <span className="text-text-muted">$ curl -I dienst</span>
          <br />
          <span className={getrennt ? "text-brand-dark" : "text-success"}>{z.status}</span>
        </p>
        <Button variante="secondary" aria-pressed={getrennt} onClick={() => setGetrennt((g) => !g)} className="justify-self-start">
          {z.knopf}
        </Button>
      </Reveal>

      {/* Monitor: Gehäuse, Bild mit Röhrenwirkung, Bedienleiste, Standfuß */}
      <Reveal index={1} className="monitor">
        <div className="monitor__gehaeuse">
        <div className="monitor__bild relative grid h-72 w-full place-items-center overflow-hidden bg-bg sm:aspect-[16/10] sm:h-auto">
          {getrennt ? (
            <div key="getrennt" className="hud-ein absolute inset-0 grid place-items-center">
              <div className="raster-boden" aria-hidden="true" />
              <div className="hud-rahmen absolute inset-4" aria-hidden="true" />
              <span className="daten absolute top-7 left-8 hidden border-l-2 border-brand pl-3 leading-relaxed sm:block" aria-hidden="true">
                System_Status
                <br />/ 502
              </span>
              <span className="daten absolute right-8 bottom-7 hidden text-right sm:block" aria-hidden="true">
                HTTP 502
                <br />
                Bad Gateway
              </span>
              <div className="relative grid justify-items-center gap-2 px-6 text-center">
                <Zahnrad />
                <span className="f502-zahl font-display text-[clamp(3rem,2rem+3vw,5rem)] leading-none font-semibold text-brand [font-stretch:80%]">
                  <Glitch text="502" takt="5s" />
                </span>
                <span className="daten text-text">{fehler502.getrennt.zeile}</span>
                <span className="max-w-[34ch] text-sm text-text-muted">{fehler502.getrennt.hinweis}</span>
              </div>
            </div>
          ) : (
            <div key="verbunden" className="grid w-full max-w-sm gap-4 px-6" aria-hidden="true">
              <span className="daten flex items-center gap-2.5 text-text">
                <span className="status-punkt" />
                {fehler502.verbunden.bild}
              </span>
              <ul className="f502-protokoll grid gap-1.5 font-mono text-xs whitespace-pre text-text-muted">
                {fehler502.verbunden.protokoll.map((zeile, i) => (
                  <li key={zeile} style={{ "--i": i } as CSSProperties}>
                    {zeile}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="monitor__roehre" aria-hidden="true" />
        </div>
        <div className="monitor__leiste" aria-hidden="true">
          <span className="monitor__marke" />
          <span className="flex items-center gap-3">
            <span className="monitor__taste" />
            <span className="monitor__taste" />
            <span className={`monitor__led ${getrennt ? "monitor__led--warten" : ""}`} />
          </span>
        </div>
        </div>
        <div className="monitor__hals" aria-hidden="true" />
        <div className="monitor__fuss" aria-hidden="true" />
      </Reveal>
    </div>
  );
}

/**
 * 502 mit Absicht: startet mit getrenntem Dienst, Besucher sehen zuerst die 502 und
 * schalten den Dienst selbst wieder ein. Optik nach Daniels Fehlerseite:
 * Zahnrad, leichter Glow, wenige Animationen. Darunter drei Gründe, warum man bewusst trennt.
 */
export function Fehler502() {
  return (
    <section id="fehler-502" aria-labelledby="f502-titel" className="scroll-mt-(--header-h) bg-bg-alt py-(--section-y)">
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="f502-titel" className="titel-linie max-w-[16ch] text-h2">
            {fehler502.titel}
          </h2>
          <p className="max-w-measure text-lead text-text-muted">{fehler502.einleitung}</p>
        </Reveal>

        <Fehler502Demo />

        <Reveal className="mt-[clamp(3rem,6vw,5rem)] mb-[clamp(1.5rem,3vw,2.5rem)] grid gap-2">
          <h3 className="font-display text-h3 font-medium [font-stretch:80%]">{fehler502.gruendeTitel}</h3>
          <p className="max-w-measure text-text-muted">{fehler502.gruendeText}</p>
        </Reveal>
        <div className="grid grid-cols-1 gap-[clamp(2rem,4vw,3.5rem)] md:grid-cols-3">
          {fehler502.gruende.map((g, i) => (
            <Reveal key={g.titel} index={i} className="grid content-start gap-3.5 border-t border-border pt-5.5">
              <span className="daten">0{i + 1}</span>
              <h4 className="text-h3">{g.titel}</h4>
              <p className="text-text-muted">{g.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
