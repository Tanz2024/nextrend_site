"use client";

import { LockSimple } from "@phosphor-icons/react";

declare global {
  interface Window {
    nextrendOpenCookiePanel?: () => void;
  }
}

type CookiePreferencesTriggerProps = {
  className?: string;
};

export function CookiePreferencesTrigger({
  className = "",
}: CookiePreferencesTriggerProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.nextrendOpenCookiePanel) {
      window.nextrendOpenCookiePanel();
    }
  };

  const baseClass = [
    "cookie-trigger group relative flex h-12 w-12 items-center justify-center rounded-[1.1rem]",
    "border border-[#e7dccd] bg-white text-[#cfa96c]",
    "shadow-[0_15px_32px_rgba(14,11,7,0.22)] transition-all duration-300",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Open cookie preferences"
        className={baseClass}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white via-[#fff9f0] to-[#f2e5d2]"
        />
        <span
          aria-hidden
          className="absolute -inset-3 rounded-[1.6rem] bg-[#d8b98b]/30 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
        />
        <span className="relative flex items-center justify-center text-current">
          <LockSimple size={20} weight="fill" />
        </span>
      </button>

      <style jsx>{`
        .cookie-trigger {
          animation: cookie-float 6s ease-in-out infinite;
        }
        .cookie-trigger:hover {
          transform: translateY(-4px) scale(1.01);
        }
        @keyframes cookie-float {
          0% {
            transform: translateY(0px);
            box-shadow: 0 15px 32px rgba(14, 11, 7, 0.18);
          }
          50% {
            transform: translateY(-4px);
            box-shadow: 0 18px 35px rgba(14, 11, 7, 0.25);
          }
          100% {
            transform: translateY(0px);
            box-shadow: 0 15px 32px rgba(14, 11, 7, 0.18);
          }
        }
      `}</style>
    </>
  );
}
