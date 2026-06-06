"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";

export function ScrollHint() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          aria-hidden
        >
          {/* Circular outlined button with bouncing chevron */}
          <motion.div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              border: "1px solid rgba(244,240,232,0.30)",
            }}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <CaretDown size={11} weight="bold" className="text-[#F4F0E8]/60" />
          </motion.div>

          {/* Label */}
          <span
            className="font-display text-[#F4F0E8]/50 uppercase tracking-[0.2em]"
            style={{ fontSize: 10 }}
          >
            Scroll Down
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
