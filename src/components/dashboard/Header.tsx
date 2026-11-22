'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User, X, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getActiveNavItem } from '@/data/dashboard-nav';
import { iconButtonClass } from './preferences';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface HeaderProps {
  onOpenMobileNav: () => void;
  mobileNavOpen: boolean;
}

export function Header({ onOpenMobileNav, mobileNavOpen }: HeaderProps) {
  const pathname = usePathname();
  const current = getActiveNavItem(pathname);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // ⌘K / Ctrl+K focuses search (opens the mobile search row on small screens).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      const input = desktopSearchRef.current;
      if (input && input.offsetParent !== null) input.focus();
      else setMobileSearchOpen(true);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-dash-line bg-dash-canvas/75 backdrop-blur-xl transition-colors duration-300">
      <div className="flex h-header items-center gap-2 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          id="dashboard-mobile-nav-toggle"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          aria-controls="dashboard-sidebar"
          aria-expanded={mobileNavOpen}
          className={cn(iconButtonClass, '-ml-2 lg:hidden')}
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-2 text-sm">
            <li className="hidden text-dash-subtle sm:block">Studio</li>
            <li aria-hidden="true" className="hidden text-dash-line-strong sm:block">
              /
            </li>
            <li aria-current="page" className="truncate font-medium text-dash-fg">
              {current?.label ?? 'Dashboard'}
            </li>
          </ol>
        </nav>

        <SearchField inputRef={desktopSearchRef} id="dashboard-search" className="ml-6 hidden max-w-md flex-1 md:flex" />

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((open) => !open)}
            aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={mobileSearchOpen}
            aria-controls="dashboard-mobile-search"
            className={cn(iconButtonClass, 'md:hidden')}
          >
            {mobileSearchOpen ? <X className="size-[18px]" strokeWidth={1.75} /> : <Search className="size-[18px]" strokeWidth={1.75} />}
          </button>

          <ThemeToggle />

          <button type="button" id="dashboard-notifications" aria-label="Notifications" className={iconButtonClass}>
            <Bell className="size-[18px]" strokeWidth={1.75} />
            <span aria-hidden="true" className="absolute right-2 top-2 size-1.5 rounded-full bg-dash-brand shadow-dash-glow" />
          </button>

          <span aria-hidden="true" className="mx-2 hidden h-6 w-px bg-dash-line sm:block" />

          <UserMenu />
        </div>
      </div>

      {mobileSearchOpen && (
        <div id="dashboard-mobile-search" className="animate-dash-fade-up border-t border-dash-line px-4 py-3 md:hidden">
          <SearchField id="dashboard-search-mobile" autoFocus className="flex w-full" />
        </div>
      )}
    </header>
  );
}

/* ── Search ─────────────────────────────────────────────────────────────── */

const subscribeNoop = () => () => {};

interface SearchFieldProps {
  id: string;
  className?: string;
  autoFocus?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

function SearchField({ id, className, autoFocus, inputRef }: SearchFieldProps) {
  const isMac = useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => true,
  );

  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className={cn('group relative items-center', className)}>
      <label htmlFor={id} className="sr-only">
        Search the studio
      </label>
      <Search
        aria-hidden="true"
        strokeWidth={1.75}
        className="pointer-events-none absolute left-3 size-4 text-dash-subtle transition-colors group-focus-within:text-dash-brand"
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="Search projects, pages…"
        className={cn(
          'h-9 w-full rounded-lg border border-dash-line bg-dash-surface/70 pl-9 pr-16 text-sm text-dash-fg',
          'placeholder:text-dash-subtle transition-[border-color,box-shadow,background-color] duration-200',
          'hover:border-dash-line-strong focus:border-dash-brand/60 focus:bg-dash-surface focus:outline-none focus:ring-4 focus:ring-dash-brand/10',
          '[&::-webkit-search-cancel-button]:hidden',
        )}
      />
      <kbd className="pointer-events-none absolute right-2 hidden items-center gap-0.5 rounded-md border border-dash-line bg-dash-elevated px-1.5 py-0.5 font-display text-[10px] font-medium text-dash-muted sm:inline-flex">
        {isMac ? '⌘' : 'Ctrl'} K
      </kbd>
    </form>
  );
}

/* ── User menu ──────────────────────────────────────────────────────────── */

function UserMenu() {
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch {
      toast.error('Failed to sign out');
      setIsSigningOut(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id="dashboard-user-menu"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="dashboard-user-menu-panel"
        aria-label="Account menu"
        className="flex items-center gap-2.5 rounded-lg p-1 pr-1.5 transition-colors duration-200 hover:bg-dash-elevated sm:pr-2"
      >
        <Avatar />
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-medium text-dash-fg">Adham Osama</span>
          <span className="block text-[11px] text-dash-subtle">Administrator</span>
        </span>
        <ChevronDown
          strokeWidth={1.75}
          className={cn(
            'hidden size-4 text-dash-subtle transition-transform duration-300 ease-out-expo sm:block',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          id="dashboard-user-menu-panel"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-dash-pop-in rounded-xl bg-dash-surface p-1.5 shadow-dash-pop"
        >
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <Avatar />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-dash-fg">Adham Osama</p>
              <p className="truncate text-xs text-dash-subtle">admin@adhamoe.studio</p>
            </div>
          </div>
          <div className="my-1 h-px bg-dash-line" />
          <ul className="space-y-0.5 text-sm">
            <li>
              <Link href="/dashboard/settings" onClick={close} className={menuItemClass}>
                <User className="size-4 text-dash-subtle" strokeWidth={1.75} />
                Profile
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings" onClick={close} className={menuItemClass}>
                <Settings className="size-4 text-dash-subtle" strokeWidth={1.75} />
                Settings
              </Link>
            </li>
          </ul>
          <div className="my-1 h-px bg-dash-line" />
          <button 
            type="button" 
            onClick={handleSignOut} 
            disabled={isSigningOut}
            className={cn(menuItemClass, 'w-full text-dash-danger hover:text-dash-danger disabled:opacity-50 disabled:cursor-not-allowed')}
          >
            {isSigningOut ? <Loader2 className="size-4 animate-spin" strokeWidth={1.75} /> : <LogOut className="size-4" strokeWidth={1.75} />}
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemClass =
  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-dash-muted transition-colors duration-150 hover:bg-dash-elevated hover:text-dash-fg';

/** Placeholder avatar — swap for the profile image once auth is wired up. */
function Avatar() {
  return (
    <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-ink-600 to-ink-900 text-[11px] font-semibold tracking-wide text-white ring-1 ring-white/10">
      AO
      <span
        aria-hidden="true"
        className="absolute -bottom-px -right-px size-2.5 rounded-full bg-emerald-400 ring-2 ring-dash-surface"
      />
    </span>
  );
}
