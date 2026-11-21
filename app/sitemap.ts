import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/* lastmod nur mit echtem Änderungsdatum, nicht mit "jetzt" (qualitaet.md). */
const seiten: { pfad: string; geaendert: string }[] = [
  { pfad: "/", geaendert: "2026-10-31" },
  { pfad: "/impressum", geaendert: "2026-10-31" },
  { pfad: "/datenschutz", geaendert: "2026-10-31" },
  { pfad: "/backup", geaendert: "2026-11-21" },
  { pfad: "/zusammenarbeit", geaendert: "2026-11-21" },
  { pfad: "/proxmox", geaendert: "2026-11-21" },
  { pfad: "/automatisierung", geaendert: "2026-11-21" },
  { pfad: "/wissen", geaendert: "2026-11-21" },
  { pfad: "/wissen/vbs", geaendert: "2026-11-21" },
  { pfad: "/wissen/ntp-dns", geaendert: "2026-11-21" },
  { pfad: "/wissen/502", geaendert: "2026-11-21" },
  { pfad: "/wissen/proxmox-baukasten", geaendert: "2026-11-21" },
  { pfad: "/wissen/firewall-verkehr", geaendert: "2026-11-21" },
  { pfad: "/wissen/begriffe", geaendert: "2026-11-21" },
  { pfad: "/faelle/vbs-leistung", geaendert: "2026-11-21" },
  { pfad: "/faelle/firewall-engpass", geaendert: "2026-11-21" },
  { pfad: "/faelle/altsystem", geaendert: "2026-11-21" },
  { pfad: "/werkzeuge", geaendert: "2026-11-01" },
  { pfad: "/werkzeuge/souveraenitaet", geaendert: "2026-11-01" },
  { pfad: "/werkzeuge/ausfall", geaendert: "2026-11-01" },
  { pfad: "/werkzeuge/vmware-ausstieg", geaendert: "2026-11-01" },
  { pfad: "/werkzeuge/cluster-planer", geaendert: "2026-11-01" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return seiten.map((s) => ({ url: `${site.url}${s.pfad}`, lastModified: s.geaendert }));
}
