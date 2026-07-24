'use client';

import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { HiwCard } from '@/components/cards/HiwCard';
import { howItWorksCards } from '@/data/how-it-works';
import { cn } from '@/utils/cn';

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15, margin: '0px 0px -60px 0px' });

  return (
    <section id="how-it-works" className="hiw-section py-24 md:py-32 border-t border-white/5 overflow-hidden">
      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
        <Reveal delay={0} className="flex items-end justify-between mb-16">
          <div>
            <SectionLabel className="mb-4">Our Projects Explained</SectionLabel>
            <h2 className="text-[clamp(42px,5vw,68px)] font-bold tracking-[-0.03em] leading-[.95]">
              Here&apos;s how it <AccentText>works.</AccentText>
            </h2>
          </div>
        </Reveal>

        <div ref={ref} className={cn('hiw-cards-wrapper', (inView || shouldReduceMotion) && 'in')} id="hiw-cards">
          <div className="hiw-glow hiw-glow--left" aria-hidden="true"></div>
          <div className="hiw-glow hiw-glow--right" aria-hidden="true"></div>

          {howItWorksCards.map((card, index) => (
            <Reveal key={card.id} delay={index * 100} direction="up" distance={20}>
              <HiwCard card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
