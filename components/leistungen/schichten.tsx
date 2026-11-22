import type { CSSProperties } from "react";

/* Aufbau von Proxmox von oben nach unten, rechts jeweils, wo der Feinschliff ansetzt */
const SCHICHTEN = [
  { name: "VMs · Container", hinweis: "Cluster, Hochverfügbarkeit" },
  { name: "KVM · QEMU · LXC", hinweis: "Leistung trotz VBS" },
  { name: "Proxmox VE · Debian", hinweis: "Upgrade 8 → 9" },
  { name: "Hardware", hinweis: "Bestand weiter nutzen" },
] as const;

/**
 * Schichtenmodell zur Proxmox-Seite: vier Ebenen von der Hardware bis zu den VMs,
 * je mit dem Punkt, an dem Daniel ansetzt. Ebenen bauen sich beim Laden von unten auf.
 */
export function Schichten() {
  return (
    <div className="hud-rahmen grid gap-6 border border-border bg-bg-alt p-[clamp(1.75rem,4vw,2.25rem)]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="daten">Aufbau · Proxmox VE</span>
        <span className="daten text-brand-dark">Feinschliff</span>
      </div>
      <ol className="grid gap-2">
        {SCHICHTEN.map((s, i) => (
          <li
            key={s.name}
            className="schicht grid grid-cols-1 gap-1 border border-border-strong bg-bg px-4 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
            style={{ "--i": SCHICHTEN.length - 1 - i } as CSSProperties}
          >
            <span className="daten text-text">{s.name}</span>
            <span className="daten flex items-center gap-2 text-brand-dark">
              <span aria-hidden="true" className="h-px w-5 bg-brand" />
              {s.hinweis}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
