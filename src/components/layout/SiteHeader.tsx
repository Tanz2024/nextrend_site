"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { TOP_SEARCH_TERMS, type TopSearchTerm } from "@/app/search/topSearchTerms";
import { buildGeneralImageUrl } from "@/lib/assets";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});
type SubItem = {
  title: string;
  desc?: string;
  href: string;
  tag?: string;
};

type NavItem = {
  label: string;
  href: string;
  submenu?: SubItem[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "HOME", href: "/" },
  {
    label: "Products",
    href: "/products",
    submenu: [
      {
        title: "K-array",
        desc: "High-performance, design-led Italian loudspeaker systems.",
        href: "/products/k-array",
      },
      {
        title: "Brionvega",
        desc: "Iconic Italian radios and audio objects that double as sculpture.",
        href: "/products/brionvega",
      },
      {
        title: "Amina Invisible Speakers",
        desc: "Architecture-integrated speakers that vanish into the room.",
        href: "/products/amina",
      },
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    submenu: [
      {
        title: "Gordon Ramsay Bar & Grill",
        desc: "Signature dining, tuned for intimacy and presence.",
        href: "/projects/gordon-ramsay-bar-grill",
      },
      {
        title: "PARKROYAL COLLECTION Kuala Lumpur",
        desc: "Luxury hotel audio zoning across lounges and suites.",
        href: "/projects/parkroyal-collection",
      },
      {
        title: "Desa ParkCity Integrated Luxury Home",
        desc: "Discrete whole-home Atmos and architectural listening.",
        href: "/projects/desa-parkcity-integrated-luxury-home",
      },
    ],
  },
  {
    label: "Events",
    href: "/events",
    submenu: [
      {
        title: "Robb Report × AHAM Capital",
        desc: "Curated sound for Malaysia’s premier luxury lifestyle event.",
        href: "/events/robb-report-aham",
        tag: "Exclusive",
      },
      {
        title: "Brionvega at FIND Singapore 2024",
        desc: "Italian design and modern audio at Asia's top design fair.",
        href: "/events/brionvega-find",
      },
      {
        title: "Suara Festival Bali",
        desc: "Seven immersive stages along Nyanyi Beach, Bali.",
        href: "/events/suara-festival",
      },
    ],
  },
];

const MAX_MOBILE_PREVIEW = 3;
const SCROLL_HIDE_THRESHOLD = 120;
const SCROLL_HIDE_DELTA = 10;
const SCROLL_SHOW_DELTA = 0;
const HEADER_VISIBLE_SHADOW = "shadow-[0_25px_70px_rgba(0,0,0,0.25)]";
const HEADER_HIDDEN_SHADOW = "shadow-[0_8px_20px_rgba(0,0,0,0.06)]";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSections, setOpenMobileSections] = useState<
    Record<string, boolean>
  >({});
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


 // Premium scroll-based header visibility (Sonos-style)
const [hideHeader, setHideHeader] = useState(false);
const [isMobileViewport, setIsMobileViewport] = useState(false);

const hideRef = useRef(false);
useEffect(() => {
  hideRef.current = hideHeader;
}, [hideHeader]);

// Detect mobile viewport (keep your existing one if you like)
useEffect(() => {
  const checkViewport = () => setIsMobileViewport(window.innerWidth < 1024);
  checkViewport();
  window.addEventListener("resize", checkViewport);
  return () => window.removeEventListener("resize", checkViewport);
}, []);

