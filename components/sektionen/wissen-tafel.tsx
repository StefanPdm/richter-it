import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Fallblatt } from "@/components/effekte/fallblatt";
import { Sektionsgrund } from "@/components/effekte/sektionsgrund";
import { dossiers } from "@/lib/wissen";

/** Breite der Titelspalte in Zeichen: länger wird gekürzt, kürzer aufgefüllt */
const BREITE = 44;
const zuschnitt = (t: string) => {
  const s = t.replace(/\.$/, "").toUpperCase();
  return s.length > BREITE ? `${s.slice(0, BREITE - 1)}…` : s.padEnd(BREITE, " ");
};

/**
 * Teaser Wissen auf der Startseite: Abflugtafel. Die Dossiers klappen beim Einblenden durch
 * wie am Flughafen, Spalten Kennung, Titel, Lesezeit, Status. Fertige Dossiers sind
 * anklickbar. Auf dem Handy ohne Klappzellen im Titel (zu breit), dafür als Klartext.
 */
export function WissenTafel() {
  const zeilen = [...dossiers].sort((a, b) => (a.status === b.status ? a.kennung.localeCompare(b.kennung) : a.status === "bereit" ? -1 : 1));

  return (
    <section id="wissen" aria-labelledby="wissen-tafel-titel" className="relative isolate scroll-mt-(--header-h) border-y border-border bg-bg-alt py-[clamp(3.5rem,7vw,6rem)]">
      <Sektionsgrund licht="links-unten" motiv="scan" />
      <div className="mx-auto grid max-w-wide grid-cols-1 gap-8 px-(--gutter)">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="grid gap-3">
            <span className="daten">Wissen · Dossiers · Abflug in die Tiefe</span>
            <h2 id="wissen-tafel-titel" className="font-display text-h3 font-medium [font-stretch:80%]">
              Erklärt, bevor es teuer wird.
            </h2>
          </div>
          <Link href="/wissen" className="zucken group/tafel inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
            Alle Dossiers
            <span aria-hidden="true" className="transition-transform duration-(--dur-fast) ease-out [@media(hover:hover)]:group-hover/tafel:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>

        <Reveal index={1} className="tafel hud-rahmen border border-border bg-bg p-[clamp(0.75rem,2vw,1.5rem)]">
          {/* Spaltenköpfe */}
          <div className="tafel__zeile daten pb-2 text-text-muted" aria-hidden="true">
            <span>Dossier</span>
            <span>Thema</span>
            <span className="hidden sm:block">Lesezeit</span>
            <span className="text-right">Status</span>
          </div>
          <ul className="grid">
            {zeilen.map((d) => {
              const bereit = d.status === "bereit";
              const inhalt = (
                <>
                  <Fallblatt text={d.kennung} buchstaben versatz={0.6} className="tafel__klappe text-brand-dark" />
                  <span className="min-w-0">
                    <Fallblatt text={zuschnitt(d.titel)} buchstaben versatz={0.35} className="tafel__klappe hidden text-text lg:inline-flex" />
                    <span className="font-mono text-sm text-text uppercase lg:hidden">{d.titel.replace(/\.$/, "")}</span>
                  </span>
                  <span className="hidden sm:block">
                    <Fallblatt text={`${d.minuten} MIN`} buchstaben versatz={0.6} className="tafel__klappe text-text-muted" />
                  </span>
                  <span className="text-right">
                    <Fallblatt text={bereit ? "BEREIT" : "BALD"} buchstaben versatz={0.6} className={`tafel__klappe ${bereit ? "text-success" : "text-text-muted"}`} />
                  </span>
                </>
              );
              return (
                <li key={d.slug} className="border-t border-border">
                  {bereit ? (
                    <Link href={`/wissen/${d.slug}`} className="tafel__zeile tafel__zeile--link group py-3" aria-label={`${d.kennung}: ${d.titel}, ${d.minuten} Minuten`}>
                      {inhalt}
                    </Link>
                  ) : (
                    <div className="tafel__zeile py-3 opacity-60">{inhalt}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
