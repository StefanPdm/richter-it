# Design: Daniel Richter IT

Kurzfassung des Designsystems für die Entwicklung. Werte verbindlich in `app/tokens.css`.

- Entwurf: https://claude.ai/artifact/UU35VK79KxjcVECB8BDXSj
- Briefing: `..\briefing.md`, Analyse mit Quellen: `..\analyse.md`
- Stand: 21.11.2026. Farbwelt: **Kobalt mit Bernstein-Akzent** (entschieden 19.11.2026).

## Wirkung

Professionell, ruhig-souverän, technisch-filmisch. Auf keinen Fall: Angstmarketing,
"Retter der Welt". Modus: Erlebnisseite.
Idee: Auf dieser Seite wird Infrastruktur zu Architektur: monumental, ruhig, und die
Messwerte sind die Beweise.

## Farbe: Kobalt mit Bernstein-Akzent

Entscheidung Daniel im Gespräch am 19.11.2026: Kobalt als Grundwelt (Blau steht für IT
und hält das Logo wiedererkennbar), Bernstein als dritte Farbe. Bernstein greift das
warme Licht der Bildwelt auf und ist **nur** für primäre Handlungsaufforderungen da
("Gespräch vereinbaren", Formular absenden). Alles andere Akzentuierte bleibt Blau.
Kontraste gerechnet mit `kontrast.mjs` (Skill design-startpunkt).

| Rolle | Token | Wert |
|---|---|---|
| Grund | `bg` | #03060d |
| Wechselfläche | `bg-alt` | #060c18 |
| Karten, Kontakt | `surface` | #0b1628 |
| Text | `text` | #e6efff (17.5:1) |
| Text leise | `text-muted` | #8fa6c8 (8.2:1) |
| Akzent Fläche | `brand` | #4d94ff |
| Akzent Text, sekundärer Knopf | `brand-dark` | #4d94ff (6.8:1) |
| Primärer Knopf | `cta` / `cta-hover` | #f0a24a / #d98c34, Text `text-inverse` 9.6:1 / 7.5:1 |
| Logo hell / dunkel | `logo-hell/-dunkel` | #41beea / #3a7fd6 |
| Effekte (Glitch, Signal) | `neon` | #ff3bd4, nie Fließtext |

Das Logo nutzt das Original-Cyan. Das Original-Dunkelblau #2e59a6 erreicht auf dem
Grund nur 2.99:1 und ist deshalb aufgehellt.

## Schrift

| Rolle | Familie | Einsatz |
|---|---|---|
| Überschriften | Archivo, Breite 72 %, Gewicht 560 | monumental, schmal, hoch |
| Text, Bedienung | IBM Plex Sans 400/500/600 | Fließtext, Knöpfe, Navigation |
| Daten | IBM Plex Mono 400/500 | nur echte Daten: Messwerte, Technik, Orte |

Alle über `next/font`, selbst ausgeliefert. Skala `text-xs` bis `text-display`.

## Form und Raum

Eckig, keine Radien. Schatten nur für Schwebendes (Nach-oben-Knopf, Konsole). Linien in
`border` trennen Bereiche. Container 1400px, Sektionsabstand 72-160px fluid.

## Bewegung

| Element | Verhalten |
|---|---|
| Hero | KI-Video 01 im Loop (bis dahin gezeichnete Megastruktur), Scan-Linie einmal beim Laden |
| Backup-Messung | Signature-Moment: zwei Balken starten gleichzeitig, "Nachher" ist nach 0,2 s fertig, "Vorher" läuft 6,4 s (Verhältnis 32) |
| Sektionen | Reveal einmal beim Scrollen, versetzt |
| Leistungen | Akzentlinie wächst beim Hover |
| Medienband | KI-Video 02 (bis dahin gezeichnete Rack-Reihen) |

Bei "weniger Bewegung": alles steht, Videos zeigen nur das Poster.

**Ausnahme 502-Sektion** (Entscheidung Stefan, 21.11.2026): Zahnrad nach Daniels Entwurf mit
leichtem Glow, nur dort, in `public/502.html` und auf den Fehlerseiten 404 und 500 (gleiche Familie). Ebenso die Dokument-Karten auf `/zusammenarbeit` beim
Überfahren (leichter Glow von hinten, Wunsch Stefan 21.11.2026). Sonst gilt weiter: keine Glows.

## Bildsprache

Infrastruktur als Architektur, warmes oder kühles Gegenlicht, Dunst, keine Menschen in
KI-Videos. Porträt von Daniel: echtes Foto. Keine Waffen, Cyborgs, Ruinen.

## Seiten

| Seite | Pfad | Seitentyp | Status |
|---|---|---|---|
| Startseite | `/` | Erlebnisseite | gebaut nach Entwurf |
| Impressum | `/impressum` | Rechtliches | Daten aus bestehender Website, USt offen |
| Datenschutz | `/datenschutz` | Rechtliches | Platzhalter |
| Leistungen, Referenzen, Über mich, Kontakt | – | – | als Sektionen der Startseite, eigene Seiten bei Bedarf |

## Offen

Branche und technische Einordnung des Backup-Falls, weitere Referenzen, Porträtfoto,
Logo als Vektor, KI-Videos, Datenschutztext, USt-Angabe, Farbwahl.
