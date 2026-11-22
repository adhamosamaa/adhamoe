import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import '../dashboard/dashboard.css'; // Reusing dashboard tokens for the login page

export const metadata: Metadata = {
  title: 'Sign in · Studio CMS',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  // We force a dark theme for the login page for that premium studio look.
  return (
    <div className="dash-root dark relative flex min-h-dvh bg-dash-canvas font-display text-dash-fg antialiased">
      <div aria-hidden="true" className="dash-ambient pointer-events-none absolute inset-x-0 top-0 h-[28rem]" />
      <Toaster theme="dark" toastOptions={{ className: 'font-display' }} />
      {children}
    </div>
  );
}
