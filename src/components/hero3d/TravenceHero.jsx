import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import HeroContent from "./HeroContent";
import FeaturePanel from "./FeaturePanel";
import SceneLoader from "./SceneLoader";
import { clamp } from "./math";
import {
  COLORWAYS,
  COLORWAY_BY_ID,
  HOTSPOTS,
  HOTSPOT_BY_ID,
} from "../../lib/atlantis3d";

// The WebGL scene (three, R3F, drei) is a separate chunk that is never rendered
// on the server and is only requested once the browser is idle.
const SuitcaseScene = dynamic(() => import("./SuitcaseScene"), { ssr: false });

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.warn("Travence 3D scene failed, showing photo fallback.", error);
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

const chip =
  "rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition duration-200 focus-visible:outline-offset-2";
const roundBtn =
  "grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-[#0F1724]/60 text-base text-white/90 backdrop-blur-md transition hover:border-white/50 hover:bg-white/10";

export default function TravenceHero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const drag = useRef(null);

  // Shared, mutable interaction state read every frame by the scene.
  const ctl = useRef({
    yaw: 0.5,
    vel: 0,
    auto: 0,
    dragging: false,
    lastInteract: 0,
    zoom: 1,
    zoomTarget: 1,
    snap: null,
  });

  const [webgl, setWebgl] = useState(null); // null = checking, true/false afterwards
  const [lite, setLite] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [touched, setTouched] = useState(false);
  const [active, setActive] = useState(null);
  const [colorId, setColorId] = useState("khakhi");
  const [handleOpen, setHandleOpen] = useState(true);

  const colorway = COLORWAY_BY_ID[colorId];
  const spot = active ? HOTSPOT_BY_ID[active] : null;

  // ---- capability check + deferred mount ----------------------------------
  useEffect(() => {
    if (!detectWebGL()) {
      setWebgl(false);
      return undefined;
    }
    setLite(
      window.matchMedia("(max-width: 767px)").matches ||
        (navigator.hardwareConcurrency || 8) <= 4 ||
        (navigator.deviceMemory || 8) <= 4
    );

    const start = () => setWebgl(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 300);
    return () => window.clearTimeout(id);
  }, []);

  // ---- pause rendering when the hero is off-screen ------------------------
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ---- actions -------------------------------------------------------------
  const now = () => performance.now() / 1000;

  const select = useCallback((id) => {
    const c = ctl.current;
    c.zoomTarget = 1;
    c.snap = null;
    c.lastInteract = now();
    setTouched(true);
    setActive((prev) => (prev === id ? null : id));
  }, []);

  const discover = useCallback(() => {
    const c = ctl.current;
    c.zoomTarget = 1;
    c.snap = null;
    c.lastInteract = now();
    setTouched(true);
    setActive("shell");
    sectionRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [reduced]);

  const reset = useCallback(() => {
    const c = ctl.current;
    c.zoomTarget = 1;
    c.snap = 0.5;
    c.vel = 0;
    c.lastInteract = now();
    setActive(null);
    setHandleOpen(true);
  }, []);

  const zoomBy = useCallback((delta) => {
    const c = ctl.current;
    c.zoomTarget = clamp(c.zoomTarget + delta, 0.8, 1.7);
    c.lastInteract = now();
    setTouched(true);
    setActive(null);
  }, []);

  // ---- pointer drag (mouse + touch). Vertical swipes still scroll the page
  //      because the stage uses touch-action: pan-y. --------------------------
  const onPointerDown = (e) => {
    if (e.target.closest("[data-ui]")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const c = ctl.current;
    c.dragging = true;
    c.vel = 0;
    c.snap = null;
    drag.current = { id: e.pointerId, x: e.clientX, t: performance.now(), total: 0, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const t = performance.now();
    const dt = Math.max((t - d.t) / 1000, 0.008);
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    d.t = t;
    d.total += Math.abs(dx);
    if (d.total > 6 && !d.moved) {
      d.moved = true;
      setActive(null);
      setTouched(true);
    }
    const c = ctl.current;
    const dyaw = dx * 0.0085;
    c.yaw += dyaw;
    c.vel = 0.6 * c.vel + 0.4 * clamp(dyaw / dt, -6, 6);
  };

  const endDrag = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const c = ctl.current;
    c.dragging = false;
    c.lastInteract = now();
    drag.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e) => {
    const c = ctl.current;
    switch (e.key) {
      case "ArrowLeft":
        c.vel = -2;
        break;
      case "ArrowRight":
        c.vel = 2;
        break;
      case "+":
      case "=":
        zoomBy(0.18);
        break;
      case "-":
        zoomBy(-0.18);
        break;
      case "Escape":
        setActive(null);
        break;
      default:
        return;
    }
    c.snap = null;
    c.lastInteract = now();
    setTouched(true);
    e.preventDefault();
  };

  const showScene = webgl === true;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0F1724] text-white"
      style={{
        backgroundImage:
          "radial-gradient(60% 70% at 74% 52%, rgba(255,106,43,0.16), transparent 62%), radial-gradient(45% 55% at 12% 0%, rgba(199,169,126,0.10), transparent 60%), linear-gradient(180deg, #0F1724 0%, #0A1019 100%)",
      }}
    >
      <div className="relative mx-auto w-full max-w-[1600px] lg:min-h-[max(660px,calc(100svh-76px))]">
        {/* ============================ STAGE ============================ */}
        <div className="relative h-[58svh] max-h-[620px] min-h-[380px] lg:absolute lg:inset-0 lg:h-auto lg:max-h-none">
          <div
            ref={stageRef}
            role="group"
            aria-roledescription="3D viewer"
            aria-label="Interactive 3D Travence Atlantis suitcase. Drag or use the left and right arrow keys to rotate, plus and minus to zoom."
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
            className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF6A2B]"
          >
            {/* Photo poster: shown while the 3D chunk loads, and as the no-WebGL fallback */}
            <img
              src={colorway.photo}
              alt="Travence Atlantis suitcase"
              width={432}
              height={577}
              draggable={false}
              className={`pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-700 lg:left-[74%] ${
                ready ? "opacity-0" : "opacity-100"
              } ${webgl === false && !reduced ? "animate-float" : ""}`}
            />

            {showScene && (
              <SceneBoundary onError={() => setWebgl(false)}>
                <div
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    ready ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <SuitcaseScene
                    ctl={ctl}
                    active={active}
                    colorway={colorway}
                    handleOpen={handleOpen}
                    inView={inView}
                    lite={lite}
                    reduced={!!reduced}
                    onReady={() => setReady(true)}
                    onSelect={select}
                  />
                </div>
              </SceneBoundary>
            )}

            {webgl !== false && !ready && <SceneLoader />}
          </div>

          {/* ---- controls ---- */}
          <div
            data-ui
            className="absolute inset-x-3 bottom-3 z-20 flex flex-col gap-3 lg:left-[48%] lg:right-24 lg:bottom-6"
          >
            {webgl !== false && !touched && (
              <p className="pointer-events-none text-xs text-white/55">
                Drag to rotate. Tap a dot to explore a feature.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              {webgl !== false ? (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Explore features">
                  {HOTSPOTS.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => select(h.id)}
                      aria-pressed={active === h.id}
                      className={`${chip} ${
                        active === h.id
                          ? "border-[#FF6A2B] bg-[#FF6A2B] text-white"
                          : "border-white/20 bg-[#0F1724]/60 text-white/85 hover:border-white/50"
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2" role="group" aria-label="Colour">
                  {COLORWAYS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColorId(c.id)}
                      aria-label={c.label}
                      aria-pressed={colorId === c.id}
                      title={c.label}
                      style={{ backgroundColor: c.swatch }}
                      className={`h-7 w-7 rounded-full border-2 transition ${
                        colorId === c.id
                          ? "border-white scale-110"
                          : "border-white/30 hover:border-white/70"
                      }`}
                    />
                  ))}
                </div>

                {webgl !== false && (
                  <div className="flex items-center gap-1.5" role="group" aria-label="View controls">
                    <button type="button" className={roundBtn} onClick={() => zoomBy(-0.18)} aria-label="Zoom out">
                      −
                    </button>
                    <button type="button" className={roundBtn} onClick={() => zoomBy(0.18)} aria-label="Zoom in">
                      +
                    </button>
                    <button type="button" className={roundBtn} onClick={reset} aria-label="Reset view">
                      ↺
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================== COPY / PANEL =========================== */}
        <div className="pointer-events-none relative z-10 px-6 pb-14 pt-8 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[48%] lg:items-center lg:px-14 lg:pb-16 lg:pt-0">
          <div className="pointer-events-auto w-full max-w-xl">
            <AnimatePresence mode="wait">
              {spot ? (
                <FeaturePanel
                  key={spot.id}
                  spot={spot}
                  handleOpen={handleOpen}
                  onToggleHandle={() => setHandleOpen((v) => !v)}
                  onBack={() => setActive(null)}
                />
              ) : (
                <HeroContent key="hero-copy" onDiscover={discover} reduced={!!reduced} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
