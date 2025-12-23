// src/app/dealers/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Link from "next/link";
import type { DealerRegion } from "./data";
import { dealerRegions } from "./data";
import { Phone, EnvelopeSimple, GlobeSimple, MapPinLine, GlobeHemisphereEast } from "@phosphor-icons/react";

/* ───────── helpers ───────── */
type Option = { value: string; label: string };

const canon = (s?: string) =>
  (s ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

function normalizeDestination(input?: string, fallbackAddress?: string): string | undefined {
  const txt = (input ?? "").trim();
  if (txt) {
    try {
      const u = new URL(txt);
      const q = u.searchParams.get("q") || u.searchParams.get("destination");
      return q || txt;
    } catch {
      return txt;
    }
  }
  return fallbackAddress;
}

function buildDirectionsUrl(dest?: string) {
  return dest ? "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(dest) : undefined;
}

function buildEmbedUrl(dest?: string): string | undefined {
  const d = (dest ?? "").trim();
  if (!d) return undefined;
  return "https://www.google.com/maps?q=" + encodeURIComponent(d) + "&output=embed";
}

function countDealers(regions: DealerRegion[]) {
  return regions.reduce((sum, r) => sum + (r.dealers?.length ?? 0), 0);
}

function formatDealerTypes(types?: string[]) {
  const clean = (types ?? []).map((t) => t.trim()).filter(Boolean);
  return clean.length ? clean.join(" • ") : "—";
}

/* ───────── native select ───────── */
function SelectInlineNative(props: {
  label: string;
  value: string; // "" = All
  onChange: (next: string) => void;
  options: Option[];
  placeholder?: string;
  width?: number;
}) {
  const { label, value, onChange, options, placeholder = "All", width = 280 } = props;
  return (
    <div className="relative inline-block" style={{ minWidth: width }}>
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-[#7d7469]/80">{label}</div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl bg-white/70 px-4 py-3 text-[14px] font-medium text-[#171514] backdrop-blur-sm transition-all hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#d7b17d]/30"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70"
          aria-hidden="true"
        >
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/* ───────── viewport hook ───────── */
function useInViewport<T extends Element>(opts?: IntersectionObserverInit) {
  const [visible, setVisible] = useState(false);
  const nodeRef = useRef<T | null>(null);

  const setRef = (node: T | null) => {
    const prev = nodeRef.current as any;
    if (prev?.__io) {
      prev.__io.disconnect();
      prev.__io = undefined;
    }

    nodeRef.current = node;
    if (!node) return;

    try {
      const rect = node.getBoundingClientRect?.();
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      const vw = window.innerWidth || document.documentElement.clientWidth || 0;
      const intersects =
        rect &&
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top < vh &&
        rect.bottom > 0 &&
        rect.left < vw &&
        rect.right > 0;

      if (intersects) setVisible(true);
    } catch {}

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(node);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0, ...opts }
    );

    io.observe(node);
    (node as any).__io = io;
  };

  useEffect(() => {
    return () => {
      const n = nodeRef.current as any;
      if (n?.__io) n.__io.disconnect();
    };
  }, []);

  return { ref: setRef, visible } as const;
}

/* ───────── TextReveal ───────── */
type TextRevealVariant = "service" | "float" | "slide" | "glow";

const TEXT_REVEAL_VARIANTS: Record<
  TextRevealVariant,
  {
    hidden: CSSProperties;
    visible: CSSProperties;
    animation?: { name: string; duration: string; easing: string };
    transition?: string;
    willChange?: string;
  }
> = {
  service: {
    hidden: { opacity: 0, transform: "translateY(28px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
    transition: "opacity 0.6s ease, transform 0.6s ease",
    willChange: "opacity, transform",
  },
  float: {
    hidden: { opacity: 0, transform: "translate3d(0, 28px, 0) scale(0.96)", filter: "blur(6px)" },
    visible: { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0px)" },
    animation: { name: "ntLuxeFloat", duration: "720ms", easing: "cubic-bezier(0.19, 1, 0.22, 1)" },
    willChange: "opacity, transform, filter",
  },
  slide: {
    hidden: { opacity: 0, transform: "translate3d(-36px, 0, 0) skewX(-6deg)", filter: "blur(4px)" },
    visible: { opacity: 1, transform: "translate3d(0, 0, 0) skewX(0deg)", filter: "blur(0px)" },
    animation: { name: "ntLuxeSlide", duration: "680ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    willChange: "opacity, transform, filter",
  },
  glow: {
    hidden: {
      opacity: 0,
      transform: "translate3d(0, 18px, 0) scale(0.9)",
      filter: "blur(8px)",
      textShadow: "0 24px 48px rgba(23, 21, 20, 0.4)",
    },
    visible: {
      opacity: 1,
      transform: "translate3d(0, 0, 0) scale(1)",
      filter: "blur(0px)",
      textShadow: "0 18px 38px rgba(23, 21, 20, 0.2)",
    },
    animation: { name: "ntLuxeGlow", duration: "760ms", easing: "cubic-bezier(0.165, 0.84, 0.44, 1)" },
    willChange: "opacity, transform, filter",
  },
};

type TextRevealProps = {
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: TextRevealVariant;
};

function TextReveal({ as = "span", delay = 0, className = "", children, style, variant = "service" }: TextRevealProps) {
  const { ref, visible } = useInViewport<HTMLElement>({ threshold: 0 });
  const Comp = as as any;
  const cfg = TEXT_REVEAL_VARIANTS[variant] ?? TEXT_REVEAL_VARIANTS.service;

  useEffect(() => {
    const id = "nt-luxe-animations";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = `
        @keyframes ntLuxeFloat {
          0% { opacity:0; transform:translate3d(0,28px,0) scale(0.96); filter:blur(6px); }
          60% { opacity:1; transform:translate3d(0,-4px,0) scale(1.01); filter:blur(0); }
          100% { opacity:1; transform:translate3d(0,0,0) scale(1); filter:blur(0); }
        }
        @keyframes ntLuxeSlide {
          0% { opacity:0; transform:translate3d(-40px,0,0) skewX(-8deg); filter:blur(4px); }
          70% { opacity:1; transform:translate3d(6px,0,0) skewX(2deg); }
          100% { opacity:1; transform:translate3d(0,0,0) skewX(0deg); filter:blur(0); }
        }
        @keyframes ntLuxeGlow {
          0% { opacity:0; transform:translate3d(0,20px,0) scale(0.9); filter:blur(8px); text-shadow:0 28px 50px rgba(23,21,20,0.4); }
          65% { opacity:1; transform:translate3d(0,-6px,0) scale(1.02); text-shadow:0 22px 40px rgba(23,21,20,0.28); }
          100% { opacity:1; transform:translate3d(0,0,0) scale(1); filter:blur(0); text-shadow:0 18px 30px rgba(23,21,20,0.18); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-nt-luxe] { animation:none !important; }
        }
      `;
      document.head.appendChild(tag);
    }
  }, []);

  const frame = visible ? cfg.visible : cfg.hidden;
  const base: CSSProperties = { ...frame };

  if (cfg.animation) {
    base.animation = visible ? `${cfg.animation.name} ${cfg.animation.duration} ${cfg.animation.easing} forwards` : undefined;
    base.animationDelay = visible ? `${delay}ms` : undefined;
  }
  if (cfg.transition) {
    base.transition = cfg.transition;
    base.transitionDelay = visible ? `${delay}ms` : undefined;
  }
  if (cfg.willChange) base.willChange = cfg.willChange;

  return (
    <Comp ref={ref} data-nt-luxe="true" className={className} style={{ ...base, ...(style ?? {}) }}>
      {children}
    </Comp>
  );
}

/* ───────── cinematic fly-to ───────── */
let ANIMATION_SEQUENCE_ID = 0;

function AnimatedDealerMap({
  destination,
  overview = "Malaysia",
  dealerName,
  dealerCity,
}: {
  destination: string;
  overview?: string;
  dealerName?: string;
  dealerCity?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [state, setState] = useState<"initializing" | "overview" | "flying" | "arrived">("initializing");
  const [textVisible, setTextVisible] = useState(false);
  const sequenceIdRef = useRef(0);

  const { ref, visible } = useInViewport<HTMLDivElement>({ threshold: 0.35 });
  const hasRunRef = useRef(false);

  const overviewSrc = buildEmbedUrl(overview) || "https://www.google.com/maps?q=Malaysia&zoom=6&output=embed";
  const destSrc = buildEmbedUrl(destination) ?? overviewSrc;

  useEffect(() => {
    if (!visible || hasRunRef.current) return;
    hasRunRef.current = true;

    const currentSequenceId = ++ANIMATION_SEQUENCE_ID;
    sequenceIdRef.current = currentSequenceId;

    setState("initializing");
    setSrc(null);
    setTextVisible(false);

    const sequence = async () => {
      if (sequenceIdRef.current !== currentSequenceId) return;
      await new Promise((r) => setTimeout(r, 250));

      if (sequenceIdRef.current !== currentSequenceId) return;
      setState("overview");
      setSrc(overviewSrc);

      await new Promise((r) => setTimeout(r, 750));
      if (sequenceIdRef.current !== currentSequenceId) return;

      setState("flying");
      setTextVisible(true);

      await new Promise((r) => setTimeout(r, 600));
      if (sequenceIdRef.current !== currentSequenceId) return;

      setSrc(destSrc + "&zoom=15&t=" + encodeURIComponent(destination));

      await new Promise((r) => setTimeout(r, 400));
      if (sequenceIdRef.current !== currentSequenceId) return;

      setState("arrived");
      setTextVisible(false);
    };

    sequence();
    return () => {
      if (sequenceIdRef.current === currentSequenceId) sequenceIdRef.current = 0;
    };
  }, [visible, destination, overviewSrc, destSrc]);

  const getStateText = () => {
    switch (state) {
      case "initializing":
        return "Initializing…";
      case "overview":
        return `${overview} Overview`;
      case "flying":
        return `Flying to ${dealerCity || "Location"}…`;
      case "arrived":
        return `${dealerName || "Dealer"} Location`;
      default:
        return "Location";
    }
  };

  return (
    <div className="mt-5">
      <div
        ref={ref}
        className={`relative h-[34vh] w-full overflow-hidden rounded-[18px] transition-all duration-1000 ease-out ${
          state === "flying" ? "scale-[1.02] shadow-2xl shadow-[#d7b17d]/20" : "scale-100"
        }`}
        style={{
          background:
            state === "flying"
              ? "linear-gradient(135deg, #f0ebe3 0%, #e8e2d7 50%, #f0ebe3 100%)"
              : "linear-gradient(135deg, #f0ebe3 0%, #e8e2d7 100%)",
        }}
      >
        {!src && <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,#f5efe6,45%,#efe6da,55%,#f5efe6)] bg-[length:200%_100%]" />}

        {src && (
          <iframe
            key={src}
            title={`Dealer Map - ${destination}`}
            src={src}
            loading="lazy"
            className={`h-full w-full border-0 transition-all duration-800 ease-out ${
              state === "flying" ? "opacity-80 blur-[1px]" : "opacity-100 blur-0"
            }`}
            allowFullScreen
          />
        )}

        <span
          className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] transition-all duration-700 ${
            state === "flying"
              ? "bg-gradient-to-r from-[#d7b17d]/80 via-[#f4d03f]/60 to-[#d7b17d]/80"
              : "bg-gradient-to-r from-transparent via-[#d7b17d]/40 to-transparent"
          }`}
        />

        <div
          className={`pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-[#171514] transition-all duration-500 ${
            state === "flying" ? "bg-[#f4d03f]/90 shadow-lg" : "bg-white/90"
          }`}
        >
          <GlobeHemisphereEast
            size={12}
            className={`transition-all duration-500 ${state === "flying" ? "text-[#171514] animate-spin" : "text-[#d7b17d]"}`}
          />
          <TextReveal as="span" key={state} className="font-semibold">
            {getStateText()}
          </TextReveal>
        </div>

        {textVisible && state === "flying" && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-[#d7b17d]/10 to-[#f4d03f]/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center animate-[luxuryFadeUp_800ms_ease-out_forwards] space-y-2">
                <div className="text-2xl font-bold text-[#171514] drop-shadow-lg">{dealerName}</div>
                <div className="text-lg text-[#7d7469] drop-shadow-md">{dealerCity}</div>
                <div className="mx-auto h-[2px] w-16 animate-pulse bg-gradient-to-r from-transparent via-[#d7b17d] to-transparent" />
              </div>
            </div>
          </div>
        )}

        {state === "arrived" && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d7b17d]/40 animate-ping" />
            <div className="animation-delay-150 absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d7b17d]/60 animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── page ───────── */
export function DealersContent() {
  const [region, setRegion] = useState<string>("");
  const [ctype, setCtype] = useState<string>("");

  const regionOptions = useMemo<Option[]>(
    () => Array.from(new Set(dealerRegions.map((r) => r.title.trim()))).map((label) => ({ label, value: canon(label) })),
    []
  );

  const typeOptions = useMemo<Option[]>(() => {
    const set = new Set<string>();
    dealerRegions.forEach((r) => r.dealers.forEach((d) => d.contactTypes?.forEach((t) => set.add(t))));
    return Array.from(set).map((label) => ({ label, value: canon(label) }));
  }, []);

  const filtered: DealerRegion[] = useMemo(() => {
    const regionCanon = canon(region);
    const typeCanon = canon(ctype);

    const base = regionCanon ? dealerRegions.filter((r) => canon(r.title) === regionCanon) : dealerRegions;
    if (!typeCanon) return base;

    return base
      .map((r) => ({
        ...r,
        dealers: r.dealers.filter((d) => (d.contactTypes || []).some((t) => canon(t) === typeCanon)),
      }))
      .filter((r) => r.dealers.length > 0);
  }, [region, ctype]);

  const total = useMemo(() => countDealers(filtered), [filtered]);

  const clearFilters = () => {
    setRegion("");
    setCtype("");
  };

  return (
    <main className="min-h-screen text-[#171514]">
      <style jsx global>{`
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>

      {/* hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_380px_at_20%_12%,rgba(215,177,125,0.18),transparent_55%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_380px_at_80%_8%,rgba(215,177,125,0.18),transparent_55%)]" />

        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-20 sm:px-6 lg:px-10">
          <TextReveal as="p" className="pt-2 text-[11px] font-semibold uppercase tracking-[0.5em] text-[#7d7469]" delay={80}>
            NEXTREND DEALER NETWORK
          </TextReveal>

          <TextReveal
            as="h1"
            className="mt-4 text-4xl font-light text-[#171514] leading-tight sm:text-[3.2rem]"
            style={{ fontFamily: "Playfair Display, Times New Roman, ui-serif, Georgia, serif" }}
            delay={160}
          >
            Your Trusted AV Partner
          </TextReveal>

          <TextReveal as="p" className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#7d7469]" delay={240}>
            Find an authorized Nextrend dealer for K-array, Brionvega, and BE@RBRICK AUDIO in Malaysia and across the region.
            Visit curated showrooms for immersive demos, elegant design, and personalized consultations — crafted to your lifestyle.
          </TextReveal>

          <div className="mt-10 flex flex-wrap items-end gap-8 lg:gap-12">
            <SelectInlineNative label="Region" placeholder="All regions" value={region} onChange={setRegion} options={regionOptions} />
            <SelectInlineNative label="Dealer Type" placeholder="All dealer types" value={ctype} onChange={setCtype} options={typeOptions} />
          </div>
        </div>
      </section>

      {/* list */}
      <section className="mx-auto max-w-[1200px] px-4 pb-24 pt-8 sm:px-6 lg:px-10">
        {total === 0 ? (
          <div className="rounded-2xl border border-[#d7b17d]/25 bg-white/70 p-8 backdrop-blur-sm">
            <TextReveal as="p" className="text-[11px] font-semibold uppercase tracking-[0.5em] text-[#7d7469]" delay={60}>
              No matches
            </TextReveal>

            <TextReveal
              as="h2"
              className="mt-3 text-2xl font-light leading-tight text-[#171514]"
              style={{ fontFamily: "Playfair Display, Times New Roman, ui-serif, Georgia, serif" }}
              delay={120}
            >
              No dealers found for your current selection.
            </TextReveal>

            <TextReveal as="p" className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#7d7469]" delay={180}>
              Try a different region or dealer type, or clear filters to view the full dealer network.
            </TextReveal>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center rounded-full bg-[#171514] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-white transition-all hover:opacity-90"
              >
                Clear filters
              </button>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white/70 px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-[#7d7469] ring-1 ring-[#d7b17d]/40 transition-all hover:bg-white"
              >
                Request a dealer
              </Link>
            </div>
          </div>
        ) : (
          filtered.map((region, regionIdx) => {
            const regionDelay = regionIdx * 80;

            return (
              <div key={region.id} className="space-y-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <TextReveal as="h2" className="text-[1.5rem] font-semibold text-[#171514]" delay={regionDelay}>
                      {region.title}
                    </TextReveal>
                    <TextReveal as="p" className="mt-1 text-[11px] uppercase tracking-[0.3em] text-[#7d7469]" delay={regionDelay + 80}>
                      {region.coverage}
                    </TextReveal>
                  </div>

                  <TextReveal as="p" className="max-w-xl text-sm text-[#7d7469]" delay={regionDelay + 120}>
                    {region.summary}
                  </TextReveal>
                </div>

                <ul className="space-y-8">
                  {region.dealers.map((d, idx) => {
                    const dealerDelayBase = regionDelay + idx * 90;
                    const key = `${region.id}-${idx}-${canon(d.name)}`;
                    const fallback = d.address.join(", ");
                    const dest = normalizeDestination(d.mapHref, fallback) || fallback;
                    const directions = buildDirectionsUrl(dest);

                    const phone = d.contacts?.find((c) => canon(c.label) === "phone");
                    const email = d.contacts?.find((c) => canon(c.label) === "email");
                    const website = d.contacts?.find((c) => canon(c.label) === "website");

                    return (
                      <li key={key} className="rounded-2xl p-0">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,1fr)]">
                          {/* left */}
                          <div className="space-y-3">
                            <div>
                              {/* Dealer Type label line */}
                              <TextReveal
                                as="p"
                                className="text-[10px] font-bold uppercase tracking-[0.42em] text-[#7d7469]/80"
                                delay={dealerDelayBase + 20}
                              >
                                DEALER TYPE
                              </TextReveal>

                              {/* Dealer types value */}
                              <TextReveal
                                as="p"
                                className="mt-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#171514]/70"
                                delay={dealerDelayBase + 40}
                              >
                                {formatDealerTypes(d.contactTypes)}
                              </TextReveal>

                              <TextReveal as="h3" className="mt-3 text-[1.35rem] font-semibold leading-tight text-[#171514]" delay={dealerDelayBase + 60}>
                                {d.name}
                              </TextReveal>

                              <TextReveal as="p" className="mt-1 text-[14px] font-medium text-[#7d7469]" delay={dealerDelayBase + 100}>
                                {d.city}
                              </TextReveal>
                            </div>

                            <div className="space-y-2">
                              <div className="inline-flex items-start gap-3">
                                <MapPinLine size={18} className="mt-0.5 flex-shrink-0 text-[#d7b17d]" />
                                {directions ? (
                                  <TextReveal as="span" className="inline-block" delay={dealerDelayBase + 140}>
                                    <Link
                                      href={directions}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[14px] leading-relaxed text-[#171514]/85 underline decoration-[#d7b17d]/30 underline-offset-[3px] transition-colors hover:text-[#d7b17d] hover:decoration-[#d7b17d]/70"
                                    >
                                      {d.address.join(", ")}
                                    </Link>
                                  </TextReveal>
                                ) : (
                                  <TextReveal as="span" className="text-[14px] leading-relaxed text-[#171514]/85" delay={dealerDelayBase + 140}>
                                    {d.address.join(", ")}
                                  </TextReveal>
                                )}
                              </div>

                              {!!d.hours?.length && (
                                <div className="ml-7 space-y-1">
                                  {d.hours.map((line) => (
                                    <TextReveal
                                      key={line}
                                      as="p"
                                      className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#7d7469]"
                                      delay={dealerDelayBase + 170}
                                    >
                                      {line}
                                    </TextReveal>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="ml-7 flex flex-wrap items-center gap-6 pt-2">
                              {phone && (
                                <TextReveal as="span" className="inline-block" delay={dealerDelayBase + 210}>
                                  <a
                                    href={phone.href}
                                    className="inline-flex items-center gap-2 text-[13px] font-medium text-[#d7b17d] transition-colors hover:text-[#171514]"
                                  >
                                    <Phone size={16} />
                                    <span>{phone.value}</span>
                                  </a>
                                </TextReveal>
                              )}
                              {email && (
                                <TextReveal as="span" className="inline-block" delay={dealerDelayBase + 230}>
                                  <a
                                    href={email.href}
                                    className="inline-flex items-center gap-2 text-[13px] font-medium text-[#d7b17d] transition-colors hover:text-[#171514]"
                                  >
                                    <EnvelopeSimple size={16} />
                                    <span>{email.value}</span>
                                  </a>
                                </TextReveal>
                              )}
                              {website && (
                                <TextReveal as="span" className="inline-block" delay={dealerDelayBase + 250}>
                                  <a
                                    href={website.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[13px] font-medium text-[#d7b17d] transition-colors hover:text-[#171514]"
                                  >
                                    <GlobeSimple size={16} />
                                    <span>{website.value}</span>
                                  </a>
                                </TextReveal>
                              )}
                            </div>
                          </div>

                          {/* right */}
                          <AnimatedDealerMap destination={dest} overview={region.title} dealerName={d.name} dealerCity={d.city} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#f7f3ec] text-[#171514]">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="space-y-3">
            <TextReveal as="p" className="text-[11px] font-semibold uppercase tracking-[0.5em] text-[#7d7469]" delay={80}>
              PREMIUM AV SOLUTIONS
            </TextReveal>

            <TextReveal
              as="h2"
              className="text-3xl font-light leading-tight text-[#171514]"
              style={{ fontFamily: "Playfair Display, Times New Roman, ui-serif, Georgia, serif" }}
              delay={140}
            >
              Join the Nextrend Dealer Network
            </TextReveal>

            <TextReveal as="p" className="text-[15px] leading-relaxed text-[#7d7469]" delay={200}>
              Partner with Nextrend to offer K-array, Brionvega, and BE@RBRICK AUDIO — with training, support, and priority access to upcoming collections.
            </TextReveal>
          </div>

          <TextReveal delay={260} className="flex shrink-0">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full
                         bg-gradient-to-br from-white via-[#FFF9F2] to-[#F6E6CF]
                         px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.3em]
                         text-[#7d7469] ring-1 ring-[#d7b17d]/50
                         shadow-[0_6px_18px_rgba(215,177,125,0.25)]
                         transition-all hover:shadow-[0_12px_28px_rgba(215,177,125,0.35)]"
              aria-label="Join the Nextrend Dealer Network"
            >
              <span>Become Our Partner</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                <path
                  d="M5 12h12M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </TextReveal>
        </div>
      </section>
    </main>
  );
}

export default function DealersPage() {
  return <DealersContent />;
}
