import { Reveal } from "@/components/motion/reveal";
import { KopierenKnopf } from "@/components/ui/kopieren-knopf";
import { site } from "@/lib/site";

/** Kontakt: Telefon und E-Mail direkt sichtbar, Erstgespräch aus dem bisherigen Audit-Angebot. */
export function Kontakt() {
  const wege = [
    { label: "Telefon", wert: site.telefon, href: `tel:${site.telefon.replace(/\s/g, "")}`, knopf: "Nummer kopieren" },
    { label: "E-Mail", wert: site.email, href: `mailto:${site.email}`, knopf: "Adresse kopieren" },
  ];
  return (
    <section id="kontakt" aria-labelledby="kontakt-titel" className="scroll-mt-(--header-h) border-t border-border bg-surface py-(--section-y) transition-colors duration-(--dur-welt)">
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="grid gap-6">
          {/* BEISPIEL: Verfügbarkeit für die Präsentation */}
          <span className="daten flex items-center gap-3 text-text">
            <span className="funkpuls" aria-hidden="true" />
            Kanal offen · neue Projekte ab Januar
          </span>
          <h2 id="kontakt-titel" className="titel-linie max-w-[14ch] text-h2">
            Erzählen Sie mir, was zu langsam läuft.
          </h2>
          <p className="max-w-measure text-lead text-text-muted">
            Ein erstes Gespräch dauert höchstens eine Stunde und kostet nichts. Danach wissen Sie, ob und wo sich ein
            Eingriff lohnt.
          </p>
        </Reveal>
        <div className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-10 md:grid-cols-2">
          {wege.map((w, i) => (
            <Reveal key={w.label} index={i} className="grid gap-2.5 border-t border-border pt-5">
              <span className="daten">{w.label}</span>
              <a href={w.href} className="font-mono text-[clamp(1.25rem,1rem+1.2vw,2rem)] break-words no-underline hover:text-brand-dark">
                {w.wert}
              </a>
              <KopierenKnopf wert={w.wert} label={w.knopf} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
