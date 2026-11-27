import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { DIMS } from "../../lib/atlantis3d";
import { createShellNormalMap, createBrandPlateTexture } from "./textures";
import { damp, dampAngle } from "./math";

const { W, H, D, R } = DIMS;

const ORANGE = "#FF6A2B";
const HANDLE_X = 0.0605; // half spacing between the two trolley tubes
const HANDLE_Z = -0.07; // trolley handle sits toward the back panel

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

// Rounded box whose UVs are a planar projection along Z. Front/back faces get
// the full swirl texture; side walls collapse onto the (flat) border texels, so
// they stay smooth like the real shell.
function makeShellHalf(depth, segments) {
  const g = new RoundedBoxGeometry(W, H, depth, segments, R);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / W + 0.5, pos.getY(i) / H + 0.5);
  }
  uv.needsUpdate = true;
  return g;
}

// ---------------------------------------------------------------------------
// Wheels
// ---------------------------------------------------------------------------

function WheelUnit({ position, rest, spinning, geo, mats }) {
  const swivel = useRef();
  const wheels = useRef();
  const yaw = useRef(rest);
  const spin = useRef(0);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    if (spinning) {
      yaw.current += dt * 1.7;
      spin.current += dt * 7;
    } else {
      yaw.current = dampAngle(yaw.current, rest, 4, dt);
    }
    if (swivel.current) swivel.current.rotation.y = yaw.current;
    if (wheels.current) wheels.current.rotation.x = spin.current;
  });

  return (
    <group position={position}>
      <mesh geometry={geo.housing} material={mats.trim} position={[0, -0.005, 0]} />
      <mesh geometry={geo.stem} material={mats.hub} position={[0, -0.016, 0]} />
      <group ref={swivel} position={[0, -0.022, 0]}>
        <mesh geometry={geo.yoke} material={mats.hub} />
        <mesh geometry={geo.plate} material={mats.hub} position={[0.0265, -0.024, 0]} />
        <mesh geometry={geo.plate} material={mats.hub} position={[-0.0265, -0.024, 0]} />
        <group ref={wheels} position={[0, -0.032, 0]}>
          {[-0.013, 0.013].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh geometry={geo.tyre} material={mats.tyre} rotation={[0, 0, Math.PI / 2]} />
              <mesh geometry={geo.hub} material={mats.hub} rotation={[0, 0, Math.PI / 2]} />
              <mesh geometry={geo.mark} material={mats.tyre} position={[0, 0, 0.0095]} />
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Telescopic trolley handle
// ---------------------------------------------------------------------------

function TelescopicHandle({ open, geo, mats }) {
  const outer = useRef();
  const inner = useRef();
  const grip = useRef();
  const ext = useRef(1);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    ext.current = damp(ext.current, open ? 1 : 0, 4.2, dt);
    const e = ext.current;
    if (outer.current) outer.current.position.y = H / 2 + e * 0.09 - 0.1;
    if (inner.current) inner.current.position.y = H / 2 + e * 0.19 - 0.25;
    if (grip.current) grip.current.position.y = H / 2 + e * 0.19 + 0.011;
  });

  return (
    <group position={[0, 0, HANDLE_Z]}>
      <group ref={outer}>
        <mesh geometry={geo.sleeve} material={mats.metal} position={[-HANDLE_X, 0, 0]} />
        <mesh geometry={geo.sleeve} material={mats.metal} position={[HANDLE_X, 0, 0]} />
      </group>
      <group ref={inner}>
        <mesh geometry={geo.tube} material={mats.metal} position={[-HANDLE_X, 0, 0]} />
        <mesh geometry={geo.tube} material={mats.metal} position={[HANDLE_X, 0, 0]} />
      </group>
      <mesh ref={grip} geometry={geo.grip} material={mats.grip} />
      <mesh geometry={geo.collar} material={mats.trim} position={[-HANDLE_X, H / 2 + 0.003, 0]} />
      <mesh geometry={geo.collar} material={mats.trim} position={[HANDLE_X, H / 2 + 0.003, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

export default function SuitcaseModel({ colorway, active, handleOpen, lite }) {
  const { mats, geo, textures } = useMemo(() => {
    const normal = createShellNormalMap(lite);
    const plate = createBrandPlateTexture();

    const physical = (extra) =>
      new THREE.MeshPhysicalMaterial({ emissive: ORANGE, emissiveIntensity: 0, ...extra });
    const standard = (extra) =>
      new THREE.MeshStandardMaterial({ emissive: ORANGE, emissiveIntensity: 0, ...extra });

    const mats = {
      shell: physical({
        color: colorway.shell,
        roughness: 0.36,
        clearcoat: 0.3,
        clearcoatRoughness: 0.35,
        normalMap: normal,
        normalScale: new THREE.Vector2(1.1, 1.1),
      }),
      shellPlain: physical({
        color: colorway.shell,
        roughness: 0.36,
        clearcoat: 0.3,
        clearcoatRoughness: 0.35,
      }),
      trim: standard({ color: colorway.trim, roughness: 0.6, metalness: 0.05 }),
      metal: standard({ color: "#c9ced6", roughness: 0.28, metalness: 0.9 }),
      grip: standard({ color: "#aeb4bd", roughness: 0.4, metalness: 0.7 }),
      tyre: standard({ color: "#15181d", roughness: 0.9, metalness: 0 }),
      hub: standard({ color: "#d3d7dc", roughness: 0.45, metalness: 0.1 }),
      lockBody: standard({ color: "#23272e", roughness: 0.4, metalness: 0.6 }),
      lockFace: standard({ color: "#b7bcc4", roughness: 0.3, metalness: 0.8 }),
      plate: new THREE.MeshStandardMaterial({ map: plate, roughness: 0.6 }),
    };

    const seg = lite ? 4 : 6;
    const geo = {
      half: makeShellHalf(D / 2, seg),
      band: new RoundedBoxGeometry(W - R * 0.76, H - R * 0.76, R * 1.3, 3, R * 0.3),
      topHandle: new RoundedBoxGeometry(0.11, 0.012, 0.04, 2, 0.005),
      sidePad: new RoundedBoxGeometry(0.012, 0.09, 0.05, 2, 0.005),
      plate: new THREE.PlaneGeometry(0.062, 0.0155),
      // trolley handle
      sleeve: new THREE.CylinderGeometry(0.0095, 0.0095, 0.2, 14),
      tube: new THREE.CylinderGeometry(0.0075, 0.0075, 0.5, 14),
      grip: new RoundedBoxGeometry(HANDLE_X * 2 + 0.034, 0.022, 0.03, 3, 0.009),
      collar: new THREE.CylinderGeometry(0.012, 0.012, 0.012, 14),
      // lock
      lockBody: new RoundedBoxGeometry(0.018, 0.05, 0.034, 2, 0.004),
      lockFace: new RoundedBoxGeometry(0.004, 0.034, 0.022, 2, 0.002),
      puller: new RoundedBoxGeometry(0.008, 0.022, 0.012, 2, 0.003),
      // wheels
      wheel: {
        housing: new RoundedBoxGeometry(0.075, 0.014, 0.07, 2, 0.005),
        stem: new THREE.CylinderGeometry(0.011, 0.011, 0.012, 14),
        yoke: new THREE.BoxGeometry(0.058, 0.008, 0.03),
        plate: new THREE.BoxGeometry(0.004, 0.05, 0.026),
        tyre: new THREE.CylinderGeometry(0.025, 0.025, 0.016, lite ? 20 : 30),
        hub: new THREE.CylinderGeometry(0.016, 0.016, 0.0185, lite ? 14 : 20),
        mark: new THREE.BoxGeometry(0.0195, 0.0035, 0.012),
      },
    };

    return { mats, geo, textures: [normal, plate] };
    // Built once; colour changes are animated below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lite]);

  useEffect(() => {
    return () => {
      Object.values(mats).forEach((m) => m.dispose());
      const dispose = (o) =>
        Object.values(o).forEach((g) =>
          g && typeof g.dispose === "function" ? g.dispose() : g && typeof g === "object" && dispose(g)
        );
      dispose(geo);
      textures.forEach((t) => t.dispose());
    };
  }, [mats, geo, textures]);

  const parts = useMemo(
    () => ({
      shell: [mats.shell, mats.shellPlain],
      handle: [mats.metal, mats.grip],
      wheels: [mats.tyre, mats.hub],
      lock: [mats.lockBody, mats.lockFace],
    }),
    [mats]
  );

  const target = useMemo(
    () => ({ shell: new THREE.Color(colorway.shell), trim: new THREE.Color(colorway.trim) }),
    [colorway]
  );

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const k = 1 - Math.exp(-6 * dt);
    mats.shell.color.lerp(target.shell, k);
    mats.shellPlain.color.lerp(target.shell, k);
    mats.trim.color.lerp(target.trim, k);

    for (const id in parts) {
      const goal = active === id ? 0.32 : 0;
      for (const m of parts[id]) {
        m.emissiveIntensity = damp(m.emissiveIntensity, goal, 6, dt);
      }
    }
  });

  const wheelXZ = [
    [1, 1, 0.5],
    [-1, 1, -0.3],
    [1, -1, 0.25],
    [-1, -1, -0.6],
  ];

  return (
    <group name="travence-atlantis">
      {/* Shell: two halves with a seam, plus the zip band set into the groove */}
      <group name="shell">
        <mesh name="shell-front" geometry={geo.half} material={mats.shell} position={[0, 0, D / 4]} />
        <mesh name="shell-rear" geometry={geo.half} material={mats.shell} position={[0, 0, -D / 4]} />
      </group>
      <mesh name="zip-seam" geometry={geo.band} material={mats.trim} />

      {/* Branding plate on the centre band */}
      <mesh name="brand-plate" geometry={geo.plate} material={mats.plate} position={[0.13, -0.007, D / 2 + 0.0012]} />

      {/* Carry handles */}
      <mesh name="top-handle" geometry={geo.topHandle} material={mats.trim} position={[0, H / 2 + 0.001, 0]} />
      <mesh name="side-handle" geometry={geo.sidePad} material={mats.shellPlain} position={[W / 2 + 0.001, -0.03, 0.07]} />

      {/* Trolley handle */}
      <group name="trolley-handle">
        <TelescopicHandle open={handleOpen} geo={geo} mats={mats} />
      </group>

      {/* Lock and zip pullers on the right-hand seam */}
      <group name="lock" position={[W / 2 - R * 0.38 + 0.006, 0.178, 0]}>
        <mesh geometry={geo.lockBody} material={mats.lockBody} />
        <mesh geometry={geo.lockFace} material={mats.lockFace} position={[0.0085, 0, 0]} />
      </group>
      <mesh name="zip-puller-a" geometry={geo.puller} material={mats.metal} position={[W / 2 - R * 0.38 + 0.002, 0.178, 0.045]} />
      <mesh name="zip-puller-b" geometry={geo.puller} material={mats.metal} position={[W / 2 - R * 0.38 + 0.002, 0.178, -0.045]} />

      {/* Four spinner wheel units */}
      <group name="wheels">
        {wheelXZ.map(([sx, sz, rest]) => (
          <WheelUnit
            key={`${sx}${sz}`}
            position={[sx * (W / 2 - 0.06), -H / 2, sz * (D / 2 - 0.055)]}
            rest={rest}
            spinning={active === "wheels"}
            geo={geo.wheel}
            mats={mats}
          />
        ))}
      </group>
    </group>
  );
}
