'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ParallaxProps {
  children: ReactNode;
  /** Distance in pixels for the vertical movement (e.g., 30 for Hero image, 8 for Hero text, 10 for Project cards). */
  speed?: number;
  /** Movement direction relative to scroll: 'up' (moves upward faster) or 'down' (moves downward/slower). Default: 'up' */
  direction?: 'up' | 'down';
  /** Set to true for hero section elements so animation starts at 0px offset on initial page load. */
  isHero?: boolean;
  className?: string;
}

/**
 * High-performance hardware-accelerated scroll parallax wrapper.
 * Strictly respects `prefers-reduced-motion` and avoids layout shifts by mutating transform only.
 */
export function Parallax({
  children,
  speed = 10,
  direction = 'up',
  isHero = false,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: isHero ? ['start start', 'end start'] : ['start end', 'end start'],
  });

  // Calculate transform bounds
  const outputRange = isHero
    ? direction === 'down'
      ? [0, speed]
      : [0, -speed]
    : direction === 'up'
    ? [speed, -speed]
    : [-speed, speed];

  const y = useTransform(scrollYProgress, [0, 1], outputRange);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: shouldReduceMotion ? 0 : y,
      }}
    >
      {children}
    </motion.div>
  );
}
