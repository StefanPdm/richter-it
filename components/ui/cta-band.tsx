import { Reveal } from "@/components/motion/reveal";
import { ThemaKnopf } from "@/components/ui/thema-knopf";
import { site } from "@/lib/site";
import type { Thema } from "@/lib/kontakt-thema";

type Props = {
  /** Kurze Aussage, eine Zeile */
  satz: string;
  /** Ergänzung darunter, optional */
  zusatz?: string;
  knopf: string;
  thema: Thema;
};

/**
 * Aufruf-Band zwischen Sektionen: Satz links, Hauptaktion und Telefon rechts.
 * Ruhiger Hintergrund mit HUD-Ecken, damit es sich vom Inhalt abhebt, ohne zu laut zu sein.
 */
export function CtaBand({ satz, zusatz, knopf, thema }: Props) {
  return (
    <aside aria-label="Kontakt aufnehmen" className="border-y border-border bg-surface transition-colors duration-(--dur-welt)">
      <Reveal className="mx-auto max-w-wide px-(--gutter) py-[clamp(1.25rem,3vw,2rem)]">
        <div className="hud-rahmen grid items-center gap-6 p-[clamp(1.25rem,3vw,2rem)] md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="grid gap-2">
            <p className="font-display text-h3 font-medium [font-stretch:80%]">{satz}</p>
            {zusatz && <p className="max-w-measure text-text-muted">{zusatz}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ThemaKnopf thema={thema}>{knopf}</ThemaKnopf>
            <a href={`tel:${site.telefon.replace(/\s/g, "")}`} className="zucken inline-flex min-h-11 items-center gap-2 font-mono text-sm hover:text-brand-dark">
              <span className="daten">oder anrufen</span> {site.telefon}
            </a>
          </div>
        </div>
      </Reveal>
    </aside>
  );
}
