"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { KartenFuss } from "@/components/ui/karten-fuss";

const RUHIG = "(prefers-reduced-motion: reduce)";
function abonnieren(melden: () => void) {
  const mq = window.matchMedia(RUHIG);
  mq.addEventListener("change", melden);
  return () => mq.removeEventListener("change", melden);
}
const bewegtErlaubt = () => !window.matchMedia(RUHIG).matches;

const PAKETE = 7;
type Punkt = readonly [number, number];

/* Zwei Anordnungen: breit nebeneinander, schmal untereinander (Schrift bleibt lesbar).
   Koordinaten in Einheiten der viewBox. Geräte sind 120 x 50 groß. */
const ANORDNUNGEN = {
  breit: {
    viewBox: "0 0 640 280",
    schrift: [11, 10],
    vorher: "M140 140 L260 60 L380 60 L500 140",
    nachher: "M140 140 L260 220 L380 220 L500 140",
    netz: [20, 115],
    speicher: [500, 115],
    firewall: [260, 30],
    core: [260, 200],
    internet: true,
    /* Anteil des Wegs, an dem die Firewall beginnt: dort stauen sich die Pakete */
    stau: "0;0.35;0.4;1",
    /* Ohne Bewegung: vorher gestaut vor der Firewall, nachher verteilt auf dem Weg */
    still: {
      vorher: Array.from({ length: PAKETE }, (_, i) => [244 - (i % 4) * 9, 70 + Math.floor(i / 4) * 9] as Punkt),
      nachher: Array.from({ length: PAKETE }, (_, i) => [154 + i * 14, 149 + i * 9.4] as Punkt),
    },
  },
  schmal: {
    viewBox: "0 0 300 420",
    schrift: [13, 12],
    vorher: "M150 60 L70 185 L70 235 L150 360",
    nachher: "M150 60 L230 185 L230 235 L150 360",
    netz: [90, 10],
    speicher: [90, 360],
    firewall: [10, 185],
    core: [170, 185],
    internet: false,
    stau: "0;0.43;0.48;1",
    still: {
      vorher: Array.from({ length: PAKETE }, (_, i) => [62 + (i % 4) * 6 - 9, 172 - Math.floor(i / 4) * 9] as Punkt),
      nachher: Array.from({ length: PAKETE }, (_, i) => [160 + i * 10, 75 + i * 15.6] as Punkt),
    },
  },
} as const;
type Anordnung = (typeof ANORDNUNGEN)[keyof typeof ANORDNUNGEN];

/** Ein Gerät im Schema: Rahmen, Name, Zustand */
function Geraet({ pos, name, zustand, schrift, warn = false, ok = false, aus = false }: { pos: readonly number[]; name: string; zustand: string; schrift: readonly number[]; warn?: boolean; ok?: boolean; aus?: boolean }) {
  const [x, y] = pos;
  return (
    <g className={aus ? "opacity-45" : ""}>
      <rect x={x} y={y} width="120" height="50" className={`fill-bg transition-[stroke] duration-(--dur-base) ${warn ? "stroke-error" : ok ? "stroke-success" : "stroke-border-strong"}`} strokeWidth="1.5" />
      <text x={x + 10} y={y + 21} fontSize={schrift[0]} className="fill-text font-mono tracking-[0.1em] uppercase">
        {name}
      </text>
      <text x={x + 10} y={y + 38} fontSize={schrift[1]} className={`font-mono tracking-[0.1em] uppercase ${warn ? "fill-error" : ok ? "fill-success" : "fill-text-muted"}`}>
        {zustand}
      </text>
    </g>
  );
}

