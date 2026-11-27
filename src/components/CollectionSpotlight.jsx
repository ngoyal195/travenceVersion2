import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import products from "../lib/products";
import { COLORWAYS, PRODUCT_SLUG } from "../lib/atlantis3d";

// Shopping section that follows the 3D hero. All data (price, sizes, colours)
// is read from src/lib/products.js, so it stays in sync with the product page.
export default function CollectionSpotlight() {
  const product = products.find((p) => p.slug === PRODUCT_SLUG);
  const [colorLabel, setColorLabel] = useState(COLORWAYS[0].label);

  if (!product) return null;

  const options = product.colors
    .map((name) => COLORWAYS.find((c) => c.label.toLowerCase() === name.toLowerCase()))
    .filter(Boolean);
  const current = options.find((c) => c.label === colorLabel) || options[0];
  const discount = Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100);

  return (
    <section
      id="collection"
      className="bg-white py-20 transition-colors duration-500 dark:bg-[#0B0D10] lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Photo */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#0F1724] to-[#0A1019] p-8">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(55% 55% at 50% 60%, rgba(255,106,43,0.18), transparent 70%)",
            }}
          />
          <motion.img
            key={current.id}
            src={current.photo}
            alt={`Travence Atlantis in ${current.label}`}
            width={432}
            height={577}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto h-[420px] w-auto object-contain md:h-[540px]"
          />
        </div>

        {/* Details */}
        <div>
          <h2 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-5xl">
            {product.name}
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{product.subtitle}</p>

          <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              ₹{product.offerPrice.toLocaleString()}
            </span>
            <span className="text-lg text-gray-400 line-through">
              ₹{product.mrp.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-[#FF6A2B]">{discount}% off</span>
          </div>

          <div className="mt-9">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Colour: <span className="font-normal text-gray-600 dark:text-gray-400">{current.label}</span>
            </p>
            <div className="mt-3 flex gap-3" role="group" aria-label="Colour">
              {options.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorLabel(c.label)}
                  aria-label={c.label}
                  aria-pressed={current.id === c.id}
                  title={c.label}
                  style={{ backgroundColor: c.swatch }}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    current.id === c.id
                      ? "scale-110 border-[#FF6A2B]"
                      : "border-gray-300 hover:border-gray-500 dark:border-white/20 dark:hover:border-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Available sizes</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-700 dark:border-white/15 dark:text-gray-300"
                >
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Choose your size on the product page.
            </p>
          </div>

          <ul className="mt-8 grid gap-2 text-gray-700 dark:text-gray-300 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A2B]" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/product/${product.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-[#FF6A2B] px-8 py-4 font-semibold text-white shadow-[0_12px_32px_rgba(255,106,43,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff7d45]"
            >
              Shop now
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-8 py-4 font-semibold text-gray-900 transition duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              View full collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
