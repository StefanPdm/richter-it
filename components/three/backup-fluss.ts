import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  Line,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Scene,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  type Material,
} from "three";
import { FARBWELT_EREIGNIS } from "@/lib/farbwelt";
import { SCHRITTE, fortschrittVon } from "./fortschritt";

/*
 * Backup-Fluss: Server-Rack (Standort A) → Datenwolke → Deduplizierung → Verschlüsselungsring
 * → Übertragung → Backup-Speicher (Standort B) → Wiederherstellung zurück ins Rack.
 * Alles prozedural (keine Modelle), Farben aus den CSS-Tokens der aktiven Farbwelt.
 * Die Position hängt am Scrollen, dazu kleine Dauerbewegung, solange die Szene im Bild ist.
 */

const ANZAHL = 48;
const EINDEUTIG = 18;
const RACK_X = -4.6;
const WOLKE_X = -3.0;
const RING_X = -1.5;
const PAKET_X = -0.3;
const LAGER_X = 4.4;
const BODEN_Y = -1.75;
const FACH_Y = (k: number) => -1.25 + k * 0.4;
const LAGER_Y = [-1.3, -0.65, 0];

type V3 = [number, number, number];

const klemme = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/* ease-in-out für Bewegung auf der Bühne */
const glatt = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/* Versatz je Block, damit nicht alles gleichzeitig fliegt */
const versetzt = (t: number, i: number, n: number, streuung = 0.55) =>
  glatt(klemme((t - (i / n) * streuung) / (1 - streuung)));

function bahn(out: Vector3, a: V3, b: V3, t: number, bogen = 0) {
  return out.set(mix(a[0], b[0], t), mix(a[1], b[1], t) + Math.sin(Math.PI * t) * bogen, mix(a[2], b[2], t));
}