// Sonos behavior:
// - If header is hidden: any scroll UP shows it immediately.
// - If header is visible: small committed scroll DOWN hides it (buffered to avoid flicker).
useEffect(() => {
  if (typeof window === "undefined") return;

  // ✅ IMPORTANT: If your page uses an inner scrolling container,
  // put `data-scroll-container` on THAT element (see section 3).
  const scrollEl = document.querySelector("[data-scroll-container]") as HTMLElement | null;

  const isWindowScroll = !scrollEl;
  const getY = () => (isWindowScroll ? window.scrollY : scrollEl!.scrollTop);
  const listenTarget: EventTarget = isWindowScroll ? window : scrollEl!;

const SHOW_NEAR_TOP = 100; // Always show header near top
const JITTER = 5;          // Ignore micro-movements
const HIDE_DOWN = 50;      // Hide after committed scroll down


  let raf = 0;
  let lastY = getY();
  let downAcc = 0;

  const show = () => {
    if (hideRef.current) {
      hideRef.current = false;
      setHideHeader(false);
    }
    downAcc = 0;
  };

  const hide = () => {
    if (!hideRef.current) {
      hideRef.current = true;
      setHideHeader(true);
    }
    downAcc = 0;
  };

  const evaluate = () => {
    const y = getY();
    const dy = y - lastY;

    // Keep header visible when overlays are open
    if (mobileOpen || searchOpen) {
      show();
      lastY = y;
      raf = 0;
      return;
    }

    // Always visible near top
    if (y < SHOW_NEAR_TOP) {
      show();
      lastY = y;
      raf = 0;
      return;
    }

    // Ignore micro noise
    if (Math.abs(dy) <= JITTER) {
      lastY = y;
      raf = 0;
      return;
    }

    // ✅ KEY FIX: if hidden, ANY upward intent shows (middle-of-page works)
    if (hideRef.current && dy < 0) {
      show();
      lastY = y;
      raf = 0;
      return;
    }

    // If visible, hide only after a small committed down scroll
    if (!hideRef.current) {
      if (dy > 0) {
        downAcc += dy;
        if (downAcc > HIDE_DOWN) hide();
      } else {
        downAcc = 0;
      }
    }

    lastY = y;
    raf = 0;
  };

  const onScroll = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(evaluate);
  };

  listenTarget.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    listenTarget.removeEventListener("scroll", onScroll as EventListener);
    if (raf) cancelAnimationFrame(raf);
  };
}, [mobileOpen, searchOpen]);

  // active route
  const activeHref = useMemo(() => {
    if (!pathname) return "/";
    const match = NAV_ITEMS.find((item) => {
      if (item.href === "/") return pathname === "/";
      return pathname.startsWith(item.href);
    });
    return match?.href ?? "/";
  }, [pathname]);

  const mobileNavItems = useMemo(
    () => NAV_ITEMS.filter((item) => item.href !== "/"),
    [],
  );

  const openMobile = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setOpenMobileSections({});
  }, []);

  // Prevent touch scrolling on mobile overlay
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Allow touch scrolling within the drawer content
    const target = e.target as HTMLElement;
    const drawerContent = target.closest('[data-drawer-content]');
    
    if (!drawerContent) {
      e.preventDefault();
    }
  }, []);

  const toggleMobileSection = useCallback((href: string) => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  }, []);

  // lock page scroll when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      return;
    }

    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Store original styles
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPaddingRight = document.body.style.paddingRight;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyLeft = document.body.style.left;
    const prevBodyRight = document.body.style.right;
    const prevBodyWidth = document.body.style.width;

    // Apply comprehensive scroll lock for mobile
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "0px";
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      // Restore original styles
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevBodyPaddingRight;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.left = prevBodyLeft;
      document.body.style.right = prevBodyRight;
      document.body.style.width = prevBodyWidth;
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  // desktop hover dropdown
  const handleEnter = useCallback((key: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoverMenu(key);
  }, []);

  const handleLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setHoverMenu(null);
    }, 120);
  }, []);

  // search ribbon
  const openSearchRibbon = useCallback(() => {
    setSearchOpen(true);
    setMobileOpen(false);
    setOpenMobileSections({});
  }, []);

  const closeSearchRibbon = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);
// Close search on ESC
useEffect(() => {
  if (!searchOpen) return;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeSearchRibbon();
  };

  window.addEventListener("keydown", onKeyDown as any);
  return () => window.removeEventListener("keydown", onKeyDown as any);
}, [searchOpen, closeSearchRibbon]);

