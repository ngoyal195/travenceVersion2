import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  PerspectiveCamera,
} from "@react-three/drei";
import SuitcaseModel from "./SuitcaseModel";
import ProductHotspots from "./ProductHotspots";
import { GROUND_Y, HOTSPOT_BY_ID } from "../../lib/atlantis3d";
import { clamp, damp, dampAngle, angleDiff, easeOutCubic } from "./math";

const AUTO_ROTATE = 0.28; // rad/s, one turn in ~22s
const BASE_DIST = 2.15;
const TARGET_Y = 0.07;
const Y_AXIS = new THREE.Vector3(0, 1, 0);

function Stage({ ctl, active, colorway, handleOpen, lite, reduced, onReady, onSelect }) {
  const group = useRef();
  const started = useRef(false);
  const intro = useRef(reduced ? 99 : 0);
  const rig = useRef(null);
  const focus = useRef(new THREE.Vector3());
  const { camera, size } = useThree();

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const c = ctl.current;
    const g = group.current;
    if (!g) return;

    if (!started.current) {
      started.current = true;
      onReady?.();
    }

    // ---- intro (0 -> 1) ---------------------------------------------------
    intro.current += dt;
    const e = reduced ? 1 : easeOutCubic(clamp(intro.current / 2.4, 0, 1));

    // ---- yaw --------------------------------------------------------------
    const spot = active ? HOTSPOT_BY_ID[active] : null;
    const now = performance.now() / 1000;

    if (spot) {
      c.yaw = dampAngle(c.yaw, spot.view.yaw, 3.2, dt);
      c.vel = 0;
      c.auto = 0;
    } else if (c.snap != null) {
      c.yaw = dampAngle(c.yaw, c.snap, 3, dt);
      c.vel = 0;
      if (Math.abs(angleDiff(c.yaw, c.snap)) < 0.01) c.snap = null;
    } else if (!c.dragging) {
      c.yaw += c.vel * dt;
      c.vel *= Math.exp(-dt * 3);
      if (!reduced && now - c.lastInteract > 3.5 && Math.abs(c.vel) < 0.05) {
        c.auto = Math.min(1, (c.auto || 0) + dt * 0.6);
        c.yaw += AUTO_ROTATE * c.auto * dt;
      } else {
        c.auto = 0;
      }
    }
    c.zoom = damp(c.zoom, c.zoomTarget, 5, dt);

    // ---- model transform --------------------------------------------------
    const t = state.clock.elapsedTime;
    g.rotation.y = c.yaw + (1 - e) * -2.2;
    g.rotation.x = reduced ? 0 : Math.sin(t * 0.7) * 0.008;
    g.position.y = (reduced ? 0 : Math.sin(t * 1.1) * 0.012) - (1 - e) * 0.12;
    g.scale.setScalar(0.86 + 0.14 * e);

    // ---- camera rig -------------------------------------------------------
    const aspect = size.width / Math.max(size.height, 1);
    let fx = 0;
    let fy = TARGET_Y;
    let fz = 0;
    let dist = Math.max(BASE_DIST, 0.95 / (0.574 * aspect)) / c.zoom;

    if (spot) {
      focus.current.set(...spot.view.focus).applyAxisAngle(Y_AXIS, spot.view.yaw);
      fx = focus.current.x;
      fy = focus.current.y;
      fz = focus.current.z;
      dist = spot.view.dist;
    }
    dist *= 1 + 0.22 * (1 - e);

    // On wide screens the case sits right of centre, leaving room for the copy.
    const shift = aspect > 1.25 ? 0.5 * (dist / BASE_DIST) : 0;
    const goal = { x: fx - shift, y: fy, z: fz, d: dist };

    if (!rig.current) rig.current = { ...goal };
    const r = rig.current;
    const lam = spot || c.snap != null ? 3.2 : 6;
    r.x = damp(r.x, goal.x, lam, dt);
    r.y = damp(r.y, goal.y, lam, dt);
    r.z = damp(r.z, goal.z, lam, dt);
    r.d = damp(r.d, goal.d, lam, dt);

    camera.position.set(r.x, r.y + r.d * 0.07, r.z + r.d);
    camera.lookAt(r.x, r.y, r.z);
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[2.5, 3.5, 3]} intensity={2.1} color="#fff4e6" />
      <directionalLight position={[-3, 1.5, -2.5]} intensity={2.2} color="#FF6A2B" />

      {/* Studio reflections built from light panels: no HDR download needed */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.6} color="#ffffff" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#dfe8ff" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2.2, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#FF6A2B" position={[5, 0.5, -1]} rotation-y={-Math.PI / 2} scale={[5, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#C7A97E" position={[0, 0.5, 5]} scale={[7, 1.4, 1]} />
      </Environment>

      <group ref={group}>
        <SuitcaseModel colorway={colorway} active={active} handleOpen={handleOpen} lite={lite} />
        <ProductHotspots active={active} onSelect={onSelect} />
      </group>

      <ContactShadows
        position={[0, GROUND_Y - 0.03, 0]}
        opacity={0.6}
        scale={3}
        blur={2.6}
        far={1.2}
        resolution={lite ? 256 : 512}
        color="#000000"
      />
    </>
  );
}

export default function SuitcaseScene({ inView, lite, ...stageProps }) {
  return (
    <Canvas
      frameloop={inView ? "always" : "never"}
      dpr={[1, lite ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <PerspectiveCamera makeDefault fov={32} near={0.1} far={30} position={[0, 0.2, 5]} />
      <Stage lite={lite} {...stageProps} />
    </Canvas>
  );
}
