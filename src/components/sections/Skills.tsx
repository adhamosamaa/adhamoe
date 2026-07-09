import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { SkillRow } from '@/components/cards/SkillRow';
import { skills } from '@/data/skills';

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 border-t border-white/5">
      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-12 xl:gap-20 items-start">
          <Reveal delay={0} className="xl:sticky xl:top-30">
            <SectionLabel className="mb-4">Capabilities</SectionLabel>
            <h2 className="text-[clamp(36px,3.5vw,52px)] font-bold tracking-[-0.03em] leading-tight mb-5">
              What I bring to <AccentText>the table.</AccentText>
            </h2>
            <p className="text-sm text-gray leading-[1.7] font-light">
              A focused toolkit built around clarity, craft, and technical efficiency.
            </p>
          </Reveal>

          <Reveal delay={80} className="flex flex-col">
            {skills.map((skill, index) => (
              <SkillRow key={skill.id} skill={skill} isFirst={index === 0} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
