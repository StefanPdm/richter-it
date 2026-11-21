/** Anzahl der Schritte im Backup-Ablauf (Szene und Text) */
export const SCHRITTE = 5;

/**
 * Fortschritt 0..1 durch die Schrittliste. Bezugslinie ist die Stelle, an der man liest:
 * breit die Mitte des freien Bereichs unter dem klebenden Kopf, auf dem Handy unterhalb der Szene.
 */
export function fortschrittVon(el: Element) {
  const r = el.getBoundingClientRect();
  const breit = window.matchMedia("(min-width: 56rem)").matches;
  let linie = window.innerHeight * 0.7;
  if (breit) {
    /* Unter Header und klebendem Kopf der Sektion: Mitte des freien Bereichs */
    const sektion = el.closest<HTMLElement>(".ablauf");
    const kopf = sektion ? parseFloat(sektion.style.getPropertyValue("--kopf-h")) || 0 : 0;
    const header = document.querySelector("header")?.offsetHeight ?? 0;
    linie = (header + kopf + window.innerHeight) / 2;
  }
  return Math.min(0.9999, Math.max(0, (linie - r.top) / r.height));
}
