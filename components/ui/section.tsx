import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  id?: string;
  /** light = Grund, alt = Wechselfläche, dark = ganze Fläche umgefärbt */
  flaeche?: "light" | "alt" | "dark";
  /** id der H2, damit die Sektion einen zugänglichen Namen hat */
  titelId?: string;
  className?: string;
};

/** Sektion mit Abstand --section-y. Jede Sektion hat eine H2. */
export function Section({ children, id, flaeche = "light", titelId, className = "" }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={titelId}
      data-theme={flaeche === "dark" ? "dark" : undefined}
      className={`scroll-mt-(--header-h) py-(--section-y) ${flaeche === "alt" ? "bg-bg-alt" : "bg-bg"} ${className}`}
    >
      {children}
    </section>
  );
}
