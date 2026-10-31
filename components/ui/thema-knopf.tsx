"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { zumFormular, type Thema } from "@/lib/kontakt-thema";

type Props = {
  children: ReactNode;
  thema: Thema;
  variante?: "primary" | "secondary";
  pfeil?: boolean;
  className?: string;
};

/**
 * Aufruf zum Kontakt: springt zum Formular und belegt Anliegen und Betreff vor.
 * Ohne JavaScript bleibt es ein normaler Link auf #kontakt.
 */
export function ThemaKnopf({ children, thema, variante = "primary", pfeil = true, className = "" }: Props) {
  return (
    <Button href="#kontakt" variante={variante} pfeil={pfeil} className={className} onClick={(e) => zumFormular(e, thema)}>
      {children}
    </Button>
  );
}

/** Kleiner Textlink mit derselben Wirkung, z. B. in Karten. */
export function ThemaLink({ children, thema, className = "" }: { children: ReactNode; thema: Thema; className?: string }) {
  return (
    <a
      href="#kontakt"
      onClick={(e) => zumFormular(e, thema)}
      className={`zucken group/link inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-dark ${className}`}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-(--dur-fast) ease-out [@media(hover:hover)]:group-hover/link:translate-x-1">
        →
      </span>
    </a>
  );
}
