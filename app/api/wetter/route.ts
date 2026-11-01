/*
 * Wetter für die Konsole (Befehl "wetter [ort]"). Daten von Open-Meteo (open-meteo.com, CC BY 4.0),
 * ohne API-Schlüssel. Die Abfrage läuft über den Server: die IP des Besuchers erreicht Open-Meteo nicht.
 * Antwort wird 10 Minuten zwischengespeichert, gespeichert wird sonst nichts.
 */

const ZEITLIMIT = 5000;

export type WetterTag = { datum: string; code: number; max: number; min: number; regen: number };
export type WetterErgebnis =
  | {
      ok: true;
      ort: string;
      breite: number;
      laenge: number;
      aktuell: { temp: number; gefuehlt: number; feuchte: number; wind: number; richtung: number; code: number; zeit: string };
      tage: WetterTag[];
    }
  | { ok: false; fehler: string };

function antwort(daten: WetterErgebnis, status = 200) {
  return Response.json(daten, {
    status,
    headers: { "Cache-Control": daten.ok ? "public, max-age=600, s-maxage=600" : "no-store" },
  });
}

async function hole<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(ZEITLIMIT), cache: "no-store" });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

type Ort = { name: string; latitude: number; longitude: number; country_code?: string; admin1?: string };

export async function GET(request: Request) {
  const eingabe = (new URL(request.url).searchParams.get("ort") ?? "Potsdam").trim().slice(0, 60);
  if (!/^[\p{L}\p{M}\s.'-]{2,60}$/u.test(eingabe)) return antwort({ ok: false, fehler: "Bitte einen Ortsnamen angeben, z. B. wetter Berlin" }, 400);

  const suche = await hole<{ results?: Ort[] }>(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(eingabe)}&count=1&language=de&format=json`,
  );
  if (!suche) return antwort({ ok: false, fehler: "Wetterdienst gerade nicht erreichbar." }, 502);
  const ort = suche.results?.[0];
  if (!ort) return antwort({ ok: false, fehler: `Ort "${eingabe}" nicht gefunden.` }, 404);

  const parameter = new URLSearchParams({
    latitude: String(ort.latitude),
    longitude: String(ort.longitude),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "4",
  });
  type Antwort = {
    current: {
      time: string;
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      weather_code: number;
      wind_speed_10m: number;
      wind_direction_10m: number;
    };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_probability_max: (number | null)[];
    };
  };
  const w = await hole<Antwort>(`https://api.open-meteo.com/v1/forecast?${parameter}`);
  if (!w) return antwort({ ok: false, fehler: "Wetterdienst gerade nicht erreichbar." }, 502);

  const c = w.current;
  return antwort({
    ok: true,
    ort: [ort.name, ort.admin1 && ort.admin1 !== ort.name ? ort.admin1 : null, ort.country_code].filter(Boolean).join(", "),
    breite: ort.latitude,
    laenge: ort.longitude,
    aktuell: {
      temp: Math.round(c.temperature_2m),
      gefuehlt: Math.round(c.apparent_temperature),
      feuchte: Math.round(c.relative_humidity_2m),
      wind: Math.round(c.wind_speed_10m),
      richtung: c.wind_direction_10m,
      code: c.weather_code,
      zeit: c.time.slice(11, 16),
    },
    tage: w.daily.time.slice(1).map((datum, i) => ({
      datum,
      code: w.daily.weather_code[i + 1],
      max: Math.round(w.daily.temperature_2m_max[i + 1]),
      min: Math.round(w.daily.temperature_2m_min[i + 1]),
      regen: w.daily.precipitation_probability_max[i + 1] ?? 0,
    })),
  });
}
