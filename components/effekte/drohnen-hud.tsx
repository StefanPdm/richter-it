"use client";

import { useEffect, useRef, useState } from "react";
import { useRuhig, useSichtbar } from "@/lib/hooks";

/*
  Drohnen-HUD über dem Serverhallen-Video (Medienband).
  BEISPIEL für die Präsentation: alle Werte und Befunde sind simuliert.
  Idee: Die Drohne fliegt durch die Halle und prüft die Server im Vorbeiflug.
*/

type Befund = "ok" | "warnung" | "defekt";
type Eintrag = { id: number; knoten: string; befund: Befund; detail: string };

const WARNUNGEN = ["Temp 71 °C", "Lüfter 92 %", "RAM 94 %", "Latenz 4 ms"];
const DEFEKTE = ["Disk SMART", "Netzteil B", "NIC eth1"];

const TAKT_MS = 700;

type Zustand = {
  t: number;
  geprueft: number;
  ok: number;
  warnungen: number;
  defekte: number;
  rack: number;
  knoten: number;
  protokoll: Eintrag[];
  befund: Befund | null;
};

const START: Zustand = {
  t: 0,
  geprueft: 1846,
  ok: 1843,
  warnungen: 2,
  defekte: 1,
  rack: 7,
  knoten: 12,
  protokoll: [
    { id: 3, knoten: "R07-N11", befund: "ok", detail: "alle Dienste aktiv" },
    { id: 2, knoten: "R07-N10", befund: "ok", detail: "alle Dienste aktiv" },
    { id: 1, knoten: "R07-N09", befund: "warnung", detail: "Temp 71 °C" },
  ],
  befund: null,
};

const zwei = (n: number) => String(n).padStart(2, "0");

function schritt(z: Zustand): Zustand {
  const t = z.t + 1;
  const neu = 2 + Math.floor(Math.random() * 5);
  let { ok, warnungen, defekte, rack, knoten } = z;
  knoten += neu;
  if (knoten > 40) {
    knoten -= 40;
    rack = rack >= 24 ? 1 : rack + 1;
  }
  /* Jeden zweiten Takt wird ein Server sichtbar geprüft und protokolliert */
  let befund: Befund | null = null;
  let protokoll = z.protokoll;
  if (t % 2 === 0) {
    const r = Math.random();
    befund = r < 0.03 ? "defekt" : r < 0.12 ? "warnung" : "ok";
    const detail =
      befund === "defekt"
        ? DEFEKTE[Math.floor(Math.random() * DEFEKTE.length)]
        : befund === "warnung"
          ? WARNUNGEN[Math.floor(Math.random() * WARNUNGEN.length)]
          : "alle Dienste aktiv";
    protokoll = [{ id: t + 1000, knoten: `R${zwei(rack)}-N${zwei(knoten)}`, befund, detail }, ...z.protokoll].slice(0, 5);
    if (befund === "warnung") warnungen += 1;
    if (befund === "defekt") defekte += 1;
  }
  ok += neu - (befund && befund !== "ok" ? 1 : 0);
  return { t, geprueft: z.geprueft + neu, ok, warnungen, defekte, rack, knoten, protokoll, befund };
}

const FARBE: Record<Befund, string> = { ok: "text-success", warnung: "text-brand-dark", defekt: "text-error" };
const WORT: Record<Befund, string> = { ok: "OK", warnung: "Warnung", defekt: "Defekt" };

function Wert({ label, wert, einheit }: { label: string; wert: string; einheit?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border/70 py-1.5">
      <span className="daten">{label}</span>
      <span className="font-mono text-sm text-text tabular-nums">
        {wert}
        {einheit && <span className="ml-1 text-text-muted">{einheit}</span>}
      </span>
    </div>
  );
}

