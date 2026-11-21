import { kennzahlen } from "@/lib/inhalte";

const alsText = (k: (typeof kennzahlen)[number]) => `${k.wert.toLocaleString("de-DE")}${k.nachsatz}`;

/**
 * Kennzahlen aus dem Gespräch mit Daniel (19.11.2026). Bewusst ohne Bewegung: Direkt darüber
 * klappt die Abflugtafel, zwei Animationen nacheinander wirken unruhig (Wunsch Stefan, 21.11.2026).
 * Hintergrund: ruhige Punktmatrix.
 */
export function Kennzahlen() {
  return (
    <section aria-label="Kennzahlen" className="hg-punktmatrix border-y border-border">
      <div className="mx-auto grid max-w-wide grid-cols-2 px-(--gutter) md:grid-cols-4">
        {kennzahlen.map((k, i) => (
          <div
            key={k.label}
            className={`grid content-start gap-3 border-border py-[clamp(2rem,4vw,3.5rem)] pr-5 ${i > 0 ? "md:border-l md:pl-8" : ""} ${i % 2 === 1 ? "border-l pl-5 md:pl-8" : ""} ${i > 1 ? "border-t md:border-t-0" : ""}`}
          >
            <span className="font-mono text-[clamp(1.15rem,0.75rem+1.35vw,2.1rem)] font-medium text-brand-dark">{alsText(k)}</span>
            <span className="daten">{k.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
