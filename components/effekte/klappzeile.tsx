"use client";

import { useEffect, useRef } from "react";
import { useRuhig, useSichtbar } from "@/lib/hooks";

/* Reihenfolge der Blätter auf der Trommel, wie bei einer echten Fallblattanzeige */
const TROMMEL = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/* Zeitrahmen in ms: jede Stelle bekommt ihren eigenen Wert aus diesen Spannen */
const ZEILE_MS = 70; // Versatz pro Tafelzeile
const WELLE_MS = 5; // Versatz pro Zeichen von links nach rechts
const STREUUNG_MS = 160; // zufälliger Anlauf je Stelle
const BLATT_MS: [number, number] = [42, 72]; // Dauer eines Blatts (Tempo der Trommel)
const BLAETTER: [number, number] = [5, 12]; // Anzahl Blätter bis zum Ziel

type Props = {
  text: string;
  className?: string;
  /** Tafelzeile (0 = oben), startet etwas später als die Zeile darüber */
  zeile?: number;
  /** Position der ersten Stelle in der Zeile (Zeichen), damit die Welle über alle Spalten läuft */
  spalte?: number;
};

/* Phase eines Blatts: a = obere Hälfte des alten Zeichens kippt, b = untere des neuen fällt */
type Phase = "a" | "b" | "";

type Zelle = {
  el: HTMLElement;
  texte: HTMLElement[]; // Zeichen in den Halbboxen oben, unten, klappeOben, klappeUnten
  folge: string[];
  schritt: number;
  naechste: number;
  dauer: number;
  zeigt: string;
  phase: Phase;
  fertig: boolean;
};

const zufall = ([von, bis]: [number, number]) => von + Math.random() * (bis - von);

/**
 * Klappzeile für die Abflugtafel: Fallblätter mit oberer und unterer Hälfte. Jede Stelle hat
 * ihr eigenes Tempo, ihren eigenen Anlauf und eine eigene Zahl an Blättern und läuft auf der
 * Trommel der Reihe nach bis zum Zielzeichen. So klappt die Tafel ungleichmäßig wie am
 * Flughafen statt im Gleichtakt.
 *
 * Ein Blatt dauert nur drei, vier Bilder. Statt fließender Browser-Animationen (Hunderte
 * gleichzeitig, das ruckelt) wechselt jede Stelle deshalb in festen Phasen: obere Hälfte halb
 * gekippt, untere Hälfte halb gefallen, Blatt liegt. Bei dem Tempo sieht das gleich aus.
 * Ohne JavaScript und bei "weniger Bewegung": Zieltext.
 */
export function Klappzeile({ text, className = "", zeile = 0, spalte = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const sichtbar = useSichtbar(ref, { einmal: true, schwelle: 0.6 });
  const ruhig = useRuhig();
  const geleert = useRef(false);

  /* Vor dem Einblenden leere Blätter zeigen (die Tafel liegt dann noch außerhalb des Bilds) */
  useEffect(() => {
    const el = ref.current;
    if (!el || ruhig || sichtbar || geleert.current) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // schon im Bild: nicht leeren
    geleert.current = true;
    el.querySelectorAll<HTMLElement>(".klapp__zelle:not(.klapp__zelle--leer) .klapp__zeichen").forEach((t) => (t.textContent = " "));
  }, [ruhig, sichtbar]);

  useEffect(() => {
    const huelle = ref.current;
    if (!huelle || !sichtbar || ruhig) return;
    const start = performance.now();

    const zellen: Zelle[] = [...huelle.querySelectorAll<HTMLElement>(".klapp__zelle:not(.klapp__zelle--leer)")].map((el, i) => {
      const ziel = el.dataset.ziel ?? "";
      const texte = [...el.querySelectorAll<HTMLElement>(".klapp__zeichen")];
      const anzahl = Math.round(zufall(BLAETTER));
      const pos = TROMMEL.indexOf(ziel);
      /* Der Reihe nach über die Trommel bis zum Ziel; Zeichen außerhalb der Trommel landen zum Schluss */
      const folge = Array.from({ length: anzahl }, (_, k) => {
        const basis = pos >= 0 ? pos - anzahl + k : Math.floor(Math.random() * TROMMEL.length);
        return TROMMEL[(basis + TROMMEL.length * 4) % TROMMEL.length];
      });
      folge.push(ziel);
      return {
        el,
        texte,
        folge,
        schritt: 0,
        naechste: start + zeile * ZEILE_MS + (spalte + i) * WELLE_MS + Math.random() * STREUUNG_MS,
        dauer: zufall(BLATT_MS),
        zeigt: texte[0].textContent ?? " ",
        phase: "",
        fertig: false,
      };
    });

    const setzePhase = (z: Zelle, phase: Phase) => {
      z.phase = phase;
      if (phase) z.el.dataset.phase = phase;
      else delete z.el.dataset.phase;
    };

    /* Stelle steht: alle Hälften zeigen das Ziel, keine Klappe mehr sichtbar */
    const abschliessen = (z: Zelle) => {
      z.texte.forEach((t) => (t.textContent = z.zeigt));
      setzePhase(z, "");
      z.fertig = true;
    };

    let bild = 0;
    const lauf = (jetzt: number) => {
      let offen = false;
      for (const z of zellen) {
        if (z.fertig) continue;
        offen = true;
        if (jetzt < z.naechste) continue;
        /* Trommeln laufen nicht exakt gleichmäßig: jede Phase leicht anders lang */
        const halb = (z.dauer / 2) * (0.85 + Math.random() * 0.3);
        if (z.phase === "a") {
          setzePhase(z, "b");
          z.naechste = jetzt + halb;
          continue;
        }
        if (z.schritt >= z.folge.length) {
          abschliessen(z);
          continue;
        }
        /* Neues Blatt: stehend oben schon das neue Zeichen, unten noch das alte;
           darüber kippt die obere Hälfte des alten (Phase a), dann fällt die untere des neuen (b) */
        const neu = z.folge[z.schritt];
        const [oben, unten, klappeOben, klappeUnten] = z.texte;
        oben.textContent = neu;
        unten.textContent = z.zeigt;
        klappeOben.textContent = z.zeigt;
        klappeUnten.textContent = neu;
        z.zeigt = neu;
        z.schritt += 1;
        setzePhase(z, "a");
        z.naechste = jetzt + halb;
      }
      if (offen) bild = requestAnimationFrame(lauf);
    };
    bild = requestAnimationFrame(lauf);

    return () => {
      cancelAnimationFrame(bild);
      /* Abbruch: Zieltext sauber stehen lassen */
      for (const z of zellen) {
        z.zeigt = z.el.dataset.ziel ?? "";
        abschliessen(z);
      }
    };
  }, [sichtbar, ruhig, zeile, spalte]);

  return (
    <span ref={ref} className={`klapp ${className}`}>
      <span className="sr-only">{text}</span>
      {text.split("").map((z, i) =>
        z === " " ? (
          <span key={i} className="klapp__zelle klapp__zelle--leer" aria-hidden="true" />
        ) : (
          <span key={i} className="klapp__zelle" data-ziel={z} aria-hidden="true">
            {/* Vier Halbboxen: oben und unten stehend, darüber die zwei klappenden */}
            {["klapp__oben", "klapp__unten", "klapp__oben klapp__klappe", "klapp__unten klapp__klappe"].map((art) => (
              <span key={art} className={`klapp__blatt ${art}`}>
                <span className="klapp__zeichen">{z}</span>
              </span>
            ))}
          </span>
        ),
      )}
    </span>
  );
}