// Close search when clicking outside the ribbon
const searchPanelRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (!searchOpen) return;

  const onPointerDown = (e: MouseEvent | PointerEvent) => {
    const el = searchPanelRef.current;
    if (!el) return;
    if (!el.contains(e.target as Node)) closeSearchRibbon();
  };

  document.addEventListener("pointerdown", onPointerDown, { capture: true });
  return () =>
    document.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);
}, [searchOpen, closeSearchRibbon]);

const executeSearch = useCallback(
  (value?: string | null) => {
    const trimmedValue = value?.trim();
    if (!trimmedValue) return;

    router.push(`/search?q=${encodeURIComponent(trimmedValue)}`);

    // On mobile: close ribbon + drawer and clear field
    if (isMobileViewport) {
      setSearchOpen(false);
      setMobileOpen(false);
      setSearchQuery("");
    }
  },
  [router, isMobileViewport, setSearchOpen, setMobileOpen, setSearchQuery]
);



  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      executeSearch(searchQuery);
    },
    [executeSearch, searchQuery]
  );

  const handleTopSearchClick = useCallback(
    (term: TopSearchTerm) => {
      executeSearch(term.query);
    },
    [executeSearch]
  );

  return (
    <>
    {/* HEADER + DESKTOP NAV */}
<header className="relative z-[1000]">
  
  {/* MAIN BAR */}
<div
  className={`fixed top-0 left-0 right-0 z-[1100] border-b border-[var(--border-color-soft)]/70 bg-white shadow-black/10 backdrop-blur-[30px] transform-gpu transition-[transform,opacity,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform ${
    hideHeader ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
  } ${hideHeader ? HEADER_HIDDEN_SHADOW : HEADER_VISIBLE_SHADOW}`}
>

    <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center px-3 sm:h-18 sm:px-4 md:h-20 xl:px-8">
      {/* MOBILE BAR – menu / logo / search */}

        
<div className="relative flex w-full items-center justify-between lg:hidden">
  {/* burger left (no border) */}
  <button
    type="button"
    onClick={mobileOpen ? closeMobile : openMobile}
    aria-expanded={mobileOpen}
    aria-controls="site-mobile-panel"
    className="relative flex h-8 w-8 items-center justify-center text-[var(--foreground)] lg:hidden"
  >
    <span className="sr-only">
      {mobileOpen ? "Close navigation" : "Open navigation"}
    </span>
    {mobileOpen ? (
      <span className="relative block h-4 w-4">
        <span className="absolute left-1/2 top-1/2 block h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded bg-current" />
        <span className="absolute left-1/2 top-1/2 block h-[2px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-current" />
      </span>
    ) : (
      <span className="relative flex h-3.5 w-5 items-center justify-center">
        <span className="absolute h-0.5 w-5 -translate-y-2 rounded bg-current" />
        <span className="absolute h-0.5 w-5 rounded bg-current" />
        <span className="absolute h-0.5 w-5 translate-y-2 rounded bg-current" />
      </span>
    )}
  </button>

  {/* centred logo only */}
  <Link
    href="/"
    className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
    aria-label="Nextrend home"
  >
    <Image
      src={buildGeneralImageUrl("Nextrendlogo.png")}
      alt="Nextrend"
      width={80}
      height={24}
      className="h-6 w-auto object-contain select-none"
      priority
    />
  </Link>

  {/* right: search */}
  <div className="flex items-center">
    <button
      type="button"
      onClick={searchOpen ? closeSearchRibbon : openSearchRibbon}
      aria-label={searchOpen ? "Close search" : "Open search"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color-soft)] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_2px_6px_rgba(0,0,0,0.08)] ring-1 ring-[var(--ring-dim)] touch-manipulation active:scale-95 transition"
    >
      {!searchOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>
      ) : (
        <span className="text-xs font-semibold tracking-[0.2em]">
          ✕
        </span>
      )}
    </button>
  </div>
