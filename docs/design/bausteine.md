<!-- Kopie aus Skill design-startpunkt (bausteine.md), Stand 31.10.2026. Nicht hier pflegen, sondern im Skill. -->

# Bausteine

Jeder Baustein nutzt nur Tokens. Klassen im BEM-Stil (`.hero__titel`), in Tailwind
die Token-Utilities. Herkunft in Klammern, falls ein Original nachgeschlagen werden soll.
Fertige React-Komponenten: siehe Abschnitt "In der Next.js-Vorlage" am Ende.

**Kicker (Überzeile über der H1/H2):** optional. In Paket 2 Klassisch-edel Stilmerkmal,
in Paket 1 und 3 nur, wenn er Information trägt (Bereich, Ort). In Paket 4 und 5 nie.
**Icon-Karten und Kachel-Navigation:** nur Paket 1 und App. Sonst gelten sie als Schablone.

## Rahmen

| Baustein | Aufbau | Regeln |
|---|---|---|
| **Topbar** (optional) | Claim links, Telefon + Öffnungszeit/Status + CTA rechts | `text-sm`, `bg-dark`. Mobil ausblenden, Telefon in die mobile CTA-Leiste (Mustang, trafoe) |
| **Header** | Logo, Hauptmenü (max. 6 Punkte), ein CTA-Button | Höhe `--header-h`, klebt oben, schrumpft beim Scrollen, Burger ab < md (Zahnarzt) |
| **Mobile CTA-Leiste** | Anrufen / Anfrage, unten fixiert | nur < sm, Zielflächen ≥ 44px (Mustang) |
| **Footer** | 3-4 Spalten: Kontakt, Leistungen, Unternehmen, Rechtliches | `bg-dark`, `text-on-dark`, Rechtslinks immer sichtbar |
| **Sprunglink + Nach-oben** | "Zum Inhalt" als erstes Element; runder Nach-oben-Knopf | Pflicht |

## Inhalt

| Baustein | Aufbau | Regeln |
|---|---|---|
| **Hero** | Kicker (optional), H1, Lead (1-2 Sätze), 2 Buttons (primär + sekundär), optional 3 Fakten | Bild oder Video mit `priority`/`fetchpriority="high"`, Video nur mit Poster. H1 `text-hero` |
| **Kachel-Navigation** | 4-8 Kacheln mit Icon, Titel, Einzeiler, Link | Raster `auto-fit minmax(220px, 1fr)` (trafoe) |
| **USP-Reihe** | 3 Punkte mit Icon und Satz | direkt unter dem Hero |
| **Seitenkopf** | zweispaltig: links Kicker (optional) + H1, rechts Lead + Button | mobil einspaltig (Zahnarzt) |
| **Bild-Text-Block** | Bild 50 %, Text 50 %, abwechselnd gespiegelt | jeder zweite auf `bg-alt` (Mustang, Zahnarzt) |
| **Leistungskarte** | Icon, Titel, 2 Zeilen Text, Link mit Pfeil | Hover: hebt um 4px, `--shadow-hover` (Zahnarzt) |
| **Fakten / Pills** | 3-6 kurze Fakten als Pill | `radius-pill`, `brand-soft` (Mustang) |
| **Zahlen** | 3-4 Kennzahlen groß mit Unterzeile | nur echte Zahlen, nichts erfinden |
| **Ablauf / Schritte** | 3-5 nummerierte Schritte | nummeriert nur, wenn die Reihenfolge zählt, horizontal ab md |
| **Preise** | 2-3 Karten, mittlere hervorgehoben | Preis mit Stand-Angabe |
| **Stimmen** | 3 Zitate mit Rolle, optional Google-Bewertungen | Profilbilder selbst ausliefern (Zahnarzt) |
| **Logo-Leiste** | Kundenlogos, Graustufen, Hover farbig | SVG, `loading="lazy"` |
| **FAQ** | `<details>`-Liste, 5-8 Fragen | erzeugt `FAQPage`-JSON-LD, nur wenn sichtbar |
| **Formular / Anfrage** | 4-6 Felder, Pflichtfelder markiert, Datenschutzhinweis | Schutz nach qualitaet.md. Live-Schätzung optional (Mustang) |
| **Karte** | Zwei-Klick-Lösung, erst nach Einwilligung laden | OpenStreetMap (Zahnarzt) |
| **CTA-Band** | Satz + ein Button, volle Breite | `brand-dark` oder `bg-dark` |

## Erlebnis-Bausteine (Paket 4 und 5)

Regeln für Bewegung in [bewegung.md](bewegung.md), für 3D in [3d.md](3d.md).

