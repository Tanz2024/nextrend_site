// app/page.tsx (or app/(site)/page.tsx)
"use client";

import dynamic from "next/dynamic";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ClientReveal } from "@/components/layout/ClientReveal";
import { buildGeneralImageUrl } from "@/lib/assets";
import { Poppins,Cormorant_Garamond,Montserrat, Space_Grotesk } from "next/font/google";

const heroTitleFont = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500","600","700"],
});

const heroLabelFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const services = Montserrat({
  subsets: ["latin"],
  weight: ["600"], // semibold
  display: "swap",
});



const serviceHighlights = [
  {
    title: "Consultation",
    description:
      "We begin by understanding your unique requirements through a personalized meeting. We explore your space, preferences, and performance goals to craft the ideal audio solution.",
    image: buildGeneralImageUrl("IMG_1329.JPEG"),
    imageAlt: "Consultation session reviewing architectural sound plans",
    href: "/services/consultation",
    ctaLabel: "Discover",
  },
  {
    title: "Design",
    description:
      "Using layouts and advanced 3D audio simulation software, we design and simulate how sound disperses in your space. This ensures optimal coverage, clarity, and seamless integration with your interior.",
    image: buildGeneralImageUrl("K-FRAMEWORK_DESIGN.jpeg"),
    imageAlt: "Design renderings for integrated loudspeaker layout",
    href: "/services/design",
    ctaLabel: "Discover",
    imageClass: "scale-[1.1] object-[65%_10%]"
  },
  {
    title: "Installation",
    description:
      "From laying cables and installing speakers to fine-tuning the system, we deliver a complete customized solution, including a single app to intuitively control all audio functions tailored to your space.",
    image: buildGeneralImageUrl("Installation.jpg"),
    imageAlt: "Technician installing slim loudspeakers within a finished interior",
    href: "/services/installation",
    ctaLabel: "Discover",
  },
];

