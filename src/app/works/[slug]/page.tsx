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
    title: `${project.title} — Adham Osama`,
    description: project.description,
  };
}

/* ── Page component ── */
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.id === slug);
  if (projectIndex === -1) notFound();

  const project = projects[projectIndex]!;
  const nextProject = projects[(projectIndex + 1) % projects.length]!;
  const Glyph = iconGlyphs[project.icon];

  const hasCover = project.cover !== '';
  const hasGallery = project.gallery.length > 0;

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
          {/* ── Hero ──────────────────────────── */}
          <Reveal delay={0} className="mb-20">
            <SectionLabel className="mb-4">{project.category}</SectionLabel>
            <h1 className="text-[clamp(42px,6vw,80px)] font-bold tracking-[-0.03em] leading-[.95] mb-6">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              {project.tags.map((tag) => (
                <span key={tag} className="proj-tag">
                  {tag}
                </span>
              ))}
              <span className="text-[13px] text-gray-dim font-light ml-2">{project.year}</span>
            </div>

            {hasCover ? (
              <div className="w-full aspect-[16/8] rounded-2xl overflow-hidden border border-white/5">
                <Image
                  src={project.cover}
                  alt={project.title}
                  width={1320}
                  height={660}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`proj-${project.gradient} w-full aspect-[16/8] rounded-2xl flex items-center justify-center overflow-hidden border border-white/5`}
              >
                <svg width="120" height="120" viewBox="0 0 60 60" fill="none" opacity=".15" aria-hidden="true">
                  <Glyph />
                </svg>
              </div>
            )}
          </Reveal>

          {/* ── Overview ──────────────────────── */}
          <Reveal delay={0} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-20">
            <span className="detail-label pt-1">Overview</span>
            <p className="text-base leading-[1.85] text-gray font-light max-w-[640px]">{project.overview}</p>
          </Reveal>

          {/* ── Services ─────────────────────── */}
          <Reveal delay={0} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-20">
            <span className="detail-label pt-1">Services</span>
            <div className="flex flex-wrap gap-2">
              {project.services.map((service) => (
                <span key={service} className="proj-tag">
                  {service}
                </span>
              ))}
            </div>
          </Reveal>

          {/* ── Tools ────────────────────────── */}
          <Reveal delay={0} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-20">
            <span className="detail-label pt-1">Tools</span>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span key={tool} className="proj-tag">
                  {tool}
                </span>
              ))}
            </div>
          </Reveal>

          {/* ── Gallery ──────────────────────── */}
          <Reveal delay={0} className="mb-20">
            <SectionLabel className="mb-8">Gallery</SectionLabel>
            {hasGallery ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.gallery.map((img, i) => (
                  <div key={i} className="gallery-img aspect-[16/10]">
                    <Image
                      src={img}
                      alt={`${project.title} — gallery image ${i + 1}`}
                      width={660}
                      height={412}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : hasCover ? (
              <div className="gallery-img aspect-[16/8] overflow-hidden">
                <Image
                  src={project.cover}
                  alt={`${project.title} — cover`}
                  width={1320}
                  height={660}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`gallery-img proj-${project.gradient} w-full aspect-[16/8] flex items-center justify-center`}
              >
                <svg width="100" height="100" viewBox="0 0 60 60" fill="none" opacity=".15" aria-hidden="true">
                  <Glyph />
                </svg>
              </div>
            )}
          </Reveal>

          {/* ── Challenge ─────────────────────── */}
          <Reveal delay={0} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-20">
            <span className="detail-label pt-1">Challenge</span>
            <p className="text-base leading-[1.85] text-gray font-light max-w-[640px]">{project.challenge}</p>
          </Reveal>

          {/* ── Solution ─────────────────────── */}
          <Reveal delay={0} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-20">
            <span className="detail-label pt-1">Solution</span>
            <p className="text-base leading-[1.85] text-gray font-light max-w-[640px]">{project.solution}</p>
          </Reveal>

          {/* ── Next Project + Back to Works ──── */}
          <div className="border-t border-white/5 pt-16">
            <Reveal
              delay={0}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            >
              <div>
                <span className="detail-label block mb-3">Next Project</span>
                <Link
                  href={`/works/${nextProject.id}`}
                  className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.03em] leading-tight text-white no-underline transition-colors hover:text-accent"
                >
                  {nextProject.title}
                </Link>
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
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
