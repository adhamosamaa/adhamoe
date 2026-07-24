import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { SkillRow } from '@/components/cards/SkillRow';
import { skills } from '@/data/skills';

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-36 border-t border-white/5 relative">
      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
        {/* Section Header */}
        <Reveal delay={0} className="max-w-2xl mb-16 md:mb-20">
          <SectionLabel className="mb-4">Capabilities</SectionLabel>
          <h2 className="text-[clamp(38px,4.5vw,58px)] font-bold tracking-[-0.03em] leading-[0.98] mb-5">
            What I bring to <AccentText>the table.</AccentText>
          </h2>
          <p className="text-base text-gray-300/80 leading-relaxed font-light">
            A focused toolkit built around clarity, craft, and technical efficiency across visual design, AI, and workflow automation.
          </p>
        </Reveal>

        {/* 2x2 Capabilities Card Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {skills.map((skill, index) => (
            <Reveal key={skill.id} delay={index * 80}>
              <SkillRow skill={skill} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