/** Das Schema in einer Anordnung. Pakete liegen unter den Geräten und verschwinden darin. */
function Schema({ a, umgestellt, bewegt, className }: { a: Anordnung; umgestellt: boolean; bewegt: boolean; className: string }) {
  const weg = umgestellt ? a.nachher : a.vorher;
  const still = umgestellt ? a.still.nachher : a.still.vorher;
  return (
    <svg
      viewBox={a.viewBox}
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label={
        umgestellt
          ? "Interner Verkehr läuft vom Netz über den Core-Switch zum Speicher, die Firewall ist nur noch für das Internet zuständig."
          : "Interner Verkehr läuft vom Netz durch die Firewall zum Speicher und staut sich dort."
      }
    >
      {a.internet && (
        <>
          <line x1="320" y1="30" x2="320" y2="4" className="stroke-border-strong" strokeWidth="1.5" strokeDasharray="3 4" />
          <text x="332" y="16" fontSize="10" className="fill-text-muted font-mono tracking-[0.1em] uppercase">
            Internet
          </text>
        </>
      )}

      {/* Beide Wege: aktiver durchgezogen, der andere gestrichelt */}
      <path d={a.vorher} fill="none" strokeWidth="1.5" className={umgestellt ? "stroke-border" : "stroke-error"} strokeDasharray={umgestellt ? "4 6" : undefined} />
      <path d={a.nachher} fill="none" strokeWidth="1.5" className={umgestellt ? "stroke-brand" : "stroke-border"} strokeDasharray={umgestellt ? undefined : "4 6"} />

      {/* Pakete: vorher bleiben sie lange in der Firewall hängen, nachher fließen sie durch */}
      <g key={umgestellt ? "nachher" : "vorher"} className={umgestellt ? "fill-brand" : "fill-error"}>
        {Array.from({ length: PAKETE }, (_, i) =>
          bewegt ? (
            <rect key={i} x="-3" y="-3" width="6" height="6">
              <animateMotion
                dur={umgestellt ? "1.8s" : "5s"}
                /* Negativer Start: alle Pakete sind sofort unterwegs, keins wartet am Nullpunkt */
                begin={`-${(i * (umgestellt ? 1.8 : 5)) / PAKETE}s`}
                repeatCount="indefinite"
                path={weg}
                {...(umgestellt ? {} : { keyPoints: a.stau, keyTimes: "0;0.2;0.85;1", calcMode: "linear" })}
              />
            </rect>
          ) : (
            <rect key={i} x={still[i][0] - 3} y={still[i][1] - 3} width="6" height="6" />
          ),
        )}
      </g>

      <Geraet pos={a.netz} schrift={a.schrift} name="Netz A" zustand="Video 8K/16K" />
      <Geraet pos={a.speicher} schrift={a.schrift} name="Speicher" zustand="2 PB" />
      <Geraet pos={a.firewall} schrift={a.schrift} name="Firewall" zustand={umgestellt ? "Nur Internet" : "Überlastet"} warn={!umgestellt} ok={umgestellt} />
      <Geraet pos={a.core} schrift={a.schrift} name="Core-Switch" zustand={umgestellt ? "Intern" : "Ungenutzt"} aus={!umgestellt} />
    </svg>
  );
}

/**
 * Netzschema zum Firewall-Fall: Vorher stauen sich die Pakete an der Firewall (rot),
 * nachher laufen sie über den Core-Switch und die Firewall ist entlastet (grün). Besucher stellen den Weg selbst um.
 * Breit nebeneinander, auf dem Handy untereinander. Bei "weniger Bewegung" stehen die Pakete still.
 */
export function FirewallSchema() {
  const [umgestellt, setUmgestellt] = useState(false);
  const bewegt = useSyncExternalStore(abonnieren, bewegtErlaubt, () => false);

  return (
    <div className="hud-rahmen grid gap-6 border border-border bg-bg-alt p-[clamp(1.75rem,4vw,2.25rem)]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="daten">Netzschema · interner Verkehr</span>
        <span className={`daten ${umgestellt ? "text-success" : "text-error"}`}>{umgestellt ? "Stabil" : "Engpass"}</span>
      </div>

      <Schema a={ANORDNUNGEN.breit} umgestellt={umgestellt} bewegt={bewegt} className="hidden sm:block" />
      <Schema a={ANORDNUNGEN.schmal} umgestellt={umgestellt} bewegt={bewegt} className="mx-auto max-w-80 sm:hidden" />

      <KartenFuss
        links={
          <p className="text-text" aria-live="polite">
            {umgestellt ? "Intern über den Core-Switch, die Firewall prüft nur noch den Weg nach außen." : "Jedes interne Paket läuft durch die Firewall und wird geprüft."}
          </p>
        }
      >
        <Button variante="secondary" onClick={() => setUmgestellt((u) => !u)} className={umgestellt ? "" : "vbs-locken"}>
          {umgestellt ? "Alten Weg zeigen" : "Weg umstellen"}
        </Button>
      </KartenFuss>
    </div>
  );
}
