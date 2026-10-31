#!/usr/bin/env node
/*
  Prüfskript für den Qualitätscheck (qualitaet.md, Skill design-startpunkt).

  Aufruf (Seite muss laufen, am besten der Produktions-Build):
    npm run build && npm start          (Fenster 1)
    npm run pruefen                     (Fenster 2)
    npm run pruefen -- --url http://localhost:3000 --seiten impressum,kontakt
    (Startseite wird immer geprüft)

  Nutzt den installierten Edge oder Chrome, kein eigener Browser-Download.
  Ergebnis: pruefung/bericht.md und Screenshots in pruefung/.
  Exit-Code 1 bei mindestens einem FEHLER.
*/
import { chromium } from "playwright";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname, relative } from "node:path";

// --- Argumente ----------------------------------------------------------
const args = process.argv.slice(2);
const arg = (name, standard) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : standard;
};
const basis = arg("url", "http://localhost:3000").replace(/\/$/, "");
// Startseite immer, weitere ohne Schrägstrich: --seiten impressum,leistungen/reinigung
// (ein führendes "/" würde Git Bash in einen Windows-Pfad umwandeln)
const seiten = [
  "/",
  ...arg("seiten", "")
    .split(",")
    .map((s) => s.trim().replace(/^\/+/, ""))
    .filter(Boolean)
    .map((s) => `/${s}`),
];
const ausgabe = arg("out", "pruefung");

const ansichten = [
  { name: "desktop-1440", viewport: { width: 1440, height: 900 } },
  { name: "tablet-768", viewport: { width: 768, height: 1024 }, hasTouch: true },
  { name: "mobil-375", viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true },
];

// --- Ergebnisse ---------------------------------------------------------
const funde = [];
const melde = (stufe, bereich, text) => funde.push({ stufe, bereich, text });
const FEHLER = "FEHLER";
const WARNUNG = "WARNUNG";

// --- Browser ------------------------------------------------------------
async function browserStarten() {
  for (const channel of ["msedge", "chrome", undefined]) {
    try {
      return await chromium.launch({ channel });
    } catch {
      /* nächsten Browser versuchen */
    }
  }
  throw new Error("Kein Browser gefunden. Edge oder Chrome installieren oder: npx playwright install chromium");
}

/** Langsam durchscrollen, damit Reveals und Lazy-Bilder auslösen. */
async function durchscrollen(page) {
  await page.evaluate(async () => {
    const schritt = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += schritt) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 1500));
  });
}

// --- Prüfungen im Browser -----------------------------------------------
async function seiteAnalysieren(page) {
  return page.evaluate(() => {
    const erstesFamily = (el) => getComputedStyle(el).fontFamily.split(",")[0].trim().replace(/["']/g, "");
    const geladen = new Set(
      [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")),
    );
    const h1 = [...document.querySelectorAll("h1")];
    const ebenen = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1]));
    const spruenge = [];
    for (let i = 1; i < ebenen.length; i++) {
      if (ebenen[i] > ebenen[i - 1] + 1) spruenge.push(`h${ebenen[i - 1]} -> h${ebenen[i]}`);
    }
    const breit = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > window.innerWidth + 1;
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${String(el.className).split(" ")[0]}`);

    const bilder = [...document.querySelectorAll("img")];
    const zielflaechen = [...document.querySelectorAll("button, [role=button], nav a, a.inline-flex")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44);
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}"`);

    const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? null;
    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try {
        JSON.parse(s.textContent);
        return true;
      } catch {
        return false;
      }
    });

    return {
      lang: document.documentElement.lang,
      titel: document.title,
      beschreibung: meta('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      ogTitel: meta('meta[property="og:title"]'),
      h1Anzahl: h1.length,
      h1Zeilen: h1[0]
        ? Math.round(h1[0].getBoundingClientRect().height / parseFloat(getComputedStyle(h1[0]).lineHeight))
        : 0,
      spruenge,
      schriftBody: erstesFamily(document.body),
      schriftH1: h1[0] ? erstesFamily(h1[0]) : null,
      geladeneSchriften: [...geladen],
      ueberbreite: document.documentElement.scrollWidth > window.innerWidth,
      breit,
      bilderOhneAlt: bilder.filter((b) => !b.hasAttribute("alt")).length,
      bilderOhneMasse: bilder.filter((b) => !b.getAttribute("width") || !b.getAttribute("height")).length,
      zielflaechen,
      jsonLd,
      revealWartet: document.querySelectorAll('[data-reveal="wartet"]').length,
      // nur WebGL zählt als 3D: getContext liefert null, wenn der Canvas schon 2D ist
      canvas: [...document.querySelectorAll("canvas")].some((c) => !!(c.getContext("webgl2") || c.getContext("webgl"))),
      pin: !!document.querySelector(".pin-spacer"),
      lenis: document.documentElement.classList.contains("lenis"),
    };
  });
}

