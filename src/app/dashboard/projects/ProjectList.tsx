'use client';

import { useState } from 'react';
import { Trash2, Edit, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProjectAction } from './actions';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  cover_image_url: string | null;
  cover_image?: string | null;
  client_name: string | null;
  description: string | null;
  is_published: boolean;
  status?: string | null;
  created_at: string;
}

export default function ProjectList({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    setDeletingId(id);
    const res = await deleteProjectAction(id);
    
    if (res.error) {
      toast.error(`Failed to delete project: ${res.error}`);
    } else {
      toast.success('Project deleted successfully');
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dash-line bg-dash-surface py-20 text-center shadow-dash-card">
        <ImageIcon className="size-10 text-dash-subtle" strokeWidth={1} />
        <h3 className="mt-4 text-base font-medium text-dash-fg">No projects found</h3>
        <p className="mt-1 text-sm text-dash-muted">Create your first project to showcase your work.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const isDeleting = deletingId === project.id;
        return (
          <div
            key={project.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-dash-line bg-dash-surface shadow-dash-card transition-all duration-300 hover:-translate-y-1 hover:shadow-dash-pop"
          >
            {/* Cover Image */}
            <div className="relative aspect-video w-full overflow-hidden border-b border-dash-line bg-dash-elevated">
              {project.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="grid h-full w-full place-items-center">
                  <ImageIcon className="size-8 text-dash-subtle opacity-50" strokeWidth={1} />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute left-3 top-3">
                {(() => {
                  const isPub = project.status === 'published' || project.is_published;
                  return (
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                        isPub
                          ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 ring-1 ring-inset ring-amber-500/20'
                      )}
                    >
                      {isPub ? 'Published' : 'Draft'}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="truncate text-lg font-medium tracking-tight text-dash-fg" title={project.title}>
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-dash-muted">
                {project.category || 'Uncategorized'} {project.client_name && `• ${project.client_name}`}
              </p>
              
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-xs text-dash-subtle">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="grid size-8 place-items-center rounded-lg text-dash-muted transition-colors hover:bg-dash-elevated hover:text-dash-fg"
                    title="Edit Project"
                  >
                    <Edit className="size-4" strokeWidth={1.75} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={isDeleting}
                    className="grid size-8 place-items-center rounded-lg text-dash-muted transition-colors hover:bg-dash-danger/10 hover:text-dash-danger disabled:opacity-50"
                    title="Delete Project"
                  >
                    {isDeleting ? (
                      <Loader2 className="size-4 animate-spin text-dash-danger" />
                    ) : (
                      <Trash2 className="size-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
