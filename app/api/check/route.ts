import { connect } from "node:tls";
import { normalisiereDomain, type CheckErgebnis, type Pruefung } from "@/lib/sicherheitscheck";
import { besucherIp, istPrivat, zuViele } from "@/lib/server-schutz";

/*
 * Domain-Security-Check für die Konsole: DNS, Mail-Schutz, HTTPS, Zertifikat, Security-Header.
 * DNS über DNS-over-HTTPS (Cloudflare), damit auch DNSSEC sichtbar ist. Die Anfrage geht vom
 * Server aus, die IP des Besuchers erreicht Cloudflare nicht. Es wird nichts gespeichert.
 * Schutz vor Missbrauch: nur öffentliche Domains, keine privaten Ziel-IPs, Zeitlimits,
 * einfache Begrenzung pro IP (pro Server-Instanz, also nur grob).
 */

const ZEITLIMIT = 5000;
const MAX_PRO_MINUTE = 8;

function antwort(daten: CheckErgebnis, status = 200) {
  return Response.json(daten, { status, headers: { "Cache-Control": "no-store" } });
}

/* ---- DNS über HTTPS ---- */

type DnsAntwort = { Status: number; AD?: boolean; Answer?: { type: number; data: string }[] };

async function dns(name: string, typ: string): Promise<DnsAntwort | null> {
  try {
    const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${typ}`, {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(ZEITLIMIT),
      cache: "no-store",
    });
    return r.ok ? ((await r.json()) as DnsAntwort) : null;
  } catch {
    return null;
  }
}

const TYP = { A: 1, CNAME: 5, MX: 15, TXT: 16, AAAA: 28, CAA: 257 } as const;

function werte(a: DnsAntwort | null, typ: number) {
  return (a?.Answer ?? []).filter((x) => x.type === typ).map((x) => x.data.replace(/^"|"$/g, "").replace(/"\s*"/g, ""));
}

/* ---- Zertifikat ---- */

function zertifikat(host: string): Promise<{ gueltig: boolean; bis?: Date; protokoll?: string; fehler?: string }> {
  return new Promise((fertig) => {
    const s = connect({ host, port: 443, servername: host, timeout: ZEITLIMIT, rejectUnauthorized: false }, () => {
      const c = s.getPeerCertificate();
      fertig({
        gueltig: s.authorized,
        bis: c?.valid_to ? new Date(c.valid_to) : undefined,
        protokoll: s.getProtocol() ?? undefined,
        fehler: s.authorized ? undefined : String(s.authorizationError ?? ""),
      });
      s.end();
    });
    s.on("timeout", () => {
      s.destroy();
      fertig({ gueltig: false, fehler: "Zeitüberschreitung" });
    });
    s.on("error", (e) => fertig({ gueltig: false, fehler: e.message }));
  });
}

async function abrufen(url: string, folgen: boolean) {
  try {
    return await fetch(url, {
      redirect: folgen ? "follow" : "manual",
      signal: AbortSignal.timeout(ZEITLIMIT),
      headers: { "user-agent": "daniel-richter.it Security-Check" },
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

/* ---- Prüfung ---- */

export async function GET(request: Request) {
  if (zuViele("check", besucherIp(request), MAX_PRO_MINUTE)) return antwort({ ok: false, fehler: "Zu viele Prüfungen. Bitte in einer Minute erneut." }, 429);

  const domain = normalisiereDomain(new URL(request.url).searchParams.get("domain") ?? "");
  if (!domain) return antwort({ ok: false, fehler: "Bitte eine öffentliche Domain angeben, z. B. check beispiel.de" }, 400);

  const [a, aaaa, mx, txt, dmarc, caa] = await Promise.all([
    dns(domain, "A"),
    dns(domain, "AAAA"),
    dns(domain, "MX"),
    dns(domain, "TXT"),
    dns(`_dmarc.${domain}`, "TXT"),
    dns(domain, "CAA"),
  ]);
  if (!a) return antwort({ ok: false, fehler: "DNS-Abfrage nicht möglich. Bitte später erneut." }, 502);
  if (a.Status === 3) return antwort({ ok: false, fehler: `${domain} existiert nicht (NXDOMAIN).` }, 404);

  const ips = [...werte(a, TYP.A), ...werte(aaaa, TYP.AAAA)];
  const p: Pruefung[] = [];

  p.push(
    ips.length
      ? { id: "dns", titel: "Erreichbar im DNS", status: "info", wert: ips.slice(0, 3).join(", ") + (ips.length > 3 ? " …" : "") }
      : { id: "dns", titel: "Erreichbar im DNS", status: "info", wert: "keine Web-Adresse hinterlegt" },
  );

  p.push(
    a.AD
      ? { id: "dnssec", titel: "DNSSEC", status: "ok", wert: "signiert" }
      : {
          id: "dnssec",
          titel: "DNSSEC",
          status: "warn",
          wert: "nicht signiert",
          hinweis: "DNS-Antworten sind nicht signiert und könnten unterwegs gefälscht werden.",
        },
  );

  /* Mail */
  /* "0 ." ist ein Null-MX: die Domain nimmt ausdrücklich keine Mails an */
  const mxListe = werte(mx, TYP.MX)
    .map((m) => m.split(" ").pop()?.replace(/\.$/, "") ?? "")
    .filter(Boolean);
  p.push(
    mxListe.length
      ? { id: "mx", titel: "Mailserver (MX)", status: "info", wert: mxListe.slice(0, 2).join(", ") + (mxListe.length > 2 ? " …" : "") }
      : { id: "mx", titel: "Mailserver (MX)", status: "info", wert: "keiner, die Domain empfängt keine Mails" },
  );

  const spf = werte(txt, TYP.TXT).find((t) => t.toLowerCase().startsWith("v=spf1"));
  /* Qualifier vor "all": - streng, ~ weich, ? neutral, + oder leer erlaubt jeden */
  const qualifier = spf?.match(/\s([+\-~?]?)all\b/i)?.[1];
  if (!spf)
    p.push({
      id: "spf",
      titel: "SPF",
      status: "fehlt",
      hinweis: "Ohne SPF kann jeder Mails im Namen Ihrer Domain verschicken.",
    });
  else if (qualifier === "" || qualifier === "+")
    p.push({ id: "spf", titel: "SPF", status: "fehlt", wert: "+all", hinweis: "SPF erlaubt jeden Absender und schützt damit nicht." });
  else if (qualifier === "-") p.push({ id: "spf", titel: "SPF", status: "ok", wert: "-all (streng)" });
  else
    p.push({
      id: "spf",
      titel: "SPF",
      status: "warn",
      wert: qualifier === "~" ? "~all (weich)" : qualifier === "?" ? "?all (neutral)" : "ohne all-Regel",
      hinweis: "Fremde Absender werden nur markiert, nicht abgewiesen.",
    });

  const dmarcEintrag = werte(dmarc, TYP.TXT).find((t) => t.toLowerCase().startsWith("v=dmarc1"));
  const politik = dmarcEintrag?.match(/;\s*p=(\w+)/i)?.[1]?.toLowerCase();
  if (!dmarcEintrag)
    p.push({
      id: "dmarc",
      titel: "DMARC",
      status: "fehlt",
      hinweis: "Ohne DMARC kann Ihre Domain für gefälschte Mails missbraucht werden.",
    });
  else if (politik === "reject" || politik === "quarantine") p.push({ id: "dmarc", titel: "DMARC", status: "ok", wert: `p=${politik}` });
  else
    p.push({
      id: "dmarc",
      titel: "DMARC",
      status: "warn",
      wert: `p=${politik ?? "?"}`,
      hinweis: "DMARC beobachtet nur, gefälschte Mails werden weiter zugestellt.",
    });

  p.push(
    werte(caa, TYP.CAA).length
      ? { id: "caa", titel: "CAA (wer Zertifikate ausstellen darf)", status: "ok", wert: "festgelegt" }
      : { id: "caa", titel: "CAA (wer Zertifikate ausstellen darf)", status: "info", wert: "nicht festgelegt" },
  );

  /* Web: nur, wenn die Domain auf öffentliche Adressen zeigt */
  if (ips.length && !ips.some(istPrivat)) {
    const [httpAntwort, httpsAntwort, cert] = await Promise.all([
      abrufen(`http://${domain}/`, false),
      abrufen(`https://${domain}/`, true),
      zertifikat(domain),
    ]);

    const ziel = httpAntwort?.headers.get("location") ?? "";
    p.push(
      httpAntwort && [301, 302, 307, 308].includes(httpAntwort.status) && ziel.startsWith("https://")
        ? { id: "umleitung", titel: "HTTP leitet auf HTTPS um", status: "ok" }
        : {
            id: "umleitung",
            titel: "HTTP leitet auf HTTPS um",
            status: httpAntwort ? "warn" : "info",
            wert: httpAntwort ? `HTTP ${httpAntwort.status}` : "Port 80 nicht erreichbar",
            hinweis: httpAntwort ? "Besucher können die Seite unverschlüsselt aufrufen." : undefined,
          },
    );

    if (cert.bis) {
      const tage = Math.floor((cert.bis.getTime() - Date.now()) / 86_400_000);
      p.push(
        !cert.gueltig
          ? { id: "tls", titel: "TLS-Zertifikat", status: "fehlt", wert: cert.fehler, hinweis: "Browser zeigen eine Sicherheitswarnung." }
          : tage < 14
            ? { id: "tls", titel: "TLS-Zertifikat", status: "warn", wert: `läuft in ${tage} Tagen ab`, hinweis: "Verlängerung prüfen, sonst ist die Seite bald gesperrt." }
            : { id: "tls", titel: "TLS-Zertifikat", status: "ok", wert: `gültig, noch ${tage} Tage · ${cert.protokoll ?? ""}`.trim() },
      );
      if (cert.protokoll && /TLSv1(\.1)?$/.test(cert.protokoll))
        p.push({ id: "tlsalt", titel: "TLS-Version", status: "warn", wert: cert.protokoll, hinweis: "Veraltete TLS-Version, unsicher." });
    } else {
      p.push({ id: "tls", titel: "TLS-Zertifikat", status: "fehlt", wert: cert.fehler || "kein HTTPS", hinweis: "Die Seite ist nicht verschlüsselt erreichbar." });
    }

    if (httpsAntwort) {
      const h = httpsAntwort.headers;
      const csp = h.get("content-security-policy") ?? "";
      const header: [string, string, boolean, string][] = [
        ["hsts", "HSTS", !!h.get("strict-transport-security"), "Browser erzwingen HTTPS nicht dauerhaft."],
        ["csp", "Content-Security-Policy", !!csp, "Kein Schutz gegen eingeschleuste Skripte (XSS)."],
        ["xcto", "X-Content-Type-Options", h.get("x-content-type-options")?.toLowerCase() === "nosniff", "Browser dürfen Dateitypen raten."],
        ["rahmen", "Schutz vor Einbettung (Clickjacking)", !!h.get("x-frame-options") || /frame-ancestors/i.test(csp), "Die Seite kann in fremde Seiten eingebettet werden."],
        ["referrer", "Referrer-Policy", !!h.get("referrer-policy"), "Adressen werden vollständig an fremde Seiten weitergegeben."],
      ];
      for (const [id, titel, da, hinweis] of header)
        p.push(da ? { id, titel, status: "ok" } : { id, titel, status: "warn", wert: "fehlt", hinweis });

      const verraet = [h.get("x-powered-by"), h.get("server")].filter((x): x is string => !!x && /\d/.test(x));
      if (verraet.length)
        p.push({
          id: "kennung",
          titel: "Server verrät Software-Version",
          status: "warn",
          wert: verraet.join(", "),
          hinweis: "Angreifer sehen sofort, welche Version läuft.",
        });
    }
  } else if (ips.some(istPrivat)) {
    p.push({ id: "web", titel: "Web-Prüfung", status: "info", wert: "übersprungen, die Domain zeigt auf eine interne Adresse" });
  }

  return antwort({ ok: true, domain, pruefungen: p });
}
