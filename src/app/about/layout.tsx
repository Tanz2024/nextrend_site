// app/about/layout.tsx
import type { ReactNode, CSSProperties } from "react";

const CREAM = "#f5eee5";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen text-[#1A1A1A]"
      style={
        {
          background: CREAM,
          ["--page-bg" as any]: CREAM,
          ["--tile-bg" as any]: CREAM,
          ["--tile-ring" as any]: "rgba(0,0,0,0.08)",
          ["--tile-shadow" as any]: "none",
        } as CSSProperties
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body { background:${CREAM} !important; }
            body::before, body::after { content:none !important; background:none !important; }
            main::before, main::after { content:none !important; background:none !important; }
            [data-ambient]{ display:none !important; }
          `,
        }}
      />
      {children}
    </div>
  );
}
