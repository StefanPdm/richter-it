/**
 * Ersatzgrafik für die Backup-Szene (weniger Bewegung, Datensparen, kein WebGL, während des Ladens).
 * Gleicher Aufbau wie die Szene, Farben über currentColor aus den Tokens.
 */
export function BackupFlussPoster() {
  const bloecke = [
    [150, 120], [172, 150], [140, 168], [190, 112], [205, 160], [160, 196],
  ];
  return (
    <svg viewBox="0 0 640 300" className="absolute inset-0 size-full" fill="none" aria-hidden="true">
      {/* Standorte */}
      <g className="text-border-strong" stroke="currentColor" strokeDasharray="4 6">
        <rect x="20" y="40" width="360" height="230" />
        <rect x="470" y="40" width="150" height="230" />
      </g>
      {/* Rack */}
      <g className="text-border-strong" stroke="currentColor">
        <rect x="44" y="70" width="64" height="170" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <line key={k} x1="50" x2="102" y1={92 + k * 26} y2={92 + k * 26} />
        ))}
      </g>
      {/* Blöcke, dedupliziert */}
      <g className="text-brand" fill="currentColor">
        {bloecke.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="12" height="12" />
        ))}
      </g>
      {/* Ring */}
      <ellipse cx="260" cy="155" rx="18" ry="64" className="text-neon" stroke="currentColor" strokeWidth="3" />
      {/* Paket, verschlüsselt */}
      <g className="text-neon" stroke="currentColor">
        {[0, 1, 2].map((r) =>
          [0, 1].map((c) => <rect key={`${r}${c}`} x={318 + c * 20} y={128 + r * 20} width="14" height="14" />),
        )}
      </g>
      {/* Übertragung */}
      <path d="M360 140 Q 450 40 520 120" className="text-brand" stroke="currentColor" strokeDasharray="8 6" strokeWidth="1.5" />
      {/* Speicher */}
      <g className="text-border-strong" stroke="currentColor">
        {[130, 170, 210].map((y) => (
          <ellipse key={y} cx="545" cy={y} rx="44" ry="10" />
        ))}
      </g>
    </svg>
  );
}
