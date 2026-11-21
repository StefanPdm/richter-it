"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { ErgebnisKnopf, Feld } from "@/components/werkzeuge/bausteine";
import { STATUS_MARKE, type CheckErgebnis, type Pruefung } from "@/lib/sicherheitscheck";
import type { KiErgebnis } from "@/lib/ki-check";

type Stand<T> = { art: "leer" } | { art: "laeuft" } | { art: "fertig"; daten: T };

const feld =
  "w-full min-w-0 border border-border-strong bg-bg px-3.5 py-3 font-mono text-text placeholder:text-text-muted/70 transition-colors duration-(--dur-fast) focus:border-brand focus:outline-none";

async function abfragen<T>(pfad: string, domain: string): Promise<T> {
  try {
    const r = await fetch(`${pfad}?domain=${encodeURIComponent(domain)}`, { cache: "no-store" });
    return (await r.json()) as T;
  } catch {
    return { ok: false, fehler: "Prüfung gerade nicht erreichbar." } as T;
  }
}

const bilanz = (p: Pruefung[]) => {
  const zahl = (s: Pruefung["status"]) => p.filter((x) => x.status === s).length;
  return `${zahl("ok")} in Ordnung · ${zahl("warn")} Hinweise · ${zahl("fehlt")} fehlen`;
};

