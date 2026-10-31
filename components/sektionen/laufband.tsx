import { technik } from "@/lib/inhalte";

/** Technik-Laufband. Liste doppelt, damit die Schleife nahtlos ist; die Kopie ist für Screenreader verborgen. */
export function Laufband() {
  const eintraege = (kopie: boolean) =>
    technik.map((t) => (
      <li key={`${t}-${kopie}`} aria-hidden={kopie || undefined} className="flex items-center gap-10 pr-10">
        <span className="font-display text-h3 font-medium whitespace-nowrap text-text-muted [font-stretch:72%]">{t}</span>
        <span className="size-1.5 rotate-45 bg-brand" aria-hidden="true" />
      </li>
    ));
  return (
    <section aria-label="Eingesetzte Technik" className="overflow-hidden border-b border-border bg-bg-alt py-6 transition-colors duration-(--dur-welt)">
      <ul className="laufband">
        {eintraege(false)}
        {eintraege(true)}
      </ul>
    </section>
  );
}
