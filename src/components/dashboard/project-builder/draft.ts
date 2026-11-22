/**
 * Shared, serialisable shapes + pure helpers for the two-step project builder.
 *
 * Supports Block-Based Media Builder (Behance / Notion style):
 * Single images, 2-3 column grids, and interactive carousels.
 */

import type { MediaBlock, MediaBlockType } from '@/types';

export type { MediaBlock, MediaBlockType };

export const MAX_PROJECT_IMAGES = 50;

export interface CoverSelection {
  url: string;
  /** `gallery` = one of the canvas images; `upload` = a dedicated thumbnail file. */
  source: 'gallery' | 'upload';
}

/** Everything the builder edits. This exact object is mirrored to localStorage. */
export interface ProjectDraft {
  title: string;
  description: string;
  challenge: string;
  solution: string;
  category: string;
  tags: string[];
  tools: string[];
  services: string[];
  blocks: MediaBlock[];
  /** `null` = automatically use the first canvas image. */
  cover: CoverSelection | null;
}

/** Payload sent to the server action — the cover is resolved to a plain URL. */
export interface ProjectInput extends Omit<ProjectDraft, 'cover'> {
  coverUrl: string;
  /** Flat list of all image URLs extracted from all blocks. */
  images: string[];
}

/** The subset of a `projects` row the builder reads. */
export interface ProjectRecord {
  id: string;
  title: string | null;
  description: string | null;
  challenge: string | null;
  solution: string | null;
  category: string | null;
  tags: string[] | null;
  tools: string[] | null;
  services: string[] | null;
  cover_image?: string | null;
  cover_image_url?: string | null;
  media_gallery?: unknown;
  gallery_images?: string[] | null;
  status?: string | null;
  is_published?: boolean | null;
}

/** Autocomplete values harvested from existing projects. */
export interface ProjectSuggestions {
  categories: string[];
  tags: string[];
  tools: string[];
  services: string[];
}

export const EMPTY_DRAFT: ProjectDraft = {
  title: '',
  description: '',
  challenge: '',
  solution: '',
  category: '',
  tags: [],
  tools: [],
  services: [],
  blocks: [],
  cover: null,
};

export function toText(value: unknown, maxLength = 20_000): string {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

/** Trimmed, de-duplicated (case-insensitive), non-empty strings. */
export function toStringList(value: unknown, maxItems = 100): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') continue;
    const trimmed = item.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
    if (out.length >= maxItems) break;
  }
  return out;
}

/** Flattens all image URLs across all blocks in order. */
export function getAllBlockUrls(blocks: MediaBlock[]): string[] {
  if (!Array.isArray(blocks)) return [];
  const urls: string[] = [];
  for (const block of blocks) {
    if (Array.isArray(block.urls)) {
      for (const u of block.urls) {
        if (typeof u === 'string' && u.trim()) urls.push(u.trim());
      }
    }
  }
  return urls;
}

/**
 * Normalizes any gallery representation (blocks array or legacy string array)
 * into a typed `MediaBlock[]`.
 */
export function normalizeToMediaBlocks(raw: unknown): MediaBlock[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  // Case A: already an array of block objects
  if (typeof raw[0] === 'object' && raw[0] !== null && 'type' in raw[0]) {
    return raw
      .map((item, index) => {
        const obj = item as Record<string, unknown>;
        const type: MediaBlockType =
          obj.type === 'grid' ? 'grid' : obj.type === 'carousel' ? 'carousel' : 'single';
        const rawUrls = Array.isArray(obj.urls) ? obj.urls : [];
        const urls = rawUrls.filter((u): u is string => typeof u === 'string' && Boolean(u.trim()));
        const id = typeof obj.id === 'string' && obj.id ? obj.id : `block-${Date.now()}-${index}`;
        return { id, type, urls };
      })
      .filter((block) => block.urls.length > 0 || block.id);
  }

  // Case B: legacy flat array of string URLs -> each string becomes a 'single' image block
  const stringUrls = raw.filter((u): u is string => typeof u === 'string' && Boolean(u.trim()));
  return stringUrls.map((url, i) => ({
    id: `block-legacy-${i}-${Date.now()}`,
    type: 'single' as const,
    urls: [url],
  }));
}

/** The thumbnail that will actually be saved: explicit choice, else the first image. */
export function resolveCoverUrl({ blocks, cover }: Pick<ProjectDraft, 'blocks' | 'cover'>): string {
  const allUrls = getAllBlockUrls(blocks);
  if (cover && (cover.source === 'upload' || allUrls.includes(cover.url))) return cover.url;
  return allUrls[0] ?? '';
}

export function draftFromRecord(row: ProjectRecord): ProjectDraft {
  const blocks = normalizeToMediaBlocks(row.media_gallery ?? row.gallery_images);
  const allUrls = getAllBlockUrls(blocks);
  const coverUrl = (row.cover_image ?? row.cover_image_url)?.trim() ?? '';

  let cover: CoverSelection | null = null;
  if (coverUrl) {
    cover = { url: coverUrl, source: allUrls.includes(coverUrl) ? 'gallery' : 'upload' };
  }

  return {
    title: row.title ?? '',
    description: row.description ?? '',
    challenge: row.challenge ?? '',
    solution: row.solution ?? '',
    category: row.category ?? '',
    tags: toStringList(row.tags),
    tools: toStringList(row.tools),
    services: toStringList(row.services),
    blocks,
    cover,
  };
}

/** Validates untrusted data (e.g. from localStorage). Returns `null` if unusable. */
export function parseDraft(value: unknown): ProjectDraft | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;

  let cover: CoverSelection | null = null;
  if (v.cover && typeof v.cover === 'object') {
    const c = v.cover as Record<string, unknown>;
    if (typeof c.url === 'string' && c.url && (c.source === 'gallery' || c.source === 'upload')) {
      cover = { url: c.url, source: c.source };
    }
  }

  // Handle both modern `blocks` and legacy `images` in storage
  const blocks = Array.isArray(v.blocks)
    ? normalizeToMediaBlocks(v.blocks)
    : Array.isArray(v.images)
      ? normalizeToMediaBlocks(v.images)
      : [];

  return {
    title: toText(v.title, 200),
    description: toText(v.description),
    challenge: toText(v.challenge),
    solution: toText(v.solution),
    category: toText(v.category, 120),
    tags: toStringList(v.tags),
    tools: toStringList(v.tools),
    services: toStringList(v.services),
    blocks,
    cover,
  };
}

/** Stable string form, used for cheap equality / dirty checks. */
export function serializeDraft(d: ProjectDraft): string {
  return JSON.stringify([
    d.title,
    d.description,
    d.challenge,
    d.solution,
    d.category,
    d.tags,
    d.tools,
    d.services,
    d.blocks.map((b) => [b.id, b.type, b.urls]),
    d.cover ? [d.cover.url, d.cover.source] : null,
  ]);
}

export function draftToInput(d: ProjectDraft): ProjectInput {
  const { cover: _cover, ...rest } = d;
  return {
    ...rest,
    coverUrl: resolveCoverUrl(d),
    images: getAllBlockUrls(d.blocks),
  };
}