/** Ergebnisliste im Stil der Konsole: Statusmarke, Prüfung, Wert, darunter der Hinweis */
function Liste({ pruefungen }: { pruefungen: Pruefung[] }) {
  return (
    <ul className="grid gap-2 font-mono text-[0.8125rem] leading-relaxed">
      {pruefungen.map((x) => (
        <li key={x.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
          <span className={`whitespace-pre ${STATUS_MARKE[x.status].klasse}`}>{STATUS_MARKE[x.status].text}</span>
          <span className="min-w-0 wrap-anywhere">
            <span className="text-text">{x.titel}</span>
            {x.wert && <span className="text-text-muted"> · {x.wert}</span>}
            {x.hinweis && <span className="block text-text-muted">↳ {x.hinweis}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Platzhalter während der Prüfung: Terminalzeile mit Cursor */
function Laeuft({ text }: { text: string }) {
  return (
    <p className="font-mono text-[0.8125rem] text-text-muted">
      {text}
      <span className="cursor-block" aria-hidden="true" />
    </p>
  );
}

function Fehler({ text }: { text: string }) {
  return <p className="font-mono text-[0.8125rem] text-error">{text}</p>;
}

/**
 * Werkzeug Domain-Check: eine Domain, zwei Hälften. Links die Sicherheit (app/api/check, wie
 * "check" in der Konsole), rechts die KI-Sichtbarkeit (app/api/ki-check) mit Punktzahl, den drei
 * größten Hebeln und dem Röntgenblick: So liest eine KI die Startseite. Startet von selbst,
 * wenn die Adresse ?domain= enthält (Teaser auf der Startseite).
 */
export function DomainCheck() {
  const id = useId();
  const [eingabe, setEingabe] = useState("");
  const [domain, setDomain] = useState("");
  const [sicherheit, setSicherheit] = useState<Stand<CheckErgebnis>>({ art: "leer" });
  const [ki, setKi] = useState<Stand<KiErgebnis>>({ art: "leer" });

  const pruefen = (wert: string) => {
    const d = wert.trim();
    if (!d) return;
    setDomain(d);
    setSicherheit({ art: "laeuft" });
    setKi({ art: "laeuft" });
    try {
      history.replaceState(null, "", `?domain=${encodeURIComponent(d)}`);
    } catch {
      /* Adresse bleibt, Prüfung läuft trotzdem */
    }
    void abfragen<CheckErgebnis>("/api/check", d).then((daten) => setSicherheit({ art: "fertig", daten }));
    void abfragen<KiErgebnis>("/api/ki-check", d).then((daten) => setKi({ art: "fertig", daten }));
  };

  /* Aufruf mit ?domain= (vom Teaser): Feld füllen und gleich prüfen */
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("domain");
    if (!d) return;
    void Promise.resolve().then(() => {
      setEingabe(d);
      pruefen(d);
    });
    // nur beim ersten Laden
  }, []);

  const absenden = (e: FormEvent) => {
    e.preventDefault();
    pruefen(eingabe);
  };

  const s = sicherheit.art === "fertig" && sicherheit.daten.ok ? sicherheit.daten : null;
  const k = ki.art === "fertig" && ki.daten.ok ? ki.daten : null;
  const name = s?.domain ?? k?.domain ?? domain;

  /* Text fürs Kontaktformular: nur die Mängel beider Hälften */
  const maengel = (p: Pruefung[]) =>
    p.filter((x) => x.status === "warn" || x.status === "fehlt").map((x) => `- ${x.titel}: ${x.status === "fehlt" ? "fehlt" : "Hinweis"}${x.wert && x.wert !== "fehlt" ? ` (${x.wert})` : ""}`);
  const nachricht = [
    `Domain-Check für ${name}`,
    ...(s ? ["", `Sicherheit: ${bilanz(s.pruefungen)}.`, ...maengel(s.pruefungen)] : []),
    ...(k ? ["", `KI-Sichtbarkeit: ${k.punkte} von 100 Punkten.`, ...maengel(k.pruefungen)] : []),
    "",
    "Ich möchte das Ergebnis besprechen.",
  ].join("\n");

  return (
    <div className="grid gap-(--gap-karten)">
      <form onSubmit={absenden} className="grid gap-2 sm:max-w-2xl">
        <label htmlFor={id} className="daten">
          Ihre Domain
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={id}
            value={eingabe}
            onChange={(e) => setEingabe(e.target.value)}
            placeholder="beispiel.de"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            required
            className={feld}
          />
          <button
            type="submit"
            disabled={sicherheit.art === "laeuft" || ki.art === "laeuft"}
            className="schnitt zucken inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 bg-cta px-6 font-medium text-text-inverse transition-colors duration-(--dur-fast) hover:bg-cta-hover disabled:cursor-wait disabled:opacity-70"
          >
            Prüfen <span aria-hidden="true">→</span>
          </button>
        </div>
        <p className="text-xs text-text-muted">Prüft nur öffentlich sichtbare Angaben. Es wird nichts gespeichert.</p>
      </form>

      {sicherheit.art !== "leer" && (
        <div aria-live="polite" className="grid items-start gap-(--gap-karten) lg:grid-cols-2">
          {/* Hälfte 1: Sicherheit */}
          <Feld>
            <div className="grid gap-2">
              <span className="daten text-brand-dark">01 · Sicherheit</span>
              <h2 className="text-h3">Wie gut ist {name || "die Domain"} geschützt?</h2>
            </div>
            {sicherheit.art === "laeuft" && <Laeuft text={`check ${domain} · DNS, Mail-Schutz, Zertifikat, Header`} />}
            {sicherheit.art === "fertig" && !sicherheit.daten.ok && <Fehler text={sicherheit.daten.fehler} />}
            {s && (
              <>
                <p className="daten text-text">{bilanz(s.pruefungen)}</p>
                <Liste pruefungen={s.pruefungen} />
              </>
            )}
          </Feld>

          {/* Hälfte 2: KI-Sichtbarkeit */}
          <Feld>
            <div className="grid gap-2">
              <span className="daten text-brand-dark">02 · KI-Sichtbarkeit</span>
              <h2 className="text-h3">Finden ChatGPT &amp; Co. die Seite?</h2>
            </div>
            {ki.art === "laeuft" && <Laeuft text={`lese ${domain} · robots.txt, llms.txt, Sitemap, JSON-LD`} />}
            {ki.art === "fertig" && !ki.daten.ok && <Fehler text={ki.daten.fehler} />}
            {k && (
              <>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-x-5 gap-y-1">
                  <span className="font-mono text-[clamp(2.25rem,1.5rem+2vw,3.25rem)] leading-none font-medium text-brand-dark">{k.punkte}</span>
                  <span className="daten pb-1">von 100 Punkten</span>
                  {/* Balken: Anteil als Breite, ohne Bewegung */}
                  <span className="col-span-2 mt-3 block h-1.5 bg-bg" aria-hidden="true">
                    <span className="block h-full bg-brand" style={{ width: `${k.punkte}%` }} />
                  </span>
                </div>
                {k.hebel.length > 0 && (
                  <div className="grid gap-3">
                    <span className="daten">Die größten Hebel</span>
                    <ol className="grid gap-2.5 text-sm">
                      {k.hebel.map((h, i) => (
                        <li key={h} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2">
                          <span className="daten text-brand-dark">0{i + 1}</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                <Liste pruefungen={k.pruefungen} />
              </>
            )}
          </Feld>
        </div>
      )}

      {/* Röntgenblick: was nach dem Entfernen von Gestaltung und Code übrig bleibt */}
      {k && (
        <section aria-labelledby={`${id}-lesart`} className="hud-rahmen grid gap-6 border border-border bg-bg p-[clamp(1.25rem,3vw,2.25rem)]">
          <div className="grid gap-2">
            <span className="daten text-brand-dark">03 · Röntgenblick</span>
            <h2 id={`${id}-lesart`} className="text-h3">
              So liest eine KI die Startseite
            </h2>
            <p className="max-w-measure text-sm text-text-muted">
              Ohne Gestaltung, Bilder und Skripte bleibt das hier übrig. Genau das bekommt ein Sprachmodell, wenn es{" "}
              <span className="font-mono text-text">{k.adresse}</span> liest.
            </p>
          </div>
          <div className="grid items-start gap-(--gap-karten) lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="grid gap-4">
              <dl className="grid gap-x-4 gap-y-2 font-mono text-[0.8125rem] sm:grid-cols-[8rem_minmax(0,1fr)]">
                {(
                  [
                    ["title", k.lesart.titel],
                    ["description", k.lesart.beschreibung],
                    ["h1", k.lesart.h1.join(" | ")],
                    ["lang", k.lesart.sprache],
                    ["wörter", k.lesart.woerter.toLocaleString("de-DE")],
                  ] as const
                ).map(([label, wert]) => (
                  <div key={label} className="contents">
                    <dt className="text-text-muted">{label}</dt>
                    <dd className={`m-0 wrap-anywhere ${wert ? "text-text" : "text-error"}`}>{wert || "fehlt"}</dd>
                  </div>
                ))}
              </dl>
              <div className="grid gap-2">
                <span className="daten">Seitentext, wie der Crawler ihn sieht</span>
                <pre className="m-0 max-h-72 overflow-y-auto border border-border bg-surface p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-text-muted wrap-anywhere">
                  {k.lesart.auszug || "(kein lesbarer Text im HTML)"}
                </pre>
              </div>
            </div>
            <div className="grid content-start gap-3">
              <span className="daten">Fakten aus strukturierten Daten</span>
              {k.lesart.fakten.length ? (
                <dl className="grid border-t border-border">
                  {k.lesart.fakten.map(([label, wert]) => (
                    <div key={label} className="grid gap-0.5 border-b border-border py-2.5">
                      <dt className="daten">{label}</dt>
                      <dd className="m-0 text-sm wrap-anywhere">{wert}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-text-muted">
                  Keine Fakten gefunden. Eine KI muss Name, Adresse und Leistungen aus dem Fließtext erraten.
                </p>
              )}
              {k.lesart.typen.length > 0 && <p className="daten">Typen: {k.lesart.typen.slice(0, 6).join(" · ")}</p>}
            </div>
          </div>
        </section>
      )}

      {(s || k) && <ErgebnisKnopf thema={{ anliegen: "Audit", betreff: `Domain-Check ${name}`, nachricht }} />}
    </div>
  );
}
