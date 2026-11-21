import { lookup } from "node:dns/promises";
import { normalisiereDomain, type Pruefung } from "@/lib/sicherheitscheck";
import { KI_CRAWLER, type KiErgebnis, type Lesart } from "@/lib/ki-check";
import { besucherIp, istPrivat, zuViele } from "@/lib/server-schutz";

/*
 * KI-Sichtbarkeits-Check für das Werkzeug Domain-Check: liest Startseite, robots.txt, llms.txt
 * und sitemap.xml so, wie ein Crawler sie sieht, und bewertet, ob Suchmaschinen und Sprachmodelle
 * die Seite lesen dürfen und verstehen. Es wird nichts gespeichert.
 * Schutz vor Missbrauch wie beim Security-Check: nur öffentliche Domains, jede Umleitung wird
 * neu geprüft (keine internen Ziele), Zeitlimits, Größenlimit, Begrenzung pro IP.
 */

const ZEITLIMIT = 6000;
const MAX_PRO_MINUTE = 8;
const MAX_BYTES = 1_500_000;
const MAX_UMLEITUNGEN = 4;
const KENNUNG = "Mozilla/5.0 (compatible; daniel-richter.it KI-Check)";

function antwort(daten: KiErgebnis, status = 200) {
  return Response.json(daten, { status, headers: { "Cache-Control": "no-store" } });
}

/** true, wenn der Host nur auf öffentliche Adressen zeigt */
async function oeffentlich(host: string) {
  try {
    const adressen = await lookup(host, { all: true });
    return adressen.length > 0 && !adressen.some((a) => istPrivat(a.address));
  } catch {
    return false;
  }
}

/** Abruf mit eigener Umleitungs-Verfolgung: jedes Ziel muss öffentlich sein. Text höchstens MAX_BYTES. */
async function holen(url: string): Promise<{ status: number; url: string; headers: Headers; text: string } | null> {
  let ziel = url;
  for (let i = 0; i <= MAX_UMLEITUNGEN; i++) {
    let u: URL;
    try {
      u = new URL(ziel);
    } catch {
      return null;
    }
    if (!/^https?:$/.test(u.protocol) || !(await oeffentlich(u.hostname))) return null;
    let r: Response;
    try {
      r = await fetch(u, { redirect: "manual", signal: AbortSignal.timeout(ZEITLIMIT), headers: { "user-agent": KENNUNG }, cache: "no-store" });
    } catch {
      return null;
    }
    const weiter = r.headers.get("location");
    if (r.status >= 300 && r.status < 400 && weiter) {
      ziel = new URL(weiter, u).toString();
      continue;
    }
    /* Nur Text lesen und nach MAX_BYTES abbrechen */
    let text = "";
    if (r.body) {
      const leser = r.body.getReader();
      const dekoder = new TextDecoder();
      let gelesen = 0;
      while (gelesen < MAX_BYTES) {
        const { done, value } = await leser.read();
        if (done) break;
        gelesen += value.length;
        text += dekoder.decode(value, { stream: true });
      }
      void leser.cancel().catch(() => {});
    }
    return { status: r.status, url: u.toString(), headers: r.headers, text };
  }
  return null;
}

/* ---- HTML lesen, ohne Bibliothek ---- */

const ENTITAETEN: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const entschluesseln = (s: string) =>
  s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1]?.toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITAETEN[e.toLowerCase()] ?? m;
  });
const sauber = (s: string) => entschluesseln(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** Attribut aus einem Tag lesen */
const attribut = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(2).find((x) => x !== undefined);

function metaInhalt(html: string, schluessel: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = (attribut(tag, "name") ?? attribut(tag, "property") ?? "").toLowerCase();
    if (name === schluessel) return entschluesseln(attribut(tag, "content") ?? "").trim();
  }
  return undefined;
}

function linkHref(html: string, rel: string) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if ((attribut(tag, "rel") ?? "").toLowerCase().split(/\s+/).includes(rel)) return attribut(tag, "href");
  }
  return undefined;
}

/** Reiner Text, wie ihn ein Sprachmodell nach dem Entfernen von Code und Gestaltung bekommt */
function seitenText(html: string) {
  const koerper = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  return sauber(
    koerper
      .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<\/(p|div|li|h[1-6]|section|article|header|footer|tr|br)>/gi, "$& "),
  );
}

/* ---- Strukturierte Daten ---- */

type Knoten = Record<string, unknown>;

function jsonLd(html: string): Knoten[] {
  const knoten: Knoten[] = [];
  const sammeln = (x: unknown) => {
    if (Array.isArray(x)) x.forEach(sammeln);
    else if (x && typeof x === "object") {
      const k = x as Knoten;
      knoten.push(k);
      if (Array.isArray(k["@graph"])) (k["@graph"] as unknown[]).forEach(sammeln);
    }
  };
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      sammeln(JSON.parse(m[1].trim()));
    } catch {
      /* fehlerhaftes JSON-LD: zählt als nicht vorhanden */
    }
  }
  return knoten;
}

