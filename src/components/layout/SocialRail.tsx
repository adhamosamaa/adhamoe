import { socialLinks } from '@/data/social';

export function SocialRail() {
  return (
    <div className="hidden xl:flex flex-col items-center gap-5 absolute left-13 top-1/2 -translate-y-1/2 z-10">
      <span className="w-px h-10 bg-white/[.08]" aria-hidden="true"></span>
      {socialLinks.map((social) => (
        <a
          key={social.id}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="text-gray-dim text-[11px] tracking-wide no-underline transition-colors hover:text-white [writing-mode:vertical-rl] rotate-180"
        >
          {social.label}
        </a>
      ))}
      <span className="w-px h-10 bg-white/[.08]" aria-hidden="true"></span>
    </div>
  );
}
