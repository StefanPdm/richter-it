"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { backupAblauf } from "@/lib/inhalte";
import { useSichtbar } from "@/lib/hooks";
import { SCHRITTE, fortschrittVon } from "@/components/three/fortschritt";
import { BackupFlussPoster } from "@/components/three/backup-fluss-poster";
import { ThemaKnopf } from "@/components/ui/thema-knopf";

/* three.js nur laden, wenn die Szene gebraucht wird; bis dahin steht die Ersatzgrafik */
const BackupFlussCanvas = dynamic(() => import("@/components/three/backup-fluss-canvas"), {
  ssr: false,
  loading: () => <BackupFlussPoster />,
});

const RUHIG = "(prefers-reduced-motion: reduce)";
let webgl2: boolean | undefined;

function abonnieren(melden: () => void) {
  const mq = window.matchMedia(RUHIG);
  mq.addEventListener("change", melden);
  return () => mq.removeEventListener("change", melden);
}
/* 3D nur bei: Bewegung erlaubt, kein Datensparen, WebGL2 vorhanden (3d.md) */
function darf3d() {
  if (window.matchMedia(RUHIG).matches) return false;
  const verbindung = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (verbindung?.saveData) return false;
  webgl2 ??= !!document.createElement("canvas").getContext("webgl2");
  return webgl2;
}

const LISTE_ID = "backup-ablauf-schritte";

/** Backup-Ablauf in fünf Schritten: Text links, 3D-Szene klebt daneben und folgt dem Scrollen. */
export function BackupAblauf() {
  const buehne = useRef<HTMLDivElement>(null);
  const nah = useSichtbar(buehne, { einmal: true, schwelle: 0 });
  const mit3d = useSyncExternalStore(abonnieren, darf3d, () => false);
  const [aktiv, setAktiv] = useState(0);

  useEffect(() => {
    const liste = document.getElementById(LISTE_ID);
    if (!liste) return;
    let wartet = 0;
    const melden = () => {
      wartet = 0;
      setAktiv(Math.min(SCHRITTE - 1, Math.floor(fortschrittVon(liste) * SCHRITTE)));
    };
    const beimScrollen = () => {
      if (!wartet) wartet = requestAnimationFrame(melden);
    };
    wartet = requestAnimationFrame(melden);
    window.addEventListener("scroll", beimScrollen, { passive: true });
    window.addEventListener("resize", beimScrollen);
    return () => {
      cancelAnimationFrame(wartet);
      window.removeEventListener("scroll", beimScrollen);
      window.removeEventListener("resize", beimScrollen);
    };
  }, []);

  const schritt = backupAblauf[aktiv];

  return (
    <section
      id="backup-ablauf"
      aria-labelledby="backup-ablauf-titel"
      className="scroll-mt-(--header-h) border-y border-border bg-bg-alt py-(--section-y) transition-colors duration-(--dur-welt)"
    >
      <div className="mx-auto grid max-w-wide gap-5 px-(--gutter)">
        <span className="daten">Backup-Fluss · Proxmox Backup</span>
        <h2 id="backup-ablauf-titel" className="titel-linie max-w-[22ch] text-h2">
          Fünf Schritte vom Server bis zur geprüften Kopie.
        </h2>
        <p className="max-w-measure text-text-muted">
          So läuft eine Sicherung, die nicht die ganze Nacht braucht. Scrollen Sie durch die Schritte, die Grafik folgt.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-wide flex-col px-(--gutter) md:mt-14 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-[clamp(2rem,5vw,5rem)]">
        {/* Bühne: auf dem Handy klebt sie oben über dem Text, breit rechts daneben */}
        <div
          ref={buehne}
          aria-hidden="true"
          className="sticky top-(--header-h) z-10 -mx-(--gutter) h-[34svh] border-b border-border bg-bg-alt transition-colors duration-(--dur-welt) md:top-[calc(var(--header-h)+2rem)] md:col-start-2 md:row-start-1 md:mx-0 md:h-[min(58svh,34rem)] md:self-start md:border md:bg-bg"
        >
          <div className="hud-rahmen relative size-full overflow-hidden">
            {mit3d && nah ? <BackupFlussCanvas quelleId={LISTE_ID} /> : <BackupFlussPoster />}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4">
              <span className="daten">Schema</span>
              <span className="daten text-text">
                <span className="text-brand-dark">{String(aktiv + 1).padStart(2, "0")}</span> / 0{SCHRITTE} · {schritt.kurz}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
              <span className="daten">Standort A</span>
              <span className="daten">Standort B</span>
            </div>
          </div>
        </div>

        <ol id={LISTE_ID} className="relative md:col-start-1 md:row-start-1">
          {backupAblauf.map((s, i) => (
            <li key={s.kurz} className="flex min-h-[62svh] items-center md:min-h-[78svh]">
              <article
                data-aktiv={i === aktiv}
                className="schritt grid gap-3 border-l-2 border-border py-2 pl-5 data-[aktiv=true]:border-brand"
              >
                <span className="daten">
                  <span className="text-brand-dark">{String(i + 1).padStart(2, "0")}</span> · {s.kurz}
                </span>
                <h3 className="text-h3 font-medium">{s.titel}</h3>
                <p className="max-w-measure text-text-muted">{s.text}</p>
                {i === backupAblauf.length - 1 && (
                  <ThemaKnopf
                    thema={{ anliegen: "Backup-Check", betreff: "Backup-Check: Ablauf und Wiederherstellung prüfen" }}
                    className="mt-3 justify-self-start"
                  >
                    Backup-Check anfragen
                  </ThemaKnopf>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