const alsText = (x: unknown): string | undefined => {
  if (typeof x === "string") return x.trim() || undefined;
  if (typeof x === "number") return String(x);
  if (Array.isArray(x)) return alsText(x[0]);
  if (x && typeof x === "object") {
    const k = x as Knoten;
    if (k["@type"] === "PostalAddress") return [k.streetAddress, [k.postalCode, k.addressLocality].filter(Boolean).join(" ")].filter(Boolean).join(", ") || undefined;
    return alsText(k.name);
  }
  return undefined;
};

function fakten(knoten: Knoten[]): [string, string][] {
  const felder: [string, string][] = [
    ["name", "Name"],
    ["description", "Beschreibung"],
    ["address", "Adresse"],
    ["telephone", "Telefon"],
    ["email", "E-Mail"],
    ["areaServed", "Einzugsgebiet"],
    ["founder", "Gründer"],
    ["openingHours", "Öffnungszeiten"],
    ["priceRange", "Preisrahmen"],
  ];
  const liste: [string, string][] = [];
  for (const [feld, label] of felder) {
    const wert = knoten.map((k) => alsText(k[feld])).find(Boolean);
    if (wert) liste.push([label, wert.length > 140 ? `${wert.slice(0, 139)}…` : wert]);
  }
  return liste.slice(0, 7);
}

/* ---- robots.txt ---- */

type Gruppe = { agenten: string[]; regeln: { erlaubt: boolean; pfad: string }[] };