</div>


            {/* DESKTOP BAR – brand / nav / actions */}
            <div className="hidden w-full items-center justify-between lg:flex">
              {/* BRAND */}
              <Link
                href="/"
                className="group flex items-center gap-2 sm:gap-3 text-left touch-manipulation"
              >
                <Image
                  src={buildGeneralImageUrl("Nextrendlogo.png")}
                  alt="Nextrend mark"
                  width={40}
                  height={40}
                  className="h-8 w-auto sm:h-9 md:h-10 object-contain select-none"
                  priority
                />
                <div className="flex flex-col leading-[1.15]">
                  <span className="text-[10px] sm:text-[11px] font-light uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[var(--foreground)] font-[var(--font-serif)] group-hover:text-[var(--accent)] transition-colors">
                    Nextrend Systems
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[var(--secondary)]">
                    Audio Solutions
                  </span>
                </div>
              </Link>

              {/* DESKTOP NAV */}
              <nav
                className="relative h-full flex-1 flex items-stretch justify-center"
                onMouseLeave={handleLeave}
              >
                <ul className="flex h-full items-center gap-14 text-[10px] font-semibold uppercase tracking-[0.28em]">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeHref === item.href;
                    const hasMenu = !!item.submenu;
                    const desktopSubmenu = item.submenu ?? [];

                    return (
                      <li
                        key={item.href}
                        className="relative flex h-full flex-col items-center justify-center"
                        onMouseEnter={() =>
                          hasMenu && handleEnter(item.href)
                        }
                      >
                        <Link
                          href={item.href}
                          className={[
                            "group flex flex-col items-center text-center transition nav-link",
                            isActive
                              ? "!text-[var(--foreground)]"
                              : "",
                          ].join(" ")}
                          aria-current={
                            isActive ? "page" : undefined
                          }
                        >
                          <span className="leading-none pb-2">
                            {item.label}
                          </span>
                          <span
                            className={[
                              "block h-[2px] rounded-full transition-all duration-200",
                              isActive
                                ? "w-8 bg-[var(--accent)] shadow-[0_0_4px_rgba(182,138,74,0.45),0_0_12px_rgba(182,138,74,0.2)]"
                                : "w-8 bg-[var(--border-color-soft)] group-hover:w-10 group-hover:bg-[var(--accent)] group-hover:shadow-[0_0_4px_rgba(182,138,74,0.45),0_0_12px_rgba(182,138,74,0.2)]",
                            ].join(" ")}
                          />
                        </Link>

                        {hasMenu && hoverMenu === item.href && (
                          <div
                            className="absolute left-1/2 top-full z-[1200] mt-2 w-[340px] -translate-x-1/2 pt-4"
                            onMouseEnter={() =>
                              handleEnter(item.href)
                            }
                            onMouseLeave={handleLeave}
                          >
                            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] shadow-[0_20px_40px_rgba(0,0,0,0.06)] ring-1 ring-[var(--ring-dim)]">
                              <ul className="flex flex-col divide-y divide-[var(--border-color-soft)] p-3">
                                {desktopSubmenu.map((sub) => (
                                  <li key={sub.href}>
                                    <Link
                                      href={sub.href}
                                      className="group flex gap-3 rounded-lg px-4 py-4 text-left hover:bg-[var(--surface-light)] transition"
                                    >
                                      <div className="flex flex-1 flex-col gap-1">
                                        <div className="flex items-start gap-2">
                                     <span
  className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--foreground)] group-hover:text-[var(--accent)]"
>
  {sub.title}
</span>


                                          {sub.tag && (
                                            <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2 py-[2px] text-[8px] font-bold leading-none tracking-[0.3em] text-[var(--accent)]">
                                              {sub.tag}
                                            </span>
                                          )}
                                        </div>
                                        {sub.desc && (
                                          <p className="text-[11px] leading-relaxed tracking-normal normal-case text-[var(--secondary)]">
                                            {sub.desc}
                                          </p>
                                        )}
                                      </div>

                                      <div className="shrink-0 pt-1 text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          className="h-4 w-4"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth={1.5}
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 5h11m0 0v11m0-11L5 19"
                                          />
                                        </svg>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>

                              <Link
                                href={item.href}
                                className="flex items-center justify-between border-t border-[var(--border-color-soft)] px-4 py-3 text-[10px] tracking-[0.25em] text-[var(--secondary)] hover:bg-[var(--surface-light)] transition"
                              >
                                <span>
                                  Explore all {item.label}
                                </span>
                                <span className="text-[var(--accent)]">
                                  →{" "}
                                </span>
                              </Link>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* RIGHT SIDE – search + CTA */}
              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  type="button"
                  onClick={
                    searchOpen ? closeSearchRibbon : openSearchRibbon
                  }
                  className="inline-flex items-center rounded-[var(--radius-button)] border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--secondary)] shadow-[0_4px_10px_rgba(0,0,0,0.06)] ring-1 ring-[var(--ring-dim)] transition touch-manipulation hover:border-[var(--accent)] hover:text-[var(--foreground)] hover:shadow-[0_10px_22px_rgba(0,0,0,0.12)] active:scale-95"
                >
                  <span className="mr-2 inline-block leading-none">
                    {!searchOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                        />
                      </svg>
                    ) : (
                      <span className="text-[var(--foreground)] leading-none text-[11px] font-semibold tracking-[0.2em]">
                        ✕
                      </span>
                    )}
                  </span>
                  {searchOpen ? "Close" : "Search"}
                </button>

                <Link
                  href="/contact#contact-form"
                  className="relative inline-flex items-center justify-center rounded-[var(--radius-button)] border border-[var(--accent)]/30 bg-[linear-gradient(145deg,#ffffff_0%,#f6f2ea_100%)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--foreground)] shadow-[0_6px_16px_rgba(0,0,0,0.1)] ring-1 ring-[var(--ring-dim)] transition touch-manipulation hover:bg-[var(--accent)] hover:text-[var(--surface)] hover:shadow-[0_16px_34px_rgba(0,0,0,0.18)] hover:ring-[var(--accent)]/40 active:scale-95"
                >
                  <span className="pointer-events-none absolute inset-0 rounded-[var(--radius-button)] shadow-[0_1px_1px_rgba(255,255,255,0.6)_inset,0_0_18px_rgba(182,138,74,0.15)_inset]" />
                  <span className="relative z-[2]">
                    Arrange A Demo
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      <div aria-hidden className="h-16 sm:h-18 md:h-20" />
        {/* MOBILE PANEL */}
        <div
          id="site-mobile-panel"
          className={`lg:hidden fixed inset-0 z-[12000] ${
            mobileOpen
              ? "pointer-events-auto overflow-hidden"
              : "pointer-events-none"
          }`}
          onTouchMove={handleTouchMove}
        >
          {/* backdrop */}
          <div
            className={`absolute inset-0 bg-black/10 backdrop-blur-[2px] transition-opacity ${
              mobileOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMobile}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation drawer"
            data-drawer-content
            className={`absolute inset-0 flex flex-col bg-[var(--surface)] shadow-none border-b border-[var(--border-color-soft)] overscroll-contain transition-transform duration-250 ${
              mobileOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >
       
           {/* drawer header – centred logo only */}
<div className="relative z-[2] flex items-center justify-center border-b border-[var(--border-color-soft)] px-4 sm:px-5 py-4 sm:py-5 bg-[var(--surface)]/95 backdrop-blur-[2px]">
  {/* perfectly centered logo */}
  <Image
    src={buildGeneralImageUrl("Nextrendlogo.png")}
    alt="Nextrend mark"
    width={40}
    height={40}
    className="h-8 sm:h-10 w-auto object-contain select-none"
    priority
  />

  {/* close button on the right, not affecting centering */}
  <button
    onClick={closeMobile}
    className="absolute right-4 sm:right-5 flex h-8 w-8 items-center justify-center text-[var(--foreground)] touch-manipulation transition-all duration-150"
  >
    <span className="sr-only">Close menu</span>
    <span className="relative block h-4 w-4">
      <span className="absolute left-1/2 top-1/2 block h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded bg-current" />
      <span className="absolute left-1/2 top-1/2 block h-[2px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-current" />
    </span>
  </button>
</div>


            {/* drawer body */}
        <div className="relative z-[2] flex-1 overflow-y-auto px-4 sm:px-5 pb-4 sm:pb-6 pt-5 sm:pt-6 text-[var(--foreground)] bg-[var(--surface)]">


              {/* Home pill */}
<Link
  href="/"
  onClick={closeMobile}
  className={`${cormorant.className} mb-6 sm:mb-8 block px-2 sm:px-3 py-2 text-[16px] leading-snug text-[#111111] font-semibold`}
>
  HOME
</Link>



              {/* accordion sections */}
   <nav className="mb-2 border-t border-b border-[var(--border-color-soft)] divide-y divide-[var(--border-color-soft)]">

                {mobileNavItems.map((item) => {
                  const hasSubmenu =
                    !!item.submenu && item.submenu.length > 0;
                  const previews = hasSubmenu
                    ? item.submenu!.slice(0, MAX_MOBILE_PREVIEW)
                    : [];
                  const isOpen = !!openMobileSections[item.href];

                 if (!hasSubmenu) {
  return (
    <button
      key={item.href}
      type="button"
      onClick={() => {
        closeMobile();
        router.push(item.href);
      }}
 className={`${cormorant.className} flex w-full items-center justify-between bg-[var(--surface)] px-2 sm:px-3 py-4 text-[15px] sm:text-[16px] font-semibold tracking-[0.22em] uppercase text-[#111111] transition-colors`}


    >
      <span>{item.label}</span>
      <span className="flex h-6 w-6 items-center justify-center text-[var(--accent)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </span>
    </button>
  );
}

                  return (
                    <div key={item.href} className="space-y-3">
                      {/* accordion trigger */}
     <button
  type="button"
  onClick={() => toggleMobileSection(item.href)}
className={`${cormorant.className}
  flex w-full items-center justify-between
  bg-[var(--surface)]
  px-2 sm:px-3 py-4
  text-[15px] sm:text-[16px]
  font-semibold
  tracking-[0.22em] uppercase
  text-[#111111]
  transition-colors
`}

>

  {/* left: label in Comorant, black */}
  <span>{item.label}</span>

  {/* right: champagne arrow that rotates when open */}
  <span
    className={`flex h-7 w-7 items-center justify-center text-[var(--accent)] transition-transform duration-200 ${
      isOpen ? "rotate-90" : ""
    }`}
  >


    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </span>
</button>


                      {/* accordion body */}
                    {/* accordion body */}
<div
  className={`overflow-hidden transition-[max-height] duration-250 ease-out ${
    isOpen ? "max-h-[260px]" : "max-h-0"
  }`}
>
  <ul className="bg-[#f8f4ec]">
  {item.submenu!.map((sub) => (
  <li key={sub.href}>
    <Link
      href={sub.href}
      onClick={closeMobile}
      className={`${cormorant.className}
        group
        flex items-center justify-start
        px-2 sm:px-3 py-3
        text-[13px] sm:text-[14px]
        tracking-[0.22em] uppercase
        text-[#333333]
        bg-[var(--surface)]
        transition-all
        hover:shadow-[0_8px_22px_rgba(182,138,74,0.25)]
      `}
    >
      <span className="relative inline-block">
        {sub.title}
        <span
          className="pointer-events-none absolute left-0 -bottom-1 h-[1px] w-0 bg-[var(--accent)] transition-all duration-200 ease-out group-hover:w-full group-active:w-full"
        />
      </span>
    </Link>
  </li>
))}

   <Link
  href={item.href}
  onClick={closeMobile}
  className={`${cormorant.className}
    group
    flex items-center justify-start
    px-2 sm:px-3 py-3
    text-[13px] sm:text-[14px]
    tracking-[0.22em] uppercase
    text-[#333333]
    bg-[var(--surface)]
    transition-all
    hover:shadow-[0_8px_22px_rgba(182,138,74,0.25)]
  `}
>
  <span className="relative inline-block">
    Explore all {item.label}
    <span
      className="pointer-events-none absolute left-0 -bottom-1 h-[1px] w-0 bg-[var(--accent)] transition-all duration-200 ease-out group-hover:w-full group-active:w-full"
    />
  </span>
</Link>

  </ul>
</div>
    
                    </div>
                  );
                })}
              </nav>

<div className="pt-3 pb-5 flex justify-center">
  <Link
    href="/contact#contact-form"
    onClick={closeMobile}
    className={`${cormorant.className}
      group
      relative
      inline-flex items-center justify-center
      w-full max-w-[240px]
      rounded-full
      border border-[var(--accent)]/55
      bg-[var(--surface)]
      px-6 py-2.5
      text-[10px] sm:text-[11px]
      font-semibold uppercase tracking-[0.38em]
      text-[#1a1a1a]
      transition-all duration-200
      active:scale-95
    `}
  >
    {/* subtle inner highlight */}
    <span className="pointer-events-none absolute inset-[1px] rounded-full bg-[linear-gradient(135deg,#ffffff_0%,#f7f2ea_35%,#f2ece1_100%)]" />

    {/* border accent line on hover, Hermes / LV vibe */}
    <span className="pointer-events-none absolute inset-0 rounded-full ring-0 ring-[var(--accent)]/0 group-hover:ring-[0.5px] group-hover:ring-[var(--accent)]/60 transition-all duration-200" />

    <span className="relative z-[1] flex items-center gap-2">
      <span className="h-[1px] w-3 bg-[var(--accent)]/60 group-hover:w-4 transition-all duration-200" />
      <span>Arrange A Demo</span>
      <span className="text-[9px] tracking-[0.3em] translate-y-[0.5px]">
        →
      </span>
    </span>
  </Link>
</div>



            </div>

            {/* drawer footer */}
            <div className="relative z-[2] border-t border-[var(--border-color-soft)] bg-[var(--surface)] px-4 sm:px-5 py-3 sm:py-4 text-[10px] sm:text-[11px] leading-relaxed tracking-[0.16em] sm:tracking-[0.18em] md:tracking-[0.25em] text-[var(--secondary)]">
              Intelligent multi-zone audio, spatial tuning, and live scene
              control — engineered in Malaysia.
            </div>
          </aside>
        </div>
      </header>

      {/* SEARCH RIBBON */}
{searchOpen && (
  <div
    ref={searchPanelRef}
    className="border-b border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] shadow-[0_24px_48px_rgba(0,0,0,0.08)]"
  >
          <div className="mx-auto w-full max-w-[1600px] px-4 xl:px-8 pt-8 pb-10 relative">


            <div className="max-w-[1100px]">
              <div className="flex flex-col">
                {/* input + clear icon */}
                <div className="flex items-start relative">
           <input
  type="search"
  enterKeyHint="search"
  // optional, also fine to keep
  inputMode="search"
  autoFocus
  placeholder="Search for"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={handleSearchKeyDown}
  className="w-full bg-transparent text-[28px] leading-[1.2] text-[var(--foreground)] placeholder-[var(--secondary)] font-[var(--font-serif)] outline-none pr-10"
/>

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="absolute right-0 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)] text-[10px] shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="mt-4 h-px w-full bg-[var(--border-color)]" />
              </div>

              <div className="mt-8 flex flex-wrap items-start gap-x-6 gap-y-4 text-[14px] leading-snug">
                <span className="text-[var(--secondary)] font-[var(--font-sans)]">
                  Top searches
                </span>
{TOP_SEARCH_TERMS.slice(0, 4).map((term) => (
  <button
    key={term.query}
    type="button"
    onClick={() => handleTopSearchClick(term)}
    aria-label={`${term.query} — ${term.description}`}
    className="
      text-[13px] sm:text-[14px]
      font-[var(--font-serif)]
      text-[var(--foreground)]
      transition-colors duration-200
      hover:text-[var(--accent)]
      active:text-[var(--accent)]
    "
  >
    {term.query}
  </button>
))}


              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
