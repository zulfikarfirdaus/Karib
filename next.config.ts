import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/sanityImageLoader.ts",
  },
  experimental: {
    useCache: true,
    optimizePackageImports: ["framer-motion", "@phosphor-icons/react"],
  },
};

export default nextConfig;
