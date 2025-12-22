// app/loading.tsx
"use client";

import { motion } from "framer-motion";
import { Michroma } from "next/font/google";

const tech = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tech",
  display: "swap",
});

const CREAM = "#f5eee5";

export default function RootLoading() {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${tech.variable}`}
      style={{ background: CREAM }}
    >
      {/* background glow */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(213,168,83,0.26), transparent 60%)",
        }}
      />

      {/* icons only – no border / badge */}
      <motion.div
        className="relative mb-6 flex items-center justify-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* soft invisible glow just under icons */}
        <motion.div
          className="pointer-events-none absolute -inset-6"
          style={{
            background:
              "radial-gradient(circle at center, rgba(213,168,83,0.35), transparent 70%)",
          }}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* music character: equalizer + note (kept same) */}
        <motion.div
          className="relative flex items-end gap-1"
          animate={{ x: [-2, 2, -2], y: [0, -2, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          {/* equalizer bars */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-[#d5a853]"
              initial={{ scaleY: 0.4, opacity: 0.7 }}
              animate={{ scaleY: [0.4, 1.2, 0.5], opacity: [0.6, 1, 0.7] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                repeatType: "mirror",
                delay: i * 0.12,
                ease: "easeInOut",
              }}
              style={{ height: 18 + i * 4 }}
            />
          ))}

          {/* main music note */}
          <motion.svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            className="ml-2"
            initial={{ y: 2 }}
            animate={{ y: [2, -2, 2], rotate: [-4, 4, -4] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <path
              d="M18 5.5V17.2C17.4 16.9 16.7 16.75 16 16.75C13.94 16.75 12.25 18.35 12.25 20.25C12.25 22.15 13.94 23.75 16 23.75C18.06 23.75 19.75 22.15 19.75 20.25V10.2L24 11.4V8.7L18 5.5Z"
              fill="#d5a853"
            />
          </motion.svg>

          {/* tiny floating note accent */}
          <motion.span
            className="pointer-events-none absolute -top-4 -right-3 text-[10px] text-[#d5a853]/80"
            animate={{ y: [-2, -6, -2], opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            ♪
          </motion.span>
        </motion.div>
      </motion.div>

      {/* text under icons */}
      <div className="relative flex flex-col items-center gap-2">
        <p className="text-[0.7rem] uppercase tracking-[0.35em] text-neutral-700">
          NEXtrend systems
        </p>
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[#b59654]">
          Architectural sound · loading
        </p>

        {/* subtle progress shimmer line – Amazon-style pill */}
        <motion.div
          className="mt-4 h-[2px] w-32 overflow-hidden rounded-full bg-[#e5d9c7]"
          initial={false}
        >
          <motion.div
            className="h-full w-1/3 rounded-full bg-[#d5a853]"
            animate={{ x: ["-120%", "160%"] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
