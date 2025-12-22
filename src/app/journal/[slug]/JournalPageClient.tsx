"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import type { JournalProject } from "../data/journalProjects";
import { Poppins, Cormorant_Garamond } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

interface JournalPageClientProps {
  currentProject: JournalProject;
  relatedProjects: JournalProject[];
}

export default function JournalPageClient({
  currentProject,
  relatedProjects,
}: JournalPageClientProps) {
  /* ---------- design tokens (champagne editorial) ---------- */
  const tokens = useMemo(
    () =>
      ({
        ["--accent" as any]: "#C6AA76",
        ["--accent-soft" as any]: "rgba(198,170,118,0.15)",
        ["--ink" as any]: "#141414",
        ["--ink-70" as any]: "rgba(20,20,20,0.70)",
        ["--ink-55" as any]: "rgba(20,20,20,0.55)",
      }) as CSSProperties,
    []
  );

  const ease = [0.25, 0.46, 0.45, 0.94] as const;

  /* ---------- motion ---------- */
  const fadeUp = {
    initial: { opacity: 0, y: 18, filter: "blur(6px)" },
    whileInView: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease },
    },
    viewport: { once: true, amount: 0.25 },
  };

  /* ---------- gallery / lightbox ---------- */
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const totalImages = currentProject.images.length;

  const goToNextImage = useCallback(() => {
    if (!totalImages) return;
    setActiveImageIndex((p) => (p + 1) % totalImages);
  }, [totalImages]);

  const goToPrevImage = useCallback(() => {
    if (!totalImages) return;
    setActiveImageIndex((p) => (p - 1 + totalImages) % totalImages);
  }, [totalImages]);

  // premium scroll lock
  useEffect(() => {
    if (!isImageExpanded) return;

    const scrollY = window.scrollY;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.position = "fixed";
    document.documentElement.style.top = `-${scrollY}px`;
    document.documentElement.style.width = "100%";

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    return () => {
      const top = document.documentElement.style.top;

      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.top = "";
      document.documentElement.style.width = "";

      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.position = "";
      document.body.style.width = "";

      window.scrollTo(0, parseInt(top || "0", 10) * -1);
    };
  }, [isImageExpanded]);

  useEffect(() => {
    if (!isImageExpanded || !totalImages) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsImageExpanded(false);
      if (e.key === "ArrowRight") goToNextImage();
      if (e.key === "ArrowLeft") goToPrevImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isImageExpanded, totalImages, goToNextImage, goToPrevImage]);

  return (
    <div
      className={`${poppins.className} relative min-h-screen bg-[#FAF8F3] text-[#141414]`}
      style={tokens}
    >
      {/* Ambient lighting */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_0%,rgba(198,170,118,0.15),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_90%_10%,rgba(198,170,118,0.08),transparent_70%)]" />

      {/* ---------- HERO (full-bleed image) ---------- */}
      <section className="relative w-full isolate">
        <div className="relative min-h-[60vh] sm:min-h-[68vh] lg:min-h-[86vh] overflow-hidden">
          <Image
            src={currentProject.heroImage}
            alt={currentProject.heroAlt || currentProject.title}
            fill
            priority
            className="object-cover object-[center_40%] sm:object-center"
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onError={(e) => {
              console.warn("Hero image failed to load:", currentProject.heroImage);
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        </div>
      </section>

      {/* ---------- TITLE + META ---------- */}
      <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-10 lg:px-12 pt-10 sm:pt-12 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="font-light text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.01em] text-[#141414]"
          style={{
            fontFamily:
              '"Playfair Display","Bodoni Moda","Times New Roman",ui-serif,Georgia,serif',
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          {currentProject.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.05 }}
          className="mt-3 flex flex-wrap items-center gap-3 text-[10.5px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.34em] font-semibold text-[color:var(--ink-55)]"
        >
          <span>{currentProject.category}</span>
          <span className="h-1 w-1 rounded-full bg-[color:var(--ink-55)]" />
          <span>{currentProject.timeline}</span>
          <span className="h-1 w-1 rounded-full bg-[color:var(--ink-55)]" />
          <span>{currentProject.readTime}</span>
        </motion.div>

        {currentProject.description ? (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="mt-5 max-w-3xl text-[0.98rem] sm:text-[1.05rem] leading-[1.95] text-[color:var(--ink-70)] font-[300] tracking-[0.01em]"
          >
            {currentProject.description}
          </motion.p>
        ) : null}
      </section>

      {/* ---------- OVERVIEW (image 2 editorial style) ---------- */}
      <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-10 lg:px-12 pt-8 sm:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.55, ease }}
          className="max-w-5xl"
        >
          <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.34em] text-[color:var(--accent)]">
            Overview
          </p>

          <div className="mt-4">
            <p className="text-[0.98rem] sm:text-[1.05rem] leading-[2.05] text-[color:var(--ink-70)] font-[300]">
              {currentProject.content.overview.join(" ")}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ---------- FEATURE IMAGE (FULL-BLEED) ---------- */}
      <motion.section
        initial={{ opacity: 0, scale: 0.985 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease }}
        className="relative my-12 sm:my-14"
      >
        <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw]">
          <div className="relative aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src={currentProject.images[0]?.src || currentProject.heroImage}
              alt={currentProject.images[0]?.alt || currentProject.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onError={(e) => {
                console.warn(
                  "Feature image failed to load:",
                  currentProject.images[0]?.src || currentProject.heroImage
                );
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </motion.section>

      {/* ---------- BODY ---------- */}
      <main className="mx-auto w-full max-w-[1180px] px-4 sm:px-10 lg:px-12 pb-24 space-y-16 sm:space-y-20">
        {/* Key Insights */}
        <motion.section {...fadeUp} className="space-y-5 sm:space-y-6">
          <h3
            className={`${cormorant.className} text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[color:var(--accent)]`}
          >
            Key Insights
          </h3>
          <ul className="space-y-3">
            {currentProject.content.insights.map((line, i) => (
              <li
                key={i}
                className="relative pl-6 text-[0.98rem] sm:text-[1.05rem] leading-[2.05] text-[color:var(--ink-70)] font-[300]"
              >
                <span
                  className="absolute left-0 top-[0.66em] block h-2 w-2 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                {line}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Setup Playbook */}
        {currentProject.content.methodology?.length ? (
          <motion.section {...fadeUp} className="space-y-5 sm:space-y-6">
            <h3
              className={`${cormorant.className} text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[color:var(--accent)]`}
            >
              Setup Playbook
            </h3>

            <ol className="space-y-4">
              {currentProject.content.methodology.map((step, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[auto,1fr] items-start gap-4"
                >
                  <span className="mt-[2px] shrink-0 text-[10px] sm:text-[11px] uppercase font-semibold tracking-[0.28em] text-[color:var(--ink-55)]">
                    STEP&nbsp;{String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.98rem] sm:text-[1.05rem] leading-[2.05] text-[color:var(--ink-70)] font-[300]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </motion.section>
        ) : null}

        {/* Gallery */}
        {currentProject.images.length > 0 ? (
          <motion.section {...fadeUp} className="space-y-5 sm:space-y-6">
            <div className="space-y-2 text-center">
              <h3
                className="text-[clamp(1.5rem,5vw,2.1rem)] font-light text-[#141414]"
                style={{
                  fontFamily:
                    '"Playfair Display","Bodoni Moda","Times New Roman",ui-serif,Georgia,serif',
                }}
              >
                Gallery
              </h3>
              <p className="text-[0.75rem] sm:text-[0.85rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[color:var(--accent)] font-semibold">
                Explore the Details
              </p>
              <div className="mx-auto h-[2px] w-20 sm:w-24 bg-gradient-to-r from-transparent via-[color:var(--accent)] to-transparent" />
            </div>

            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {currentProject.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(index);
                    setIsImageExpanded(true);
                  }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-[1.35rem] md:rounded-[1.6rem] ring-1 ring-[color:var(--accent)]/18 shadow-[0_18px_46px_rgba(198,170,118,0.10)] focus:outline-none active:scale-[0.98] sm:active:scale-100"
                  aria-label={`Open image ${index + 1} of ${currentProject.images.length}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onError={(e) => {
                      console.warn("Gallery image failed to load:", image.src);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </motion.section>
        ) : null}

        {/* Related (Read More aligned + no white panels) */}
        {relatedProjects.length > 0 ? (
          <motion.section {...fadeUp} className="space-y-6">
            <h3
              className={`${cormorant.className} text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[color:var(--accent)]`}
            >
              Related
            </h3>

            <div className="grid items-stretch gap-10 md:grid-cols-2">
              {relatedProjects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/journal/${p.slug}`}
                  className="group block h-full"
                >
                  <article className="flex h-full flex-col">
                    <div className="space-y-3">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-[1.35rem] ring-1 ring-[color:var(--accent)]/18 shadow-[0_18px_46px_rgba(198,170,118,0.10)]">
                        <Image
                          src={p.heroImage}
                          alt={p.heroAlt || p.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width:1024px) 100vw, 50vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                      </div>

                      <h4 className="text-[1.05rem] sm:text-[1.15rem] font-light text-[#141414] transition-colors group-hover:text-neutral-700">
                        {p.title}
                      </h4>

                      <p className="text-[0.95rem] sm:text-[1rem] leading-[1.9] text-[color:var(--ink-70)] line-clamp-2 font-[300]">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-5">
                      <motion.span
                        initial="rest"
                        whileHover="hover"
                        whileTap="press"
                        animate="rest"
                        className="inline-flex items-center gap-3"
                      >
                        <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.32em] text-[#141414]">
                          Read&nbsp;More
                        </span>

                        <motion.span
                          variants={{
                            rest: { x: 0, scale: 1 },
                            hover: {
                              x: 6,
                              scale: 1,
                              transition: { duration: 0.25 },
                            },
                            press: { scale: 0.96 },
                          }}
                          className="inline-flex items-center justify-center"
                          aria-hidden
                        >
                          <motion.span
                            variants={{
                              rest: { color: "var(--ink)" },
                              hover: { color: "var(--accent)" },
                              press: { color: "var(--accent)" },
                            }}
                            className="inline-flex"
                            aria-hidden
                          >
                            <ArrowRight size={16} weight="bold" aria-hidden />
                          </motion.span>
                        </motion.span>
                      </motion.span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </motion.section>
        ) : null}
      </main>

      {/* ---------- LIGHTBOX ---------- */}
      <AnimatePresence>
        {isImageExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] grid place-items-center p-4 sm:p-8"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={() => setIsImageExpanded(false)}
            aria-modal
            role="dialog"
            aria-label="Image viewer"
          >
            <motion.div
              initial={{ y: 22, scale: 0.985 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, scale: 0.985 }}
              transition={{ duration: 0.28, ease }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={
                  currentProject.images[activeImageIndex]?.src ||
                  currentProject.heroImage
                }
                alt={
                  currentProject.images[activeImageIndex]?.alt ||
                  currentProject.title
                }
                width={1920}
                height={1200}
                className="mx-auto max-h-[84vh] w-auto rounded-xl object-contain"
                sizes="90vw"
              />

              {currentProject.images.length > 1 && (
                <>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    {currentProject.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          i === activeImageIndex
                            ? "bg-[color:var(--accent)]"
                            : "bg-white/40"
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={goToPrevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur hover:bg-white/20 transition"
                    aria-label="Previous image"
                  >
                    <CaretLeft
                      size={20}
                      weight="bold"
                      aria-hidden
                      className="text-white/90"
                    />
                  </button>

                  <button
                    onClick={goToNextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur hover:bg-white/20 transition"
                    aria-label="Next image"
                  >
                    <CaretRight
                      size={20}
                      weight="bold"
                      aria-hidden
                      className="text-white/90"
                    />
                  </button>

                  <button
                    onClick={() => setIsImageExpanded(false)}
                    className="absolute top-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur hover:bg-white/20 transition"
                    aria-label="Close"
                  >
                    <X
                      size={20}
                      weight="bold"
                      aria-hidden
                      className="text-white/90"
                    />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
