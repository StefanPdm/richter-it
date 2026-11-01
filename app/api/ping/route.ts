import { lookup } from "node:dns/promises";
import { connect } from "node:net";
import { normalisiereDomain } from "@/lib/sicherheitscheck";
import { besucherIp, istPrivat, messort, zuViele } from "@/lib/server-schutz";

/*
 * TCP-Ping für die Konsole: eine Verbindung zu Port 443 aufbauen und die Zeit bis zum Aufbau messen.
 * Klassischer Ping (ICMP) ist in Serverfunktionen nicht möglich. Die Konsole ruft die Route
 * mehrmals nacheinander auf und zeigt jede Antwort sofort, wie beim echten ping.
 * Verbunden wird direkt mit der aufgelösten IP, nachdem sie geprüft wurde (keine internen Ziele).
 */

const ZEITLIMIT = 3000;
const MAX_PRO_MINUTE = 40;

export type PingErgebnis =
  | { ok: true; domain: string; ip: string; ms: number | null; grund?: string; messort: string }
  | { ok: false; fehler: string };

function antwort(daten: PingErgebnis, status = 200) {
  return Response.json(daten, { status, headers: { "Cache-Control": "no-store" } });
}

function messen(ip: string): Promise<{ ms: number | null; grund?: string }> {
  return new Promise((fertig) => {
    const start = performance.now();
    const s = connect({ host: ip, port: 443, timeout: ZEITLIMIT });
    s.once("connect", () => {
      const ms = performance.now() - start;
      s.destroy();
      fertig({ ms: Math.round(ms * 10) / 10 });
    });
    s.once("timeout", () => {
      s.destroy();
      fertig({ ms: null, grund: "Zeitüberschreitung" });
    });
    s.once("error", (e: NodeJS.ErrnoException) => {
      s.destroy();
      fertig({ ms: null, grund: e.code === "ECONNREFUSED" ? "Port 443 geschlossen" : "nicht erreichbar" });
    });
  });
}

export async function GET(request: Request) {
  if (zuViele("ping", besucherIp(request), MAX_PRO_MINUTE)) return antwort({ ok: false, fehler: "Zu viele Pings. Bitte in einer Minute erneut." }, 429);

  const domain = normalisiereDomain(new URL(request.url).searchParams.get("ziel") ?? "");
  if (!domain) return antwort({ ok: false, fehler: "Bitte eine öffentliche Domain angeben, z. B. ping heise.de" }, 400);

  let ip: string;
  try {
    ip = (await lookup(domain)).address;
  } catch {
    return antwort({ ok: false, fehler: `${domain}: Name nicht auflösbar.` }, 404);
  }
  if (istPrivat(ip)) return antwort({ ok: false, fehler: `${domain} zeigt auf eine interne Adresse, kein Ping.` }, 400);

  const m = await messen(ip);
  return antwort({ ok: true, domain, ip, ...m, messort: messort() });
}
