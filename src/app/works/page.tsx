import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { WorksGrid } from '@/components/sections/WorksGrid';
import { projects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Works — Adham Osama',
  description:
    'Selected projects in graphic design, social media campaigns, AI art direction, and automation by Adham Osama.',
};

export default function WorksPage() {
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

      <main id="main" className="pt-40 pb-24 md:pb-32">
        <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
          <Reveal delay={0} className="mb-16">
            <SectionLabel className="mb-4">Portfolio</SectionLabel>
            <h1 className="text-[clamp(42px,5vw,68px)] font-bold tracking-[-0.03em] leading-[.95]">
              All <AccentText>Projects.</AccentText>
            </h1>
          </Reveal>

          <WorksGrid projects={projects} />
        </div>
      </main>

      <Footer />
    </>
  );
}
