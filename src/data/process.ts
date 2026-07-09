import { User, Share2, LayoutGrid, MonitorSmartphone } from 'lucide-react';
import type { ProcessStep } from '@/types';

export const processSteps: ProcessStep[] = [
  {
    id: 'brief-strategy',
    number: '01.',
    title: 'BRIEF & STRATEGY',
    description:
      'Understanding the brand voice, target audience, and the main goal behind the campaign.',
    icon: User,
  },
  {
    id: 'concept-direction',
    number: '02.',
    title: 'CONCEPT & ART DIRECTION',
    description:
      'Brainstorming visual hooks and layouts designed to stop the scroll and grab attention.',
    icon: Share2,
  },
  {
    id: 'visual-execution',
    number: '03.',
    title: 'VISUAL EXECUTION',
    description: 'Crafting engaging, high-quality graphics with purposeful typography and aesthetics.',
    icon: LayoutGrid,
  },
  {
    id: 'adapt-automate',
    number: '04.',
    title: 'ADAPT & AUTOMATE',
    description: 'Leveraging AI and scripts to efficiently resize and optimize assets for all platforms.',
    icon: MonitorSmartphone,
  },
];
