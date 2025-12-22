// app/products/k-array/page.tsx
// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LazyMotion, AnimatePresence, m } from "framer-motion";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { Bodoni_Moda, Playfair_Display } from "next/font/google";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  speakersProducts,
  subwoofersProducts,
  monitorsProducts,
  systemsProducts,
  audioLightProducts,
  lightProducts,
  type KArrayProduct,
} from "./data/index";

// Fonts
const karrayHeroFont = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const karrayProductFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Combine all modular products into a single array
const karrayProducts: KArrayProduct[] = [
  ...speakersProducts,
  ...subwoofersProducts,
  ...monitorsProducts,
  ...systemsProducts,
  ...audioLightProducts,
  ...lightProducts,
];

const loadMotionFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

/* ---------- helpers ---------- */
const getDisplayParts = (name: string, series: string) => {
  // Normalize the brand prefix so only the model name remains
  const cleanName = name.replace(/^(KGEAR|K-array)\s+/i, "").trim();
  return { title: cleanName, subtitle: series?.toUpperCase() ?? "" };
};

const products = karrayProducts.map((product) => ({
  slug: product.slug,
  name: product.name,
  description: product.description,
  series: product.series,
  category: product.category,
  power: product.power,
  image: product.image,
}));

const unique = (values: string[]) => Array.from(new Set(values));

// Hierarchical series mapping with our modular data
const seriesByCategory = {
  Speakers: ["Mugello", "Firenze"],
  Subwoofers: ["Rumble", "Truffle", "Thunder"],
  Monitors: ["Mastiff", "Turtle"],
  Systems: ["Azimut", "Dolomite"],
  "Audio & Light": ["Rail"],
  Light: ["RAIL"],
};

// Series display names
const seriesDisplayNames = {
  // Speakers
  Mugello: "Mugello Compact Install",
  Firenze: "Firenze Luxury Install",
  // Subwoofers
  Rumble: "Rumble Passive Subs",
  Truffle: "Truffle Compact Subs",
  Thunder: "Thunder Install Subs",
  // Monitors
  Mastiff: "Mastiff Studio Monitors",
  Turtle: "Turtle Reference Monitors",
  // Systems
  Azimut: "Azimut Steerable Arrays",
  Dolomite: "Dolomite Integrated Systems",
  // Audio & Light
  Rail: "Rail Architectural Audio+Light",
  // Light
  RAIL: "RAIL Professional Lighting",
};

// Filters configuration
const filtersConfig = [
  {
    key: "category",
    title: "Category",
    options: unique(products.map((p) => p.category)),
  },
  {
    key: "power",
    title: "Power",
    options: unique(products.map((p) => p.power)),
  },
] as const;

// Category groups
const categoryGroups = [
  {
    title: "Speakers",
    categories: ["Speakers"],
    description: "Premium speaker systems",
  },
  {
    title: "Subwoofers",
    categories: ["Subwoofers"],
    description: "Low-frequency systems",
  },
  {
    title: "Monitors",
    categories: ["Monitors"],
    description: "Studio & reference monitors",
  },
  {
    title: "Systems",
    categories: ["Systems"],
    description: "Complete audio solutions",
  },
  {
    title: "Audio & Light",
    categories: ["Audio & Light"],
    description: "Integrated A/V systems",
  },
  {
    title: "Light",
    categories: ["Light"],
    description: "Professional lighting systems",
  },
] as const;

type FilterKey = (typeof filtersConfig)[number]["key"];
type SeriesKey = keyof typeof seriesByCategory;
type KArrayFilters = Record<FilterKey, string[]> & { series: string[] };

const matchFilters = (values: KArrayFilters, target: KArrayFilters) => {
  const matchesConfig = filtersConfig.every(({ key }) => {
    const current = values[key] ?? [];
    const next = target[key] ?? [];
    if (current.length !== next.length) return false;
    return current.every((value, index) => value === next[index]);
  });

  if (!matchesConfig) return false;

  const seriesCurrent = values.series ?? [];
  const seriesNext = target.series ?? [];
  if (seriesCurrent.length !== seriesNext.length) return false;
  return seriesCurrent.every((value, index) => value === seriesNext[index]);
};

const sorterFns: Record<
  string,
  (a: (typeof products)[number], b: (typeof products)[number]) => number
> = {
  featured: () => 0, // Default order - curated
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  series: (a, b) =>
    (a.series || "").localeCompare(b.series || "") ||
    a.name.localeCompare(b.name),
};

const sortOptions = [
  {
    key: "featured",
    label: "Featured",
    description: "Curated selection",
  },
  {
    key: "name-asc",
    label: "Name A-Z",
    description: "Alphabetical order",
  },
  {
    key: "series",
    label: "Series",
    description: "Grouped by product series",
  },
] as const;

