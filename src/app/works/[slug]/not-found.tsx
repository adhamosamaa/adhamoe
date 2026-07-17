import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
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

      <main id="main" className="pt-40 pb-32 min-h-[70vh] flex items-center">
        <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13 text-center w-full">
          <p className="text-[clamp(80px,12vw,160px)] font-bold tracking-[-0.04em] leading-none text-white/[.06] mb-6">
            404
          </p>
          <h1 className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.03em] mb-4">Project not found.</h1>
          <p className="text-base text-gray font-light mb-10">
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/works" className="btn-outline">
            Back to Works ↗
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
