import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

/** Rechtliche Seiten: einspaltig, Lesebreite, keine Deko (seitentypen.md). */
export function Rechtsseite({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <Container breite="measure" className="py-(--section-y)">
      <h1 className="text-h2 hyphens-auto">{titel}</h1>
      <div className="mt-8 flex flex-col gap-4 [&_h2]:mt-6 [&_h2]:text-h3">{children}</div>
    </Container>
  );
}
