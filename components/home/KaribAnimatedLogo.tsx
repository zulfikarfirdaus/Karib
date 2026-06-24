"use client";

import Link from "next/link";
import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_FONT_SIZE = 18;
const NAV_TOP = 23;
const SCROLL_END = 280;
const CREAM = "#F4F0E8";

export function KaribAnimatedLogo() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollY } = useScroll();

  const [navLeft, setNavLeft] = useState(16);
  useEffect(() => {
    let lastWidth = window.innerWidth;
    const update = () => setNavLeft(window.innerWidth >= 640 ? 24 : 16);
    update();
    // Only react to width changes — ignore mobile URL-bar height-only resizes
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      update();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Read --fg for nav color (respects theme changes)
  const [navColor, setNavColor] = useState("#1C1C1C");
  useEffect(() => {
    const read = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#1C1C1C";
    setNavColor(read());
    const obs = new MutationObserver(() => setNavColor(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Track whether hero section has fully left the viewport — same logic as Navbar
  const [pastHero, setPastHero] = useState(!isHome);
  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }
    setPastHero(false);
    const hero = document.querySelector<HTMLElement>("[data-hero-section]");
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, [isHome]);

  // Measure hero wordmark position for the morph animation
  const [heroPos, setHeroPos] = useState<{
    left: number;
    top: number;
    fontSize: number;
  } | null>(null);

  useEffect(() => {
    if (!isHome) {
      setHeroPos(null);
      return;
    }
    let lastWidth = window.innerWidth;
    function measure() {
      const el = document.querySelector<HTMLElement>("[data-hero-wordmark]");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setHeroPos({
        left: rect.left,
        // Document-relative top so re-measuring mid-scroll stays consistent
        // (at scroll 0 this equals the viewport top, where the morph begins)
        top: rect.top + window.scrollY,
        fontSize: parseFloat(getComputedStyle(el).fontSize),
      });
    }
    measure();
    const retry = setTimeout(measure, 100);
    // Only re-measure on width changes — mobile URL-bar show/hide fires resize
    // mid-scroll and would otherwise re-render + remap the morph (the glitch)
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      measure();
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(retry);
      window.removeEventListener("resize", onResize);
    };
  }, [isHome]);

  const startLeft = isHome && heroPos ? heroPos.left : navLeft;
  const startTop  = isHome && heroPos ? heroPos.top  : NAV_TOP;
  const startSize = isHome && heroPos ? heroPos.fontSize : NAV_FONT_SIZE;
  const scaleEnd  = NAV_FONT_SIZE / startSize;

  const x     = useTransform(scrollY, [0, SCROLL_END], [startLeft, navLeft]);
  const y     = useTransform(scrollY, [0, SCROLL_END], [startTop,  NAV_TOP]);
  const scale = useTransform(scrollY, [0, SCROLL_END], [1, scaleEnd]);

  if (isHome && !heroPos) return null;

  return (
    <Link
      href="/"
      aria-label="Beranda"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 50 }}
    >
      <motion.span
        animate={{ color: pastHero ? navColor : CREAM }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          display: "block",
          fontSize: startSize,
          transformOrigin: "top left",
          fontFamily: "var(--font-jakarta)",
          fontWeight: 800,
          lineHeight: 0.88,
          letterSpacing: "-0.025em",
          userSelect: "none",
          willChange: "transform",
          x,
          y,
          scale,
        }}
      >
        KARIB
      </motion.span>
    </Link>
  );
}
