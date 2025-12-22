// app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { buildAboutUsUrl } from "@/lib/assets";
import { Michroma, Playfair_Display, Bodoni_Moda } from "next/font/google";

const tech = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tech",
  display: "swap",
});

const displaySerif = Bodoni_Moda({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display-serif",
  display: "swap",
});

const serif = Playfair_Display({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// R2-backed helper: uses ASSET_FOLDERS.ABOUTUS = "aboutus_images"
const IMG = (filename: string) => buildAboutUsUrl(filename);

/* ───────── motion presets ───────── */

const fadeUpRow = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
  },
};

const headerStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const headerItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
  },
};

/* ───────── data ───────── */

type JourneyEntry = {
  year: string;
  title: string;
  body: string;
  image: string;
  caption: string;
  href: string;
  linkLabel: string; // what comes after "Explore"
};

const journey: JourneyEntry[] = [
  {
    year: "2006",
    title: "Invisible architectural sound",
    body:
      "Nextrend introduces Amina invisible loudspeakers to Malaysia, embedding sound directly into plaster walls and ceilings. Rooms remain visually calm while music and dialogue arrive as a soft, even field rather than from visible boxes.",
    image: IMG("2006_amina5.jpg"),
    caption: "Early Amina panels – invisible architectural sound since 2006.",
    href: "/products/amina",
    linkLabel: "Amina invisible loudspeakers",
  },
  {
    year: "2008",
    title: "Refined panels and colour studies",
    body:
      "As projects expanded from residences to galleries and boutiques, the studio worked with designers on finishes, surface treatments and mounting methods. Amina panels became part of the palette – tuned to follow paint colours, plaster textures and room proportions.",
    image: IMG("2008_amina.png"),
    caption: "Second-generation Amina panels developed for bespoke interiors.",
    href: "/products/amina",
    linkLabel: "Amina plaster panels",
  },
  {
    year: "2013",
    title: "Line-array architecture with K-array",
    body:
      "K-array joins the portfolio with ultra-slim columns and line-array systems from Italy. Hotels, restaurants and intimate venues gain cinema-grade coverage from forms that disappear into stone, timber and glass façades.",
    image: IMG("2013_K_array_aboutus.jpg"),
    caption: "Slim Italian line arrays designed to live inside the architecture.",
    href: "/products/k-array",
    linkLabel: "K-array line-array systems",
  },
  {
    year: "2023",
    title: "Collectible listening objects",
    body:
      "With BE@RBRICK AUDIO 400%, sound steps into the world of collectible art. Limited-edition pieces with audiophile internals allow systems to sit alongside sculptures, design furniture and photography rather than normal equipment racks.",
    image: IMG("2023_Bearbricks.jpg"),
    caption: "BE@RBRICK AUDIO 400% – audio as a collectible object.",
    href: "/products/bearbrick-audio",
    linkLabel: "BE@RBRICK AUDIO 400%",
  },
  {
    year: "2024",
    title: "Timeless icons & studio futures",
    body:
      "Brionvega enters the catalogue with radios and systems that echo Italian modernism while hiding contemporary electronics inside. In parallel, Nextrend begins exploring AI-assisted acoustic design and simulation workflows to tune spaces with even greater precision.",
    image: IMG("2024_brionvega.jpg"),
    caption: "Brionvega – Italian icons reinterpreted for today’s interiors.",
    href: "/products/brionvega",
    linkLabel: "Brionvega pieces",
  },
];

/* ───────── timeline row component ───────── */

