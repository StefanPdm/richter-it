import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** page = 1200px (Standard), wide = 1440px (Erlebnis), measure = Lesebreite */
  breite?: "page" | "wide" | "measure";
  className?: string;
};

const breiten = {
  page: "max-w-page",
  wide: "max-w-wide",
  measure: "max-w-measure",
} as const;

/** Inhaltsbreite mit Seitenrand aus --gutter. */
export function Container({ children, breite = "page", className = "" }: Props) {
  return <div className={`mx-auto w-full px-(--gutter) ${breiten[breite]} ${className}`}>{children}</div>;
}
