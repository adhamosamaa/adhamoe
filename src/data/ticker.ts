import type { TickerTag } from '@/types';

/** Base set of tags — the ticker component repeats this list to create a seamless infinite loop. */
export const tickerTags: TickerTag[] = [
  { id: 'design', label: 'Design' },
  { id: 'social', label: 'Social Media' },
  { id: 'ai', label: 'AI Art' },
  { id: 'automation', label: 'Automation' },
  { id: 'brand', label: 'Brand Identity' },
];
