'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Parallax } from '@/components/ui/Parallax';
import type { Project, ProjectIcon } from '@/types';

const iconGlyphs: Record<ProjectIcon, () => React.JSX.Element> = {
  orbit: () => (
    <>
      <circle cx="30" cy="30" r="20" stroke="#7DAF88" strokeWidth=".6" />
      <circle cx="30" cy="30" r="12" stroke="#7DAF88" strokeWidth=".6" />
      <circle cx="30" cy="30" r="3" fill="#7DAF88" />
    </>
  ),
  square: () => <rect x="15" y="15" width="30" height="30" rx="2" stroke="#9B8FCC" strokeWidth=".6" />,
  peak: () => (
    <path d="M15 42 L30 18 L45 42" stroke="#CC8F8F" strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority }: ProjectCardProps) {
  const Glyph = iconGlyphs[project.icon];
  const hasCover = project.cover !== '';

  return (
    <Link href={`/works/${project.id}`} className="group block text-white no-underline">
      <Parallax speed={10} direction="up">
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* Visual / Image area - Dominant Star of the Card (16:9 aspect ratio) */}
          <div className="proj-card-thumb relative w-full aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden mb-6 border border-white/10 bg-white/[0.02] transition-colors duration-300">
            {hasCover ? (
              <Image
                src={project.cover}
                alt={project.title}
                width={960}
                height={540}
                priority={priority}
                className="proj-img w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            ) : (
              <div className={`proj-${project.gradient} proj-img w-full h-full flex items-center justify-center`}>
                <svg width="80" height="80" viewBox="0 0 60 60" fill="none" opacity=".2" aria-hidden="true">
                  <Glyph />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Simple Information below image - Only Title + Arrow */}
          <div className="px-0.5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="proj-title text-xl md:text-2xl font-bold tracking-tight leading-snug group-hover:text-accent transition-colors duration-300">
                {project.title}
              </h3>
              <span className="text-white/30 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 text-lg flex-shrink-0" aria-hidden="true">
                ↗
              </span>
            </div>
          </div>
        </motion.div>
      </Parallax>
    </Link>
  );
}


