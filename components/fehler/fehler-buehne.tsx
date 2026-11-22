import type { ReactNode } from "react";
import { Glitch } from "@/components/effekte/glitch";

type Props = {
  /** Statuscode, groß und glitchend */
  code: string;
  /** Statuszeile im HUD, z. B. "Signal verloren" */
  zeile: string;
  titel: string;
  text: string;
  /** Motiv über der Zahl: Radar (404) oder Zahnrad (500) */
  motiv: ReactNode;
  /** Konsolenzeile unter dem Text, z. B. die angefragte Adresse */
  konsole?: ReactNode;
  /** Wege zurück */
  aktionen: ReactNode;
};

/**
 * Bühne der Fehlerseiten, gleiche Familie wie die 502: Rasterboden, Scanlines, HUD-Ecken,
 * glitchende Zahl mit leichtem Glow, eigenes Motiv, ein Satz mit Augenzwinkern, Wege zurück.
 */
export function FehlerBuehne({ code, zeile, titel, text, motiv, konsole, aktionen }: Props) {
  return (
    <section aria-labelledby="fehler-titel" className="relative isolate grid min-h-[calc(100svh-var(--header-h)-var(--unten))] place-items-center overflow-hidden border-b border-border px-(--gutter) py-[clamp(4.5rem,8vw,6rem)]">
      <div className="raster-boden -z-10" aria-hidden="true" />
      <div className="scanlines -z-10" aria-hidden="true" />
      <div className="hud-rahmen pointer-events-none absolute inset-4 md:inset-8" aria-hidden="true" />
      <span className="daten absolute top-16 left-10 hidden border-l-2 border-brand pl-3 leading-relaxed md:block" aria-hidden="true">
        System_Status
        <br />/ {code}
      </span>
      <span className="daten absolute right-10 bottom-10 hidden text-right md:block" aria-hidden="true">
        HTTP {code}
        <br />
        {zeile}
      </span>

      <div className="grid max-w-xl justify-items-center gap-5 text-center">
        {motiv}
        <span className="f502-zahl font-display text-[clamp(4rem,2.5rem+6vw,7.5rem)] leading-none font-semibold text-brand [font-stretch:80%]" aria-hidden="true">
          <Glitch text={code} takt="5s" />
        </span>
        <span className="daten flex items-center gap-2.5 text-text">
          <span className="status-punkt f502-punkt" aria-hidden="true" />
          {zeile}
        </span>
        <h1 id="fehler-titel" className="text-h3">
          {titel}
        </h1>
        <p className="max-w-[46ch] text-text-muted">{text}</p>
        {konsole}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">{aktionen}</div>
      </div>
    </section>
  );
}

/** Radar, das ins Leere sucht: Ringe, umlaufender Strahl, ein Echo, das kurz aufblitzt und verschwindet */
export function Radar() {
  return (
    <span aria-hidden="true" className="radar">
      <span className="radar__strahl" />
      <span className="radar__echo" />
    </span>
  );
}
