/** Annahmen und Quellen des Cluster-Planers (Server-Komponente, reiner Text).
    BEISPIEL: Faustregeln aus der Praxis, von Daniel zu bestätigen. */
export function ClusterPlanerAnnahmen() {
  return (
    <>
      <p>Der Planer rechnet mit Faustregeln. Er liefert eine erste Größenordnung, keine fertige Planung.</p>
      <ul className="grid list-disc gap-1.5 pl-5">
        <li>Rechenleistung: 4 virtuelle CPUs je physischem Kern (Überbuchung 4:1).</li>
        <li>Arbeitsspeicher: wird nicht überbucht. Je Knoten bleiben 10 % für Proxmox und den ZFS-Cache frei.</li>
        <li>Der Puffer für Wachstum gilt für Arbeitsspeicher, Rechenleistung und Speicher gleichermaßen.</li>
        <li>Ceph: jede Datei liegt dreimal im Cluster, mindestens 3 Knoten.</li>
        <li>Lokaler Speicher mit ZFS-Replikation: zwei Kopien, mindestens 2 Knoten.</li>
        <li>Speicher wird höchstens zu 80 % gefüllt, damit Ceph und ZFS Luft zum Arbeiten haben.</li>
        <li>
          Reserve (N+1): ein zusätzlicher Knoten. Fällt einer aus, tragen die übrigen die Last. Der Speicher je Knoten
          ist so bemessen, dass die Daten auch ohne den Reserve-Knoten Platz haben.
        </li>
        <li>Knotengrößen sind typische Ausstattungen, keine bestimmten Modelle.</li>
      </ul>
      <p>Nicht enthalten: Netz, Backup-Speicher, Lizenzen, Strom und Klima.</p>
    </>
  );
}
