/** Strukturierte Daten. Typ je Seitentyp aus seitentypen.md. */
export function JsonLd({ daten }: { daten: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // "<" maskieren, damit kein </script> aus Inhalten die Seite bricht
      dangerouslySetInnerHTML={{ __html: JSON.stringify(daten).replace(/</g, "\\u003c") }}
    />
  );
}
