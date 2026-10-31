<!-- Kopie aus Skill design-startpunkt (bewegung.md), Stand 31.10.2026. Nicht hier pflegen, sondern im Skill. -->

# Bewegung

Bewegung ist Teil des Entwurfs, kein Nachtrag. Sie wird am Ende des Baus als eigene
Schicht hinzugefügt, wenn Layout und Inhalt stehen. Werte nur aus den Tokens
(`--ease-*`, `--dur-*`, `--stagger`, `--rise`), nie frei erfunden.

## 1. Soll es sich bewegen?

Erst den Zweck nennen: **Rückmeldung**, **räumlicher Zusammenhang** (woher kommt das,
wohin geht es), **Zustand**, **Erklärung**, **Freude**. Ohne Zweck keine Animation.

| Wie oft sieht man es? | Entscheidung |
|---|---|
| 100+ mal am Tag (Tastenkürzel, Befehlspalette) | keine Animation |
| mehrmals täglich (Menü, Tabs, Filter) | kurz und leise oder gar nicht |
| gelegentlich (Dialog, Drawer, Toast) | Standard aus der Tabelle unten |
| selten, erster Eindruck (Hero, Scroll-Szene) | darf inszeniert sein |

## 2. Budget je Seitentyp

| Modus | Erlaubt |
|---|---|
| **Unternehmensseite** (Stilrichtungen 1-3) | Rückmeldung an Bedienelementen, Sektions-Reveal optional, höchstens ein ruhiger Signature-Moment im Hero |
| **Erlebnisseite** (Stilrichtung 5 Experience, teils 4) | 2-3 Scroll-Szenen, **ein** Signature-Moment, Sektions-Reveals, Rückmeldung, ein bewegtes Bild (Video oder 3D) |
| **App** | nur Rückmeldung und Zustandswechsel. Keine Reveals, keine Scroll-Effekte |

Nie: dieselbe Einblendung von unten auf jedem Block. Jede Sektion bewegt sich anders
oder gar nicht.

## 3. Werkzeug wählen, von leicht nach schwer

| Stufe | Werkzeug | Wofür |
|---|---|---|
| 1 | **CSS** Transitions, `@starting-style`, Scroll-Driven Animations (`animation-timeline: view()`) | Hover, Press, Einblenden beim Mounten, einfache Scroll-Reveals. Scroll-Driven mit `@supports (animation-timeline: view())` absichern |
| 2 | **Motion** (`motion/react`) | React-Zustände, `AnimatePresence` beim Entfernen, Layout-Animationen, Gesten, Federn |
| 3 | **GSAP + ScrollTrigger** (`@gsap/react`, `useGSAP`) | gepinnte Scroll-Szenen, Timelines mit vielen Schritten, Text-Zeilen-Reveals |
| 4 | **Lenis** | weiches Scrollen, nur Erlebnisseite. Bei Touch und `prefers-reduced-motion` aus |
| 5 | **React Three Fiber** | 3D, siehe [3d.md](3d.md) |

Regel: die niedrigste Stufe nehmen, die reicht. Motion und GSAP nicht für dieselbe
Aufgabe mischen. Alles ab Stufe 2 ist Client-Code und wird nur dort geladen, wo es
gebraucht wird.

Seitenübergänge: View Transitions API. Die Unterstützung im eingesetzten Next.js-Stand
vor dem Einsatz prüfen, nicht voraussetzen.

## 4. Kurven

| Situation | Token |
|---|---|
| Erscheinen, Verschwinden, Reveal (Standard) | `--ease-out` |
| Element bewegt sich auf dem Bildschirm von A nach B | `--ease-in-out` |
| Drawer, Sheet, Bottom-Panel | `--ease-drawer` |
| Hover, Farbwechsel | `ease` (CSS-Standard) |
| an den Scrollbalken gekoppelt, Endlosbewegung | `linear` |

Nie `ease-in` für UI, nie Überschwingen (`back`, `elastic`, `bounce`) bei Inhalten.
Federn (Motion) nur bei Gesten und Drag: `{ type: "spring", duration: 0.5, bounce: 0.2 }`,
`bounce` zwischen 0.1 und 0.3.

## 5. Dauern

| Was | Token | Wert |
|---|---|---|
| Button gedrückt | `--dur-press` | 160 ms, `scale(var(--press-scale))` |
| Hover, Tooltip, Farbe | `--dur-fast` | 200 ms |
| Dropdown, Menü | `--dur-base` | 250 ms |
| Dialog, Drawer | `--dur-modal` | 300 ms |
| Sektion erscheint | `--dur-reveal` | 800 ms |
| Bild-Öffnung, Wipe, Ladesequenz | `--dur-scene` | 1200 ms |

UI bleibt unter 300 ms. Verlassen etwa 70 % der Dauer des Erscheinens.

## 6. Regeln für jede Animation

- Nur `transform` und `opacity` animieren. Erlaubt mit Vorsicht: `clip-path`, `filter: blur()`
  bis 8px. Nie `width`, `height`, `top`, `left`, `margin`, `padding` (Ausnahme: Akkordeon-Höhe).
- Nie `transition: all`. Eigenschaften einzeln nennen.
- Schnell wiederholte Auslöser (Hover, Toggle, Toast) mit Transitions, nicht mit Keyframes.
  Transitions lassen sich unterbrechen, Keyframes starten von vorn.
- Erscheinen nie aus `scale(0)`. Start bei `scale(0.95)` + `opacity: 0`.
- Popover und Tooltip wachsen vom Auslöser aus (`transform-origin`), Dialoge aus der Mitte.
- Gruppen versetzt: `--stagger` (70 ms), Weg `--rise` (24px), nur einmal auslösen.
- Reveal startet, wenn die Oberkante 80-90 % des Viewports erreicht. Inhalt ist ohne
  JavaScript sichtbar: Startzustand erst setzen, wenn das Skript läuft.
- Parallax unter 8 % der Elementhöhe. Scroll-gekoppelte Bewegung linear.
- Hover nur in `@media (hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion`: Endzustand bleibt, Wege fallen weg, kurze Überblendung bleibt.
  Die Tokens erledigen das, wenn sie verwendet werden. GSAP-Szenen und 3D zusätzlich
  per `gsap.matchMedia()` bzw. `useReducedMotion()` abschalten.

## 7. Verboten

Preloader und Zähler vor dem Inhalt, Scroll-Hijacking, eigene Mauszeiger,
Schreibmaschinen- oder Zerhacker-Text, Endlosschleifen ohne Stopp, Hover-Zoom auf jeder
Karte, versetzt einfliegende Hero-Elemente, die den LCP verzögern, Reveals, die nie
auslösen, Animation auf Tastaturaktionen.

## 8. Prüfen

- DevTools > Animations: auf 10 % verlangsamen, Bild für Bild ansehen.
- DevTools > Rendering: `prefers-reduced-motion: reduce` emulieren, alles muss lesbar sein.
- Performance-Aufzeichnung mit 4x CPU-Drosselung: keine roten Frames in Scroll-Szenen.
- Bei Bedarf Skill `review-animations` bzw. `animation-performance` (Emil Kowalski).

## Quellen

Werte zusammengeführt am 31.10.2026 aus github.com/emilkowalski/skills (MIT,
`emil-design-eng`, `animate`) für Kurven, UI-Dauern, Federn und Verbotsliste, und
github.com/Leonxlnx/taste-skill (MIT, `references/motion.md`) für Budget, Reveal-Dauern,
Stagger und Scroll-Regeln. Bei Abweichungen gelten Emils Kurven.
