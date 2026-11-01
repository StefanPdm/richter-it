"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { FARBWELTEN, istFarbwelt, setzeFarbwelt } from "@/lib/farbwelt";
import { meldeThema, type Anliegen } from "@/lib/kontakt-thema";
import { leistungen, technik } from "@/lib/inhalte";
import { site } from "@/lib/site";
import { werkzeuge } from "@/lib/werkzeuge";

/*
 * Konsole: öffnet sich mit der Taste links neben der 1 (^ bzw. `) oder mit ~.
 * Echte Befehle, die die Seite bedienen: Sektionen ansteuern, Werkzeuge öffnen,
 * Farbwelt wechseln, Kontakt mit Thema. Nichts wird gesendet, alles bleibt im Browser.
 */

const PROMPT = "gast@daniel-richter.it:~$";

/* Ziele auf der Startseite */
const ZIELE: Record<string, { id: string; label: string }> = {
  start: { id: "", label: "Seitenanfang" },
  leistungen: { id: "leistungen", label: "Leistungen" },
  backup: { id: "messung", label: "Backup-Messung" },
  ablauf: { id: "backup-ablauf", label: "Backup-Ablauf" },
  leitstand: { id: "leitstand", label: "Leitstand" },
  werkzeuge: { id: "werkzeuge", label: "Werkzeuge" },
  referenzen: { id: "referenzen", label: "Referenzen" },
  person: { id: "ueber-mich", label: "Über mich" },
  partner: { id: "partner", label: "Partner" },
  kontakt: { id: "kontakt", label: "Kontakt" },
};

const THEMEN: Record<string, Anliegen> = {
  gespraech: "Erstgespräch",
  angebot: "Angebot",
  audit: "Audit",
  backup: "Backup-Check",
};

const BEFEHLE = [
  ["help", "diese Übersicht"],
  ["ls", "Sektionen der Startseite"],
  ["cd <ziel>", "zu einer Sektion springen, z. B. cd leitstand"],
  ["leistungen", "was Daniel macht"],
  ["werkzeuge", "Rechner und Checks, open <name> öffnet eines"],
  ["farbe <welt>", "Farbwelt wechseln: bernstein, kobalt, beton"],
  ["kontakt [--thema x]", "zum Formular, Thema: gespraech, angebot, audit, backup"],
  ["ping daniel", "Erreichbarkeit"],
  ["neofetch", "das System in Kürze"],
  ["whoami", "wer Sie hier sind"],
  ["clear", "Ausgabe leeren"],
  ["exit", "Konsole schließen (oder Esc)"],
] as const;

type Zeile = { art: "ein" | "aus" | "fehler"; inhalt: ReactNode };

const ALLE_WORTE = ["help", "ls", "cd", "leistungen", "werkzeuge", "open", "farbe", "kontakt", "ping", "neofetch", "whoami", "clear", "exit", "uptime", "sudo"];

