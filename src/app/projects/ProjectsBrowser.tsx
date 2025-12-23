// app/projects/ProjectsBrowser.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type ProjectCard = {
  title: string;
  context: string;
  location?: string;
  summary?: string;
  focus?: string[];
  year?: string | number;
  completion?: string;
};

type Sections = Record<string, ProjectCard[]>;

type SortOption =
  | "curated"
  | "latest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "context";

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "curated", label: "Curated Mix" },
  { value: "latest", label: "Latest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "context", label: "Context" },
];

const slugify = (v: string) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getLocationFromContext = (context: string, location?: string) => {
  if (location && location.trim()) return location.trim();
  const parts = context.split("·");
  return parts.length > 1 ? parts.slice(1).join("·").trim() : "";
};

const parseCompletionDate = (completion?: string): Date | null => {
  if (!completion) return null;
  const cleaned = completion.trim();

  const mmYY = cleaned.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (mmYY) {
    const [, m, y] = mmYY;
    const idx = new Date(`${m} 1, ${y}`).getMonth();
    return new Date(parseInt(y, 10), idx, 1);
  }

  const yyyy = cleaned.match(/^(\d{4})$/);
  if (yyyy) return new Date(parseInt(yyyy[1], 10), 0, 1);

  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
};

const CARD_EASE = [0.19, 1, 0.22, 1] as const;

type CardAnimationCustom = {
  row: number;
  col: 0 | 1;
  index: number;
  isDesktop: boolean;
  reduced: boolean;
};

const cardVariants = {
  hidden: ({ reduced, isDesktop }: CardAnimationCustom) => ({
    opacity: 0,
    y: reduced ? 0 : 18,
    scale: reduced ? 1 : 0.996,
   filter: "none",

  }),
  show: ({ row, col, index, isDesktop, reduced }: CardAnimationCustom) => ({
    opacity: 1,
    y: 0,
    scale: 1,
   filter: "none",

    transition: {
      duration: reduced ? 0.2 : 0.55,
      ease: CARD_EASE,
      delay: reduced
        ? 0
        : isDesktop
        ? row * 0.085 + col * 0.045
        : Math.min(index, 10) * 0.06,
    },
  }),
  exit: ({ reduced }: CardAnimationCustom) => ({
    opacity: 0,
    y: reduced ? 0 : -10,
    transition: { duration: 0.2, ease: CARD_EASE },
  }),
};

type ImageEntry = string | { src: string; focal?: string };

const resolveImage = (
  title: string,
  imageMap?: Record<string, ImageEntry>
): { src: string; focal: string } => {
  const entry = imageMap?.[title];
  if (!entry) return { src: "", focal: "50% 50%" };
  if (typeof entry === "string") return { src: entry, focal: "50% 50%" };
  return { src: entry.src, focal: entry.focal ?? "50% 50%" };
};

