import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { HighlightText } from '@/components/ui/HighlightText';
import { SkillRow } from '@/components/cards/SkillRow';
import { ProcessStepCard } from '@/components/cards/ProcessStepCard';
import { Contact } from '@/components/sections/Contact';
import { aboutHeroParagraphs, experience, softwareList } from '@/data/about';
import { skills } from '@/data/skills';
import { processSteps } from '@/data/process';

export const metadata: Metadata = {
  title: 'About — Adham Osama',
  description:
    'Learn more about Adham Osama — graphic designer and AI art director based in Egypt, specializing in social media design, brand identity, and AI-assisted workflows.',
};

export default function AboutPage() {
  return (
    <>
      <div
        className="glow fixed -top-[20vh] left-1/2 -translate-x-1/2 w-[min(900px,120vw)] h-[70vh] pointer-events-none z-0 blur-[40px]"
        style={{
          background: 'radial-gradient(ellipse at 60% 30%, var(--color-accent-glow) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <Navbar />

      <main id="main" className="pt-40 pb-0">
        {/* ── Hero + Bio ─────────────────────── */}
        <section className="pb-24 md:pb-32">
          <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
              <Reveal delay={0}>
                <SectionLabel className="mb-4">About Me</SectionLabel>
                <h1 className="text-[clamp(40px,5vw,68px)] font-bold tracking-[-0.04em] leading-[.92] mb-10">
                  Design with <AccentText>purpose,</AccentText> not decoration.
                </h1>

                <div className="hero-portrait-frame w-full max-w-[400px] aspect-[3/4] rounded-3xl overflow-hidden relative mb-8">
                  <Image
                    src="/images/adham-pro.png"
                    alt="Portrait of Adham Osama"
                    width={840}
                    height={1050}
                    priority
                    className="hero-portrait w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to bottom, transparent 30%, rgba(0,13,12,0.3) 60%, var(--color-bg) 100%)',
                    }}
                    aria-hidden="true"
                  />
                </div>
              </Reveal>

              <Reveal delay={80} className="flex flex-col gap-5 lg:pt-20">
                {aboutHeroParagraphs.map((paragraph) => (
                  <HighlightText
                    key={paragraph.id}
                    paragraph={paragraph}
                    className="text-base leading-[1.85] text-gray font-light"
                  />
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Experience ─────────────────────── */}
        <section className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
            <Reveal delay={0}>
              <SectionLabel className="mb-4">Experience</SectionLabel>
              <h2 className="text-[clamp(36px,4vw,52px)] font-bold tracking-[-0.03em] leading-tight mb-14">
                Where I&apos;ve <AccentText>worked.</AccentText>
              </h2>
            </Reveal>

            <div className="flex flex-col">
              {experience.map((entry, index) => (
                <Reveal key={entry.id} delay={index === 0 ? 0 : 80}>
                  <div
                    className={`flex flex-col md:flex-row md:items-start gap-4 md:gap-12 py-8 border-b border-white/[.06]${index === 0 ? ' border-t' : ''}`}
                  >
                    <div className="md:w-[200px] flex-shrink-0">
                      <span className="text-[12px] text-accent font-medium tracking-wider uppercase">
                        {entry.period}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[17px] font-semibold tracking-tight mb-1">{entry.role}</h3>
                      <p className="text-[13px] text-gray-dim mb-2">{entry.company}</p>
                      <p className="text-[14px] text-gray font-light leading-[1.7]">{entry.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Skills ─────────────────────────── */}
        <section className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
            <Reveal delay={0} className="mb-12">
              <SectionLabel className="mb-4">Capabilities</SectionLabel>
              <h2 className="text-[clamp(36px,4vw,52px)] font-bold tracking-[-0.03em] leading-tight">
                What I bring to <AccentText>the table.</AccentText>
              </h2>
            </Reveal>

            <Reveal delay={80} className="flex flex-col">
              {skills.map((skill, index) => (
                <SkillRow key={skill.id} skill={skill} isFirst={index === 0} />
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── Software ───────────────────────── */}
        <section className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
            <Reveal delay={0} className="mb-12">
              <SectionLabel className="mb-4">Software &amp; Tools</SectionLabel>
              <h2 className="text-[clamp(36px,4vw,52px)] font-bold tracking-[-0.03em] leading-tight">
                Tools of <AccentText>the trade.</AccentText>
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {softwareList.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-1 p-5 rounded-xl border border-white/[.06] bg-white/[.02] transition-all duration-300 hover:border-white/[.12] hover:bg-white/[.04]"
                  >
                    <span className="text-[14px] font-semibold tracking-tight">{item.name}</span>
                    <span className="text-[11px] text-gray-dim uppercase tracking-wider">{item.category}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Creative Process ───────────────── */}
        <section className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
            <div className="max-w-[600px]">
              <Reveal delay={0}>
                <SectionLabel className="mb-4">Creative Process</SectionLabel>
                <h2 className="text-[clamp(36px,4vw,52px)] font-bold tracking-[-0.03em] leading-tight mb-14">
                  How I <AccentText>work.</AccentText>
                </h2>
              </Reveal>

              <Reveal delay={80}>
                <div className="process-timeline">
                  {processSteps.map((step, index) => (
                    <ProcessStepCard key={step.id} step={step} isLast={index === processSteps.length - 1} />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Contact ────────────────────────── */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
