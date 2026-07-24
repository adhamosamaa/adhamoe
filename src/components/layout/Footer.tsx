'use client';

import Link from 'next/link';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { SparkIcon } from '@/components/ui/SparkIcon';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { siteSettings } from '@/data/settings';
import { socialLinks } from '@/data/social';

export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-14 pb-10 border-t border-white/5 relative z-10 overflow-hidden">
      {/* Ambient Radial Accent Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] pointer-events-none blur-[100px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse at bottom, var(--color-accent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13 relative z-10 flex flex-col gap-10">
        {/* Row 1: Social Media Cards with Cyan Accent Hover Glow */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.02] border border-white/10 hover:border-accent/40 hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(4,217,217,0.12)] text-xs font-medium text-gray hover:text-white transition-all duration-300 group"
              aria-label={social.label}
            >
              <SocialIcon id={social.id} className="w-3.5 h-3.5 text-gray/70 group-hover:text-accent transition-colors" />
              <span>{social.label}</span>
              <ArrowUpRight className="w-3 h-3 text-gray/40 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ))}
        </div>

        {/* Row 2: Elevated Brand, Centered Copyright, Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5 text-center sm:text-left">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-base font-bold tracking-tight no-underline text-white hover:text-accent transition-colors"
          >
            {siteSettings.brandName}
            <SparkIcon className="w-3.5 h-3.5" fill="var(--color-accent)" />
          </Link>

          {/* Centered Copyright */}
          <span className="text-xs text-gray-dim font-light tracking-wide">
            © {year} - Designed with intention
          </span>

          {/* Back to top with Animated Arrow */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-medium text-gray hover:text-white transition-colors cursor-pointer bg-transparent border-0 font-inherit group"
          >
            <span>Back to top</span>
            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 group-hover:border-accent/40 group-hover:bg-accent/10 flex items-center justify-center transition-all duration-300">
              <ArrowUp className="w-3 h-3 text-gray group-hover:text-accent group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
