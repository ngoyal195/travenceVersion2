import Head from "next/head";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import products from "../lib/products";
import { motion } from "framer-motion";
import TravenceHero from "../components/hero3d/TravenceHero";
import CollectionSpotlight from "../components/CollectionSpotlight";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const stagger = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Travence™ | Premium Travel Luggage</title>

        <meta
          name="description"
          content="Premium luggage crafted for modern journeys."
        />
      </Head>

      <Header />

      {/* ===================================================== */}
      {/* HERO (3D) */}
      {/* ===================================================== */}

      <TravenceHero />

      {/* ===================================================== */}
      {/* FEATURE STRIP */}
      {/* ===================================================== */}

      <section
        className="
          relative
          bg-black
          text-white
          py-5
          overflow-hidden
          border-y
          border-white/10
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-orange-500/[0.04]
            via-transparent
            to-orange-500/[0.04]
            pointer-events-none
          "
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-x-10
              gap-y-4
              text-sm
              uppercase
              tracking-[0.2em]
              font-semibold
            "
          >
            <span className="hover:text-orange-400 transition-colors duration-300">
              360° Spinner Wheels
            </span>

            <span className="hover:text-orange-400 transition-colors duration-300">
              TSA Approved Locks
            </span>

            <span className="hover:text-orange-400 transition-colors duration-300">
              Premium PP Shell
            </span>

            <span className="hover:text-orange-400 transition-colors duration-300">
              Ultra Lightweight
            </span>

            <span className="hover:text-orange-400 transition-colors duration-300">
              3 Year Warranty
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FEATURED PRODUCT */}
      {/* ===================================================== */}

      <CollectionSpotlight />

      {/* ===================================================== */}
      {/* PRODUCTS */}
      {/* ===================================================== */}

      <section
        id="products"
        className="
          py-24
          bg-white
          dark:bg-[#0B0D10]
          transition-colors
          duration-500
        "
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-end
              lg:justify-between
              gap-8
              mb-16
            "
          >
            <div>
              <p
                className="
                  text-orange-500
                  uppercase
                  tracking-[0.25em]
                  text-sm
                  font-semibold
                "
              >
                Curated Collection
              </p>

              <h2
                className="
                  text-5xl
                  md:text-6xl
                  font-black
                  mt-4
                  leading-tight
                  text-gray-900
                  dark:text-white
                "
              >
                Designed For
                <br />
                Every Journey
              </h2>
            </div>

            <p
              className="
                max-w-xl
                text-gray-600
                dark:text-gray-400
                text-lg
                leading-relaxed
              "
            >
              Discover luggage built for seamless movement, elegant
              aesthetics, and dependable durability wherever travel
              takes you.
            </p>
          </div>

          {/* Product Grid */}
          <div
            className="
              grid
              gap-8
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* BRAND STORY */}
      {/* ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#050505]
          text-white
          py-32
          border-y
          border-white/5
        "
      >
        {/* Ambient Glow */}
        <div
          className="
            absolute
            -top-32
            left-1/2
            -translate-x-1/2
            w-[900px]
            h-[400px]
            bg-orange-500/10
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            w-[400px]
            h-[400px]
            bg-white/[0.03]
            blur-3xl
            rounded-full
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            top-1/2
            left-0
            w-[300px]
            h-[300px]
            bg-orange-500/[0.03]
            blur-3xl
            rounded-full
            pointer-events-none
          "
        />

        <div
          className="
            relative
            max-w-6xl
            mx-auto
            px-6
            text-center
          "
        >
          {/* Label */}
          <div
            className="
              inline-flex
              items-center
              gap-3
              border
              border-white/10
              bg-white/[0.03]
              px-5
              py-2
              rounded-full
              backdrop-blur-sm
            "
          >
            <div
              className="
                w-2
                h-2
                rounded-full
                bg-orange-400
                animate-pulse
              "
            />

            <span
              className="
                uppercase
                tracking-[0.25em]
                text-xs
                md:text-sm
                text-orange-300
                font-semibold
              "
            >
              The Travence Philosophy
            </span>
          </div>

          {/* Main Heading */}
          <h2
            className="
              mt-10
              text-5xl
              sm:text-6xl
              md:text-7xl
              font-black
              tracking-tight
              leading-[0.95]
            "
          >
            <span className="block text-white">
              Engineered
            </span>

            <span
              className="
                block
                mt-2
                bg-gradient-to-b
                from-orange-300
                via-white
                to-stone-500
                bg-clip-text
                text-transparent
              "
            >
              For Motion.
            </span>
          </h2>

          {/* Description */}
          <p
            className="
              mt-12
              max-w-3xl
              mx-auto
              text-stone-400
              text-lg
              md:text-xl
              leading-relaxed
              font-light
            "
          >
            Every Travence luggage piece is crafted around one
            principle: effortless movement. From crowded terminals
            to business travel and weekend escapes, our luggage
            blends lightweight engineering, smooth mobility,
            premium durability, and modern aesthetics into one
            seamless travel experience.
          </p>

          {/* Stats */}
          <div
            className="
              mt-16
              grid
              grid-cols-2
              md:grid-cols-4
              gap-5
            "
          >
            {[
              {
                value: "360°",
                label: "Silent Spinner Wheels",
              },
              {
                value: "PP",
                label: "Lightweight Shell",
              },
              {
                value: "TSA",
                label: "Secure Lock System",
              },
              {
                value: "3Y",
                label: "Warranty Coverage",
              },
            ].map((item) => (
              <div
                key={item.value}
                className="
                  group
                  bg-white/[0.03]
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                  backdrop-blur-sm
                  hover:bg-white/[0.06]
                  hover:border-orange-500/20
                  hover:-translate-y-2
                  transition-all
                  duration-500
                "
              >
                <h3
                  className="
                    text-3xl
                    font-black
                    text-white
                    group-hover:text-orange-300
                    transition-colors
                    duration-300
                  "
                >
                  {item.value}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    text-stone-400
                  "
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* TRUST SECTION */}
      {/* ===================================================== */}

      <section
        className="
          bg-white
          dark:bg-[#0B0D10]
          py-24
          transition-colors
          duration-500
        "
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="
              grid
              md:grid-cols-4
              gap-8
            "
          >
            {[
              {
                title: "Lightweight Build",
                desc: "Durable PP shell engineered for everyday travel.",
              },
              {
                title: "Silent Wheels",
                desc: "Ultra smooth 360° movement across all surfaces.",
              },
              {
                title: "Security First",
                desc: "Integrated TSA and anti-theft protection systems.",
              },
              {
                title: "Built To Last",
                desc: "Premium craftsmanship backed by warranty coverage.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
                  premium-card
                  group
                  p-8
                "
              >
                {/* Icon */}
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-black
                    dark:bg-white
                    text-white
                    dark:text-black
                    flex
                    items-center
                    justify-center
                    text-xl
                    font-bold
                    transition-all
                    duration-500
                    group-hover:rotate-6
                    group-hover:scale-110
                  "
                >
                  ✦
                </div>

                <h3
                  className="
                    mt-6
                    text-2xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-3
                    text-gray-600
                    dark:text-gray-400
                    leading-relaxed
                  "
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CONTACT */}
      {/* ===================================================== */}

      <section
        id="contact"
        className="
          relative
          overflow-hidden
          py-24
          bg-[#f8f8f8]
          dark:bg-[#0F1216]
          transition-colors
          duration-500
        "
      >
        {/* Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.03]
            dark:opacity-[0.04]
            bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
            dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
            bg-[size:42px_42px]
            pointer-events-none
          "
        />

        {/* Glow */}
        <div
          className="
            absolute
            left-1/2
            -translate-x-1/2
            bottom-[-200px]
            w-[600px]
            h-[300px]
            bg-orange-500/10
            blur-3xl
            rounded-full
            pointer-events-none
          "
        />

        <div
          className="
            relative
            max-w-4xl
            mx-auto
            text-center
            px-6
          "
        >
          <p
            className="
              uppercase
              tracking-[0.25em]
              text-orange-500
              text-sm
              font-semibold
            "
          >
            Contact Travence
          </p>

          <h2
            className="
              text-5xl
              md:text-6xl
              font-black
              mt-5
              text-gray-900
              dark:text-white
            "
          >
            Need Assistance?
          </h2>

          <p
            className="
              mt-6
              text-gray-600
              dark:text-gray-400
              text-lg
              leading-relaxed
              max-w-2xl
              mx-auto
            "
          >
            Retail orders, dealership enquiries, bulk purchases,
            and customer support.
          </p>

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-5
              mt-10
            "
          >
            <a
              href="mailto:support@travencebags.in"
              className="
                inline-flex
                items-center
                justify-center
                bg-black
                dark:bg-white
                text-white
                dark:text-black
                px-8
                py-4
                rounded-full
                font-semibold
                hover:bg-gray-800
                dark:hover:bg-gray-200
                hover:-translate-y-1
                hover:shadow-xl
                transition-all
                duration-300
              "
            >
              Email Support
            </a>

            <a
              href="https://wa.me/918527530306"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                justify-center
                border
                border-black
                dark:border-white
                text-gray-900
                dark:text-white
                px-8
                py-4
                rounded-full
                font-semibold
                hover:bg-black
                dark:hover:bg-white
                hover:text-white
                dark:hover:text-black
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <footer
        className="
          relative
          overflow-hidden
          bg-black
          text-gray-400
          py-16
          border-t
          border-white/10
        "
      >
        {/* Subtle Orange Glow */}
        <div
          className="
            absolute
            left-1/2
            top-0
            -translate-x-1/2
            w-[500px]
            h-[180px]
            bg-orange-500/[0.06]
            blur-3xl
            rounded-full
            pointer-events-none
          "
        />

        <div
          className="
            relative
            max-w-7xl
            mx-auto
            px-6
            text-center
          "
        >
          <img
            src="/images/logo.png"
            alt="Travence"
            className="
              h-14
              mx-auto
              mb-6
              transition-transform
              duration-500
              hover:scale-105
            "
          />

          <h3
            className="
              text-white
              text-3xl
              font-black
              tracking-[0.2em]
              uppercase
            "
          >
            Travence
          </h3>

          <p
            className="
              mt-6
              max-w-2xl
              mx-auto
              leading-relaxed
            "
          >
            Premium luggage engineered for modern travelers.
            Built for movement, crafted for style.
          </p>

          {/* Footer Navigation */}
          <div
            className="
              mt-10
              flex
              flex-wrap
              justify-center
              gap-8
              text-sm
              uppercase
              tracking-[0.15em]
            "
          >
            <a
              href="/shop"
              className="
                hover:text-white
                hover:-translate-y-0.5
                transition-all
                duration-300
              "
            >
              Shop
            </a>

            <a
              href="/compare"
              className="
                hover:text-white
                hover:-translate-y-0.5
                transition-all
                duration-300
              "
            >
              Compare
            </a>

            <a
              href="/about"
              className="
                hover:text-white
                hover:-translate-y-0.5
                transition-all
                duration-300
              "
            >
              About
            </a>

            <a
              href="/support"
              className="
                hover:text-white
                hover:-translate-y-0.5
                transition-all
                duration-300
              "
            >
              Support
            </a>
          </div>

          {/* Copyright */}
          <div
            className="
              mt-10
              pt-8
              border-t
              border-white/10
              text-sm
              text-gray-500
            "
          >
            © {new Date().getFullYear()} Travence™. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
