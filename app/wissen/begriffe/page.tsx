import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { begriffe } from "@/lib/inhalte";
import { seitenMetadaten } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = seitenMetadaten({
  titel: "Glossar: IT-Begriffe einfach erklärt",
  beschreibung: "Proxmox, Hypervisor, VBS, Cluster und mehr: Fachbegriffe aus der IT-Infrastruktur in je einem Satz erklärt, für Entscheider.",
  pfad: "/wissen/begriffe",
});

/** Glossar: alle Begriffe aus lib/inhalte.ts (begriffe), alphabetisch, je mit Anker. */
export default function Begriffe() {
  const liste = Object.entries(begriffe).sort(([a], [b]) => a.localeCompare(b, "de"));
  return (
    <>
      <JsonLd
        daten={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Glossar IT-Infrastruktur",
          url: `${site.url}/wissen/begriffe`,
          hasDefinedTerm: liste.map(([name, b]) => ({ "@type": "DefinedTerm", name, alternateName: b.lang, description: b.text })),
        }}
      />
      <section aria-labelledby="glossar-titel" className="relative isolate py-(--section-y)">
        <Sektionsgrund licht="rechts-oben" motiv="lineal" />
        <div className="mx-auto grid max-w-wide grid-cols-1 gap-[clamp(2rem,4vw,3.5rem)] px-(--gutter)">
          <div className="grid gap-5">
            <nav aria-label="Brotkrumen" className="daten flex flex-wrap items-center gap-x-2">
              <Link href="/" className="inline-flex min-h-11 min-w-11 items-center hover:text-text">
                Start
              </Link>
              /
              <Link href="/wissen" className="inline-flex min-h-11 items-center hover:text-text">
                Wissen
              </Link>
              / <span className="text-text">Glossar</span>
            </nav>
            <h1 id="glossar-titel" className="titel-linie text-h2">
              Glossar
            </h1>
            <p className="max-w-measure text-lead text-text-muted">Fachbegriffe in je einem Satz, so wie sie auf dieser Seite vorkommen.</p>
          </div>
          <dl className="grid gap-x-(--gap-karten) md:grid-cols-2">
            {liste.map(([name, b]) => (
              <div key={name} id={name.toLowerCase().replace(/\s+/g, "-")} className="grid scroll-mt-[calc(var(--header-h)+1rem)] gap-2 border-t border-border py-6">
                <dt className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-h3 font-medium [font-stretch:80%]">{name}</span>
                  {b.lang !== name && <span className="daten">{b.lang}</span>}
                </dt>
                <dd className="max-w-measure text-text-muted">{b.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
