<!-- Kopie aus Skill design-startpunkt (qualitaet.md), Stand 31.10.2026. Nicht hier pflegen, sondern im Skill. -->

# Qualität: Ladezeit, SEO, Security

Jeder Entwurf wird gegen diese Liste geprüft. Ergebnis an Stefan: erfüllt / offen.
Die beste vorhandene Lösung steht in Klammern.

## Ladezeit

Ziel: LCP < 2.5 s, CLS < 0.1, INP < 200 ms (mobil).

- [ ] Schriften selbst gehostet als woff2, nur genutzte Gewichte, `font-display: swap`,
      nur die Hauptschrift vorladen (Mustang, Zahnarzt). Kein externes Google Fonts.
- [ ] Bilder AVIF/WebP mit `width`/`height`, LCP-Bild mit Priorität, Rest lazy
      (Zahnarzt: Maße per Prebuild, Mustang: `picture()` mit 800w-Variante).
- [ ] Video nur mit Poster, mehrere Breiten, nicht automatisch im Hero, wenn vermeidbar.
- [ ] JavaScript nur dort laden, wo es gebraucht wird (Mustang `features`, Next `dynamic`).
      Keine doppelten Bibliotheken (trafoe: Magnific Popup 3x).
- [ ] WordPress: Anzahl Skripte und Stylesheets prüfen, Ziel < 20/15. Plugins nur pro
      Seite laden (Asset-Manager), Caching-Plugin vorhanden.
- [ ] Keine Layout-Sprünge durch Schriften, Banner, nachgeladene Bilder.
- [ ] GSAP, Lenis und 3D nur per `next/dynamic` bzw. dynamischem Import, nie im
      Bundle der Startseite, nie vor dem LCP. Poster unter jeder 3D-Szene.

## SEO

- [ ] Genau eine H1, saubere Hierarchie.
- [ ] Title ≤ 60 Zeichen, Meta-Description ≤ 155, je Seite eigen, Rechtschreibung geprüft.
- [ ] Canonical, OpenGraph, Twitter-Card (Zahnarzt `seitenMetadaten()`).
- [ ] `html lang` passend zur Sprache, bei Mehrsprachigkeit `hreflang`.
- [ ] JSON-LD je Seitentyp, siehe seitentypen.md. `FAQPage` nur auf Seiten mit sichtbarer FAQ.
      Lokale Firmen immer `LocalBusiness`.
- [ ] `sitemap.xml` mit echtem lastmod, `robots.txt`, `llms.txt` (eigene Homepage, Mustang).
- [ ] 301 von alten URLs, eine Schreibweise (https, mit/ohne www) erzwungen.
- [ ] Bilder mit sprechendem Alt-Text und Dateinamen.

## Security

- [ ] Header (Zahnarzt `next.config.ts` als Vorlage):
      `Content-Security-Policy` (scharf, nicht nur Report-Only),
      `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
      `X-Frame-Options: DENY` bzw. `frame-ancestors 'none'`,
      `X-Content-Type-Options: nosniff`,
      `Referrer-Policy: strict-origin-when-cross-origin`,
      `Permissions-Policy` (Kamera, Mikrofon, Geo aus),
      `Cross-Origin-Opener-Policy: same-origin`, `poweredByHeader: false`.
- [ ] Keine Zugangsdaten im Code. SMTP, API-Keys, Secrets nur in Umgebungsvariablen
      oder einer Konfigurationsdatei außerhalb des Web-Roots, nie in Git.
- [ ] Formulare: Server-Validierung (zod), Honeypot, Mindest-Ausfüllzeit, Rate-Limit,
      Origin-Prüfung, optional reCAPTCHA v3 mit Score + Hostname (Mustang, Zahnarzt).
- [ ] Tracking, Karten, Videos Dritter erst nach Einwilligung.
- [ ] WordPress: Plugins aktuell, ungenutzte entfernt, Login geschützt, XML-RPC aus.

## Barrierefreiheit

- [ ] Kontrast Text 4.5:1, große Schrift 3:1 (Gold-Akzent nur für Linien).
- [ ] Sprunglink, sichtbarer Fokus (`:focus-visible`), Zielflächen ≥ 44px.
- [ ] `prefers-reduced-motion` beachtet.

## Bewegung und 3D

- [ ] Budget des Modus eingehalten (bewegung.md, Abschnitt 2).
- [ ] Nur Token-Kurven und -Dauern, kein `transition: all`, kein `ease-in` in UI.
- [ ] Inhalt ohne JavaScript und mit Reduced Motion vollständig sichtbar.
- [ ] 3D: Poster als LCP, Pause außerhalb des Viewports, keine fremden Hosts
      (Draco, HDR selbst gehostet), CSP `worker-src 'self' blob:` (3d.md).

## Schablonen vermeiden (typische KI-Muster)

Vor Abgabe aktiv suchen. Ausnahmen nur, wenn die Stilrichtung sie ausdrücklich erlaubt.

- [ ] Kein Verlaufstext, keine Lila-Blau-Verläufe, keine farbigen Glows.
- [ ] Kein Glas als Deko (`backdrop-filter` nur bei Menüs über Inhalt).
- [ ] Keine Karten in Karten. Kartenradius höchstens `--radius-lg`.
- [ ] Keine Icon-über-Überschrift-Karten als Seitengerüst (Ausnahme Paket 1, App).
- [ ] Kein Kicker über jeder H2, keine Nummerierung 01/02/03 ohne Bedeutung.
- [ ] Kein farbiger Rand links oder rechts über 1px, keine harten Versatz-Schatten.
- [ ] Keine erfundenen Kennzahlen, Sparklines oder grauen Balken als Platzhalter-Inhalt.
- [ ] Kein Emoji oder Unicode-Zeichen als Icon. Icons aus einem Satz, eine Strichstärke.
- [ ] Monospace nur für Code und Tabellenwerte.
- [ ] Grauer Text nicht auf farbiger Fläche: dort aus dem Farbton abgeleitet.
- [ ] Mehr Abstand über einer Überschrift als darunter.

Automatisch prüfbar mit impeccable `detect` gegen die laufende Seite. Viele Punkte
dieser Datei prüft außerdem `npm run pruefen` in der Vorlage (siehe werkzeuge.md).

Quellen der Schablonen-Liste: github.com/pbakaus/impeccable (Apache-2.0,
`reference/craft-floor.md`) und github.com/Leonxlnx/taste-skill (MIT, `SKILL.md`),
gelesen am 31.10.2026.

## Fehler-Check: die vier wiederkehrenden Fehler

Vor Abgabe aktiv suchen. Diese Fehler stecken in fast allen Altprojekten.

1. **Schrift geladen, aber nicht angewendet.** Prüfen: `body` und Überschriften nutzen
   die Token-Variable, bei next/font wird `.variable` gesetzt und im Token verwendet.
   Im Browser prüfen: berechnete `font-family` zeigt die Hausschrift.
2. **Tokens definiert, Werte trotzdem fest.** Suche nach `#` in TSX/HTML, nach
   `style={{` mit px-Werten, nach Größen außerhalb der Skala.
3. **CSP fehlt oder ist nur Report-Only.**
4. **`!important` als Reparatur.** Ziel: 0 im neuen Code.
