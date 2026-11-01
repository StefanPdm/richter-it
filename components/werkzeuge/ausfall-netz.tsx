"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useRuhig } from "@/lib/hooks";
import { ErgebnisKnopf, Feld, Kennwert } from "./bausteine";

/*
 * Ausfall-Netz: vereinfachtes, typisches Abhängigkeitsmodell einer KMU- oder Behörden-IT.
 * Jede Kante heißt "braucht". Fällt ein System aus, fallen alle Systeme mit aus,
 * die es (direkt oder über andere) brauchen. Doppelt ausgelegte Systeme fallen beim
 * Anklicken nicht aus, weil das zweite System übernimmt.
 */

type Knoten = {
  id: string;
  name: string;
  ebene: number;
  /** Position im Netz (Prozent der Fläche), nur breite Ansicht */
  x: number;
  braucht: string[];
  /** immer vorhanden, Schalter "vorhanden" gesperrt */
  pflicht?: boolean;
};

const EBENEN = ["Versorgung", "Anbindung", "Infrastruktur", "Grunddienste", "Anwendungen"] as const;
const EBENE_Y = [9, 29, 50, 70, 90];

const KNOTEN: Knoten[] = [
  { id: "strom", name: "Strom / USV", ebene: 0, x: 50, braucht: [], pflicht: true },
  { id: "internet", name: "Internetleitung", ebene: 1, x: 30, braucht: ["strom"] },
  { id: "netz", name: "Netzwerk / Switches", ebene: 1, x: 70, braucht: ["strom"], pflicht: true },
  { id: "firewall", name: "Firewall", ebene: 2, x: 20, braucht: ["strom", "netz"] },
  { id: "host", name: "Virtualisierungs-Host", ebene: 2, x: 52, braucht: ["strom", "netz"], pflicht: true },
  { id: "speicher", name: "Speicher (SAN/NAS)", ebene: 2, x: 82, braucht: ["strom", "netz"] },
  { id: "dns", name: "DNS / DHCP", ebene: 3, x: 36, braucht: ["host", "speicher"] },
  { id: "anmeldung", name: "Verzeichnis / Anmeldung", ebene: 3, x: 68, braucht: ["host", "speicher", "dns"] },
  { id: "dateien", name: "Dateiablage", ebene: 4, x: 10, braucht: ["host", "speicher", "dns", "anmeldung"] },
  { id: "mail", name: "E-Mail", ebene: 4, x: 30, braucht: ["host", "speicher", "dns", "anmeldung", "firewall", "internet"] },
  { id: "erp", name: "Fachanwendung / ERP", ebene: 4, x: 50, braucht: ["host", "speicher", "dns", "anmeldung"] },
  { id: "voip", name: "Telefonie (VoIP)", ebene: 4, x: 70, braucht: ["strom", "netz", "firewall", "internet"] },
  { id: "backup", name: "Backup", ebene: 4, x: 90, braucht: ["strom", "netz", "host"] },
];

const NAME: Record<string, string> = Object.fromEntries(KNOTEN.map((k) => [k.id, k.name]));
const POS: Record<string, Knoten> = Object.fromEntries(KNOTEN.map((k) => [k.id, k]));

type Schalter = Record<string, boolean>;
const alleAn = (): Schalter => Object.fromEntries(KNOTEN.map((k) => [k.id, true]));
const alleAus = (): Schalter => Object.fromEntries(KNOTEN.map((k) => [k.id, false]));

/** Ausfall-Kaskade: Runde je ausgefallenem System (0 = angeklicktes). Leer, wenn es doppelt ausgelegt ist. */
function kaskade(start: string, vorhanden: Schalter, doppelt: Schalter) {
  const runde = new Map<string, number>();
  if (!vorhanden[start] || doppelt[start]) return runde;
  runde.set(start, 0);
  let r = 0;
  let neu = true;
  while (neu) {
    neu = false;
    r++;
    for (const k of KNOTEN) {
      if (!vorhanden[k.id] || runde.has(k.id)) continue;
      if (k.braucht.some((d) => vorhanden[d] && runde.has(d) && runde.get(d)! < r)) {
        runde.set(k.id, r);
        neu = true;
      }
    }
  }
  return runde;
}

