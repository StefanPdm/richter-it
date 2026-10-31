import { Reveal } from "@/components/motion/reveal";
import { backupFall, istOffen } from "@/lib/inhalte";
import { BackupBalken } from "./backup-balken";
import { ThemaKnopf } from "@/components/ui/thema-knopf";

/** Messleiste unter dem Hero: die Kernzahl in einer Zeile. */
export function Messleiste() {
  const { groesse, vorherMinuten, nachherMinuten } = backupFall;
  return (
    <div className="border-b border-border bg-bg-alt transition-colors duration-(--dur-welt)">
      <div className="mx-auto flex max-w-wide flex-wrap items-baseline gap-x-10 gap-y-3 px-(--gutter) py-4.5">
        <span className="daten">
          Backup · Maschine <b className="font-medium text-brand-dark">{groesse}</b>
        </span>
        <span className="daten">
          Vorher <b className="font-medium text-brand-dark">{String(vorherMinuten / 60).padStart(2, "0")}:00 h</b> → Nachher{" "}
          <b className="font-medium text-brand-dark">00:{nachherMinuten} h</b>
        </span>
        <span className="daten">
          Faktor <b className="font-medium text-brand-dark">{Math.round(vorherMinuten / nachherMinuten)}</b>
        </span>
        <a href="#messung" className="daten ml-auto">
          Zur Messung
        </a>
      </div>
    </div>
  );
}

/** Die Backup-Messung als Signature-Moment der Seite. */
export function Messung() {
  return (
    <section id="messung" aria-labelledby="messung-titel" className="scroll-mt-(--header-h) py-(--section-y)">
      <div className="mx-auto grid max-w-wide gap-[clamp(2rem,5vw,5rem)] px-(--gutter) md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start">
        <Reveal className="grid gap-5">
          <h2 id="messung-titel" className="titel-linie titel-glitch text-h2">
            Ein Backup, das nicht mehr die ganze Nacht braucht.
          </h2>
          <span className="daten">
            Kundenprojekt · <span className="offen">{backupFall.branche}</span>
          </span>
          <p className="max-w-measure text-text-muted">
            Die Sicherung einer {backupFall.groesse} großen Maschine dauerte acht Stunden. Nach der Optimierung dauert sie
            15 Minuten. Die bestehende Umgebung blieb dabei weitgehend, wie sie war.
          </p>
          <p className={`max-w-measure ${istOffen(backupFall.einordnung) ? "offen" : "text-text-muted"}`}>
            {backupFall.einordnung}
          </p>
        </Reveal>
        <Reveal index={1} className="grid gap-6">
          <BackupBalken vorherMinuten={backupFall.vorherMinuten} nachherMinuten={backupFall.nachherMinuten} />
          <p className="max-w-measure text-sm text-text-muted">
            Messwert aus einem einzelnen Kundenprojekt, veröffentlicht mit Freigabe. Wie viel in Ihrer Umgebung möglich
            ist, hängt von der Ausgangslage ab.
          </p>
          <ThemaKnopf thema={{ anliegen: "Backup-Check", betreff: "Backup-Check: Sicherung dauert zu lange" }} className="justify-self-start">
            Backup-Check anfragen
          </ThemaKnopf>
        </Reveal>
      </div>
    </section>
  );
}
