// @ts-nocheck
// src/app/projects/page.tsx
"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import ProjectsContent from "./ProjectsContent";
import {
  PROJECT_EXPERIENCE,
  PROJECT_SECTIONS,
  PROJECT_TOTALS,
} from "./project-data";

/* ------------------------------------
   Data (shared)
------------------------------------ */
const sections = PROJECT_SECTIONS;
const totals = PROJECT_TOTALS;
const experience = PROJECT_EXPERIENCE;

/* ------------------------------------
   Animation Variants
------------------------------------ */
const ease = [0.16, 1, 0.3, 1] as const;

const headerIn = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const underlineIn = {
  hidden: { scaleX: 0, opacity: 0.25, transformOrigin: "left" as const },
  show:   { scaleX: 1, opacity: 1, transition: { duration: 0.9, ease, delay: 0.15 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

/* ------------------------------------
   Page
------------------------------------ */
export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section');
  
  // Determine the default section from URL params, fallback to "All Projects"
  const getDefaultSection = () => {
    if (sectionParam && PROJECT_SECTIONS[sectionParam]) {
      return sectionParam;
    }
    return "All Projects";
  };

  return (
    <main
      className={[
        "relative min-h-screen w-full antialiased",
      "bg-white text-[#0D0D0C]",
      ].join(" ")}
    >


      {/* HERO */}
      <section className="relative mx-auto w-full max-w-[1600px] px-4 pt-14 sm:px-6 sm:pt-16 md:pt-24 pb-8 sm:pb-10">
        {/* subtle vignette */}
      
        <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-6xl">
          {/* Title — BLACK TONE */}
          <motion.h1
            variants={headerIn}
            className={[
              "font-light leading-[1.02] tracking-[-0.02em]",
              "text-[9vw] sm:text-6xl md:text-7xl lg:text-8xl",
              "drop-shadow-[0_1px_0_rgba(255,255,255,0.35),0_6px_14px_rgba(0,0,0,0.08)]",
            ].join(" ")}
            style={{
              color: "#0D0D0C",
              fontFamily: '"Playfair Display","Times New Roman",ui-serif,Georgia,serif',
              textRendering: "optimizeLegibility",
            }}
          >
            Signature Projects
          </motion.h1>

          {/* Underline — CHAMPAGNE TONE (only change) */}
          <motion.div
            variants={underlineIn}
            className="mt-3 h-[2px] w-[min(20rem,44vw)] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(233,215,163,0.95) 0%, rgba(233,215,163,0.25) 100%)",
            }}
            aria-hidden
          />

          {/* Subtitle — solid black */}
          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-[75ch] text-[0.98rem] sm:text-[1.05rem] md:text-[1.12rem] leading-[1.85]"
            style={{ color: "#0D0D0C" }}
          >
            Architecture built to be heard — immersive systems crafted for hospitality,
            residential cinemas, luxury retail, automotive showrooms, and enterprise venues.
          </motion.p>
        </motion.div>

        {/* CONTENT */}
        <div className="mt-8 sm:mt-10 md:mt-12">
          <ProjectsContent
            sections={sections}
            totals={totals}
            experience={experience}
            defaultSection={getDefaultSection()}
          />
        </div>
      </section>
    </main>
  );
}
