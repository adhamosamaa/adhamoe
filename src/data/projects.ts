import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'food-industry-ksa',
    title: 'Food Industry in KSA',
    description:
      'A comprehensive social media design project consisting of over 30 distinct designs tailored for the Saudi market.',
    tags: ['Social Media', 'AI Design'],
    year: '2026',
    href: '#',
    gradient: 'gradient-1',
    icon: 'orbit',
    cover: '/images/projects/food-industry-ksa/cover.png',
    gallery: [
      '/images/projects/food-industry-ksa/cover.png',
      '/images/projects/food-industry-ksa/cover.png',
      '/images/projects/food-industry-ksa/cover.png',
    ],
    category: 'Design',
    overview:
      'A large-scale social media campaign designed for the food industry in the Kingdom of Saudi Arabia. The project involved creating a cohesive visual identity across multiple platforms, with over 30 unique designs that blend cultural sensitivity with modern aesthetics. Each piece was carefully crafted to resonate with the Saudi market while maintaining international design standards.',
    services: ['Social Media Design', 'Visual Identity', 'Content Strategy', 'Art Direction', 'Brand Guidelines'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Midjourney', 'Figma'],
    challenge:
      'The primary challenge was creating a visual language that authentically represents Saudi food culture while appealing to a modern, digitally-savvy audience. The designs needed to work across multiple social media platforms with varying aspect ratios and content requirements, all while maintaining a consistent brand voice.',
    solution:
      'I developed a modular design system with flexible components that could adapt to different platforms and content types. By leveraging AI-assisted workflows with Midjourney for initial concept exploration and Adobe Creative Suite for final execution, I was able to maintain quality and consistency across all 30+ deliverables while meeting tight deadlines.',
  },
  {
    id: 'adobe-workflow-scripts',
    title: 'Adobe Workflow Scripts',
    description:
      'Custom presentation scripts for Illustrator and Photoshop to automate slide generation and image batching.',
    tags: ['Automation', 'JavaScript'],
    year: '2026',
    href: '#',
    gradient: 'gradient-2',
    icon: 'square',
    cover: '/images/projects/adobe-workflow-scripts/cover.webp',
    gallery: [
      '/images/projects/adobe-workflow-scripts/01.webp',
      '/images/projects/adobe-workflow-scripts/02.webp',
    ],
    category: 'Automation',
    overview:
      'A suite of custom JavaScript scripts built for Adobe Illustrator and Photoshop that automate repetitive design tasks. These tools handle slide generation, image batching, and asset export — turning hours of manual work into minutes of automated processing. The scripts integrate seamlessly into existing creative workflows.',
    services: ['Script Development', 'Workflow Automation', 'Tool Design', 'Documentation'],
    tools: ['JavaScript', 'Adobe Illustrator Scripting', 'Adobe Photoshop Scripting', 'ExtendScript'],
    challenge:
      'Designers often spend significant time on repetitive tasks like resizing, exporting, and formatting assets for different platforms. These manual processes are error-prone and consume creative energy that could be better spent on actual design work.',
    solution:
      'I built a collection of ExtendScript-based automation tools that handle batch operations within Adobe applications. The scripts feature error handling, progress feedback, and configurable parameters so designers can customize the output without touching code. This reduced production time by an estimated 60% for routine tasks.',
  },
  {
    id: 'hekayat-ai-series',
    title: 'Hekayat AI Series',
    description:
      'Scripting and visual direction for a YouTube series exploring the history and conceptual development of AI.',
    tags: ['Content', 'Direction'],
    year: '2026',
    href: '#',
    gradient: 'gradient-3',
    icon: 'peak',
    cover: '',
    gallery: [],
    category: 'Content',
    overview:
      'Hekayat AI is a YouTube series that explores the fascinating history and conceptual development of artificial intelligence. From early philosophical ideas to modern machine learning breakthroughs, each episode weaves together storytelling, visual design, and educational content. I handled both the scripting and visual direction, ensuring a cohesive narrative across the series.',
    services: ['Script Writing', 'Visual Direction', 'Storyboarding', 'Motion Graphics', 'Content Strategy'],
    tools: ['Adobe After Effects', 'Adobe Premiere Pro', 'Midjourney', 'Google Docs'],
    challenge:
      'Communicating complex AI concepts to a general Arabic-speaking audience required balancing technical accuracy with engaging storytelling. The visual language needed to make abstract concepts tangible without oversimplifying the subject matter.',
    solution:
      'I developed a distinctive visual style combining minimalist motion graphics with AI-generated imagery to illustrate abstract concepts. Each episode follows a narrative arc that builds understanding progressively, using analogies and historical context to make the content accessible and memorable.',
  },
];