/* fester Zufall, damit die Szene bei jedem Laden gleich aussieht */
function zufall(start: number) {
  let s = start;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Farbe aus einem CSS-Token; fehlt das Token, bleibt die bisherige Farbe */
function token(ziel: Color, name: string) {
  const wert = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (wert) ziel.setStyle(wert);
}

export function starteBackupFluss(canvas: HTMLCanvasElement, quelle: Element) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);

  const szene = new Scene();
  const kamera = new PerspectiveCamera(35, 1, 0.1, 100);
  szene.add(new AmbientLight(0xffffff, 1.4));
  const sonne = new DirectionalLight(0xffffff, 2.2);
  sonne.position.set(3, 6, 5);
  szene.add(sonne);

  const entsorgen: { dispose: () => void }[] = [];
  const merke = <T extends BufferGeometry | Material>(x: T) => (entsorgen.push(x), x);

  /* ---- Materialien (Farben setzt farbenLesen) ---- */
  const linie = merke(new LineBasicMaterial({ transparent: true, opacity: 0.9 }));
  const linieSchwach = merke(new LineBasicMaterial({ transparent: true, opacity: 0.45 }));
  const fach = merke(new MeshLambertMaterial());
  const ringStoff = merke(new MeshBasicMaterial({ transparent: true }));
  const ringBogenStoff = merke(new MeshBasicMaterial({ transparent: true, opacity: 0.5 }));
  const blockStoff = merke(new MeshLambertMaterial());
  const huelleStoff = merke(new MeshBasicMaterial({ transparent: true, opacity: 0.22, depthWrite: false }));
  const ledStoff = merke(new MeshBasicMaterial());
  const transferStoff = merke(new LineDashedMaterial({ dashSize: 0.18, gapSize: 0.12, transparent: true }));
  const rueckStoff = merke(new LineDashedMaterial({ dashSize: 0.18, gapSize: 0.12, transparent: true }));

  const farben = {
    brand: new Color(),
    neon: new Color(),
    erfolg: new Color(),
  };

  function farbenLesen() {
    token(farben.brand, "--color-brand");
    token(farben.neon, "--color-neon");
    token(farben.erfolg, "--color-success");
    token(linie.color, "--color-border-strong");
    linieSchwach.color.copy(linie.color);
    token(fach.color, "--color-surface");
    ringStoff.color.copy(farben.neon);
    ringBogenStoff.color.copy(farben.neon);
    huelleStoff.color.copy(farben.neon);
    transferStoff.color.copy(farben.brand);
    rueckStoff.color.copy(farben.neon);
  }
  farbenLesen();

  /* ---- Standorte: Bodenrahmen ---- */
  function boden(x: number, breite: number) {
    const g = merke(new EdgesGeometry(merke(new PlaneGeometry(breite, 2.8))));
    const l = new LineSegments(g, linieSchwach);
    l.rotation.x = -Math.PI / 2;
    l.position.set(x, BODEN_Y, 0);
    szene.add(l);
  }
  boden(-2.7, 6.2);
  boden(LAGER_X, 2.6);

  /* ---- Rack mit Fächern und LEDs ---- */
  const rackRahmen = new LineSegments(merke(new EdgesGeometry(merke(new BoxGeometry(1.4, 2.7, 1.0)))), linie);
  rackRahmen.position.set(RACK_X, -0.4, 0);
  szene.add(rackRahmen);
  const fachForm = merke(new BoxGeometry(1.3, 0.03, 0.9));
  for (let k = 0; k < 6; k++) {
    const f = new Mesh(fachForm, fach);
    f.position.set(RACK_X, FACH_Y(k) - 0.15, 0);
    szene.add(f);
  }
  const leds = new InstancedMesh(merke(new BoxGeometry(0.07, 0.07, 0.02)), ledStoff, 6);
  const hilf = new Object3D();
  for (let k = 0; k < 6; k++) {
    hilf.position.set(RACK_X + 0.55, FACH_Y(k) - 0.05, 0.51);
    hilf.updateMatrix();
    leds.setMatrixAt(k, hilf.matrix);
    leds.setColorAt(k, farben.brand);
  }
  szene.add(leds);

  /* ---- Backup-Speicher: drei Scheiben ---- */
  const scheibe = merke(new EdgesGeometry(merke(new CylinderGeometry(0.8, 0.8, 0.5, 32)), 20));
  for (const y of LAGER_Y) {
    const s = new LineSegments(scheibe, linie);
    s.position.set(LAGER_X, y, 0);
    szene.add(s);
  }

  /* ---- Verschlüsselungsring ---- */
  const ring = new Mesh(merke(new TorusGeometry(1.0, 0.035, 8, 64)), ringStoff);
  ring.position.set(RING_X, 0, 0);
  ring.rotation.y = Math.PI / 2;
  szene.add(ring);
  const ringBogen = new Mesh(merke(new TorusGeometry(1.25, 0.012, 6, 48, Math.PI * 1.3)), ringBogenStoff);
  ringBogen.position.copy(ring.position);
  ringBogen.rotation.y = Math.PI / 2;
  szene.add(ringBogen);

  /* ---- Wege: Übertragung und Rückweg ---- */
  function weg(a: V3, steuer: V3, b: V3, stoff: LineDashedMaterial) {
    const kurve = new QuadraticBezierCurve3(new Vector3(...a), new Vector3(...steuer), new Vector3(...b));
    const g = merke(new BufferGeometry().setFromPoints(kurve.getPoints(48)));
    const l = new Line(g, stoff);
    l.computeLineDistances();
    szene.add(l);
  }
  weg([PAKET_X, 0, 0], [(PAKET_X + LAGER_X) / 2, 2.4, 0], [LAGER_X, -0.4, 0], transferStoff);
  weg([LAGER_X, -0.4, 0], [0, 4.6, 0], [RACK_X, -0.4, 0], rueckStoff);

  /* ---- Datenblöcke ---- */
  const zz = zufall(7);
  const bloecke = Array.from({ length: ANZAHL }, (_, i) => {
    const k = i % 6;
    const j = i < EINDEUTIG ? i : Math.floor(zz() * EINDEUTIG);
    const rack: V3 = [RACK_X + (zz() - 0.5) * 1.0, FACH_Y(k) - 0.07, (zz() - 0.5) * 0.7];
    const wolke: V3 = [WOLKE_X + (zz() - 0.5) * 1.3, (zz() - 0.5) * 2.0, (zz() - 0.5) * 1.3];
    return { rack, wolke, j, phase: zz() * Math.PI * 2 };
  });
  /* Ziele der eindeutigen Blöcke */
  const paket: V3[] = [];
  const lager: V3[] = [];
  for (let j = 0; j < EINDEUTIG; j++) {
    paket.push([PAKET_X, -0.5 + (j % 6) * 0.2, -0.2 + Math.floor(j / 6) * 0.2]);
    const w = j * 2.4;
    lager.push([LAGER_X + Math.cos(w) * 0.42, LAGER_Y[j % 3], Math.sin(w) * 0.42]);
  }

  const blockForm = merke(new BoxGeometry(0.16, 0.16, 0.16));
  const blockNetz = new InstancedMesh(blockForm, blockStoff, ANZAHL);
  const huelle = new InstancedMesh(blockForm, huelleStoff, ANZAHL);
  szene.add(blockNetz, huelle);

  const pos = new Vector3();
  const zwischen = new Vector3();
  const farbe = new Color();

  function stelle(p: number, zeit: number) {
    const s = p * SCHRITTE;
    const schritt = Math.min(SCHRITTE - 1, Math.floor(s));
    const t = s - schritt;
    let imRing = 0;

    for (let i = 0; i < ANZAHL; i++) {
      const b = bloecke[i];
      const eindeutig = i < EINDEUTIG;
      let groesse = 1;
      let verschluesselt = false;
      let draussen = true;

      if (schritt === 0) {
        const u = versetzt(t, i, ANZAHL);
        bahn(pos, b.rack, b.wolke, u, 0.6);
        groesse = mix(0.8, 1, u);
        draussen = u > 0.02;
      } else if (schritt === 1) {
        if (eindeutig) pos.set(...b.wolke);
        else {
          const u = versetzt(t, i - EINDEUTIG, ANZAHL - EINDEUTIG);
          bahn(pos, b.wolke, bloecke[b.j].wolke, u);
          groesse = 1 - u * u;
        }
      } else if (schritt === 2) {
        if (!eindeutig) groesse = 0;
        else {
          const u = versetzt(t, i, EINDEUTIG, 0.6);
          const mitte: V3 = [RING_X, b.wolke[1] * 0.3, b.wolke[2] * 0.3];
          if (u < 0.5) bahn(pos, b.wolke, mitte, u * 2);
          else bahn(pos, mitte, paket[i], (u - 0.5) * 2);
          verschluesselt = pos.x > RING_X;
          if (Math.abs(pos.x - RING_X) < 0.45) imRing++;
        }
      } else if (schritt === 3) {
        if (!eindeutig) groesse = 0;
        else {
          const u = versetzt(t, i, EINDEUTIG);
          bahn(pos, paket[i], lager[i], u, 2.0);
          verschluesselt = true;
        }
      } else {
        if (eindeutig) {
          const u = versetzt(t, i, EINDEUTIG, 0.5);
          bahn(pos, lager[i], b.rack, u, 2.6);
          verschluesselt = u < 0.92;
          groesse = mix(1, 0.8, u);
          draussen = u < 0.98;
        } else {
          /* Duplikate entstehen im Rack wieder, sobald ihr Original zurück ist */
          pos.set(...b.rack);
          groesse = glatt(klemme((t - 0.55) / 0.4)) * 0.8;
          draussen = false;
        }
      }

      /* leichtes Schweben außerhalb des Racks */
      if (draussen && groesse > 0) {
        zwischen.set(0, Math.sin(zeit * 1.3 + b.phase) * 0.035, 0);
        pos.add(zwischen);
      }

      hilf.position.copy(pos);
      hilf.rotation.set(draussen ? zeit * 0.35 + b.phase : 0, draussen ? zeit * 0.5 + b.phase : 0, 0);
      hilf.scale.setScalar(Math.max(groesse, 0.0001));
      hilf.updateMatrix();
      blockNetz.setMatrixAt(i, hilf.matrix);
      blockNetz.setColorAt(i, farbe.copy(verschluesselt ? farben.neon : farben.brand));

      hilf.scale.setScalar(verschluesselt && groesse > 0 ? groesse * 1.7 : 0.0001);
      hilf.updateMatrix();
      huelle.setMatrixAt(i, hilf.matrix);
    }
    blockNetz.instanceMatrix.needsUpdate = true;
    huelle.instanceMatrix.needsUpdate = true;
    if (blockNetz.instanceColor) blockNetz.instanceColor.needsUpdate = true;

    /* Ring pulst, wenn Blöcke durchlaufen */
    const puls = Math.min(1, imRing / 3);
    ringStoff.opacity = 0.55 + puls * 0.45;
    ring.scale.setScalar(1 + puls * 0.08);
    ringBogen.rotation.x = zeit * 0.6;

    /* Wege erscheinen mit ihrem Schritt */
    transferStoff.opacity = schritt === 3 ? 0.9 : schritt > 3 ? 0.35 : 0.12;
    rueckStoff.opacity = schritt === 4 ? 0.85 : 0;

    /* LEDs: blinken im Betrieb, am Ende grün = Wiederherstellung geprüft */
    const geprueft = schritt === 4 && t > 0.85;
    for (let k = 0; k < 6; k++) {
      const an = Math.sin(zeit * (2.2 + k * 0.7) + k) > -0.2;
      leds.setColorAt(k, farbe.copy(geprueft ? farben.erfolg : farben.brand).multiplyScalar(an || geprueft ? 1 : 0.25));
    }
    if (leds.instanceColor) leds.instanceColor.needsUpdate = true;
  }

  /* ---- Größe und Kamera ---- */
  function groesseAnpassen() {
    const { clientWidth: b, clientHeight: h } = canvas;
    if (!b || !h) return;
    renderer.setSize(b, h, false);
    const seite = b / h;
    kamera.aspect = seite;
    /* Breite der Bühne (rund 12.5 Einheiten) muss ins Bild passen */
    const buehnenBreite = seite < 1.4 ? 11.8 : 12.6;
    const abstand = Math.max(10, buehnenBreite / (2 * Math.tan((kamera.fov * Math.PI) / 360) * seite));
    kamera.position.set(0, abstand * 0.42, abstand);
    kamera.lookAt(0, -0.1, 0);
    kamera.updateProjectionMatrix();
  }

  /* ---- Schleife ---- */
  let p = fortschrittVon(quelle);
  let letzte = performance.now();
  let zeit = 0;
  let schleife = 0;
  let laeuft = false;
  let messung = { summe: 0, bilder: 0 };

  function bild(jetzt: number) {
    const dt = Math.min(0.05, (jetzt - letzte) / 1000);
    letzte = jetzt;
    zeit += dt;
    p += (fortschrittVon(quelle) - p) * (1 - Math.exp(-dt * 5));
    stelle(p, zeit);
    renderer.render(szene, kamera);

    /* Ruckelt es, Auflösung senken (einmal) */
    messung.summe += dt;
    messung.bilder++;
    if (messung.bilder === 90) {
      if (messung.summe / messung.bilder > 1 / 40 && dpr > 1) {
        dpr = 1;
        renderer.setPixelRatio(1);
        groesseAnpassen();
      }
      messung = { summe: 0, bilder: 0 };
    }
    if (laeuft) schleife = requestAnimationFrame(bild);
  }

  function start() {
    if (laeuft) return;
    laeuft = true;
    letzte = performance.now();
    schleife = requestAnimationFrame(bild);
  }
  function stopp() {
    laeuft = false;
    cancelAnimationFrame(schleife);
  }

  let imBild = false;
  const pruefen = () => (imBild && document.visibilityState === "visible" ? start() : stopp());
  const beobachter = new IntersectionObserver(([e]) => {
    imBild = e.isIntersecting;
    pruefen();
  });
  beobachter.observe(canvas);
  const groesse = new ResizeObserver(() => {
    groesseAnpassen();
    if (!laeuft) {
      stelle(p, zeit);
      renderer.render(szene, kamera);
    }
  });
  groesse.observe(canvas);
  const weltWechsel = () => {
    farbenLesen();
    if (!laeuft) renderer.render(szene, kamera);
  };
  window.addEventListener(FARBWELT_EREIGNIS, weltWechsel);
  document.addEventListener("visibilitychange", pruefen);

  groesseAnpassen();
  stelle(p, 0);
  renderer.render(szene, kamera);

  return () => {
    stopp();
    beobachter.disconnect();
    groesse.disconnect();
    window.removeEventListener(FARBWELT_EREIGNIS, weltWechsel);
    document.removeEventListener("visibilitychange", pruefen);
    blockNetz.dispose();
    huelle.dispose();
    leds.dispose();
    for (const x of entsorgen) x.dispose();
    renderer.dispose();
  };
}
