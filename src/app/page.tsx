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
import { getSiteSettings } from '@/lib/getSiteSettings';

export const revalidate = 0;

export default async function Home() {
  const settings = await getSiteSettings();
  if (!settings) return null;

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

      <Navbar brandName={settings.brand_name} />

      <main id="main">
        <Hero settings={settings} />
        <Ticker />
        <Projects />
        <HowItWorks cards={settings.how_it_works} />
        <About settings={settings} />
        <Skills />
        <Contact headline={settings.contact_headline} highlight={settings.contact_highlight} />
      </main>

      <Footer brandName={settings.brand_name} socialLinks={settings.social_links} />
    </>
  );
}
