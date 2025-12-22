"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { TopSearchTerm } from "./topSearchTerms";

type SuggestionHighlightsProps = {
  terms: TopSearchTerm[];
  resetKey?: string;
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * i,
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

export const SuggestionHighlights = ({
  terms,
  resetKey,
}: SuggestionHighlightsProps) => {
  if (!terms || !terms.length) return null;

  return (
    <motion.section
      key={resetKey}
      className="mt-14 space-y-5"
      aria-label="Related searches"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* heading + subtle divider */}
      <div className="flex items-center gap-4">
        <p className="text-[0.7rem] uppercase tracking-[0.45em] text-[var(--secondary)]">
          Selected just for you
        </p>
        <span className="hidden h-px flex-1 bg-gradient-to-r from-[rgba(0,0,0,0.12)] via-[rgba(0,0,0,0.03)] to-transparent md:block" />
      </div>

      <p className="text-[0.75rem] text-[var(--secondary)]">
        Need more retail, cafe, residence, karaoke, or hi-fi inspiration?
        <Link
          href="/projects"
          className="ml-2 font-semibold text-[var(--accent)] underline-offset-4 hover:text-[var(--foreground)]"
        >
          See the main project page
        </Link>{" "}
        for fresh ideas.
      </p>

      {/* simple text suggestions with premium ↗ arrow */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 text-[0.9rem]">
        {terms.map((term, index) => (
          <motion.div
            key={term.query}
            custom={index}
            variants={itemVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Link
              href={`/search?q=${encodeURIComponent(term.query)}`}
              className="
                group inline-flex items-center gap-1.5
                text-[0.9rem] font-medium
                text-[var(--foreground)]
                transition-colors duration-200
                hover:text-[var(--accent)]
                active:text-[var(--accent)]
              "
            >
              <span>{term.query}</span>

              {/* tiny NE arrow, champagne tone */}
              <span
                className="
                  inline-flex h-4 w-4 items-center justify-center
                  translate-y-[0.5px]
                  transition-transform duration-200
                  group-hover:translate-x-[2px] group-hover:-translate-y-[1px]
                  group-active:translate-x-[2px] group-active:-translate-y-[1px]
                "
              >
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                >
                  <path
                    d="M6 14L14 6M8.5 6H14V11.5"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
