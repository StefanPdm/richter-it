import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primary" | "secondary" | "inverse";

type Gemeinsam = {
  children: ReactNode;
  variante?: Variante;
  /** Pfeil rechts, bewegt sich beim Hover um 2px */
  pfeil?: boolean;
  className?: string;
};

type AlsLink = Gemeinsam & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AlsButton = Gemeinsam & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

const basis =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-6 py-3 font-ui text-sm font-medium " +
  "transition-[transform,background-color,color,border-color] duration-(--dur-fast) ease-out " +
  "active:scale-(--press-scale) active:duration-(--dur-press) " +
  "disabled:pointer-events-none disabled:opacity-50";

const varianten: Record<Variante, string> = {
  primary: "bg-brand-dark text-text-inverse hover:bg-brand-darker",
  secondary: "border border-brand-dark text-brand-dark hover:bg-brand-soft",
  inverse: "bg-text-on-dark text-bg-dark hover:bg-white",
};

function Pfeil() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 transition-transform duration-(--dur-fast) ease-out [@media(hover:hover)]:group-hover:translate-x-0.5"
    >
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Eine Hauptaktion pro Sektion: variante="primary". */
export function Button(props: AlsLink | AlsButton) {
  const { children, variante = "primary", pfeil = false, className = "", ...rest } = props;
  const klassen = `${basis} ${varianten[variante]} ${className}`;
  const inhalt = (
    <>
      {children}
      {pfeil && <Pfeil />}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<AlsLink, keyof Gemeinsam>)} className={klassen}>
        {inhalt}
      </Link>
    );
  }
  return (
    <button type="button" {...(rest as Omit<AlsButton, keyof Gemeinsam>)} className={klassen}>
      {inhalt}
    </button>
  );
}