| Baustein | Aufbau | Regeln |
|---|---|---|
| **Signature-Hero** | H1 in `--text-display`, höchstens zwei Zeilen, ein Satz Lead, eine Aktion, großes Medium (mind. halber Bildschirm) | Medium ist LCP: Poster mit `priority`. Bewegung erst nach dem LCP |
| **Zeilen-Reveal** | Überschrift steigt Zeile für Zeile aus einer Maske | `--dur-reveal`, `--stagger`, einmal. Text bleibt echtes HTML |
| **Bild-Öffnung** | Bild öffnet sich per `clip-path` beim Erreichen | `--dur-scene`, `--ease-out`. Ohne JS sofort sichtbar |
| **Gepinnte Szene** | Sektion bleibt stehen, Inhalt wechselt mit dem Scrollen (2-4 Schritte) | GSAP ScrollTrigger, Länge höchstens 3 Bildschirmhöhen, mobil oft als einfache Abfolge |
| **Seitwärts-Galerie** | Bilder laufen beim vertikalen Scrollen seitwärts | GSAP ScrollTrigger, Tastatur und Touch: normale horizontale Liste |
| **Index mit Vorschau** | Liste von Projekten/Produkten, Hover zeigt Bild | nur Zeiger-Geräte, mobil Bild in der Zeile |
| **Medien-Band** | Bild oder Video in voller Breite, Bildunterschrift | Video mit Poster, ohne Ton, Pause-Knopf |
| **3D-Szene / Produkt-Viewer** | Canvas über Poster, Steuerung per Buttons | nach [3d.md](3d.md), höchstens eine pro Seite |

## Buttons

| Variante | Einsatz |
|---|---|
| `--primary` | eine Hauptaktion pro Sektion, Fläche `brand-dark`, Text `text-inverse` |
| `--secondary` | Rahmen `brand`, Text `brand-dark`, Fläche transparent |
| `--inverse` | auf dunklen Flächen |
| `--arrow` | Pfeil rechts, bewegt sich beim Hover 2px |

Mindesthöhe 44px, `radius-sm`, Fokus `--shadow-focus`, Schrift `--font-ui`.

## App-Bausteine (Kundenportal)

| Baustein | Aufbau |
|---|---|
| **Shell** | Sidebar 260px (sticky, ab sm) + Header 64px + scrollender Inhalt, mobil Drawer |
| **Seitenkopf** | Karte mit H1 links, Aktionen rechts |
| **Tabelle** | in Karte, `overflow-x-auto`, Kopf `bg-alt` + `text-xs` Versalien, Zeilen `text-sm` |
| **Modal** | Overlay mit Weichzeichner, Fokusfalle, Escape schließt |
| **Status-Badge** | Pill mit Varianten success / warning / error / info |
| **Toast** | unten rechts, Varianten wie Badge |
| **Leerzustand / Laden** | Icon + Satz + Aktion / zentrierter Spinner in `brand` |

Fehlende Grundbausteine (Input, Select, Tabs) als eigene Komponenten anlegen, nicht inline.

## In der Next.js-Vorlage

Fertig in `vorlage-nextjs/components/`. Neue Bausteine nach demselben Muster anlegen:
Props mit deutschem Namen und JSDoc, nur Token-Klassen, Client-Code nur wo nötig.

| Baustein | Datei | Wichtige Props |
|---|---|---|
| Button | `ui/button.tsx` | `variante` primary/secondary/inverse, `pfeil`, `href` (dann Link) |
| Container | `ui/container.tsx` | `breite` page/wide/measure |
| Sektion | `ui/section.tsx` | `flaeche` light/alt/dark, `titelId`, `id` |
| Bild-Platzhalter | `ui/bild-platzhalter.tsx` | `motiv`, `format` ("16/9") |
| Header | `layout/header.tsx` | liest `lib/site.ts`. Mobiles Menü per Popover-API |
| Footer | `layout/footer.tsx` | liest `lib/site.ts` |
| Reveal | `motion/reveal.tsx` | `as`, `index` (Versatz), `art` aufsteigen/zeilen/bild |
| Zeilen-Reveal | `motion/zeilen-reveal.tsx` | `zeilen` (max. 2), `as` |
| Gepinnte Szene | `motion/gepinnte-szene.tsx` | `kopf`, `schritte` (titel, text, medium) |
| Weiches Scrollen | `motion/weiches-scrollen.tsx` | keine, einmal pro Seite |
| 3D-Szene | `three/szene-laden.tsx` | `poster`, `beschreibung`, `format` |
| JSON-LD | `seo/json-ld.tsx` | `daten` |
