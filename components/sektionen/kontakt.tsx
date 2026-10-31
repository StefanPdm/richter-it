import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { KopierenKnopf } from "@/components/ui/kopieren-knopf";
import { KontaktFormular } from "@/components/ui/kontakt-formular";
import { site } from "@/lib/site";
import zentrale from "@/public/images/kontrollraum-zentrale.jpg";

/**
 * Kontakt: Telefon, E-Mail, Formular (Felder wie auf der bestehenden Website), Social Links.
 * Erstgespräch aus dem bisherigen Audit-Angebot. Hintergrund bewegt: Kontrollraum mit Kamerafahrt.
 */
export function Kontakt() {
  const wege = [
    { label: "Telefon", wert: site.telefon, href: `tel:${site.telefon.replace(/\s/g, "")}`, knopf: "Nummer kopieren" },
    { label: "E-Mail", wert: site.email, href: `mailto:${site.email}`, knopf: "Adresse kopieren" },
  ];
  return (
    <section id="kontakt" aria-labelledby="kontakt-titel" className="relative isolate scroll-mt-(--header-h) overflow-hidden border-t border-border py-(--section-y)">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <Image src={zentrale} alt="" sizes="100vw" className="kamerafahrt size-full object-cover" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-bg)_15%,color-mix(in_srgb,var(--color-bg)_80%,transparent)_55%,color-mix(in_srgb,var(--color-bg)_55%,transparent)_100%)]" />
      <div className="scanlines -z-10" aria-hidden="true" />

      <div className="mx-auto grid max-w-wide gap-[clamp(2.5rem,5vw,5rem)] px-(--gutter) lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-start">
        <div className="grid gap-8">
          <Reveal className="grid gap-6">
            <h2 id="kontakt-titel" className="titel-linie titel-glitch max-w-[14ch] text-h2">
              Erzählen Sie mir, was zu langsam läuft.
            </h2>
            <p className="max-w-measure text-lead">
              Ein erstes Gespräch dauert höchstens eine Stunde und kostet nichts. Danach wissen Sie, ob und wo sich ein
              Eingriff lohnt.
            </p>
            {/* BEISPIEL: Verfügbarkeit für die Präsentation */}
            <span className="daten flex items-center gap-3 text-text">
              <span className="funkpuls" aria-hidden="true" />
              Kanal offen · neue Projekte ab Januar
            </span>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2">
            {wege.map((w, i) => (
              <Reveal key={w.label} index={i} className="grid content-start gap-2.5 border-t border-border pt-5">
                <span className="daten">{w.label}</span>
                <a href={w.href} className="font-mono text-[clamp(1.1rem,0.9rem+0.9vw,1.6rem)] break-words no-underline hover:text-brand-dark">
                  {w.wert}
                </a>
                <KopierenKnopf wert={w.wert} label={w.knopf} />
              </Reveal>
            ))}
          </div>
          <Reveal index={2} className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="daten">Folgen</span>
            {site.social.map((s) => (
              <a key={s.href} href={s.href} className="zucken inline-flex min-h-11 items-center underline underline-offset-4 hover:text-brand-dark">
                {s.label}
              </a>
            ))}
          </Reveal>
        </div>
        <Reveal index={1}>
          <KontaktFormular />
        </Reveal>
      </div>
    </section>
  );
}
