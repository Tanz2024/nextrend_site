// src/app/services/consultation/ConsultationClient.tsx
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

export function ConsultationClient() {
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
              // image is at the bucket ROOT
              src={buildAssetUrl("", "Consultantation_title.png")}
              alt="Nextrend consultation – architectural sound study"
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
                "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 26%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.04) 80%, rgba(0,0,0,0) 100%)",
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
                Nextrend Consultation
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
                  {"Consultation".split(" ").map((word, i) => (
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
                  Listening, first.
                </motion.span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                className="mt-4 max-w-md text-[0.85rem] leading-relaxed text-white/90 sm:text-sm md:text-base"
              >
                We host quiet listening appointments—in our showroom or at your
                project—so you choose a system by experience, not guesswork.
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
                  aria-label="Book a consultation session with Nextrend"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-[#f6e6cf]/95 px-7 py-3 text-[0.8rem] font-medium uppercase tracking-[0.26em] text-[#111] backdrop-blur-md sm:text-[0.85rem]"
                >
                  <span>Book a session</span>
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

      {/* ───────── INTRO STRIP ───────── */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-16 sm:px-8 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="space-y-6 text-center"
        >
          <p
            className={`${serif.className} text-[0.95rem] sm:text-base leading-[1.9] text-neutral-800`}
          >
            Every project begins with a listening brief. We map how you watch,
            work, host and wind down, then translate this into coverage,
            headroom and control that feel effortless day-to-day.
          </p>

          <div className="space-y-2">
            <p
              className={`${tech.className} text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.26em] text-[rgba(196,156,74,0.85)]`}
            >
              Showroom sessions · On-site audits · Acoustic briefs
            </p>
            <p
              className={`${tech.className} text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.24em] text-[rgba(196,156,74,0.7)]`}
            >
              For homes, studios, hospitality and public spaces
            </p>
          </div>
        </motion.div>
      </section>

      {/* ───────── CONTENT SECTIONS ───────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-2 sm:px-8 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Immersive auditions */}
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
              {"Immersive auditions".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariant}
                  className="inline-block will-change-transform"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.h2>
            <p className="text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">
              Bring your own reference playlist or film scenes. We mirror your
              seating plan, finishes and listening level so you experience how
              the system breathes before anything is installed.
            </p>
            <ul className="space-y-2 text-sm text-neutral-800">
              <li>• Atmos and 2-channel switching with calibrated SPL</li>
              <li>• Instant A/B for hidden versus statement loudspeakers</li>
              <li>• Lighting and control mock-ups for integrated use</li>
            </ul>
          </motion.article>

          {/* Site reconnaissance */}
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
              {"Site reconnaissance".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariant}
                  className="inline-block will-change-transform"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.h2>
            <p className="text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">
              Our field engineers capture room dimensions, finishes, conduit
              paths and HVAC loads, then return a concise acoustic brief that
              you can share with designers and contractors.
            </p>
            <ul className="space-y-2 text-sm text-neutral-800">
              <li>• Laser measurements and impedance plots</li>
              <li>• Riser mark-ups and electrical load plans</li>
              <li>• Recommendations for acoustic treatment partners</li>
            </ul>
          </motion.article>
        </div>
      </section>

      <ServicesCrossPromo current="Consultation" />
    </main>
  );
}

export default function ConsultationPage() {
  return <ConsultationClient />;
}
