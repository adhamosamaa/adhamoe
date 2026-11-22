import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BackgroundGlow } from '@/components/ui/BackgroundGlow';
import { getSiteSettings } from '@/lib/getSiteSettings';

export default async function NotFound() {
  const settings = await getSiteSettings();
  if (!settings) return null;
  return (
    <>
      <BackgroundGlow />

      <Navbar brandName={settings.brand_name} />

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

      <Footer brandName={settings.brand_name} socialLinks={settings.social_links} />
    </>
  );
}
