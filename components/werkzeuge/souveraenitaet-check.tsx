"use client";

import { useEffect, useRef, useState } from "react";
import { ErgebnisKnopf, Feld, Kennwert } from "./bausteine";

/*
 * Souveränitäts-Check: zehn Fragen auf fünf Achsen, je zwei Fragen pro Achse.
 * Antworten von unabhängig (2 Punkte) über teilweise (1) bis abhängig (0).
 * Ergebnis: Radar, Gesamtwert, Werte je Achse, drei erste Schritte für die schwächsten Achsen.
 */

type AchseId = "daten" | "lizenzen" | "identitaet" | "betrieb" | "ausstieg";

const ACHSEN: { id: AchseId; name: string; schritt: string }[] = [
  {
    id: "daten",
    name: "Daten",
    schritt:
      "Mails und Dateien auf eine eigene oder europäisch betriebene Lösung legen. Am besten mit der Ablage beginnen, in der die sensibelsten Daten liegen.",
  },
  {
    id: "lizenzen",
    name: "Lizenzen",
    schritt:
      "Zentrale Dienste dort auf Open Source umstellen, wo es ohne Komfortverlust geht. Bei der Virtualisierung zum Beispiel Proxmox VE statt eines proprietären Hypervisors.",
  },
  {
    id: "identitaet",
    name: "Identität",
    schritt:
      "Die Anmeldung zentral im eigenen Haus führen, zum Beispiel mit Keycloak für Single Sign-on und Mehrfaktor-Anmeldung. So hängt der Zugang nicht am Konto eines Konzerns.",
  },
  {
    id: "betrieb",
    name: "Betrieb",
    schritt:
      "Zugänge und Abläufe dokumentieren und automatisieren, etwa mit Ansible-Playbooks in einem eigenen Forgejo. Der Grafana-Stack macht sichtbar, was läuft und wo es hakt.",
  },
  {
    id: "ausstieg",
    name: "Ausstieg",
    schritt:
      "Einmal einen Export der wichtigsten Daten in offenen Formaten testen und alle Vertragslaufzeiten in einer Liste sammeln. Dann ist klar, wie lange ein Wechsel dauern würde.",
  },
];

