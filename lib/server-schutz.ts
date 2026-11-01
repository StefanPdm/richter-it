/*
 * Schutz für die Konsolen-Routen (check, ping): Begrenzung pro Besucher und Sperre für interne Ziele.
 * Nur auf dem Server verwenden. Die Begrenzung gilt pro Server-Instanz, also nur grob.
 */

const zugriffe = new Map<string, number[]>();

/** IP des Besuchers aus den Headern (Netlify, sonst Proxy) */
export function besucherIp(request: Request) {
  return request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "lokal";
}

/** true, wenn ein Besucher mehr als max Anfragen pro Minute an diesen Bereich stellt */
export function zuViele(bereich: string, ip: string, max: number) {
  const schluessel = `${bereich}:${ip}`;
  const jetzt = Date.now();
  /* Abgelaufene Einträge aller Besucher verwerfen: keine IP bleibt länger als eine Minute
     (so steht es in der Datenschutzerklärung) */
  for (const [k, zeiten] of zugriffe) {
    if (jetzt - zeiten[zeiten.length - 1] >= 60_000) zugriffe.delete(k);
  }
  const liste = (zugriffe.get(schluessel) ?? []).filter((t) => jetzt - t < 60_000);
  liste.push(jetzt);
  zugriffe.set(schluessel, liste);
  if (zugriffe.size > 5000) zugriffe.clear();
  return liste.length > max;
}

/** Private oder lokale Adressen: dorthin wird nicht verbunden */
export function istPrivat(ip: string) {
  const v4 = ip.match(/^(\d+)\.(\d+)\.\d+\.\d+$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  return v6 === "::1" || v6 === "::" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe8") || v6.startsWith("::ffff:");
}

/** Wo die Serverfunktion läuft. Netlify-Funktionen laufen auf AWS Lambda und setzen AWS_REGION. */
export function messort() {
  const region = process.env.AWS_REGION;
  const namen: Record<string, string> = {
    "us-east-1": "USA (Virginia)",
    "us-east-2": "USA (Ohio)",
    "us-west-2": "USA (Oregon)",
    "eu-central-1": "Frankfurt",
    "eu-west-1": "Irland",
    "eu-west-2": "London",
    "ap-southeast-1": "Singapur",
    "ap-northeast-1": "Tokio",
  };
  if (!region) return "lokaler Server";
  return namen[region] ?? region;
}
