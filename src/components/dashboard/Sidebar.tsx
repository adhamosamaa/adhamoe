'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { DASHBOARD_HOME, DASHBOARD_NAV, isNavItemActive, type DashboardNavItem } from '@/data/dashboard-nav';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  /** Desktop-only icon-rail mode. Ignored on mobile, where the drawer is always full width. */
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  /** True when the drawer is off-canvas on mobile, removing it from the tab order. */
  inert: boolean;
}

export function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile, inert }: SidebarProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');
      
      if (count !== null) setUnreadCount(count);
    };

    fetchUnreadCount();
  }, [pathname]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        className={cn(
          'fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        inert={inert}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-dash-line bg-dash-surface',
          'transition-[transform,width,background-color,border-color] duration-300 ease-out-expo',
          'lg:sticky lg:top-0 lg:z-30 lg:h-dvh lg:translate-x-0',
          mobileOpen ? 'translate-x-0 shadow-dash-pop' : '-translate-x-full',
          collapsed ? 'lg:w-sidebar-collapsed' : 'lg:w-sidebar',
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            'flex h-header shrink-0 items-center gap-3 border-b border-dash-line px-5',
            collapsed && 'lg:justify-center lg:px-0',
          )}
        >
          <Link
            href={DASHBOARD_HOME}
            onClick={onCloseMobile}
            className="group flex min-w-0 items-center gap-3 rounded-lg"
            aria-label="Studio CMS home"
          >
            <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-ink-950 ring-1 ring-white/10 transition-transform duration-300 ease-out-expo group-hover:scale-105">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 text-[#04d9d9] drop-shadow-[0_0_6px_#04d9d9aa]">
                <path
                  fill="currentColor"
                  d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z"
                />
              </svg>
            </span>
            <span className={cn('min-w-0 leading-tight', collapsed && 'lg:sr-only')}>
              <span className="block truncate text-sm font-semibold tracking-tight text-dash-fg">adhamoe</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-dash-subtle">
                Studio CMS
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="ml-auto inline-flex size-8 items-center justify-center rounded-lg text-dash-muted transition-colors hover:bg-dash-elevated hover:text-dash-fg lg:hidden"
          >
            <X className="size-[18px]" strokeWidth={1.75} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn('flex-1 px-3 py-6', collapsed ? 'overflow-y-auto lg:overflow-visible' : 'overflow-y-auto')}>
          {DASHBOARD_NAV.map((group, index) => (
            <div key={group.label} className="mb-7 last:mb-0">
              <p
                className={cn(
                  'mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-dash-subtle',
                  collapsed && 'lg:sr-only',
                )}
              >
                {group.label}
              </p>
              {collapsed && index > 0 && (
                <span aria-hidden="true" className="mx-auto mb-3 hidden h-px w-6 bg-dash-line lg:block" />
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  let badge = item.badge;
                  if (item.label === 'Messages') {
                    badge = unreadCount && unreadCount > 0 ? unreadCount : undefined;
                  }

                  return (
                    <li key={item.href}>
                      <SidebarLink
                        item={{ ...item, badge }}
                        active={isNavItemActive(pathname, item.href)}
                        collapsed={collapsed}
                        onNavigate={onCloseMobile}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 space-y-1 border-t border-dash-line p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={cn(railItemClass, 'text-dash-muted hover:bg-dash-elevated hover:text-dash-fg', collapsed && 'lg:justify-center lg:px-0')}
          >
            <ExternalLink className="size-[18px] shrink-0 text-dash-subtle transition-colors group-hover:text-dash-fg" strokeWidth={1.75} />
            <span className={cn('truncate', collapsed && 'lg:sr-only')}>View live site</span>
            {collapsed && <RailTooltip label="View live site" />}
          </a>

          <button
            type="button"
            id="dashboard-sidebar-collapse"
            onClick={onToggleCollapsed}
            aria-controls="dashboard-sidebar"
            aria-expanded={!collapsed}
            className={cn(
              railItemClass,
              'hidden w-full text-dash-muted hover:bg-dash-elevated hover:text-dash-fg lg:flex',
              collapsed && 'lg:justify-center lg:px-0',
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-[18px] shrink-0 text-dash-subtle transition-colors group-hover:text-dash-fg" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="size-[18px] shrink-0 text-dash-subtle transition-colors group-hover:text-dash-fg" strokeWidth={1.75} />
            )}
            <span className={cn('truncate', collapsed && 'sr-only')}>{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
            {collapsed && <RailTooltip label="Expand sidebar" />}
          </button>
        </div>
      </aside>
    </>
  );
}

const railItemClass =
  'group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-200';

interface SidebarLinkProps {
  item: DashboardNavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}

function SidebarLink({ item, active, collapsed, onNavigate }: SidebarLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        railItemClass,
        active
          ? 'bg-dash-elevated font-medium text-dash-fg'
          : 'text-dash-muted hover:bg-dash-elevated/60 hover:text-dash-fg',
        collapsed && 'lg:justify-center lg:px-0',
      )}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-dash-brand shadow-dash-glow"
        />
      )}

      <Icon
        strokeWidth={1.75}
        className={cn(
          'size-[18px] shrink-0 transition-colors duration-200',
          active ? 'text-dash-brand' : 'text-dash-subtle group-hover:text-dash-fg',
        )}
      />
      <span className={cn('truncate', collapsed && 'lg:sr-only')}>{item.label}</span>

      {item.badge ? (
        <>
          <span
            className={cn(
              'ml-auto rounded-full bg-dash-brand/15 px-1.5 py-px text-[10px] font-semibold tabular-nums text-dash-brand',
              collapsed && 'lg:hidden',
            )}
          >
            {item.badge}
            <span className="sr-only"> unread</span>
          </span>
          {collapsed && (
            <span
              aria-hidden="true"
              className="absolute right-4 top-2 hidden size-1.5 rounded-full bg-dash-brand shadow-dash-glow lg:block"
            />
          )}
        </>
      ) : null}

      {collapsed && <RailTooltip label={item.label} />}
    </Link>
  );
}

/** Hover/focus label shown next to icons when the desktop sidebar is collapsed. */
function RailTooltip({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute left-full top-1/2 z-50 ml-4 hidden -translate-x-1 -translate-y-1/2 whitespace-nowrap',
        'rounded-md bg-dash-surface px-2.5 py-1.5 text-xs font-medium text-dash-fg shadow-dash-pop',
        'opacity-0 transition-all duration-200 ease-out-expo',
        'group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 lg:block',
      )}
    >
      {label}
    </span>
  );
}
