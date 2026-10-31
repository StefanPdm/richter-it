# CLAUDE.md: Website Daniel Richter IT

Relaunch von daniel-richter.it, gebaut mit Next.js 16, TypeScript und Tailwind 4 aus der
Vorlage des Skills `design-startpunkt`. Projektstart: 31.10.2026.
Projektunterlagen eine Ebene höher: `..\briefing.md`, `..\analyse.md`, `..\video-briefing.md`.

## Sprache

Deutsch, Anrede du, knapp und direkt, keine Emojis. Code-Kommentare auf Deutsch.
Texte auf der Website: Anrede Sie, Daniel spricht in Ich-Form.

## Präsentationsversion (Stand 31.10.2026)

Die Seite ist zurzeit eine **Pitch-Version**, um Daniel zu überzeugen. Kennzahlen,
Referenzen, Kundenstimmen, Monitorwerte und Terminal-Ausgabe sind **erfunden** und in
`lib/inhalte.ts` mit `BEISPIEL` markiert (`PRAESENTATION = true`). Vor jedem Livegang:
durch freigegebene Angaben ersetzen oder löschen. Nie ungeprüft veröffentlichen.

## Design

- Kurzfassung und alle Werte in `DESIGN.md`.
- Entwurf, auf dem die Seite beruht: https://claude.ai/artifact/UU35VK79KxjcVECB8BDXSj
  (claude.ai-Artifact, mit dem Artifact-Werkzeug lesen, nicht per Web-Abruf).
- **Farbwelt ist noch nicht entschieden.** Drei Welten (Bernstein, Kobalt, Beton) liegen in
  `app/tokens.css`. Neue Komponenten müssen in allen drei funktionieren: nur Token-Klassen.
  Umschalter: `components/farbwelt/`, gesteuert über `.env`.
- Neue Seiten folgen `docs/design/seitentypen.md` und `docs/design/bausteine.md`.
  Fehlt ein Screen: Aufbau vorschlagen und Stefan zeigen, bevor gebaut wird.
- Stil: Paket 4 und 5 (Tech-dunkel, Experience). Keine Kicker über Überschriften,
  keine Icon-Karten, kein Glas, keine Glows. HUD-Schrift (`.daten`) nur für echte Daten.

## Regeln im Code

- `app/tokens.css` ist die einzige Quelle für Farben, Schrift, Größen, Form und
  Bewegung. Keine Hex-Werte, keine px-Werte in TSX. Fehlt ein Token: Stefan fragen.
- Inhalte stehen in `lib/inhalte.ts` und `lib/site.ts`, nicht im Markup verstreut.
  Offene Inhalte beginnen mit `[` und werden automatisch markiert.
- Komponenten aus `components/` wiederverwenden. Neue Bausteine: Props mit deutschem
  Namen und JSDoc, Client-Code nur wo nötig.
- Bewegung nach `docs/design/bewegung.md`. Modus dieses Projekts: Erlebnisseite.
- Videos: `components/medien/ki-video.tsx`, Vorgaben in `..\video-briefing.md`.
- Logo: `public/logo/logo-maske.png` ist eine Übergangslösung aus Daniels PNG.
  Sobald die Vektordatei da ist, ersetzen.
- Kein `!important`, kein `transition: all`.

## Prüfen vor jeder Abgabe

```
npm run build
npm start
npm run pruefen -- --url http://localhost:3000 --seiten impressum,datenschutz
```

0 Fehler sind Pflicht. Dazu `docs/design/qualitaet.md` für das, was kein Skript prüft.

## Nicht ohne Rückfrage

- Dateien löschen, Abhängigkeiten hinzufügen oder entfernen
- Tokens oder Komponenten umbauen, die schon verwendet werden
- Pushen, deployen
