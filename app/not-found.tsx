import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

export default function NichtGefunden() {
  return (
    <Container breite="measure" className="py-(--section-y)">
      <h1 className="text-h1">Diese Seite gibt es nicht</h1>
      <p className="mt-4 text-lead text-text-muted">Vielleicht hilft einer dieser Wege weiter:</p>
      <ul className="mt-6 flex flex-col gap-2">
        <li>
          <Link href="/" className="text-brand-dark underline underline-offset-4">
            Startseite
          </Link>
        </li>
        {site.navigation.map((punkt) => (
          <li key={punkt.href}>
            <Link href={punkt.href} className="text-brand-dark underline underline-offset-4">
              {punkt.label}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
