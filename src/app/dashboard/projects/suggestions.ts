import { createClient } from '@/utils/supabase/server';
import type { ProjectSuggestions } from '@/components/dashboard/project-builder/draft';

function collect(values: Iterable<string | null | undefined>): string[] {
  const map = new Map<string, string>();
  for (const v of values) {
    const t = v?.trim();
    if (t && !map.has(t.toLowerCase())) map.set(t.toLowerCase(), t);
  }
  return [...map.values()].sort((a, b) => a.localeCompare(b));
}

/** Distinct categories / tags / tools / services already used across projects, for autocomplete. */
export async function getProjectSuggestions(): Promise<ProjectSuggestions> {
  const supabase = await createClient();
  const { data } = await supabase.from('projects').select('category, tags, tools, services');
  const rows = (data ?? []) as Array<{
    category: string | null;
    tags: string[] | null;
    tools: string[] | null;
    services: string[] | null;
  }>;

  return {
    categories: collect(rows.map((r) => r.category)),
    tags: collect(rows.flatMap((r) => r.tags ?? [])),
    tools: collect(rows.flatMap((r) => r.tools ?? [])),
    services: collect(rows.flatMap((r) => r.services ?? [])),
  };
}