function HomeContent() {
  const heroIntroWords = ["Discreet.", "Invisible.", "Minimalist."];
  const heroHeadlineWords = ["Architectural Sound Solutions"];

  const luxuryEase = [0.16, 1, 0.3, 1] as const;

  const heroLineVariants: Variants = {
    hidden: { opacity: 0, y: 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: luxuryEase },
    },
  };

  const heroWordVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15 + index * 0.18,
        duration: 0.7,
        ease: luxuryEase,
      },
    }),
  };

  const heroCTA = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.65, duration: 0.8, ease: luxuryEase },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 1.04, y: 32 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1.6,
        ease: luxuryEase,
      },
    },
  };

  const labelVariant: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: luxuryEase,
        delay: 0.35,
      },
    },
  };

  const titleParent: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.5,
      },
    },
  };

  const titleWord: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: luxuryEase,
      },
    },
  };

  const lineVariant: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: luxuryEase,
        delay: 0.6,
      },
    },
  };

  const ctaVariant: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: luxuryEase,
        delay: 0.8,
      },
    },
  };

  return (
    <div
      className="
        flex flex-col
        gap-12 sm:gap-16 md:gap-20 lg:gap-28
        pb-0
        text-[var(--foreground)]
      "
    >
      {/* ===================================================== */}
      {/* 1. HERO / VIDEO BACKDROP                             */}
      {/* ===================================================== */}
<section
  className="
    relative w-full min-h-screen
    overflow-hidden bg-black text-white
    antialiased
  "
>
  {/* VIDEO from R2 – always covers the viewport */}
  <video
    className="
      absolute inset-0 h-full w-full
      object-cover
    "
    src={buildGeneralImageUrl("music.mp4")}
    autoPlay
    muted
    playsInline
    loop
  />

  {/* Optional dark overlay for readability */}
  <div className="absolute inset-0 bg-black/40" />

  {/* CENTERED COPY */}
  <div
    className="
      relative z-[2] flex min-h-screen w-full
      items-center justify-center
    "
  >
    <div
      className="
        w-full max-w-[900px]
        px-4 py-8
        sm:px-6 sm:py-10
        md:px-12 md:py-16
        lg:px-16 xl:px-24
        text-center
      "
    >
      <motion.p
        variants={heroLineVariants}
        initial="hidden"
        animate="visible"
        className="
          text-[9px] sm:text-[10px] font-semibold uppercase
          tracking-[0.28em] sm:tracking-[0.32em] text-white/80
          mb-3 sm:mb-4"
      >
        {heroIntroWords.map((word, i) => (
          <motion.span
            key={word}
            variants={heroWordVariants}
            custom={i}
            className="inline-block"
          >
            {word}
            {i < heroIntroWords.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.p>
      <motion.h1
        variants={heroLineVariants}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.9,
          ease: luxuryEase,
          delay: 0.1,
        }}
        className="mt-0 mb-3 sm:mb-4 font-[var(--font-serif)]
                    text-[2.4rem] leading-[1.08]
                    sm:text-[2.8rem] sm:leading-[1.1]
                    md:text-[3.2rem]
                    lg:text-[3.8rem]
                    xl:text-[4.2rem]
                    font-light tracking-[-0.02em] sm:tracking-[-0.035em]
                    w-full flex justify-center whitespace-normal md:whitespace-nowrap"
      >
        {heroHeadlineWords.map((word, i) => (
          <motion.span
            key={word}
            variants={heroWordVariants}
            custom={i}
            className="inline-block"
          >
            {word}
            {i < heroHeadlineWords.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.h1>

      

        <motion.div
          {...heroCTA}
          className="-mt-2 sm:-mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/projects"
            className="
              group inline-flex items-center
              gap-1 sm:gap-1  
              px-5 py-3 sm:px-7 sm:py-3.5
              text-[9px] sm:text-[10px] font-semibold uppercase
              tracking-[0.30em] sm:tracking-[0.34em]
                "
              >
            {/* TEXT + HOVER LINE (exactly under the words) */}
    <span className="relative
                    text-[0.7rem] sm:text-[0.75rem]
                    font-medium
                    uppercase
                    tracking-[0.28em]
                    inline-block">
      <span className="block">Explore Our Projects</span>
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
          transition-transform duration-300 ease-out
          group-hover:scale-x-100
          group-focus-visible:scale-x-100
        "
      />
    </span>

            
            <span
              className="
                inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center
                text-[0.84rem] md:text-[0.88rem] leading-none
                transition-transform group-hover:translate-x-[3px]
              "
            >
            →
            
          </span>
          
        </Link>
      </motion.div>
    </div>
  </div>
</section>

      {/* ===================================================== */}
      {/* 2. OUR UNIQUE ESSENCE                                */}
      {/* ===================================================== */}
            <section
              className="
                relative w-full
                -mt-[1.5rem] sm:-mt-[2rem] md:-mt-[3rem]
                pt-4 sm:pt-6 md:pt-8
                pb-12 sm:pb-16 md:pb-24
                text-[#1a1a1a]
                bg-[#faf7f2]
                antialiased
              "
              style={{ fontFeatureSettings: "'liga','kern','clig'" }}
            >
              <ClientReveal
                as="div"
                className="
                  mx-auto flex max-w-4xl flex-col items-center
                  px-4 sm:px-6 text-center
                "
              >
                <div className="flex flex-col gap-2 sm:gap-3">
                  <p
                    className="
                      m-0
                      text-[9px]
                      font-semibold uppercase tracking-[0.28em] sm:tracking-[0.32em]
                      text-[#6f6f6f]
                    "
                  >
                    Refined Audio, Perfectly Integrated
                  </p>

                <h2
                className={`
                  ${poppins.className}
                  m-0
                  text-[1.75rem] sm:text-[2rem] md:text-[2.75rem] lg:text-[3rem]
                  font-normal
                  leading-[1.12] sm:leading-[1.15]
                  tracking-[-0.02em] sm:tracking-[-0.035em]
                  text-[#1a1a1a]
                `}
                style={{
                  textRendering: "optimizeLegibility",
                  fontFeatureSettings: "'liga','kern','clig'",
                }}
              >
                Unique Audio Solutions
              </h2>
                <p
            className="
              m-0 max-w-[60ch]
              text-[0.9rem] sm:text-[1rem] md:text-[1.1rem]
              leading-[1.5] sm:leading-[1.6]
              text-[#2a2a2a]
            "
          >
            Discover our architectural and lifestyle sound solutions, custom designed to deliver crystal clear audio while seamlessly blending into your interior — for residential, commercial, and hospitality spaces.
          </p>
        </div>
      </ClientReveal>

        {/* TWO COLUMN STRIP */}
        <div
          className="
            mx-auto mt-8 sm:mt-10 md:mt-12 lg:mt-16
            grid w-full max-w-[1600px]
            gap-4 sm:gap-5 md:gap-6
            px-4 sm:px-6
            md:grid-cols-2
          "
        >
          {/* RIGHT CARD – CUSTOM INSTALLATION */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] as const, delay: 0.18 }}
          >
            <Link
              href={{
                pathname: "/products",
                query: { category: "signature" },
              }}
              className="
                group relative flex w-full flex-col
                min-h-[360px] md:min-h-[480px]
                overflow-hidden
                rounded-[0.5rem]
                border border-[#e0d5c2]
                bg-black
                text-white
                antialiased
                will-change-transform
                transition-all duration-300
                ease-[cubic-bezier(0.19,1,0.22,1)]
                hover:-translate-y-1 hover:scale-[1.01]
                active:scale-[0.98]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#c9b48f]/60
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#faf7f2]
              "
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              }}
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                  willChange: "transform",
                }}
              >
                <Image
                  src={buildGeneralImageUrl("/project_sites/IMG_6278.PNG")}
                  alt="High-performance reference installation in a refined commercial / showroom setting"
                  fill
                  priority
                  className="
                    object-cover
                    transition-transform duration-[900ms]
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:scale-[1.05]
                  "
                  style={{
                    transform: "translateZ(0)",
                    WebkitTransform: "translateZ(0)",
                  }}
                />
                {/* OVERLAY (shadow/gradient above image) */}
                  <span
                    className="
                      pointer-events-none absolute inset-0 z-10
                      transition-opacity duration-500
                      opacity-100 group-hover:opacity-95
                      bg-[linear-gradient(180deg,rgba(30, 30, 30, 0.1)_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.72)_100%)]
                      [box-shadow:inset_0_-140px_140px_rgba(0,0,0,0.55),inset_0_0_80px_rgba(0,0,0,0.35)]
                    "
                  />
                  
              </div>

              <div
                className="
                  absolute inset-0 z-20 flex w-full items-end justify-between
                  px-6 pb-6 md:px-8 md:pb-8
                  pointer-events-none
                "
                style={{
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                  isolation: "isolate",
                }}
              >
                <div
                  className="flex flex-col text-left transition-all duration-300 ease-out group-hover:text-[#d4b574] group-active:text-[#e6c78a]"
                  style={{
                    transform: "translateZ(0)",
                    WebkitTransform: "translateZ(0)",
                    textShadow:
                      "0 2px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)",
                  }}
                >
                  <h3
                    className={`
                      ${poppins.className}
                      text-[1.4rem] sm:text-[1.6rem] md:text-[1.8rem] lg:text-[2rem]
                      font-medium leading-[1.15] md:leading-[1.2]
                      tracking-[-0.02em] md:tracking-[-0.03em]
                      text-white transition-all duration-300 ease-out
                      group-active:text-[#e6c78a]
                      group-hover:[text-shadow:0_2px_12px_rgba(0,0,0,0.8),0_0_24px_rgba(212,181,116,0.4)]
                      group-active:[text-shadow:0_2px_12px_rgba(0,0,0,0.8),0_0_32px_rgba(230,199,138,0.6)]
                    `}
                    style={{
                      textRendering: "optimizeLegibility",
                      fontFeatureSettings: "'liga','kern','clig'",
                      transform: "translateZ(0)",
                      WebkitTransform: "translateZ(0)",
                    }}
                  >
                    Integrated Sound Systems
                  </h3>

                  <div className="group inline-flex items-center gap-2 text-white transition-colors duration-300">
                    <span className="relative inline-flex items-center gap-2">
                      <span className="relative inline-block w-fit text-[0.82rem] sm:text-[0.88rem] text-white group-hover:text-[#d4b574] transition-colors">
                        Explore Our Systems
                        <span
                          aria-hidden
                          className="absolute -bottom-[4px] left-0 h-[1px] w-full bg-current
                                    origin-left scale-x-0 transition-transform duration-300 ease-out
                                    group-hover:scale-x-100"
                        />
                      </span>

                      <span className="group-hover:text-[#d4b574]">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* LEFT CARD – LIFESTYLE */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: [0.19, 1, 0.22, 1] as const, delay: 0.05 }}
          >
          <Link
            href={{
              pathname: "/products",
              query: { category: "lifestyle" },
            }}
              className="
                group relative flex w-full flex-col
                min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[480px]
                overflow-hidden
                rounded-[0.5rem]
                border border-[#e0d5c2]
                bg-black
                text-white
                antialiased
                touch-manipulation
                will-change-transform
                transition-all duration-300
                ease-[cubic-bezier(0.19,1,0.22,1)]
                hover:-translate-y-1 hover:scale-[1.01]
                active:scale-[0.98]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#c9b48f]/60
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#faf7f2]
              "
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              }}
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                  willChange: "transform",
                }}
              >
                <Image
                  src={buildGeneralImageUrl("/lifestyle/Radiofonografo_Red_30.jpg")}
                  alt="Lifestyle collection in a warm residential space with fireplace"
                  fill
                  priority
                   className="object-cover scale-[1.03] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    style={{ objectPosition: "90% 80%" }}
                  />
                
              </div>

              <div
                className="
                  absolute inset-0 z-20 flex w-full items-end justify-between
                  px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6 lg:px-8 lg:pb-8
                  pointer-events-none
                "
                style={{
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                  isolation: "isolate",
                }}
              >
                <div
                  className="flex flex-col text-left transition-all duration-300 ease-out group-hover:text-[#d4b574] group-active:text-[#e6c78a]"
                  style={{
                    transform: "translateZ(0)",
                    WebkitTransform: "translateZ(0)",
                    textShadow:
                      "0 2px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)",
                  }}
                >
                  <h3
                    className={`
                      ${poppins.className}
                      text-[1.4rem] sm:text-[1.6rem] md:text-[1.8rem] lg:text-[2rem]
                      font-medium leading-[1.15] md:leading-[1.2]
                      tracking-[-0.02em] md:tracking-[-0.03em]
                      text-white transition-all duration-300 ease-out
                      group-active:text-[#e6c78a]
                      group-hover:[text-shadow:0_2px_12px_rgba(0,0,0,0.8),0_0_24px_rgba(212,181,116,0.4)]
                      group-active:[text-shadow:0_2px_12px_rgba(0,0,0,0.8),0_0_32px_rgba(230,199,138,0.6)]
                    `}
                    style={{
                      textRendering: "optimizeLegibility",
                      fontFeatureSettings: "'liga','kern','clig'",
                      transform: "translateZ(0)",
                      WebkitTransform: "translateZ(0)",
                    }}
                  >
                    Lifestyle Audio
                  </h3>

                 <div className="group inline-flex items-center gap-2 text-white transition-colors duration-300">
                    <span className="relative inline-flex items-center gap-2">
                      <span className="relative inline-block w-fit text-[0.82rem] sm:text-[0.88rem] text-white group-hover:text-[#d4b574] transition-colors">
                    <span className="block">Explore Lifestyle Solutions</span>
                        <span
                          aria-hidden
                          className="
                            absolute -bottom-[4px] left-0 h-[1px] w-full bg-current
                                    origin-left scale-x-0 transition-transform duration-300 ease-out
                                    group-hover:scale-x-100
                          "
                        />
                      </span>
                      <span className="group-hover:text-[#d4b574]">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* 3. WHO WE ARE                                        */}
      {/* ===================================================== */}