/* ---------- icons ---------- */
const IconFilter = ({ className, ...p }: any) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    className={`transition-all duration-200 ${className}`}
    {...p}
  >
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      stroke="#C4A777"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="16"
      cy="6"
      r="2.5"
      fill="none"
      stroke="#C4A777"
      strokeWidth="2"
    />

    <line
      x1="3"
      y1="12"
      x2="21"
      y2="12"
      stroke="#C4A777"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="8"
      cy="12"
      r="2.5"
      fill="none"
      stroke="#C4A777"
      strokeWidth="2"
    />

    <line
      x1="3"
      y1="18"
      x2="21"
      y2="18"
      stroke="#C4A777"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="13"
      cy="18"
      r="2.5"
      fill="none"
      stroke="#C4A777"
      strokeWidth="2"
    />
  </svg>
);

const IconChevron = ({ className, ...p }: any) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    className={`transition-transform duration-300 ${className}`}
    {...p}
  >
    <path
      d="M6.5 9.5L12 15l5.5-5.5c.35-.35.35-.9 0-1.25-.17-.17-.4-.25-.62-.25H7.12c-.22 0-.45.08-.62.25-.35.35-.35.9 0 1.25z"
      fill="currentColor"
    />
  </svg>
);

const IconClose = ({ className, ...p }: any) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className} {...p}>
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSearch = ({ className, ...p }: any) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className} {...p}>
    <circle
      cx="11"
      cy="11"
      r="8"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M21 21l-4.35-4.35"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconPower = ({ className, ...p }: any) => (
  <svg
    viewBox="0 0 20 20"
    width="16"
    height="16"
    className={className}
    aria-hidden="true"
    {...p}
  >
    <path
      d="M10 2v6h-2.5l4 6v-5.5h2.5L10 2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconCategorySpeakers = ({ className, ...p }: any) => (
  <svg viewBox="0 0 24 24" className={className} {...p}>
    <rect x="5" y="4" width="14" height="16" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="12" cy="16.2" r="1.1" fill="currentColor" />
  </svg>
);

const IconCategorySubwoofers = ({ className = "", ...p }: any) => (
  <svg viewBox="0 0 24 24" className={className} {...p}>
    {/* cabinet */}
    <rect
      x="4"
      y="8"
      width="16"
      height="9"
      rx="1.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    {/* woofer */}
    <circle
      cx="12"
      cy="12.5"
      r="3.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="12.5" r="1.3" fill="currentColor" />
    {/* little feet */}
    <path
      d="M6 18.5h2.2M15.8 18.5H18"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);


