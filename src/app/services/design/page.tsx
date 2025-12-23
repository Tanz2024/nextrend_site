// src/app/services/design/DesignClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buildAssetUrl } from "@/lib/assets";
import { Michroma, Playfair_Display } from "next/font/google";
import { Geist } from "next/font/google";

import ServicesCrossPromo from "../ServicesCrossPromo";

const geist = Geist({
  subsets: ["latin"],
  // weight is variable by default
});

const tech = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tech",
  display: "swap",
});

const serif = Playfair_Display({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

const designVideoSrc = buildAssetUrl("VIDEO_SERVICES", "design_K_array_images_K_ARRAY_VIDEO.mp4");

const textStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.05,
    },
  },
};

const wordVariant = {
  hidden: { y: "0.9em", opacity: 0, filter: "blur(6px)" },
  show: {
    y: "0em",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

export default function DesignClient() {
  return (
    <main className="min-h-screen bg-[#f7efe3] text-neutral-900">
      {/* ───────── HERO ───────── */}
      <section className="relative w-full overflow-hidden">
  <div className="relative h-[70vh] min-h-[460px] sm:h-[78vh] lg:h-screen">

    {/* background gradient */}
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-700" />

    {/* inset image (smaller) */}
    <motion.div
      initial={{ scale: 1.04, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="absolute inset-10 sm:inset-12 lg:inset-16 z-[1] overflow-hidden rounded-[28px]"
    >
      <Image
        src={buildAssetUrl("", "K-FRAMEWORK_DESIGN.jpeg")}
        alt="Nextrend design – integrated architectural audio"
        fill
        priority
        className="object-cover"
      />

      {/* SUPER smooth feather edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(130% 130% at 50% 50%,
              rgba(0,0,0,0) 48%,
              rgba(0,0,0,0.35) 72%,
              rgba(0,0,0,0.85) 100%
            )
          `,
        }}
      />
    </motion.div>

    {/* layer above image for readability (optional, keep if you like) */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2]"
      style={{
        background: `
          linear-gradient(90deg,
            rgba(0,0,0,0.80) 0%,
            rgba(0,0,0,0.55) 28%,
            rgba(0,0,0,0.20) 58%,
            rgba(0,0,0,0.00) 100%
          )
        `,
      }}
    />

    {/* copy block */}
    <div className="relative z-10 flex h-full items-end sm:items-center">
      <div className="w-full px-6 pb-10 pt-24 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
        <motion.p className={`${geist.className} text-[11.52px] uppercase tracking-[0.35em] text-white/80`}>
          Services
        </motion.p>

              {/* animated title */}
              <motion.div
                variants={textStagger}
                initial="hidden"
                animate="show"
                className="mt-3"
              >
                <motion.h1
                  className={`${serif.className}
                    text-[2rem] leading-tight text-white
                    sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.1rem]`}
                >
                  {"Design".split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      variants={wordVariant}
                      className="inline-block will-change-transform"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.h1>
              </motion.div>

              {/* short hero paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                className="mt-4 max-w-xl text-[0.85rem] leading-relaxed text-white/90 sm:text-sm md:text-base"
              >
                Using layouts and advanced 3D audio simulation software, we design and simulate how sound disperses in your space. This ensures optimal coverage, clarity, and seamless integration with your interior.
              </motion.p>

              {/* CTA – soft pill */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
                className="mt-6"
              >
                <Link
                  href="/contact"
                  aria-label="Share drawings with Nextrend design team"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-[#f6e6cf]/95 px-7 py-3 text-[0.8rem] font-medium uppercase tracking-[0.26em] text-[#111] backdrop-blur-md sm:text-[0.85rem]"
                >
                  <span>Share drawings</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="text-sm"
                  >
                    →
                  </motion.span>
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0, x: "-20%", y: "-20%" }}
                    whileHover={{
                      opacity: 1,
                      x: "35%",
                      y: "35%",
                      transition: { duration: 0.45, ease: EASE },
                    }}
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full"
                    style={{
                      background:
                        "radial-gradient(130% 130% at -20% -20%, rgba(255,255,255,0.0) 40%, rgba(255,255,255,0.45) 60%, rgba(255,255,255,0) 75%)",
                    }}
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── INTRO STRIP – CLEANED UP ───────── */}
      <section className="mx-auto max-w-5xl px-6 pb-14 pt-16 sm:px-8 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="space-y-5 text-center"
        >
          <p
            className={`${serif.className} text-[0.95rem] sm:text-base leading-[1.9] text-neutral-900`}
          >
            Starting from your plans and elevations, we develop a fully integrated audio design through simulation and 2D/3D visualisation, ensuring sound belongs naturally within the architecture.
          </p>
        </motion.div>
      </section>

      {/* ───────── CONTENT SECTIONS – REFINED ───────── */}
      <section className="mx-auto max-w-6xl border-t border-[rgba(0,0,0,0.06)] px-6 pb-24 pt-12 sm:px-8 lg:px-16 lg:pt-14">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Integration studies */}
          <motion.article
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="space-y-4"
          >
            <motion.h2
              variants={textStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className={`${geist.className} text-[1.8rem] font-semibold tracking-tight text-neutral-900 sm:text-[2.1rem]`}
            >
              {"2D & 3D System Visualisation".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariant}
                  className="inline-block will-change-transform"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.h2>
            <p className="text-sm leading-relaxed text-neutral-750 sm:text-[0.95rem]">
              Speaker layouts are plotted in both 2D and 3D drawings, clearly illustrating speaker locations, types, and system information required for precise coordination and integration.
            </p>
          </motion.article>

          {/* Experience guidelines */}
          <motion.article
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            className="space-y-4"
          >
            <motion.h2
              variants={textStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className={`${geist.className} text-[1.8rem] font-semibold tracking-tight text-neutral-900 sm:text-[2.1rem]`}
            >
              {"Audio Simulation".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariant}
                  className="inline-block will-change-transform"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.h2>

            <p className="text-sm leading-relaxed text-neutral-750 sm:text-[0.95rem]">
              We use advanced K-array simulation K-framework software to model sound coverage, balance, and performance within your space, ensuring the system is precisely designed before installation.
            </p>
          </motion.article>
        </div>
      </section>

      {/* ───────── DESIGN VIDEO ───────── */}
          <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 lg:px-16">
            <div className="overflow-hidden rounded-3xl bg-black shadow-sm">
              <video
                className="h-auto w-full"
                src={designVideoSrc}
                controls
                playsInline
                preload="metadata"
                poster="" 
              />
            </div>
          </section>

      <ServicesCrossPromo current="Design" />
    </main>
  );
}