/** Antworten immer in der Reihenfolge unabhängig (2), teilweise (1), abhängig (0) */
const FRAGEN: { achse: AchseId; frage: string; antworten: [string, string, string] }[] = [
  {
    achse: "daten",
    frage: "Wo liegen Ihre E-Mails?",
    antworten: [
      "Auf eigenen Servern oder bei einem Anbieter, der in der EU sitzt und dort betreibt",
      "Teils im eigenen Haus, teils bei einem großen Cloud-Anbieter",
      "Komplett im Cloud-Dienst eines außereuropäischen Konzerns",
    ],
  },
  {
    achse: "daten",
    frage: "Wo liegen Ihre Dateien und gemeinsamen Ablagen?",
    antworten: [
      "Auf eigenen Servern oder bei einem in der EU betriebenen Dienst",
      "Gemischt: manches intern, manches in einer US-Cloud",
      "Fast alles in der Cloud eines außereuropäischen Konzerns",
    ],
  },
  {
    achse: "lizenzen",
    frage: "Was passiert, wenn ein zentraler Hersteller seine Preise deutlich erhöht?",
    antworten: [
      "Wir könnten ohne großen Aufwand wechseln",
      "Ein Wechsel wäre möglich, aber ein größeres Projekt",
      "Wir müssten zahlen, eine Alternative gibt es kurzfristig nicht",
    ],
  },
  {
    achse: "lizenzen",
    frage: "Wie viel Ihrer zentralen Software läuft nur im Abo?",
    antworten: ["Wenig, das meiste ist gekauft oder Open Source", "Etwa die Hälfte", "Fast alles"],
  },
  {
    achse: "identitaet",
    frage: "Wie melden sich Ihre Mitarbeitenden an?",
    antworten: [
      "Über einen eigenen Verzeichnisdienst im Haus",
      "Eigener Verzeichnisdienst, aber mit einem Cloud-Konto gekoppelt",
      "Ausschließlich über das Konto eines Cloud-Konzerns",
    ],
  },
  {
    achse: "identitaet",
    frage: "Funktioniert die Anmeldung, wenn die Internetverbindung ausfällt?",
    antworten: ["Ja, intern läuft alles weiter", "Teilweise", "Nein, ohne Internet kommt niemand mehr hinein"],
  },
  {
    achse: "betrieb",
    frage: "Wer hat Administrator-Zugang zu Ihren Systemen?",
    antworten: [
      "Wir selbst, die Zugänge sind dokumentiert",
      "Wir und ein Dienstleister, nicht vollständig dokumentiert",
      "Nur ein Dienstleister oder Hersteller, wir selbst haben keinen vollen Zugang",
    ],
  },
  {
    achse: "betrieb",
    frage: "Ist Ihre IT so dokumentiert, dass jemand Neues sie übernehmen könnte?",
    antworten: ["Ja, aktuell und vollständig", "In Teilen", "Das Wissen steckt in einzelnen Köpfen"],
  },
  {
    achse: "ausstieg",
    frage: "Können Sie Ihre Daten in offenen Formaten exportieren?",
    antworten: ["Ja, und wir haben es schon ausprobiert", "Vermutlich, ausprobiert haben wir es nie", "Nein, oder nur mit Hilfe des Herstellers"],
  },
  {
    achse: "ausstieg",
    frage: "Wie schnell kämen Sie aus Ihren wichtigsten IT-Verträgen heraus?",
    antworten: ["Innerhalb weniger Monate", "Innerhalb eines Jahres", "Nur mit langer Laufzeit oder hohen Kosten"],
  },
];

const PUNKTE = [2, 1, 0] as const;
const ANZAHL = FRAGEN.length;

function einstufung(prozent: number) {
  if (prozent >= 75) return "weitgehend unabhängig";
  if (prozent >= 45) return "teilweise abhängig";
  return "stark abhängig";
}

