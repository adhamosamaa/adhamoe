import Image from 'next/image';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { SocialRail } from '@/components/layout/SocialRail';
import { siteSettings } from '@/data/settings';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 w-full">
      <SocialRail />

      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 items-center w-full xl:pl-13">
        <div className="flex flex-col justify-center">
          <div className="hero-in-tag mb-6">
            <SectionLabel>{siteSettings.role}</SectionLabel>
          </div>

          <h1 className="hero-in-h1 text-[clamp(56px,7vw,110px)] font-bold tracking-[-0.03em] leading-none">
            {siteSettings.heroHeadline.map((line) => (
              <span key={line} className="whitespace-nowrap">
                {line}
                <br />
              </span>
            ))}
            <span className="whitespace-nowrap">
              <AccentText>{siteSettings.heroHighlight}</AccentText>
            </span>
          </h1>

          <p className="hero-in-desc text-base leading-[1.7] text-gray max-w-[440px] mt-8">
            {siteSettings.heroDescription}
          </p>

          <div className="hero-in-btns flex items-center gap-5 mt-10 flex-col sm:flex-row">
            <a href="#projects" className="btn-solid w-full sm:w-auto justify-center">
              View Projects ↗
            </a>
            <a href={siteSettings.cv} target="_blank"
              rel="noopener noreferrer" download className="btn-ghost">
              Download CV
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <Reveal delay={0} className="flex justify-center lg:justify-end">
          <div className="hero-portrait-frame w-full max-w-[400px] lg:max-w-[500px] aspect-[3/4] lg:aspect-[3/4] rounded-3xl overflow-hidden relative">
            <Image
              src="/images/adham-pro.png"
              alt="Portrait of Adham Osama, graphic designer and AI art director"
              width={840}
              height={1050}
              priority
              className="hero-portrait w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 30%, rgba(0,13,12,0.3) 60%, var(--color-bg) 100%), radial-gradient(circle at 70% 50%, transparent 50%, rgba(4,217,217,0.06) 80%, var(--color-bg) 100%)',
              }}
              aria-hidden="true"
            ></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
