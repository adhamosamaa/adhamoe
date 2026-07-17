import type { BioParagraph, ExperienceEntry, SoftwareItem } from '@/types';

export const aboutHeroParagraphs: BioParagraph[] = [
  {
    id: 'intro-extended',
    text: "I'm Adham Osama, a Graphic Designer with 2+ years of experience specializing in social media design, producing high-volume creative content for brands across diverse industries.",
    boldPhrase: 'Adham Osama',
  },
  {
    id: 'approach',
    text: 'Skilled in the Adobe Creative Suite, with hands-on experience using generative AI tools for art direction and creative production.',
    boldPhrase: 'generative AI tools',
  },
  {
    id: 'philosophy',
    text: 'I am focused on building visually consistent, high-converting social media creatives tailored to each brand\'s identity.',
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: 'bareq',
    role: 'Graphic Designer (Part-time)',
    company: 'bareq studio',
    period: '03/2026 — Present',
    description:
      'Designed carousel and social media creative sets for multiple brand accounts. Partnered with the branding team to translate campaign briefs into on-brand marketing assets.',
  },
  {
    id: 'tar-group',
    role: 'Graphic Designer',
    company: 'TAR Group',
    period: '10/2025 — 07/2026',
    description:
      'Delivered 250+ social media creatives per month across clients in multiple industries. Worked with cross-functional teams to keep campaign output on-brand and on-deadline.',
  },
  {
    id: 'tar-group-intern',
    role: 'Graphic Designer (Internship)',
    company: 'TAR Group',
    period: '07/2025 — 09/2025',
    description:
      'Built foundational design skills by contributing to live marketing campaigns under agency deadlines. Practiced photo manipulation and creative problem-solving.',
  },
  {
    id: 'hosoun',
    role: 'Graphic Designer',
    company: 'hosoun educational platform',
    period: '02/2025 — 03/2025',
    description:
      'Designed website banners, digital ads, and social creatives for the Saudi education market. Adapted visual direction for a new regional audience.',
  },
  {
    id: 'center-focus',
    role: 'Graphic Designer',
    company: 'Center Focus',
    period: '10/2024 — 06/2025',
    description:
      'Designed social media creatives and marketing materials. Rebuilt the center\'s visual identity from inconsistent assets into a unified brand presence.',
  },
];

export const softwareList: SoftwareItem[] = [
  { id: 'photoshop', name: 'Adobe Photoshop', category: 'Design' },
  { id: 'illustrator', name: 'Adobe Illustrator', category: 'Design' },
  { id: 'indesign', name: 'Adobe InDesign', category: 'Design' },
  { id: 'after-effects', name: 'After Effects', category: 'Design' },
  { id: 'premiere', name: 'Premiere Pro', category: 'Design' },
  { id: 'chatgpt', name: 'ChatGPT', category: 'AI Tools' },
  { id: 'adobe-firefly', name: 'Adobe Firefly', category: 'AI Tools' },
  { id: 'claude', name: 'Claude', category: 'AI Tools' },
  { id: 'gemini', name: 'Gemini', category: 'AI Tools' },
];
