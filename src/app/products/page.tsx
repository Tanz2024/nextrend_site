// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Michroma } from "next/font/google";
import { useSearchParams } from "next/navigation";
import {
  buildLifestyleVideoUrl,
  buildFrogisUrl,
  buildKArrayUrl,
  buildKGearUrl,
  buildAminaUrl,
  buildTrinnovUrl,
} from "@/lib/assets";

const brio = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brio",
  display: "swap",
});

/* ───────── motion presets ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const headerIn = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ───────── data ───────── */
const signatureCapsules = [
  {
    id: "k-array",
    title: "K-array",
    kind: "installation",
    description:
      "K-array Audio Solutions is globally renowned as one of the most innovative high-technology professional speaker manufacturers in the world founded in Italy.",
    src: buildKArrayUrl("K_ARRAY_VIDEO.mp4"),
    href: "/products/k-array",
    objectClass: "object-center sm:object-[50%_50%]",
  },
  {
    id: "k-gear",
    title: "KGear",
    kind: "installation",
    description:
      "Introducing KGEAR, bringing simplicity and clarity to everyday applications. An essential line of pro-audio products with the pedigree of K-array at its core.",
    src: buildKGearUrl("KGEAR_teaser_2021.mp4"),
    href: "/products/k-gear",
    objectClass: "object-center",
    biasClass: "sm:translate-x-[1%]",
  },
  {
    id: "frog-is",
    title: "Frog-is",
    kind: "installation",
    fit: "contain",
    description:
      "Frog-Is specializes in providing speakers, amplifiers, mixing consoles, microphones, wireless microphones, speaker processors and all accessories necessary to provide high quality sound.",
    src: buildFrogisUrl("FROOGIS_EDITED.mp4"),
    href: "/products/frogis",
    objectClass: "object-center",
    biasClass: "scale-[0.9] sm:scale-[0.95]",
  },
  {
    id: "amina",
    title: "Amina",
    kind: "installation",
    description:
      "Since 1999, Amina Sound has established itself as the world’s leading invisible speaker company, pioneering audio solutions that transform how people experience sound in luxury residential and commercial environments.",
    src: buildAminaUrl("AMINA_EDITED.mp4"),
    href: "/products/amina",
    objectClass: "object-center",
    biasClass: "scale-[1.02]",
  },
  {
    id: "trinnov",
    title: "Trinnov",
    kind: "installation",
    description:
      "Trinnov processors are designed and manufactured in France, world’s most advanced music and film studios for production, mixing, and playback to thousands of commercial cinema screens worldwide.",
    src: buildTrinnovUrl("amplitude16-dolby-atmos-16x9.mp4"),
    href: "/products/trinnov",
    objectClass: "object-center",
    biasClass: "",
  },
];

const lifestyleCapsules = [
  {
    id: "bearbricks-audio",
    title: "Be@rbrick Audio",
    kind: "collection",
    description:
      "Be@rbrick is a hugely popular collectible toy designed and produced by the Japanese company Medicom Toy Inc. Their products are sold in limited quantities.",
    src: buildLifestyleVideoUrl("bearbricks.mp4"),
    href: "/products/bearbricks",
    objectClass:
      "object-center sm:object-[92%_50%] md:object-[95%_50%] lg:object-[97%_50%]",
    biasClass:
      "scale-[1.02] sm:scale-[1.06] sm:translate-x-[4%] md:translate-x-[9%]",
    textTone: "light", // ✅ keep light text on dark bearbricks video
  },
  {
    id: "brionvega",
    title: "Brionvega",
    kind: "collection",
    description:
      "Over the course of 60 years in Italian design, Brionvega has worked with the most famous and innovative designers on the contemporary scene, producing timeless iconic objects that have furnished the history of the 20th century.",
    src: buildLifestyleVideoUrl("brionvega.mp4"),
    href: "/products/brionvega",
    objectClass: "object-[50%_50%]",
    biasClass: "",
    tone: "dark", // keep your special dark treatment for this one capsule only
  },
];

