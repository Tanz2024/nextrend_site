// app/products/k-array/[slug]/page.tsx
// @ts-nocheck
"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentProps, TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LazyMotion, m, AnimatePresence } from "framer-motion";

import { ProductNavButtons } from "@/components/products/ProductNavButtons";
import { allKArrayProducts } from "../data";

const productData = allKArrayProducts;

const loadMotionFeatures = () =>
  import("framer-motion").then((m) => m.domAnimation);

/* ---------------- motion ---------------- */
const luxuryEase = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: luxuryEase },
  },
};

const heroMediaVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: luxuryEase },
  },
};
const storyVariants = {
  hidden: (dir: "left" | "right") => ({
    opacity: 0,
    x: dir === "left" ? -60 : 60,
    filter: "blur(0px)", // ✅ remove blur for mobile performance
  }),
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: luxuryEase },
  },
};

const textReveal = {
  hidden: (dir: "left" | "right") => ({
    opacity: 0,
    x: dir === "left" ? -60 : 60,
    filter: "blur(6px)",
  }),
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: luxuryEase },
  },
};

/* ---------------- types ---------------- */
type Props = { params: Promise<{ slug: string }> };

type SafeImageProps = ComponentProps<typeof Image> & {
  fallbackSrc?: string;
};

function SafeImage({ src, fallbackSrc, onError, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc || fallbackSrc || src}
      onError={(e) => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
        onError?.(e);
      }}
    />
  );
}
/* remove empties */
const cleanList = (arr: string[] = []) => (arr || []).filter(Boolean);
const resourceLabelFromValue = (value: string, fallback: string) => {
  const raw = (value || "").trim();
  if (!raw) return fallback;
  const last = raw.split("/").pop() || "";
  const base = last.split("?")[0].split("#")[0];
  if (!base) return fallback;
  const stripped = base.replace(/\.[^/.]+$/, "");
  const spaced = stripped.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return spaced || fallback;
};

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);

  const product = useMemo(
    () => productData.find((p) => p.slug === slug),
    [slug]
  );
  if (!product) return notFound();

  const index = useMemo(
    () => productData.findIndex((p) => p.slug === slug),
    [slug]
  );
  const prev = index > 0 ? productData[index - 1] : null;
  const next = index < productData.length - 1 ? productData[index + 1] : null;

  const specs = useMemo(() => cleanList(product.specs || []), [product.specs]);
  const specGroups = useMemo(() => {
    const raw = (product as any).specGroups;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((group, index) => {
        if (!group || typeof group !== "object") return null;
        const title =
          typeof (group as any).title === "string"
            ? (group as any).title.trim()
            : "";
        const items = Array.isArray((group as any).items)
          ? (group as any).items
              .map((item: any) => {
                if (!item || typeof item !== "object") return null;
                const label =
                  typeof item.label === "string" ? item.label.trim() : "";
                const value =
                  typeof item.value === "string" ? item.value.trim() : "";
                if (!label && !value) return null;
                return { label, value };
              })
              .filter(Boolean)
          : [];

        if (!title && items.length === 0) return null;
        return { title, items };
      })
      .filter(Boolean) as Array<{
      title: string;
      items: Array<{ label: string; value: string }>;
    }>;
  }, [product]);
  const features = useMemo(
    () => cleanList(product.features || []),
    [product.features]
  );
  const applications = useMemo(
    () => cleanList(product.applications || []),
    [product.applications]
  );

  const resources = useMemo(() => {
    const raw = (product as any)?.resources;
    if (!Array.isArray(raw)) return [];

    return raw
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            label: resourceLabelFromValue(item, `Resource ${index + 1}`),
            href: item,
          };
        }
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const href =
          (typeof record.href === "string" && record.href.trim()) ||
          (typeof record.url === "string" && record.url.trim()) ||
          (typeof record.src === "string" && record.src.trim()) ||
          "";
        if (!href) return null;
        const label =
          (typeof record.label === "string" && record.label.trim()) ||
          (typeof record.title === "string" && record.title.trim()) ||
          (typeof record.name === "string" && record.name.trim()) ||
          resourceLabelFromValue(href, `Resource ${index + 1}`);
        return { label, href };
      })
      .filter(Boolean) as Array<{ label: string; href: string }>;
  }, [product]);

  const detailSections = useMemo(() => {
    const sections: Array<{
      key: string;
      label: string;
      type: "list" | "resources";
      items: string[] | Array<{ label: string; href: string }>;
    }> = [];

    if (specs.length || specGroups.length) {
      sections.push({
        key: "specifications",
        label: "Specifications",
        type: "list",
        items: specs,
      });
    }

    if (applications.length) {
      sections.push({
        key: "applications",
        label: "Applications",
        type: "list",
        items: applications,
      });
    }

    if (features.length) {
      sections.push({
        key: "features",
        label: "Features",
        type: "list",
        items: features,
      });
    }

    if (resources.length) {
      sections.push({
        key: "resources",
        label: "Resources",
        type: "resources",
        items: resources,
      });
    }

    return sections;
  }, [specs, specGroups, features, applications, resources]);

  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!detailSections.length) return;

    const mq = window.matchMedia("(min-width: 768px)");
    const syncActiveSection = () => {
      if (mq.matches) {
        setActiveSection((prev) => {
          if (prev && detailSections.some((section) => section.key === prev)) {
            return prev;
          }
          return detailSections[0]?.key ?? null;
        });
      } else {
        setActiveSection(null);
      }
    };

    syncActiveSection();
    mq.addEventListener?.("change", syncActiveSection) ?? mq.addListener(syncActiveSection);
    return () =>
      mq.removeEventListener?.("change", syncActiveSection) ?? mq.removeListener(syncActiveSection);
  }, [detailSections]);

  const activeDetail = useMemo(
    () => detailSections.find((section) => section.key === activeSection),
    [detailSections, activeSection]
  );

  /* -------- reduced motion -------- */
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const motionSafe = !prefersReducedMotion;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const motionReady = motionSafe && isMounted;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange) ?? mq.addListener(onChange);
    return () =>
      mq.removeEventListener?.("change", onChange) ?? mq.removeListener(onChange);
  }, []);

  /* =================== COLOR VARIANTS (finish palette) =================== */
  const finishes = useMemo(() => (product as any).finishes ?? [], [product]);
  const hasVariants = finishes.length > 1;

  const [finishKey, setFinishKey] = useState<string>(
    () => finishes?.[0]?.key ?? "default"
  );

  useEffect(() => {
    setFinishKey(finishes?.[0]?.key ?? "default");
  }, [slug, finishes]);

  const activeFinish = useMemo(() => {
    return (
      finishes.find((f: any) => f.key === finishKey) ??
      finishes?.[0] ??
      null
    );
  }, [finishes, finishKey]);

  const finishLabels: Record<string, string> = {
    black: "Black",
    white: "White",
    red: "Red",
    blue: "Blue",
    orange: "Orange",
    yellow: "Yellow",
  };

