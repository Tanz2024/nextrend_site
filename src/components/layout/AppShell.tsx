// src/components/layout/AppShell.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ConsentAwareScripts } from "@/components/layout/ConsentAwareScripts";
import { ToastProvider } from "@/components/ui/ToastProvider";

const SiteHeaderNoSSR = dynamic(
  () => import("@/components/layout/SiteHeader").then((m) => m.SiteHeader),
  { ssr: false }
);
const SiteFooterNoSSR = dynamic(
  () => import("@/components/layout/SiteFooter").then((m) => m.SiteFooter),
  { ssr: false }
);

type AppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  return (
    <ToastProvider>
      <SiteHeaderNoSSR />

      {/* Use the per-route CSS var so /projects is WHITE and /projects/[slug] is CREAM */}
      <main
        className={[
          "relative min-h-screen",
          "bg-[var(--surface)] text-[var(--ink,#1A1A1A)]",
          className || "",
        ].join(" ")}
      >
        {children}
      </main>

      <SiteFooterNoSSR />
      <ConsentAwareScripts />
      <CookieBanner />
    </ToastProvider>
  );
}
