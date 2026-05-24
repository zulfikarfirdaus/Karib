import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: process.env.DISABLE_CACHE_COMPONENTS !== "1",
  images: {
    loader: "custom",
    loaderFile: "./lib/sanityImageLoader.ts",
  },
  experimental: {
    serverComponentsHmrCache: true,
    optimizePackageImports: ["framer-motion", "@phosphor-icons/react"],
  },
};

export default nextConfig;
