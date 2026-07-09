'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  /** Matches the original .reveal-d1 / .reveal-d2 transition-delay steps (in ms). */
  delay?: 0 | 80 | 160;
  className?: string;
  as?: 'div' | 'li';
}

/**
 * Fades and slides content up into view the first time it enters the
 * viewport — a Framer Motion equivalent of the original CSS `.reveal` /
 * IntersectionObserver combo, respecting `prefers-reduced-motion`.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px', amount: 0.08 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.85,
        delay: shouldReduceMotion ? 0 : delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
