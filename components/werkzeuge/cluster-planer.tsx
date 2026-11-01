"use client";

import { useState } from "react";
import { ErgebnisKnopf, Feld, Kennwert, Regler, Wahl, format } from "./bausteine";

/*
 * Cluster-Planer: erste Größenordnung für einen Proxmox-Cluster.
 * Alle Faustregeln stehen hier oben und in cluster-planer-annahmen.tsx.
 */

// BEISPIEL: Faustregeln, von Daniel zu bestätigen
const UEBERBUCHUNG = 4; // vCPU je physischem Kern
const RESERVE_HOST = 0.1; // Anteil RAM je Knoten für Proxmox und ZFS-Cache
const FUELLGRAD = 0.8; // Speicher höchstens zu 80 % füllen

const SPEICHER = {
  ceph: { label: "Ceph, im Cluster verteilt", kopien: 3, minKnoten: 3 }, // BEISPIEL: 3 Kopien, mindestens 3 Knoten
  zfs: { label: "Lokal mit ZFS-Replikation", kopien: 2, minKnoten: 2 }, // BEISPIEL: 2 Kopien, mindestens 2 Knoten
} as const;
type SpeicherArt = keyof typeof SPEICHER;

const GROESSEN = {
  klein: { label: "Klein · 32 Kerne, 256 GB", kerne: 32, ram: 256 }, // BEISPIEL
  mittel: { label: "Mittel · 64 Kerne, 512 GB", kerne: 64, ram: 512 }, // BEISPIEL
  gross: { label: "Groß · 96 Kerne, 1.024 GB", kerne: 96, ram: 1024 }, // BEISPIEL
} as const;
type Groesse = keyof typeof GROESSEN;

const RACK_MAX = 16;

function rechne(e: {
  vms: number;
  vcpu: number;
  ram: number;
  platte: number;
  puffer: number;
  art: SpeicherArt;
  groesse: Groesse;
  reserve: boolean;
}) {
  const s = SPEICHER[e.art];
  const k = GROESSEN[e.groesse];
  const faktor = 1 + e.puffer / 100;
  const ramBedarf = e.vms * e.ram * faktor; // GB, ohne Host-Reserve
  const ramNutzbarJeKnoten = k.ram * (1 - RESERVE_HOST);
  const kernBedarf = (e.vms * e.vcpu * faktor) / UEBERBUCHUNG;
  const basis = Math.max(s.minKnoten, Math.ceil(Math.max(ramBedarf / ramNutzbarJeKnoten, kernBedarf / k.kerne)));
  const knoten = basis + (e.reserve ? 1 : 0);
  const netto = (e.vms * e.platte * faktor) / 1000; // TB belegt inkl. Puffer
  const roh = (netto * s.kopien) / FUELLGRAD; // TB Rohspeicher
  /* Je Knoten so viel, dass die Daten auch ohne den Reserve-Knoten Platz haben */
  const rohJeKnoten = roh / basis;
  return {
    knoten,
    ramGesamt: knoten * k.ram,
    ramBedarf,
    kerneGesamt: knoten * k.kerne,
    kernBedarf,
    roh,
    rohJeKnoten,
    ramAuslastung: ramBedarf / (knoten * ramNutzbarJeKnoten),
    cpuAuslastung: kernBedarf / (knoten * k.kerne),
    ramBeiAusfall: ramBedarf / ((knoten - 1) * ramNutzbarJeKnoten),
    cpuBeiAusfall: kernBedarf / ((knoten - 1) * k.kerne),
  };
}

const prozent = (x: number) => `${format(Math.round(x * 100))} %`;

/** Auslastung als dünner Balken; rot, wenn die Last nach einem Ausfall nicht mehr passt */
function Balken({ label, wert, ausfall }: { label: string; wert: number; ausfall?: number }) {
  const kritisch = (ausfall ?? wert) > 1;
  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="daten">{label}</span>
        <span className="font-mono text-sm">
          {prozent(wert)}
          {ausfall !== undefined && (
            <span className={kritisch ? "text-error" : "text-text-muted"}> · {prozent(ausfall)} bei Ausfall</span>
          )}
        </span>
      </div>
      <div className="relative h-1.5 overflow-hidden bg-border" aria-hidden="true">
        <div
          className="absolute inset-0 origin-left bg-brand transition-transform duration-(--dur-base) ease-(--ease-out)"
          style={{ transform: `scaleX(${Math.min(1, wert)})` }}
        />
      </div>
    </div>
  );
}

/** Rack mit Einschüben, Reserve-Knoten gestrichelt */
function Rack({ knoten, reserve }: { knoten: number; reserve: boolean }) {
  const sichtbar = Math.min(knoten, RACK_MAX);
  const weitere = knoten - sichtbar;
  return (
    <figure className="grid content-start gap-2">
      <figcaption className="daten">Rack · {knoten} Knoten</figcaption>
      <ul className="grid gap-1 border border-border-strong p-2" aria-hidden="true">
        {Array.from({ length: sichtbar }, (_, i) => {
          const istReserve = reserve && i === sichtbar - 1 && weitere === 0;
          return (
            <li
              key={i}
              className={`flex h-6 items-center justify-between gap-3 px-2.5 ${
                istReserve ? "border border-dashed border-border-strong" : "border border-border bg-bg"
              }`}
            >
              <span className="font-mono text-[0.625rem] text-text-muted">
                {istReserve ? "Reserve" : `pve-${String(i + 1).padStart(2, "0")}`}
              </span>
              <span className="flex gap-1">
                <span className={`size-1.5 ${istReserve ? "bg-border-strong" : "bg-success"}`} />
                <span className={`size-1.5 ${istReserve ? "bg-border-strong" : "bg-brand"}`} />
              </span>
            </li>
          );
        })}
        {weitere > 0 && (
          <li className="px-2.5 py-1 font-mono text-[0.625rem] text-text-muted">
            + {weitere} weitere{reserve ? ", davon 1 Reserve" : ""}
          </li>
        )}
      </ul>
    </figure>
  );
}

