'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { tickerTags } from '@/data/ticker';

export function Ticker() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0 });

  // Render the tag set twice so the CSS keyframe (`translateX(-50%)`) loops seamlessly.
  const loopedTags = [...tickerTags, ...tickerTags];

  return (
    <div className="border-y border-white/5 py-4 overflow-hidden relative z-10">
      <div ref={ref} className="ticker-track flex w-max" id="ticker-track" data-paused={(!inView).toString()}>
        {loopedTags.map((tag, index) => (
          <div
            key={`${tag.id}-${index}`}
            className="ticker-item flex items-center gap-8 px-8 text-[11px] tracking-[.2em] uppercase text-gray-dim whitespace-nowrap"
            aria-hidden={index >= tickerTags.length ? 'true' : undefined}
          >
            {tag.label}
            <span className="ticker-dot"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
