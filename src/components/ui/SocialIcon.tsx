interface SocialIconProps {
  id: string;
  className?: string;
}

export function SocialIcon({ id, className = 'w-4 h-4' }: SocialIconProps) {
  switch (id.toLowerCase()) {
    case 'instagram':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'behance':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 7h-7V5h7v2zm-11.8 1.4c.5 0 1-.1 1.4-.3.4-.2.7-.5.9-.9.3-.4.3-.9.3-1.4 0-.6-.1-1.1-.4-1.5-.3-.4-.7-.7-1.2-.9C10.7 3.1 10.1 3 9.4 3H3v10h6.8c.8 0 1.5-.1 2.1-.4.6-.3 1.1-.7 1.4-1.2.3-.5.5-1.1.5-1.8 0-.7-.2-1.3-.5-1.8-.3-.4-.8-.7-1.3-.9c-.6-.1-1.2-.3-1.8-.3zm-4-3.6h2.7c.6 0 1.1.1 1.4.4.3.3.5.7.5 1.2 0 .5-.2.9-.5 1.2-.3.3-.8.4-1.4.4H6.2V4.8zm3.2 6.4H6.2V8.3h3.2c.7 0 1.2.1 1.6.4.4.3.6.8.6 1.4 0 .6-.2 1.1-.6 1.4-.4.3-1 .4-1.8.4zm10.7-3.9c-.8 0-1.5.2-2.1.6-.6.4-1.1 1-1.4 1.7-.3.7-.5 1.6-.5 2.5 0 1 .2 1.8.5 2.5.3.7.8 1.3 1.4 1.7.6.4 1.4.6 2.2.6.9 0 1.7-.2 2.3-.7.7-.5 1.1-1.1 1.4-1.9h-2.1c-.2.3-.4.6-.7.8-.3.2-.7.3-1.1.3-.6 0-1.1-.2-1.5-.6-.4-.4-.6-.9-.7-1.6h7.9c.1-.3.1-.6.1-.9 0-1-.2-1.8-.5-2.5-.3-.7-.8-1.3-1.4-1.7-.6-.4-1.3-.6-2.2-.6zm-2.1 3.5c.1-.6.3-1 .6-1.3.3-.3.8-.5 1.4-.5.6 0 1.1.2 1.4.5.3.3.5.7.6 1.3h-4c0 0 0 0 0 0z" />
        </svg>
      );
  }
}