export default function ProjectsBrowser({
  sections,
  defaultSection,
  activeSection,
  imageMap,
}: {
  sections: Sections;
  defaultSection?: string;
  activeSection: string;
  imageMap?: Record<string, ImageEntry>;
}) {
  const prefersReduced = useReducedMotion();

  const [sortMode, setSortMode] = React.useState<SortOption>("curated");
  const [expanded, setExpanded] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [justExpanded, setJustExpanded] = React.useState(false);
  const justExpandedTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Desktop vs mobile
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  React.useEffect(() => setIsClient(true), []);
  React.useEffect(() => {
    setExpanded(false);
    setJustExpanded(false);
  }, [activeSection]);

  React.useEffect(
    () => () => {
      if (justExpandedTimer.current) {
        clearTimeout(justExpandedTimer.current);
        justExpandedTimer.current = null;
      }
    },
    []
  );

  // read sort from URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sort = params.get("sort") as SortOption | null;
    if (sort && SORT_OPTIONS.some((o) => o.value === sort)) setSortMode(sort);
  }, []);

  // keep URL in sync
  React.useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const fallback =
        defaultSection && sections[defaultSection] ? defaultSection : activeSection;
      url.searchParams.set("section", activeSection || fallback);
      url.searchParams.set("sort", sortMode);
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  }, [activeSection, defaultSection, sections, sortMode]);

  const sortedProjects = React.useMemo(() => {
    const list = [...(sections[activeSection] ?? [])];

    switch (sortMode) {
      case "latest":
        return list.sort((a, b) => {
          const A = parseCompletionDate(a.completion);
          const B = parseCompletionDate(b.completion);
          if (!A && !B) return 0;
          if (!A) return 1;
          if (!B) return -1;
          return B.getTime() - A.getTime();
        });
      case "oldest":
        return list.sort((a, b) => {
          const A = parseCompletionDate(a.completion);
          const B = parseCompletionDate(b.completion);
          if (!A && !B) return 0;
          if (!A) return 1;
          if (!B) return -1;
          return A.getTime() - B.getTime();
        });
      case "title-asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case "context":
        return list.sort((a, b) => a.context.localeCompare(b.context));
      default:
        return list;
    }
  }, [activeSection, sections, sortMode]);

  const baseCount = isDesktop ? 8 : 4;

  const scrollMotionProps = React.useMemo(() => {
    if (prefersReduced) {
      return { initial: "show" as const };
    }
    return {
      initial: "hidden" as const,
      whileInView: "show" as const,
      viewport: { once: true, amount: isDesktop ? 0.35 : 0.25 },
    };
  }, [prefersReduced, isDesktop]);

  const visible = expanded ? sortedProjects : sortedProjects.slice(0, baseCount);
  const canExpand = sortedProjects.length > baseCount;

  // prevent scroll jump when collapsing
  const toggleWrapRef = React.useRef<HTMLDivElement | null>(null);
  const anchorTopRef = React.useRef<number | null>(null);
  const prevExpandedRef = React.useRef<boolean>(expanded);

  React.useLayoutEffect(() => {
    const prev = prevExpandedRef.current;
    prevExpandedRef.current = expanded;

    if (!prev || expanded) return;

    const el = toggleWrapRef.current;
    const anchorTop = anchorTopRef.current;
    if (!el || anchorTop == null) return;

    const newTop = el.getBoundingClientRect().top;
    const delta = newTop - anchorTop;

    if (Math.abs(delta) < 6) {
      anchorTopRef.current = null;
      return;
    }

    const behavior: ScrollBehavior = Math.abs(delta) > 80 ? "smooth" : "auto";
    window.scrollBy({ top: delta, left: 0, behavior });
    anchorTopRef.current = null;
  }, [expanded]);

  const onToggleExpand = React.useCallback(() => {
    if (expanded && toggleWrapRef.current) {
      anchorTopRef.current = toggleWrapRef.current.getBoundingClientRect().top;
    }
    if (!expanded) {
      setJustExpanded(true);
      if (justExpandedTimer.current) {
        clearTimeout(justExpandedTimer.current);
      }
      justExpandedTimer.current = setTimeout(() => {
        setJustExpanded(false);
        justExpandedTimer.current = null;
      }, 900);
    } else if (justExpandedTimer.current) {
      clearTimeout(justExpandedTimer.current);
      justExpandedTimer.current = null;
      setJustExpanded(false);
    }
    setExpanded((v) => !v);
  }, [expanded]);

  return (
 <section className="mx-auto w-full max-w-[118rem] px-5 pb-10 md:pb-16 pt-6 sm:px-8 lg:px-12">

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <label className="relative inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-[#6a6256]/80">
          Sort
          <span className="relative">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortOption)}
           className="appearance-none rounded-full bg-white px-4 py-2  text-[10px] uppercase tracking-[0.18em]
                         text-[#3d362c]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#caa870]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

          </span>
        </label>
      </div>

      {/* Grid */}
      <motion.ul className="grid items-stretch gap-y-12 md:grid-cols-2 md:gap-x-10">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((p, index) => {
            const slug = slugify(p.title);
            const href = slug === "all-projects" ? "/projects" : `/projects/${slug}`;
            const loc = getLocationFromContext(p.context, p.location);
            const { src, focal } = resolveImage(p.title, imageMap);

            const row = Math.floor(index / 2);
            const col = (index % 2) as 0 | 1;

            const shouldAnimateOnExpand =
              expanded && justExpanded && index >= baseCount && !prefersReduced;
            const motionProps = shouldAnimateOnExpand
              ? { initial: "hidden" as const, animate: "show" as const }
              : scrollMotionProps;

            const cardBody = (
              <article
className="group/project isolate flex h-full w-full flex-col overflow-hidden rounded-2xl
bg-[#f5efe4]
border border-black/10
  transition duration-300 ease-out
  hover:-translate-y-[1px]
  focus-within:ring-0
"

              >
                {/* Image: no ring, no active shrink, no tap highlight */}
                <Link
                  href={href}
                  aria-label={`Open ${p.title}`}
                  className="block focus:outline-none focus-visible:outline-none [-webkit-tap-highlight-color:transparent]"
                >
               <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-[#f5efe4]">

                    {src ? (
                      <>
                        <Image
                          src={src}
                          alt={p.title}
                          fill
                          sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
       className="block object-cover transition-transform duration-1000 ease-out
           group-hover/project:scale-[1.02]"


                          style={{ objectPosition: focal }}
                          priority={index < 3}
                        />
                     
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-[#f5efe4]
" />
                    )}
                  </div>
                </Link>

           <div className="grid grid-cols-[1fr_auto] items-center gap-5 md:gap-6 px-6 md:px-8 py-5 md:py-6">

                  <div className="min-w-0">
                    <h3
                      className="font-medium text-[#2b2823] text-[22px] lg:text-[24px] leading-[1.25] tracking-[-0.01em]"
                      style={{
                        fontFamily:
                          'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      <Link
                        href={href}
                        className="hover:opacity-95 focus:outline-none focus-visible:outline-none"
                      >
                        {p.title}
                      </Link>
                    </h3>

                    {loc && (
                   <p className="mt-1.5 text-[13px] leading-snug text-[#2b2823]/85">

                        {loc}
                      </p>
                    )}

                    {p.completion ? (
                      <p className="mt-[6px] text-[12px] leading-tight flex items-center gap-2">
                        <span className="inline-block h-[5px] w-[5px] rounded-full bg-[#d9c299] opacity-[0.65]" />
                    <span className="uppercase font-medium text-[10px]tracking-[0.12em]
 text-[#d9c299]/80">

                          Completed
                        </span>
                        <span
                          className="font-medium text-[12px] text-[#6c6458]"
                          style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                          {p.completion}
                        </span>
                      </p>
                    ) : (
                      <div className="mt-1 min-h-[20px]" aria-hidden />
                    )}
                  </div>

<Link
  href={href}
  aria-label={`Open ${p.title}`}
className="group inline-flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full
           bg-white border border-black/12
           shadow-none transition-[transform,border-color,color] duration-200 ease-out
           hover:translate-x-[2px] active:scale-[0.995]
           hover:border-[#b99556]
           focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10
           [-webkit-tap-highlight-color:transparent]"

>
<svg
  viewBox="0 0 24 24"
  fill="none"
  className="h-[18px] w-[18px] md:h-[22px] md:w-[22px]
             text-[#12110f]
             transition-[transform,color] duration-200 ease-out
             group-hover:text-[#b99556] group-active:text-[#b99556]
             group-hover:translate-x-[1px]"
>
<path d="M6.5 12h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />


  <path
    d="M12.8 8.5L16.3 12l-3.5 3.5"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>

                  </Link>
                </div>
              </article>
            );

            if (!isClient) {
              return (
                <li key={p.title} className="flex">
                  {cardBody}
                </li>
              );
            }

            return (
              <motion.li
                key={p.title}
                layout
                className="flex"
                variants={cardVariants}
                exit="exit"
                custom={{
                  row,
                  col,
                  index,
                  isDesktop,
                  reduced: prefersReduced,
                }}
                {...motionProps}
              >
                {cardBody}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {/* Toggle */}
     {/* Toggle */}
{canExpand && (
<motion.div
  ref={toggleWrapRef}
className="mt-6 md:mt-8 mb-6 flex justify-center"


    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: CARD_EASE }}
  >
<motion.button
  type="button"
  onClick={onToggleExpand}
  aria-expanded={expanded}
  whileTap={{ scale: 0.985 }}
  className="
    group relative inline-flex items-center gap-3
    text-[rgba(13,13,12,0.82)]
    transition-colors duration-300 ease-out
    hover:text-[#d5a853]
    focus-visible:text-[#d5a853]
    active:text-[#d5a853]
    focus:outline-none
    [-webkit-tap-highlight-color:transparent]
  "
>
  <span className="relative text-[0.72rem] sm:text-[0.75rem] font-medium uppercase tracking-[0.28em] inline-block">
    <span className="block select-none">
      {expanded ? "Show less Projects" : "View all Projects"}
    </span>

    <span
      aria-hidden
      className="
        pointer-events-none absolute -bottom-[4px] left-0 h-[1px] w-full
        bg-current origin-left scale-x-0
        transition-transform duration-300 ease-out
        group-hover:scale-x-100 group-focus-visible:scale-x-100
      "
    />
  </span>

  <span
    className="
      inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center
      transition-transform duration-300 ease-out
      group-hover:translate-x-[3px]
      group-active:translate-x-[3px]
    "
    aria-hidden
  >
    →
  </span>
</motion.button>

  </motion.div>
)}

    </section>
  );
}
