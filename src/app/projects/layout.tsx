import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Nextrend Systems",
  description: "Curated Nextrend installations filtered by verticals.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen text-[var(--ink,#0D0D0C)]"
      style={{
        // WHITE canvas for /projects index
        ["--surface" as any]: "#ffffff",
        ["--paper"   as any]: "#ffffff",
        ["--card"    as any]: "#fff7ee",
        ["--ink"     as any]: "#0D0D0C",
      }}
    >
      <div aria-hidden className="fixed inset-0 -z-10 bg-[var(--surface,#ffffff)]" />
      {children}
    </div>
  );
}