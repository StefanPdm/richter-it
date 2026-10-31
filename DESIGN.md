# Design: Daniel Richter IT

Kurzfassung des Designsystems für die Entwicklung. Werte verbindlich in `app/tokens.css`.

- Entwurf: https://claude.ai/artifact/UU35VK79KxjcVECB8BDXSj
- Briefing: `..\briefing.md`, Analyse mit Quellen: `..\analyse.md`
- Stand: 31.10.2026. Farbwelt: **offen**, Daniel wählt zwischen drei Welten.

## Wirkung

Professionell, ruhig-souverän, technisch-filmisch. Auf keinen Fall: Angstmarketing,
"Retter der Welt". Modus: Erlebnisseite.
Idee: Auf dieser Seite wird Infrastruktur zu Architektur: monumental, ruhig, und die
Messwerte sind die Beweise.

## Farbe: drei Welten zur Auswahl

Kontraste gerechnet mit `kontrast.mjs` (Skill design-startpunkt).

| Rolle | Token | Bernstein | Kobalt | Beton |
|---|---|---|---|---|
| Grund | `bg` | #0c0a08 | #03060d | #ecebe7 |
| Wechselfläche | `bg-alt` | #15120e | #060c18 | #e0ded8 |
| Karten, Kontakt | `surface` | #1c1813 | #0b1628 | #f6f5f2 |
| Text | `text` | #f2ebe0 (16.7:1) | #e6efff (17.5:1) | #141414 (15.4:1) |
| Text leise | `text-muted` | #b3a690 (8.3:1) | #8fa6c8 (8.2:1) | #55534e (6.4:1) |
| Akzent Fläche | `brand` | #f0a24a | #4d94ff | #d9480f (nur groß, 3.6:1) |
| Akzent Text, Knopf | `brand-dark` | #f0a24a (9.4:1) | #4d94ff (6.8:1) | #a8380b (5.4:1) |
| Logo hell / dunkel | `logo-hell/-dunkel` | #ffcf8a / #f0a24a | #41beea / #3a7fd6 | #c8501a / #a8380b |

Kobalt nutzt das Original-Cyan des Logos. Das Original-Dunkelblau #2e59a6 erreicht auf
dem Kobalt-Grund nur 2.99:1 und ist deshalb aufgehellt.

## Schrift

| Rolle | Familie | Einsatz |
|---|---|---|
| Überschriften | Archivo, Breite 72 %, Gewicht 560 | monumental, schmal, hoch |
| Text, Bedienung | IBM Plex Sans 400/500/600 | Fließtext, Knöpfe, Navigation |
| Daten | IBM Plex Mono 400/500 | nur echte Daten: Messwerte, Technik, Orte |

Alle über `next/font`, selbst ausgeliefert. Skala `text-xs` bis `text-display`.

## Form und Raum

Eckig, keine Radien. Schatten nur für den schwebenden Farbwelt-Wähler. Linien in
`border` trennen Bereiche. Container 1400px, Sektionsabstand 72-160px fluid.

## Bewegung

| Element | Verhalten |
|---|---|
| Hero | KI-Video 01 im Loop (bis dahin gezeichnete Megastruktur), Scan-Linie einmal beim Laden |
| Backup-Messung | Signature-Moment: zwei Balken starten gleichzeitig, "Nachher" ist nach 0,2 s fertig, "Vorher" läuft 6,4 s (Verhältnis 32) |
| Sektionen | Reveal einmal beim Scrollen, versetzt |
| Leistungen | Akzentlinie wächst beim Hover |
| Medienband | KI-Video 02 (bis dahin gezeichnete Rack-Reihen) |
| Farbwelt-Wechsel | Farben blenden in 600 ms über |

Bei "weniger Bewegung": alles steht, Videos zeigen nur das Poster.

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
