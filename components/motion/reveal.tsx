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
    let bild = 0;
    const zeigen = () => {
      el.dataset.reveal = "sichtbar";
      beobachter.disconnect();
      window.removeEventListener("scroll", pruefen);
      cancelAnimationFrame(bild);
    };
    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        if (eintrag.isIntersecting) zeigen();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    /* Bei schnellem Scrollen (Ankerlink, Sprung) kann ein Element in einem Bild von
       unterhalb nach oberhalb rutschen, ohne je als sichtbar gemeldet zu werden.
       Dann sofort zeigen, sobald es oberhalb der Unterkante liegt. */
    const pruefen = () => {
      cancelAnimationFrame(bild);
      bild = requestAnimationFrame(() => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) zeigen();
      });
    };
    beobachter.observe(el);
    window.addEventListener("scroll", pruefen, { passive: true });
    return () => {
      beobachter.disconnect();
      window.removeEventListener("scroll", pruefen);
      cancelAnimationFrame(bild);
    };
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
