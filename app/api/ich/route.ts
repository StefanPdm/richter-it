/*
 * IP-Adresse des Besuchers für "whoami" in der Konsole. Wird nur zurückgegeben, nicht gespeichert.
 * Netlify liefert die Adresse in x-nf-client-connection-ip, sonst x-forwarded-for.
 */
export function GET(request: Request) {
  const ip =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    null;
  return Response.json({ ip }, { headers: { "Cache-Control": "no-store" } });
}