function TimelineRow({ entry, index }: { entry: JourneyEntry; index: number }) {
  const imageEnterX = index % 2 === 0 ? -22 : 22;
  const isEven = index % 2 === 0;

  return (
    <motion.article
      variants={fadeUpRow}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] lg:items-center"
    >
      {/* IMAGE SIDE – photo card */}
      <motion.div
        className={isEven ? "lg:order-1" : "lg:order-2 lg:justify-self-end"}
        initial={{ opacity: 0, y: 18, x: imageEnterX }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="relative w-full max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            className="relative rounded-[10px] bg-[#EDE3D2] border border-[#C8B89E] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.10)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
              <Image
                src={entry.image}
                alt={entry.caption}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* caption */}
        <motion.p
          variants={headerItem}
          className="mt-4 text-[0.7rem] italic text-[#6f6f6f]"
        >
          {entry.caption}
        </motion.p>
      </motion.div>

      {/* TEXT SIDE */}
      <motion.div
        variants={headerStagger}
        className={`space-y-4 ${
          isEven ? "lg:order-2 lg:pl-6" : "lg:order-1 lg:pr-6"
        }`}
      >
        <motion.p
          variants={headerItem}
          className={`${displaySerif.className} text-4xl sm:text-5xl tracking-[0.18em] text-[#17120c]`}
        >
          {entry.year}
        </motion.p>

        <motion.p
          variants={headerItem}
          className={`${serif.className} text-base font-medium text-neutral-800`}
        >
          {entry.title}
        </motion.p>

        <motion.p
          variants={headerItem}
          className={`${serif.className} text-sm sm:text-base leading-relaxed text-neutral-700`}
        >
          {entry.body}
        </motion.p>

        {/* CTA – champagne tone by default */}
        <motion.p variants={headerItem} className="text-sm">
          <Link
            href={entry.href}
            className="group inline-flex items-center gap-2 pb-[3px] border-b border-[#E5D1A2] hover:border-[#D5A853] active:border-[#D5A853] transition-colors"
          >
            <span className="text-xs sm:text-sm font-medium text-[#C8A867] group-hover:text-[#D5A853] group-active:text-[#D5A853]">
              Explore&nbsp;{entry.linkLabel}
            </span>

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-[#C8A867] transition-all group-hover:text-[#D5A853] group-active:text-[#D5A853] group-hover:translate-x-1"
            >
              {/* tail */}
              <path
                d="M5 12h10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              {/* chevron head */}
              <path
                d="M11 7l6 5-6 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.p>
      </motion.div>
    </motion.article>
  );
}

/* ───────── main component ───────── */

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7efe3] text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 lg:px-8 lg:pt-28">
        {/* Header */}
        <motion.section
          variants={headerStagger}
          initial="hidden"
          animate="show"
          className="space-y-6 text-center"
        >
          <motion.p
            variants={headerItem}
            className={`${tech.className} text-[0.78rem] uppercase tracking-[0.24em] text-[#b59b79]`}
          >
            Nextrend Systems · Architectural sound since 2006
          </motion.p>

          <motion.h1
            variants={headerItem}
            className={`${displaySerif.className} text-[2rem] sm:text-[2.4rem] lg:text-[2.8rem] font-semibold leading-[1.08] text-[#17120c]`}
          >
            Architectural sound,
            <span className="block text-[1.8rem] sm:text-[2.1rem] lg:text-[2.3rem] font-normal text-[#33241a]">
              crafted for space and quiet detail.
            </span>
          </motion.h1>

          <motion.p
            variants={headerItem}
            className={`${serif.className} mx-auto max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base`}
          >
            Since 2006, Nextrend has curated European and Japanese audio brands
            and fitted them into the fabric of interiors. From invisible
            plaster-over panels to slim Italian line arrays and collectible
            listening objects, the studio balances technology, architecture and
            everyday listening rituals.
          </motion.p>

          <motion.p
            variants={headerItem}
            className="text-[0.7rem] uppercase tracking-[0.24em] text-[#c8aa70]"
          >
            18 years of company journey · 2006 — 2024
          </motion.p>
        </motion.section>

        {/* Timeline heading + rows */}
        <section className="mt-20 border-t border-[#e1d5c5] pt-12 space-y-10">
          <motion.div
            variants={headerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-wrap items-baseline justify-between gap-3"
          >
            <motion.p
              variants={headerItem}
              className={`${serif.className} text-sm uppercase tracking-[0.26em] text-neutral-700`}
            >
              Company journey
            </motion.p>
            <motion.p
              variants={headerItem}
              className="text-[0.7rem] uppercase tracking-[0.24em] text-[#c49c4a]"
            >
              A continuous line from invisible panels to immersive studios
            </motion.p>
          </motion.div>

          <div className="space-y-16">
            {journey.map((entry, index) => (
              <TimelineRow key={entry.year} entry={entry} index={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
