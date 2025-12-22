// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const withBundleAnalyzer =
  require("@next/bundle-analyzer")({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  reactCompiler: isProd,
  productionBrowserSourceMaps: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 80],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: "default",
    domains: [],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-a586f8df725f44d0ae84aca2de08f2bc.r2.dev",
      },
    ],
  },

  logging: {
    fetches: { fullUrl: false },
  },

  allowedDevOrigins: ["http://192.168.0.128:3000"],

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withBundleAnalyzer(nextConfig);