export function DrohnenHud() {
  const ref = useRef<HTMLDivElement>(null);
  const sichtbar = useSichtbar(ref, { schwelle: 0.2 });
  const ruhig = useRuhig();
  const [z, setZ] = useState<Zustand>(START);
  const aktuell = useRef<Zustand>(START);
  const [einrasten, setEinrasten] = useState(false);

  useEffect(() => {
    if (!sichtbar || ruhig) return;
    let loesen = 0;
    const uhr = window.setInterval(() => {
      /* Zustand in der Ref fortschreiben, Updater bleiben frei von Nebenwirkungen */
      const neu = schritt(aktuell.current);
      aktuell.current = neu;
      setZ(neu);
      if (neu.befund) {
        setEinrasten(true);
        window.clearTimeout(loesen);
        loesen = window.setTimeout(() => setEinrasten(false), 420);
      }
    }, TAKT_MS);
    return () => {
      window.clearInterval(uhr);
      window.clearTimeout(loesen);
    };
  }, [sichtbar, ruhig]);

  /* Flugdaten aus der Zeit abgeleitet: ruhige, glaubwürdige Schwankungen */
  const hoehe = (2.7 + Math.sin(z.t * 0.35) * 0.32).toFixed(1).replace(".", ",");
  const tempo = Math.round(31 + Math.sin(z.t * 0.21) * 3 + Math.sin(z.t * 0.9));
  const kurs = 182 + Math.round(Math.sin(z.t * 0.15) * 3);
  const signal = 97 + Math.round(Math.sin(z.t * 0.5) * 2);
  const akku = Math.max(41, 86 - Math.floor(z.t / 12));
  const zustand = ((z.ok / z.geprueft) * 100).toFixed(2).replace(".", ",");
  const letzter = z.protokoll[0]?.befund ?? "ok";

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* Visier in der Mitte */}
      <svg
        viewBox="0 0 200 200"
        className="visier absolute top-1/2 left-1/2 size-[clamp(150px,22vw,300px)] -translate-x-1/2 -translate-y-1/2"
        data-befund={einrasten ? letzter : undefined}
        data-einrasten={einrasten}
      >
        <g className="visier__ring-aussen" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="100" cy="100" r="92" strokeDasharray="38 10 6 10" opacity="0.7" />
        </g>
        <g className="visier__ring-innen" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="100" cy="100" r="66" strokeDasharray="4 6" opacity="0.6" />
          <path d="M100 30 v10 M100 160 v10 M30 100 h10 M160 100 h10" strokeWidth="1.6" />
        </g>
        <circle cx="100" cy="100" r="44" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
        <g className="visier__klammern" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M70 82 v-12 h12 M118 70 h12 v12 M130 118 v12 h-12 M82 130 h-12 v-12" />
        </g>
        <path d="M100 88 v8 M100 104 v8 M88 100 h8 M104 100 h8" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="100" cy="100" r="1.8" fill="currentColor" />
      </svg>

      {/* Befund unter dem Visier */}
      <div className="absolute top-[calc(50%+clamp(85px,12vw,165px))] left-1/2 -translate-x-1/2 text-center">
        <span className={`daten bg-bg/75 px-2.5 py-1 ${einrasten ? FARBE[letzter] : "text-text"}`}>
          {einrasten ? `${z.protokoll[0]?.knoten} · ${WORT[letzter]}` : "Scan aktiv"}
        </span>
      </div>

      {/* Links: Flugdaten */}
      <div className="hud-rahmen absolute top-[60%] left-[max(var(--gutter),1.5rem)] hidden w-56 -translate-y-1/2 bg-bg/75 p-4 md:block">
        <p className="daten mb-2 text-brand-dark">Flugdaten · Drohne 02</p>
        <Wert label="Höhe" wert={hoehe} einheit="m" />
        <Wert label="Tempo" wert={String(tempo)} einheit="km/h" />
        <Wert label="Kurs" wert={`${kurs}°`} />
        <Wert label="Signal" wert={String(signal)} einheit="%" />
        <Wert label="Akku" wert={String(akku)} einheit="%" />
        <Wert label="Ebene" wert="-2" />
      </div>

      {/* Rechts: Inspektion */}
      <div className="hud-rahmen absolute top-1/2 right-[max(var(--gutter),1.5rem)] hidden w-72 -translate-y-1/2 bg-bg/75 p-4 md:block">
        <p className="daten mb-2 text-brand-dark">Inspektion · Rack {zwei(z.rack)}</p>
        <Wert label="Geprüft" wert={z.geprueft.toLocaleString("de-DE")} />
        <div className="grid grid-cols-3 gap-2 py-2.5 text-center">
          <div className="border border-border/70 py-1.5">
            <p className="font-mono text-lg text-success tabular-nums">{z.ok.toLocaleString("de-DE")}</p>
            <p className="daten">OK</p>
          </div>
          <div className="border border-border/70 py-1.5">
            <p className="font-mono text-lg text-brand-dark tabular-nums">{z.warnungen}</p>
            <p className="daten">Warn.</p>
          </div>
          <div className="border border-border/70 py-1.5">
            <p className="font-mono text-lg text-error tabular-nums">{z.defekte}</p>
            <p className="daten">Defekt</p>
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-4 pb-1.5">
          <span className="daten">Zustand</span>
          <span className="font-mono text-sm text-text tabular-nums">{zustand} %</span>
        </div>
        <div className="h-1.5 overflow-hidden bg-surface">
          <div className="h-full origin-left bg-success" style={{ transform: `scaleX(${z.ok / z.geprueft})` }} />
        </div>
        <ul className="mt-3 grid gap-1">
          {z.protokoll.map((e) => (
            <li key={e.id} className="hud-zeile flex items-baseline justify-between gap-3 font-mono text-xs">
              <span className="text-text-muted">{e.knoten}</span>
              <span className={`${FARBE[e.befund]} truncate`}>
                {WORT[e.befund]}
                {e.befund !== "ok" && ` · ${e.detail}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
