'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SparkIcon } from '@/components/ui/SparkIcon';
import { navLinks } from '@/data/nav';
import { siteSettings } from '@/data/settings';
import { useScrolled } from '@/hooks/useScrolled';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/utils/cn';

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const scrolled = useScrolled(40);
  const sectionActiveId = useActiveSection(navLinks.map((link) => link.id));

  // On sub-pages, derive active link from pathname instead of scroll position
  const activeId = isHome
    ? sectionActiveId
    : (() => {
        if (pathname.startsWith('/works')) return 'projects';
        if (pathname === '/about') return 'about';
        return 'hero';
      })();

  return (
    <nav id="nav" className={cn('fixed top-0 left-0 right-0 z-[200]', scrolled && 'is-scrolled')}>
      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13 flex items-center justify-between w-full py-7 transition-[padding] duration-400 nav-wrap">
        <Link href={isHome ? '#hero' : '/'} className="flex items-center gap-1 text-lg font-bold tracking-tight text-white no-underline">
          {siteSettings.brandName}
          <SparkIcon className="w-4 h-4" fill="var(--color-accent)" />
        </Link>

        <ul className="hidden md:flex gap-10 list-none" id="nav-links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <Link
                href={isHome ? link.href : link.routeHref}
                className={cn('nav-link', activeId === link.id && 'is-active')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={isHome ? '#contact' : '/#contact'}
          className="flex items-center gap-2 text-sm font-medium text-white border border-white/[.18] px-5.5 py-2.5 rounded-full no-underline transition-all duration-250 hover:bg-white hover:text-bg"
        >
          Let&apos;s Talk ↗
        </Link>
      </div>
    </nav>
  );
}
