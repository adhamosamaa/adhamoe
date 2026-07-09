import type { SkillRowData } from '@/types';

interface SkillRowProps {
  skill: SkillRowData;
  isFirst?: boolean;
}

export function SkillRow({ skill, isFirst = false }: SkillRowProps) {
  return (
    <div
      className={`skill-row flex items-center justify-between py-8 border-b border-white/[.06]${
        isFirst ? ' border-t' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="skill-number">{skill.number}</span>
        <span className="skill-name text-[17px] font-semibold tracking-tight transition-colors">{skill.name}</span>
      </div>
      <div className="flex gap-2 flex-wrap justify-end">
        {skill.tags.map((tag) => (
          <span key={tag} className="skill-pill">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
