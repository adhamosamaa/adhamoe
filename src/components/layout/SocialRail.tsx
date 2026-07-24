'use client';

import { motion } from 'framer-motion';
import { socialLinks } from '@/data/social';

export function SocialRail() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="hidden xl:flex flex-col items-center gap-5 absolute left-13 top-1/2 -translate-y-1/2 z-10"
    >
      <span className="w-px h-10 bg-white/[.08]" aria-hidden="true"></span>
      {socialLinks.map((social) => (
        <motion.a
          key={social.id}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          whileHover={{ y: -2, color: '#ffffff' }}
          className="text-gray-dim text-[11px] tracking-wide no-underline transition-colors [writing-mode:vertical-rl] rotate-180"
        >
          {social.label}
        </motion.a>
      ))}
      <span className="w-px h-10 bg-white/[.08]" aria-hidden="true"></span>
    </motion.div>
  );
}

