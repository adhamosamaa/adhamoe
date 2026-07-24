import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';
import { projects } from '@/data/projects';
import type { ProjectIcon } from '@/types';

/* ── Glyph lookup for gradient placeholders ── */
const iconGlyphs: Record<ProjectIcon, () => React.JSX.Element> = {
  orbit: () => (
    <>
      <circle cx="30" cy="30" r="20" stroke="#7DAF88" strokeWidth=".6" />
      <circle cx="30" cy="30" r="12" stroke="#7DAF88" strokeWidth=".6" />
      <circle cx="30" cy="30" r="3" fill="#7DAF88" />
    </>
  ),
  square: () => <rect x="15" y="15" width="30" height="30" rx="2" stroke="#9B8FCC" strokeWidth=".6" />,
  peak: () => (
    <path d="M15 42 L30 18 L45 42" stroke="#CC8F8F" strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

/* ── Static generation ── */
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} - Adham Osama`,
    description: project.description,
  };
}

/* ── Page component ── */
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.id === slug);
  if (projectIndex === -1) notFound();

  const project = projects[projectIndex];
  if (!project) notFound();

  const otherProjects = projects.filter((p) => p.id !== project.id);
  const Glyph = iconGlyphs[project.icon];

  const hasCover = project.cover !== '';
  const extraGalleryImages = project.gallery.filter((img) => img !== project.cover);
  const galleryImages =
    extraGalleryImages.length > 0 ? extraGalleryImages : hasCover ? [project.cover] : project.gallery;

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

      <main id="main" className="pt-36 pb-28 md:pb-36">
        <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
          {/* ── Minimal Header & Metadata ── */}
          <Reveal delay={0} className="mb-12">
            <SectionLabel className="mb-4">{project.category}</SectionLabel>
            <h1 className="text-[clamp(40px,5.5vw,76px)] font-bold tracking-[-0.03em] leading-[0.98] mb-8">
              {project.title}
            </h1>

            {/* Minimal Inline Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 py-4 border-y border-white/10 text-xs md:text-sm text-gray-400 font-mono">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-white/30 block text-[10px] uppercase tracking-wider mb-0.5">Year</span>
                  <span className="text-white">{project.year}</span>
                </div>
                {project.services && project.services.length > 0 && (
                  <div>
                    <span className="text-white/30 block text-[10px] uppercase tracking-wider mb-0.5">Role</span>
                    <span className="text-white">{project.services.slice(0, 2).join(' / ')}</span>
                  </div>
                )}
              </div>
              {project.tools && project.tools.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {project.tools.map((tool) => (
                    <span key={tool} className="text-[10px] text-white/50 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full font-sans">
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* ── Hero Cover Image (As it was, with rounded corners) ── */}
          <Reveal delay={0} className="mb-16 md:mb-24">
            {hasCover ? (
              <div className="w-full aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]">
                <Image
                  src={project.cover}
                  alt={project.title}
                  width={1920}
                  height={1080}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`proj-${project.gradient} w-full aspect-[16/9] rounded-2xl md:rounded-3xl flex items-center justify-center overflow-hidden border border-white/10`}
              >
                <svg width="120" height="120" viewBox="0 0 60 60" fill="none" opacity=".15" aria-hidden="true">
                  <Glyph />
                </svg>
              </div>
            )}
          </Reveal>

          {/* ── Minimal Overview ── */}
          {project.overview && (
            <Reveal delay={0} className="max-w-3xl mb-20 md:mb-28">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-3">About The Project</h2>
              <p className="text-lg md:text-xl leading-relaxed text-gray-300 font-light">
                {project.overview}
              </p>
            </Reveal>
          )}

          {/* ── Full-Width Stacked Gallery Showcase (Uncropped, original dimensions, sharp edges) ── */}
          {galleryImages.length > 0 && (
            <Reveal delay={0} className="mb-24 md:mb-32">
              <div className="flex flex-col gap-10 md:gap-16">
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className="w-full border border-white/10 bg-white/[0.02]"
                  >
                    <Image
                      src={img}
                      alt={`${project.title} - Showcase ${i + 1}`}
                      width={1920}
                      height={1080}
                      className="w-full h-auto block"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* ── More Projects Horizontal Scroll Showcase ── */}
          <div className="border-t border-white/10 pt-20">
            <Reveal delay={0} className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-accent block mb-2 font-semibold">Explore More</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">More Projects</h2>
              </div>
              <Link href="/works" className="sec-cta">
                All Projects
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Reveal>

            {/* Horizontal Scrollable Row */}
            <Reveal delay={0}>
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory -mx-6 px-6 md:-mx-13 md:px-13">
                {otherProjects.map((other) => (
                  <Link
                    key={other.id}
                    href={`/works/${other.id}`}
                    className="group flex-none w-[280px] sm:w-[340px] md:w-[400px] snap-start text-white no-underline block"
                  >
                    <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] mb-4 transition-colors group-hover:border-accent/40">
                      {other.cover ? (
                        <Image
                          src={other.cover}
                          alt={other.title}
                          width={600}
                          height={337}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className={`proj-${other.gradient} w-full h-full flex items-center justify-center`}>
                          <span className="text-white/20 text-xs font-mono">{other.title}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-baseline justify-between gap-2 px-0.5">
                      <h3 className="text-base md:text-lg font-bold group-hover:text-accent transition-colors">
                        {other.title}
                      </h3>
                      <span className="text-white/30 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

