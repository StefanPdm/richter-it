/** Annahmen und Quellen des Werkzeugs (Server-Komponente, reiner Text) */
export function AusfallNetzAnnahmen() {
  return (
    <>
      <p>
        Das Netz ist ein vereinfachtes, typisches Modell einer kleinen oder mittleren IT-Umgebung, nicht Ihre echte
        Umgebung. Es zeigt das Prinzip: welche Systeme von welchen abhängen und wo ein einzelnes System ohne Ausweichweg
        den Betrieb trägt.
      </p>
      <p>
        Eine Linie bedeutet „braucht“. Fällt ein System aus, fallen alle Systeme mit aus, die es direkt oder über andere
        brauchen. Echte Umgebungen haben mehr Abhängigkeiten, etwa Lizenzserver, Zertifikate oder Cloud-Dienste.
      </p>
      <p>
        „Doppelt ausgelegt“ heißt: Ein zweites System übernimmt bei einem Ausfall ohne Ihr Zutun, zum Beispiel ein
        zweiter Host im Cluster, eine zweite Internetleitung oder eine zweite USV. Eine Sicherung allein ist keine
        doppelte Auslegung, denn das Zurückspielen kostet Zeit.
      </p>
      <p>
        Als einzelne Schwachstelle zählt ein System, das nicht doppelt ausgelegt ist und bei einem Ausfall mindestens drei
        weitere Systeme mitreißt.
      </p>
    </>
  );
}
