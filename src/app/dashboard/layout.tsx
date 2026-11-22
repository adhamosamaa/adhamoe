import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { SIDEBAR_COOKIE, THEME_COOKIE, parseTheme } from '@/components/dashboard/preferences';
import './dashboard.css';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard · Studio CMS',
    template: '%s · Studio CMS',
  },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Preferences are read server-side so the first paint already matches the user's choice.
  const cookieStore = await cookies();
  const initialTheme = parseTheme(cookieStore.get(THEME_COOKIE)?.value);
  const initialCollapsed = cookieStore.get(SIDEBAR_COOKIE)?.value === 'collapsed';

  return (
    <DashboardShell initialTheme={initialTheme} initialCollapsed={initialCollapsed}>
      {children}
    </DashboardShell>
  );
}
