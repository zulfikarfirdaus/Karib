import type { NextConfig } from "next";
import path from "path";

// Sanity v5 uses useEffectEvent from React 19 stable. Next.js bundles a react
// canary (19.2.0-canary) that does NOT export useEffectEvent, and aliases all
// react/react-dom imports in the appPagesBrowser layer to that canary.
//
// Two-instance problem: previously we only replaced `react$` but left
// `react-dom/client$` pointing to the canary. The canary react-dom/client
// initialises the hook dispatcher against canary internals; stable react looks
// for its own dispatcher → null → "Cannot read properties of null (reading 'use')".
//
// Fix: replace ALL react* and react-dom* aliases with the user's react@19.2.4 /
// react-dom@19.2.4 in the appPagesBrowser layer so there is exactly one React.
// react-server-dom-webpack/* is intentionally left as the canary (RSC streaming
// protocol must match the Next.js server; it is not imported by Sanity).
function patchReactAliasForSanity(rules: any[]) {
  const nm = (p: string) => path.resolve(`node_modules/${p}`);
  const userAliases: Record<string, string> = {
    "react$": nm("react/index.js"),
    "react/compiler-runtime$": nm("react/compiler-runtime.js"),
    "react/jsx-dev-runtime$": nm("react/jsx-dev-runtime.js"),
    "react/jsx-runtime$": nm("react/jsx-runtime.js"),
    "react-dom$": nm("react-dom/index.js"),
    "react-dom/client$": nm("react-dom/client.js"),
    "react-dom/server$": nm("react-dom/server.browser.js"),
    "react-dom/server.browser$": nm("react-dom/server.browser.js"),
    "react-dom/server.edge$": nm("react-dom/server.edge.js"),
    "react-dom/static$": nm("react-dom/static.browser.js"),
    "react-dom/static.browser$": nm("react-dom/static.browser.js"),
    "react-dom/static.edge$": nm("react-dom/static.edge.js"),
  };
  for (const rule of rules || []) {
    if (
      rule.issuerLayer === "app-pages-browser" &&
      typeof rule.resolve?.alias?.["react$"] === "string" &&
      rule.resolve.alias["react$"].includes("next/dist/compiled/react")
    ) {
      Object.assign(rule.resolve.alias, userAliases);
    }
    if (rule.oneOf) patchReactAliasForSanity(rule.oneOf);
    if (rule.rules) patchReactAliasForSanity(rule.rules);
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    loader: "custom",
    loaderFile: "./lib/sanityImageLoader.ts",
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "@phosphor-icons/react"],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      patchReactAliasForSanity(config.module.rules);
    }
    return config;
  },
};

export default nextConfig;
