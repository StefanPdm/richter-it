type Licht = "links-oben" | "rechts-oben" | "links-unten" | "rechts-unten" | "mitte-unten";
type Motiv = "raster" | "lineal" | "puls" | "scan" | "marken" | "keins";

type Props = {
  /** Wo das leise Lichtfeld sitzt */
  licht: Licht;
  /** Technisches Motiv. Jede Sektion ein anderes, damit nicht überall dasselbe passiert */
  motiv?: Motiv;
  /** Warmer Ton in Bernstein statt Kobalt, für Sektionen nahe der Bildwelt */
  warm?: boolean;
};

/**
 * Dekorativer Hintergrund für Sektionen: ein sehr leiser Farbverlauf und ein kleines
 * technisches Motiv (Raster mit Messpunkten, Lineal, Datenpuls, Scanband, Passmarken).
 * Nur CSS, nur transform und opacity. Bei "weniger Bewegung" steht alles.
 * Die Sektion braucht "relative isolate overflow-hidden".
 */
export function Sektionsgrund({ licht, motiv = "keins", warm = false }: Props) {
  return (
    <div aria-hidden="true" className={`sektionsgrund sektionsgrund--${licht} ${warm ? "sektionsgrund--warm" : ""}`}>
      {motiv === "raster" && (
        <div className="sg-raster">
          <span className="sg-messpunkt" />
          <span className="sg-messpunkt" />
          <span className="sg-messpunkt" />
        </div>
      )}
      {motiv === "lineal" && <div className="sg-lineal" />}
      {motiv === "puls" && <div className="sg-puls" />}
      {motiv === "scan" && <div className="sg-scan" />}
      {motiv === "marken" && (
        <>
          <span className="sg-marke sg-marke--1" />
          <span className="sg-marke sg-marke--2" />
          <span className="sg-marke sg-marke--3" />
        </>
      )}
    </div>
  );
}
