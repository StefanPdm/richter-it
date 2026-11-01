/** Annahmen und Quellen des Souveränitäts-Checks (Server-Komponente, reiner Text) */
export function SouveraenitaetCheckAnnahmen() {
  return (
    <>
      <p>
        Zehn Fragen, je zwei zu fünf Bereichen: Daten, Lizenzen, Identität, Betrieb und Ausstieg. Jede Antwort zählt
        2 Punkte (unabhängig), 1 Punkt (teilweise) oder 0 Punkte (abhängig).
      </p>
      <p>
        Der Wert je Bereich ist der Anteil der möglichen Punkte. Der Gesamtwert ist der Mittelwert der fünf Bereiche,
        alle Bereiche zählen gleich viel. Ab 75 % gilt das Ergebnis als weitgehend unabhängig, ab 45 % als teilweise
        abhängig, darunter als stark abhängig.
      </p>
      <p>
        Die ersten Schritte gelten den drei Bereichen mit dem niedrigsten Wert. Das Ergebnis ist eine Ersteinschätzung
        aus Ihren eigenen Angaben, kein Audit. Es ersetzt keine Prüfung Ihrer tatsächlichen Umgebung und keine
        rechtliche Beratung.
      </p>
    </>
  );
}
