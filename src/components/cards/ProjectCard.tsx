import Link from 'next/link';
import Image from 'next/image';
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
}

export function ProjectCard({ project }: ProjectCardProps) {
  const Glyph = iconGlyphs[project.icon];
  const hasCover = project.cover !== '';

  return (
    <Link href={`/works/${project.id}`} className="proj-card flex flex-col text-white no-underline">
      <div className="proj-card-thumb w-full aspect-[16/10] rounded-2xl overflow-hidden mb-5 border border-white/5 transition-colors">
        {hasCover ? (
          <Image
            src={project.cover}
            alt={project.title}
            width={640}
            height={400}
            className="proj-img w-full h-full object-cover"
          />
        ) : (
          <div className={`proj-${project.gradient} proj-img w-full h-full flex items-center justify-center`}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity=".2" aria-hidden="true">
              <Glyph />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[.15em] text-accent font-medium">{project.category}</span>
          <span className="text-[12px] text-gray-dim font-light">{project.year}</span>
        </div>
        <h3 className="proj-title text-[22px] font-bold tracking-tight leading-snug transition-colors">{project.title}</h3>
        <p className="text-[13.5px] text-gray leading-relaxed font-light">{project.description}</p>
      </div>
    </Link>
  );
}
