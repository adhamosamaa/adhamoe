import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { HighlightText } from '@/components/ui/HighlightText';
import { ProcessStepCard } from '@/components/cards/ProcessStepCard';
import { processSteps } from '@/data/process';
import { siteSettings } from '@/data/settings';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 border-t border-white/5">
      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-15 xl:gap-0 items-start">
          <Reveal delay={0}>
            <SectionLabel className="mb-4">About Me</SectionLabel>
            <h2 className="text-[clamp(40px,4.5vw,62px)] font-bold tracking-[-0.04em] leading-none mb-12">
              Design with <AccentText>purpose,</AccentText> not decoration.
            </h2>
            {siteSettings.aboutParagraphs.map((paragraph) => (
              <HighlightText
                key={paragraph.id}
                paragraph={paragraph}
                className="text-base leading-[1.85] text-gray font-light max-w-[360px] mb-5"
              />
            ))}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm text-gray no-underline mt-4 transition-colors hover:text-white"
            >
              More About Me ↗
            </a>
          </Reveal>

          <Reveal delay={80} className="xl:pl-20 xl:border-l xl:border-white/[.06]">
            <SectionLabel className="mb-9">My Process</SectionLabel>
            <div className="process-timeline">
              {processSteps.map((step, index) => (
                <ProcessStepCard key={step.id} step={step} isLast={index === processSteps.length - 1} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
