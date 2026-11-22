import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { ProjectBuilder } from '@/components/dashboard/project-builder/ProjectBuilder';
import { draftFromRecord, type ProjectRecord } from '@/components/dashboard/project-builder/draft';
import { getProjectSuggestions } from '../../suggestions';

export const metadata: Metadata = { title: 'Edit project' };

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project, error }, suggestions] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, description, challenge, solution, category, tags, tools, services, cover_image_url, gallery_images, media_gallery, status, is_published')
      .eq('id', id)
      .single<ProjectRecord>(),
    getProjectSuggestions(),
  ]);

  if (error || !project) notFound();

  return (
    <ProjectBuilder
      projectId={project.id}
      initialDraft={draftFromRecord(project)}
      isPublished={project.status === 'published' || Boolean(project.is_published)}
      suggestions={suggestions}
    />
  );
}
