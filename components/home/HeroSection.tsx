"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { ScrollHint } from "./ScrollHint";
import { BlurText } from "@/components/ui/BlurText";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const copyOpacity = useTransform(scrollYProgress, [0, 0.4],  [1, 0]);
  const copyY       = useTransform(scrollYProgress, [0, 0.4],  [0, -50]);
  const copyBlur    = useTransform(scrollYProgress, [0, 0.35], ["blur(0px)", "blur(14px)"]);

  const boxOpacity  = useTransform(scrollYProgress, [0.02, 0.38], [1, 0]);
  const boxY        = useTransform(scrollYProgress, [0.02, 0.38], [0, -40]);
  const boxBlur     = useTransform(scrollYProgress, [0.02, 0.32], ["blur(0px)", "blur(14px)"]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const blurTextProps = {
    text: "Dirancang untuk mengingatkan, menjawab, dan menguatkan. Karib hadir menemanimu dalam setiap langkah perjalanan ilmu.",
    animateBy: "words" as const,
    direction: "bottom" as const,
    delay: 60,
    stepDuration: 0.45,
    className: "font-serif text-[#F4F0E8] leading-[1.4]",
  };

  return (
    <section ref={ref} data-hero-section className="relative h-[100dvh] overflow-hidden bg-[#100904]">

      {/* ── Invisible wordmark placeholder for KaribAnimatedLogo measurement ── */}
      <div
        className="absolute left-6 sm:left-10 select-none pointer-events-none z-10 hero-wordmark-pos"
      >
        <span
          data-hero-wordmark
          className="font-display font-extrabold block leading-none"
          style={{ fontSize: "clamp(110px, 24vw, 220px)", lineHeight: 0.88, letterSpacing: "-0.025em", opacity: 0 }}
        >
          KARIB
        </span>
      </div>

      {/* ── Background image ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero.png" alt="" aria-hidden className="w-full h-full object-cover object-center" style={{ opacity: 0.55 }} />
      </div>

      {/* ── Body copy — mobile: upper-left above the man | desktop: right, centred ── */}

      {/* Mobile + tablet */}
      <motion.div
        className="md:hidden absolute left-6 right-6 z-10"
        style={{
          top: "clamp(440px, 67vh, 570px)",
          opacity: copyOpacity,
          y: copyY,
          filter: copyBlur,
        }}
      >
        <BlurText {...blurTextProps} style={{ fontSize: "clamp(1rem, 4.5vw, 1.2rem)", fontWeight: 400 }} />
      </motion.div>

      {/* Desktop only */}
      <motion.div
        className="hidden md:block absolute right-8 md:right-12 lg:right-16 z-10"
        style={{
          top: "50%",
          translateY: "-50%",
          maxWidth: 480,
          opacity: copyOpacity,
          y: copyY,
          filter: copyBlur,
        }}
      >
        <BlurText {...blurTextProps} style={{ fontSize: "clamp(1rem, 1.6vw, 1.4rem)", fontWeight: 400 }} />
      </motion.div>

      {/* ── Info box — desktop only ───────────────────────────────────────────── */}
      <motion.div
        className="hidden md:block absolute bottom-14 left-10 z-10"
        style={{ width: 180, opacity: boxOpacity, y: boxY, filter: boxBlur }}
      >
        <div
          className="p-6 backdrop-blur-md"
          style={{ background: "rgba(244,240,232,0.08)", border: "1px solid rgba(244,240,232,0.14)" }}
        >
          <p
            className="font-display text-[#F4F0E8] uppercase font-extrabold leading-tight"
            style={{ fontSize: "clamp(0.75rem, 1.1vw, 1rem)", letterSpacing: "-0.01em" }}
          >
            Platform ilmu<br />
            Al-Qur&apos;an &amp; Sunnah
          </p>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(244,240,232,0.25)" }}>
            <p className="font-serif text-[#F4F0E8]/60 text-left leading-snug" style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.8rem)" }}>
              Diasuh Oleh<br />
              Ustadz Muhammad<br />
              Ibrahim Saleh, Lc.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll hint ───────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: hintOpacity }}
      >
        <ScrollHint />
      </motion.div>

    </section>
  );
}