function robotsGruppen(text: string): Gruppe[] {
  const gruppen: Gruppe[] = [];
  let aktuell: Gruppe | null = null;
  let zuletztAgent = false;
  for (const roh of text.split(/\r?\n/)) {
    const zeile = roh.replace(/#.*/, "").trim();
    const m = zeile.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const [, feld, wert] = m;
    const f = feld.toLowerCase();
    if (f === "user-agent") {
      if (!aktuell || !zuletztAgent) {
        aktuell = { agenten: [], regeln: [] };
        gruppen.push(aktuell);
      }
      aktuell.agenten.push(wert.trim().toLowerCase());
      zuletztAgent = true;
    } else if ((f === "allow" || f === "disallow") && aktuell) {
      zuletztAgent = false;
      /* "Disallow:" ohne Pfad erlaubt alles und zählt nicht */
      if (wert.trim()) aktuell.regeln.push({ erlaubt: f === "allow", pfad: wert.trim() });
    } else {
      zuletztAgent = false;
    }
  }
  return gruppen;
}

/** Darf dieser Crawler die Startseite lesen? Längste passende Regel gewinnt, wie bei Google. */
function darfLesen(gruppen: Gruppe[], agent: string) {
  const name = agent.toLowerCase();
  const gruppe = gruppen.find((g) => g.agenten.includes(name)) ?? gruppen.find((g) => g.agenten.includes("*"));
  if (!gruppe) return true;
  const passend = gruppe.regeln.filter((r) => "/".startsWith(r.pfad.replace(/\*$/, "").replace(/\$$/, "")) || r.pfad === "/*");
  if (!passend.length) return true;
  passend.sort((a, b) => b.pfad.length - a.pfad.length || Number(b.erlaubt) - Number(a.erlaubt));
  return passend[0].erlaubt;
}

/* ---- Prüfung ---- */

/** Gewicht je Prüfung für die Punktzahl, Hebel-Satz bei "fehlt" und, falls anders, bei "warn" */
const GEWICHT: Record<string, [number, string, string?]> = {
  index: [20, "Das noindex entfernen: So taucht die Seite weder bei Google noch in KI-Antworten auf."],
  ki: [
    18,
    "KI-Crawler in der robots.txt zulassen, damit ChatGPT, Claude und Perplexity die Seite lesen dürfen.",
    "Die gesperrten KI-Crawler in der robots.txt freigeben, sonst fehlt die Seite in deren Antworten.",
  ],
  jsonld: [14, "Strukturierte Daten (JSON-LD) ergänzen: Name, Adresse, Leistungen. Daraus übernehmen KI und Google Fakten direkt."],
  text: [10, "Mehr lesbaren Text ausliefern: Was erst per JavaScript erscheint, sehen viele Crawler nicht."],
  titel: [8, "Einen aussagekräftigen Seitentitel setzen, er ist das Erste, was Suchmaschinen und KI lesen.", "Den Seitentitel auf etwa 30 bis 65 Zeichen bringen, damit er vollständig angezeigt wird."],
  beschreibung: [
    7,
    "Eine Meta-Beschreibung schreiben: Sie wird in Suchergebnissen und KI-Zusammenfassungen genutzt.",
    "Die Meta-Beschreibung auf etwa 120 bis 160 Zeichen bringen, sonst wird sie abgeschnitten oder ersetzt.",
  ],
  h1: [6, "Eine Hauptüberschrift (H1) setzen, die sagt, worum es geht.", "Nur eine Hauptüberschrift (H1) verwenden, damit klar ist, worum es geht."],
  llms: [6, "Eine llms.txt anlegen: eine Kurzfassung der Website eigens für Sprachmodelle."],
  sitemap: [5, "Eine sitemap.xml bereitstellen und in der robots.txt nennen, damit alle Seiten gefunden werden."],
  sprache: [3, "Die Sprache der Seite angeben (lang=\"de\"), damit sie richtig eingeordnet wird."],
  canonical: [3, "Eine Canonical-Adresse setzen, damit nicht mehrere Fassungen der Seite konkurrieren."],
};

export async function GET(request: Request) {
  if (zuViele("ki-check", besucherIp(request), MAX_PRO_MINUTE)) return antwort({ ok: false, fehler: "Zu viele Prüfungen. Bitte in einer Minute erneut." }, 429);

  const domain = normalisiereDomain(new URL(request.url).searchParams.get("domain") ?? "");
  if (!domain) return antwort({ ok: false, fehler: "Bitte eine öffentliche Domain angeben, z. B. beispiel.de" }, 400);
  if (!(await oeffentlich(domain))) return antwort({ ok: false, fehler: `${domain} ist nicht öffentlich erreichbar.` }, 404);

  const seite = (await holen(`https://${domain}/`)) ?? (await holen(`http://${domain}/`));
  if (!seite || seite.status >= 400) return antwort({ ok: false, fehler: `Die Startseite von ${domain} antwortet nicht${seite ? ` (HTTP ${seite.status})` : ""}.` }, 502);

  const herkunft = new URL(seite.url).origin;
  const [robots, llms, sitemapStandard] = await Promise.all([holen(`${herkunft}/robots.txt`), holen(`${herkunft}/llms.txt`), holen(`${herkunft}/sitemap.xml`)]);

  const html = seite.text;
  const p: Pruefung[] = [];

  /* Indexierung */
  const metaRobots = `${metaInhalt(html, "robots") ?? ""} ${seite.headers.get("x-robots-tag") ?? ""}`.toLowerCase();
  p.push(
    /noindex/.test(metaRobots)
      ? { id: "index", titel: "Indexierung erlaubt", status: "fehlt", wert: "noindex", hinweis: "Suchmaschinen und KI sollen die Seite ausdrücklich nicht aufnehmen." }
      : { id: "index", titel: "Indexierung erlaubt", status: "ok" },
  );

  /* KI-Crawler */
  const robotsText = robots && robots.status < 400 && !/<html/i.test(robots.text) ? robots.text : "";
  const gruppen = robotsGruppen(robotsText);
  const gesperrt = KI_CRAWLER.filter(([name]) => !darfLesen(gruppen, name)).map(([name]) => name);
  p.push(
    gesperrt.length === 0
      ? { id: "ki", titel: "KI-Crawler dürfen lesen", status: "ok", wert: robotsText ? `alle ${KI_CRAWLER.length}` : "keine robots.txt, alles erlaubt" }
      : {
          id: "ki",
          titel: "KI-Crawler dürfen lesen",
          status: gesperrt.length === KI_CRAWLER.length ? "fehlt" : "warn",
          wert: `gesperrt: ${gesperrt.join(", ")}`,
          hinweis: "Gesperrte Sprachmodelle kennen die Seite nicht und empfehlen sie nicht.",
        },
  );

  /* Strukturierte Daten */
  const knoten = jsonLd(html);
  const typen = [...new Set(knoten.flatMap((k) => (Array.isArray(k["@type"]) ? k["@type"] : [k["@type"]])).filter((t): t is string => typeof t === "string"))];
  p.push(
    typen.length
      ? { id: "jsonld", titel: "Strukturierte Daten (JSON-LD)", status: "ok", wert: typen.slice(0, 4).join(", ") }
      : { id: "jsonld", titel: "Strukturierte Daten (JSON-LD)", status: "fehlt", hinweis: "KI und Google müssen Fakten wie Adresse und Leistungen erraten." },
  );

  /* Lesbarer Text */
  const text = seitenText(html);
  const woerter = text ? text.split(" ").length : 0;
  p.push(
    woerter >= 250
      ? { id: "text", titel: "Lesbarer Text im HTML", status: "ok", wert: `${woerter.toLocaleString("de-DE")} Wörter` }
      : {
          id: "text",
          titel: "Lesbarer Text im HTML",
          status: woerter < 60 ? "fehlt" : "warn",
          wert: `${woerter} Wörter`,
          hinweis: "Crawler, die kein JavaScript ausführen, sehen kaum Inhalt.",
        },
  );

  /* Titel, Beschreibung, H1, Sprache, Canonical */
  const titel = sauber(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "") || undefined;
  p.push(
    !titel
      ? { id: "titel", titel: "Seitentitel", status: "fehlt" }
      : titel.length < 15 || titel.length > 70
        ? { id: "titel", titel: "Seitentitel", status: "warn", wert: `${titel.length} Zeichen`, hinweis: "Ideal sind etwa 30 bis 65 Zeichen." }
        : { id: "titel", titel: "Seitentitel", status: "ok", wert: `${titel.length} Zeichen` },
  );
  const beschreibung = metaInhalt(html, "description") || undefined;
  p.push(
    !beschreibung
      ? { id: "beschreibung", titel: "Meta-Beschreibung", status: "fehlt" }
      : beschreibung.length < 70 || beschreibung.length > 170
        ? { id: "beschreibung", titel: "Meta-Beschreibung", status: "warn", wert: `${beschreibung.length} Zeichen`, hinweis: "Ideal sind etwa 120 bis 160 Zeichen." }
        : { id: "beschreibung", titel: "Meta-Beschreibung", status: "ok", wert: `${beschreibung.length} Zeichen` },
  );
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => sauber(m[1])).filter(Boolean);
  p.push(
    h1.length === 1
      ? { id: "h1", titel: "Eine Hauptüberschrift (H1)", status: "ok" }
      : { id: "h1", titel: "Eine Hauptüberschrift (H1)", status: h1.length ? "warn" : "fehlt", wert: `${h1.length} gefunden` },
  );
  const sprache = attribut(html.match(/<html\b[^>]*>/i)?.[0] ?? "", "lang");
  p.push(sprache ? { id: "sprache", titel: "Sprache angegeben", status: "ok", wert: sprache } : { id: "sprache", titel: "Sprache angegeben", status: "warn", wert: "fehlt" });
  const canonical = linkHref(html, "canonical");
  p.push(canonical ? { id: "canonical", titel: "Canonical-Adresse", status: "ok" } : { id: "canonical", titel: "Canonical-Adresse", status: "warn", wert: "fehlt" });

  /* llms.txt und Sitemap */
  const llmsDa = !!llms && llms.status === 200 && !/<html/i.test(llms.text.slice(0, 500)) && llms.text.trim().length > 20;
  p.push(llmsDa ? { id: "llms", titel: "llms.txt für Sprachmodelle", status: "ok" } : { id: "llms", titel: "llms.txt für Sprachmodelle", status: "warn", wert: "fehlt" });
  const sitemapInRobots = /^\s*sitemap\s*:/im.test(robotsText);
  const sitemapDa = sitemapInRobots || (!!sitemapStandard && sitemapStandard.status === 200 && /<(urlset|sitemapindex)\b/i.test(sitemapStandard.text));
  p.push(sitemapDa ? { id: "sitemap", titel: "Sitemap", status: "ok", wert: sitemapInRobots ? "in robots.txt genannt" : "sitemap.xml" } : { id: "sitemap", titel: "Sitemap", status: "warn", wert: "nicht gefunden" });

  /* Punktzahl: volle Punkte bei ok, halbe bei warn */
  let erreicht = 0;
  let moeglich = 0;
  for (const x of p) {
    const g = GEWICHT[x.id]?.[0] ?? 0;
    moeglich += g;
    erreicht += x.status === "ok" ? g : x.status === "warn" ? g / 2 : 0;
  }
  const hebel = p
    .filter((x) => x.status === "warn" || x.status === "fehlt")
    .sort((a, b) => (GEWICHT[b.id]?.[0] ?? 0) * (b.status === "fehlt" ? 2 : 1) - (GEWICHT[a.id]?.[0] ?? 0) * (a.status === "fehlt" ? 2 : 1))
    .slice(0, 3)
    .map((x) => (x.status === "warn" ? (GEWICHT[x.id]?.[2] ?? GEWICHT[x.id]?.[1]) : GEWICHT[x.id]?.[1]))
    .filter((x): x is string => !!x);

  const lesart: Lesart = {
    titel,
    beschreibung,
    h1: h1.slice(0, 3),
    sprache,
    woerter,
    auszug: text.length > 900 ? `${text.slice(0, 899)}…` : text,
    typen,
    fakten: fakten(knoten),
  };

  return antwort({ ok: true, domain, adresse: seite.url, punkte: Math.round((erreicht / Math.max(1, moeglich)) * 100), pruefungen: p, hebel, lesart });
}
