import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Serve modern formats; AVIF first, WebP fallback.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  experimental: {
    // Tree-shake large icon/chart libs to keep client bundles small.
    optimizePackageImports: ["lucide-react", "recharts", "date-fns"],
  },
};

export default withBundleAnalyzer(nextConfig);
