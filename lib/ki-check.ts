/** Gemeinsame Typen für den KI-Sichtbarkeits-Check (API-Route und Werkzeug Domain-Check). */

import type { Pruefung } from "@/lib/sicherheitscheck";

/** So liest ein Sprachmodell die Startseite: das, was ohne Gestaltung übrig bleibt */
export type Lesart = {
  titel?: string;
  beschreibung?: string;
  h1: string[];
  sprache?: string;
  woerter: number;
  /** Anfang des reinen Seitentexts, so wie ein Crawler ihn sieht */
  auszug: string;
  /** Typen aus den strukturierten Daten (JSON-LD), z. B. Organization, LocalBusiness */
  typen: string[];
  /** Fakten aus den strukturierten Daten, die eine KI direkt übernehmen kann */
  fakten: [string, string][];
};

export type KiErgebnis =
  | {
      ok: true;
      domain: string;
      /** aufgerufene Adresse nach Umleitungen */
      adresse: string;
      punkte: number;
      pruefungen: Pruefung[];
      /** die drei wirksamsten Verbesserungen */
      hebel: string[];
      lesart: Lesart;
    }
  | { ok: false; fehler: string };

/** KI-Crawler, deren Zugriff in der robots.txt geprüft wird */
export const KI_CRAWLER = [
  ["GPTBot", "OpenAI, Training"],
  ["OAI-SearchBot", "ChatGPT-Suche"],
  ["ChatGPT-User", "ChatGPT ruft Seiten ab"],
  ["ClaudeBot", "Anthropic"],
  ["PerplexityBot", "Perplexity"],
  ["Google-Extended", "Gemini"],
  ["CCBot", "Common Crawl"],
] as const;