const finishLabel =
  (activeFinish?.key && finishLabels[activeFinish.key]) ||
  activeFinish?.name ||
  (finishes?.[0]?.key && finishLabels[finishes[0].key]) ||
  finishes?.[0]?.name ||
  product.finish ||     // ✅ use product.finish for single-finish products
  "";


  const technicalSpecs = useMemo(() => {
    const items: Array<{ label: string; value: string }> = [];

    const generalRegulation =
      (typeof (product as any).regulation === "string" &&
        (product as any).regulation.trim()) ||
      (typeof product.ipRating === "string" && product.ipRating.trim()) ||
      "";

    if (generalRegulation) {
      items.push({ label: "General regulation", value: generalRegulation });
    }

    const finishValue =
      (typeof activeFinish?.name === "string" && activeFinish.name.trim()) ||
      (typeof product.finish === "string" && product.finish.trim()) ||
      "";

    if (finishValue) {
      items.push({ label: "Handle finish", value: finishValue });
    }

    return items;
  }, [product, activeFinish]);

  function ColorPalette({ compact = false }: { compact?: boolean }) {
    if (!hasVariants || !activeFinish) return null;
const swatchSize = compact ? "h-7 w-7" : "h-9 w-9";
const swatchGap = compact ? "gap-2.5" : "gap-3";
const sectionPadding = compact ? "pt-3" : "pt-5";


    return (
      <div className={`${sectionPadding} space-y-3 group`}>
        <div className="space-y-[0.12rem]">
          <p className="text-[0.78rem] tracking-[0.22em] uppercase text-[#6B6B6B]">
            Color - {finishLabel}
          </p>
        </div>

        <div
          role="listbox"
          aria-label="Available colors"
          className={`flex flex-wrap items-center ${swatchGap}`}
        >
          {finishes.map((finish) => {
            const active = finish.key === finishKey;
            const displayName =
              finishLabels[finish.key] || finish.name || "Color";

            return (
              <button
                key={finish.key}
                type="button"
                role="option"
                aria-selected={active}
                aria-label={`${displayName} color`}
                onClick={() => {
                  setFinishKey(finish.key);

                  // jump heroIndex to first slide of that finish
                  const idx = heroVisible.findIndex(
                    (s) => s.finishKey === finish.key
                  );
                  if (idx >= 0) {
                    lastHeroIndexRef.current = idx;
                    setHeroDir(idx >= heroIndex ? 1 : -1);
                    setHeroIndex(idx);
                  } else {
                    setHeroIndex(0);
                  }
                }}
                className={[
                  "relative flex items-center justify-center rounded-full transition-[transform,box-shadow] duration-600 ease-[0.19,0.85,0.32,1] hover:scale-[1.06] active:scale-[0.98]",
                  swatchSize,
                  active
                    ? "shadow-[0_0_0_1px_rgba(0,0,0,0.18),0_18px_52px_rgba(0,0,0,0.18)] ring-2 ring-[color:var(--champagne)]/55 translate-y-[-0.5px]"
                    : "shadow-[0_8px_20px_rgba(0,0,0,0.08)] opacity-80 hover:translate-y-[-0.5px] hover:shadow-[0_14px_28px_rgba(0,0,0,0.14)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(255,255,255,0.92)]",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  backgroundColor: finish.hex || "#ddd",
                  border: "none",
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

 function ContactCTA({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/contact"
      className={[
        "group inline-flex items-center gap-3 py-3",
        "text-sm sm:text-base md:text-[1.15rem] lg:text-[1.5rem] xl:text-[1.65rem]",
        "font-[500] md:font-light",
        "tracking-[0.01em] md:tracking-[-0.02em]",
        "leading-[1.45]",
        "text-[#1A1A1A]/80 transition-colors duration-300 hover:text-[#1A1A1A]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne)]/40",
        className,
      ].join(" ")}
    >
      <span>Get in touch with us</span>

      <span
        aria-hidden
        className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center
                   text-[0.84rem] sm:text-[0.92rem] leading-none
                   transition-transform duration-300 group-hover:translate-x-[3px]"
      >
        →
      </span>
    </Link>
  );
}


type Shot = { src: string; alt: string; caption?: string; finishKey?: string };

const heroShots = useMemo<Shot[]>(() => {
  const toShot = (item: any, fallbackAlt: string, fk?: string) => {
    if (!item) return null;

    if (typeof item === "string") {
      const src = item.trim();
      return src ? ({ src, alt: fallbackAlt, finishKey: fk } as Shot) : null;
    }

    if (typeof item === "object") {
      const src =
        (typeof item.src === "string" && item.src.trim()) ||
        (typeof item.url === "string" && item.url.trim()) ||
        (typeof item.href === "string" && item.href.trim()) ||
        (typeof item.image === "string" && item.image.trim()) ||
        "";

      if (!src) return null;

      const alt =
        (typeof item.alt === "string" && item.alt.trim()) ||
        (typeof item.caption === "string" && item.caption.trim()) ||
        fallbackAlt;

      const caption =
        typeof item.caption === "string" && item.caption.trim()
          ? item.caption.trim()
          : undefined;

      return { src, alt, caption, finishKey: fk } as Shot;
    }

    return null;
  };

  const uniqBySrc = (arr: (Shot | null)[]) => {
    const seen = new Set<string>();
    const out: Shot[] = [];
    for (const shot of arr) {
      if (!shot?.src) continue;
      if (seen.has(shot.src)) continue;
      seen.add(shot.src);
      out.push(shot);
    }
    return out;
  };

  const productGallery = Array.isArray((product as any).gallery)
    ? (product as any).gallery
    : [];

  // Multi-color: flatten ALL finishes in order
  if (Array.isArray(finishes) && finishes.length > 0) {
    const all = finishes.flatMap((f: any) => {
      const fk = f?.key || "default";
      const hero = toShot(
        { src: f?.image, alt: `${product.name} - ${f?.name || fk}` },
        product.name,
        fk
      );

      const g = Array.isArray(f?.gallery) ? f.gallery : [];
      const extras = g
        .map((x: any) => toShot(x, `${product.name} - ${f?.name || fk}`, fk))
        .filter(Boolean) as Shot[];

      return [hero, ...extras].filter(Boolean) as Shot[];
    });

    // include productGallery (no finishKey) at the end
    const pg = productGallery
      .map((x: any) => toShot(x, product.name))
      .filter(Boolean) as Shot[];

    return uniqBySrc([...all, ...pg]);
  }

  // Single-color: product image + product gallery
  const base = toShot({ src: product.image, alt: product.name }, product.name);
  const pg = productGallery
    .map((x: any) => toShot(x, product.name))
    .filter(Boolean) as Shot[];
  return uniqBySrc([base, ...pg]);
}, [product, finishes]);

const heroVideoRef = useRef<HTMLVideoElement | null>(null);

// ONE global list for hero + gallery
const heroVisible = heroShots;
const heroThumbs = heroVisible; // this will become 1 thumb (ok)
const heroCount = heroVisible.length;

const galleryRowRef = useRef<HTMLDivElement | null>(null);
const scrollGalleryBy = (dir: 1 | -1) => {
  const el = galleryRowRef.current;
  if (!el) return;

  // scroll roughly one “page” of cards
  const step = Math.round(el.clientWidth * 0.85);
  el.scrollBy({ left: dir * step, behavior: "smooth" });
};

  const [heroIndex, setHeroIndex] = useState(0);
  const lastHeroIndexRef = useRef(0);
  const [heroDir, setHeroDir] = useState<1 | -1>(1);

  useEffect(() => {
    const fk = heroVisible?.[heroIndex]?.finishKey;
    if (!fk) return;

    // only update if different (prevents loops)
    if (fk !== finishKey) setFinishKey(fk);
  }, [heroIndex, heroVisible, finishKey]);

useEffect(() => {
  setHeroIndex(0);
  lastHeroIndexRef.current = 0;
  setHeroDir(1);
}, [slug]);


  useEffect(() => {
    setHeroIndex((i) => {
      if (heroCount <= 0) return 0;
      return Math.max(0, Math.min(i, heroCount - 1));
    });
  }, [heroCount]);

  const setHero = useCallback(
    (i: number) => {
      if (heroCount <= 1) return;
      const next = ((i % heroCount) + heroCount) % heroCount;
      const prevIdx = lastHeroIndexRef.current;
      setHeroDir(next >= prevIdx ? 1 : -1);
      lastHeroIndexRef.current = next;
      setHeroIndex(next);
    },
    [heroCount]
  );

  const heroNext = useCallback(() => {
    if (heroCount <= 1) return;
    setHero(heroIndex + 1);
  }, [heroCount, heroIndex, setHero]);

  const heroPrev = useCallback(() => {
    if (heroCount <= 1) return;
    setHero(heroIndex - 1);
  }, [heroCount, heroIndex, setHero]);

  // swipe (mobile)
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const touchStartTime = useRef<number | null>(null);

  const onHeroTouchStart = (e: TouchEvent) => {
    if (heroCount <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    touchStartTime.current =
      typeof performance !== "undefined" ? performance.now() : Date.now();
  };

  const onHeroTouchMove = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onHeroTouchEnd = () => {
    if (touchStartX.current === null) return;
    const endTime =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    const duration = Math.max(1, endTime - (touchStartTime.current ?? endTime));
    const distance = touchDeltaX.current;
    const absDistance = Math.abs(distance);
    const velocity = Math.abs(distance / duration);
    const fastSwipe = velocity > 0.45 && absDistance > 18;
    const longSwipe = absDistance > 62;

    if (fastSwipe || longSwipe) {
      if (distance > 0) heroPrev();
      if (distance < 0) heroNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    touchStartTime.current = null;
  };
useEffect(() => {
  const el = heroVideoRef.current;
  if (!el) return;

  const setStart = () => {
    try {
      if (el.currentTime < 1) el.currentTime = 1;
    } catch {}
  };

  el.addEventListener("loadedmetadata", setStart);
  return () => el.removeEventListener("loadedmetadata", setStart);
}, [slug]);

  // keyboard arrows for hero
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (heroCount <= 1) return;
      if (e.key === "ArrowRight") heroNext();
      if (e.key === "ArrowLeft") heroPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [heroCount, heroNext, heroPrev]);

const activeLifestyle = ((activeFinish as any)?.lifestyle?.length ? (activeFinish as any).lifestyle : (product as any).lifestyle) as any[];
const galleryShots = heroVisible as Shot[];

const hasGallery = galleryShots.length > 0;
const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
const [lbDir, setLbDir] = useState<1 | -1>(1);
const lightboxTouchStartX = useRef<number | null>(null);
const lightboxTouchDeltaX = useRef(0);
const lightboxTouchStartTime = useRef<number | null>(null);


  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i);
    try {
      if (typeof window === "undefined" || typeof document === "undefined") return;

      const html = document.documentElement;
      const body = document.body;
      const head = document.head;

      let scrollbarWidth = 0;
      try {
        scrollbarWidth = window.innerWidth - html.clientWidth;
      } catch {}

      html.style.overflow = "hidden";
      html.style.scrollbarWidth = "none";
      html.style.setProperty("-ms-overflow-style", "none");
      body.style.overflow = "hidden";
      body.style.paddingRight = `${scrollbarWidth}px`;

      if (!document.getElementById("lightbox-no-scrollbar")) {
        const style = document.createElement("style");
        style.id = "lightbox-no-scrollbar";
        style.textContent = `
          html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none !important; width: 0; height: 0; }
          html { -webkit-overflow-scrolling: touch; scrollbar-width: none !important; -ms-overflow-style: none !important; }
          body { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        `;
        head.appendChild(style);
      }
    } catch {}
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    try {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      const html = document.documentElement;
      const body = document.body;

      html.style.overflow = "";
      html.style.scrollbarWidth = "";
      html.style.removeProperty("-ms-overflow-style");
      body.style.overflow = "";
      body.style.paddingRight = "";

      const style = document.getElementById("lightbox-no-scrollbar");
      if (style?.parentNode) style.parentNode.removeChild(style);
    } catch {}
  }, []);

const nextImage = useCallback(() => {
  setLbDir(1);
  setLightboxIndex((i) => {
    if (i === null) return null;
    const total = galleryShots.length;
    if (!total) return null;
    return (i + 1) % total;
  });
}, [galleryShots.length]);

const prevImage = useCallback(() => {
  setLbDir(-1);
  setLightboxIndex((i) => {
    if (i === null) return null;
    const total = galleryShots.length;
    if (!total) return null;
    return (i - 1 + total) % total;
  });
}, [galleryShots.length]);

const onLightboxTouchStart = (e: TouchEvent) => {
  lightboxTouchStartX.current = e.touches[0].clientX;
  lightboxTouchDeltaX.current = 0;
  lightboxTouchStartTime.current =
    typeof performance !== "undefined" ? performance.now() : Date.now();
};

const onLightboxTouchMove = (e: TouchEvent) => {
  if (lightboxTouchStartX.current === null) return;
  lightboxTouchDeltaX.current = e.touches[0].clientX - lightboxTouchStartX.current;
};

const onLightboxTouchEnd = () => {
  if (lightboxTouchStartX.current === null) return;
  const endTime =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  const duration = Math.max(
    1,
    endTime - (lightboxTouchStartTime.current ?? endTime)
  );
  const distance = lightboxTouchDeltaX.current;
  const absDistance = Math.abs(distance);
  const velocity = Math.abs(distance / duration);
  const fastSwipe = velocity > 0.4 && absDistance > 14;
  const longSwipe = absDistance > 48;

  if (fastSwipe || longSwipe) {
    if (distance > 0) prevImage();
    if (distance < 0) nextImage();
  }
  lightboxTouchStartX.current = null;
  lightboxTouchDeltaX.current = 0;
  lightboxTouchStartTime.current = null;
};


  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, nextImage, prevImage, closeLightbox]);

  useEffect(() => {
    return () => {
      try {
        if (typeof window === "undefined" || typeof document === "undefined") return;
        const html = document.documentElement;
        const body = document.body;

        html.style.overflow = "";
        html.style.scrollbarWidth = "";
        html.style.removeProperty("-ms-overflow-style");
        body.style.overflow = "";
        body.style.paddingRight = "";

        const lightboxStyle = document.getElementById("lightbox-no-scrollbar");
        if (lightboxStyle?.parentNode) lightboxStyle.parentNode.removeChild(lightboxStyle);
      } catch {}
    };
  }, []);

  const PremiumSection = ({
      items,
      mode,
    }: {
      items: string[];
      mode: string;
    }) => {
      if (!items.length) return null;

    const sharedStyle = {
      textSize: "text-[0.85rem] sm:text-[0.94rem] lg:text-[1.02rem]",
      textColor: "text-[#2A2A2A]",
      leading: "leading-[1.8] sm:leading-[1.95] lg:leading-[2.05]",
      weight: "font-[360]",
    };

    const getSpacing = (i: number, total: number) => {
      if (i === total - 1) return "mb-0";
      if (i === 0) return "mb-6 sm:mb-7 lg:mb-8";
      return "mb-5 sm:mb-6 lg:mb-7";
    };

    return (
<m.div
  key={mode}
  initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  viewport={{ once: true, amount: 0.35 }}
  exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
  transition={{ duration: 1.0, ease: [0.19, 1.0, 0.22, 1.0] }}
  className="w-full max-w-[68ch] pb-8 sm:pb-10 lg:pb-12"
>
  <ul className="list-disc pl-5 sm:pl-6 space-y-4 sm:space-y-5 marker:text-[#C6AA76]/70">
    {items.map((raw, i) => (
      <m.li
        key={i}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.15,
          delay: i * 0.16,
          ease: [0.19, 1.0, 0.22, 1.0],
        }}
        className={[
          sharedStyle.textSize,
          sharedStyle.leading,
          sharedStyle.weight,
          "tracking-[0.012em] sm:tracking-[0.016em]",
          "text-black/75", 
          "antialiased",
        ].join(" ")}
      >
        {raw}
      </m.li>
    ))}
  </ul>
</m.div>

      );
    };

   const SpecGroupsLayer = ({
  groups,
}: {
  groups: Array<{
    title: string;
    items: Array<{ label: string; value: string }>;
  }>;
}) => {
  if (!groups.length) return null;

  return (
    <m.div
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, ease: [0.19, 1.0, 0.22, 1.0] }}
className="w-full pt-6 sm:pt-7 lg:pt-8"


    >
      {/* ✅ responsive two-column layout */}
 <div className="grid gap-10 md:grid-cols-2 md:gap-x-9 lg:gap-x-10 2xl:gap-x-12">


        {groups.map((group, index) => {
          const title = group.title || "Specifications";
          return (
            <section
              key={`${title}-${index}`}
              className="min-w-0"
            >
              {/* header like the reference */}
           <div>
  <div className="text-[0.82rem] font-[600] tracking-[0.02em] text-[#1A1A1A]/85 uppercase">
    {title}
  </div>
 <div className="mt-4 h-px w-full bg-black/10" />

</div>


              {/* rows */}
              <dl className="mt-5 space-y-4">
                {(group.items || []).map((item, idx) => (
               <div
  key={`${item.label}-${idx}`}
className="grid grid-cols-[10.5rem_minmax(0,1fr)] gap-x-6 gap-y-1
           sm:grid-cols-[11.5rem_minmax(0,1fr)]
          xl:grid-cols-[12.5rem_minmax(0,1fr)]
2xl:grid-cols-[13rem_minmax(0,1fr)] 2xl:gap-x-7"

>

     <dt className="text-[15px] leading-[1.9] font-[600] text-black/70 normal-case tracking-[0]">
  {item.label}:
</dt>

<dd className="text-[15px] leading-[1.9] font-[400] text-black/55 break-words">
  {item.value}
</dd>


                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
    </m.div>
  );
};

  
    const ResourcesSection = ({
    items,
  }: {
  items: Array<{ label: string; href: string }>;
}) => {
  if (!items.length) return null;

  return (
    <m.div
      key="resources"
      initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
      transition={{ duration: 1.0, ease: [0.19, 1.0, 0.22, 1.0] }}
      className="w-full max-w-[68ch] pb-8 sm:pb-10 lg:pb-12"
    >
   

      <ul className="space-y-1.5 sm:space-y-2">
        {items.map((item, i) => (
          <li key={`${item.href}-${i}`}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={[
                "group flex items-center justify-between gap-4",
                "py-2.5 sm:py-3",
                "text-[0.85rem] sm:text-[0.94rem] lg:text-[1.02rem]",
                "font-[500] tracking-[0.01em]",
                "text-[#141414]",
                "transition-colors duration-300",
                "hover:text-[color:var(--champagne)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne)]/60 focus-visible:ring-offset-2",
              ].join(" ")}
            >
              <span className="leading-[1.45]">
                {/* match your screenshot wording */}
                <span className="font-[500]">Download the PDF</span>{" "}
                <span className="font-[500]">of</span>{" "}
                <span className="font-[500]">{item.label}</span>
              </span>

              {/* minimal “document” icon (no border, champagne on hover) */}
              <span
                aria-hidden
                className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-current"
                >
                  <path
                    d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>

            {/* separator line between rows */}
            <div className="h-px w-full bg-black/10" />
          </li>
        ))}
      </ul>
    </m.div>
  );
};


  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <m.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen bg-[var(--page-bg)] text-[#1A1A1A]"
        style={{
          ["--page-bg" as any]: "#ffffff",
          ["--champagne" as any]: "#C4A777",
          ["--tile-bg" as any]:
            "linear-gradient(180deg,#FBF9F4 0%,#FFFFFF 55%,#FBF9F4 100%)",
          ["--tile-ring" as any]: "rgba(196,167,119,0.22)",
          ["--tile-shadow" as any]: "0 18px 48px rgba(0,0,0,0.08)",
        }}
      >
<section className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pb-8 pt-4 sm:px-6 sm:pb-16 sm:pt-8 md:px-12 md:pb-20 md:pt-12 lg:px-20 2xl:max-w-[1560px] 2xl:px-24">

          {/* breadcrumbs */}
          <m.nav
            {...fadeUp}
            className="mb-4 text-[10px] sm:mb-6 sm:text-[12px] tracking-[0.16em] text-black/55"
          >
            <Link href="/products" className="hover:text-[#C4A777]">
              Products
            </Link>
            <span className="mx-1 sm:mx-2 opacity-30">/</span>
            <Link href="/products/k-array" className="hover:text-[#C4A777]">
              {product.brand ?? "K-array"}
            </Link>
            <span className="mx-1 sm:mx-2 opacity-30">/</span>
            <span className="text-[#C4A777] truncate">{product.name}</span>
          </m.nav>

          {/* hero: media + meta */}
          <div className="grid items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 lg:grid-cols-[minmax(0,58%)_minmax(0,1fr)]">
            {/* media column */}
            <div className="lg:sticky lg:top-16">
        {heroVisible.length > 0 && (
  <div className="md:hidden">
    <m.div
      onTouchStart={onHeroTouchStart}
      onTouchMove={onHeroTouchMove}
      onTouchEnd={onHeroTouchEnd}
      whileTap={{ scale: 0.99 }}
      className={[
        "relative w-full overflow-hidden",
        "aspect-[4/5]",
        "touch-pan-y select-none",
      ].join(" ")}
      // ✅ ONE SOLID FRAME COLOR (match adidas clean panel)
      
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={heroIndex}
          className="absolute inset-0"
          // ✅ keep mobile clean (no extra slide animation here)
          initial={undefined}
          animate={undefined}
          exit={undefined}
          transition={undefined}
        >
          <div
            className="relative h-full w-full"
            // ✅ SAME COLOR INSIDE so you never see “mixed” tones
          

          >
                          <SafeImage
                            src={heroVisible[heroIndex]?.src || product.image}
                            alt={heroVisible[heroIndex]?.alt || product.name}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            draggable={false}
                            priority
                            fallbackSrc={product.image}
                          />
          </div>
        </m.div>
      </AnimatePresence>

     
      {heroCount > 1 && (
        <div className="absolute bottom-5 left-0 right-0 px-6">
          <div className="h-[2px] w-full bg-black/20 overflow-hidden rounded-full">
            <div
              className="h-full bg-black/80 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
              style={{
                width: `${100 / heroCount}%`,
                transform: `translateX(${heroIndex * 100}%)`,
              }}
            />
          </div>
        </div>
      )}
    </m.div>
  </div>
)}

           

              <m.div
                variants={heroMediaVariants}
                initial={motionReady ? "hidden" : undefined}
                whileInView={motionReady ? "visible" : undefined}
                viewport={{ once: true, amount: 0.3 }}
                className="relative hidden md:block overflow-hidden rounded-[22px] bg-[var(--page-bg)] group aspect-[16/9]"
                onTouchStart={onHeroTouchStart}
                onTouchMove={onHeroTouchMove}
                onTouchEnd={onHeroTouchEnd}
              >
                {/* smooth hero transition */}
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={heroIndex}
                    className="absolute inset-0"
                    initial={
                      motionReady
                        ? { opacity: 0, x: heroDir === 1 ? 18 : -18, filter: "blur(10px)" }
                        : undefined
                    }
                    animate={
                      motionReady ? { opacity: 1, x: 0, filter: "blur(0px)" } : undefined
                    }
                    exit={
                      motionReady
                        ? { opacity: 0, x: heroDir === 1 ? -18 : 18, filter: "blur(10px)" }
                        : undefined
                    }
                    transition={{ duration: 0.55, ease: luxuryEase }}
                  >
                    <SafeImage
                      src={heroVisible[heroIndex]?.src || product.image}
                      alt={heroVisible[heroIndex]?.alt || product.name}
                      fill
                      priority
                      sizes="(min-width:1024px) 60vw, 100vw"
                      className="object-contain"
                      draggable={false}
                      fallbackSrc={product.image}
                    />
                  </m.div>
                </AnimatePresence>

                {/* desktop arrows (same as dots/swipe) */}
                {heroCount > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={heroPrev}
                      aria-label="Previous image"
                      className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2
                                 h-11 w-11 items-center justify-center rounded-full
                                 bg-transparent text-black/45 hover:text-black/75
                                 transition opacity-0 group-hover:opacity-100"
                    >
                      <span className="text-[22px] leading-none">‹</span>
                    </button>

                    <button
                      type="button"
                      onClick={heroNext}
                      aria-label="Next image"
                      className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2
                                 h-11 w-11 items-center justify-center rounded-full
                                 bg-transparent text-black/45 hover:text-black/75
                                 transition opacity-0 group-hover:opacity-100"
                    >
                      <span className="text-[22px] leading-none">›</span>
                    </button>
                  </>
                )}
              </m.div>

              {/* HERO DOTS (champagne, centered, no outer border) */}
            {/* HERO DOTS (unchanged) */}
{heroCount > 1 && (
  <div className="mt-5 hidden md:flex w-full items-center justify-center">
    <div className="flex items-center gap-2.5 sm:gap-3">
      {heroVisible.map((_, i) => {
        const active = heroIndex === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => setHero(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={active ? "true" : undefined}
            className={[
              "rounded-full",
              "h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5",
              "transition-[transform,opacity,background-color,box-shadow] duration-500",
              "ease-[cubic-bezier(0.19,1,0.22,1)]",
              "active:scale-[0.92] hover:scale-[1.06]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne)]/60",
              active
                ? "bg-[color:var(--champagne)] opacity-100 shadow-[0_0_0_6px_rgba(196,167,119,0.14)]"
                : "bg-black/18 hover:bg-black/28 opacity-85",
            ].join(" ")}
          />
        );
      })}
    </div>
  </div>
)}

{/* THUMBNAIL ROW (arrows removed) */}
{galleryShots.length > 0 && (
  <div className="mt-6 hidden md:block">
    {(() => {
      const showScroll = galleryShots.length > 4;

      const GAP = 16; // gap-4
      const cols = 4;
      const itemWidth = `calc((100% - ${(cols - 1) * GAP}px) / ${cols})`;

      return (
        <div className="flex items-end">
          {/* scroll row */}
          <div className="min-w-0 flex-1">
            <div
              ref={galleryRowRef}
              className={[
                "flex gap-4",
                showScroll ? "overflow-x-auto" : "overflow-x-hidden",
                "snap-x snap-mandatory",
                "pb-2",
                "custom-scrollbar",
              ].join(" ")}
            >
              {galleryShots.map((shot: any, i: number) => (
                <m.button
                  key={`${shot.src}-${i}`}
                  type="button"
                  onClick={() => openLightbox(i)}
                  whileTap={{ scale: 0.985 }}
                  aria-label={`Open image ${i + 1}`}
                  className={[
                    "group relative overflow-hidden snap-start shrink-0 aspect-square",
                    "rounded-2xl border border-black/10 bg-white",
                    "transition-[border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                    "hover:border-black/20 hover:-translate-y-[0.5px]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  ].join(" ")}
                  style={{ width: itemWidth }}
                >
                  <div className="relative h-full w-full p-3 sm:p-3.5">
                    <SafeImage
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(min-width:768px) 25vw, 100vw"
                      className="object-contain"
                      draggable={false}
                      fallbackSrc={product.image}
                    />
                  </div>
                </m.button>
              ))}
            </div>
          </div>
        </div>
      );
    })()}
  </div>
)}


            </div>

            {/* meta */}
            <div className="space-y-5 sm:space-y-6 lg:space-y-8">
              <m.p
                {...fadeUp}
                className="text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.32em] text-[#7f7460]"
              >
                {product.series} / {product.collaboration}
              </m.p>

              <m.h1
                {...fadeUp}
                className="text-[clamp(2rem,6vw,4rem)] font-[400] md:font-light leading-[1.02] tracking-tight text-[#0f0f0f] md:text-[#111]"
              >
                {product.name}
              </m.h1>

              <m.p
                {...fadeUp}
                className="max-w-[52ch] text-[0.95rem] sm:text-[1.02rem] lg:text-[1.08rem] leading-[1.8] text-black/75"
              >
              {(product as any).heroCopy || product.definition || product.description}

              </m.p>

              <div className="max-w-[52ch]">
                <div className="hidden lg:flex lg:flex-col gap-3">
                  <ColorPalette />
                </div>
                <div className="mt-4 lg:hidden">
                  <ColorPalette compact />
                </div>
              </div>
              <div className="pt-6 hidden w-full max-w-[52ch] justify-start md:flex lg:pt-7">
                <ContactCTA />
              </div>
            </div>
          </div>

          {/* DETAILS */}
          {detailSections.length > 0 && (
          <section className="mt-10 sm:mt-12 lg:mt-14">
            {/* Desktop (tabs) */}
            <div className="hidden md:block">
         <div className="mb-8 sm:mb-10 lg:mb-12 w-full max-w-[92ch] lg:max-w-[104ch] 2xl:max-w-[120ch] overflow-x-auto scrollbar-hide">


                <div className="flex items-center gap-0 min-w-max">
                  {detailSections.map((section, idx) => (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setActiveSection(section.key)}
                      className={`py-2 sm:py-2.5 text-[0.72rem] sm:text-[0.78rem] lg:text-[0.82rem] xl:text-[0.85rem]
                        tracking-[0.08em] sm:tracking-[0.1em] lg:tracking-[0.12em]
                        whitespace-nowrap transition-all duration-1200
                        ${idx === 0 ? "pr-4 sm:pr-5 lg:pr-6 xl:pr-7" : "px-4 sm:px-5 lg:px-6 xl:px-7"}
                        ${
                          activeSection === section.key
                            ? "text-[#1A1A1A]/95 opacity-100"
                            : "text-[#1A1A1A]/35 opacity-85"
                        }`}
                      style={{
                        transitionProperty: "opacity, color",
                        transitionTimingFunction: "cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                      }}
                      aria-pressed={activeSection === section.key}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>

<div className="w-full max-w-[92ch] lg:max-w-[104ch] 2xl:max-w-[120ch]">


                <AnimatePresence mode="wait">
                  {activeDetail?.type === "list" && (
                    <>
                      <PremiumSection
                        items={activeDetail.items as string[]}
                        mode={activeDetail.key}
                      />
                      {activeDetail.key === "specifications" &&
                        specGroups.length > 0 && (
                          <SpecGroupsLayer groups={specGroups} />
                        )}
                    </>
                  )}
                  {activeDetail?.type === "resources" && (
                    <ResourcesSection
                      items={
                        activeDetail.items as Array<{ label: string; href: string }>
                      }
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile (premium accordion) */}
            <div className="md:hidden w-full max-w-[68ch]">
              <div className="space-y-3">
                {detailSections.map((section) => {
                  const isOpen = activeSection === section.key;
                  return (
                    <div key={section.key} className="rounded-2xl">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveSection((prev) =>
                            prev === section.key ? null : section.key
                          )
                        }
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                      >
                        <span className="text-[0.72rem] uppercase tracking-[0.24em] text-[#7f7460]">
                          {section.label}
                        </span>
                        <span
                          className={[
                            "inline-flex h-8 w-8 items-center justify-center rounded-full",
                            "text-[#2a2a2a] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                            isOpen ? "rotate-180" : "",
                          ].join(" ")}
                          aria-hidden
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <m.div
                            key={`${section.key}-panel`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: luxuryEase }}
                            className="overflow-hidden px-4 pb-4"
                          >
                            <div className="pt-1">
                              {section.type === "list" && (
                                <>
                                  <PremiumSection
                                    items={section.items as string[]}
                                    mode={section.key}
                                  />
                                  {section.key === "specifications" &&
                                    specGroups.length > 0 && (
                                      <SpecGroupsLayer groups={specGroups} />
                                    )}
                                </>
                              )}
                              {section.type === "resources" && (
                                <ResourcesSection
                                  items={
                                    section.items as Array<{
                                      label: string;
                                      href: string;
                                    }>
                                  }
                                />
                              )}
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex md:hidden">
              <ContactCTA />
            </div>
          </section>
          )}

          {/* design story */}
{product.story && (
  <section className="mt-10 sm:mt-12 lg:mt-16">
<div className="mb-8 h-px w-full max-w-[68ch] bg-black/10 md:hidden" />

    <m.div
      variants={motionReady ? storyVariants : undefined}
      initial={motionReady ? "hidden" : undefined}
      animate={motionReady ? "visible" : undefined}
      custom="right"
      style={{ willChange: "transform, opacity" }}
    >

      <h2 className="mb-2 sm:mb-3 text-[1.1rem] sm:text-[1.18rem] lg:text-[1.25rem] font-medium tracking-[0.01em] text-[#1A1A1A]">
        Design Story
      </h2>

<p className="max-w-[68ch] text-[0.98rem] leading-[1.85] text-black/72 whitespace-pre-line">
  {product.story}
</p>

    </m.div>
  </section>
)}

          {/* lifestyle / scene */}
     {(((product as any).heroVideo?.src) || (activeLifestyle?.length > 0)) && (
  <section className="mt-10 sm:mt-12 lg:mt-16 space-y-10 sm:space-y-12 lg:space-y-14">


    {/* ✅ FULL-WIDTH VIDEO HERO (Apple-style) */}
   {/* ✅ FULL-BLEED VIDEO HERO (fills the whole section height) */}
{((product as any).heroVideo?.src) && (
  <section className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden bg-black min-h-[88vh]">
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src={(product as any).heroVideo.src}
      poster={(product as any).heroVideo.poster}
      autoPlay
      muted
      playsInline
      loop
      ref={(el) => {
        if (!el) return;
        // start at 1s once metadata is ready
        const onMeta = () => {
          try {
            el.currentTime = 1;
          } catch {}
        };
        el.addEventListener("loadedmetadata", onMeta, { once: true });
      }}
    />

    {/* readability overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0.45)_60%,rgba(0,0,0,0.70)_100%)]" />

    {/* text */}
<div className="relative z-[2] mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-12 lg:px-20 h-[88vh] flex items-end">
  <div className="pb-10 sm:pb-14 max-w-[72ch] text-white">
    <div className="mb-3 text-[0.62rem] sm:text-[0.7rem] uppercase tracking-[0.28em] text-white/70">
      The Story
    </div>

    {/* ✅ No product name in video */}
    <div className="text-[clamp(1.7rem,3.6vw,3rem)] font-light leading-[1.06] tracking-[-0.02em]">
      {product.headline || "Design in Motion"}
    </div>

    {/* ✅ Use ONLY short overlay copy + fallback (no filmCopy keys needed) */}
    <div className="mt-3 hidden sm:block text-[0.95rem] sm:text-[1rem] leading-[1.8] text-white/82">
      {(product as any).heroCopy || product.description}
    </div>

    {/* ✅ Mobile: shorter line if you add heroCopyMobile later; otherwise same meaning */}
    <div className="mt-3 sm:hidden text-[0.92rem] leading-[1.7] text-white/82 max-w-[42ch]">
      {(product as any).heroCopyMobile || (product as any).heroCopy || product.description}
    </div>
  </div>
</div>
  </section>
)}


    {/* ✅ THEN YOUR SCENES (unchanged mapping) */}
    {!!activeLifestyle?.length &&
      activeLifestyle.map((shot, i) => {
        const text = shot.caption ?? shot.alt;
        const reversed = Boolean(i % 2);
        const textDirection: "left" | "right" = reversed ? "left" : "right";

        return (
          <div
            key={`${shot.src}-${i}`}
            className={`grid items-center gap-6 sm:gap-8 lg:gap-12 md:grid-cols-[minmax(0,62%)_minmax(0,38%)] ${
              reversed ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* image */}
            <m.div
              initial={{ opacity: 0, scale: 1.06, filter: "blur(18px)", y: 30 }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.1, ease: luxuryEase, delay: i * 0.08 }}
              className="relative h-[220px] sm:h-[320px] lg:h-[460px] w-full overflow-hidden bg-[var(--page-bg)] isolate"
            >
              <m.div
                animate={{ y: [-2, 2, -2], rotateY: [-0.4, 0.4, -0.4], rotateX: [-0.2, 0.2, -0.2] }}
                transition={{ duration: 9 + i, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full pointer-events-none select-none"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover sm:object-contain"
                  style={{
                    backgroundColor: "transparent",
                    imageRendering: "crisp-edges",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                  }}
                  draggable={false}
                  priority={i < 2}
                />
              </m.div>
            </m.div>
{/* image */}
{/* <m.div
  initial={motionReady ? { opacity: 0, scale: 1.04, filter: "blur(18px)", y: 30 } : undefined}
  whileInView={motionReady ? { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 } : undefined}
  viewport={{ once: true, amount: 0.35 }}
  transition={motionReady ? { duration: 1.1, ease: luxuryEase, delay: i * 0.08 } : undefined}
  className="
    relative w-full overflow-hidden isolate
    rounded-[22px] bg-[#FBF9F4]
    ring-1 ring-black/5
    aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/10]
  "
>
  <m.div
    animate={motionSafe ? { y: [-2, 2, -2], rotateY: [-0.4, 0.4, -0.4], rotateX: [-0.2, 0.2, -0.2] } : undefined}
    transition={motionReady ? { duration: 9 + i, repeat: Infinity, ease: "easeInOut" } : undefined}
    className="absolute inset-0"
  >
    <Image
      src={shot.src}
      alt={shot.alt}
      fill
      sizes="(min-width:768px) 60vw, 100vw"
      className="object-cover"
      draggable={false}
      priority={i < 2}
    />
  </m.div>
</m.div>
 */}

            {/* text */}
            <m.div
              variants={textReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.45 }}
              custom={textDirection}
              className="self-center px-1 md:px-4 lg:px-6"
              style={{ fontFamily: '"Playfair Display","Times New Roman",ui-serif,Georgia,serif' }}
            >
              <div className="mb-4 flex items-center gap-3 text-[0.62rem] sm:text-[0.68rem] lg:text-[0.74rem] uppercase tracking-[0.24em] text-[#6f6552]">
              
                <span>Scene {String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="text-[clamp(1.4rem,3.8vw,2.3rem)] font-light leading-[1.1] text-[#1A1A1A]">
                {shot.alt || product.name}
              </h3>
              <p className="mt-2 sm:mt-3 lg:mt-4 max-w-[48ch] font-sans text-[0.95rem] sm:text-[1rem] lg:text-[1.08rem] leading-[1.85] text-black/70">
                {text}
              </p>
            </m.div>
          </div>
        );
      })}
  </section>
)}


          <ProductNavButtons
            prev={prev ?? undefined}
            next={next ?? undefined}
            resolveHref={(link) => "/products/k-array/" + link.slug}
          />
        </section>

        {/* ---------------- LIGHTBOX ---------------- */}
        <AnimatePresence>
          {lightboxIndex !== null && hasGallery && (
            <m.div
              key="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`${product.name} gallery`}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onMouseDown={(e) => {
                if (e.currentTarget === e.target) closeLightbox();
              }}
              tabIndex={-1}
            >
              <div
                className="relative max-h-[90vh] max-w-[90vw] w-full h-full flex items-center justify-center touch-pan-y"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={onLightboxTouchStart}
                onTouchMove={onLightboxTouchMove}
                onTouchEnd={onLightboxTouchEnd}
              >
                {galleryShots.length > 1 && (
                  <div className="md:hidden absolute bottom-16 left-1/2 -translate-x-1/2 text-white/70 text-[12px] tracking-[0.18em] uppercase">
                    Swipe
                  </div>
                )}

                <m.div
                  key={lightboxIndex}
                  className="relative w-full h-full"
                  initial={{
                    opacity: 0,
                    x: lbDir === 1 ? 34 : -34,
                    scale: 0.995,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: lbDir === 1 ? -34 : 34,
                    scale: 0.995,
                  }}
                  transition={{ duration: 0.38, ease: luxuryEase }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <SafeImage
                    src={galleryShots[lightboxIndex].src}
                    alt={`${product.name} – image ${lightboxIndex + 1} of ${galleryShots.length}`}
                    fill
                    className="object-contain select-none"
                    sizes="90vw"
                    quality={95}
                    priority
                    draggable={false}
                    fallbackSrc={product.image}
                  />
                </m.div>

         {galleryShots.length > 1 && 
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="hidden md:inline-flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-12 h-12 items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition duration-300 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      className="hidden md:inline-flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-12 h-12 items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition duration-300 hover:scale-110"
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                }

                <button
                  type="button"
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-12 h-12 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition duration-300 hover:scale-110"
                  aria-label="Close gallery"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-white/90 text-sm font-medium">
                 {lightboxIndex + 1} of {galleryShots.length}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.main>
    </LazyMotion>
  );
}

