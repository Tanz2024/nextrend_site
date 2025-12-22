import type { ReactNode } from "react";

export function ServicesPageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen text-neutral-900">{children}</div>;
}

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen text-[var(--ink,#0D0D0C)]"
      style={{
        ["--surface" as any]: "#f7efe3",
        ["--paper" as any]: "#fff7ee",
        ["--card" as any]: "#fff7ee",
        ["--ink" as any]: "#0D0D0C",
      }}
    >
      <div aria-hidden className="fixed inset-0 -z-10 bg-[var(--surface,#f7efe3)]" />
      {children}
    </div>
  );
}
