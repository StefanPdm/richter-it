/** Gemeinsame Typen für den Domain-Security-Check (API-Route und Konsole). */

export type Status = "ok" | "warn" | "fehlt" | "info";

export type Pruefung = {
  id: string;
  titel: string;
  status: Status;
  /** gefundener Wert, kurz */
  wert?: string;
  /** ein Satz, was das für die Firma bedeutet (nur bei warn/fehlt) */
  hinweis?: string;
};

export type CheckErgebnis =
  | { ok: true; domain: string; pruefungen: Pruefung[] }
  | { ok: false; fehler: string };

/** Eingabe zu einem Hostnamen machen: ohne Protokoll, Pfad, Port; Umlaute als Punycode.
    Gibt null zurück, wenn es kein öffentlicher Domainname ist (IP-Adressen, localhost ...). */
export function normalisiereDomain(eingabe: string): string | null {
  const roh = eingabe
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "")
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  if (!roh || roh.length > 253) return null;
  let host: string;
  try {
    host = new URL(`https://${roh}`).hostname;
  } catch {
    return null;
  }
  const muster = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/;
  return muster.test(host) ? host : null;
}
