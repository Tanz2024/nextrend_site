"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  onClose?: () => void;
  duration?: number;
};

export function Toast({ message, onClose, duration = 3600 }: ToastProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setOpen(false);
      onClose?.();
    }, duration);
    return () => window.clearTimeout(timeout);
  }, [duration, onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="pointer-events-auto">
      <div
        className="
          relative flex min-w-[280px] items-center gap-3 rounded-full
          border border-[#d9c4a4]/70 px-5 py-3 text-[#2a1c13]
          shadow-[0_18px_45px_rgba(40,25,15,0.35)] backdrop-blur
        "
        style={{
          background:
            "linear-gradient(135deg, rgba(255,244,227,0.96), rgba(236,210,170,0.95))",
        }}
      >
        <span
          aria-hidden
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/65 text-[#c38c52] shadow-inner"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="m5 12 4 4 10-10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-sm leading-relaxed tracking-[0.05em] font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
