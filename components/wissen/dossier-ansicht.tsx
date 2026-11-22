"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { MitBegriffen } from "@/components/ui/begriff";
import { ThemaKnopf } from "@/components/ui/thema-knopf";
import type { dossiers } from "@/lib/wissen";

type Dossier = (typeof dossiers)[number];
type Modus = "entscheider" | "technik";

type Props = {
  dossier: Dossier;
  /** Interaktives Element, steht nach dem Kapitel dossier.ausprobieren.nach */
  ausprobieren?: ReactNode;
  /** Kopf der Seite (Brotkrumen, Titel), über dem Schalter */
  kopf: ReactNode;
  /** Verweise unter "Was das für Sie heißt" (Fall, Leistung) */
  verweise?: ReactNode;
};

/* Lesemodus im Browser merken. Nur Bequemlichkeit: ohne Speicher gilt "entscheider". */
const SCHLUESSEL = "richter-lesemodus";
const EREIGNIS = "lesemodus-geaendert";
function abonnieren(melden: () => void) {
  window.addEventListener(EREIGNIS, melden);
  return () => window.removeEventListener(EREIGNIS, melden);
}
function lesen(): Modus {
  try {
    return localStorage.getItem(SCHLUESSEL) === "technik" ? "technik" : "entscheider";
  } catch {
    return "entscheider";
  }
}
function setzen(m: Modus) {
  try {
    localStorage.setItem(SCHLUESSEL, m);
  } catch {
    /* Speicher gesperrt: Modus gilt nur bis zum nächsten Laden */
  }
  window.dispatchEvent(new Event(EREIGNIS));
}

/**
 * Dossier mit Lesemodus: "Entscheider" zeigt das Wesentliche, "Technik" blendet die
 * Tiefe ein. Links eine klebende Kapitelleiste mit Fortschritt, im Text ein Element zum
 * Ausprobieren, am Ende Fragen und der Weg weiter.
 */
