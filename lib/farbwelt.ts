/*
  Farbwelten zur Auswahl durch Daniel. Werte in app/tokens.css.
  Nach der Entscheidung: NEXT_PUBLIC_FARBWELT auf die gewählte Welt setzen,
  NEXT_PUBLIC_FARBWELT_WAEHLER=aus (auch auf dem Hosting setzen), später die übrigen
  Welten aus tokens.css löschen.
*/
export const FARBWELTEN = [
  // Farbmuster zeigen die jeweilige Welt, unabhängig von der aktiven, daher feste Werte
  { id: "bernstein", name: "Bernstein", satz: "Warmes Gegenlicht aus dem Video", muster: ["#0c0a08", "#f0a24a"] }, // pruefen:erlaubt
  { id: "kobalt", name: "Kobalt", satz: "Kühles Blau aus dem First Draft", muster: ["#03060d", "#4d94ff"] }, // pruefen:erlaubt
  { id: "beton", name: "Beton", satz: "Hell und sachlich, Signalorange", muster: ["#ecebe7", "#a8380b"] }, // pruefen:erlaubt
] as const;

export type FarbweltId = (typeof FARBWELTEN)[number]["id"];

const IDS = FARBWELTEN.map((w) => w.id) as string[];

export function istFarbwelt(wert: unknown): wert is FarbweltId {
  return typeof wert === "string" && IDS.includes(wert);
}

export const STANDARD_WELT: FarbweltId = istFarbwelt(process.env.NEXT_PUBLIC_FARBWELT)
  ? process.env.NEXT_PUBLIC_FARBWELT
  : "bernstein";

/** Wähler sichtbar, solange Daniel nicht entschieden hat.
    Standard: an. Abschalten nur ausdrücklich mit NEXT_PUBLIC_FARBWELT_WAEHLER=aus
    (.env steht nicht in Git, auf dem Hosting fehlte die Variable sonst). */
export const WAEHLER_AKTIV = process.env.NEXT_PUBLIC_FARBWELT_WAEHLER !== "aus";

export const SPEICHER_SCHLUESSEL = "richter-farbwelt";

/** Setzt die gemerkte Welt vor dem ersten Zeichnen (kein Aufblitzen). */
export const FRUEH_SKRIPT = `(function(){try{var w=${JSON.stringify(IDS)};var h=location.hash.slice(1);var s=w.indexOf(h)>=0?h:localStorage.getItem(${JSON.stringify(SPEICHER_SCHLUESSEL)});if(w.indexOf(s)>=0)document.documentElement.setAttribute("data-welt",s)}catch(e){}})();`;

/** Ereignis für Komponenten, die Farben selbst zeichnen (Canvas). */
export const FARBWELT_EREIGNIS = "farbwelt-geaendert";

/** Farbwelt setzen, merken und melden (für Wähler-ähnliche Bedienung, z. B. die Konsole). */
export function setzeFarbwelt(id: FarbweltId) {
  document.documentElement.setAttribute("data-welt", id);
  try {
    localStorage.setItem(SPEICHER_SCHLUESSEL, id);
  } catch {
    /* Speicher gesperrt: Wahl gilt nur für diese Ansicht */
  }
  window.dispatchEvent(new CustomEvent(FARBWELT_EREIGNIS, { detail: id }));
}