const IconCategoryMonitors = ({ className, ...p }: any) => (
  <svg viewBox="0 0 24 24" className={className} {...p}>
    <rect x="4" y="5" width="16" height="11" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <rect x="10" y="17" width="4" height="2" rx="0.6" fill="currentColor" />
    <path d="M9 19.5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconCategorySystems = ({ className, ...p }: any) => (
  <svg viewBox="0 0 24 24" className={className} {...p}>
    <rect x="4" y="5" width="6" height="6" rx="1.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="5" width="6" height="6" rx="1.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <rect x="9" y="14" width="6" height="6" rx="1.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7 11l3 3M17 11l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconCategoryAudioLight = ({ className = "", ...p }: any) => (
  <svg viewBox="0 0 24 24" className={className} {...p}>
    {/* rail body */}
    <rect
      x="4"
      y="7"
      width="16"
      height="4"
      rx="1.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    {/* speaker / LED apertures */}
    <circle cx="8" cy="9" r="0.8" fill="currentColor" />
    <circle cx="12" cy="9" r="0.8" fill="currentColor" />
    <circle cx="16" cy="9" r="0.8" fill="currentColor" />

    {/* light beams down from centre */}
    <path
      d="M12 11.8v2.4M10.6 11.8l-.9 2.1M13.4 11.8l.9 2.1"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconCategoryLight = ({ className, ...p }: any) => (
  <svg viewBox="0 0 24 24" className={className} {...p}>
    <path
      d="M12 4a5 5 0 0 1 3.4 8.7C14.5 13.5 14 14.3 14 15v1H10v-1c0-.7-.5-1.5-1.4-2.3A5 5 0 0 1 12 4Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 18h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M11 20h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const categoryIconByTitle: Record<string, JSX.Element> = {
  Speakers: <IconCategorySpeakers className="w-3.5 h-3.5 text-[#C4A777]" />,
  Subwoofers: <IconCategorySubwoofers className="w-3.5 h-3.5 text-[#C4A777]" />,
  Monitors: <IconCategoryMonitors className="w-3.5 h-3.5 text-[#C4A777]" />,
  Systems: <IconCategorySystems className="w-3.5 h-3.5 text-[#C4A777]" />,
  "Audio & Light": <IconCategoryAudioLight className="w-3.5 h-3.5 text-[#C4A777]" />,
  Light: <IconCategoryLight className="w-3.5 h-3.5 text-[#C4A777]" />,
};

const IconArrowLeft = ({ className, ...p }: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" className={className} {...p}>
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconArrowRight = ({ className, ...p }: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" className={className} {...p}>
    <path
      d="M9 18l6-6-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- pagination helper (same pattern as Trinnov) ---------- */
const DOTS = "DOTS" as const;

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): (number | typeof DOTS)[] {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const firstPage = 0;
  const lastPage = totalPages - 1;

  let windowStart = Math.floor(currentPage / 3) * 3;
  let windowEnd = Math.min(windowStart + 2, lastPage);

  const pages: (number | typeof DOTS)[] = [];

  if (windowStart > firstPage) {
    pages.push(firstPage);
    if (windowStart > firstPage + 1) {
      pages.push(DOTS);
    }
  }

  for (let i = windowStart; i <= windowEnd; i++) {
    pages.push(i);
  }

  if (windowEnd < lastPage) {
    if (windowEnd < lastPage - 1) {
      pages.push(DOTS);
    }
    pages.push(lastPage);
  }

  return pages;
}

/* ---------- Champagne CTA ---------- */
function ChampagneArrow({ href, label }: { href: string; label: string }) {
  return (
    <m.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Link
        href={href}
        aria-label={label}
        className="group relative inline-flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#C4A777] bg-white/95 backdrop-blur-sm shadow-[0_12px_30px_rgba(196,167,119,0.25)] sm:shadow-[0_14px_35px_rgba(196,167,119,0.28)] lg:shadow-[0_16px_40px_rgba(196,167,119,0.3)] transition-all duration-500 hover:bg-[#C4A777] hover:shadow-[0_16px_40px_rgba(196,167,119,0.5)] sm:hover:shadow-[0_18px_45px_rgba(196,167,119,0.55)] lg:hover:shadow-[0_20px_50px_rgba(196,167,119,0.6)] hover:border-[#B8964A] focus:outline-none focus:ring-2 focus:ring-[#C4A777]/50 touch-manipulation"
      >
        <m.div
          className="flex items-center justify-center"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            className="sm:w-[17px] sm:h-[17px] lg:w-[18px] lg:h-[18px] relative z-10 transition-colors duration-300"
            fill="none"
          >
            <path
              d="M6 12h12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-[#C4A777] group-hover:text-white transition-colors duration-300"
            />
            <path
              d="M14 8l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#C4A777] group-hover:text-white transition-colors duration-300"
            />
          </svg>
        </m.div>

        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E8D5B7] to-[#C4A777] opacity-0 transition-opacity duration-300 group-hover:opacity-20" />

        <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out rounded-full" />
      </Link>
    </m.div>
  );
}

/* ---------- grid helpers (aligned with Trinnov) ---------- */
const gridWrapperClasses =
  "grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 md:grid-cols-2";

/* ---------- page ---------- */
export default function KArrayCollection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const buildFiltersFromParams = () => {
    const baseFilters = filtersConfig.reduce((acc, f) => {
      const values = searchParams.getAll(f.key);
      return { ...acc, [f.key]: values };
    }, {} as Record<FilterKey, string[]>);
    const seriesValues = searchParams.getAll("series");
    return { ...baseFilters, series: seriesValues };
  };

  const getInitialPageFromParams = () => {
    const pageParam = searchParams.get("page");
    if (!pageParam) return 0;
    const numeric = Number(pageParam);
    if (!Number.isNaN(numeric) && numeric > 0) {
      return numeric - 1;
    }
    return 0;
  };

  const [filters, setFilters] = useState<KArrayFilters>(
    buildFiltersFromParams
  );
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen] = useState(false); // reserved for future mobile sort
  const [sortKey, setSortKey] = useState<keyof typeof sorterFns>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(getInitialPageFromParams);

  const itemsPerPage = 6;
  const hasPaginatedRef = useRef(false);
  const urlSyncedRef = useRef(false);
  const filtersRef = useRef(filters);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      Category: true,
      Power: true,
    }
  );

  const sortBtnRef = useRef<HTMLButtonElement | null>(null);

  /* scroll lock when drawer open (mobile) – same pattern as Trinnov */
  useEffect(() => {
    if (!mobileFilterOpen) return;
    if (typeof document === "undefined") return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const { style: htmlStyle } = document.documentElement;

    const prevOverflow = style.overflow;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevWidth = style.width;
    const prevHtmlOverflow = htmlStyle.overflow;

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    htmlStyle.overflow = "hidden";

    return () => {
      style.overflow = prevOverflow;
      style.position = prevPosition;
      style.top = prevTop;
      style.width = prevWidth;
      htmlStyle.overflow = prevHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [mobileFilterOpen]);

   useEffect(() => {
    if (typeof window !== "undefined") {
      setShowFilters(window.innerWidth >= 1024);
    }
  }, []);

  /* reset page when filters / search / sort change */
  useEffect(() => {
    setCurrentPage(0);
  }, [filters, search, sortKey]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    const paramsFilters = buildFiltersFromParams();
    if (!matchFilters(filtersRef.current, paramsFilters)) {
      setFilters(paramsFilters);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!urlSyncedRef.current) {
      urlSyncedRef.current = true;
      return;
    }

    const params = new URLSearchParams();
    filtersConfig.forEach(({ key }) => {
      (filters[key] || []).forEach((value) => {
        if (value) params.append(key, value);
      });
    });
    filters.series.forEach((value) => {
      if (value) params.append("series", value);
    });

    if (currentPage > 0) {
      params.set("page", String(currentPage + 1));
    }

    const query = params.toString();
    const newUrl = `${pathname}${query ? `?${query}` : ""}`;

    router.replace(newUrl, { scroll: false });
  }, [filters, currentPage, pathname, router]);

  /* close sort on outside click / escape */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!sortOpen) return;
      const target = e.target as Node;
      if (sortBtnRef.current && !sortBtnRef.current.contains(target)) {
        const menu = document.getElementById("sort-menu");
        if (menu && !menu.contains(target)) setSortOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSortOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [sortOpen]);

  /* filter + sort pipeline (same structure as Trinnov) */
  const productsList = useMemo(() => {
    const filtered = products.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchQ =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);

      if (!matchQ) return false;

      const matchesMain = filtersConfig.every(({ key }) => {
        const active = filters[key as FilterKey];
        const value = item[key as FilterKey] as any;
        return !active.length || active.includes(value);
      });

      const matchesSeries =
        !filters.series.length || filters.series.includes(item.series);

      return matchesMain && matchesSeries;
    });

    return [...filtered].sort(sorterFns[sortKey]);
  }, [filters, search, sortKey]);

  /* pagination */
  const totalPages = Math.ceil(productsList.length / itemsPerPage) || 1;
  const startIndex = currentPage * itemsPerPage;
  const displayed = productsList.slice(startIndex, startIndex + itemsPerPage);
  const paginationRange = getPaginationRange(currentPage, totalPages, 1);

  useEffect(() => {
    if (!hasPaginatedRef.current) {
      hasPaginatedRef.current = true;
      return;
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  /* motion */
  const listStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
  };
  const cardIn = {
    hidden: { opacity: 0, y: 26, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const toggleFilterValue = (key: FilterKey | "series", value: string) =>
    setFilters((prev) => {
      const cur = prev[key as keyof typeof prev] as string[];
      return {
        ...prev,
        [key]: cur.includes(value)
          ? cur.filter((v: string) => v !== value)
          : [...cur, value],
      };
    });

  const resetFilters = () => {
    setFilters({
      ...filtersConfig.reduce(
        (acc, f) => ({ ...acc, [f.key]: [] }),
        {} as any
      ),
      series: [],
    });
    setSearch("");
    setCurrentPage(0);
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleGroupExpansion = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  /* ---------- Filters Panel (shares shell with Trinnov) ---------- */
  const FiltersPanel = ({
    variant = "desktop",
  }: {
    variant?: "desktop" | "mobile";
  }) => {
    const isDesktop = variant === "desktop";

    return (
      <aside
        className={
          isDesktop
            ? "w-full max-w-[320px] space-y-4 sticky top-6 self-start"
            : "w-full space-y-6 pt-0"
        }
      >
        <div
          className={
            isDesktop
              ? "rounded-[10px] border border-black/[0.12] bg-white/95 divide-y divide-black/[0.08] shadow-[0_18px_48px_rgba(0,0,0,0.08)]"
              : "space-y-4"
          }
        >
          {/* Category group with nested series */}
          <m.div initial={false}>
            <m.button
              type="button"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => toggleGroupExpansion("Category")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-[14px] font-medium text-black">
                Category
              </span>
              <m.div
                animate={{ rotate: expandedGroups["Category"] ? 180 : 0 }}
                transition={{ duration: 0.18 }}
                className={
                  expandedGroups["Category"] ? "text-[#C4A777]" : "text-black/60"
                }
              >
                <IconChevron className="w-4 h-4" />
              </m.div>
            </m.button>

            <AnimatePresence initial={false}>
              {expandedGroups["Category"] && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                >
                  <div className="px-4 pb-3 pt-1 space-y-3">
                    {categoryGroups.map((group) => (
                      <div key={group.title} className="space-y-2">
                   <p className="text-[12px] text-black/70 flex items-center gap-2">
  {categoryIconByTitle[group.title]}
  <span>{group.title}</span>
</p>


                        <div className="space-y-1.5">
                          {group.categories.map((category) => {
                            const categorySeries =
                              seriesByCategory[category as SeriesKey] || [];
                            const categoryChecked =
                              filters.category.includes(category);
                            const isExpanded = expandedCategories[category];

                            const displayCategoryLabel =
                              group.categories.length === 1
                                ? `All ${group.title.toLowerCase()}`
                                : category;

                            return (
                              <div key={category} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  {isDesktop ? (
                                    <label className="flex cursor-pointer items-center gap-2.5 flex-1 rounded-md -mx-1 px-1 py-1 hover:bg-black/[0.03] transition-colors">
                                      <input
                                        type="checkbox"
                                        checked={categoryChecked}
                                        onChange={() =>
                                          toggleFilterValue(
                                            "category",
                                            category
                                          )
                                        }
                                        className="h-[22px] w-[22px] sm:h-[18px] sm:w-[18px] rounded-[3px] border border-black/60 bg-white accent-[#C4A777]"
                                      />
                                      <span className="text-[13px] text-black/85">
                                        {displayCategoryLabel}
                                      </span>
                                    </label>
                                  ) : (
                                    <label className="flex items-center gap-2.5 flex-1 rounded-md -mx-1 px-1 py-2 hover:bg-black/[0.03] active:bg-black/[0.06] transition-colors [touch-action:manipulation] cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={categoryChecked}
                                        onChange={() =>
                                          toggleFilterValue(
                                            "category",
                                            category
                                          )
                                        }
                                        className="sr-only"
                                      />
                                      <span
                                        className={`flex h-[22px] w-[22px] items-center justify-center rounded-[3px] border ${
                                          categoryChecked
                                            ? "border-[#C4A777] bg-[#C4A777]"
                                            : "border-black/60 bg-white"
                                        }`}
                                      >
                                        {categoryChecked && (
                                          <span className="h-2.5 w-2.5 rounded-[2px] bg-white" />
                                        )}
                                      </span>
                                      <span className="text-[13px] text-black/85 text-left">
                                        {displayCategoryLabel}
                                      </span>
                                    </label>
                                  )}

                                  {categorySeries.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleCategoryExpansion(category)
                                      }
                                      className="p-1 rounded-full hover:bg-black/5 transition-colors [touch-action:manipulation]"
                                      aria-label={`Toggle ${group.title} series`}
                                    >
                                      <m.div
                                        animate={{
                                          rotate: isExpanded ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.18 }}
                                        className={
                                          isExpanded
                                            ? "text-[#C4A777]"
                                            : "text-black/50"
                                        }
                                      >
                                        <IconChevron className="w-4 h-4" />
                                      </m.div>
                                    </button>
                                  )}
                                </div>

                                <AnimatePresence initial={false}>
                                  {isExpanded && categorySeries.length > 0 && (
                                    <m.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{
                                        duration: 0.22,
                                        ease: [0.04, 0.62, 0.23, 0.98],
                                      }}
                                      className="overflow-hidden ml-[1.75rem]"
                                    >
                                      <div className="space-y-1.5 pt-0.5 pl-[15px] border-l border-[#C4A777]/25">
                                        {categorySeries.map((series) => {
                                          const seriesChecked =
                                            filters.series.includes(series);
                                          const displayName =
                                            seriesDisplayNames[
                                              series as keyof typeof seriesDisplayNames
                                            ] || series;

                                          return (
                                            <div key={series}>
                                              {isDesktop ? (
                                                <label className="flex cursor-pointer items-center gap-2.5 rounded-md -mx-1 px-1 py-1 hover:bg-[#C4A777]/4 transition-colors">
                                                  <input
                                                    type="checkbox"
                                                    checked={seriesChecked}
                                                    onChange={() =>
                                                      toggleFilterValue(
                                                        "series",
                                                        series
                                                      )
                                                    }
                                                    className="h-[22px] w-[22px] sm:h-[18px] sm:w-[18px] rounded-[3px] border border-black/60 bg-white accent-[#C4A777]"
                                                  />
                                                  <span className="text-[12px] text-black/70">
                                                    {displayName}
                                                  </span>
                                                </label>
                                              ) : (
                                                <label className="flex cursor-pointer items-center gap-2.5 rounded-md -mx-1 px-1 py-2 hover:bg-[#C4A777]/4 active:bg-[#C4A777]/8 transition-colors [touch-action:manipulation]">
                                                  <input
                                                    type="checkbox"
                                                    checked={seriesChecked}
                                                    onChange={() =>
                                                      toggleFilterValue(
                                                        "series",
                                                        series
                                                      )
                                                    }
                                                    className="sr-only"
                                                  />
                                                  <span
                                                    className={`flex h-[20px] w-[20px] items-center justify-center rounded-[3px] border ${
                                                      seriesChecked
                                                        ? "border-[#C4A777] bg-[#C4A777]"
                                                        : "border-black/60 bg-white"
                                                    }`}
                                                  >
                                                    {seriesChecked && (
                                                      <span className="h-2 w-2 rounded-[2px] bg-white" />
                                                    )}
                                                  </span>
                                                  <span className="text-[12px] text-black/70 text-left">
                                                    {displayName}
                                                  </span>
                                                </label>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </m.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>

          {/* Power group */}
          <m.div initial={false}>
            <m.button
              type="button"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => toggleGroupExpansion("Power")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="inline-flex items-center gap-2 text-[14px] font-medium text-black">
                <IconPower className="w-3.5 h-3.5 text-[#C4A777]" />
                <span>Power</span>
              </span>
              <m.div
                animate={{ rotate: expandedGroups["Power"] ? 180 : 0 }}
                transition={{ duration: 0.18 }}
                className="text-black/60"
              >
                <IconChevron className="w-4 h-4" />
              </m.div>
            </m.button>

            <AnimatePresence initial={false}>
              {expandedGroups["Power"] && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                >
                  <div className="px-4 pb-3 pt-1 space-y-2">
                    {filtersConfig
                      .find((f) => f.key === "power")
                      ?.options.map((opt) => {
                        const checked = filters.power.includes(opt);
                        return (
                          <div key={opt}>
                            {isDesktop ? (
                              <label className="flex cursor-pointer items-center gap-3 py-1 rounded-md -mx-1 px-1 hover:bg-black/[0.03] transition-colors">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    toggleFilterValue("power", opt)
                                  }
                                  className="h-[22px] w-[22px] sm:h-[18px] sm:w-[18px] rounded-[3px] border border-black/60 bg-white accent-[#C4A777]"
                                />
                                <span className="text-[13px] text-black/85">
                                  {opt}
                                </span>
                              </label>
                            ) : (
                              <label className="flex cursor-pointer items-center gap-3 py-2 rounded-md -mx-1 px-1 hover:bg-black/[0.03] active:bg-black/[0.06] transition-colors [touch-action:manipulation]">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    toggleFilterValue("power", opt)
                                  }
                                  className="sr-only"
                                />
                                <span
                                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-[3px] border ${
                                    checked
                                      ? "border-[#C4A777] bg-[#C4A777]"
                                      : "border-black/60 bg-white"
                                  }`}
                                >
                                  {checked && (
                                    <span className="h-2.5 w-2.5 rounded-[2px] bg-white" />
                                  )}
                                </span>
                                <span className="text-[13px] text-black/85 text-left">
                                  {opt}
                                </span>
                              </label>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        </div>

        {isDesktop && (
          <button
            type="button"
            onClick={resetFilters}
            className="w-full h-11 rounded-full border border-black/60 text-[14px] font-medium text-black hover:bg-black/5 transition-colors"
          >
            Clear filters
          </button>
        )}
      </aside>
    );
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <main className="relative min-h-screen bg-transparent text-[#1A1A1A]">
        <section
          className="relative w-full max-w-[1440px] mx-auto px-4 pt-12 pb-10
                    sm:px-6 sm:pt-16 sm:pb-14
                    md:px-8
                    lg:px-10 lg:pt-24"
        >
          {/* Hero (aligned to Trinnov layout but keeps K-array identity) */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl flex flex-col gap-4 sm:gap-5 text-left"
          >
     


            <h1
              className={`${karrayHeroFont.className} text-[clamp(2.4rem,6vw,4.3rem)] font-light leading-[1.02] tracking-[-0.02em] text-[#1A1A1A]`}
            >
              K-ARRAY Products
            </h1>

            <p className="text-[0.95rem] sm:text-[1.02rem] lg:text-[1.06rem] leading-[1.8] text-[rgba(26,26,26,0.7)] max-w-3xl">
              Architectural, touring, and lounge-ready K-array speaker,
              monitor, subwoofer and systems families are curated here. Filter
              by category, power, or series to jump between subtopics like
              Lyzard, Vyper, Rumble, Mastiff, and Azimut.
            </p>
          </m.div>

          {/* Layout (same shell as Trinnov) */}
          <div
            className={`mt-4 sm:mt-6 lg:mt-8 ${
              showFilters
                ? "lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 xl:gap-8"
                : ""
            }`}
          >
            {/* Toolbar - spans full width (Trinnov-style) */}
            <div className="sticky top-6 z-[60] bg-[#f9f7f2]/95 backdrop-blur border-y border-black/[0.05] -mx-4 sm:-mx-6 md:-mx-12 lg:mx-0 lg:border lg:rounded-[12px] lg:border-black/[0.08] lg:col-span-2">
              <div className="flex h-12 lg:h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] lg:text-[15px] font-semibold tracking-[-0.01em] text-black/90">
                    K-array Collection
                  </span>
                  <span className="text-[11px] lg:text-[12px] text-black/50">
                    - {productsList.length} items
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Toggle filters"
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        window.innerWidth < 1024
                      ) {
                        setMobileFilterOpen(true);
                      } else {
                        setShowFilters((v) => !v);
                      }
                    }}
                    className="inline-flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full transition-all hover:bg-black/[0.05] text-[#C4A777]"
                  >
                    <IconFilter className="text-inherit" />
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      ref={sortBtnRef}
                      aria-label="Sort products"
                      onClick={() => setSortOpen((v) => !v)}
                      className={`inline-flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full transition-all ${
                        sortOpen
                          ? "bg-[#C4A777]/10 text-[#C4A777] hover:bg-[#C4A777]/15"
                          : "hover:bg-black/[0.05] text-[#C4A777]"
                      }`}
                    >
                      <ArrowsDownUp size={18} weight="regular" />
                    </button>

                    <AnimatePresence>
                      {sortOpen && (
                        <m.div
                          id="sort-menu"
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full right-0 mt-2 w-52 rounded-[16px] bg-white border border-black/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.12)] overflow-hidden z-[70]"
                        >
                          <div className="py-2">
                            {sortOptions.map((option) => {
                              const isActive = sortKey === option.key;
                              return (
                                <button
                                  key={option.key}
                                  onClick={() => {
                                    setSortKey(option.key as any);
                                    setSortOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                                    isActive
                                      ? "bg-[#C4A777]/5 text-[#C4A777]"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <div className="flex-shrink-0">
                                    <div
                                      className={`w-4 h-4 rounded-full border transition-all ${
                                        isActive
                                          ? "border-[#C4A777] border-2"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {isActive && (
                                        <div className="w-full h-full rounded-full bg-[#C4A777] scale-50" />
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-[14px] font-medium">
                                    {option.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters sidebar (desktop) */}
            {showFilters && (
              <div className="hidden lg:block pt-4">
                <FiltersPanel variant="desktop" />
              </div>
            )}

            {/* Right: products + pagination (same structure as Trinnov) */}
            <div className="space-y-6 sm:space-y-8 pt-4">
              {/* Products grid */}
              <m.div
                key={`${search}-${sortKey}-${JSON.stringify(
                  filters
                )}-${currentPage}`}
                variants={listStagger}
                initial="hidden"
                animate="show"
                className={gridWrapperClasses}
              >
                {displayed.map((item) => {
                  const { title, subtitle } = getDisplayParts(
                    item.name,
                    item.series
                  );

                  return (
                    <m.article
                      key={item.slug}
                      variants={cardIn}
                      layout
                      className="group/card relative flex h-full flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_16px_40px_rgba(26,26,26,0.08)] sm:shadow-[0_20px_60px_rgba(26,26,26,0.10)] lg:shadow-[0_26px_80px_rgba(26,26,26,0.12)] transition-shadow duration-500 touch-manipulation"
                    >
                  <Link
  href={`/products/k-array/${item.slug}`}
  className="group relative block w-full bg-white touch-manipulation active:scale-[0.98] transition-transform overflow-hidden aspect-[16/9]"
>

                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                          className="object-contain object-top transition-transform duration-700 group-hover:scale-105 group-active:scale-95 group-hover/card:scale-105 group-active/card:scale-95"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col px-5 sm:px-6 lg:px-9 pt-3 sm:pt-4 lg:pt-5 pb-16 sm:pb-18 lg:pb-20 text-left">
                        <div className="max-w-[30rem]">
                          <h2
                            className={`${karrayProductFont.className} text-[1.8rem] sm:text-[2rem] lg:text-[2.35rem] leading-[1.05] font-light text-[#1A1A1A]`}
                          >
                            <Link
                              href={`/products/k-array/${item.slug}`}
                              className="bg-clip-text text-transparent bg-gradient-to-b from-[#1A1A1A] to-[#1A1A1A]/70 hover:opacity-80 touch-manipulation active:scale-95 transition-transform inline-block"
                            >
                              {title}
                            </Link>
                          </h2>

                          <p className="mt-2 sm:mt-3 text-[0.75rem] sm:text-[0.8rem] lg:text-[0.9rem] tracking-[0.20em] sm:tracking-[0.24em] lg:tracking-[0.28em] uppercase text-[rgba(26,26,26,0.6)]">
                            {subtitle}
                          </p>

                          <p className="mt-3 sm:mt-4 lg:mt-5 text-[0.9rem] sm:text-[0.95rem] lg:text-[1rem] leading-[1.9] text-[rgba(26,26,26,0.68)]">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <m.div
                        className="absolute bottom-6 right-4 sm:bottom-7 sm:right-5 lg:bottom-8 lg:right-6 flex gap-2 opacity-80 group-hover/card:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChampagneArrow
                          href={`/products/k-array/${item.slug}`}
                          label={`View ${item.name}`}
                        />
                      </m.div>
                    </m.article>
                  );
                })}
              </m.div>

              {/* Pagination (same style as Trinnov) */}
              <div className="flex flex-col items-center gap-3 pt-2">
                {totalPages > 1 && (
                  <div className="flex items-center gap-3">
                    <m.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentPage === 0}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-medium transition-all touch-manipulation ${
                        currentPage === 0
                          ? "text-[#7d7469] bg-gray-100 cursor-not-allowed"
                          : "text-[#1A1A1A] bg-white/80 hover:bg-white shadow-sm hover:shadow-md border border-black/5"
                      }`}
                    >
                      <IconArrowLeft className="w-4 h-4" />
                      <span className="hidden xs:inline">Previous</span>
                    </m.button>

                    <div className="flex items-center gap-2">
                      {paginationRange.map((item, idx) => {
                        if (item === DOTS) {
                          const isLeftDots =
                            idx > 0 && paginationRange[idx - 1] === 0;
                          const isRightDots =
                            idx < paginationRange.length - 1 &&
                            paginationRange[idx + 1] === totalPages - 1;

                          const handleDotsClick = () => {
                            setCurrentPage((prev) => {
                              if (isLeftDots) {
                                return Math.max(prev - 3, 0);
                              }
                              if (isRightDots) {
                                return Math.min(
                                  prev + 3,
                                  totalPages - 1
                                );
                              }
                              return prev;
                            });
                          };

                          return (
                            <button
                              key={`dots-${idx}`}
                              type="button"
                              onClick={handleDotsClick}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-[14px] text-[#7d7469] bg-transparent hover:bg-black/[0.04] hover:text-[#1A1A1A] cursor-pointer"
                            >
                              ...
                            </button>
                          );
                        }

                        const pageIndex = item as number;
                        const isActive = pageIndex === currentPage;

                        return (
                          <button
                            key={pageIndex}
                            onClick={() => setCurrentPage(pageIndex)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-[14px] font-medium transition-all touch-manipulation ${
                              isActive
                                ? "bg-[#C4A777] text-white shadow-sm"
                                : "bg-white/80 text-[#1A1A1A] hover:bg-white border border-black/5"
                            }`}
                          >
                            {pageIndex + 1}
                          </button>
                        );
                      })}
                    </div>

                    <m.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages - 1, prev + 1)
                        )
                      }
                      disabled={currentPage === totalPages - 1}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-medium transition-all touch-manipulation ${
                        currentPage === totalPages - 1
                          ? "text-[#7d7469] bg-gray-100 cursor-not-allowed"
                          : "text-[#1A1A1A] bg-white/80 hover:bg-white shadow-sm hover:shadow-md border border-black/5"
                      }`}
                    >
                      <span className="hidden xs:inline">Next</span>
                      <IconArrowRight className="w-4 h-4" />
                    </m.button>
                  </div>
                )}

                <div className="text-[13px] text-[#7d7469] text-center">
                  {productsList.length === 0 ? (
                    <>No K-array products found</>
                  ) : (
                    <>
                      Showing {startIndex + 1}-
                      {Math.min(
                        startIndex + itemsPerPage,
                        productsList.length
                      )}{" "}
                      of {productsList.length}
                    </>
                  )}
                </div>
              </div>

              {!productsList.length && (
                <div className="rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-white/70 px-4 sm:px-6 py-8 sm:py-10 text-center text-[0.85rem] sm:text-sm text-[rgba(26,26,26,0.6)] shadow">
                  No K-array speakers match the current filters. Adjust your
                  selection or{" "}
                  <Link
                    href="/contact"
                    className="text-[#C4A777] underline underline-offset-4"
                  >
                    speak with our concierge
                  </Link>
                  .
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mobile Filter Drawer – same behaviour & style as Trinnov page */}
        <AnimatePresence mode="wait">
          {mobileFilterOpen && (
            <m.div
              key="mobile-filter-drawer"
              className="fixed inset-0 z-[9999] overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Backdrop */}
              <m.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setMobileFilterOpen(false)}
              />

              {/* Drawer */}
              <div className="absolute inset-0 flex justify-end">
                <m.div
                  className="relative h-full w-full max-w-none sm:max-w-[420px] flex flex-col bg-white shadow-[0_20px_80px_rgba(0,0,0,0.4)] will-change-transform"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "translate3d(0,0,0)",
                  }}
                >
                  <div className="relative overflow-hidden bg-gradient-to-r from-[#C4A777] to-[#B8964A] px-6 py-5">
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
                            K-array Filters
                          </span>
                        </div>
                        <h3 className="text-[17px] font-semibold text-white tracking-[-0.01em]">
                          Refine Your Selection
                        </h3>
                        <p className="text-[12px] text-white/70">
                          {productsList.length} products available
                        </p>
                      </div>
                      <m.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMobileFilterOpen(false)}
                        aria-label="Close filters"
                        className="relative group p-2.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg:white/30 transition-all duration-200"
                      >
                        <IconClose className="w-5 h-5 text-white" />
                        <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-200" />
                      </m.button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-white/10 rounded-full blur-xl" />
                  </div>

                  <div
                    className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8 pt-6 bg-gradient-to-b from-white to-[#faf9f7]"
                    data-drawer-content
                  >
                    <div className="mb-6">
                      <div className="relative">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search K-array products..."
                          className="w-full rounded-2xl bg-white border border-black/[0.08] pl-10 pr-4 py-3 text-[14px] text-black/85 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#C4A777]/40 focus:border-[#C4A777]/30 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <FiltersPanel variant="mobile" />
                  </div>

                  <div className="border-t border-black/[0.08] bg-white px-6 py-4">
                    <div className="flex gap-3">
                      <m.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={resetFilters}
                        className="flex-1 rounded-[16px] border border-gray-300 bg-white px-4 py-3 text-[14px] font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                      >
                        Clear Filter
                      </m.button>

                      <m.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMobileFilterOpen(false)}
                        className="flex-1 rounded-[16px] bg-gradient-to-r from-[#C4A777] to-[#B8964A] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(196,167,119,0.3)] hover:shadow-[0_6px_20px_rgba(196,167,119,0.4)] transition-all duration-200"
                      >
                        Apply Filter
                      </m.button>
                    </div>
                  </div>
                </m.div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </main>
    </LazyMotion>
  );
}
