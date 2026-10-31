<!-- Kopie aus Skill design-startpunkt (seitentypen.md), Stand 31.10.2026. Nicht hier pflegen, sondern im Skill. -->

# Seitentypen

Feste Abfolgen. Sektionen dürfen wegfallen, die Reihenfolge bleibt.
Jede Seite: eine H1, danach H2 je Sektion, H3 in Karten. Keine Überschriften
für Datumszeilen oder Firmennamen missbrauchen.

## Startseite (Unternehmen)

1. Header (optional Topbar)
2. Hero: Kicker (optional), H1 mit Kernversprechen, Lead, 2 Buttons, 3 Fakten
3. Kachel-Navigation oder USP-Reihe
4. Leistungen: 3-6 Leistungskarten oder Bild-Text-Blöcke
5. Vertrauen: Zahlen, Logo-Leiste, Zertifikate
6. Stimmen
7. Ablauf: so arbeiten wir zusammen
8. Über uns kurz (Bild + 3 Sätze + Link)
9. FAQ
10. CTA-Band
11. Footer

## Leistungsseite

1. Header
2. Seitenkopf: Kicker = Bereich (optional), H1 = Leistung, Lead, Button
3. Problem / Ausgangslage (Bild-Text)
4. Lösung / Vorgehen (Bild-Text, gespiegelt)
5. Ablauf in Schritten
6. Fakten oder Preise
7. FAQ zur Leistung
8. CTA-Band
9. Footer

JSON-LD: `Service` + `BreadcrumbList` (+ `FAQPage`).

## Landingpage (Kampagne, Anlass)

1. Header reduziert (Logo + ein CTA)
2. Bild-Hero
3. Intro: Kicker (optional), H1, Lead, Fakten-Pills, 2 Buttons
4. 2-4 Bild-Text-Blöcke zum Nutzen
5. Preise
6. Anfrage-Formular
7. Stimmen
8. Weitere Angebote
9. CTA-Band
10. Footer

Vorbild: Mustang `includes/landing.php`.

## Erlebnisseite (Stilrichtung 5, Launch, Showcase)

Weniger Sektionen, jede mit eigener Komposition. Vor dem Bau die Idee als Satz
festhalten (siehe stilrichtungen.md, Paket 5).

1. Header reduziert: Wortmarke, 3-5 Links, eine Aktion
2. Signature-Hero
3. Aussage: ein Absatz in großer Schrift, höchstens 25 Wörter
4. Gepinnte Szene oder 3D-Szene: die Idee in 2-4 Schritten
5. Medien-Band
6. Belege: Projekte als Index mit Vorschau oder Seitwärts-Galerie
7. Stimme: ein Zitat, groß, mit Rolle
8. Abschluss auf umgefärbter Fläche: Satz + eine Aktion
9. Footer

Bewegungsbudget "Erlebnisseite" aus bewegung.md. Höchstens 3 Szenen auf der ganzen Seite.

## Kontakt

1. Header
2. Seitenkopf mit Telefon, E-Mail, Öffnungszeiten direkt sichtbar
3. Formular links, Kontaktdaten + Status (geöffnet/geschlossen) rechts
4. Karte (Zwei-Klick)
5. Anfahrt / Parken
6. Footer

JSON-LD: `LocalBusiness` mit Adresse und Öffnungszeiten.

## Hub (zwei Standbeine)

Für Stefans eigene Seite: Webentwicklung und Coaching gleichwertig.

1. Header
2. Hero mit Person und Satz, der beide Welten verbindet
3. Wahl: zwei gleich große Kacheln, je eigene Farbwelt
4. Kontakt
5. Footer

Jede Welt hat dann eigene Startseite nach obigem Muster.

## App-Bereich

1. Shell (Sidebar + Header)
2. Seitenkopf mit Aktionen
3. Filter / Suche
4. Tabelle oder Kartenliste
5. Detail als Seite oder Modal

## Rechtliches, 404

Impressum, Datenschutz: einspaltig, `--measure`, keine Deko.
404: H1, ein Satz, Links zu Startseite und den 3 wichtigsten Seiten.
