"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FehlerBuehne, Radar } from "@/components/fehler/fehler-buehne";

/** 404: Radar sucht ins Leere. Kein Angriff, nur ein falscher Weg. Zeigt die angefragte Adresse. */
export default function NichtGefunden() {
  const pfad = usePathname();
  return (
    <FehlerBuehne
      code="404"
      zeile="Signal verloren"
      titel="Diese Seite antwortet nicht."
      text="Kein Angriff, kein Ausfall, nur ein Weg, der ins Leere führt. Vielleicht wurde die Seite verschoben oder die Adresse hat einen Tippfehler."
      motiv={<Radar />}
      konsole={
        <p className="font-mono text-sm break-all">
          <span className="text-text-muted">$ curl -I {pfad}</span>
          <br />
          <span className="text-brand-dark">HTTP/2 404 Not Found</span>
        </p>
      }
      aktionen={
        <>
          <Link href="/" className="zucken inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
            ← Zur Startseite
          </Link>
          <Link href="/wissen" className="zucken inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
            Zum Wissen
          </Link>
          <Link href="/#kontakt" className="zucken inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
            Kontakt
          </Link>
        </>
      }
    />
  );
}
