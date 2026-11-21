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

/**
 * 502 mit Absicht: Besucher trennen selbst den Dienst hinter dem Proxy und sehen,
 * was dann ankommt. Daniels Fehlerseite in die Formensprache der Seite übersetzt
 * (eckig, ohne Leuchten). Darunter drei Gründe, warum man bewusst trennt.
 */
export function Fehler502() {
  const [getrennt, setGetrennt] = useState(false);
  const z = getrennt ? fehler502.getrennt : fehler502.verbunden;

  return (
    <section id="fehler-502" aria-labelledby="f502-titel" className="scroll-mt-(--header-h) bg-bg-alt py-(--section-y)">
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="f502-titel" className="titel-linie max-w-[16ch] text-h2">
            {fehler502.titel}
          </h2>
          <p className="max-w-measure text-lead text-text-muted">{fehler502.einleitung}</p>
        </Reveal>

        <div className="grid grid-cols-1 items-center gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
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

          {/* Bildschirm: was beim Besucher ankommt */}
          <Reveal index={1}>
            <div className="relative grid h-80 w-full place-items-center sm:aspect-[16/10] sm:h-auto sm:min-h-72 overflow-hidden border border-border bg-bg">
              {getrennt ? (
                <div key="getrennt" className="hud-ein absolute inset-0 grid place-items-center">
                  <div className="raster-boden" aria-hidden="true" />
                  <div className="scanlines" aria-hidden="true" />
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
                    {/* Gegenstück zu Daniels Zahnrad: über der Zahl, nicht dahinter */}
                    <span aria-hidden="true" className="grid size-[clamp(4.5rem,3rem+4vw,7rem)] place-items-center">
                      <span className="f502-ring" />
                    </span>
                    <span className="font-display text-[clamp(3rem,2rem+3vw,5rem)] leading-none font-semibold text-brand [font-stretch:80%]">
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
            </div>
          </Reveal>
        </div>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-1 gap-[clamp(2rem,4vw,3.5rem)] md:grid-cols-3">
          {fehler502.gruende.map((g, i) => (
            <Reveal key={g.titel} index={i} className="grid content-start gap-3.5 border-t border-border pt-5.5">
              <span className="daten">0{i + 1}</span>
              <h3 className="text-h3">{g.titel}</h3>
              <p className="text-text-muted">{g.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