/** Radar mit fünf Achsen; Farben über currentColor und Token-Klassen */
function Radar({ werte }: { werte: { name: string; prozent: number }[] }) {
  const m = 120;
  const r = 86;
  const punkt = (i: number, anteil: number) => {
    const w = -Math.PI / 2 + (i * 2 * Math.PI) / werte.length;
    return [m + Math.cos(w) * r * anteil, m + Math.sin(w) * r * anteil] as const;
  };
  const vieleck = (anteil: (i: number) => number) =>
    werte.map((_, i) => punkt(i, anteil(i)).map((z) => z.toFixed(1)).join(",")).join(" ");
  const beschreibung = werte.map((w) => `${w.name} ${w.prozent} Prozent`).join(", ");

  return (
    <svg viewBox="-30 -8 300 256" className="w-full max-w-[26rem] justify-self-center" role="img" aria-label={`Souveränitäts-Profil: ${beschreibung}`}>
      <g className="text-border-strong" stroke="currentColor" fill="none" strokeWidth="1">
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon key={s} points={vieleck(() => s)} opacity={s === 1 ? 1 : 0.6} />
        ))}
        {werte.map((_, i) => {
          const [x, y] = punkt(i, 1);
          return <line key={i} x1={m} y1={m} x2={x} y2={y} opacity="0.6" />;
        })}
      </g>
      <polygon
        points={vieleck((i) => Math.max(0.04, werte[i].prozent / 100))}
        className="text-brand"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g className="text-neon" fill="currentColor">
        {werte.map((w, i) => {
          const [x, y] = punkt(i, Math.max(0.04, w.prozent / 100));
          return <rect key={w.name} x={x - 3} y={y - 3} width="6" height="6" />;
        })}
      </g>
      <g className="text-text-muted" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)">
        {werte.map((w, i) => {
          const [x, y] = punkt(i, 1.2);
          const anker = Math.abs(x - m) < 4 ? "middle" : x > m ? "start" : "end";
          return (
            <text key={w.name} x={x} y={y} textAnchor={anker} dominantBaseline="middle">
              {w.name.toUpperCase()}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

export function SouveraenitaetCheck() {
  const [schritt, setSchritt] = useState(0);
  const [antworten, setAntworten] = useState<(number | null)[]>(() => Array(ANZAHL).fill(null));
  const kopf = useRef<HTMLHeadingElement>(null);
  const flaeche = useRef<HTMLDivElement>(null);
  /* Inhalt der aktuellen Frage: nur er wird eingeblendet, die Box bleibt stehen */
  const inhalt = useRef<HTMLDivElement>(null);
  const erster = useRef(true);

  /* Nach jedem Schrittwechsel: Fokus auf die Überschrift, Inhalt sanft einblenden. Beim Laden nichts tun. */
  useEffect(() => {
    if (erster.current) {
      erster.current = false;
      return;
    }
    kopf.current?.focus({ preventScroll: true });
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ruhig) {
      (inhalt.current ?? flaeche.current)?.animate(
        [
          { opacity: 0.001, transform: "translateY(6px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
      );
    }
    const oben = flaeche.current?.getBoundingClientRect().top ?? 0;
    if (oben < 80) flaeche.current?.scrollIntoView({ block: "start", behavior: ruhig ? "auto" : "smooth" });
  }, [schritt]);

  function antworte(index: number) {
    setAntworten((a) => {
      const neu = [...a];
      neu[schritt] = index;
      return neu;
    });
    setSchritt((s) => Math.min(ANZAHL, s + 1));
  }

  function neuStarten() {
    setAntworten(Array(ANZAHL).fill(null));
    setSchritt(0);
  }

  /* ---- Fragen ---- */
  if (schritt < ANZAHL) {
    const f = FRAGEN[schritt];
    const achse = ACHSEN.find((a) => a.id === f.achse)!;
    return (
      <div ref={flaeche} className="scroll-mt-[calc(var(--header-h)+1rem)]">
        <Feld className="mx-auto w-full max-w-[48rem]">
          <div className="grid gap-3">
            <div className="flex items-baseline justify-between gap-4">
              <span className="daten">
                <span className="text-brand-dark">{String(schritt + 1).padStart(2, "0")}</span> / {ANZAHL} · {achse.name}
              </span>
              {/* Platz immer reserviert, damit die Kopfzeile ab Frage 2 nicht höher wird */}
              <button
                type="button"
                onClick={() => setSchritt((s) => s - 1)}
                disabled={schritt === 0}
                className="daten inline-flex min-h-11 cursor-pointer items-center gap-2 hover:text-text disabled:invisible"
              >
                <span aria-hidden="true">←</span> Zurück
              </button>
            </div>
            <div className="h-px bg-border" aria-hidden="true">
              <div
                className="h-px origin-left bg-brand transition-transform duration-(--dur-base) ease-(--ease-out)"
                style={{ transform: `scaleX(${schritt / ANZAHL})` }}
              />
            </div>
          </div>

          {/* Alle Fragen liegen übereinander in einer Rasterzelle. Die Box ist so immer so hoch
              wie die längste Frage, sichtbar und bedienbar ist nur die aktuelle. */}
          <div className="grid">
            {FRAGEN.map((fr, n) => {
              const aktiv = n === schritt;
              return (
                <div
                  key={fr.frage}
                  ref={aktiv ? inhalt : null}
                  inert={!aktiv}
                  aria-hidden={!aktiv}
                  className={`grid content-start gap-6 [grid-area:1/1] ${aktiv ? "" : "invisible"}`}
                >
                  <h2 ref={aktiv ? kopf : null} tabIndex={-1} className="text-h3 font-medium outline-none">
                    {fr.frage}
                  </h2>

                  <ul className="grid gap-3" aria-label="Antworten">
                    {fr.antworten.map((text, i) => (
                      <li key={text}>
                        <button
                          type="button"
                          aria-pressed={antworten[n] === i}
                          onClick={() => antworte(i)}
                          className="zucken flex min-h-14 w-full cursor-pointer items-center gap-4 border border-border bg-bg px-4 py-3 text-left transition-colors duration-(--dur-fast) hover:border-text-muted aria-pressed:border-brand aria-pressed:bg-brand-soft"
                        >
                          <span className="daten w-5 shrink-0 text-brand-dark">{String.fromCharCode(65 + i)}</span>
                          <span>{text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Feld>
      </div>
    );
  }

  /* ---- Ergebnis ---- */
  const werte = ACHSEN.map((a) => {
    const indizes = FRAGEN.map((f, i) => (f.achse === a.id ? i : -1)).filter((i) => i >= 0);
    const punkte = indizes.reduce((s, i) => s + PUNKTE[antworten[i] ?? 2], 0);
    return { ...a, prozent: Math.round((punkte / (indizes.length * 2)) * 100) };
  });
  const gesamt = Math.round(werte.reduce((s, w) => s + w.prozent, 0) / werte.length);
  /* schwächste drei, bei Gleichstand in der Reihenfolge der Achsen */
  const schwach = [...werte].sort((a, b) => a.prozent - b.prozent).slice(0, 3);

  const nachricht = [
    `Souveränitäts-Check (Ersteinschätzung): gesamt ${gesamt} %, ${einstufung(gesamt)}.`,
    werte.map((w) => `${w.name} ${w.prozent} %`).join(", ") + ".",
    `Schwächste Bereiche: ${schwach.map((w) => w.name).join(", ")}.`,
    "Ich möchte das Ergebnis besprechen.",
  ].join("\n");

  return (
    <div ref={flaeche} className="grid scroll-mt-[calc(var(--header-h)+1rem)] gap-(--gap-karten) lg:grid-cols-2 lg:items-start">
      <Feld>
        <h2 ref={kopf} tabIndex={-1} className="text-h3 outline-none">
          Ihr Abhängigkeits-Profil
        </h2>
        <Radar werte={werte} />
        <Kennwert label="Souveränität gesamt" wert={`${gesamt} %`} zusatz={`Ersteinschätzung: ${einstufung(gesamt)}`} betont />
        <ul className="grid">
          {werte.map((w) => (
            <li key={w.id} className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 border-b border-border py-2.5">
              <span className="daten">{w.name}</span>
              <span className="h-px bg-border" aria-hidden="true">
                <span className="block h-px origin-left bg-brand" style={{ transform: `scaleX(${w.prozent / 100})` }} />
              </span>
              <span className="text-right font-mono text-sm">{w.prozent} %</span>
            </li>
          ))}
        </ul>
      </Feld>

      <Feld titel="Erste Schritte">
        <p className="text-text-muted">
          Für Ihre drei schwächsten Bereiche. Das ist eine Ersteinschätzung aus zehn Antworten, kein Audit. Was davon
          sinnvoll ist, hängt von Ihrer Umgebung ab.
        </p>
        <ol className="grid gap-5">
          {schwach.map((w, i) => (
            <li key={w.id} className="grid gap-2 border-l-2 border-brand pl-4">
              <span className="daten">
                <span className="text-brand-dark">{String(i + 1).padStart(2, "0")}</span> · {w.name} · {w.prozent} %
              </span>
              <p>{w.schritt}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
          <ErgebnisKnopf thema={{ anliegen: "Audit", betreff: "Souveränitäts-Check: Ergebnis besprechen", nachricht }} />
          <button
            type="button"
            onClick={neuStarten}
            className="daten inline-flex min-h-11 cursor-pointer items-center gap-2 hover:text-text"
          >
            Neu starten
          </button>
        </div>
      </Feld>
    </div>
  );
}
