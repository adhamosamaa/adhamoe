import { SparkIcon } from '@/components/ui/SparkIcon';
import { siteSettings } from '@/data/settings';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-6 border-t border-white/5 relative z-10">
      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4 text-center sm:text-left">
          <span className="flex items-center gap-1 text-base font-bold tracking-tight">
            {siteSettings.brandName}
            <SparkIcon className="w-3.5 h-3.5" fill="var(--color-accent)" />
          </span>
          <span className="text-[11px] text-gray-dim">
            © {year} — Designed with intention
          </span>
          <a
            href="#hero"
            className="flex items-center gap-2 text-xs text-gray-dim no-underline transition-colors hover:text-white"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
