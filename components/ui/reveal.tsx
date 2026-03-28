"use client";

import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