<ClientReveal as="section" className="w-full bg-[var(--background)] isolate -mt-1 sm:-mt-2 md:-mt-3">
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.55 }}
    className="relative isolate"
  >
    {/* HERO IMAGE (shared) */}
    <div className="relative w-full overflow-hidden">
      <motion.figure
        variants={imageVariants}
        className="relative w-full
          h-[62vh] min-h-[460px] max-h-[720px]
          md:h-[72vh] md:min-h-[560px] md:max-h-[860px]
          lg:h-[82vh] lg:min-h-[640px] lg:max-h-[980px]
          2xl:h-[86vh] 2xl:max-h-[1100px]"
      >
        <Image
          src={buildGeneralImageUrl("Contact_image.jpg")}
          alt="Nextrend Systems architectural audio showroom"
          fill
          priority
          sizes="100vw"
          className="object-cover" style={{ objectPosition: "center 35%" }}
        />

        {/* Desktop right-side gradient for overlay text */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/72 via-black/46 to-transparent" />
      </motion.figure>

      {/* DESKTOP OVERLAY (md and up) */}
      <div className="pointer-events-none absolute inset-0 hidden md:flex">
        <div className="pointer-events-auto mx-auto flex h-full w-full max-w-[1320px] items-center px-4 sm:px-8 lg:px-12">
          <div
            className="
              ml-auto w-full max-w-[480px] md:w-[44%] lg:w-[38%] text-left text-white">
            {/* ABOUT US */}
            <motion.p
              variants={labelVariant}
              className="
                mb-4 text-[0.7rem] sm:text-[0.78rem] font-semibold uppercase tracking-[0.32em] text-[white]"
              
            >
              ABOUT US
            </motion.p>

            {/* headline */}
            <motion.p
              variants={ctaVariant}
              className={`
                ${poppins.className}
                mt-0 sm:mt-1
                text-[1.4rem] sm:text-[1.6rem] md:text-[2.1rem] lg:text-[2.4rem]
                font-normal
                leading-[1.12] sm:leading-[1.15]
                tracking-[-0.02em] sm:tracking-[-0.035em]
                text-white
              `}
              style={{ textRendering: "optimizeLegibility" }}
            >
              Integrated Audio for Modern Living 
            </motion.p>


            {/* body copy – slightly leaner */}
            <motion.p
              variants={ctaVariant}
              className="
                mt-4 sm:mt-5 md:mt-6 max-w-[60ch]
              text-[14px]
              leading-[1.5] sm:leading-[1.6]
              text-[white]
              "
            >
              With over 18 years of expertise, we craft premium sound solutions that blend seamlessly into residential, commercial, and hospitality spaces — delivering exceptional audio clarity with zero visual impact.
            </motion.p>

            {/* DISCOVER US */}
            <motion.div
              variants={ctaVariant}
              className="mt-7 sm:mt-9 inline-flex"
            >
              <Link
                href="/about"
                aria-label="Discover Nextrend Systems"
                className="group inline-flex items-center gap-2 text-white/90 focus:outline-none"
              >
                <span
                  className="
                    relative
                    text-[0.7rem] sm:text-[0.75rem]
                    font-medium
                    uppercase
                    tracking-[0.28em]
                  "
                >
                  <span className="block">Discover us</span>
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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-current opacity-85 transition-transform duration-250 group-hover:translate-x-[4px]"
                  aria-hidden="true"
                >
                  <path d="M6 12h12" strokeWidth="1.4" strokeLinecap="round" />
                  <path
                    d="M13 7l5 5-5 5"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>

    {/* MOBILE SLAB (below image) */}
    <motion.div
      variants={ctaVariant}
      className="
        md:hidden
        w-full
        -mt-px
        bg-[#424447]
        px-5
        pt-9
        pb-12
        rounded-none
      "
    >
      <div className="mx-auto max-w-md space-y-4">
        
        {/* ABOUT US */}
            <motion.p
              variants={labelVariant}
              className="
                mb-4 text-[0.7rem] sm:text-[0.78rem] font-semibold uppercase tracking-[0.32em] text-[white]"
            >
              ABOUT US
            </motion.p>

            {/* headline */}
            <motion.p
              variants={ctaVariant}
              className={`
                ${poppins.className}
                mt-0 sm:mt-1
                text-[1.4rem] sm:text-[1.6rem] md:text-[2.1rem] lg:text-[2.4rem]
                font-normal
                leading-[1.12] sm:leading-[1.15]
                tracking-[-0.02em] sm:tracking-[-0.035em]
                text-white
              `}
              style={{ textRendering: "optimizeLegibility" }}
            >
              Integrated Audio <br />
              for Modern Living
            </motion.p>


            {/* body copy – slightly leaner */}
            <motion.p
              variants={ctaVariant}
              className="
                mt-4 sm:mt-5 md:mt-6 max-w-[60ch]
              text-[14px]
              leading-[1.5] sm:leading-[1.6]
              text-[white]
              "
            >
              With over 18 years of expertise, we craft premium sound solutions that blend seamlessly into residential, commercial, and hospitality spaces — delivering exceptional audio clarity with zero visual impact.
            </motion.p>

            {/* DISCOVER US */}
            <motion.div
              variants={ctaVariant}
              className="mt-7 sm:mt-9 inline-flex"
            >
              <Link
                href="/about"
                aria-label="Discover Nextrend Systems"
                className="group inline-flex items-center gap-2
                !text-white
                hover:!text-[#d4b574]
                active:!text-[#e6c78a]
                focus:outline-none
                transition-colors duration-300"
              >
                <span
                  className="
                    relative
                    text-[0.84rem] md:text-[0.88rem]
                    font-medium uppercase tracking-[0.34em]
                    !text-current
                  "
                >
                  <span className="block">DISCOVER US</span>
                  <span
                    aria-hidden
                    className="
                      pointer-events-none absolute -bottom-[4px] left-0
                      h-[1px] w-full bg-current
                      origin-left scale-x-0
                      transition-transform duration-300 ease-out
                      group-hover:scale-x-100 group-focus-visible:scale-x-100
                    "
                  />
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  className="
                    stroke-current
                    !text-white
                    group-hover:!text-[#d4b574]
                    transition-transform duration-250
                    group-hover:translate-x-[4px]
                  "
                  aria-hidden="true"
                >
                  <path d="M6 12h12" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M13 7l5 5-5 5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
      </div>
    </motion.div>
  </motion.section>
</ClientReveal>

      {/* ===================================================== */}
      {/* 4. SERVICES                                          */}
      {/* ===================================================== */}
      <section className="w-full bg-[var(--background)] isolate -mt-1 sm:-mt-2 md:-mt-3">
        <ClientReveal
          as="div"
          className="
            mx-auto w-full max-w-[1320px]
            px-6
            pt-10 md:pt-12 pb-12 md:pb-14
            space-y-6
          "
        >
          {/* heading + tagline stacked (equal spacing) */}
          <div className="flex flex-col text-[#1b1b1b]">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: luxuryEase }}
              className="m-0 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#7a7d7a]"
            >
              Audio-Visual Solution
            </motion.p>

              <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.02, delayChildren: 0.05 } },
              }}
              className={`
                ${poppins.className}
                m-0 mt-2
                text-[1.4rem] sm:text-[1.6rem] md:text-[2.1rem] lg:text-[2.4rem]
                font-normal
                leading-[1.12] sm:leading-[1.15]
                tracking-[-0.02em] sm:tracking-[-0.035em]
                text-black
              `}
            >
              {"Our Services".split(" ").map((w, i) => (
                <motion.span
                  key={`h2-${i}`}
                  className="inline-block mr-[0.32ch]"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.45,
                        ease: [0.22, 0.61, 0.36, 1] as const,
                      },
                    },
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.012, delayChildren: 0.1 } },
              }}
              className="m-0 max-w-xl text-[0.95rem] leading-[1.7] text-[#4b4e4b]"
            >
              {"Comprehensive audio-visual solutions for residential, commercial, and hospitality spaces, expertly handled from understanding your needs to design, installation, and intuitive system control.".split(" ").map((w, i) => (
                <motion.span
                  key={`p-${i}`}
                  className="inline-block mr-[0.32ch]"
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.4,
                        ease: [0.22, 0.61, 0.36, 1] as const,
                      },
                    },
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.p>
          </div>

          {/* cards unchanged */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.12, delayChildren: 0.05 },
              },
            }}
            className="
              flex gap-5 overflow-x-auto pb-4 -mx-6 px-6
              snap-x snap-mandatory
              [scrollbar-width:none] [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              md:mx-0 md:px-0 md:grid md:overflow-visible md:snap-none
              md:grid-cols-3 md:gap-8
            "
          >
            {serviceHighlights.map((service) => (
              <motion.article
              key={service.title}
              initial={{ opacity: 1, y: 0 }}     // ✅ start visible
              animate={{ opacity: 1, y: 0 }}     // ✅ no dependency on whileInView
              className="
              ${services.className}
                group relative flex flex-col overflow-hidden
                rounded-[2.25rem] bg-white text-[#1b1b1b]
                transition hover:-translate-y-1
                snap-center shrink-0 w-[80vw] max-w-[330px] h-[420px]
                md:h-full md:w-auto md:max-w-none md:shrink md:snap-none
              "
            >

                <span className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0))]" />

                <figure className="relative h-[180px] w-full overflow-hidden md:h-60 ">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    className={`object-cover ${service.imageClass ?? ""}`}
                    sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                    priority              // ✅ easiest: load all 3 (ok sebab 3 je)
                    loading="eager" 
                  />
                  <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(0,0,0,0.22),transparent_55%)]" />
                </figure>

                <div className="flex flex-1 flex-col px-6 md:px-8 pt-6 md:pt-9 pb-6 md:pb-9">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, ease: luxuryEase }}
                    className={`
                      ${heroTitleFont.className}
                      text-[1.15rem]
                      font-semibold
                      uppercase
                      leading-[1.3]
                    `}
                  >
                    {service.title}
                  </motion.h3>

                  <motion.p
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.6 }}
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: 0.012,
                          delayChildren: 0.08,
                        },
                      },
                    }}
                    className="mt-2 text-[0.95rem] leading-[1.7] text-[#3e403e]"
                  >
                    {service.description.split(" ").map((w, i) => (
                      <motion.span
                        key={`d-${service.title}-${i}`}
                        className="inline-block mr-[0.32ch]"
                        variants={{
                          hidden: { opacity: 0, y: 6 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.4,
                              ease: [0.22, 0.61, 0.36, 1] as const,
                            },
                          },
                        }}
                      >
                        {w}
                      </motion.span>
                    ))}
                  </motion.p>

                  <div className="mt-auto pt-4">
                    <Link
                      href={service.href ?? "#"}
                      aria-label={service.ctaLabel ?? "Discover"}
                      className="group relative inline-flex h-12 items-center
                        gap-1.5
                        text-[0.7rem] sm:text-[0.75rem]
                        text-sm font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]
                        backdrop-blur-sm transition-all duration-300
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50
                        w-fit"
                    >
                      <span
                        className="
                          relative inline-block
                          transition-colors duration-300
                          group-hover:text-[var(--accent)]
                        "
                      >
                      <span className="block">{service.ctaLabel ?? "Discover"}</span>
                      <span
                            aria-hidden
                            className="
                               pointer-events-none
                                absolute -bottom-[3px] left-0
                                h-[1px] w-full
                                bg-current
                                origin-left scale-x-0
                                transition-transform duration-300 ease-out
                                group-hover:scale-x-100
                                group-focus-visible:scale-x-100
                            "
                          />
                        </span>
                    <span className="flex h-7 w-7 items-center justify-center
                          text-[var(--foreground)]
                          group-hover:text-[var(--accent)]
                          transition-transform transition-colors duration-200
                          group-hover:translate-x-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                  </Link>
                </div>
                </div>

                <span className="pointer-events-none absolute inset-0 rounded-[2.25rem] ring-0 transition group-hover:ring-1 group-hover:ring-[rgba(198,150,78,0.28)]" />
              </motion.article>
            ))}
          </motion.div>
        </ClientReveal>
