'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  /** Delay before animation starts (in ms). */
  delay?: number;
  /** Animation duration in seconds (default: 0.75). */
  duration?: number;
  /** Slide direction for entrance (default: 'up'). */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Distance in pixels for the slide (default: 24). */
  distance?: number;
  /** Starting scale multiplier (default: 1). */
  scale?: number;
  className?: string;
  /** Whether animation triggers only once when entering viewport (default: true). */
  once?: boolean;
}

/**
 * Fades and slides content into view when it enters the viewport - 
 * Framer Motion scroll reveal component respecting `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  direction = 'up',
  distance = 20,
  scale = 1,
  className,
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
        return { x: 0, y: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      className={className}
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, ...offset, scale: scale !== 1 ? scale : 1 }
      }
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: '0px 0px -40px 0px', amount: 0.08 }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay / 1000,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

