/**
 * Dashboard UI preferences persisted in cookies so the server layout can
 * render the correct theme / sidebar state on first paint (no flash).
 */

export type DashboardTheme = 'dark' | 'light';

export const THEME_COOKIE = 'dash-theme';
export const SIDEBAR_COOKIE = 'dash-sidebar';

export function parseTheme(value: string | undefined): DashboardTheme {
  return value === 'light' ? 'light' : 'dark';
}

/** Client-only: persists a preference for one year. */
export function writePreferenceCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

/** Shared class string for square icon buttons in the header. */
export const iconButtonClass =
  'relative inline-flex size-9 items-center justify-center rounded-lg text-dash-muted transition-colors duration-200 hover:bg-dash-elevated hover:text-dash-fg';