type Zustand = "aus" | "start" | "uebernimmt" | "gedaempft" | "normal";

const KNOPF_ZUSTAND: Record<Zustand, string> = {
  normal: "border-border bg-surface text-text",
  gedaempft: "border-border bg-surface text-text-muted opacity-60",
  start: "border-error bg-error/25 text-text",
  aus: "border-error bg-error/15 text-text",
  uebernimmt: "border-success bg-success/15 text-text",
};

const HAKEN =
  "size-4.5 cursor-pointer accent-(--color-brand) disabled:cursor-not-allowed disabled:opacity-50";

export function AusfallNetz() {
  const ruhig = useRuhig();
  const [vorhanden, setVorhanden] = useState<Schalter>(alleAn);
  const [doppelt, setDoppelt] = useState<Schalter>(alleAus);
  const [wahl, setWahl] = useState<string | null>(null);

  /* Wird ein gewähltes System abgehakt, gilt die Auswahl als aufgehoben */
  const aktiv = wahl && vorhanden[wahl] ? wahl : null;
  const uebernimmt = !!aktiv && doppelt[aktiv];
  const runden = useMemo(
    () => (aktiv ? kaskade(aktiv, vorhanden, doppelt) : new Map<string, number>()),
    [aktiv, vorhanden, doppelt],
  );
  const betroffen = [...runden.keys()].filter((id) => id !== aktiv);

  const schwachstellen = useMemo(
    () =>
      KNOTEN.filter((k) => vorhanden[k.id] && !doppelt[k.id])
        .map((k) => ({ id: k.id, anzahl: kaskade(k.id, vorhanden, doppelt).size - 1 }))
        .filter((s) => s.anzahl >= 3)
        .sort((a, b) => b.anzahl - a.anzahl),
    [vorhanden, doppelt],
  );

  const sichtbar = KNOTEN.filter((k) => vorhanden[k.id]);

  function zustand(id: string): Zustand {
    if (!aktiv) return "normal";
    if (id === aktiv) return uebernimmt ? "uebernimmt" : "start";
    if (runden.has(id)) return "aus";
    return "gedaempft";
  }

  /* Versatz je Ebene der Kaskade; bei "weniger Bewegung" sofort */
  function versatz(id: string): CSSProperties {
    return { transitionDelay: ruhig ? "0ms" : `${Math.min(runden.get(id) ?? 0, 4) * 110}ms` };
  }

  function waehle(id: string) {
    setWahl((w) => (w === id ? null : id));
  }

  function netzKnopf(k: Knoten, breit: boolean) {
    const z = zustand(k.id);
    return (
      <button
        type="button"
        onClick={() => waehle(k.id)}
        aria-pressed={aktiv === k.id}
        style={versatz(k.id)}
        className={`zucken inline-flex min-h-11 cursor-pointer items-center gap-2 border px-3 py-2 text-left text-sm leading-tight transition-[border-color,background-color,color,opacity] duration-(--dur-base) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${breit ? "w-full justify-between" : "max-w-[11rem]"} ${KNOPF_ZUSTAND[z]}`}
      >
        <span>{k.name}</span>
        {doppelt[k.id] && <span className="daten text-success">2×</span>}
        {(z === "aus" || z === "start") && <span className="daten text-error">aus</span>}
      </button>
    );
  }

  let ergebnis = "Klicken Sie ein System an, um seinen Ausfall durchzuspielen.";
  if (aktiv && uebernimmt) ergebnis = `${NAME[aktiv]} ist doppelt ausgelegt: Das zweite System übernimmt, nichts fällt aus.`;
  else if (aktiv && betroffen.length === 0) ergebnis = `Fällt ${NAME[aktiv]} aus, ist kein weiteres System betroffen.`;
  else if (aktiv) ergebnis = `Fällt ${NAME[aktiv]} aus, sind betroffen: ${betroffen.map((id) => NAME[id]).join(", ")}.`;

  const doppeltListe = KNOTEN.filter((k) => vorhanden[k.id] && doppelt[k.id]).map((k) => k.name);
  const nachricht =
    schwachstellen.length > 0
      ? `Ergebnis aus dem Ausfall-Netz. Einzelne Schwachstellen:\n${schwachstellen
          .map((s) => `- ${NAME[s.id]}: ${s.anzahl} Systeme fallen mit aus`)
          .join("\n")}\nDoppelt ausgelegt: ${doppeltListe.join(", ") || "nichts"}`
      : "Ergebnis aus dem Ausfall-Netz: keine einzelne Schwachstelle mit drei oder mehr abhängigen Systemen.";

  const kopfzeile = (
    <>
      <span className="daten">System</span>
      <span className="daten text-center">vorhanden</span>
      <span className="daten text-center">doppelt</span>
    </>
  );

  return (
    <div className="grid gap-(--gap-karten)">
      {/* Schritt 1: Umgebung */}
      <Feld titel="1 · Ihre Umgebung">
        <p className="max-w-measure text-sm text-text-muted">
          Haken Sie ab, was es bei Ihnen gibt und was doppelt ausgelegt ist. Voreingestellt ist eine typische kleine
          Umgebung: alles einmal vorhanden, nichts doppelt.
        </p>
        <div className="grid gap-x-10 md:grid-cols-2">
          <div className="hidden grid-cols-[minmax(0,1fr)_5.5rem_5.5rem] gap-2 border-b border-border pb-2 md:grid">{kopfzeile}</div>
          <div className="hidden grid-cols-[minmax(0,1fr)_5.5rem_5.5rem] gap-2 border-b border-border pb-2 md:grid">{kopfzeile}</div>
          {KNOTEN.map((k) => (
            <div key={k.id} className="grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] items-center gap-2 border-b border-border py-1 md:grid-cols-[minmax(0,1fr)_5.5rem_5.5rem]">
              <span className={`text-sm ${vorhanden[k.id] ? "text-text" : "text-text-muted line-through"}`}>{k.name}</span>
              <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2">
                <input
                  type="checkbox"
                  checked={vorhanden[k.id]}
                  disabled={k.pflicht}
                  onChange={(e) => setVorhanden((v) => ({ ...v, [k.id]: e.target.checked }))}
                  className={HAKEN}
                />
                <span className="sr-only">{k.name} vorhanden</span>
                <span aria-hidden="true" className="daten md:hidden">da</span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2">
                <input
                  type="checkbox"
                  checked={doppelt[k.id]}
                  disabled={!vorhanden[k.id]}
                  onChange={(e) => setDoppelt((d) => ({ ...d, [k.id]: e.target.checked }))}
                  className={HAKEN}
                />
                <span className="sr-only">{k.name} doppelt ausgelegt</span>
                <span aria-hidden="true" className="daten md:hidden">2×</span>
              </label>
            </div>
          ))}
        </div>
      </Feld>

      {/* Schritt 2: Netz */}
      <Feld titel="2 · Klicken Sie ein System an">
        {/* Breit: Netz mit Linien */}
        <div className="relative mt-6 hidden h-[34rem] md:block" role="group" aria-label="Abhängigkeitsnetz">
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {sichtbar.flatMap((k) =>
              k.braucht
                .filter((d) => vorhanden[d])
                .map((d) => {
                  const ziel = POS[d];
                  const rot = !uebernimmt && runden.has(k.id) && runden.has(d);
                  return (
                    <line
                      key={`${k.id}-${d}`}
                      x1={k.x}
                      y1={EBENE_Y[k.ebene]}
                      x2={ziel.x}
                      y2={EBENE_Y[ziel.ebene]}
                      vectorEffect="non-scaling-stroke"
                      strokeWidth={rot ? 1.5 : 1}
                      style={{
                        ...versatz(k.id),
                        stroke: rot ? "var(--color-error)" : "var(--color-border-strong)",
                        opacity: aktiv && !rot ? 0.3 : 0.8,
                        transition: "stroke var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out)",
                      }}
                    />
                  );
                }),
            )}
          </svg>
          {EBENEN.map((name, i) => (
            <span
              key={name}
              aria-hidden="true"
              className="daten absolute left-0 -translate-y-[calc(100%+1.75rem)] text-[0.625rem] opacity-70"
              style={{ top: `${EBENE_Y[i]}%` }}
            >
              {name}
            </span>
          ))}
          {sichtbar.map((k) => (
            <div
              key={k.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${k.x}%`, top: `${EBENE_Y[k.ebene]}%` }}
            >
              {netzKnopf(k, false)}
            </div>
          ))}
        </div>

        {/* Schmal: Ebenen als Liste, gleiche Logik ohne Linien */}
        <div className="grid gap-5 md:hidden" role="group" aria-label="Systeme nach Ebenen">
          {EBENEN.map((name, i) => {
            const liste = sichtbar.filter((k) => k.ebene === i);
            if (liste.length === 0) return null;
            return (
              <div key={name} className="grid gap-2">
                <span className="daten">
                  {String(i + 1).padStart(2, "0")} · {name}
                </span>
                <div className="grid gap-2">
                  {liste.map((k) => (
                    <div key={k.id}>{netzKnopf(k, true)}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-5">
          <p aria-live="polite" className="max-w-measure text-text">
            {ergebnis}
          </p>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <Kennwert
              label="Mit betroffen"
              wert={aktiv ? String(betroffen.length) : "–"}
              zusatz={aktiv ? `von ${sichtbar.length - 1} weiteren Systemen` : "noch kein System gewählt"}
              betont={betroffen.length > 0}
            />
            <Kennwert
              label="Einzelne Schwachstellen"
              wert={String(schwachstellen.length)}
              zusatz="ohne Ausweichweg, reißen 3 oder mehr Systeme mit"
            />
          </div>
          {aktiv && (
            <button
              type="button"
              onClick={() => setWahl(null)}
              className="daten inline-flex min-h-11 cursor-pointer items-center justify-self-start hover:text-text"
            >
              Auswahl aufheben
            </button>
          )}
        </div>
      </Feld>

      {/* Schritt 3: Schwachstellen */}
      <Feld titel="3 · Einzelne Schwachstellen">
        {schwachstellen.length === 0 ? (
          <p className="max-w-measure text-text-muted">
            Kein System reißt allein drei oder mehr andere mit. Ihre Umgebung hat an den wichtigen Stellen einen
            Ausweichweg.
          </p>
        ) : (
          <ol className="grid border-t border-border">
            {schwachstellen.map((s, i) => (
              <li key={s.id} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setWahl(s.id)}
                  className="zucken grid min-h-11 w-full cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-3 text-left hover:text-brand-dark"
                >
                  <span className="daten text-brand-dark">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{NAME[s.id]}</span>
                  <span className="daten">{s.anzahl} Systeme</span>
                </button>
              </li>
            ))}
          </ol>
        )}
        <p className="max-w-measure text-sm text-text-muted">
          Ein Klick auf eine Schwachstelle zeigt ihren Ausfall im Netz. Ob und wie ein System doppelt ausgelegt werden
          sollte, hängt von Ihrem Betrieb ab. Das klären wir im Gespräch.
        </p>
        <ErgebnisKnopf thema={{ anliegen: "Audit", betreff: "Ausfall-Netz: Schwachstellen besprechen", nachricht }}>
          Schwachstellen besprechen
        </ErgebnisKnopf>
      </Feld>
    </div>
  );
}
