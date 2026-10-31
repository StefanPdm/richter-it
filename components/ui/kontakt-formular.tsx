"use client";

import { useState, type FormEvent } from "react";

const feld =
  "w-full border border-border-strong bg-bg px-3.5 py-3 text-text placeholder:text-text-muted/70 transition-colors duration-(--dur-fast) focus:border-brand focus:outline-none";

/**
 * Kontaktformular mit den Feldern der bestehenden Website ("Worum geht es?").
 * Präsentationsversion: sendet nichts. Beim Livegang an eine Server-Action
 * mit Validierung (zod), Honeypot, Mindest-Ausfüllzeit und Rate-Limit anbinden
 * (qualitaet.md, Security).
 */
export function KontaktFormular() {
  const [gesendet, setGesendet] = useState(false);

  function absenden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGesendet(true);
  }

  return (
    <form onSubmit={absenden} className="hud-rahmen grid gap-4 border border-border bg-surface/90 p-[clamp(1.5rem,3vw,2.5rem)]" noValidate={false}>
      <h3 className="text-h3">Worum geht es?</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5" htmlFor="kf-name">
          <span className="daten">Name *</span>
          <input id="kf-name" name="name" required autoComplete="name" className={feld} />
        </label>
        <label className="grid gap-1.5" htmlFor="kf-mail">
          <span className="daten">E-Mail *</span>
          <input id="kf-mail" name="email" type="email" required autoComplete="email" className={feld} />
        </label>
      </div>
      <label className="grid gap-1.5" htmlFor="kf-betreff">
        <span className="daten">Betreff</span>
        <input id="kf-betreff" name="betreff" className={feld} placeholder="z. B. Backup dauert zu lange" />
      </label>
      <label className="grid gap-1.5" htmlFor="kf-nachricht">
        <span className="daten">Nachricht</span>
        <textarea id="kf-nachricht" name="nachricht" rows={4} className={`${feld} resize-y`} />
      </label>
      <p className="text-xs text-text-muted">
        Mit dem Absenden werden Ihre Angaben zur Bearbeitung der Anfrage verwendet. Details in der Datenschutzerklärung.
      </p>
      <button
        type="submit"
        className="schnitt zucken inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 justify-self-start bg-brand-dark px-6 py-3 text-sm font-medium text-text-inverse transition-[transform,background-color] duration-(--dur-fast) ease-out hover:bg-brand-darker active:scale-(--press-scale)"
      >
        Anfrage senden <span aria-hidden="true">→</span>
      </button>
      <p role="status" className="text-sm text-brand-dark">
        {gesendet && "Präsentationsversion: Das Formular wird beim Livegang angebunden. Bis dahin bitte anrufen oder mailen."}
      </p>
    </form>
  );
}
