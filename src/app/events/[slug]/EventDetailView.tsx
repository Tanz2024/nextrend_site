"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type React from "react";

import type { EventDetail, EventSummary } from "../data";
import { EVENT_SUMMARIES } from "../data";
import { buildEventsUrl } from "@/lib/assets";
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

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

type Props = {
  detail: EventDetail;
  summary?: EventSummary;
};

export function EventDetailView({ detail, summary }: Props) {
  const images = useMemo(
    () =>
      (detail.gallery ?? []).filter(
        (src): src is string =>
          typeof src === "string" && src.trim() && !src.includes("undefined")
      ),
    [detail.gallery]
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  // init loading map for thumbnails
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    for (const src of images) initial[src] = true;
    setImageLoading(initial);
  }, [images]);

  /* ------------------------------------------
     BODY SCROLL LOCK (PREMIUM, NO PAGE SCROLL)
  ------------------------------------------ */
  useEffect(() => {
    if (selectedImageIndex !== null) {
      // Store scroll position
      const scrollY = window.scrollY;
      
      // Lock scroll on both html and body
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.position = "fixed";
      document.documentElement.style.top = `-${scrollY}px`;
      document.documentElement.style.width = "100%";
      
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      // Restore scroll position
      const scrollY = document.documentElement.style.top;
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.top = "";
      document.documentElement.style.width = "";
      
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.position = "";
      document.body.style.width = "";
      
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.top = "";
      document.documentElement.style.width = "";
      
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [selectedImageIndex]);

  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) => {
      if (prev === null || images.length === 0) return prev;
      return (prev + 1) % images.length;
    });
  }, [images.length]);

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prev) => {
      if (prev === null || images.length === 0) return prev;
      return (prev - 1 + images.length) % images.length;
    });
  }, [images.length]);

  // keyboard nav in lightbox
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImageIndex, prevImage, nextImage, closeModal]);

  const handleImageLoaded = useCallback((imageSrc: string) => {
    setImageLoading((prev) => ({ ...prev, [imageSrc]: false }));
  }, []);

  // swipe support (lightbox)
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) nextImage();
      else prevImage();
    }
    touchStartX.current = null;
  };

  const heroSrc =
    (detail.heroMedia?.kind === "video"
      ? detail.heroMedia.poster
      : detail.heroMedia?.src) ||
    (summary?.heroMedia?.kind === "video"
      ? summary.heroMedia.poster
      : summary?.heroMedia?.src) ||
    images?.[0] ||
    buildEventsUrl("Suara_Festival_Bali_1.jpg");

  const moreEvents = useMemo(() => {
    return EVENT_SUMMARIES.filter((e) => e.slug !== detail.slug).slice(0, 3);
  }, [detail.slug]);

  return (
    <div
      className={`${poppins.className} relative min-h-screen bg-[#FAF8F3] text-[#141414]`}
      style={
        {
          "--accent": "#C6AA76",
          "--accent-soft": "rgba(198,170,118,0.15)",
        } as React.CSSProperties
      }
    >
      {/* Ambient lighting */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_0%,rgba(198,170,118,0.15),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_90%_10%,rgba(198,170,118,0.08),transparent_70%)]" />

      {/* FULL-BLEED HERO */}
      <section className="relative w-full">
        <div className="relative w-full overflow-hidden h-[50vh] min-h-[380px] sm:h-[58vh] sm:min-h-[420px] md:h-[72vh] md:min-h-[520px]">
          <div className="absolute inset-0">
            <Image
              src={heroSrc}
              alt={detail.title}
              fill
              priority
              quality={92}
              className="object-cover object-[center_35%] sm:object-center"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 90vw, 100vw"
            />
          </div>

          {/* readability + glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent sm:from-black/35 sm:via-black/10" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.35),rgba(0,0,0,0.12)_45%,rgba(0,0,0,0)_72%)]" />

          {/* breadcrumb */}
          <div className="absolute left-3 right-3 top-3 sm:left-4 sm:right-4 sm:top-4 md:left-10 md:right-10 md:top-6 lg:left-12 lg:right-12">
            <nav
              className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.34em] font-semibold"
              style={{
                color: "rgba(198,170,118,0.92)",
                textShadow: "0 1px 2px rgba(0,0,0,0.55)",
              }}
            >
              <Link
                href="/events"
                className="flex items-center gap-1.5 transition-colors hover:text-[rgba(198,170,118,1)]"
              >
                <svg
                  className="h-4 w-4 opacity-70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-bold underline underline-offset-[6px] decoration-[rgba(198,170,118,0.35)] hover:decoration-[rgba(198,170,118,0.75)]">
                  Events
                </span>
              </Link>
              <span className="mx-1 text-[rgba(198,170,118,0.6)] font-bold">
                /
              </span>
              <span className="truncate font-bold text-white/75">
                {detail.title}
              </span>
            </nav>
          </div>

          {/* title vignette */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 bottom-0 h-[68%] w-[92%] sm:h-[62%] sm:w-[66%] bg-[radial-gradient(ellipse_at_18%_85%,rgba(0,0,0,0.62),rgba(0,0,0,0)_64%)]" />
          </div>

          {/* overlay content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute inset-x-0 bottom-0"
          >
            <div className="mx-auto w-full max-w-[1180px] px-3 sm:px-4 md:px-10 lg:px-12 pb-6 sm:pb-10 md:pb-18 lg:pb-20">
              <div className="max-w-[52rem] space-y-2 sm:space-y-3 md:space-y-4">
                {detail.category ? (
                  <p
                    className="text-[0.65rem] sm:text-[0.7rem] md:text-[0.78rem] uppercase tracking-[0.32em] sm:tracking-[0.38em] font-extrabold text-[#C6AA76] drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]"
                    style={{ letterSpacing: "0.32em" }}
                  >
                    {detail.category}
                  </p>
                ) : null}

                <h1
                  className="text-white mt-0 font-light leading-[1.1] sm:leading-[1.05] text-[clamp(1.75rem,8vw,2.05rem)] sm:text-[clamp(2.05rem,9.2vw,3.2rem)] md:text-[clamp(2.2rem,5.2vw,4.2rem)]"
                  style={{
                    fontFamily:
                      '"Playfair Display","Bodoni Moda","Times New Roman",ui-serif,Georgia,serif',
                    textRendering: "optimizeLegibility",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                  }}
                >
                  {detail.title}
                </h1>

                {(detail.location || detail.dateRange) && (
                  <div className="text-[0.68rem] sm:text-[0.72rem] md:text-[0.82rem] uppercase font-medium text-white/92 drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 tracking-[0.1em] sm:tracking-[0.14em] md:tracking-[0.28em]">
                      {detail.location && <span>{detail.location}</span>}

                      {/* Mobile/tablet: keep inline with dot */}
                      {detail.location && detail.dateRange ? (
                        <span className="md:hidden text-white/70"> · </span>
                      ) : null}

                      {detail.dateRange ? (
                        <span className="md:hidden">{detail.dateRange}</span>
                      ) : null}
                    </div>

                    {/* Desktop: date on next line */}
                    {detail.dateRange ? (
                      <div className="hidden md:block mt-2 tracking-[0.28em] text-white/90">
                        {detail.dateRange}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto w-full max-w-[1180px] px-3 sm:px-4 md:px-10 lg:px-12 pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16">
        <div className="space-y-12 sm:space-y-16 md:space-y-20">
          {/* INFORMATION BLOCKS */}
          <section className="mx-auto w-full max-w-[840px] space-y-10 sm:space-y-12 md:space-y-14 px-1 sm:px-2 md:px-0">
            {/* The Story */}
            {detail.profile?.length ? (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.1,
                }}
                className="space-y-4 sm:space-y-5"
              >
                <h3
                  className={`${cormorant.className} text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#C6AA76]`}
                >
                  Profile
                </h3>
                <article className="prose prose-neutral max-w-none space-y-6 prose-p:leading-[1.85] sm:prose-p:leading-[2] md:prose-p:leading-[2.15] prose-p:text-[0.95rem] sm:prose-p:text-[1.05rem] md:prose-p:text-[1.08rem] prose-p:text-[#2A2A2A]">
              {detail.profile.map((p) => (
                <p key={p} className="font-[300]">
                  {p}
                </p>
              ))}
            </article>
              </motion.section>
            ) : null}

            {/* Behind the Scenes */}
            {detail.role?.length ? (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.15,
                }}
                className="space-y-4 sm:space-y-5"
              >
                <h3
                  className={`${cormorant.className} text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#C6AA76]`}
                >
                  Event Overview
                </h3>
                <article className="prose prose-neutral max-w-none prose-p:leading-[1.85] sm:prose-p:leading-[2] md:prose-p:leading-[2.15] prose-p:text-[0.95rem] sm:prose-p:text-[1.05rem] md:prose-p:text-[1.08rem] prose-p:text-[#2A2A2A]">
                  {detail.role.map((p) => (
                    <p key={p} className="font-[300]">
                      {p}
                    </p>
                  ))}
                </article>
              </motion.section>
            ) : null}

            {/* Moments That Mattered */}
            {detail.additionalNotes?.length ? (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.2,
                }}
                className="space-y-4 sm:space-y-5"
              >
                <h3
                  className={`${cormorant.className} text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#C6AA76]`}
                >
                  Event Overview
                </h3>
                <article className="prose prose-neutral max-w-none prose-p:leading-[1.85] sm:prose-p:leading-[2] md:prose-p:leading-[2.15] prose-p:text-[0.95rem] sm:prose-p:text-[1.05rem] md:prose-p:text-[1.08rem] prose-p:text-[#2A2A2A]">
                  {detail.additionalNotes.map((p) => (
                    <p key={p} className="font-[300]">
                      {p}
                    </p>
                  ))}
                </article>
              </motion.section>
            ) : null}

            {images.length > 0 && (
              <div
                className={`${poppins.className} space-y-20 sm:space-y-24 lg:space-y-28 px-2 sm:px-0`}
              >
                {images.slice(0, 3).map((image, index) => {
                  const blockText =
                    detail.eventNarrative?.[index] ?? detail.overview ?? "";

                  const photoAddress =
                    (Array.isArray(detail.photoAddress)
                      ? detail.photoAddress[index]
                      : undefined) ??
                    (typeof detail.photoAddress === "string"
                      ? detail.photoAddress
                      : undefined) ??
                    detail.location ??
                    "On site";

                  const isEven = index % 2 === 0;
                  const rhythmWrap = isEven ? "lg:pl-6" : "lg:pr-6";

                  return (
                    <motion.section
                      key={`${image}-${index}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.7,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: index * 0.1,
                      }}
                      className="space-y-8 sm:space-y-10"
                    >
                      <figure className="space-y-5 sm:space-y-6">
                        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#FAF8F3]">
                          <div
                            className={`mx-auto max-w-[1180px] px-4 sm:px-10 lg:px-12 py-6 sm:py-8 ${rhythmWrap}`}
                          >
                            <div className="mx-auto w-full max-w-[460px] sm:max-w-[620px] md:max-w-[740px] lg:max-w-[900px] xl:max-w-[1020px]">
                              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#FAF8F3]">
                                <div className="relative w-full h-[320px] sm:h-[50vh] sm:min-h-[320px] lg:h-[540px]">
                                  <Image
                                    src={image}
                                    alt={`${detail.title} image ${index + 1}`}
                                    fill
                                    sizes="(max-width:640px) 460px, (max-width:768px) 620px, (max-width:1024px) 740px, (max-width:1280px) 900px, 1020px"
                                    className="object-contain"
                                    priority={index === 0}
                                    quality={92}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </figure>

                      {blockText ? (
                        <div className="mx-auto max-w-[52rem] px-4 sm:px-0">
                          <p
  className={[
    "text-[1.0rem] sm:text-[1.05rem] md:text-[1.08rem]",
    "leading-[1.95] sm:leading-[2.05] md:leading-[2.1]",
    "text-[#1F1F1F] font-[300]",
    "tracking-[0.004em] sm:tracking-[0.006em]",
    "mx-auto max-w-[66ch]",
  ].join(" ")}
>
  {blockText}
</p>

                        </div>
                      ) : null}


                    </motion.section>
                  );
                })}
              </div>
            )}

            {/* What Was Used */}
            {detail.keyProducts?.length ? (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.25,
                }}
                className="space-y-4 sm:space-y-5"
              >
                <h3
                  className={`${cormorant.className} text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#C6AA76]`}
                >
                  Sound System
                </h3>
                <ul className="space-y-2.5 sm:space-y-3 text-[0.95rem] sm:text-[1.05rem] leading-[1.9] sm:leading-[2.1] text-[#2A2A2A] list-disc pl-4 sm:pl-5 marker:text-[#C6AA76]/70">
                  {detail.keyProducts.map((p) => (
                    <li key={p} className="font-[300]">
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.section>
            ) : null}
          </section>

          {/* GALLERY + LIGHTBOX */}
          {images.length > 0 && (
            <motion.section
              id="gallery"
              className="space-y-6 sm:space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeInUp}
            >
              <div className="text-center space-y-2 sm:space-y-3">
                <h2
                  className="text-[clamp(1.5rem,5vw,1.8rem)] sm:text-[clamp(1.8rem,3vw,2.4rem)] font-light text-[#141414]"
                  style={{
                    fontFamily:
                      '"Playfair Display","Bodoni Moda","Times New Roman",ui-serif,Georgia,serif',
                  }}
                >
                  Event Gallery
                </h2>
                <p className="text-[0.75rem] sm:text-[0.85rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#C6AA76]">
                  Explore the Experience
                </p>
                <div className="mx-auto h-[2px] w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#C6AA76] to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                  <motion.div
                    key={`${image}-${index}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-[1.35rem] md:rounded-[1.6rem] cursor-pointer bg-[#f5f5f5] active:scale-[0.98] sm:active:scale-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleImageClick(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleImageClick(index);
                    }}
                    aria-label={`Open image ${index + 1} of ${images.length}`}
                  >
                    {imageLoading[image] ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5]">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C6AA76] border-t-transparent" />
                      </div>
                    ) : null}

                    <Image
                      src={image}
                      alt={`${detail.title} gallery ${index + 1}`}
                      fill
                      sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={index < 6 ? "eager" : "lazy"}
                      quality={80}
                      onLoadingComplete={() => handleImageLoaded(image)}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-xs font-medium text-white/90 backdrop-blur-sm bg-black/30 rounded-lg px-3 py-1.5">
                        Click to view
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {selectedImageIndex !== null && (
                  <motion.div
                    className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm overflow-hidden overscroll-none p-4 sm:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={closeModal}
                    onWheel={(e) => e.preventDefault()}
                    onTouchMove={(e) => {
                      // Allow scrolling only if target is scrollable
                      const target = e.target as HTMLElement;
                      if (!target.closest('[data-scrollable]')) {
                        e.preventDefault();
                      }
                    }}
                    aria-modal="true"
                    role="dialog"
                  >
                    <div
                      className="relative mx-auto w-[min(92vw,1100px)] h-[min(88vh,760px)] flex items-center justify-center overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={onTouchStart}
                      onTouchEnd={onTouchEnd}
                    >
                      <motion.div
                        key={selectedImageIndex}
                        className="relative w-full h-full overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <Image
                          src={images[selectedImageIndex]}
                          alt={`${detail.title} gallery ${selectedImageIndex + 1}`}
                          fill
                          sizes="92vw"
                          className="object-contain"
                          quality={95}
                          priority
                        />
                      </motion.div>

                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
                            aria-label="Previous image"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={nextImage}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
                            aria-label="Next image"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </>
                      )}

                      <button
                        onClick={closeModal}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95 z-50"
                        aria-label="Close gallery"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white/90 text-xs sm:text-sm font-medium">
                        {selectedImageIndex + 1} of {images.length}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {/* FOOTER CTA */}
          <section className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-14 md:mb-16 flex flex-col items-center text-center space-y-8 sm:space-y-10 py-10 sm:py-12 md:py-16 px-4 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              <h3
                className="text-[clamp(1.5rem,4vw,2.3rem)] font-light text-[#141414] tracking-tight leading-tight"
                style={{
                  fontFamily:
                    '"Playfair Display","Bodoni Moda","Times New Roman",ui-serif,Georgia,serif',
                }}
              >
                Experience Architectural Sound
              </h3>
              <p className="text-[0.75rem] sm:text-[0.8rem] md:text-[0.85rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em] text-[#C6AA76] font-medium">
                Every space tells its story
              </p>
              <div className="mx-auto h-[2px] w-28 bg-gradient-to-r from-transparent via-[#C6AA76] to-transparent" />
            </div>

            <div className="flex justify-center pt-1 sm:pt-2">
              <Link
                href="/contact"
                className="group relative rounded-full bg-white border-2 border-[#C6AA76] px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 text-[9px] sm:text-[9.5px] md:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.4em] font-semibold text-[#141414] shadow-[0_6px_24px_rgba(198,170,118,0.25)] hover:shadow-[0_12px_48px_rgba(198,170,118,0.35)] active:scale-[0.98] hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6AA76]/60"
              >
                <span className="relative">
                  <span className="transition-colors duration-300 group-hover:text-[#C6AA76]">
                    Enquire About This Event
                  </span>
                  <span
                    className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#C6AA76] transition-all duration-500 ease-out group-hover:w-full"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          </section>

          {/* MORE EVENTS */}
          <section className="mt-12 sm:mt-16 md:mt-20 mb-10 sm:mb-12 px-3 sm:px-2 md:px-0">
            <div className="mb-6 sm:mb-7 md:mb-8 border-b border-[#C6AA76]/20 pb-3 sm:pb-4">
              <h2
                className="text-[1.15rem] sm:text-[1.25rem] md:text-[1.35rem] font-light tracking-[0.005em] text-[#2A2A2A]"
                style={{
                  fontFamily:
                    '"Playfair Display","Bodoni Moda","Times New Roman",ui-serif,Georgia,serif',
                }}
              >
                More Events
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreEvents.map((event) => (
                <motion.article
                  key={event.slug}
                  className="group relative overflow-hidden rounded-[1.6rem] bg-white/60 shadow-[0_14px_38px_rgba(198,170,118,0.16)] ring-1 ring-[#C6AA76]/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/events/${event.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                      {(() => {
                        let imageSrc: string | null = null;

                        if (event.gallery?.length) {
                          const validGallery = event.gallery.filter(
                            (img) =>
                              img && img.trim() && !img.includes("undefined")
                          );
                          if (validGallery.length) imageSrc = validGallery[0];
                        }

                        if (!imageSrc && event.heroMedia) {
                          if (
                            event.heroMedia.kind === "image" &&
                            event.heroMedia.src?.trim()
                          ) {
                            imageSrc = event.heroMedia.src;
                          } else if (
                            event.heroMedia.kind === "video" &&
                            event.heroMedia.poster?.trim()
                          ) {
                            imageSrc = event.heroMedia.poster;
                          }
                        }

                        if (imageSrc) {
                          return (
                            <Image
                              src={imageSrc}
                              alt={`${event.title} preview`}
                              fill
                              sizes="(min-width:1024px) 420px, (min-width:640px) 50vw, 100vw"
                              className="object-cover transition duration-500 group-hover:scale-[1.03]"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          );
                        }

                        return (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#F5F2EC] to-[#C6AA76]/20 flex items-center justify-center">
                            <div className="text-center space-y-2">
                              <div className="w-12 h-12 mx-auto bg-[#C6AA76]/20 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-[#C6AA76]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C6AA76]/80">
                                Event
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 px-6 pt-5">
                    <span className="rounded-full border border-[#C6AA76]/35 bg-[#FAF8F3] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A48B56]">
                      {event.category}
                    </span>
                  </div>

                  <div className="px-6 pb-6 pt-3">
                    <h3 className="text-[1.12rem] leading-snug tracking-[-0.01em] text-[#2A2A2A] font-light">
                      <Link
                        href={`/events/${event.slug}`}
                        className="hover:text-[#C6AA76] transition-colors duration-300"
                      >
                        {event.title}
                      </Link>
                    </h3>

                    <p className="mt-3 line-clamp-3 text-[0.95rem] leading-[1.9] text-[#666]">
                      {event.shortDescription}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
