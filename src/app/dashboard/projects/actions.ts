'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  MAX_PROJECT_IMAGES,
  toStringList,
  toText,
  type ProjectInput,
} from '@/components/dashboard/project-builder/draft';

export type SaveProjectResult =
  | { ok: true; id: string; slug: string; published: boolean }
  | { ok: false; error: string };

const UNTITLED = 'Untitled project';
const UNTITLED_SLUG_PREFIX = 'untitled-';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}

/** Returns `base`, or `base-2`, `base-3`… — whichever is not already taken by another project. */
async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeId?: string,
): Promise<string> {
  let query = supabase.from('projects').select('slug').like('slug', `${base}%`);
  if (excludeId) query = query.neq('id', excludeId);
  const { data } = await query;

  const taken = new Set((data ?? []).map((row) => row.slug as string));
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}

/**
 * Creates (no `id`) or updates a project from the two-step builder.
 *
 * Intentionally does NOT `redirect()`: the client must first learn the save
 * succeeded so it can clear its localStorage safety-net, then navigate.
 */
export async function saveProjectAction(
  input: ProjectInput,
  options: { id?: string; publish: boolean },
): Promise<SaveProjectResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Your session has expired. Please sign in again.' };

  // Never trust the client payload shape.
  const title = toText(input.title, 200).trim();
  const images = toStringList(input.images, MAX_PROJECT_IMAGES);
  const coverUrl = toText(input.coverUrl, 2_000).trim() || images[0] || '';
  const publish = options.publish === true;

  if (publish && !title) return { ok: false, error: 'Add a title before publishing.' };
  if (publish && images.length === 0) return { ok: false, error: 'Add at least one image before publishing.' };

  const fields = {
    title: title || UNTITLED,
    description: toText(input.description).trim() || null,
    challenge: toText(input.challenge).trim() || null,
    solution: toText(input.solution).trim() || null,
    category: toText(input.category, 120).trim() || null,
    tags: toStringList(input.tags),
    tools: toStringList(input.tools),
    services: toStringList(input.services),
    cover_image_url: coverUrl || null,
    media_gallery: input.blocks,
    gallery_images: images.length > 0 ? images : null,
    status: publish ? 'published' : 'draft',
    is_published: publish,
  };

  let id: string;
  let slug: string;

  if (options.id) {
    const { data: existing, error: readError } = await supabase
      .from('projects')
      .select('slug')
      .eq('id', options.id)
      .single();
    if (readError || !existing) return { ok: false, error: 'Project not found.' };

    // Keep public URLs stable — only replace placeholder slugs from untitled drafts.
    slug = existing.slug as string;
    if (title && slug.startsWith(UNTITLED_SLUG_PREFIX)) {
      slug = await uniqueSlug(supabase, slugify(title) || slug, options.id);
    }

    const { error } = await supabase
      .from('projects')
      .update({
        ...fields,
        slug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', options.id);
    if (error) return { ok: false, error: error.message };
    id = options.id;
  } else {
    const base = slugify(title) || `${UNTITLED_SLUG_PREFIX}${Date.now().toString(36)}`;
    slug = await uniqueSlug(supabase, base);

    // gradient and icon are omitted so Supabase DB defaults take over
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...fields,
        slug,
        year: String(new Date().getFullYear()),
      })
      .select('id')
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? 'Could not create project.' };
    id = data.id as string;
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/projects');
  revalidatePath('/works');
  revalidatePath(`/works/${slug}`);
  revalidatePath('/');

  return { ok: true, id, slug, published: publish };
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/projects');
  return { success: true };
}
