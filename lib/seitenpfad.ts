/* Brotkrumen für den einheitlichen Seitenkopf (components/layout/seitenkopf.tsx).
   Namen kommen aus den Inhaltsdateien; neue Unterseiten hier eintragen, sonst erscheint der rohe Pfad. */

import { leistungsseiten, referenzen } from "@/lib/inhalte";
import { dossier } from "@/lib/wissen";
import { werkzeuge } from "@/lib/werkzeuge";

/** kurz: Fassung fürs Handy, wenn label dort zu lang wäre */
export type Glied = { label: string; href?: string; kurz?: string };

const START: Glied = { label: "Start", href: "/" };
const LEISTUNGEN: Glied = { label: "Leistungen", href: "/#leistungen" };
const WERKZEUGE: Glied = { label: "Werkzeuge", href: "/werkzeuge" };
const WISSEN: Glied = { label: "Wissen", href: "/wissen" };
const REFERENZEN: Glied = { label: "Referenzen", href: "/#referenzen" };

/** Einzelne Seiten direkt unter Start */
const EINZELN: Record<string, Glied[]> = {
  proxmox: [LEISTUNGEN, { label: leistungsseiten.proxmox.name }],
  automatisierung: [LEISTUNGEN, { label: leistungsseiten.automatisierung.name }],
  backup: [LEISTUNGEN, { label: "Backup" }],
  zusammenarbeit: [LEISTUNGEN, { label: "So arbeiten wir" }],
  werkzeuge: [{ label: "Werkzeuge" }],
  wissen: [{ label: "Wissen" }],
  vortrag: [{ label: "Vortrag" }],
  impressum: [{ label: "Impressum" }],
  datenschutz: [{ label: "Datenschutz" }],
};

/** Pfad der Seite als Kette von Start bis zur aktuellen Seite (letztes Glied ohne Link). Startseite: leer. */
export function brotkrumen(pfad: string): Glied[] {
  const teile = pfad.split("/").filter(Boolean);
  if (teile.length === 0) return [];
  const [erster, zweiter] = teile;

  if (teile.length === 1 && EINZELN[erster]) return [START, ...EINZELN[erster]];

  if (erster === "werkzeuge" && zweiter) {
    const w = werkzeuge.find((x) => x.slug === zweiter);
    /* Lange Titel (z. B. "Was fällt aus, wenn …?") am Handy als Kennung */
    return [START, WERKZEUGE, { label: w?.titel ?? zweiter, kurz: w && w.titel.length > 20 ? w.kennung : undefined }];
  }
  if (erster === "wissen" && zweiter === "begriffe") return [START, WISSEN, { label: "Glossar" }];
  if (erster === "wissen" && zweiter) {
    const d = dossier(zweiter);
    return [START, WISSEN, { label: d ? `${d.kennung} · ${d.titel.replace(/\.$/, "")}` : zweiter, kurz: d?.kennung }];
  }
  if (erster === "faelle" && zweiter) {
    const i = referenzen.findIndex((f) => f.slug === zweiter);
    return [START, REFERENZEN, { label: i >= 0 ? `Fall ${String(i + 1).padStart(2, "0")}` : zweiter }];
  }
  /* Unbekannt (z. B. 404): roher Pfad, damit der Kopf trotzdem stimmt */
  return [START, { label: teile.join("/") }];
}
