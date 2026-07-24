import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AboutPageContent } from '@/components/sections/AboutPageContent';

export const metadata: Metadata = {
  title: 'About - Adham Osama',
  description:
    'Learn more about Adham Osama - graphic designer and AI art director based in Egypt, specializing in social media design, brand identity, and AI-assisted workflows.',
};

export default function AboutPage() {
  return (
    <>
      {/* Background Ambient Glow */}
      <div
        className="glow fixed -top-[20vh] left-1/2 -translate-x-1/2 w-[min(900px,120vw)] h-[70vh] pointer-events-none z-0 blur-[40px]"
        style={{
          background: 'radial-gradient(ellipse at 60% 30%, var(--color-accent-glow) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <Navbar />
      <AboutPageContent />
      <Footer />
    </>
  );
}
