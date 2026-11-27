import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const wrap = {
  hidden: {},
  show: { transition: { delayChildren: 0.35, staggerChildren: 0.14 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export default function HeroContent({ onDiscover, reduced }) {
  return (
    <motion.div
      variants={wrap}
      initial={reduced ? false : "hidden"}
      animate="show"
      exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
    >
      <motion.p
        variants={item}
        className="flex items-center gap-4 text-[13px] font-semibold tracking-[0.42em] text-[#C7A97E]"
      >
        <span className="h-px w-10 bg-[#FF6A2B]" aria-hidden="true" />
        TRAVENCE
      </motion.p>

      <h1 className="mt-6 text-[clamp(2.5rem,6.2vw,5.25rem)] font-extrabold leading-[0.95] tracking-tight text-white">
        <motion.span variants={item} className="block">
          YOUR JOURNEY.
        </motion.span>
        <motion.span variants={item} className="mt-1 block text-[#C7A97E]">
          YOUR COMPANION.
        </motion.span>
      </h1>

      <motion.p
        variants={item}
        className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
      >
        Designed for every journey. Built to travel further.
      </motion.p>

      <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-full bg-[#FF6A2B] px-7 py-3.5 text-sm font-semibold tracking-[0.12em] text-white shadow-[0_12px_32px_rgba(255,106,43,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff7d45]"
        >
          EXPLORE COLLECTION
        </Link>
        <button
          type="button"
          onClick={onDiscover}
          className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold tracking-[0.12em] text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
        >
          DISCOVER THE DESIGN
        </button>
      </motion.div>
    </motion.div>
  );
}
