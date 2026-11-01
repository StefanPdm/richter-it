import { proxmoxPreise } from "@/lib/werkzeuge";

/** Annahmen und Quellen des VMware-Ausstiegsrechners (Server-Komponente, reiner Text) */
export function VmwareRechnerAnnahmen() {
  return (
    <>
      <p>
        Proxmox-Preise: offizielle Preisliste von Proxmox, netto je belegtem CPU-Sockel und Jahr, Stand{" "}
        {proxmoxPreise.stand}.{" "}
        <a href={proxmoxPreise.quelle} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
          Zur Preisliste
        </a>
        . Die Zahl der Kerne ändert den Preis nicht. Alle Knoten eines Clusters brauchen dieselbe Stufe. Die Stufen
        unterscheiden sich nur im Support, nicht im Funktionsumfang.
      </p>
      <p>
        VMware-Kosten: Der Rechner kennt keine VMware-Preise. Er rechnet mit dem Betrag, den Sie eingeben, zum Beispiel aus
        Ihrer letzten Rechnung.
      </p>
      <p>
        Nicht enthalten: Hardware, Arbeitszeit für Planung und Migration (außer Ihrer eigenen Schätzung), Schulung,
        Lizenzen für Backup-Server und andere Software, Preisänderungen in den kommenden Jahren.
      </p>
    </>
  );
}
