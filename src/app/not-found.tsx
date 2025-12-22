"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function NoteMark(props: { className?: string }) {
  return (
    <span
      aria-hidden
      className={[
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border border-black/10 bg-white/55 backdrop-blur-sm",
        props.className ?? "",
      ].join(" ")}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#C6AA76]" fill="none">
        <path
          d="M14 3v11.3c-.7-.4-1.6-.6-2.6-.5-2 .2-3.6 1.6-3.4 3.1.2 1.6 2.1 2.7 4.2 2.5 2-.2 3.6-1.6 3.4-3.1V8.2l6-1.3V3.9L14 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function NotFound() {
  const router = useRouter();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!pulse) return;
    const t = window.setTimeout(() => setPulse(false), 900);
    return () => window.clearTimeout(t);
  }, [pulse]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#FAF8F3] text-[#141414]">
      {/* soft luxury wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_55%_at_18%_12%,rgba(198,170,118,0.12)_0%,transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_88%_16%,rgba(0,0,0,0.05)_0%,transparent_60%)]" />

      {/* watermark 404 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[52%] top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
          <div className="text-[clamp(14rem,34vw,34rem)] font-semibold tracking-[-0.08em] text-black/[0.045]">
            404
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1180px] px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* LEFT */}
          <section className="space-y-10">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <NoteMark />
                <p className="text-[11px] uppercase tracking-[0.36em] text-[#8a8379]">
                  Page not found
                </p>
              </div>
              <div className="h-px w-28 bg-[rgba(198,170,118,0.55)]" />
            </div>

            <div className="space-y-5">
              <h1 className="font-[var(--font-serif)] text-[clamp(2.4rem,4.8vw,3.6rem)] leading-[1.02] tracking-[-0.02em]">
                Page not found.
              </h1>

              <p className="max-w-[42rem] text-[0.98rem] leading-[2.0] text-[#6f6a62]">
                The page may have moved, or the link is outdated.
              </p>

              <p className="text-[11px] uppercase tracking-[0.34em] text-[#9a9388]">
                Error code: 404
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className={[
                  "inline-flex items-center justify-center rounded-full px-7 py-2.5",
                  "border border-[rgba(198,170,118,0.55)]",
                  "text-[11px] font-medium uppercase tracking-[0.30em] text-[#141414]",
                  "transition-colors hover:bg-[rgba(198,170,118,0.10)] active:bg-[rgba(198,170,118,0.14)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6AA76]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F3]",
                ].join(" ")}
              >
                Go back
              </button>

              <Link
                href="/"
                className={[
                  "inline-flex items-center justify-center rounded-full px-7 py-2.5",
                  "border border-[rgba(198,170,118,0.55)]",
                  "text-[11px] font-medium uppercase tracking-[0.30em] text-[#141414]",
                  "transition-colors hover:bg-[rgba(198,170,118,0.10)] active:bg-[rgba(198,170,118,0.14)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6AA76]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F3]",
                ].join(" ")}
              >
                Home
              </Link>

             <Link
  href="/contact"
  onClick={() => setPulse(true)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") setPulse(true);
  }}
  className={[
    "supportBtn group inline-flex items-center justify-center gap-3 rounded-full px-7 py-2.5",
    // LV-clean: light fill + dark text (high contrast)
    "bg-[#D7C2A3] hover:bg-[#CDB58F] active:bg-[#C0A57C]",
    "!text-[#141414] hover:!text-[#141414] active:!text-[#141414] visited:!text-[#141414]",
    "text-[11px] font-semibold uppercase tracking-[0.28em]",
    "shadow-[0_14px_40px_rgba(0,0,0,0.10)] transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6AA76]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F3]",
    pulse ? "supportPulse" : "",
  ].join(" ")}
>
  <span className="whitespace-nowrap">Contact support</span>

  <span aria-hidden className="inline-flex items-end gap-[3px]">
    <i className="bar h-[7px] w-[2px] rounded-full bg-[#141414]/70" />
    <i className="bar h-[12px] w-[2px] rounded-full bg-[#141414]/70" />
    <i className="bar h-[9px] w-[2px] rounded-full bg-[#141414]/70" />
  </span>
</Link>
            </div>
          </section>  

          {/* RIGHT */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-black/10 bg-white/55 px-8 py-8 backdrop-blur-sm shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              <p className="text-[11px] uppercase tracking-[0.36em] text-[#8a8379]">
                Suggested routes
              </p>

              <div className="mt-6 space-y-2">
                {[
                  { label: "Home", href: "/" },
                  { label: "Events", href: "/events" },
                  { label: "Projects", href: "/projects" },
                  { label: "Products", href: "/products" },
                ].map((x) => (
                  <Link
                    key={x.href}
                    href={x.href}
                    className={[
                      "group flex items-center justify-between rounded-2xl px-4 py-4",
                      "transition-colors hover:bg-black/[0.03] active:bg-black/[0.04]",
                    ].join(" ")}
                  >
                    <span className="text-[12px] font-medium uppercase tracking-[0.34em] text-[#141414]">
                      {x.label}
                    </span>
                    <span className="text-[#C6AA76] transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-7 h-px w-full bg-black/10" />

              <p className="mt-6 text-[12px] leading-[1.95] text-[#7b756c]">
                If you arrived here from a link inside the site, it may be an older reference.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        /* pulse only on click */
        .supportBtn .bar {
          transform-origin: bottom;
        }
        .supportPulse .bar {
          animation: bars 0.28s ease-in-out 0s 6;
        }
        .supportPulse .bar:nth-child(2) {
          animation-delay: 0.05s;
        }
        .supportPulse .bar:nth-child(3) {
          animation-delay: 0.1s;
        }
        @keyframes bars {
          0%,
          100% {
            transform: scaleY(0.75);
            opacity: 0.85;
          }
          50% {
            transform: scaleY(1.35);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .supportPulse .bar {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
