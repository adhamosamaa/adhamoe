import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BackgroundGlow } from '@/components/ui/BackgroundGlow';
import { AboutPageContent } from '@/components/sections/AboutPageContent';
import { buildSchemaGraph, getAboutPageSchema, getWebPageSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About - Adham Osama',
  description:
    'Learn more about Adham Osama - graphic designer and AI art director based in Egypt, specializing in social media design, brand identity, and AI-assisted workflows.',
};


export default function AboutPage() {
  const title = "About — Adham Osama";
  const description = "Background, skills, and approach to design and AI art direction.";

  const schema = buildSchemaGraph(
    getAboutPageSchema({ title, description }),
    getWebPageSchema({ path: "/about", title, description })
  );
  return (
    <>
      <JsonLd data={schema} />
      <BackgroundGlow />

      <Navbar />
      <AboutPageContent />
      <Footer />
    </>
  );
}
