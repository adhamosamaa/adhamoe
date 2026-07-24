import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Ticker } from '@/components/sections/Ticker';
import { Projects } from '@/components/sections/Projects';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <div
        className="glow fixed -top-[20vh] left-1/2 -translate-x-1/2 w-[min(900px,120vw)] h-[70vh] pointer-events-none z-0 blur-[40px]"
        style={{
          background: 'radial-gradient(ellipse at 60% 30%, var(--color-accent-glow) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      ></div>

      <Navbar />

      <main id="main">
        <Hero />
        <Ticker />
        <Projects />
        <HowItWorks />
        <About />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
