"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { buildAssetUrl } from "@/lib/assets";
import { journalProjects } from "./data/journalProjects";

export default function JournalPage() {
  /* ---------- design tokens (champagne & onyx) ---------- */
  const tokens: CSSProperties = {
    "--nt-champagne": "#f6e6cF",
    "--nt-champagne-strong": "#f0d9b3",
    "--nt-ink": "#0f0f10",
    "--nt-ink-80": "rgba(15,15,16,0.8)",
    "--nt-ink-60": "rgba(15,15,16,0.6)",
    "--nt-ink-40": "rgba(15,15,16,0.4)",
    "--nt-white-92": "rgba(255,255,255,0.92)",
  };

  const ease = [0.25, 0.46, 0.45, 0.94] as const;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  // R2-backed video URL, file is at bucket root: Nextrend_Journal.mp4
  const JOURNAL_VIDEO_SRC = buildAssetUrl("", "Nextrend_Journal.mp4");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        await v.play();
        setVideoReady(true);
      } catch {
        setVideoReady(true);
      }
    };

    tryPlay();
  }, []);

  const handleCanPlay = () => setVideoReady(true);

  return (
    <div
      className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(246,230,207,0.25),transparent_60%)]"
      style={tokens}
    >
      {/* -------------------- HERO (video + title) -------------------- */}
      <section className="relative w-full">
        <div className="relative">
          <div
            className="
              relative w-full overflow-hidden bg-black
              h-[70vh] min-h-[520px]
              sm:h-[78vh]
              lg:h-screen
            "
          >
            <motion.video
              ref={videoRef}
              className="
                pointer-events-none absolute inset-0 h-full w-full
                object-cover object-[50%_40%] sm:object-center
              "
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Nextrend Journal motion backdrop"
              onCanPlay={handleCanPlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: videoReady ? 1 : 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <source src={JOURNAL_VIDEO_SRC} type="video/mp4" />
            </motion.video>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(140%_140%_at_10%_-10%,rgba(246,230,207,0.16),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/5 sm:from-black/45" />

            <div
              className="
                relative z-10 flex h-full w-full flex-col
                items-center justify-end
                px-5 pb-16 pt-24
                sm:items-start sm:justify-center sm:px-10 sm:pb-20
                lg:px-16 lg:pb-24
              "
            >
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                className="
                  text-center sm:text-left
                  font-light leading-[0.98]
                  text-[2.1rem]
                  xs:text-[2.4rem]
                  sm:text-[2.8rem]
                  md:text-[3.2rem]
                  lg:text-[3.6rem]
                  xl:text-[4.1rem]
                  tracking-tight
                "
                style={{
                  color: "var(--nt-champagne)",
                  fontFamily:
                    '"Playfair Display","Times New Roman",ui-serif,Georgia,serif',
                }}
              >
                Journal Dispatch
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.18 }}
                className="
                  mt-4 max-w-xl
                  text-center sm:text-left
                  text-[0.75rem]
                  xs:text-[0.8rem]
                  sm:text-[0.85rem]
                  md:text-sm
                  lg:text-base
                  font-light tracking-[0.22em] uppercase
                "
                style={{ color: "var(--nt-white-92)" }}
              >
                Hear our story in spaces, projects, and quiet details.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- INTRO COPY (premium alignment on mobile) -------------------- */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 xs:px-6 sm:px-8 sm:pt-12 lg:px-16 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease }}
            className="space-y-4 text-left"
          >
            {/* align label with card edge + add a subtle divider rhythm on mobile */}
            <div className="inline-flex items-center gap-3">
              <p className="text-[0.7rem] xs:text-[0.75rem] sm:text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Nextrend Journal
              </p>
              <span className="h-px w-10 bg-black/10" aria-hidden />
            </div>

            <p className="text-[1.02rem] xs:text-[1.08rem] sm:text-xl font-light leading-[1.65] text-neutral-900 max-w-3xl">
              A slow, considered record of the spaces we tune, the people we work
              with, and the ideas shaping architectural sound.
            </p>

            <p className="text-[0.86rem] xs:text-[0.92rem] sm:text-sm font-light leading-[1.9] text-neutral-600 max-w-3xl">
              Each dispatch pairs installations, experiments, and notes from the
              field—so you can follow how a sketch becomes an atmosphere, and how
              European audio craft finds a home in Southeast Asian architecture.
            </p>
          </motion.div>
        </div>
      </section>

      {/* -------------------- PROJECTS GRID -------------------- */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-2 xs:px-6 sm:px-8 lg:px-16 lg:pt-6">
        <motion.div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
          {journalProjects.map((project, idx) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.7,
                ease,
                delay: Math.min(idx * 0.06, 0.4),
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Link
                href={`/journal/${project.slug}`}
                className="group block touch-manipulation"
              >
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.28, ease }}
                  className="cursor-pointer space-y-4 sm:space-y-5"
                >
                  {/* image card */}
                  <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-neutral-200">
                    <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                      <Image
                        src={project.heroImage}
                        alt={project.title}
                        fill
                        priority={false}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      />
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-[rgba(246,230,207,0.12)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="pointer-events-none absolute left-3 top-3 sm:left-5 sm:top-5">
                      <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/60 bg-[color:var(--nt-white-92)] backdrop-blur-sm">
                        <span className="text-[0.7rem] sm:text-xs font-light text-neutral-800">
                          {project.projectNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* copy */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-neutral-500">
                      <span className="text-[0.7rem] sm:text-xs font-light uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="hidden h-1 w-1 rounded-full bg-neutral-400 sm:inline-block" />
                      <span className="text-[0.7rem] sm:text-xs font-light">
                        Project {project.projectNumber}
                      </span>
                    </div>

                    <h2 className="text-[1.05rem] xs:text-[1.15rem] sm:text-xl lg:text-2xl font-light leading-tight text-neutral-900 transition-colors group-hover:text-neutral-700">
                      {project.title}
                    </h2>

                    <p className="line-clamp-3 text-[0.8rem] xs:text-[0.9rem] sm:text-sm font-light leading-relaxed text-neutral-600">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 sm:pt-2">
                      {project.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full border border-[rgba(15,15,16,0.12)] px-3 py-1 text-[0.65rem] sm:text-[0.7rem] font-medium uppercase tracking-[0.18em] text-neutral-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* CTA row */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3">
                      <span className="text-[0.7rem] sm:text-xs font-light tracking-wide text-neutral-500">
                        {project.readTime}
                      </span>

                      {/* Mobile: no underline ever. Desktop: underline only on press (kept) */}
<motion.span
  className="inline-flex items-center gap-2"
  initial="rest"
  whileHover="hover"   // desktop
  whileTap="press"     // mobile
  animate="rest"
>
  {/* Text: never changes color, never underlines */}
  <span className="text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.26em] text-[#111111] no-underline">
    Read&nbsp;More
  </span>

  {/* Circle: NO color/border change */}
  <motion.span
    variants={{
      rest: { x: 0, scale: 1 },
      hover: { x: 4, scale: 1 },
      press: { scale: 0.96 },
    }}
    className="pointer-events-none relative inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border bg-white overflow-hidden"
    style={{ borderColor: "rgba(15,15,16,0.2)" }}
    aria-hidden
  >
    {/* Arrow: ONLY thing that changes color */}
    <motion.span
      variants={{
        rest: { color: "#111111" },
        hover: { color: "var(--nt-champagne)" },
        press: { color: "var(--nt-champagne)" },
      }}
      className="inline-flex items-center justify-center"
      aria-hidden
    >
      <ArrowRight size={17} weight="bold" aria-hidden />
    </motion.span>

    {/* keep your glow sweep if you want (doesn't affect border/text) */}
    <motion.span
      className="pointer-events-none absolute inset-0 rounded-full"
      style={{
        background:
          "radial-gradient(120% 120% at -30% -30%, rgba(246,230,207,0.0) 40%, rgba(246,230,207,0.35) 55%, rgba(246,230,207,0.0) 70%)",
      }}
      variants={{
        rest: { opacity: 0, x: "-20%", y: "-20%" },
        hover: {
          opacity: 1,
          x: "35%",
          y: "35%",
          transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        press: { opacity: 1, x: "45%", y: "45%" },
      }}
      aria-hidden
    />
  </motion.span>
</motion.span>

                    </div>
                  </div>
                </motion.article>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* -------------------- FOOTER CTA -------------------- */}
      <div className="border-t border-[rgba(15,15,16,0.08)] bg-[radial-gradient(900px_400px_at_10%_120%,rgba(246,230,207,0.18),transparent_65%)]">
        <div className="mx-auto max-w-6xl px-5 py-14 xs:px-6 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="space-y-6 text-center"
          >
            <motion.h3
              className="text-[1.05rem] xs:text-[1.15rem] sm:text-xl font-light text-neutral-900"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: { opacity: 1 },
                show: { opacity: 1, transition: { staggerChildren: 0.035 } },
              }}
            >
              {"Want to collaborate—or be part of our story?"
                .split(" ")
                .map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: "0.8em", opacity: 0, filter: "blur(6px)" },
                      show: {
                        y: "0em",
                        opacity: 1,
                        filter: "blur(0px)",
                        transition: { duration: 0.45, ease },
                      },
                    }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
            </motion.h3>

            <motion.p
              className="mx-auto max-w-2xl text-[0.8rem] xs:text-[0.9rem] sm:text-sm font-light text-neutral-600"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                hidden: { opacity: 1 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.028, delayChildren: 0.1 },
                },
              }}
            >
              {"We’re always open to thoughtful partnerships across design, technology, and sound."
                .split(" ")
                .map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: "0.7em", opacity: 0, filter: "blur(5px)" },
                      show: {
                        y: "0em",
                        opacity: 1,
                        filter: "blur(0px)",
                        transition: { duration: 0.35, ease },
                      },
                    }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
            </motion.p>

            {/* Talk to us: only arrow anim + color change */}
            <motion.div
              initial="rest"
              whileHover="hover"
              whileTap="press"
              animate="rest"
              className="inline-block"
            >
              <Link
                href="/contact"
                aria-label="Talk to us"
                className="inline-flex items-center gap-3 rounded-xl border px-7 py-3 sm:px-8 sm:py-4 text-[0.7rem] sm:text-xs font-medium bg-transparent"
                style={{
                  borderColor: "var(--nt-champagne)",
                  color: "var(--nt-ink)",
                }}
              >
                <span className="uppercase tracking-[0.26em]">Talk to us</span>

                <motion.span
                  variants={{
                    rest: { x: 0, color: "var(--nt-ink)", scale: 1 },
                    hover: {
                      x: 4,
                      color: "var(--nt-champagne)",
                      transition: { duration: 0.25 },
                    },
                    press: { scale: 0.96, color: "var(--nt-champagne)" },
                  }}
                  className="inline-flex h-5 w-5 items-center justify-center"
                  aria-hidden
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