export function DossierAnsicht({ dossier, ausprobieren, kopf, verweise }: Props) {
  const modus = useSyncExternalStore(abonnieren, lesen, () => "entscheider" as Modus);
  const kapitel = dossier.kapitel ?? [];
  const artikel = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState(0);
  const [fortschritt, setFortschritt] = useState(0);

  /* Aktives Kapitel und Lesefortschritt aus der Scrollposition */
  useEffect(() => {
    const a = artikel.current;
    if (!a) return;
    let wartet = 0;
    const messen = () => {
      wartet = 0;
      const r = a.getBoundingClientRect();
      const linie = window.innerHeight * 0.35;
      setFortschritt(Math.min(1, Math.max(0, (linie - r.top) / Math.max(1, r.height - window.innerHeight * 0.4))));
      const marken = [...a.querySelectorAll<HTMLElement>("[data-kapitel]")];
      let neu = 0;
      marken.forEach((m, i) => {
        if (m.getBoundingClientRect().top < linie) neu = i;
      });
      setAktiv(neu);
    };
    const beimScrollen = () => {
      if (!wartet) wartet = requestAnimationFrame(messen);
    };
    messen();
    window.addEventListener("scroll", beimScrollen, { passive: true });
    window.addEventListener("resize", beimScrollen);
    return () => {
      cancelAnimationFrame(wartet);
      window.removeEventListener("scroll", beimScrollen);
      window.removeEventListener("resize", beimScrollen);
    };
  }, [modus]);

  return (
    <div data-modus={modus}>
      {/* Kopf mit Lesemodus-Schalter und "In 30 Sekunden" */}
      <section aria-labelledby="dossier-titel" className="relative isolate border-b border-border pt-[clamp(3rem,7vw,6rem)] pb-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto grid max-w-wide grid-cols-1 gap-6 px-(--gutter)">
          {kopf}
          <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Lesemodus">
            <span className="daten">Lesemodus</span>
            {(["entscheider", "technik"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={modus === m}
                onClick={() => setzen(m)}
                className="daten inline-flex min-h-11 cursor-pointer items-center gap-2 border border-border px-3.5 transition-colors duration-(--dur-fast) hover:border-text-muted aria-pressed:border-brand aria-pressed:bg-brand-soft aria-pressed:text-text"
              >
                <span aria-hidden="true" className={`size-2 rounded-full border ${modus === m ? "border-brand bg-brand" : "border-text-muted"}`} />
                {m === "entscheider" ? "Entscheider" : "Technik"}
              </button>
            ))}
          </div>
          {dossier.dreissig && (
            <div className="dossier-kurz grid max-w-3xl gap-3 border border-cta/60 bg-surface p-[clamp(1.75rem,4vw,2rem)]">
              <span className="daten text-cta">In 30 Sekunden</span>
              <ul className="grid gap-2.5">
                {dossier.dreissig.map((p) => (
                  <li key={p} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2 text-text">
                    <span aria-hidden="true" className="mt-[0.55em] h-px w-3 bg-cta" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Kapitel mit klebender Leiste */}
      <section aria-label="Kapitel" className="relative isolate bg-bg-alt py-(--section-y)">
        <div className="mx-auto grid max-w-wide grid-cols-1 gap-[clamp(3.5rem,6vw,5rem)] px-(--gutter) lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
          <nav aria-label="Kapitel des Dossiers" className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)] grid gap-4">
              <span className="daten">Kapitel</span>
              <ol className="grid gap-1">
                {kapitel.map((k, i) => (
                  <li key={k.titel}>
                    <a
                      href={`#kapitel-${i + 1}`}
                      aria-current={aktiv === i ? "true" : undefined}
                      className="daten flex min-h-9 items-center gap-3 border-l-2 border-border pl-3 transition-colors duration-(--dur-fast) hover:text-text aria-[current=true]:border-brand aria-[current=true]:text-text"
                    >
                      <span className="text-brand-dark">0{i + 1}</span>
                      <span className="truncate">{k.titel}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <span className="relative block h-px w-full bg-border" aria-hidden="true">
                <span className="absolute inset-0 origin-left bg-brand" style={{ transform: `scaleX(${fortschritt})` }} />
              </span>
              <span className="daten">{Math.round(fortschritt * 100)} % gelesen</span>
            </div>
          </nav>

          <div ref={artikel} className="grid max-w-[46rem] gap-[clamp(3.75rem,5vw,4rem)]">
            {kapitel.map((k, i) => (
              <div key={k.titel} className="grid gap-[clamp(3.75rem,5vw,4rem)]">
                <article id={`kapitel-${i + 1}`} data-kapitel className="grid scroll-mt-[calc(var(--header-h)+2rem)] gap-4">
                  <span className="daten text-brand-dark">0{i + 1}</span>
                  <h2 className="text-h3">{k.titel}</h2>
                  <p className="text-lead text-text-muted">
                    <MitBegriffen text={k.text} />
                  </p>
                  {"technik" in k && k.technik && (
                    /* Im Modus Entscheider ausgeblendet, bleibt aber im Dokument (Suche, Screenreader-Wechsel) */
                    <div className={`dossier-technik gap-2 border-l-2 border-brand bg-bg p-5 ${modus === "technik" ? "grid" : "hidden"}`}>
                      <span className="daten text-brand-dark">Technik</span>
                      <p className="text-text-muted">
                        <MitBegriffen text={k.technik} />
                      </p>
                    </div>
                  )}
                </article>
                {dossier.ausprobieren && dossier.ausprobieren.nach === i && ausprobieren && (
                  <aside aria-label="Zum Ausprobieren" className="grid gap-4">
                    <span className="daten flex items-center gap-2.5 text-success">
                      <span className="status-punkt" aria-hidden="true" />
                      Zum Ausprobieren
                    </span>
                    <p className="text-text">{dossier.ausprobieren.satz}</p>
                    {ausprobieren}
                  </aside>
                )}
              </div>
            ))}

            {dossier.fuerSie && (
              <article className="grid gap-4 border-t border-border pt-[clamp(2rem,4vw,3rem)]">
                <span className="daten text-cta">Was das für Sie heißt</span>
                <p className="text-lead text-text">{dossier.fuerSie.text}</p>
                {verweise}
              </article>
            )}

            {dossier.fragen && (
              <section aria-labelledby="fragen-titel" className="grid gap-4">
                <h2 id="fragen-titel" className="text-h3">
                  Häufige Fragen
                </h2>
                <div className="grid border-t border-border">
                  {dossier.fragen.map((f) => (
                    <details key={f.frage} className="dossier-frage group border-b border-border">
                      <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-text">
                        {f.frage}
                        <span aria-hidden="true" className="daten text-brand-dark transition-transform duration-(--dur-fast) group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="pb-5 text-text-muted">{f.antwort}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ThemaKnopf thema={{ anliegen: "Audit", betreff: `Frage zu ${dossier.kennung}: ${dossier.titel}` }}>Jetzt anfragen</ThemaKnopf>
              <Link href="/wissen" className="daten inline-flex min-h-11 items-center hover:text-text">
                ← Alle Dossiers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
