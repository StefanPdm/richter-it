import { Reveal } from "@/components/motion/reveal";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { zitat } from "@/lib/inhalte";

/**
 * Zitatband: ein Satz von Daniel, groß gesetzt. Bewusst ohne Porträt, weil direkt danach
 * "Über mich" mit Foto folgt. Anführungszeichen in Bernstein, warmer Sektionsgrund.
 */
export function ZitatBand() {
  return (
    <section id="zitat" aria-label="Zitat von Daniel Richter" className="relative isolate scroll-mt-(--header-h) border-y border-border py-[clamp(4rem,9vw,8rem)]">
      <Sektionsgrund licht="links-oben" motiv="marken" warm />
      <Reveal as="figure" className="mx-auto grid max-w-wide gap-6 px-(--gutter)">
        <span aria-hidden="true" className="zitat-zeichen font-display leading-none text-cta">
          „
        </span>
        <blockquote className="max-w-[24ch] font-display text-[clamp(2rem,1.2rem+3vw,4rem)] leading-[1.02] font-medium text-balance [font-stretch:72%]">
          {zitat.text}
        </blockquote>
        <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span aria-hidden="true" className="h-px w-12 bg-cta" />
          <span className="daten whitespace-nowrap text-text">{zitat.von}</span>
          <span className="daten">{zitat.rolle}</span>
        </figcaption>
      </Reveal>
    </section>
  );
}
