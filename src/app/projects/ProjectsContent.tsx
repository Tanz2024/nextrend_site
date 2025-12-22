"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bed,
  Buildings,
  Factory,
  ForkKnife,
  HouseLine,
  ShoppingBag,
  SquaresFour,
} from "@phosphor-icons/react";

import ProjectHeroMetricsAnimated from "./ProjectHeroMetricsAnimated";
import ProjectsBrowser from "./ProjectsBrowser";
import {
  PROJECT_LIST,
  type ProjectSections,
  type ProjectTotals,
} from "./project-data";
import { TITLE_TO_SITE_IMAGE, HERO_BY_SLUG } from "./project-hero-images";

/* -------------------------------
   Helper: slug
-------------------------------- */
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* -------------------------------
   Images now imported from centralized file
-------------------------------- */

/* ------------------------------------ */
type ProjectsContentProps = {
  sections: ProjectSections;
  totals: ProjectTotals;
  experience: string;
  defaultSection: string;
};

type TileConfig = {
  label: string;
  sectionKey: string;
  valueKey: keyof ProjectTotals;
  icon: React.ComponentType<React.ComponentProps<typeof ForkKnife>>;
};

const TILE_CONFIG: TileConfig[] = [
  { label: 'All Projects', sectionKey: 'All Projects', valueKey: 'totalProjects', icon: SquaresFour },
  { label: 'Hospitality & Dining', sectionKey: 'Hospitality & Dining', valueKey: 'hospitality', icon: ForkKnife },
  { label: 'Hotels & Lounges', sectionKey: 'Hotels & Lounges', valueKey: 'hotels', icon: Bed },
  { label: 'Residential & Private Cinema', sectionKey: 'Residential & Private Cinema', valueKey: 'residential', icon: HouseLine },
  { label: 'Luxury Retail & Automotive', sectionKey: 'Luxury Retail & Automotive', valueKey: 'retailAuto', icon: ShoppingBag },
  { label: 'Corporate / Government / Enterprise', sectionKey: 'Corporate / Government / Enterprise', valueKey: 'corporate', icon: Buildings },
  { label: 'Developers / Galleries / Townships', sectionKey: 'Developers / Galleries / Townships', valueKey: 'developers', icon: Factory },
];

const ACTIVE_LAYOUT_ID = 'projects-capability-active';

