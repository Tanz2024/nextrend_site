// src/app/services/design/DesignClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buildAssetUrl } from "@/lib/assets";
import { Michroma, Playfair_Display } from "next/font/google";

import ServicesCrossPromo from "../ServicesCrossPromo";

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
          {/* hero image */}
          <motion.div
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={buildAssetUrl("", "design_title.jpg")}
              alt="Nextrend design – integrated architectural audio"
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          {/* gradient overlay for readability */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.6) 26%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.04) 80%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* copy block */}
          <div className="relative z-10 flex h-full items-end sm:items-center">
            <div className="w-full px-6 pb-10 pt-24 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                className={`${tech.className} text-[0.7rem] sm:text-[0.8rem] uppercase tracking-[0.35em] text-white/80`}
              >
                Nextrend Design
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

                <motion.span
                  className="block text-[1.6rem] font-normal text-white/95 sm:text-[1.9rem]"
                  variants={wordVariant}
                >
                  Architecture, tuned.
                </motion.span>
              </motion.div>

              {/* short hero paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                className="mt-4 max-w-xl text-[0.85rem] leading-relaxed text-white/90 sm:text-sm md:text-base"
              >
                We shape sound into the architecture so equipment fades back and
                the atmosphere is what you notice.
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
            We begin with your drawings. Plans, elevations, joinery and
            services. Our work is to make the audio feel native to that
            structure, not applied on top.
          </p>

          <p
            className={`${tech.className} text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.24em] text-[rgba(196,156,74,0.9)]`}
          >
            CAD &amp; REVIT overlays · Acoustic modelling · Materials palettes
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
              className={`${serif.className} text-xl font-semibold text-neutral-900 sm:text-2xl`}
            >
              {"Integration studies".split(" ").map((word, i) => (
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
              We place loudspeakers, grilles and electronics directly on
              reflected ceiling plans and elevations so every opening reads as
              part of the interior language.
            </p>
            <ul className="space-y-2 text-sm text-neutral-800">
              <li>• Invisible loudspeaker arrays and plaster build-ups</li>
              <li>• Custom grille, veneer and metalwork detailing</li>
              <li>• Ventilation and service allowances for concealed racks</li>
            </ul>
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
              className={`${serif.className} text-xl font-semibold text-neutral-900 sm:text-2xl`}
            >
              {"Experience guidelines".split(" ").map((word, i) => (
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
              We issue concise briefs for how each room should feel in level,
              tone and isolation so finishes and furniture choices support the
              listening intent.
            </p>
            <ul className="space-y-2 text-sm text-neutral-800">
              <li>• Target levels, isolation and background noise</li>
              <li>• Lighting, control and sightline considerations</li>
              <li>• FF&amp;E guidance for even, natural coverage</li>
            </ul>
          </motion.article>
        </div>
      </section>

      <ServicesCrossPromo current="Design" />
    </main>
  );
}
