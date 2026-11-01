"use client";

import { useEffect, useRef } from "react";
import { starteBackupFluss } from "./backup-fluss";

type Props = { quelleId: string };

/** WebGL-Canvas der Backup-Szene. Wird nur per next/dynamic geladen (three.js im eigenen Paket). */
export default function BackupFlussCanvas({ quelleId }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const quelle = document.getElementById(quelleId);
    if (!canvas || !quelle) return;
    try {
      return starteBackupFluss(canvas, quelle);
    } catch {
      /* kein WebGL-Kontext: Canvas bleibt leer, Ersatzgrafik liegt darunter */
      canvas.hidden = true;
    }
  }, [quelleId]);

  return <canvas ref={ref} className="szene-ein absolute inset-0 size-full" />;
}
