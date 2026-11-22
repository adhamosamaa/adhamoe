import { createClient } from '@/utils/supabase/server';
import type { Project } from '@/types';

function extractMediaData(row: any): { gallery: string[]; mediaBlocks: Project['mediaBlocks'] } {
  const rawGallery = row.media_gallery || row.gallery_images;
  if (!Array.isArray(rawGallery)) {
    return { gallery: [], mediaBlocks: [] };
  }

  // Check if rawGallery contains MediaBlock objects or plain strings
  const isBlockArray = rawGallery.some((item) => item && typeof item === 'object' && 'type' in item);

  if (isBlockArray) {
    const mediaBlocks = rawGallery
      .filter((item): item is { id?: string; type: 'single' | 'grid' | 'carousel'; urls?: string[] } => {
        return Boolean(item && typeof item === 'object' && 'type' in item);
      })
      .map((item, index) => ({
        id: item.id || `block-${index}`,
        type: item.type,
        urls: Array.isArray(item.urls) ? item.urls.filter((u): u is string => typeof u === 'string' && u.trim().length > 0) : [],
      }));

    const galleryUrls: string[] = [];
    for (const b of mediaBlocks) {
      for (const u of b.urls) {
        if (!galleryUrls.includes(u)) galleryUrls.push(u);
      }
    }

    return { gallery: galleryUrls, mediaBlocks };
  }

  // Legacy string array
  const stringUrls = rawGallery.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
  const mediaBlocks = stringUrls.map((url, idx) => ({
    id: `block-legacy-${idx}`,
    type: 'single' as const,
    urls: [url],
  }));

  return { gallery: stringUrls, mediaBlocks };
}

function mapRowToProject(row: any): Project {
  const { gallery, mediaBlocks } = extractMediaData(row);
  return {
    id: row.slug, // Maps DB slug to frontend 'id'
    title: row.title,
    description: row.description || '',
    tags: row.tags || [],
    year: row.year || '',
    gradient: row.gradient || 'gradient-1',
    icon: row.icon || 'orbit',
    cover: row.cover_image || row.cover_image_url || '',
    gallery,
    mediaBlocks,
    category: row.category || '',
    overview: row.overview || '',
    services: row.services || [],
    tools: row.tools || [],
    challenge: row.challenge || '',
    solution: row.solution || '',
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .or('status.eq.published,is_published.eq.true')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapRowToProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .or('status.eq.published,is_published.eq.true')
    .single();

  if (error || !data) return null;
  return mapRowToProject(data);
}