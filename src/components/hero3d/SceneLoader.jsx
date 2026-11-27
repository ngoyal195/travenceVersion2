export default function SceneLoader({ label = "Loading 3D view" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute left-1/2 top-[8%] z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#0F1724]/70 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-md lg:left-[74%]"
    >
      <span className="tv-spinner" aria-hidden="true" />
      {label}
    </div>
  );
}
