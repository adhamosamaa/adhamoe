'use client';

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import { cn } from '@/utils/cn';
import { isFocusRoute } from '@/data/dashboard-nav';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { SIDEBAR_COOKIE, writePreferenceCookie, type DashboardTheme } from './preferences';

const DESKTOP_QUERY = '(min-width: 1024px)';

function subscribeToViewport(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

interface DashboardShellProps {
  initialTheme: DashboardTheme;
  initialCollapsed: boolean;
  children: ReactNode;
}

export function DashboardShell({ initialTheme, initialCollapsed, children }: DashboardShellProps) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <ShellFrame initialCollapsed={initialCollapsed}>{children}</ShellFrame>
    </ThemeProvider>
  );
}

function ShellFrame({ initialCollapsed, children }: { initialCollapsed: boolean; children: ReactNode }) {
  const { theme } = useTheme();
  const focusMode = isFocusRoute(usePathname());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const isDesktop = useSyncExternalStore(
    subscribeToViewport,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const toggleCollapsed = useCallback(() => {
    const next = !collapsed;
    setCollapsed(next);
    writePreferenceCookie(SIDEBAR_COOKIE, next ? 'collapsed' : 'expanded');
  }, [collapsed]);

  // While the mobile drawer is open: lock scroll, close on Escape, close when resized to desktop.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    mql.addEventListener('change', onViewportChange);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      mql.removeEventListener('change', onViewportChange);
    };
  }, [mobileOpen]);

  if (focusMode) {
    return (
      <div
        className={cn(
          'dash-root relative min-h-dvh bg-dash-canvas font-display text-dash-fg antialiased transition-colors duration-300',
          theme === 'dark' && 'dark',
        )}
      >
        <Toaster theme={theme === 'dark' ? 'dark' : 'light'} toastOptions={{ className: 'font-display' }} />
        <main id="dashboard-main">{children}</main>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'dash-root relative flex min-h-dvh bg-dash-canvas font-display text-dash-fg antialiased transition-colors duration-300',
        theme === 'dark' && 'dark',
      )}
    >
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-dash-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-dash-brand-fg"
      >
        Skip to content
      </a>

      <Toaster theme={theme === 'dark' ? 'dark' : 'light'} toastOptions={{ className: 'font-display' }} />

      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
        inert={!isDesktop && !mobileOpen}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div aria-hidden="true" className="dash-ambient pointer-events-none absolute inset-x-0 top-0 h-[28rem]" />
        <Header onOpenMobileNav={openMobile} mobileNavOpen={mobileOpen} />
        <main id="dashboard-main" tabIndex={-1} className="relative flex-1 px-4 py-6 outline-none sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
