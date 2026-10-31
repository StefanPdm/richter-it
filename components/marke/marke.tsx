import Link from "next/link";
import { site } from "@/lib/site";

type Props = {
  /** Höhe des Bildzeichens: klein (Header), gross (Footer) */
  groesse?: "klein" | "gross";
  className?: string;
};

/**
 * Bildzeichen (Originalform aus Daniels Logo, Farbe aus der Farbwelt)
 * plus Schriftzug in der Display-Schrift.
 */
export function Marke({ groesse = "klein", className = "" }: Props) {
  const bild = groesse === "klein" ? "h-10" : "h-16";
  return (
    <Link href="/" className={`flex items-center gap-3 no-underline ${className}`} aria-label={`${site.name}, Startseite`}>
      <span className={`logo-bild ${bild}`} aria-hidden="true" />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-2xl font-semibold [font-stretch:72%]">{site.name}</span>
        <span className="daten">{site.zusatz}</span>
      </span>
    </Link>
  );
}