function auswerten(seite, ansicht, a) {
  const ort = `${seite} ${ansicht}`;
  if (a.h1Anzahl !== 1) melde(FEHLER, ort, `${a.h1Anzahl} H1 statt genau einer`);
  if (a.h1Zeilen > 2) melde(WARNUNG, ort, `H1 bricht auf ${a.h1Zeilen} Zeilen um (Paket 5: höchstens 2)`);
  if (a.spruenge.length) melde(WARNUNG, ort, `Überschriften springen: ${a.spruenge.join(", ")}`);
  if (a.ueberbreite) melde(FEHLER, ort, `horizontales Scrollen, zu breit: ${a.breit.join(", ") || "unbekannt"}`);
  if (!a.geladeneSchriften.includes(a.schriftBody))
    melde(FEHLER, ort, `Body-Schrift "${a.schriftBody}" ist nicht geladen (Fehler-Check 1)`);
  if (a.schriftH1 && !a.geladeneSchriften.includes(a.schriftH1))
    melde(FEHLER, ort, `H1-Schrift "${a.schriftH1}" ist nicht geladen (Fehler-Check 1)`);
  if (a.bilderOhneAlt) melde(FEHLER, ort, `${a.bilderOhneAlt} Bild(er) ohne alt`);
  if (a.bilderOhneMasse) melde(WARNUNG, ort, `${a.bilderOhneMasse} Bild(er) ohne width/height`);
  if (a.zielflaechen.length && ansicht !== "desktop-1440")
    melde(WARNUNG, ort, `Zielflächen unter 44px: ${a.zielflaechen.join(", ")}`);
  if (a.revealWartet) melde(FEHLER, ort, `${a.revealWartet} Reveal(s) nach dem Durchscrollen noch unsichtbar`);
  if (a.jsonLd.includes(false)) melde(FEHLER, ort, "JSON-LD nicht lesbar");
}

function metaAuswerten(seite, a) {
  if (!a.lang) melde(FEHLER, seite, "html lang fehlt");
  if (!a.titel) melde(FEHLER, seite, "Title fehlt");
  else if (a.titel.length > 60) melde(WARNUNG, seite, `Title ${a.titel.length} Zeichen (max. 60)`);
  if (!a.beschreibung) melde(FEHLER, seite, "Meta-Description fehlt");
  else if (a.beschreibung.length > 155) melde(WARNUNG, seite, `Description ${a.beschreibung.length} Zeichen (max. 155)`);
  if (!a.canonical) melde(FEHLER, seite, "Canonical fehlt");
  if (!a.ogTitel) melde(WARNUNG, seite, "OpenGraph fehlt");
  if (!a.jsonLd.length) melde(WARNUNG, seite, "kein JSON-LD");
}

function headerAuswerten(h, https) {
  const fehlt = (name) => !h[name.toLowerCase()];
  if (fehlt("content-security-policy")) {
    melde(FEHLER, "Header", h["content-security-policy-report-only"] ? "CSP nur Report-Only" : "CSP fehlt");
  } else {
    const csp = h["content-security-policy"];
    if (!/frame-ancestors/.test(csp) && fehlt("x-frame-options")) melde(FEHLER, "Header", "Schutz gegen Einbetten fehlt");
    if (/script-src[^;]*'unsafe-eval'/.test(csp)) melde(WARNUNG, "Header", "CSP erlaubt unsafe-eval (Dev-Server?)");
  }
  for (const name of ["X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy"]) {
    if (fehlt(name)) melde(FEHLER, "Header", `${name} fehlt`);
  }
  if (fehlt("Strict-Transport-Security"))
    melde(https ? FEHLER : WARNUNG, "Header", "Strict-Transport-Security fehlt" + (https ? "" : " (lokal ohne HTTPS normal)"));
  if (h["x-powered-by"]) melde(FEHLER, "Header", `X-Powered-By verrät "${h["x-powered-by"]}"`);
}

// --- Statische Prüfung im Code (Fehler-Check 2 und 4) ---------------------
async function dateienSammeln(ordner) {
  const liste = [];
  for (const eintrag of await readdir(ordner, { withFileTypes: true }).catch(() => [])) {
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) liste.push(...(await dateienSammeln(pfad)));
    else if ([".tsx", ".ts", ".jsx", ".css"].includes(extname(eintrag.name))) liste.push(pfad);
  }
  return liste;
}

