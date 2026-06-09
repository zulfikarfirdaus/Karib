"use client";
import dynamic from "next/dynamic";

// Client component — ssr:false requires next/dynamic to be in a client component.
// a client reference for StudioInner, without analyzing its full import tree
// (which includes Sanity modules that use useEffectEvent, a React 19 client-only API
// absent from the react-server bundle used for SSR compilation).
const StudioInner = dynamic(() => import("./StudioInner"), { ssr: false });

export default function StudioPage() {
  return <StudioInner />;
}
