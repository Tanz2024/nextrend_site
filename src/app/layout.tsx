// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { buildGeneralImageUrl } from "@/lib/assets";
// @ts-ignore: side-effect import of global CSS without type declarations
import "./global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nextrend Systems | Architectural Sound Solution",
    template: "%s | Nextrend",
  },
  description:
    "Experience the latest in sound innovation. Nextrend Systems delivers architectural sound solutions for commercial and residential spaces.",
  metadataBase: new URL("https://www.nextrend.com"),
  openGraph: {
    title: "Nextrend Systems | Architectural Sound Solution",
    description:
      "Experience the latest in sound innovation. Nextrend Systems expertise in commercial and residential sound solutions.",
    type: "website",
    locale: "en_US",
    url: "https://www.nextrend.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextrend Systems | Architectural Sound Solution",
    description:
      "Experience the latest in sound innovation. Nextrend Systems expertise in commercial and residential sound solutions.",
  },
  icons: {
    // you can point both sizes to the same PNG if you exported it large + tight
    icon: [
      {
        url: buildGeneralImageUrl("Nextrend_favicon2.png"),
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: buildGeneralImageUrl("Nextrend_favicon2.png"),
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: {
      url: buildGeneralImageUrl("Nextrend_favicon2.png"),
      sizes: "32x32",
      type: "image/png",
    },
    apple: {
      // ideally a 180x180 export with same design
      url: buildGeneralImageUrl("Nextrend_favicon2.png"),
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // dark brand color helps some UIs choose better contrast for tab / address bar
  themeColor: "#221714",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]"
        style={{
          ["--surface" as any]: "#ffffff",
          ["--paper" as any]: "#ffffff",
          ["--card" as any]: "#fff7ee",
          ["--ink" as any]: "#0D0D0C",
        }}
      >
        <AppShell className="bg-transparent">{children}</AppShell>
      </body>
    </html>
  );
}
