import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProjectList from './ProjectList';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-dash-fade-up">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-dash-brand">Studio</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
          <p className="mt-2 max-w-xl text-sm text-dash-muted">
            Manage your graphic design projects and case studies.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-dash-brand px-4 text-sm font-medium text-dash-brand-fg transition-all duration-200 hover:-translate-y-px hover:bg-dash-brand/90 hover:shadow-dash-glow focus:outline-none focus:ring-4 focus:ring-dash-brand/20"
        >
          <Plus className="size-4" strokeWidth={2} />
          New Project
        </Link>
      </header>
      
      {error ? (
        <div className="rounded-lg border border-dash-danger/20 bg-dash-danger/10 p-4 text-sm text-dash-danger">
          Failed to load projects: {error.message}
        </div>
      ) : (
        <ProjectList initialProjects={projects || []} />
      )}
    </div>
  );
}
