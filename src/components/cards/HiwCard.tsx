'use client';

import type { HowItWorksCard } from '@/types';
import { motion } from 'framer-motion';

interface HiwCardProps {
  card: HowItWorksCard;
}

export function HiwCard({ card }: HiwCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`hiw-card hiw-card--${card.variant}`}
    >
      <span className="hiw-card__number">{card.number}</span>
      <div className="hiw-card__body">
        <h3 className="hiw-card__title">{card.title}</h3>
        <p className="hiw-card__desc">{card.description}</p>
      </div>
    </motion.div>
  );
}

