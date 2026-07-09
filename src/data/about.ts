import type { BioParagraph, ExperienceEntry, SoftwareItem } from '@/types';

export const aboutHeroParagraphs: BioParagraph[] = [
  {
    id: 'intro-extended',
    text: "I'm Adham Osama, a graphic designer and AI art director based in Egypt. I specialize in transforming brand visions into strategic, visually compelling designs that communicate with clarity and purpose.",
    boldPhrase: 'Adham Osama',
  },
  {
    id: 'approach',
    text: 'My work sits at the intersection of traditional design craft and modern AI-assisted workflows. I believe in design that communicates, connects, and solves — not just decorates.',
    boldPhrase: 'communicates, connects, and solves',
  },
  {
    id: 'philosophy',
    text: 'Every project starts with understanding the why. From social media campaigns to brand identities, I approach each brief with strategic thinking and intentional creativity, leveraging automation and AI to optimize the process without sacrificing quality.',
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: 'freelance',
    role: 'Graphic Designer & AI Art Director',
    company: 'Freelance',
    period: '2024 — Present',
    description:
      'Leading brand identity, social media design, and AI art direction projects for clients across the MENA region.',
  },
  {
    id: 'social-media',
    role: 'Social Media Designer',
    company: 'Various Agencies',
    period: '2022 — 2024',
    description:
      'Designed social media campaigns, brand content, and visual assets for food, tech, and lifestyle brands.',
  },
  {
    id: 'junior',
    role: 'Junior Graphic Designer',
    company: 'Creative Studio',
    period: '2021 — 2022',
    description:
      'Collaborated on brand identity projects, print design, and digital marketing materials.',
  },
];

export const softwareList: SoftwareItem[] = [
  { id: 'illustrator', name: 'Adobe Illustrator', category: 'Design' },
  { id: 'photoshop', name: 'Adobe Photoshop', category: 'Design' },
  { id: 'indesign', name: 'Adobe InDesign', category: 'Design' },
  { id: 'after-effects', name: 'After Effects', category: 'Motion' },
  { id: 'premiere', name: 'Premiere Pro', category: 'Motion' },
  { id: 'figma', name: 'Figma', category: 'Design' },
  { id: 'midjourney', name: 'Midjourney', category: 'AI' },
  { id: 'vscode', name: 'VS Code', category: 'Development' },
  { id: 'nextjs', name: 'Next.js', category: 'Development' },
];