export default function ProjectsContent({
  sections,
  totals,
  experience,
  defaultSection,
}: ProjectsContentProps) {
  const extendedSections = React.useMemo<ProjectSections>(() => {
    const all = Object.values(sections).flat();
    return { ...sections, 'All Projects': all };
  }, [sections]);

  const availableTiles = React.useMemo(
    () => TILE_CONFIG.filter((t) => extendedSections[t.sectionKey]),
    [extendedSections]
  );

  const initialSection = React.useMemo(() => {
    if (defaultSection && extendedSections[defaultSection]) return defaultSection;
    return availableTiles[0]?.sectionKey ?? '';
  }, [availableTiles, defaultSection, extendedSections]);

  const [activeSection, setActiveSection] = React.useState<string>(initialSection);
  const [tilesExpanded, setTilesExpanded] = React.useState<boolean>(false);

  // Update active section when initialSection changes (e.g., when URL params are processed)
  React.useEffect(() => {
    setActiveSection(initialSection);
    // If the initial section is not in the first 4 tiles, expand the tiles automatically
    if (initialSection && !availableTiles.slice(0, 4).some((t) => t.sectionKey === initialSection)) {
      setTilesExpanded(true);
    }
  }, [initialSection, availableTiles]);

  const handleSelect = React.useCallback(
    (label: string) => {
      if (!extendedSections[label]) return;
      setActiveSection(label);
      if (!tilesExpanded && !availableTiles.slice(0, 4).some((t) => t.sectionKey === label)) {
        setTilesExpanded(true);
      }
      const url = new URL(window.location.href);
      url.searchParams.set('section', label);
      window.history.replaceState({}, '', url.toString());
    },
    [extendedSections, availableTiles, tilesExpanded]
  );

  const tilesToDisplay = React.useMemo(
    () => (tilesExpanded ? availableTiles : availableTiles.slice(0, 4)),
    [availableTiles, tilesExpanded]
  );

const tileGridClass = React.useMemo(
  () =>
    tilesExpanded
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid auto-cols-[minmax(220px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-4 pr-2 text-left scrollbar-none snap-x snap-mandatory sm:auto-cols-[minmax(240px,1fr)] md:auto-cols-[minmax(260px,1fr)]",
  [tilesExpanded]
);


  const reduceTileMotion = useReducedMotion();

  const tileListVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  const tileItemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const tileListAnimationProps = reduceTileMotion || !hasMounted
    ? { initial: 'show', animate: 'show' }
    : { initial: 'hidden', animate: 'show' };

  return (
    <>
      <section className="mt-10">
        <div className="border-t border-white/14 pt-6">
          <ProjectHeroMetricsAnimated totals={totals} experience={experience} />
        </div>

    <div className="mt-12 border-t border-white/14 pt-8 pb-8">

          <motion.ul
            className={tileGridClass}
            role="tablist"
            aria-label="Project categories"
            variants={tileListVariants}
            {...tileListAnimationProps}
          >
            {tilesToDisplay.map(({ label, sectionKey, valueKey, icon: Icon }) => {
              const value = totals[valueKey];
              const isActive = sectionKey === activeSection;
              return (
              <motion.li
                key={label}
                className="flex snap-start"
                variants={tileItemVariants}
              >
                <motion.button
                  type="button"
                    onClick={() => handleSelect(sectionKey)}
className={[
  'group relative flex min-w-[210px] flex-1 flex-col justify-between rounded-2xl p-5 text-left md:min-w-0 md:p-6',
  'bg-white shadow-none',
  'transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10',
  'ring-1 ring-inset ring-black/10 hover:ring-black/15',
  isActive ? 'ring-[#d5a853]/45' : '',
].join(' ')}

                    aria-pressed={isActive}
                whileHover={{ y: -2 }}

                    whileTap={{ scale: 0.98 }}
                  >
{isActive && (
  <motion.span
    layoutId={ACTIVE_LAYOUT_ID}
className="pointer-events-none absolute inset-0 z-0 rounded-2xl
           bg-gradient-to-b from-[rgba(213,168,83,0.05)] to-[rgba(213,168,83,0.02)]"

    transition={{ type: "spring", stiffness: 260, damping: 30 }}
  />
)}


                 <div className="relative z-10 flex items-center gap-3">
                      <motion.span
                     className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-transparent md:h-12 md:w-12 md:translate-y-[0.5px]"

                        layout
                        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                      >
                        <motion.span
                          animate={{ rotate: isActive ? 2 : 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                        >
                          <Icon
                            className="h-[22px] w-[22px] text-[#0d0d0c] transition-colors duration-300 ease-out group-hover:text-[#d5a853]"
                            weight="regular"
                          />
                        </motion.span>
                      </motion.span>

                      <span className="relative text-[11px] font-semibold uppercase tracking-[0.2em] leading-[1.5] text-[#0d0d0c] transition-colors duration-300 group-hover:text-[#d5a853]">
                        {label}
                        <i aria-hidden className="absolute left-0 -bottom-1 h-[1px] w-0 rounded-full bg-[#d5a853] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </div>

                  
                <div className="relative z-10 mt-6 tabular-nums font-lighttracking-[-0.02em] text-[2rem] leading-none text-[#d5a853] md:mt-8 md:text-[2.4rem]"
                      style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, serif' }}
                    >
                      {value}
                    </div>
                  </motion.button>
                </motion.li>
              );
            })}
          </motion.ul>

          {availableTiles.length > 4 ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setTilesExpanded((prev) => !prev)}
                className="group inline-flex items-center gap-3 rounded-full border border-[rgba(213,168,83,0.28)] bg-[#f6f2e9] px-5 py-2 text-[0.7rem] uppercase tracking-[0.26em] text-[#0d0d0c] transition hover:border-[rgba(213,168,83,0.45)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(213,168,83,0.45)]"
              >
                <span>{tilesExpanded ? 'Show fewer categories' : 'Show all categories'}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0d0d0c] transition group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {/* IMPORTANT: pass slug-keyed hero map that points to /project_sites */}
      <ProjectsBrowser
        sections={extendedSections}
        // defaultSection={initialSection}
        activeSection={activeSection}
  imageMap={TITLE_TO_SITE_IMAGE}  
      />
    </>
  );
}