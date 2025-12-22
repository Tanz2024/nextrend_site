// app/products/k-array/layout.tsx
export default function KArrayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen bg-white text-[#1A1A1A] [background-image:none]"
      style={
        {
          ["--page-bg" as any]: "#ffffff",
          ["--tile-bg" as any]: "#ffffff",
          ["--tile-ring" as any]: "rgba(0,0,0,0.08)",
          ["--tile-shadow" as any]: "none",
        } as React.CSSProperties
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body { background:#fff !important; }
            body::before, body::after { content:none !important; background:none !important; }
            main::before, main::after { content:none !important; background:none !important; }
            /* hide any global ambient blobs if present */
            [data-ambient]{ display:none !important; }
          `,
        }}
      />
      {children}
    </div>
  );
}
