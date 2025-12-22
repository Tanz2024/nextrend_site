// app/products/brionvega/page.tsx
// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LazyMotion, AnimatePresence, m } from "framer-motion";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { Bodoni_Moda, Playfair_Display } from "next/font/google";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { brionvegaProducts } from "./data";

const loadMotionFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

/* ---------- fonts ---------- */
const brionvegaHeroFont = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const brionvegaProductFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* ---------- helpers ---------- */
const getDisplayParts = (name: string, series: string) => {
  const title = (name.split(" - ").pop() || name).trim();
  return { title, subtitle: series?.toUpperCase() ?? "" };
};

const unique = (values: (string | null | undefined)[]) =>
  Array.from(new Set(values.filter(Boolean))) as string[];

const products = brionvegaProducts.map((product) => ({
  slug: product.slug,
  name: product.name,
  description: product.description,
  series: product.series,
  collaboration: product.collaboration,
  image: product.image,
  colors: (
    product.finishes?.map((finish) => finish.name) ?? []
  ).filter(Boolean),
}));

const seriesOptions = unique(products.map((p) => p.series));
const collaborationOptions = unique(products.map((p) => p.collaboration));

const FILTER_KEYS = ["series", "color", "collaboration"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

const sorterFns: Record<
  string,
  (a: (typeof products)[number], b: (typeof products)[number]) => number
> = {
  recommended: () => 0,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  series: (a, b) =>
    (a.series || "").localeCompare(b.series || "") ||
    a.name.localeCompare(b.name),
};

const sortOptions = [
  {
    key: "recommended",
    label: "Recommended",
    description: "Curated Brionvega order",
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

/* ---------- icons (same pattern as Amina) ---------- */
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
    <circle cx="16" cy="6" r="2.5" fill="none" stroke="#C4A777" strokeWidth="2" />

    <line
      x1="3"
      y1="12"
      x2="21"
      y2="12"
      stroke="#C4A777"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="8" cy="12" r="2.5" fill="none" stroke="#C4A777" strokeWidth="2" />

    <line
      x1="3"
      y1="18"
      x2="21"
      y2="18"
      stroke="#C4A777"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="13" cy="18" r="2.5" fill="none" stroke="#C4A777" strokeWidth="2" />
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

const IconSeriesHeader = ({ className, ...p }: any) => (
  <svg viewBox="0 0 20 20" width="18" height="18" className={className} {...p}>
    <rect x="2" y="4" width="11" height="1.6" rx="0.8" fill="currentColor" />
    <rect x="2" y="8" width="8" height="1.6" rx="0.8" fill="currentColor" />
    <rect x="2" y="12" width="6" height="1.6" rx="0.8" fill="currentColor" />
    <path
      d="M16 5.5L13.7 7.8 16 10.1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconColorHeader = ({ className, ...p }: any) => (
  <svg viewBox="0 0 20 20" width="18" height="18" className={className} {...p}>
    <rect
      x="3"
      y="4"
      width="5"
      height="12"
      rx="1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <rect
      x="10"
      y="6"
      width="6.5"
      height="8"
      rx="1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M4.5 6.5h2m-2 3.5h2m-2 3.5h2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

/* collaboration icon – two linked circles */
const IconCollabHeader = ({ className, ...p }: any) => (
  <svg
    viewBox="0 0 20 20"
    width="18"
    height="18"
    className={className}
    {...p}
  >
    <circle
      cx="7"
      cy="10"
      r="3.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <circle
      cx="13"
      cy="10"
      r="3.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M8.5 6.8c.5-.5 1.2-.8 2-.8s1.5.3 2 .8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const filterHeaderIcons: any = {
  series: IconSeriesHeader,
  color: IconColorHeader,
  collaboration: IconCollabHeader,
};

const filterTitles: Record<FilterKey, string> = {
  series: "Series",
  color: "Colour",
  collaboration: "Collaboration",
};

const buildFiltersConfig = (colorOptions: string[]) => [
  {
    key: "series" as const,
    title: filterTitles.series,
    options: seriesOptions,
  },
  {
    key: "color" as const,
    title: filterTitles.color,
    options: colorOptions,
  },
  {
    key: "collaboration" as const,
    title: filterTitles.collaboration,
    options: collaborationOptions,
  },
];

const matchFilters = (
  values: Record<FilterKey, string[]>,
  target: Record<FilterKey, string[]>
) =>
  FILTER_KEYS.every((key) => {
    const current = values[key] ?? [];
    const next = target[key] ?? [];
    if (current.length !== next.length) return false;
    return current.every((value, index) => value === next[index]);
  });

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

/* ---------- Champagne CTA ---------- */
function ChampagneArrow({ href, label }: { href: string; label: string }) {
  return (
    <m.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
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

/* ---------- pagination helper (same as Amina) ---------- */
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
    if (windowStart > firstPage + 1) pages.push(DOTS);
  }

  for (let i = windowStart; i <= windowEnd; i++) {
    pages.push(i);
  }

  if (windowEnd < lastPage) {
    if (windowEnd < lastPage - 1) pages.push(DOTS);
    pages.push(lastPage);
  }

  return pages;
}

/* ---------- page ---------- */
export default function BrionvegaCollection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const buildFiltersFromParams = () =>
    FILTER_KEYS.reduce((acc, key) => {
      const values = searchParams.getAll(key);
      return { ...acc, [key]: values };
    }, {} as Record<FilterKey, string[]>);

  const getInitialPageFromParams = () => {
    const pageParam = searchParams.get("page");
    if (!pageParam) return 0;
    const numeric = Number(pageParam);
    if (!Number.isNaN(numeric) && numeric > 0) {
      return numeric - 1;
    }
    return 0;
  };

  const [filters, setFilters] = useState<Record<FilterKey, string[]>>(
    buildFiltersFromParams
  );
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen] = useState(false); // reserved
  const [sortKey, setSortKey] =
    useState<keyof typeof sorterFns>("recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(getInitialPageFromParams);

  const itemsPerPage = 6;
  const hasPaginatedRef = useRef(false);
  const urlSyncedRef = useRef(false);
  const filtersRef = useRef(filters);

  const colorOptions = useMemo(() => {
    const selectedSeries = new Set(filters.series);

    const optionsMap = new Map<string, number>();
    brionvegaProducts.forEach((product) => {
      if (!product.finishes?.length) return;
      if (selectedSeries.size && !selectedSeries.has(product.series)) return;
      product.finishes.forEach((finish) => {
        if (!finish?.name) return;
        if (!optionsMap.has(finish.name)) {
          optionsMap.set(finish.name, finish.order ?? optionsMap.size);
        }
      });
    });

    return Array.from(optionsMap.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([name]) => name);
  }, [filters.series]);

  const filtersConfig = useMemo(
    () => buildFiltersConfig(colorOptions),
    [colorOptions]
  );

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    [filterTitles.series]: true,
    [filterTitles.color]: true,
    [filterTitles.collaboration]: true,
  });

  const sortBtnRef = useRef<HTMLButtonElement | null>(null);

  /* scroll lock when drawer open (mobile) – same as Amina */
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

  /* desktop: show filters by default */
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowFilters(window.innerWidth >= 1024);
    }
  }, []);

  /* reset page when search / filters / sort change */
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

  /* filter + sort pipeline (same structure as Amina) */
  const productsList = useMemo(() => {
    const filtered = products.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchQ =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);

      if (!matchQ) return false;

      const matchesMain = filtersConfig.every(({ key }) => {
        const active = filters[key];
        if (!active.length) return true;
        if (key === "color") {
          const colors = (item as any).colors ?? [];
          return active.every((value) => colors.includes(value));
        }
        const value = (item as any)[key];
        return !!value && active.includes(value as string);
      });

      return matchesMain;
    });

    return [...filtered].sort(sorterFns[sortKey]);
  }, [filters, search, sortKey]);

  /* pagination */
  const totalPages = Math.ceil(productsList.length / itemsPerPage) || 1;
  const startIndex = currentPage * itemsPerPage;
  const displayed = productsList.slice(startIndex, startIndex + itemsPerPage);
  const paginationRange = getPaginationRange(currentPage, totalPages, 1);

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

  const toggleFilterValue = (key: FilterKey, value: string) =>
    setFilters((prev) => {
      const cur = prev[key];
      return {
        ...prev,
        [key]: cur.includes(value)
          ? cur.filter((v) => v !== value)
          : [...cur, value],
      };
    });

  const resetFilters = () => {
    setFilters(
      filtersConfig.reduce(
        (acc, f) => ({ ...acc, [f.key]: [] }),
        {} as Record<FilterKey, string[]>
      )
    );
    setSearch("");
    setCurrentPage(0);
  };

  const toggleGroupExpansion = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  /* scroll to top when changing page (but not on first load) */
  useEffect(() => {
    if (!hasPaginatedRef.current) {
      hasPaginatedRef.current = true;
      return;
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  /* ---------- Filters Panel ---------- */
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
          {filtersConfig.map((f) => {
            if (!f.options.length) return null;
            const HeaderIcon = filterHeaderIcons[f.key as FilterKey];

            return (
              <m.div key={f.key} initial={false}>
                <m.button
                  type="button"
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => toggleGroupExpansion(f.title)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="inline-flex items-center gap-2 text-[14px] font-medium text-black">
                    {HeaderIcon && (
                      <HeaderIcon className="w-4 h-4 text-[#C4A777]" />
                    )}
                    <span>{f.title}</span>
                  </span>
                  <m.div
                    animate={{ rotate: expandedGroups[f.title] ? 180 : 0 }}
                    transition={{ duration: 0.18 }}
                    className={
                      expandedGroups[f.title] ? "text-[#C4A777]" : "text-black/60"
                    }
                  >
                    <IconChevron className="w-4 h-4" />
                  </m.div>
                </m.button>

                <AnimatePresence initial={false}>
                  {expandedGroups[f.title] && (
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
                        {f.options.map((opt) => {
                          const checked = filters[f.key as FilterKey].includes(
                            opt
                          );
                          return (
                            <div key={opt}>
                              {isDesktop ? (
                                <label className="flex cursor-pointer items-center gap-3 py-1 rounded-md -mx-1 px-1 hover:bg-black/[0.03] transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                      toggleFilterValue(f.key as FilterKey, opt)
                                    }
                                    className="h-[22px] w-[22px] sm:h-[18px] sm:w-[18px] rounded-[3px] border border-black/60 bg-white accent-[#C4A777]"
                                  />
                           <span className="text-[13px] leading-[1.55] tracking-[0.01em] text-black/75">

                                    {opt}
                                  </span>
                                </label>
                              ) : (
                                <label className="flex cursor-pointer items-center gap-3 py-2 rounded-md -mx-1 px-1 hover:bg-black/[0.03] active:bg-black/[0.06] transition-colors [touch-action:manipulation]">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                      toggleFilterValue(f.key as FilterKey, opt)
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
            );
          })}
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

  /* grid classes – same as Amina (1–2 cols) */
  const gridWrapperClasses =
    "grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 md:grid-cols-2";

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <main className="relative min-h-screen bg-transparent text-[#1A1A1A]">
        <section
          className="relative w-full max-w-[1440px] mx-auto px-4 pt-12 pb-10
                    sm:px-6 sm:pt-16 sm:pb-14
                    md:px-8
                    lg:px-10 lg:pt-20"
        >
          {/* Hero (same layout as Amina) */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  className="max-w-[62ch] flex flex-col gap-3 sm:gap-4 text-left"

          >
    

            <h1
              className={`${brionvegaHeroFont.className} text-[clamp(2.4rem,6vw,4.3rem)] font-light leading-[1.02] tracking-[-0.02em] text-[#1A1A1A]`}
            >
              BRIONVEGA Products
            </h1>

        <p className="text-[0.95rem] sm:text-[1.02rem] lg:text-[1.06rem] leading-[1.7] tracking-[0.01em] text-black/60 max-w-[60ch]">

              Limited re-issues, design collaborations, and Italian audio icons
              selected from brionvega.it for Malaysian living spaces. Explore
              by series, finish, or collaboration.
            </p>
          </m.div>

          {/* Layout */}
          <div
            className={`mt-4 sm:mt-6 lg:mt-8 ${
              showFilters
                ? "lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 xl:gap-8"
                : ""
            }`}
          >
            {/* Toolbar (same structure as Amina) */}
            <div className="sticky top-6 z-[60] bg-[#f9f7f2]/90 backdrop-blur border-y border-black/[0.05] -mx-4 sm:-mx-6 md:-mx-12 lg:mx-0 lg:border lg:rounded-[12px] lg:border-black/[0.08] lg:col-span-2">
              <div className="flex h-12 lg:h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-6">
                <div className="flex items-baseline gap-2">
    <span className="text-[14px] sm:text-[15px] lg:text-[17px] xl:text-[18px] font-semibold tracking-[-0.015em] text-black/85">
  Brionvega Collection
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

            {/* Right: products + pagination */}
            <div className="space-y-6 sm:space-y-8 pt-4">
              {/* Products grid */}
              <m.div
                key={`${search}-${sortKey}-${JSON.stringify(filters)}-${currentPage}`}
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
  href={`/products/brionvega/${item.slug}`}
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
                            className={`${brionvegaProductFont.className} text-[1.8rem] sm:text-[2rem] lg:text-[2.35rem] leading-[1.05] font-light text-[#1A1A1A]`}
                          >
                            <Link
                              href={`/products/brionvega/${item.slug}`}
                             className="text-[#1A1A1A] hover:text-black/80 transition-colors inline-block"

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
                          href={`/products/brionvega/${item.slug}`}
                          label={`View ${item.name}`}
                        />
                      </m.div>
                    </m.article>
                  );
                })}
              </m.div>

              {/* Pagination (same pattern as Amina) */}
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
                          : "text-[#1A1A1A] bg-white/80 hover:bg:white shadow-sm hover:shadow-md border border-black/5"
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
                                : "bg-white/80 text-[#1A1A1A] hover:bg:white border border-black/5"
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
                          : "text-[#1A1A1A] bg-white/80 hover:bg:white shadow-sm hover:shadow-md border border-black/5"
                      }`}
                    >
                      <span className="hidden xs:inline">Next</span>
                      <IconArrowRight className="w-4 h-4" />
                    </m.button>
                  </div>
                )}

                <div className="text-[13px] text-[#7d7469] text-center">
                  {productsList.length === 0 ? (
                    <>No Brionvega products found</>
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
                  No Brionvega editions match the current filters. Adjust your
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

        {/* Mobile Filter Drawer (same shell as Amina) */}
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
                            Brionvega Filters
                          </span>
                        </div>
                        <h3 className="text-[17px] font-semibold text-white tracking-[-0.01em]">
                          Refine Audio Atelier
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
                          placeholder="Search Brionvega products..."
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