export function Konsole() {
  const dialog = useRef<HTMLDialogElement>(null);
  const eingabe = useRef<HTMLInputElement>(null);
  const ende = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [zeilen, setZeilen] = useState<Zeile[]>([]);
  const [text, setText] = useState("");
  const verlauf = useRef<string[]>([]);
  const position = useRef(-1);

  function schliessen() {
    dialog.current?.close();
  }

  /* Taste links neben der 1 (code Backquote, deutsch ^) oder ~; nicht beim Tippen in Feldern.
     Zusätzlich das Ereignis "konsole-oeffnen" (Knopf im Footer, für Touch-Geräte). */
  useEffect(() => {
    const oeffnen = () => {
      const d = dialog.current;
      if (!d || d.open) return;
      d.showModal();
      setZeilen((z) =>
        z.length
          ? z
          : [{ art: "aus", inhalt: <>Daniel Richter IT · Konsole. Tippen Sie <b className="text-brand-dark">help</b> für alle Befehle.</> }],
      );
      requestAnimationFrame(() => eingabe.current?.focus());
    };
    const taste = (e: globalThis.KeyboardEvent) => {
      const ziel = e.target as HTMLElement | null;
      if (ziel?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.code === "Backquote" || e.key === "~") {
        e.preventDefault();
        oeffnen();
      }
    };
    const offen = () => oeffnen();
    window.addEventListener("keydown", taste);
    window.addEventListener("konsole-oeffnen", offen);
    return () => {
      window.removeEventListener("keydown", taste);
      window.removeEventListener("konsole-oeffnen", offen);
    };
  }, []);

  useEffect(() => {
    ende.current?.scrollIntoView({ block: "end" });
  }, [zeilen]);

  function springe(id: string) {
    schliessen();
    const el = id ? document.getElementById(id) : document.body;
    if (el && (id === "" || window.location.pathname === "/")) {
      const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (id) el.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
      else window.scrollTo({ top: 0 });
    } else {
      router.push(`/${id ? `#${id}` : ""}`);
    }
  }

  function ausfuehren(roh: string): Zeile[] {
    const [befehl = "", ...rest] = roh.trim().split(/\s+/);
    const arg = rest.join(" ").toLowerCase();
    switch (befehl.toLowerCase()) {
      case "":
        return [];
      case "help":
        return [
          {
            art: "aus",
            inhalt: (
              <dl className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-6 gap-y-1">
                {BEFEHLE.map(([b, s]) => (
                  <div key={b} className="contents">
                    <dt className="text-brand-dark">{b}</dt>
                    <dd className="text-text-muted">{s}</dd>
                  </div>
                ))}
              </dl>
            ),
          },
        ];
      case "ls":
        return [{ art: "aus", inhalt: Object.keys(ZIELE).join("   ") }];
      case "cd":
      case "goto": {
        const ziel = ZIELE[arg.replace(/^\/|\/$/g, "") || "start"];
        if (!ziel) return [{ art: "fehler", inhalt: `cd: ${arg}: Ziel unbekannt. ls zeigt alle Ziele.` }];
        window.setTimeout(() => springe(ziel.id), 250);
        return [{ art: "aus", inhalt: `→ ${ziel.label}` }];
      }
      case "leistungen":
        return [
          {
            art: "aus",
            inhalt: (
              <ul className="grid gap-0.5">
                {leistungen.map((l, i) => (
                  <li key={l.titel}>
                    <span className="text-brand-dark">MOD-{String(i + 1).padStart(2, "0")}</span> {l.titel}
                  </li>
                ))}
              </ul>
            ),
          },
        ];
      case "werkzeuge":
        return [
          {
            art: "aus",
            inhalt: (
              <ul className="grid gap-0.5">
                {werkzeuge.map((w) => (
                  <li key={w.slug}>
                    <span className="text-brand-dark">{w.slug}</span> · {w.titel}
                  </li>
                ))}
                <li className="text-text-muted">open &lt;name&gt; öffnet ein Werkzeug</li>
              </ul>
            ),
          },
        ];
      case "open": {
        const w = werkzeuge.find((x) => x.slug === arg || x.kennung.toLowerCase() === arg);
        if (!w) return [{ art: "fehler", inhalt: `open: ${arg || "?"}: kein Werkzeug. werkzeuge zeigt alle.` }];
        window.setTimeout(() => {
          schliessen();
          router.push(`/werkzeuge/${w.slug}`);
        }, 250);
        return [{ art: "aus", inhalt: `→ ${w.titel}` }];
      }
      case "farbe": {
        if (!istFarbwelt(arg)) return [{ art: "fehler", inhalt: `farbe: ${FARBWELTEN.map((w) => w.id).join(", ")}` }];
        setzeFarbwelt(arg);
        return [{ art: "aus", inhalt: `Farbwelt: ${FARBWELTEN.find((w) => w.id === arg)?.name}` }];
      }
      case "kontakt": {
        const m = /--thema\s+(\S+)/.exec(arg);
        const anliegen = m ? THEMEN[m[1]] : "Erstgespräch";
        if (!anliegen) return [{ art: "fehler", inhalt: `kontakt: Thema ${m?.[1]} unbekannt. Möglich: ${Object.keys(THEMEN).join(", ")}` }];
        window.setTimeout(() => {
          if (document.getElementById("kontakt")) {
            springe("kontakt");
            meldeThema({ anliegen, betreff: `${anliegen} (aus der Konsole)` });
          } else springe("kontakt");
        }, 250);
        return [{ art: "aus", inhalt: `→ Kontakt · ${anliegen}` }];
      }
      case "ping":
        return [
          { art: "aus", inhalt: `PING ${arg || "daniel"} (Potsdam)` },
          { art: "aus", inhalt: `Telefon  ${site.telefon}` },
          { art: "aus", inhalt: `E-Mail   ${site.email}` },
          { art: "aus", inhalt: "2 Wege erreichbar · 0 % Verlust" },
        ];
      case "neofetch":
        return [
          {
            art: "aus",
            inhalt: (
              <div className="grid gap-0.5">
                <span className="text-brand-dark">daniel@richter-it</span>
                <span>---------------------</span>
                <span>Standort: {site.adresse.ort}</span>
                <span>Schwerpunkt: Open Source, On-Premises</span>
                <span>Stack: {technik.slice(0, 7).join(", ")}</span>
                <span>Zielgruppe: Mittelstand, Behörden, Landesanstalten</span>
              </div>
            ),
          },
        ];
      case "whoami":
        return [{ art: "aus", inhalt: "gast · Ihre Eingaben bleiben in Ihrem Browser." }];
      case "uptime":
        return [{ art: "aus", inhalt: "selbstständig seit 2019" }];
      case "sudo":
        return [{ art: "fehler", inhalt: "Netter Versuch. Admin-Rechte gibt es nach dem Erstgespräch: kontakt" }];
      case "clear":
        return [];
      case "exit":
        window.setTimeout(schliessen, 0);
        return [];
      default:
        return [{ art: "fehler", inhalt: `Befehl nicht gefunden: ${befehl}. help zeigt alle Befehle.` }];
    }
  }

  function senden(e: FormEvent) {
    e.preventDefault();
    const roh = text;
    setText("");
    if (roh.trim()) verlauf.current = [roh, ...verlauf.current].slice(0, 30);
    position.current = -1;
    if (roh.trim().toLowerCase() === "clear") {
      setZeilen([]);
      return;
    }
    const antwort = ausfuehren(roh);
    const eingegeben: Zeile = { art: "ein", inhalt: roh };
    setZeilen((z) => [...z, eingegeben, ...antwort].slice(-80));
  }

  function tasten(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const max = verlauf.current.length - 1;
      position.current = Math.max(-1, Math.min(max, position.current + (e.key === "ArrowUp" ? 1 : -1)));
      setText(position.current < 0 ? "" : verlauf.current[position.current]);
    } else if (e.key === "Tab") {
      const treffer = ALLE_WORTE.filter((w) => w.startsWith(text.trim().toLowerCase()));
      if (text.trim() && !text.includes(" ") && treffer.length === 1) {
        e.preventDefault();
        setText(`${treffer[0]} `);
      }
    }
  }

  return (
    <dialog ref={dialog} className="konsole" aria-label="Konsole" onClick={(e) => e.target === dialog.current && schliessen()}>
      <div className="relative isolate flex h-full flex-col">
        <div aria-hidden="true" className="scanlines -z-10" />
        <div className="flex items-center justify-between gap-4 border-b border-border px-(--gutter) py-2.5">
          <span className="daten flex items-center gap-2.5">
            <span className="status-punkt" aria-hidden="true" />
            Konsole · help für Befehle
          </span>
          <button type="button" onClick={schliessen} className="daten min-h-11 cursor-pointer px-2 hover:text-text">
            Esc · schließen
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-(--gutter) py-4 font-mono text-sm leading-relaxed" aria-live="polite">
          {zeilen.map((z, i) => (
            <div key={i} className={z.art === "fehler" ? "text-error" : z.art === "ein" ? "text-text" : "text-text-muted"}>
              {z.art === "ein" ? (
                <>
                  <span className="text-brand-dark">{PROMPT}</span> {z.inhalt}
                </>
              ) : (
                z.inhalt
              )}
            </div>
          ))}
          <div ref={ende} />
        </div>
        <form onSubmit={senden} className="flex items-center gap-3 border-t border-border px-(--gutter) py-3 font-mono text-sm">
          <label htmlFor="konsole-eingabe" className="shrink-0 text-brand-dark">
            <span className="hidden sm:inline">{PROMPT}</span>
            <span className="sm:hidden">$</span>
          </label>
          <input
            id="konsole-eingabe"
            ref={eingabe}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={tasten}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
            className="min-h-11 min-w-0 flex-1 bg-transparent text-text caret-brand outline-none"
          />
        </form>
      </div>
    </dialog>
  );
}
