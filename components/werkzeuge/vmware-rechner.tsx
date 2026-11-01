"use client";

import { useState } from "react";
import { proxmoxPreise } from "@/lib/werkzeuge";
import { ErgebnisKnopf, Feld, Kennwert, Regler, Wahl, euro, format } from "./bausteine";

type StufeId = (typeof proxmoxPreise.stufen)[number]["id"];

const JAHRE = 3;

/**
 * VMware-Ausstiegsrechner: heutige VMware-Kosten (Eingabe des Besuchers) gegen
 * Proxmox-Subscription je CPU-Sockel (offizielle Preisliste, siehe lib/werkzeuge.ts).
 * Keine VMware-Preise im Code: die einzige VMware-Zahl ist die Eingabe.
 */
export function VmwareRechner() {
  const [vmware, setVmware] = useState(18000);
  const [hosts, setHosts] = useState(3);
  const [sockelJeHost, setSockelJeHost] = useState(2);
  const [stufeId, setStufeId] = useState<StufeId>("standard");
  const [aufwand, setAufwand] = useState(0);

  const stufe = proxmoxPreise.stufen.find((s) => s.id === stufeId) ?? proxmoxPreise.stufen[2];
  const sockel = hosts * sockelJeHost;
  const proxmoxJahr = sockel * stufe.preis;
  const diffJahr = vmware - proxmoxJahr;
  const vmwareGesamt = vmware * JAHRE;
  const proxmoxGesamt = proxmoxJahr * JAHRE + aufwand;
  const diffGesamt = vmwareGesamt - proxmoxGesamt;
  const amortisation = aufwand > 0 && diffJahr > 0 ? Math.ceil(aufwand / (diffJahr / 12)) : null;
  const guenstiger = diffJahr > 0;

  /* Balken über 3 Jahre: längster Balken = volle Breite */
  const max = Math.max(vmwareGesamt, proxmoxGesamt, 1);
  const anteilVmware = vmwareGesamt / max;
  const anteilProxmox = proxmoxGesamt / max;
  const anteilAufwand = proxmoxGesamt > 0 ? aufwand / proxmoxGesamt : 0;

  const nachricht = [
    "Ergebnis aus dem VMware-Ausstiegsrechner:",
    `- Heutige VMware-Kosten: ${euro(vmware)} pro Jahr (meine Angabe)`,
    `- ${hosts} Hosts mit je ${sockelJeHost} CPU-Sockeln = ${sockel} Sockel`,
    `- Proxmox ${stufe.name}: ${euro(proxmoxJahr)} pro Jahr (${euro(stufe.preis)} je Sockel, Stand ${proxmoxPreise.stand})`,
    `- Differenz pro Jahr: ${euro(diffJahr)}`,
    aufwand > 0 ? `- Geschätzter Umstiegsaufwand: ${euro(aufwand)}` : null,
    `- Differenz über ${JAHRE} Jahre: ${euro(diffGesamt)}`,
    amortisation ? `- Amortisiert nach etwa ${amortisation} Monaten` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="grid items-start gap-(--gap-karten) lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
      <Feld titel="Ihre Umgebung">
        <Regler
          label="Heutige VMware-Kosten pro Jahr"
          wert={vmware}
          min={0}
          max={200000}
          schritt={500}
          anzeige={euro}
          hinweis="Lizenzen und Subscriptions laut Ihrer letzten Rechnung."
          onChange={setVmware}
        />
        <Regler label="Anzahl Hosts" wert={hosts} min={1} max={32} onChange={setHosts} />
        <Regler
          label="CPU-Sockel je Host"
          wert={sockelJeHost}
          min={1}
          max={4}
          hinweis="Belegte Prozessor-Sockel, nicht Kerne. Die Kernzahl spielt bei Proxmox keine Rolle."
          onChange={setSockelJeHost}
        />
        <div className="grid gap-3">
          <Wahl
            legende="Proxmox-Subscription"
            optionen={proxmoxPreise.stufen.map((s) => ({ wert: s.id, label: `${s.name} · ${euro(s.preis)}` }))}
            wert={stufeId}
            onChange={setStufeId}
          />
          <p className="text-sm text-text-muted">
            {stufe.leistung}. Preis je CPU-Sockel und Jahr, netto.
            {stufe.id === "community" && (
              <span className="mt-1 block text-brand-dark">Laut Proxmox nicht für den Produktivbetrieb gedacht.</span>
            )}
          </p>
        </div>
        <Regler
          label="Einmaliger Umstiegsaufwand (Ihre Schätzung)"
          wert={aufwand}
          min={0}
          max={100000}
          schritt={500}
          anzeige={euro}
          hinweis="Ihre eigene Schätzung für Planung und Migration. Den tatsächlichen Aufwand klärt ein Gespräch."
          onChange={setAufwand}
        />
      </Feld>

      <Feld titel="Ergebnis" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
        <div aria-live="polite" className="grid gap-5 sm:grid-cols-2">
          <Kennwert label="Proxmox pro Jahr" wert={euro(proxmoxJahr)} zusatz={`${sockel} Sockel × ${euro(stufe.preis)}`} />
          <Kennwert
            label={guenstiger ? "Ersparnis pro Jahr" : "Mehrkosten pro Jahr"}
            wert={euro(Math.abs(diffJahr))}
            betont={guenstiger}
          />
          <Kennwert
            label={diffGesamt >= 0 ? `Ersparnis über ${JAHRE} Jahre` : `Mehrkosten über ${JAHRE} Jahre`}
            wert={euro(Math.abs(diffGesamt))}
            zusatz={aufwand > 0 ? "inklusive Umstiegsaufwand" : undefined}
            betont={diffGesamt > 0}
          />
          {amortisation !== null && (
            <Kennwert label="Amortisiert nach" wert={`${format(amortisation)} Mon.`} zusatz="bei gleichbleibenden Kosten" />
          )}
        </div>

        <figure className="grid gap-3">
          <figcaption className="daten">Kosten über {JAHRE} Jahre</figcaption>
          <div className="grid gap-2">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span>VMware</span>
              <span className="font-mono">{euro(vmwareGesamt)}</span>
            </div>
            <div className="h-2.5 bg-bg" aria-hidden="true">
              <div
                className="h-full origin-left bg-border-strong transition-transform duration-(--dur-base) ease-(--ease-out)"
                style={{ transform: `scaleX(${anteilVmware})` }}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span>Proxmox {stufe.name}</span>
              <span className="font-mono">{euro(proxmoxGesamt)}</span>
            </div>
            <div className="h-2.5 bg-bg" aria-hidden="true">
              <div
                className="flex h-full origin-left transition-transform duration-(--dur-base) ease-(--ease-out)"
                style={{ transform: `scaleX(${anteilProxmox})` }}
              >
                <div className="h-full bg-brand" style={{ flexGrow: 1 - anteilAufwand }} />
                {aufwand > 0 && <div className="h-full bg-brand/40" style={{ flexGrow: anteilAufwand }} />}
              </div>
            </div>
            {aufwand > 0 && <span className="text-xs text-text-muted">Heller Teil: Ihr geschätzter Umstiegsaufwand</span>}
          </div>
        </figure>

        {!guenstiger && (
          <p className="text-sm text-text-muted">
            Mit diesen Werten ist Proxmox teurer als Ihre heutige Lösung. Ein Wechsel kann sich trotzdem lohnen, etwa wegen
            Unabhängigkeit vom Hersteller. Das lässt sich im Gespräch einordnen.
          </p>
        )}

        <p className="text-xs text-text-muted">
          Proxmox-Preise laut offizieller Preisliste, Stand {proxmoxPreise.stand}. Alle Knoten eines Clusters brauchen
          dieselbe Stufe.
        </p>

        <ErgebnisKnopf thema={{ anliegen: "Angebot", betreff: "VMware-Ausstieg: Umstieg auf Proxmox", nachricht }} />
      </Feld>
    </div>
  );
}
