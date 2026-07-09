import type { ReactNode } from 'react';

interface AccentTextProps {
  children: ReactNode;
}

export function AccentText({ children }: AccentTextProps) {
  return <span className="accent-serif">{children}</span>;
}
