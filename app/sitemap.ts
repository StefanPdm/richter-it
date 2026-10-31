import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/* lastmod nur mit echtem Änderungsdatum, nicht mit "jetzt" (qualitaet.md). */
const seiten: { pfad: string; geaendert: string }[] = [
  { pfad: "/", geaendert: "2026-10-31" },
  { pfad: "/impressum", geaendert: "2026-10-31" },
  { pfad: "/datenschutz", geaendert: "2026-10-31" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return seiten.map((s) => ({ url: `${site.url}${s.pfad}`, lastModified: s.geaendert }));
}
