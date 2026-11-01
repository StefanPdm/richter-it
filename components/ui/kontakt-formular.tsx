"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ANLIEGEN, THEMA_EREIGNIS, type Anliegen, type Thema } from "@/lib/kontakt-thema";

const feld =
  "w-full border border-border-strong bg-bg px-3.5 py-3 text-text placeholder:text-text-muted/70 transition-colors duration-(--dur-fast) focus:border-brand focus:outline-none";

const KNOPF: Record<Anliegen, string> = {
  Erstgespräch: "Gespräch anfragen",
  Angebot: "Angebot anfordern",
  Audit: "Audit anfragen",
  "Backup-Check": "Backup-Check anfragen",
};

/**
 * Kontaktformular mit den Feldern der bestehenden Website ("Worum geht es?"),
 * dazu wählbare Anliegen. Aufrufe auf der Seite (ThemaKnopf) belegen Anliegen
 * und Betreff vor, das Formular leuchtet kurz auf.
 * Präsentationsversion: sendet nichts. Beim Livegang an eine Server-Action
 * mit Validierung (zod), Honeypot, Mindest-Ausfüllzeit und Rate-Limit anbinden.
 */
export function KontaktFormular() {
  const [gesendet, setGesendet] = useState(false);
  const [anliegen, setAnliegen] = useState<Anliegen>("Erstgespräch");
  const [betreff, setBetreff] = useState("");
  const [nachricht, setNachricht] = useState("");
  const formular = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const empfange = (e: Event) => {
      const thema = (e as CustomEvent<Thema>).detail;
      setAnliegen(thema.anliegen);
      if (thema.betreff) setBetreff(thema.betreff);
      if (thema.nachricht) setNachricht(thema.nachricht);
      setGesendet(false);
      /* Kurz aufleuchten, sobald das Formular nach dem Sprung im Bild ist.
         Web Animations API: Eingaben bleiben erhalten, nichts wird neu aufgebaut. */
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.setTimeout(() => {
          formular.current?.animate(
            [
              { boxShadow: "0 0 0 0 var(--color-neon)" },
              { boxShadow: "0 0 0 3px var(--color-neon)", offset: 0.25 },
              { boxShadow: "0 0 0 0 transparent" },
            ],
            { duration: 1100, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
          );
        }, 450);
      }
    };
    window.addEventListener(THEMA_EREIGNIS, empfange);
    return () => window.removeEventListener(THEMA_EREIGNIS, empfange);
  }, []);

  function absenden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGesendet(true);
  }

  return (
    <form
      ref={formular}
      onSubmit={absenden}
      className="hud-rahmen grid gap-4 border border-border bg-surface/90 p-[clamp(1.5rem,3vw,2.5rem)]"
    >
      <h3 className="text-h3">Worum geht es?</h3>

      <fieldset className="grid gap-2">
        <legend className="daten mb-2">Anliegen</legend>
        <div className="flex flex-wrap gap-2">
          {ANLIEGEN.map((a) => (
            <label key={a} className="cursor-pointer">
              <input
                type="radio"
                name="anliegen"
                value={a}
                checked={anliegen === a}
                onChange={() => setAnliegen(a)}
                className="peer sr-only"
              />
              <span className="daten inline-flex min-h-11 items-center border border-border px-3.5 transition-colors duration-(--dur-fast) peer-checked:border-brand peer-checked:bg-brand-soft peer-checked:text-text peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-text-muted">
                {a}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

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
        <input
          id="kf-betreff"
          name="betreff"
          value={betreff}
          onChange={(e) => setBetreff(e.target.value)}
          className={feld}
          placeholder="z. B. Backup dauert zu lange"
        />
      </label>
      <label className="grid gap-1.5" htmlFor="kf-nachricht">
        <span className="daten">Nachricht</span>
        <textarea
          id="kf-nachricht"
          name="nachricht"
          rows={4}
          value={nachricht}
          onChange={(e) => setNachricht(e.target.value)}
          className={`${feld} resize-y`}
        />
      </label>
      <p className="text-xs text-text-muted">
        Mit dem Absenden werden Ihre Angaben zur Bearbeitung der Anfrage verwendet. Details in der Datenschutzerklärung.
      </p>
      <button
        type="submit"
        className="schnitt zucken inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 justify-self-start bg-brand-dark px-6 py-3 text-sm font-medium text-text-inverse transition-[transform,background-color] duration-(--dur-fast) ease-out hover:bg-brand-darker active:scale-(--press-scale)"
      >
        {KNOPF[anliegen]} <span aria-hidden="true">→</span>
      </button>
      <p role="status" className="text-sm text-brand-dark">
        {gesendet && "Präsentationsversion: Das Formular wird beim Livegang angebunden. Bis dahin bitte anrufen oder mailen."}
      </p>
    </form>
  );
}
