/** Anzahl der Schritte im Backup-Ablauf (Szene und Text) */
export const SCHRITTE = 5;

/**
 * Fortschritt 0..1 durch die Schrittliste. Bezugslinie ist die Stelle, an der man liest:
 * breit die Bildmitte, auf dem Handy unterhalb der klebenden Szene.
 */
export function fortschrittVon(el: Element) {
  const r = el.getBoundingClientRect();
  const breit = window.matchMedia("(min-width: 56rem)").matches;
  const linie = window.innerHeight * (breit ? 0.5 : 0.7);
  return Math.min(0.9999, Math.max(0, (linie - r.top) / r.height));
}