</section>


      {/* ===================================================== */}
      {/* 5. BRAND COLLABORATION                               */}
      {/* ===================================================== */}
<ClientReveal as="section" className="w-screen max-w-none px-0 bg-[var(--background)]">
  <motion.section
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.45 }}
    transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] as const }}
    className="
      relative isolate
      overflow-hidden rounded-none
      bg-transparent text-white
      shadow-none ring-0
      min-h-[64vh] md:min-h-[72vh]
    "
  >
    {/* Background image + subtle vignettes */}
    <figure className="absolute inset-0 -m-[0.5px]">
      <Image
        src={buildGeneralImageUrl("BYD.jpeg")}
        alt="BYD × Nextrend limited edition loudspeakers beside a performance EV"
        fill
        priority
        sizes="100vw"
        className="
          object-cover
          will-change-transform
          transition-transform duration-[1400ms]
          ease-[cubic-bezier(0.16,1,0.3,1)]
          hover:scale-[1.03]
        "
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_70%_40%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.25)_40%,rgba(0,0,0,0)_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.55)_20%,rgba(0,0,0,0.24)_48%,rgba(0,0,0,0)_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.18)_55%,rgba(0,0,0,0.42)_100%)]" />
      </div>
    </figure>

    {/* Copy block */}
    <div className="relative z-[2] mx-auto flex h-full w-full max-w-[1200px] items-end md:items-center">
      <div className="px-6 pb-10 pt-28 sm:px-8 md:px-12 lg:px-16 lg:pb-16">
        {/* Small label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const }}
          className="mb-4 text-[0.7rem] sm:text-[0.78rem] font-semibold uppercase tracking-[0.32em] text-white/70"
        >
          Brand collaboration
        </motion.p>

        {/* Title */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.02, delayChildren: 0.06 },
            },
          }}
          className={`
            ${poppins.className}
            mt-0 sm:mt-1
            text-[1.4rem] sm:text-[1.6rem] md:text-[2.1rem] lg:text-[2.4rem]
            font-normal
            leading-[1.12] sm:leading-[1.15]
            tracking-[-0.02em] sm:tracking-[-0.035em]
            text-white
          `}
        >
          {"BYD Showroom X Nextrend"
            .split(" ")
            .map((w, i) => (
              <motion.span
                key={`ttl-${i}`}
                className="inline-block mr-[0.32ch]"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.48,
                      ease: [0.22, 1, 0.36, 1] as const,
                    },
                  },
                }}
              >
                {w}
              </motion.span>
            ))}
        </motion.h2>

        {/* Short, calm body copy */}
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.012, delayChildren: 0.1 },
            },
          }}
          className="mt-4 max-w-[40ch] text-[0.95rem] sm:text-[1rem] leading-[1.8] text-white/82"
        >
          {"A fully integrated architectural audio system for the BYD showroom, designed for clarity, impact, and seamless environmental integration."
            .split(" ")
            .map((w, i) => (
              <motion.span
                key={`bd-${i}`}
                className="inline-block mr-[0.32ch]"
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.4,
                      ease: [0.22, 0.61, 0.36, 1] as const,
                    },
                  },
                }}
              >
                {w}
              </motion.span>
            ))}
        </motion.p>

        {/* CTA */}
        <div className="mt-7">
          <Link
            href="/projects"
            aria-label="View BYD collaboration"
            className="group inline-flex items-center gap-2 text-white/90 hover:text-white focus:outline-none"
          >
            <span className="relative text-[0.7rem] sm:text-[0.75rem] font-semibold uppercase tracking-[0.28em]">
              <span className="block">View project</span>
              <span
                aria-hidden
                className="
                  pointer-events-none
                  absolute -bottom-[3px] left-0
                  h-[1px] w-full
                  bg-current
                  origin-left scale-x-0
                  transition-transform duration-300 ease-out
                  group-hover:scale-x-100
                  group-focus-visible:scale-x-100
                "
              />
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-current transition-transform duration-200 group-hover:translate-x-[2px]"
              aria-hidden="true"
            >
              <path d="M6 12h12" strokeWidth="1.5" strokeLinecap="round" />
              <path
                d="M13 7l5 5-5 5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  </motion.section>
</ClientReveal>

    </div>
  );
}

const HomeNoSSR = dynamic(() => Promise.resolve(HomeContent), {
  ssr: false,
});

export default HomeNoSSR;
