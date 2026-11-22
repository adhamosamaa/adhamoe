import {
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  /** Static placeholder count — will be wired to Supabase in a later step. */
  badge?: number;
}

export interface DashboardNavGroup {
  label: string;
  items: DashboardNavItem[];
}

export const DASHBOARD_HOME = '/dashboard';

export const DASHBOARD_NAV: DashboardNavGroup[] = [
  {
    label: 'Content',
    items: [
      {
        label: 'Dashboard',
        href: DASHBOARD_HOME,
        icon: LayoutDashboard,
        description: 'A snapshot of your studio at a glance.',
      },
      {
        label: 'Projects',
        href: '/dashboard/projects',
        icon: FolderKanban,
        description: 'Create, organise, and publish portfolio case studies.',
      },
      {
        label: 'Pages',
        href: '/dashboard/pages',
        icon: FileText,
        description: 'Edit the copy and sections of your public pages.',
      },
    ],
  },
  {
    label: 'Engage',
    items: [
      {
        label: 'Messages',
        href: '/dashboard/messages',
        icon: Inbox,
        description: 'Read and respond to enquiries from your contact form.',
        badge: 3,
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        description: 'Site metadata, profile, integrations, and preferences.',
      },
    ],
  },
];

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = DASHBOARD_NAV.flatMap((group) => group.items);

/** Full-screen "focus mode" routes (the project builder) render without the sidebar and header. */
const FOCUS_ROUTE = /^\/dashboard\/projects\/(new|[^/]+\/edit)\/?$/;
export function isFocusRoute(pathname: string): boolean {
  return FOCUS_ROUTE.test(pathname);
}

/** Exact match for the dashboard home; prefix match for every other section. */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === DASHBOARD_HOME) return pathname === DASHBOARD_HOME;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveNavItem(pathname: string): DashboardNavItem | undefined {
  return DASHBOARD_NAV_ITEMS.find((item) => isNavItemActive(pathname, item.href));
}
