import Link from 'next/link';
import { ArrowUpRight, Plus, FolderKanban, Mail, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { cn } from '@/utils/cn';

export default async function DashboardOverviewPage() {
  const supabase = await createClient();

  // 1. Fetch counts and recent data in parallel
  const [{ count: projectsCount }, { count: unreadCount }, { data: recentProjects }] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    supabase.from('projects')
      .select('id, title, cover_image_url, created_at, is_published, status')
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  return (
    <div className="space-y-10 animate-dash-fade-up">
      {/* Header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-dash-brand">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, <span className="font-serif font-normal italic text-dash-brand">Adham</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-dash-muted">
            Here&apos;s the latest state of your portfolio studio.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/messages"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-dash-surface px-4 text-sm font-medium text-dash-fg border border-dash-line transition-all hover:bg-dash-elevated hover:text-white"
          >
            <Mail className="size-4" strokeWidth={2} />
            View Messages
          </Link>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-dash-brand px-4 text-sm font-medium text-dash-brand-fg transition-all hover:bg-dash-brand/90 hover:shadow-dash-glow focus:ring-4 focus:ring-dash-brand/20"
          >
            <Plus className="size-4" strokeWidth={2} />
            New Project
          </Link>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2">
        {/* Projects Stat */}
        <Link
          href="/dashboard/projects"
          className="group relative overflow-hidden rounded-2xl bg-dash-surface p-6 shadow-dash-card transition-all duration-300 hover:-translate-y-1 hover:shadow-dash-pop border border-dash-line"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-lg bg-dash-elevated text-dash-muted transition-colors group-hover:text-dash-brand">
              <FolderKanban className="size-5" strokeWidth={1.75} />
            </span>
            <ArrowUpRight className="size-5 text-dash-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" strokeWidth={1.75} />
          </div>
          <p className="mt-6 text-sm font-medium text-dash-muted">Total Projects</p>
          <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-dash-fg">
            {projectsCount ?? 0}
          </p>
        </Link>

        {/* Messages Stat */}
        <Link
          href="/dashboard/messages"
          className="group relative overflow-hidden rounded-2xl bg-dash-surface p-6 shadow-dash-card transition-all duration-300 hover:-translate-y-1 hover:shadow-dash-pop border border-dash-line"
        >
          <div className="flex items-center justify-between">
            <span className={cn(
              "grid size-10 place-items-center rounded-lg transition-colors",
              (unreadCount && unreadCount > 0) ? "bg-dash-brand/15 text-dash-brand" : "bg-dash-elevated text-dash-muted group-hover:text-dash-brand"
            )}>
              <Mail className="size-5" strokeWidth={1.75} />
            </span>
            <ArrowUpRight className="size-5 text-dash-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" strokeWidth={1.75} />
          </div>
          <p className="mt-6 text-sm font-medium text-dash-muted">Unread Messages</p>
          <p className={cn(
            "mt-2 text-4xl font-semibold tabular-nums tracking-tight",
            (unreadCount && unreadCount > 0) ? "text-dash-brand" : "text-dash-fg"
          )}>
            {unreadCount ?? 0}
          </p>
        </Link>
      </section>

      {/* Recent Projects */}
      <section className="rounded-2xl border border-dash-line bg-dash-surface shadow-dash-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-dash-line p-6 bg-dash-surface/50">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-dash-fg">Recent Projects</h2>
            <p className="text-sm text-dash-muted mt-1">Your latest portfolio additions</p>
          </div>
          <Link href="/dashboard/projects" className="text-sm text-dash-subtle hover:text-dash-brand transition-colors flex items-center gap-1 font-medium">
            View All <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>
        
        <div className="flex flex-col">
          {(!recentProjects || recentProjects.length === 0) ? (
            <div className="p-12 text-center text-sm text-dash-muted">No projects found.</div>
          ) : (
            recentProjects.map((project, index) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}/edit`}
                className={cn(
                  "group flex items-center gap-4 p-4 transition-colors hover:bg-dash-canvas",
                  index !== recentProjects.length - 1 && "border-b border-dash-line"
                )}
              >
                {/* Thumbnail */}
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-dash-line bg-dash-elevated">
                  {project.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={project.cover_image_url} 
                      alt={project.title} 
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="grid size-full place-items-center">
                      <ImageIcon className="size-4 text-dash-subtle" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-center min-w-0">
                  <span className="truncate font-medium text-dash-fg group-hover:text-dash-brand transition-colors">
                    {project.title}
                  </span>
                  <span className="text-xs text-dash-muted mt-0.5">
                    {new Date(project.created_at).toLocaleDateString(undefined, { 
                      month: 'short', day: 'numeric', year: 'numeric' 
                    })}
                  </span>
                </div>

                {/* Status */}
                <div className="shrink-0 pl-2">
                  {(() => {
                    const isPub = project.status === 'published' || project.is_published;
                    return (
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        isPub
                          ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 ring-1 ring-inset ring-amber-500/20"
                      )}>
                        {isPub ? 'Published' : 'Draft'}
                      </span>
                    );
                  })()}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