/* ───────── section header ───────── */
function SectionHeader({
  title,
  eyebrow,
  blurb,
  theme = "dark",
}: {
  title: string;
  eyebrow?: string;
  blurb?: string;
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";

  const textMain = isLight ? "#0B0B0C" : "#f5eee5";
  const textSoft = isLight ? "rgba(11,11,12,0.72)" : "rgba(245,238,229,0.86)";
  const eyebrowCol = isLight
    ? "rgba(11,11,12,0.55)"
    : "rgba(245,238,229,0.65)";

  const line = isLight
    ? "linear-gradient(90deg, rgba(10,10,11,0) 0%, rgba(10,10,11,0.45) 40%, rgba(10,10,11,0.08) 100%)"
    : "linear-gradient(90deg, rgba(212,194,154,0) 0%, rgba(212,194,154,0.6) 40%, rgba(212,194,154,0.1) 100%)";

  return (
    <section className="relative mx-auto w-full max-w-[120rem] px-5 pt-16 pb-10 sm:px-8 sm:pt-20 md:px-12 md:pt-24 lg:px-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={stagger}
        className="max-w-6xl"
      >
        {eyebrow ? (
          <motion.span
            variants={fadeUp}
            className="text-[0.72rem] uppercase tracking-[0.26em]"
            style={{ color: eyebrowCol }}
          >
            {eyebrow}
          </motion.span>
        ) : null}

        <motion.h2
          variants={headerIn}
          className="mt-1.5 font-light leading-[0.98] text-[8.4vw] sm:text-5xl md:text-6xl lg:text-[3.9rem]"
          style={{
            color: textMain,
            fontFamily:
              '"Playfair Display","Times New Roman",ui-serif,Georgia,serif',
            textRendering: "optimizeLegibility",
          }}
        >
          {title}
        </motion.h2>

        <motion.div
          variants={fadeUp}
          className="mt-3 h-[1px] rounded-full"
          style={{ background: line }}
        />

        {blurb ? (
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[60ch] text-[0.95rem] leading-[1.9] sm:text-[1.02rem] md:text-[1.08rem]"
            style={{ color: textSoft }}
          >
            {blurb}
          </motion.p>
        ) : null}
      </motion.div>
    </section>
  );
}

/* ───────── bottom switch ───────── */
function SectionSwitch({
  theme = "dark",
  label,
  title,
  blurb,
  href,
}: {
  theme?: "dark" | "light";
  label: string;
  title: string;
  blurb: string;
  href: string;
}) {
  const isLight = theme === "light";

  const bg = isLight ? "#FFFFFF" : "#0B0B0C";
  const labelCol = isLight ? "rgba(0,0,0,0.55)" : "rgba(245,238,229,0.65)";
  const titleCol = isLight ? "#0B0B0C" : "#f5eee5";
  const blurbCol = isLight ? "rgba(0,0,0,0.70)" : "rgba(245,238,229,0.82)";
  const linkCol = isLight ? "rgba(0,0,0,0.78)" : "rgba(245,238,229,0.86)";

  return (
    <section style={{ background: bg }}>
      <div className="mx-auto w-full max-w-[120rem] px-5 py-14 sm:px-8 md:px-12 lg:px-20">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[72ch]">
            <div
              className="text-[0.72rem] uppercase tracking-[0.26em]"
              style={{ color: labelCol }}
            >
              {label}
            </div>

            <div
              className="mt-2 text-[1.9rem] sm:text-[2.2rem] md:text-[2.4rem] font-light leading-[1.06]"
              style={{
                color: titleCol,
                fontFamily:
                  '"Playfair Display","Times New Roman",ui-serif,Georgia,serif',
              }}
            >
              {title}
            </div>

            <p
              className="mt-4 text-[0.98rem] leading-[1.85]"
              style={{ color: blurbCol }}
            >
              {blurb}
            </p>
          </div>

          <Link
            href={href}
            className="group relative inline-flex items-center gap-3"
            style={{ color: linkCol }}
          >
            <span className="relative text-[0.72rem] sm:text-[0.75rem] font-medium uppercase tracking-[0.28em] inline-block">
              <span className="block">View section</span>
              <span
                aria-hidden
                className="
                  pointer-events-none
                  absolute
                  -bottom-[4px]
                  left-0
                  h-[1px]
                  w-full
                  bg-current
                  origin-left
                  scale-x-0
                  transition-transform
                  duration-300
                  ease-out
                  group-hover:scale-x-100
                  group-focus-visible:scale-x-100
                "
              />
            </span>

            <span
              className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center transition-transform group-hover:translate-x-[3px]"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────── capsule (video block) ───────── */
function VideoCapsule({
  capsule,
  index = 0,
  maxSeconds = 20,
  pageTheme = "dark",
}: {
  capsule: {
    id?: string;
    title: string;
    kind?: "collection" | "installation";
    description: string;
    src: string;
    href: string;
    objectClass?: string;
    biasClass?: string;
    fit?: "cover" | "contain";
    tone?: "light" | "dark";
    textTone?: "light" | "dark";
  };
  index?: number;
  maxSeconds?: number;
  pageTheme?: "dark" | "light";
}) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => undefined);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [capsule.src]);

  const labelText =
    capsule.kind === "installation" ? "Installation" : "Collection";

  useEffect(() => {
    if (shouldLoadVideo) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  const fitClass =
    capsule.fit === "contain" ? "object-contain bg-black" : "object-cover";

  const isLightSection = pageTheme === "light";

  const useLightText =
    capsule.textTone === "light"
      ? true
      : capsule.textTone === "dark"
      ? false
      : !isLightSection;

  const capsuleIsDark = capsule.tone === "dark";

  const labelColor = capsuleIsDark
    ? "rgba(0,0,0,0.60)"
    : useLightText
    ? "rgba(245,238,229,0.78)"
    : "rgba(0,0,0,0.55)";

  const titleColor = capsuleIsDark
    ? "#0B0B0C"
    : useLightText
    ? "#f5eee5"
    : "#0B0B0C";

  const descColor = capsuleIsDark
    ? "rgba(0,0,0,0.72)"
    : useLightText
    ? "rgba(245,238,229,0.86)"
    : "rgba(0,0,0,0.72)";

  const btnTextColor = capsuleIsDark
    ? "rgba(0,0,0,0.78)"
    : useLightText
    ? "rgba(245,238,229,0.88)"
    : "rgba(0,0,0,0.78)";

  const overlayOpacity =
    capsule.id === "brionvega" ? 0 : useLightText ? 0.42 : 0.22;

  const textShadow = useLightText ? "0 14px 38px rgba(0,0,0,0.55)" : "none";

  return (
    <section
      ref={containerRef}
      id={capsule.id}
      className={[
        "relative h-[100svh] min-h-[32rem] w-screen overflow-hidden scroll-mt-24 left-1/2 -translate-x-1/2",
        "bg-black",
        index > 0
          ? "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:z-20 before:h-px before:bg-white/10"
          : "",
      ].join(" ")}
    >
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          className={[
            "absolute inset-0 h-full w-full will-change-transform",
            fitClass,
            capsule.objectClass || "",
            capsule.biasClass || "",
          ].join(" ")}
          src={capsule.src}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/80 flex items-center justify-center"
        >
          <div
            className="h-12 w-12 rounded-full border border-white/30 animate-pulse"
            aria-hidden="true"
          />
        </div>
      )}

      {capsule.id !== "brionvega" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.45 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.18 } },
        }}
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-16 md:px-14 md:pb-24 lg:px-20"
        style={{ textShadow }}
      >
        <motion.span
          variants={fadeUp}
          className="text-[0.68rem] uppercase tracking-[0.26em]"
          style={{ color: labelColor }}
        >
          {labelText}
        </motion.span>

        <motion.h3
          variants={fadeUp}
          className="mt-3 max-w-[22ch] font-light leading-[1.02]
                     text-[2.4rem] sm:text-[2.9rem] md:text-[3.3rem] lg:text-[3.6rem]"
          style={{
            color: titleColor,
            fontFamily:
              '"Playfair Display","Times New Roman",ui-serif,Georgia,serif',
            textRendering: "optimizeLegibility",
          }}
        >
          <span
            className={`block ${capsule.id === "k-array" ? "" : "uppercase"}`}
            style={{
              fontFamily: "var(--font-brio), inherit",
              letterSpacing: "0.18em",
            }}
          >
            {capsule.title}
          </span>
        </motion.h3>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-[46ch] text-[0.9rem] leading-[1.9] sm:text-[0.98rem] md:text-[1.04rem]"
          style={{ color: descColor }}
        >
          {capsule.description}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 max-w-[46ch]">
          <div className="flex justify-start">
            <Link
              href={capsule.href}
              className="group relative inline-flex items-center gap-3"
              style={{ color: btnTextColor }}
            >
              <span className="relative text-[0.7rem] sm:text-[0.75rem] font-medium uppercase tracking-[0.28em] inline-block">
                <span className="block">
                  Explore{" "}
                  {capsule.kind === "installation"
                    ? "installation"
                    : "collection"}
                </span>

                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-[4px] left-0 h-[1px] w-full bg-current origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </span>

              <span
                className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-[0.84rem] md:text-[0.88rem] leading-none transition-transform group-hover:translate-x-[3px]"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ───────── page ───────── */
