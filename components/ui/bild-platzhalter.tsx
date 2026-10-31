type Props = {
  /** Was auf dem Bild zu sehen sein soll */
  motiv: string;
  /** Seitenverhältnis, z. B. "16/9", "4/5", "1/1" */
  format?: string;
  className?: string;
};

/**
 * Platzhalter im Entwurf. Wird vor Livegang durch next/image ersetzt:
 * AVIF/WebP, width/height, sprechender Alt-Text, LCP-Bild mit priority.
 */
export function BildPlatzhalter({ motiv, format = "16/9", className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={`Platzhalter: ${motiv}`}
      style={{ aspectRatio: format }}
      className={`flex w-full items-end bg-bg-alt p-4 text-xs text-text-muted ${className}`}
    >
      <span>
        Bild: {motiv} · {format.replace("/", ":")}
      </span>
    </div>
  );
}
