"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FehlerBuehne } from "@/components/fehler/fehler-buehne";
import { Zahnrad } from "@/components/sektionen/fehler-502";
import { Button } from "@/components/ui/button";

type Props = { error: Error & { digest?: string }; reset: () => void };

/**
 * 500: Fehler beim Darstellen einer Seite. Das Zahnrad stockt. Ehrlich: der Fehler liegt
 * bei uns, nicht bei den Besuchern. "Erneut versuchen" rendert die Seite neu.
 */
export default function Fehler({ error, reset }: Props) {
  useEffect(() => {
    /* Für die Fehlersuche im Browser, Besucher sehen nur die Kennung */
    console.error(error);
  }, [error]);

  return (
    <FehlerBuehne
      code="500"
      zeile="Zahnrad blockiert"
      titel="Hier hakt gerade etwas."
      text="Der Fehler liegt auf dieser Seite, nicht bei Ihnen. Meistens hilft ein zweiter Versuch. Wenn nicht, freue ich mich über einen kurzen Hinweis."
      motiv={<Zahnrad stockt />}
      konsole={
        error.digest ? (
          <p className="font-mono text-sm">
            <span className="text-text-muted">Kennung </span>
            <span className="text-brand-dark">{error.digest}</span>
          </p>
        ) : undefined
      }
      aktionen={
        <>
          <Button onClick={reset}>Erneut versuchen</Button>
          <Link href="/" className="zucken inline-flex min-h-11 items-center gap-2 font-medium text-brand-dark">
            ← Zur Startseite
          </Link>
        </>
      }
    />
  );
}
