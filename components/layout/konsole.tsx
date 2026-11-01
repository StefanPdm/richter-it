"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { FARBWELTEN, istFarbwelt, setzeFarbwelt } from "@/lib/farbwelt";
import { meldeThema, type Anliegen } from "@/lib/kontakt-thema";
import { leistungen, technik } from "@/lib/inhalte";
import { site } from "@/lib/site";
import { werkzeuge } from "@/lib/werkzeuge";
import type { CheckErgebnis, Pruefung } from "@/lib/sicherheitscheck";
import type { WetterErgebnis } from "@/app/api/wetter/route";
import type { PingErgebnis } from "@/app/api/ping/route";
import { KonsoleWetter } from "./konsole-wetter";

/*
 * Konsole: öffnet sich mit der Taste links neben der 1 (^ bzw. `) oder mit ~.
 * Echte Befehle, die die Seite bedienen: Sektionen ansteuern, Werkzeuge öffnen,
 * Farbwelt wechseln, Kontakt mit Thema. Dazu zwei Prüfungen über eigene API-Routen:
 * check <domain> (app/api/check) und whoami (app/api/ich). Gespeichert wird nichts.
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
  ["check <domain>", "Sicherheit einer Domain prüfen: Mail-Schutz, HTTPS, Zertifikat, Header"],
  ["whoami", "was jede Website über Sie sieht: IP, Browser, System"],
  ["wetter [ort]", "Wetterbericht, ohne Ort für Potsdam"],
  ["ls", "Sektionen der Startseite"],
  ["cd <ziel>", "zu einer Sektion springen, z. B. cd leitstand"],
  ["leistungen", "was Daniel macht"],
  ["werkzeuge", "Rechner und Checks, open <name> öffnet eines"],
  ["farbe <welt>", "Farbwelt wechseln: bernstein, kobalt, beton"],
  ["kontakt [--thema x]", "zum Formular, Thema: gespraech, angebot, audit, backup"],
  ["kontakt --ergebnis", "letztes check-Ergebnis ins Kontaktformular übernehmen"],
  ["ping [domain]", "Antwortzeit messen, ohne Domain: Ihr Browser zu dieser Website"],
  ["ping daniel", "wie Sie Daniel erreichen"],
  ["neofetch", "das System in Kürze"],
  ["clear", "Ausgabe leeren"],
  ["exit", "Konsole schließen (oder Esc)"],
] as const;

type Zeile = { art: "ein" | "aus" | "fehler"; inhalt: ReactNode };

const ALLE_WORTE = ["help", "check", "wetter", "ls", "cd", "leistungen", "werkzeuge", "open", "farbe", "kontakt", "ping", "neofetch", "whoami", "clear", "exit", "uptime", "sudo"];

const MARKE: Record<Pruefung["status"], { text: string; klasse: string }> = {
  ok: { text: "[  OK  ]", klasse: "text-success" },
  warn: { text: "[ WARN ]", klasse: "text-brand-dark" },
  fehlt: { text: "[FEHLT ]", klasse: "text-error" },
  info: { text: "[ INFO ]", klasse: "text-text-muted" },
};

/** Browser und System aus den Angaben, die jeder Browser mitschickt */
function browserUndSystem() {
  const ua = navigator.userAgent;
  const version = (muster: RegExp) => muster.exec(ua)?.[1];
  const browser = version(/Edg\/(\d+)/)
    ? `Edge ${version(/Edg\/(\d+)/)}`
    : version(/OPR\/(\d+)/)
      ? `Opera ${version(/OPR\/(\d+)/)}`
      : version(/Firefox\/(\d+)/)
        ? `Firefox ${version(/Firefox\/(\d+)/)}`
        : version(/Chrome\/(\d+)/)
          ? `Chrome ${version(/Chrome\/(\d+)/)}`
          : version(/Version\/(\d+).*Safari/)
            ? `Safari ${version(/Version\/(\d+)/)}`
            : "unbekannt";
  const system = /Windows NT/.test(ua)
    ? "Windows"
    : /iPhone|iPad/.test(ua)
      ? "iOS"
      : /Android/.test(ua)
        ? "Android"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "unbekannt";
  return { browser, system };
}

