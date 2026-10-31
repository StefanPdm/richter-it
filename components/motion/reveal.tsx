"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** HTML-Element, Standard div */
  as?: ElementType;
  /** Position in einer Gruppe, ergibt den Versatz (--stagger) */
  index?: number;
  /** aufsteigen (Standard), zeilen (ZeilenReveal), bild (Bild-Öffnung) */
  art?: "aufsteigen" | "zeilen" | "bild";
  className?: string;
};

const artKlasse = { aufsteigen: "", zeilen: "zeilen-reveal", bild: "bild-oeffnung" } as const;

/**
 * Blendet Inhalt einmal ein, wenn er in den Viewport kommt.
 * Ohne JavaScript und bei bereits sichtbaren Elementen bleibt alles stehen.
 * Dauer und Weg kommen aus den Tokens, Reduced Motion regeln die Tokens.
 */
export function Reveal({ children, as: Tag = "div", index = 0, art = "aufsteigen", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Schon im Bild beim Laden: nicht verstecken, sonst flackert es
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.dataset.reveal = "wartet";
    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        if (!eintrag.isIntersecting) return;
        el.dataset.reveal = "sichtbar";
        beobachter.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={{ "--reveal-i": index } as CSSProperties}
      className={`${artKlasse[art]} ${className}`}
    >
      {children}
    </Tag>
  );
}
