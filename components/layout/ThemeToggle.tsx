"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ isOverlay = false }: { isOverlay?: boolean }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    setIsDark(dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }

  if (!mounted) return <div className="w-12 h-8" />;

  return (
    <button
      onClick={toggle}
      aria-label="Toggle tema"
      className={cn(
        "h-8 px-1 font-heading text-sm font-medium transition-colors",
        isOverlay ? "text-white/70 hover:text-white" : "text-fg-muted hover:text-fg"
      )}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
