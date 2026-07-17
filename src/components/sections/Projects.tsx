import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { projects } from '@/data/projects';

const REVEAL_DELAYS = [0, 80, 160] as const;

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
        <Reveal delay={0} className="flex items-end justify-between mb-16">
          <div>
            <SectionLabel className="mb-4">Featured Work</SectionLabel>
            <h2 className="text-[clamp(42px,5vw,68px)] font-bold tracking-[-0.03em] leading-[.95]">
              Selected <AccentText>Projects.</AccentText>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={REVEAL_DELAYS[index % REVEAL_DELAYS.length]}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0} className="mt-14">
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
