import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/sanityImageLoader.ts",
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "@phosphor-icons/react"],
  },
};

export default nextConfig;
