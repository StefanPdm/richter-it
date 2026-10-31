import { Reveal } from "@/components/motion/reveal";
import { KiVideo } from "@/components/medien/ki-video";
import { DekodierText } from "@/components/effekte/dekodier-text";
import { DrohnenHud } from "@/components/effekte/drohnen-hud";
import { Glitch } from "@/components/effekte/glitch";
import { grundsaetze } from "@/lib/inhalte";

/**
 * Medienband mit KI-Video 02: Drohnenflug durch eine unterirdische Serverhalle (Loop, stumm).
 * Darüber das Drohnen-HUD: Visier, Flugdaten, Inspektion der Server im Vorbeiflug (BEISPIEL).
 */
export function Medienband() {
  return (
    <section aria-labelledby="drohne-titel" className="relative aspect-[21/9] min-h-[26rem] max-w-full overflow-hidden border-y border-border md:min-h-[34rem]">
      <KiVideo
        szene="rackreihen"
        video={{ mp4: "/medien/serverhalle.mp4", webm: "/medien/serverhalle.webm", poster: "/medien/serverhalle-poster.webp" }}
        className="absolute inset-0 size-full"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_0%,transparent_30%,transparent_75%,var(--color-bg)_100%)] opacity-80" />
      <div className="scanlines scanlines--monitor" aria-hidden="true" />
      <div className="hud-rahmen absolute inset-4 md:inset-8" aria-hidden="true" />
      <DrohnenHud />
      {/* Überschrift links oben im HUD-Stil: erklärt, was im Video passiert */}
      <div className="absolute top-8 left-[max(var(--gutter),1.5rem)] grid max-w-[min(30rem,calc(100%-3rem))] gap-2 bg-bg/75 px-4 py-3 md:top-14">
        <span className="daten flex items-center gap-2.5 text-text" aria-hidden="true">
          <span className="funkpuls funkpuls--rot" />
          Live · Prüfflug 02
        </span>
        <h2 id="drohne-titel" className="font-display text-[clamp(1.5rem,1rem+1.8vw,2.75rem)] leading-none font-semibold tracking-wide uppercase [font-stretch:72%]">
          <Glitch text="Drohnen-Inspektion" takt="8s" />
        </h2>
        <p className="hidden text-sm text-text-muted lg:block">
          Autonomer Prüfflug durch das Rechenzentrum. Jeder Server wird im Vorbeiflug geprüft, Befunde landen sofort im
          Protokoll.
        </p>
      </div>
      <span className="daten absolute bottom-6 left-[max(var(--gutter),1.5rem)] hidden bg-bg/75 px-2.5 py-1.5 text-text sm:block md:bottom-10">
        <DekodierText text="Rechenzentrum · Ebene -2 · 2.400 Knoten" />
      </span>
    </section>
  );
}

/** Haltung: drei Grundsätze, der dritte als Zitat von Daniel. */
export function Haltung() {
  return (
    <section aria-labelledby="haltung-titel" className="py-(--section-y)">
      <div className="mx-auto max-w-wide px-(--gutter)">
        <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="haltung-titel" className="titel-linie titel-glitch max-w-[16ch] text-h2">
            Gezielt eingreifen statt neu bauen
          </h2>
          {/* Vision, sinngemäß von der bestehenden Website (Leistungen, Visionen) */}
          <p className="max-w-measure text-lead text-text-muted">
            Viele IT-Teams stecken im Alltagsgeschäft fest, und die Weiterentwicklung bleibt liegen. Mein Ziel: Playbooks,
            Skripte und Werkzeuge so weit zu verfeinern, dass Ihr Team wieder Zeit für die eigene Infrastruktur hat.
          </p>
        </Reveal>
        <div className="grid gap-[clamp(2rem,4vw,3.5rem)] md:grid-cols-3">
          {grundsaetze.map((g, i) => (
            <Reveal key={g.titel} index={i} className="grid content-start gap-3.5 border-t border-border pt-5.5">
              <h3 className="text-h3">{g.titel}</h3>
              <p className="text-text-muted">{g.text}</p>
            </Reveal>
          ))}
          <Reveal index={2} className="grid content-start gap-3.5 border-t border-border pt-5.5">
            <h3 className="text-h3">Kleine Eingriffe</h3>
            <figure className="grid gap-2">
              <blockquote className="font-display text-h3 font-normal [font-stretch:85%]">
                „Meistens ohne große Umbauarbeiten.“
              </blockquote>
              <figcaption className="daten">Daniel Richter</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
