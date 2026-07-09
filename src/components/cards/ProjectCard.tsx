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

  return (
    <a href={project.href} className="proj-card flex flex-col text-white no-underline">
      <div className="proj-card-thumb w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-white/5 transition-colors">
        <div className={`proj-${project.gradient} proj-img w-full h-full flex items-center justify-center`}>
          <svg width="80" height="80" viewBox="0 0 60 60" fill="none" opacity=".3" aria-hidden="true">
            <Glyph />
          </svg>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="proj-tag">
                {tag}
              </span>
            ))}
          </div>
          <span className="text-[13px] text-gray-dim font-medium">{project.year}</span>
        </div>
        <h3 className="proj-title text-3xl font-bold tracking-tight mb-3 transition-colors">{project.title}</h3>
        <p className="text-[15px] text-gray leading-relaxed font-light max-w-[90%]">{project.description}</p>
      </div>
    </a>
  );
}
