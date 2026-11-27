import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCT_SLUG } from "../../lib/atlantis3d";

export default function FeaturePanel({ spot, handleOpen, onToggleHandle, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
      className="rounded-3xl border border-white/10 bg-[#0F1724]/75 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8"
      role="region"
      aria-label={spot.title}
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#C7A97E] transition hover:text-white"
      >
        <span aria-hidden="true">←</span> Back to full view
      </button>

      <h2 className="mt-5 text-2xl font-bold leading-tight text-white md:text-3xl">
        {spot.title}
      </h2>

      <p className="mt-4 text-base leading-relaxed text-white/70">{spot.body}</p>

      {spot.facts.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {spot.facts.map((f) => (
            <li
              key={f}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/85"
            >
              {f}
            </li>
          ))}
        </ul>
      )}

      {spot.id === "handle" && (
        <button
          type="button"
          onClick={onToggleHandle}
          aria-pressed={handleOpen}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#FF6A2B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7d45]"
        >
          {handleOpen ? "Retract handle" : "Extend handle"}
        </button>
      )}

      <div className="mt-7 border-t border-white/10 pt-5">
        <Link
          href={`/product/${PRODUCT_SLUG}`}
          className="text-sm font-semibold text-white transition hover:text-[#FF6A2B]"
        >
          See Travence Atlantis details →
        </Link>
      </div>
    </motion.div>
  );
}