export function ClusterPlaner() {
  const [vms, setVms] = useState(25);
  const [vcpu, setVcpu] = useState(4);
  const [ram, setRam] = useState(8);
  const [platte, setPlatte] = useState(150);
  const [puffer, setPuffer] = useState(30);
  const [art, setArt] = useState<SpeicherArt>("ceph");
  const [groesse, setGroesse] = useState<Groesse>("mittel");
  const [reserve, setReserve] = useState<"an" | "aus">("an");

  const mitReserve = reserve === "an";
  const r = rechne({ vms, vcpu, ram, platte, puffer, art, groesse, reserve: mitReserve });
  const k = GROESSEN[groesse];

  const nachricht = [
    "Ergebnis aus dem Cluster-Planer:",
    `- ${vms} VMs, je ${vcpu} vCPU, ${ram} GB RAM, ${platte} GB Speicher, Puffer ${puffer} %`,
    `- Speicher: ${SPEICHER[art].label}, Knoten: ${k.label}`,
    `- Vorschlag: ${r.knoten} Knoten${mitReserve ? " (inkl. 1 Reserve)" : ""}, ${format(r.ramGesamt)} GB RAM, ${format(r.kerneGesamt)} Kerne`,
    `- Rohspeicher: ${format(r.roh, 1)} TB, ${format(r.rohJeKnoten, 1)} TB je Knoten`,
    "Ich würde das gern mit Ihnen durchgehen.",
  ].join("\n");

  return (
    <div className="grid gap-(--gap-karten) lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
      <Feld titel="Ihre Maschinen">
        <div className="grid gap-5">
          <Regler label="Virtuelle Maschinen" wert={vms} min={1} max={300} onChange={setVms} />
          <Regler label="vCPU je VM, Durchschnitt" wert={vcpu} min={1} max={16} onChange={setVcpu} />
          <Regler label="Arbeitsspeicher je VM" wert={ram} min={1} max={128} einheit="GB" onChange={setRam} />
          <Regler label="Belegter Speicher je VM" wert={platte} min={10} max={2000} schritt={10} einheit="GB" onChange={setPlatte} />
          <Regler
            label="Puffer für Wachstum"
            wert={puffer}
            min={0}
            max={100}
            schritt={5}
            einheit="%"
            hinweis="Gilt für Arbeitsspeicher, Rechenleistung und Speicher."
            onChange={setPuffer}
          />
        </div>
        <Wahl
          legende="Speicher"
          optionen={(Object.keys(SPEICHER) as SpeicherArt[]).map((id) => ({ wert: id, label: SPEICHER[id].label }))}
          wert={art}
          onChange={setArt}
        />
        <Wahl
          legende="Größe je Knoten"
          optionen={(Object.keys(GROESSEN) as Groesse[]).map((id) => ({ wert: id, label: GROESSEN[id].label }))}
          wert={groesse}
          onChange={setGroesse}
        />
        <Wahl
          legende="Reserve für den Ausfall eines Knotens (N+1)"
          optionen={[
            { wert: "an", label: "Mit Reserve" },
            { wert: "aus", label: "Ohne Reserve" },
          ]}
          wert={reserve}
          onChange={setReserve}
        />
      </Feld>

      <Feld titel="Vorschlag" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,11rem)]">
          <div className="grid content-start gap-5" aria-live="polite">
            <Kennwert label="Knoten" wert={String(r.knoten)} zusatz={mitReserve ? `davon 1 als Reserve · ${k.label}` : k.label} betont />
            <div className="grid grid-cols-2 gap-5">
              <Kennwert label="Arbeitsspeicher" wert={`${format(r.ramGesamt)} GB`} zusatz={`belegt ${format(r.ramBedarf)} GB`} />
              <Kennwert label="Kerne" wert={format(r.kerneGesamt)} zusatz={`benötigt ${format(r.kernBedarf, 1)}`} />
              <Kennwert label="Rohspeicher" wert={`${format(r.roh, 1)} TB`} zusatz={`${SPEICHER[art].kopien} Kopien, max. 80 % voll`} />
              <Kennwert label="Je Knoten" wert={`${format(r.rohJeKnoten, 1)} TB`} zusatz="Rohspeicher" />
            </div>
          </div>
          <Rack knoten={r.knoten} reserve={mitReserve} />
        </div>

        <div className="grid gap-4 border-t border-border pt-5">
          <Balken label="Auslastung RAM" wert={r.ramAuslastung} ausfall={r.knoten > 1 ? r.ramBeiAusfall : undefined} />
          <Balken label="Auslastung CPU" wert={r.cpuAuslastung} ausfall={r.knoten > 1 ? r.cpuBeiAusfall : undefined} />
        </div>

        <p className="text-sm text-text-muted">
          Eine erste Größenordnung, keine Planung. Netz, Backup, Lizenzen und die tatsächliche Last Ihrer Maschinen kommen im
          Gespräch dazu. Hardware beziehe ich über die Thomas Krenn AG.
        </p>
        <ErgebnisKnopf thema={{ anliegen: "Angebot", betreff: "Cluster-Planung: Proxmox-Cluster", nachricht }} />
      </Feld>
    </div>
  );
}
