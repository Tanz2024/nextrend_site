"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildEventsUrl } from "@/lib/assets";
import { EVENT_SUMMARIES } from "./data";

const HERO_VIDEO = buildEventsUrl("event_title_video.mp4");

/* timings */
const FRAME_MS = 3600;
const FADE_MS = 900;

/* ---------- short bios + 3-image teasers (full gallery on detail page) ---------- */
type EventItem = {
  title: string;
  category: string;
  short: string;
  detailPath: string;
  teaser: string[];
};

const EVENTS: EventItem[] = EVENT_SUMMARIES.map((event) => {
  const gallery = Array.isArray(event.gallery) ? event.gallery : [];
  const teaser = gallery
    .filter((x) => typeof x === "string" && x.trim() && !x.includes("undefined"))
    .slice(0, 3);

  const hero =
    event.heroMedia?.kind === "image" && event.heroMedia.src?.trim()
      ? event.heroMedia.src
      : event.heroMedia?.kind === "video" && event.heroMedia.poster?.trim()
      ? event.heroMedia.poster
      : null;

  if (teaser.length === 0 && hero) teaser.push(hero);

  return {
    title: event.title,
    category: event.category,
    short: event.shortDescription,
    detailPath: `/events/${event.slug}`,
    teaser,
  };
});