async function codePruefen() {
  const dateien = [...(await dateienSammeln("app")), ...(await dateienSammeln("components"))];
  for (const datei of dateien) {
    const zeilen = (await readFile(datei, "utf8")).split("\n");
    const tokenDatei = /tokens\.css$|globals\.css$/.test(datei);
    zeilen.forEach((zeile, i) => {
      if (zeile.includes("pruefen:erlaubt")) return;
      const ort = `${relative(".", datei)}:${i + 1}`;
      if (!tokenDatei && /#[0-9a-fA-F]{3,8}\b/.test(zeile) && !/^\s*(\/\/|\*|\/\*)/.test(zeile))
        melde(FEHLER, ort, "fester Farbwert statt Token (Fehler-Check 2)");
      if (/style=\{\{[^}]*\d+px/.test(zeile)) melde(FEHLER, ort, "px-Wert im style-Attribut (Fehler-Check 2)");
      if (/!important/.test(zeile)) melde(FEHLER, ort, "!important (Fehler-Check 4)");
      if (/transition:\s*all|transition-all\b/.test(zeile)) melde(FEHLER, ort, "transition: all (bewegung.md)");
    });
  }
}

// --- Ablauf -------------------------------------------------------------
await mkdir(ausgabe, { recursive: true });
await codePruefen();

const browser = await browserStarten();
const fremdeHosts = new Set();
const herkunft = new URL(basis).origin;

for (const seite of seiten) {
  const url = basis + seite;
  const slug = seite === "/" ? "start" : seite.replace(/^\/|\/$/g, "").replace(/\//g, "-");

  for (const ansicht of ansichten) {
    const kontext = await browser.newContext({ ...ansicht, locale: "de-DE" });
    const page = await kontext.newPage();
    const fehlerMeldungen = [];
    // "Failed to load resource" ohne URL überspringen, die URL kommt über "response"
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) fehlerMeldungen.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400) fehlerMeldungen.push(`HTTP ${r.status()} ${r.url().replace(herkunft, "")}`);
    });
    page.on("pageerror", (e) => fehlerMeldungen.push(e.message));
    page.on("request", (r) => {
      const o = new URL(r.url()).origin;
      if (o !== herkunft && !r.url().startsWith("data:") && !r.url().startsWith("blob:")) fremdeHosts.add(o);
    });

    const antwort = await page.goto(url, { waitUntil: "networkidle" });
    if (!antwort || antwort.status() >= 400) {
      melde(FEHLER, `${seite} ${ansicht.name}`, `HTTP ${antwort?.status() ?? "keine Antwort"}`);
      await kontext.close();
      continue;
    }
    if (ansicht.name === "desktop-1440") headerAuswerten(antwort.headers(), url.startsWith("https"));

    await page.screenshot({ path: join(ausgabe, `${slug}-${ansicht.name}-oben.png`) });
    await durchscrollen(page);
    const analyse = await seiteAnalysieren(page);
    auswerten(seite, ansicht.name, analyse);
    if (ansicht.name === "desktop-1440") metaAuswerten(seite, analyse);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(ausgabe, `${slug}-${ansicht.name}-ganz.png`), fullPage: true });

    for (const m of new Set(fehlerMeldungen)) melde(FEHLER, `${seite} ${ansicht.name}`, m.slice(0, 160));
    await kontext.close();
  }

  // Reduced Motion: kein 3D, kein Pinning, kein Lenis, alles sichtbar
  const kontext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await kontext.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await durchscrollen(page);
  const r = await seiteAnalysieren(page);
  const ort = `${seite} reduced-motion`;
  if (r.canvas) melde(FEHLER, ort, "WebGL-Canvas (3D) trotz Reduced Motion");
  if (r.pin) melde(FEHLER, ort, "gepinnte Szene trotz Reduced Motion");
  if (r.lenis) melde(FEHLER, ort, "Lenis trotz Reduced Motion");
  if (r.revealWartet) melde(FEHLER, ort, `${r.revealWartet} Reveal(s) unsichtbar`);
  await kontext.close();
}
await browser.close();

for (const host of fremdeHosts) melde(FEHLER, "Netzwerk", `Anfrage an fremden Host ${host} (ohne Einwilligung)`);

// --- Bericht ------------------------------------------------------------
const anzahl = (s) => funde.filter((f) => f.stufe === s).length;
const bericht = [
  `# Prüfbericht`,
  ``,
  `${new Date().toLocaleString("de-DE")} · ${basis} · Seiten: ${seiten.join(", ")}`,
  ``,
  `**${anzahl(FEHLER)} Fehler, ${anzahl(WARNUNG)} Warnungen**`,
  ``,
  funde.length ? `| Stufe | Ort | Befund |\n|---|---|---|` : "Keine Befunde.",
  ...funde.map((f) => `| ${f.stufe} | ${f.bereich} | ${f.text.replace(/\|/g, "\\|")} |`),
  ``,
  `Screenshots: ${ansichten.map((a) => a.name).join(", ")}, je "oben" und "ganz".`,
  `Nicht automatisch geprüft: Kontrast, Texte, Bildauswahl, Gefühl der Bewegung.`,
].join("\n");

await writeFile(join(ausgabe, "bericht.md"), bericht);
console.log(bericht);
process.exit(anzahl(FEHLER) ? 1 : 0);
