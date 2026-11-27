import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { HOTSPOTS } from "../../lib/atlantis3d";

// A single DOM marker anchored to a point on the suitcase. Lives inside the
// rotating group so it follows the model. Markers on the far side of the case
// fade out and stop receiving clicks.
function HotspotMarker({ spot, active, onSelect }) {
  const anchor = useRef();
  const button = useRef();

  const tmp = useMemo(
    () => ({
      wp: new THREE.Vector3(),
      wn: new THREE.Vector3(),
      cd: new THREE.Vector3(),
      n: spot.normal ? new THREE.Vector3(...spot.normal).normalize() : null,
    }),
    [spot]
  );

  useFrame(({ camera }) => {
    const el = button.current;
    const a = anchor.current;
    if (!el || !a) return;

    let opacity = 1;
    if (tmp.n) {
      a.getWorldPosition(tmp.wp);
      tmp.wn.copy(tmp.n).transformDirection(a.matrixWorld);
      tmp.cd.copy(camera.position).sub(tmp.wp).normalize();
      opacity = THREE.MathUtils.smoothstep(tmp.wn.dot(tmp.cd), 0.08, 0.35);
    }
    el.style.opacity = String(opacity);
    el.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
  });

  return (
    <group ref={anchor} position={spot.anchor}>
      <Html center zIndexRange={[20, 0]}>
        <div className="tv-hotspot-wrap">
          <button
            ref={button}
            type="button"
            data-ui
            className="tv-hotspot"
            aria-label={`Explore ${spot.label.toLowerCase()}`}
            aria-pressed={active}
            onClick={() => onSelect(spot.id)}
          >
            <span className="tv-hotspot-label">{spot.label}</span>
          </button>
        </div>
      </Html>
    </group>
  );
}

export default function ProductHotspots({ active, onSelect }) {
  return (
    <>
      {HOTSPOTS.map((spot) => (
        <HotspotMarker
          key={spot.id}
          spot={spot}
          active={active === spot.id}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