/* ---------- slideshow (3 imgs) with cross-fade + Ken Burns ---------- */
function Slideshow({
  images,
  href,
  aspect = "aspect-[16/9]",
  maxH = "md:max-h-[520px]",
}: {
  images: string[];
  href: string;
  aspect?: string;
  maxH?: string;
}) {
  const safeImages = useMemo(
    () =>
      (images ?? []).filter(
        (src): src is string =>
          typeof src === "string" && src.trim() && !src.includes("undefined")
      ),
    [images]
  );

  const total = safeImages.length;
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  const next = () => setIdx((i) => (total ? (i + 1) % total : 0));
  const prev = () => setIdx((i) => (total ? (i - 1 + total) % total : 0));

  useEffect(() => {
    if (!total) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(next, FRAME_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, total]);

  const burnStart = useMemo(() => (idx % 2 === 0 ? 1.06 : 1.03), [idx]);
  const burnEnd = useMemo(() => (idx % 2 === 0 ? 1.0 : 1.08), [idx]);

  if (!total) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[1.6rem] ${aspect} ${maxH}`}
    >
      {/* CLICK ANYWHERE TO OPEN EVENT PAGE */}
      <Link
        href={href}
        aria-label="Open event"
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">Open</span>
      </Link>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_MS / 1000, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: burnStart }}
            animate={{ scale: burnEnd }}
            transition={{
              duration: (FRAME_MS + FADE_MS) / 1000,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <Image
              src={safeImages[idx]}
              alt={`slide ${idx + 1}`}
              fill
              sizes="(min-width:1280px) 1100px, 100vw"
              className="object-cover"
              priority={idx === 0}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Controls should NOT navigate */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Prev"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[#C6AA76]/40 bg-white/70 backdrop-blur hover:bg-white/80"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#111]">
              <path
                d="M14.5 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[#C6AA76]/40 bg-white/70 backdrop-blur hover:bg-white/80"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#111]">
              <path
                d="M9.5 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </>
      )}

      <div className="absolute left-1/2 bottom-3 z-20 -translate-x-1/2 flex gap-2 pointer-events-none">
        {safeImages.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-5 rounded-full ${
              i === idx ? "bg-[#C6AA76]" : "bg-[#C6AA76]/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- pagination (5 per page) ---------- */
const PAGE_SIZE = 5;

function usePage(): number {
  const params = useSearchParams();
  const p = Number(params.get("page") || "1");
  return Number.isFinite(p) && p >= 1 ? Math.floor(p) : 1;
}

function Pagination({ total }: { total: number }) {
  const page = usePage();
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex items-center justify-center gap-1">
      <Link
        href={`?page=${Math.max(1, page - 1)}`}
        className={`rounded-full px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
          page === 1
            ? "pointer-events-none opacity-30 text-[#C6AA76]/40"
            : "text-[#C6AA76] hover:text-[#D4B76A] hover:bg-[#C6AA76]/5"
        }`}
      >
        Prev
      </Link>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={`?page=${p}`}
          className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium transition-all duration-300 ${
            p === page
              ? "bg-[#C6AA76] text-white shadow-[0_2px_8px_rgba(198,170,118,0.25)]"
              : "text-[#C6AA76] hover:bg-[#C6AA76]/10 hover:text-[#A48B56]"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={`?page=${Math.min(pageCount, page + 1)}`}
        className={`rounded-full px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
          page === pageCount
            ? "pointer-events-none opacity-30 text-[#C6AA76]/40"
            : "text-[#C6AA76] hover:text-[#D4B76A] hover:bg-[#C6AA76]/5"
        }`}
      >
        Next
      </Link>
    </div>
  );
}

/* ---------- page ---------- */
export default function EventsPage() {
  const page = usePage();
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = EVENTS.slice(start, start + PAGE_SIZE);

  /* ensure hero video autoplays across browsers */
  const vidRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#FAF8F3] text-[#141414]">
      {/* soft brand tint */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_60%_at_0%_0%,rgba(198,170,118,0.07)_0%,transparent_70%)]" />

      {/* hero */}
      <section className="relative h-[92vh] w-screen -mx-[50vw] left-1/2 right-1/2 overflow-hidden">
        <video
          ref={vidRef}
          id="event-hero-video"
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
        />

        {/* vignette + soft bokeh tint */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_20%,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.18)_45%,transparent_78%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

        {/* content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.9, ease: "easeOut" }}
            className="leading-[0.92] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]"
          >
            <span className="block text-[clamp(2.4rem,6.2vw,6.2rem)] font-[360]">
              Signature Events
            </span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0.7 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.9, ease: "easeOut" }}
            className="mt-5 h-[2px] w-[clamp(140px,22vw,280px)] origin-left bg-gradient-to-r from-transparent via-[#E6D2A3] to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-3 text-[11px] sm:text-xs tracking-[0.38em] text-white/80"
          >
            Discreet • Invisible • Minimalist
          </motion.p>
        </div>
      </section>

      {/* event list (paginated: 5 per page) */}
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 mt-24 mb-12 space-y-20">
        {pageItems.map((ev, i) => (
          <section key={ev.title} className="space-y-8">
            {/* header */}
            <div className="text-center space-y-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#5A4633] font-medium">
                {ev.category}
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extralight leading-[0.9] tracking-[-0.02em] text-[#1a1a1a]">
                {ev.title}
              </h2>
              <div className="mx-auto h-[1px] w-16 bg-gradient-to-r from-transparent via-[#C6AA76] to-transparent" />
            </div>

            {/* CLICKING IMAGE OPENS DETAIL PAGE (same as Read more) */}
            <Slideshow
              images={ev.teaser}
              href={ev.detailPath}
              aspect={i % 2 ? "aspect-[4/3]" : "aspect-[16/9]"}
            />

            {/* short story + read more */}
            <div className="mx-auto max-w-4xl space-y-6">
              <p className="text-[0.95rem] leading-8 text-[#4a4a4a] font-light text-center">
                {ev.short}
              </p>

              <div className="flex justify-center">
                <Link
                  href={ev.detailPath}
                  className="relative group text-[11px] uppercase tracking-[0.35em] font-medium inline-block"
                  style={{ color: "#C6AA76" }}
                >
                  <span className="block">Read more</span>
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-[#C6AA76] transition-all duration-300 ease-out group-hover:w-full"
                  />
                </Link>
              </div>
            </div>
          </section>
        ))}

        <div className="mt-6 flex justify-center">
          <Pagination total={EVENTS.length} />
        </div>
      </div>
    </div>
  );
}