export default function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") ?? "";
  const normalizedCategory = categoryParam.toLowerCase();

  const isFiltered =
    normalizedCategory === "signature" || normalizedCategory === "lifestyle";
  const showingBoth = !isFiltered;

  const showLifestyle =
    !normalizedCategory || normalizedCategory === "lifestyle";
  const showSignature =
    !normalizedCategory || normalizedCategory === "signature";

  // if filtered, switch param + jump
  // if both visible, just jump
  const switchToLifestyleHref = useMemo(() => {
    if (normalizedCategory === "signature")
      return "/products?category=lifestyle#lifestyle";
    return "#lifestyle";
  }, [normalizedCategory]);

  const switchToSignatureHref = useMemo(() => {
    if (normalizedCategory === "lifestyle")
      return "/products?category=signature#signature";
    return "#signature";
  }, [normalizedCategory]);

  return (
    <main
  className={`relative min-h-screen antialiased ${brio.variable} bg-[#0B0B0C]`}
>

      {/* ───────── CUSTOM INSTALLATION (BLACK) ───────── */}
      {showSignature && (
        <section id="signature" className="relative bg-[#0B0B0C] overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[360px] backdrop-blur-2xl"
            style={{
              background: `
                radial-gradient(900px 420px at 14% 0%,
                  rgba(185, 174, 174, 0.22) 0%,
                  rgba(184, 172, 172, 0.08) 28%,
                  rgba(255, 248, 248, 0) 62%),
                linear-gradient(180deg,
                  rgba(80, 73, 73, 0.62) 0%,
                  rgba(10,10,11,0.36) 45%,
                  rgba(228, 228, 241, 0.12) 70%,
                  rgba(255, 255, 255, 0) 100%)
              `,
            }}
          />

          <div className="relative z-[2]">
            <SectionHeader
              theme="dark"
              eyebrow="Installation"
              title="Custom Installation"
              blurb="Leading audio brands, precision-engineered for residential, commercial, and hospitality spaces — seamlessly integrated for exceptional clarity and immersive sound."
            />
          </div>

          <div className="relative z-0 flex flex-col">
            {signatureCapsules.map((c, i) => (
              <VideoCapsule key={c.id} capsule={c} index={i} pageTheme="dark" />
            ))}
          </div>

          {/* ✅ SWITCH BEHAVIOR FIX */}
          {!showingBoth && (
            <SectionSwitch
              theme="dark"
              label="Next"
              title="Lifestyle Audio"
              blurb="Designer pieces that live beautifully in the room — sculptural objects with real performance."
              href={switchToLifestyleHref}
            />
          )}
        </section>
      )}

      {/* ───────── LIFESTYLE AUDIO (WHITE) ───────── */}
      {showLifestyle && (
        <section id="lifestyle" className="relative bg-white overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[360px]"
            style={{
              background: `
                radial-gradient(900px 420px at 14% 0%,
                  rgba(0,0,0,0.08) 0%,
                  rgba(0,0,0,0.04) 28%,
                  rgba(255,255,255,0) 62%),
                linear-gradient(180deg,
                  rgba(0,0,0,0.06) 0%,
                  rgba(255,255,255,0.92) 52%,
                  rgba(255,255,255,1) 100%)
              `,
            }}
          />

          <div className="relative z-[2]">
            <SectionHeader
              theme="light"
              title="Lifestyle Audio"
              blurb="Audio as art — designer audio pieces that elevate your space, seamlessly blending into interiors while delivering immersive, crystal-clear audio."
            />
          </div>

          <div className="relative z-0 flex flex-col">
            {lifestyleCapsules.map((c, i) => (
              <VideoCapsule key={c.id} capsule={c} index={i} pageTheme="light" />
            ))}
          </div>

          {/* ✅ SWITCH BEHAVIOR FIX */}
          {!showingBoth && (
            <SectionSwitch
              theme="light"
              label="Also explore"
              title="Custom Installation"
              blurb="Architectural audio, cinema-grade processing, and pro systems—designed, tuned, and integrated end-to-end."
              href={switchToSignatureHref}
            />
          )}
        </section>
      )}
    </main>
  );
}
