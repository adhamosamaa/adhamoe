import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BackgroundGlow } from '@/components/ui/BackgroundGlow';
import { Hero } from '@/components/sections/Hero';
import { Ticker } from '@/components/sections/Ticker';
import { Projects } from '@/components/sections/Projects';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { getWebPageSchema, buildSchemaGraph } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  const schema = buildSchemaGraph(
    getWebPageSchema({
      path: "/",
      title: "Adham Osama - Graphic Designer",
      description:
        "Portfolio of Adham Osama. Graphic Designer specializing in social media design, brand identity, and visual storytelling.",
    })
  );
  return (
    <>
      <JsonLd data={schema} />
      <BackgroundGlow />

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
