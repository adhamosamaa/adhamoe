import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { projects } from '@/data/projects';

const REVEAL_DELAYS = [0, 100] as const;

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-36">
      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
        <Reveal delay={0} className="flex items-end justify-between mb-20 md:mb-24">
          <div>
            <SectionLabel className="mb-4">Featured Work</SectionLabel>
            <h2 className="text-[clamp(42px,5vw,68px)] font-bold tracking-[-0.03em] leading-[.95]">
              Selected <AccentText>Projects.</AccentText>
            </h2>
          </div>
        </Reveal>

        {/* Airy 2-column showcase layout - Each project is a large standalone piece */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 md:gap-y-32 gap-x-12 md:gap-x-16">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={REVEAL_DELAYS[index % REVEAL_DELAYS.length]}>
              <ProjectCard project={project} priority={index < 2} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0} className="mt-20 md:mt-28 flex justify-center">
          <Link href="/works" className="sec-cta">
            See More Projects
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

