import { createClient } from '@/utils/supabase/client';

export const MEDIA_BUCKET = 'portfolio-media';
export const ACCEPTED_IMAGE_TYPES = 'image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml';

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/** Uploads one image to Supabase Storage and resolves with its public URL. Throws on failure. */
export async function uploadProjectImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const base =
    file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || 'image';
  const path = `projects/${Date.now()}-${base}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type });

  if (error || !data) throw new Error(error?.message ?? 'Upload failed');
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(data.path).data.publicUrl;
}
