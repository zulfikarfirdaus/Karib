import type { NextConfig } from "next";
import path from "path";

// Sanity v5 uses useEffectEvent from React 19 stable. Next.js bundles a react
// canary that does NOT export useEffectEvent. When sanity modules land in the
// appPagesBrowser webpack layer, they get the canary alias and the build fails.
// Fix: replace the canary alias with the user's actual react@19.2.4 for that layer.
function patchReactAliasForSanity(
  rules: any[],
  userReact: string,
  userReactDom: string
) {
  for (const rule of rules || []) {
    if (
      rule.issuerLayer === "app-pages-browser" &&
      typeof rule.resolve?.alias?.["react$"] === "string" &&
      rule.resolve.alias["react$"].includes("next/dist/compiled/react")
    ) {
      const a = rule.resolve.alias;
      a["react$"] = userReact;
      if (a["react-dom$"]) a["react-dom$"] = userReactDom;
      if (a["react/jsx-runtime$"])
        a["react/jsx-runtime$"] = require.resolve("react/jsx-runtime");
      if (a["react/jsx-dev-runtime$"])
        a["react/jsx-dev-runtime$"] = require.resolve("react/jsx-dev-runtime");
    }
    if (rule.oneOf) patchReactAliasForSanity(rule.oneOf, userReact, userReactDom);
    if (rule.rules) patchReactAliasForSanity(rule.rules, userReact, userReactDom);
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
      const userReact = path.resolve("node_modules/react/index.js");
      const userReactDom = path.resolve("node_modules/react-dom/index.js");
      patchReactAliasForSanity(config.module.rules, userReact, userReactDom);
    }
    return config;
  },
};

export default nextConfig;
