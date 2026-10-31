/*
  Verbindung zwischen den Aufrufen auf der Seite und dem Kontaktformular:
  Ein Knopf meldet sein Thema, das Formular belegt Anliegen und Betreff vor.
*/
export const THEMA_EREIGNIS = "kontakt-thema";

export const ANLIEGEN = ["Erstgespräch", "Angebot", "Audit", "Backup-Check"] as const;
export type Anliegen = (typeof ANLIEGEN)[number];

export type Thema = { anliegen: Anliegen; betreff?: string };

export function meldeThema(thema: Thema) {
  window.dispatchEvent(new CustomEvent<Thema>(THEMA_EREIGNIS, { detail: thema }));
}

/**
 * Klick auf einen Aufruf: Thema melden und selbst zum Formular scrollen.
 * Nötig, weil ein Link auf "#kontakt" nicht mehr springt, wenn die Adresse
 * schon "#kontakt" enthält. Ohne JavaScript greift der normale Link.
 */
export function zumFormular(e: { preventDefault: () => void }, thema: Thema) {
  const ziel = document.getElementById("kontakt");
  if (!ziel) return;
  e.preventDefault();
  meldeThema(thema);
  const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  ziel.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
  try {
    history.replaceState(null, "", "#kontakt");
  } catch {
    /* Adresse bleibt, Sprung hat trotzdem stattgefunden */
  }
}