export function Konsole() {
  const dialog = useRef<HTMLDialogElement>(null);
  const eingabe = useRef<HTMLInputElement>(null);
  const ende = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [zeilen, setZeilen] = useState<Zeile[]>([]);
  const [text, setText] = useState("");
  const verlauf = useRef<string[]>([]);
  const position = useRef(-1);
  /* letztes Ergebnis von check, für kontakt --ergebnis */
  const letzterCheck = useRef<{ domain: string; text: string } | null>(null);

  function anhaengen(neu: Zeile[]) {
    setZeilen((z) => [...z, ...neu].slice(-80));
  }

  async function pruefeDomain(eingabe: string) {
    let daten: CheckErgebnis;
    try {
      const r = await fetch(`/api/check?domain=${encodeURIComponent(eingabe)}`, { cache: "no-store" });
      daten = (await r.json()) as CheckErgebnis;
    } catch {
      anhaengen([{ art: "fehler", inhalt: "check: Prüfung gerade nicht erreichbar." }]);
      return;
    }
    if (!daten.ok) {
      anhaengen([{ art: "fehler", inhalt: `check: ${daten.fehler}` }]);
      return;
    }
    const zahl = (s: Pruefung["status"]) => daten.pruefungen.filter((x) => x.status === s).length;
    const bilanz = `${zahl("ok")} in Ordnung · ${zahl("warn")} Hinweise · ${zahl("fehlt")} fehlen`;
    letzterCheck.current = {
      domain: daten.domain,
      text: [
        `Security-Check für ${daten.domain}: ${bilanz}.`,
        ...daten.pruefungen
          .filter((x) => x.status === "warn" || x.status === "fehlt")
          .map((x) => `- ${x.titel}: ${x.status === "fehlt" ? "fehlt" : "Hinweis"}${x.wert && x.wert !== "fehlt" ? ` (${x.wert})` : ""}`),
        "Ich möchte das Ergebnis besprechen.",
      ].join("\n"),
    };
    anhaengen([
      {
        art: "aus",
        inhalt: (
          <ul className="grid gap-1 py-1">
            {daten.pruefungen.map((x) => (
              <li key={x.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
                <span className={`whitespace-pre ${MARKE[x.status].klasse}`}>{MARKE[x.status].text}</span>
                <span>
                  <span className="text-text">{x.titel}</span>
                  {x.wert && <span className="text-text-muted"> · {x.wert}</span>}
                  {x.hinweis && <span className="block text-text-muted">↳ {x.hinweis}</span>}
                </span>
              </li>
            ))}
          </ul>
        ),
      },
      { art: "aus", inhalt: <span className="text-text">{daten.domain}: {bilanz}</span> },
      {
        art: "aus",
        inhalt: (
          <>
            <b className="text-brand-dark">kontakt --ergebnis</b> übernimmt das Ergebnis ins Kontaktformular.
          </>
        ),
      },
    ]);
  }

  /* Ping: mit Ziel als TCP-Ping vom Server (app/api/ping), ohne Ziel vom Browser zur Website.
     Vier Runden im Sekundentakt, jede Antwort erscheint sofort. */
  async function pingen(ziel: string) {
    const RUNDEN = 4;
    const zeiten: (number | null)[] = [];
    const warte = (ms = 1000) => new Promise((r) => window.setTimeout(r, ms));
    /* IPv6 in eckigen Klammern, damit "Adresse: Zeit" lesbar bleibt */
    const adresse = (ip: string) => (ip.includes(":") ? `[${ip}]` : ip);
    /* erst nach der Befehlszeile ausgeben */
    await warte(0);

    if (!ziel) {
      anhaengen([
        { art: "aus", inhalt: `PING ${location.host} via ${location.protocol === "https:" ? "HTTPS" : "HTTP"} · von Ihrem Browser zur Website` },
      ]);
      for (let i = 0; i < RUNDEN; i++) {
        if (i) await warte();
        const start = performance.now();
        try {
          await fetch(`/api/ich?r=${Date.now()}`, { cache: "no-store" });
          const ms = Math.round(performance.now() - start);
          zeiten.push(ms);
          anhaengen([{ art: "aus", inhalt: `Antwort von ${location.host}: Zeit=${ms} ms` }]);
        } catch {
          zeiten.push(null);
          anhaengen([{ art: "fehler", inhalt: "Keine Antwort" }]);
        }
      }
    } else {
      for (let i = 0; i < RUNDEN; i++) {
        if (i) await warte();
        let d: PingErgebnis;
        try {
          d = (await (await fetch(`/api/ping?ziel=${encodeURIComponent(ziel)}`, { cache: "no-store" })).json()) as PingErgebnis;
        } catch {
          anhaengen([{ art: "fehler", inhalt: "ping: Messung gerade nicht erreichbar." }]);
          return;
        }
        if (!d.ok) {
          anhaengen([{ art: "fehler", inhalt: `ping: ${d.fehler}` }]);
          return;
        }
        if (i === 0) anhaengen([{ art: "aus", inhalt: `PING ${d.domain} (${d.ip}) via TCP/443 · gemessen von: ${d.messort}` }]);
        zeiten.push(d.ms);
        anhaengen([
          d.ms === null
            ? { art: "fehler", inhalt: `${adresse(d.ip)}: ${d.grund ?? "keine Antwort"}` }
            : { art: "aus", inhalt: `Antwort von ${adresse(d.ip)}: Zeit=${d.ms.toLocaleString("de-DE")} ms` },
        ]);
      }
    }

    const ok = zeiten.filter((z): z is number => z !== null);
    const verlust = Math.round(((zeiten.length - ok.length) / zeiten.length) * 100);
    const f = (z: number) => z.toLocaleString("de-DE", { maximumFractionDigits: 1 });
    anhaengen([
      {
        art: "aus",
        inhalt: (
          <span className="text-text">
            {zeiten.length} gesendet, {ok.length} empfangen, {verlust} % Verlust
            {ok.length > 0 &&
              ` · min/avg/max = ${f(Math.min(...ok))}/${f(ok.reduce((s, z) => s + z, 0) / ok.length)}/${f(Math.max(...ok))} ms`}
          </span>
        ),
      },
    ]);
  }

  async function zeigeWetter(ort: string) {
    let daten: WetterErgebnis;
    try {
      daten = (await (await fetch(`/api/wetter?ort=${encodeURIComponent(ort)}`)).json()) as WetterErgebnis;
    } catch {
      anhaengen([{ art: "fehler", inhalt: "wetter: Wetterdienst gerade nicht erreichbar." }]);
      return;
    }
    anhaengen(daten.ok ? [{ art: "aus", inhalt: <KonsoleWetter daten={daten} /> }] : [{ art: "fehler", inhalt: `wetter: ${daten.fehler}` }]);
  }

  async function zeigeBesucher() {
    let ip: string | null = null;
    try {
      ip = ((await (await fetch("/api/ich", { cache: "no-store" })).json()) as { ip: string | null }).ip;
    } catch {
      /* ohne IP weiter */
    }
    const { browser, system } = browserUndSystem();
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    const reihen: [string, string][] = [
      ["IP-Adresse", ip ?? "nicht ermittelbar"],
      ["Browser", browser],
      ["System", system],
      ["Sprache", navigator.language],
      ["Zeitzone", Intl.DateTimeFormat().resolvedOptions().timeZone],
      ["Bildschirm", `${screen.width} × ${screen.height}`],
      ["Verbindung", location.protocol === "https:" ? "verschlüsselt (HTTPS)" : "unverschlüsselt"],
      ["Cookies", navigator.cookieEnabled ? "erlaubt" : "gesperrt"],
      ["Tracking-Widerspruch", nav.globalPrivacyControl ? "gesendet (GPC)" : "nicht gesendet"],
    ];
    anhaengen([
      {
        art: "aus",
        inhalt: (
          <dl className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-6 gap-y-0.5 py-1">
            {reihen.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-brand-dark">{k}</dt>
                <dd className="text-text">{v}</dd>
              </div>
            ))}
          </dl>
        ),
      },
      { art: "aus", inhalt: "Das sieht jede Website, die Sie besuchen. Gespeichert wird hier nichts." },
    ]);
  }

  function schliessen() {
    dialog.current?.close();
  }

  /* Taste links neben der 1 (code Backquote, deutsch ^) oder ~; nicht beim Tippen in Feldern.
     Zusätzlich das Ereignis "konsole-oeffnen" (Statusleiste unten, auch für Touch-Geräte). */
  useEffect(() => {
    const oeffnen = () => {
      const d = dialog.current;
      if (!d || d.open) return;
      d.showModal();
      setZeilen((z) =>
        z.length
          ? z
          : [
              { art: "aus", inhalt: <>Daniel Richter IT · Konsole. Tippen Sie <b className="text-brand-dark">help</b> für alle Befehle.</> },
              { art: "aus", inhalt: <>Tipp: <b className="text-brand-dark">check ihre-domain.de</b> prüft, wie gut Ihre Domain geschützt ist.</> },
            ],
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
      case "check": {
        if (!arg) return [{ art: "fehler", inhalt: "check: Domain fehlt, z. B. check beispiel.de" }];
        void pruefeDomain(arg);
        return [{ art: "aus", inhalt: `prüfe ${arg} · DNS, Mail-Schutz, HTTPS, Zertifikat, Header …` }];
      }
      case "wetter": {
        /* Ortsname in Originalschreibung, nicht kleingeschrieben */
        const ort = rest.join(" ").trim() || "Potsdam";
        void zeigeWetter(ort);
        return [{ art: "aus", inhalt: `frage Wetter für ${ort} ab …` }];
      }
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
        if (/--ergebnis/.test(arg)) {
          const c = letzterCheck.current;
          if (!c) return [{ art: "fehler", inhalt: "kontakt: Noch kein Ergebnis. Zuerst check <domain> ausführen." }];
          window.setTimeout(() => {
            springe("kontakt");
            meldeThema({ anliegen: "Audit", betreff: `Security-Check ${c.domain}`, nachricht: c.text });
          }, 250);
          return [{ art: "aus", inhalt: `→ Kontakt · Ergebnis für ${c.domain} übernommen` }];
        }
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
        if (arg !== "daniel") {
          void pingen(arg);
          return [];
        }
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
        void zeigeBesucher();
        return [];
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
            <span className="text-brand-dark" aria-hidden="true">&gt;_</span>
            Konsole<span className="hidden sm:inline"> · help für Befehle</span>
          </span>
          <button type="button" onClick={schliessen} className="daten min-h-11 cursor-pointer px-2 hover:text-text">
            <span className="hidden sm:inline">Esc · </span>schließen
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
