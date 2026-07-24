'use client';

import { useState, useCallback, useEffect } from 'react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // On sub-pages, derive active link from pathname instead of scroll position
  const activeId = isHome
    ? sectionActiveId
    : (() => {
        if (pathname.startsWith('/works')) return 'projects';
        if (pathname === '/about') return 'about';
        return 'hero';
      })();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen, closeMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav id="nav" className={cn('fixed top-0 left-0 right-0 z-[200]', scrolled && 'is-scrolled')}>
      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13 flex items-center justify-between w-full py-7 transition-[padding] duration-400 nav-wrap">
        <Link href={isHome ? '#hero' : '/'} className="flex items-center gap-1 text-lg font-bold tracking-tight text-white no-underline">
          {siteSettings.brandName}
          <SparkIcon className="w-4 h-4" fill="var(--color-accent)" />
        </Link>

        {/* Desktop nav links */}
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

        <div className="flex items-center gap-4">
          {/* Let's Talk CTA — hidden on mobile to save space, shown in drawer instead */}
          <Link
            href={isHome ? '#contact' : '/#contact'}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-white border border-white/[.18] px-5.5 py-2.5 rounded-full no-underline transition-all duration-250 hover:bg-white hover:text-bg"
          >
            Let&apos;s Talk ↗
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 bg-transparent border-0 cursor-pointer group"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span
              className={cn(
                'block w-5 h-px bg-white transition-all duration-300 origin-center',
                mobileOpen && 'translate-y-[3.5px] rotate-45'
              )}
            />
            <span
              className={cn(
                'block w-5 h-px bg-white transition-all duration-300 origin-center',
                mobileOpen && '-translate-y-[3.5px] -rotate-45'
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          'md:hidden fixed inset-0 top-0 bg-black/60 backdrop-blur-sm z-[-1] transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-[max-height,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] bg-bg/95 backdrop-blur-xl border-b border-white/5',
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <ul className="flex flex-col gap-1 px-6 py-6 list-none">
          {navLinks.map((link) => (
            <li key={link.id}>
              <Link
                href={isHome ? link.href : link.routeHref}
                onClick={closeMobile}
                className={cn(
                  'block py-3 px-4 rounded-xl text-[15px] font-medium transition-colors',
                  activeId === link.id
                    ? 'text-accent bg-accent/[.06]'
                    : 'text-gray hover:text-white hover:bg-white/[.03]'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-3 mt-2 border-t border-white/5">
            <Link
              href={isHome ? '#contact' : '/#contact'}
              onClick={closeMobile}
              className="block text-center py-3 px-6 rounded-full bg-white text-bg text-sm font-semibold no-underline transition-colors hover:bg-accent"
            >
              Let&apos;s Talk ↗
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
