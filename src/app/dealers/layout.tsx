// app/dealers/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Dealers • Nextrend" };

export default function DealersLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-dvh text-[var(--nt-ink)]"
      style={
        {
          ["--nt-cream" as any]: "#F7F3EC",
          ["--nt-ink" as any]: "#171514",
          ["--nt-champagne" as any]: "#D7B17D",
        } as React.CSSProperties
      }
    >
      {/* viewport-wide cream background without styled-jsx */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-[var(--nt-cream)]" />

      {/* page content */}
      <div className="min-h-dvh">{children}</div>
    </div>
  );
}
