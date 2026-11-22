import type { Metadata } from 'next';
import { ProjectBuilder } from '@/components/dashboard/project-builder/ProjectBuilder';
import { EMPTY_DRAFT } from '@/components/dashboard/project-builder/draft';
import { getProjectSuggestions } from '../suggestions';

export const metadata: Metadata = { title: 'New project' };

export default async function NewProjectPage() {
  const suggestions = await getProjectSuggestions();
  return <ProjectBuilder initialDraft={EMPTY_DRAFT} isPublished={false} suggestions={suggestions} />;
}
