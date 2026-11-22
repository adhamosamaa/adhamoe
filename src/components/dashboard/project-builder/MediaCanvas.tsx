'use client';

import { useCallback, useEffect, useRef, useState, useId } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ImageIcon,
  LayoutGrid,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import type { MediaBlock, MediaBlockType } from '@/types';
import { ACCEPTED_IMAGE_TYPES, isImageFile, uploadProjectImage } from './upload';

interface MediaCanvasProps {
  blocks: MediaBlock[];
  onBlocksChange: (update: (prev: MediaBlock[]) => MediaBlock[]) => void;
  coverUrl: string;
  onSetCover: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export function MediaCanvas({
  blocks,
  onBlocksChange,
  coverUrl,
  onSetCover,
  onUploadingChange,
}: MediaCanvasProps) {
  const [activeUploadCount, setActiveUploadCount] = useState(0);
  const isUploading = activeUploadCount > 0;

  useEffect(() => {
    onUploadingChange(isUploading);
  }, [isUploading, onUploadingChange]);

  const addBlock = (type: MediaBlockType, atIndex?: number) => {
    const newBlock: MediaBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      urls: [],
    };
    onBlocksChange((prev) => {
      const copy = [...prev];
      if (typeof atIndex === 'number' && atIndex >= 0 && atIndex <= copy.length) {
        copy.splice(atIndex, 0, newBlock);
      } else {
        copy.push(newBlock);
      }
      return copy;
    });
    toast.success(
      type === 'single'
        ? 'Added Single Image block'
        : type === 'grid'
          ? 'Added 3-Column Grid block'
          : 'Added Carousel Slider block'
    );
  };

  const deleteBlock = (id: string) => {
    onBlocksChange((prev) => prev.filter((b) => b.id !== id));
    toast.info('Block removed');
  };

  const moveBlock = (index: number, delta: -1 | 1) => {
    onBlocksChange((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index]!;
      copy[index] = copy[target]!;
      copy[target] = temp;
      return copy;
    });
  };

  const updateBlockUrls = (id: string, urls: string[]) => {
    onBlocksChange((prev) =>
      prev.map((b) => (b.id === id ? { ...b, urls } : b))
    );
  };

  const trackUpload = async (fn: () => Promise<void>) => {
    setActiveUploadCount((c) => c + 1);
    try {
      await fn();
    } finally {
      setActiveUploadCount((c) => Math.max(0, c - 1));
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] px-4 pb-36 pt-6 sm:px-8">
      {blocks.length === 0 ? (
        /* Empty State */
        <section className="mx-auto flex max-w-3xl flex-col items-center pt-[6vh] text-center animate-dash-fade-up">
          <span className="rounded-full bg-dash-brand/10 px-3.5 py-1 text-xs font-semibold text-dash-brand">
            Interactive Media Canvas
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Build your project <span className="font-serif font-normal italic text-dash-brand">layout</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-dash-muted">
            Add modular visual blocks: uncropped high-res hero images, multi-column grids, or smooth swipeable carousels.
          </p>

          <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <StarterCard
              icon={<ImageIcon className="size-6 text-dash-brand" />}
              title="Single Image"
              description="Full-width uncropped slide preserving original design dimensions."
              onClick={() => addBlock('single')}
            />
            <StarterCard
              icon={<LayoutGrid className="size-6 text-dash-brand" />}
              title="3-Column Grid"
              description="Side-by-side modular slots for mockups and details."
              onClick={() => addBlock('grid')}
            />
            <StarterCard
              icon={<Layers className="size-6 text-dash-brand" />}
              title="Carousel Slider"
              description="Smooth Embla swipeable deck for multi-page assets."
              onClick={() => addBlock('carousel')}
            />
          </div>
        </section>
      ) : (
        /* Block List */
        <section aria-label="Media Canvas Blocks" className="mx-auto max-w-5xl space-y-8 animate-dash-fade-up">
          <div className="flex flex-col gap-3 border-b border-dash-line/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Project Canvas</h1>
              <p className="text-xs text-dash-muted">
                {blocks.length} block{blocks.length > 1 ? 's' : ''} • Images render in full uncropped resolution.
              </p>
            </div>

            {/* Quick 1-click top buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addBlock('single', 0)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dash-line bg-dash-surface px-2.5 py-1.5 text-xs font-medium text-dash-fg transition-all hover:border-dash-brand hover:text-dash-brand"
              >
                <ImageIcon className="size-3.5 text-dash-brand" /> + Image
              </button>
              <button
                type="button"
                onClick={() => addBlock('grid', 0)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dash-line bg-dash-surface px-2.5 py-1.5 text-xs font-medium text-dash-fg transition-all hover:border-dash-brand hover:text-dash-brand"
              >
                <LayoutGrid className="size-3.5 text-dash-brand" /> + Grid
              </button>
              <button
                type="button"
                onClick={() => addBlock('carousel', 0)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dash-line bg-dash-surface px-2.5 py-1.5 text-xs font-medium text-dash-fg transition-all hover:border-dash-brand hover:text-dash-brand"
              >
                <Layers className="size-3.5 text-dash-brand" /> + Carousel
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {blocks.map((block, index) => (
              <div key={block.id} className="group/block relative">
                {/* Block Wrapper */}
                <div className="rounded-2xl border border-dash-line bg-dash-surface shadow-dash-card transition-all duration-300 hover:border-dash-line-strong hover:shadow-dash-pop">
                  {/* Block Header */}
                  <div className="flex items-center justify-between border-b border-dash-line/60 px-4 py-2.5 bg-dash-canvas/40 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <GripVertical className="size-4 text-dash-subtle" />
                      <span className="rounded bg-dash-elevated px-2 py-0.5 font-mono text-[11px] text-dash-muted">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <BlockTypeBadge type={block.type} />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Move block up"
                        title="Move up"
                        disabled={index === 0}
                        onClick={() => moveBlock(index, -1)}
                        className="grid size-7 place-items-center rounded-lg text-dash-muted hover:bg-dash-elevated hover:text-dash-fg disabled:pointer-events-none disabled:opacity-30"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move block down"
                        title="Move down"
                        disabled={index === blocks.length - 1}
                        onClick={() => moveBlock(index, 1)}
                        className="grid size-7 place-items-center rounded-lg text-dash-muted hover:bg-dash-elevated hover:text-dash-fg disabled:pointer-events-none disabled:opacity-30"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                      <div className="mx-1 h-4 w-px bg-dash-line" />
                      <button
                        type="button"
                        aria-label="Delete block"
                        title="Delete block"
                        onClick={() => deleteBlock(block.id)}
                        className="grid size-7 place-items-center rounded-lg text-dash-muted hover:bg-dash-danger/15 hover:text-dash-danger transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Content */}
                  <div className="p-4 sm:p-6">
                    {block.type === 'single' && (
                      <SingleBlockRenderer
                        urls={block.urls}
                        coverUrl={coverUrl}
                        onSetCover={onSetCover}
                        onChange={(urls) => updateBlockUrls(block.id, urls)}
                        trackUpload={trackUpload}
                      />
                    )}
                    {block.type === 'grid' && (
                      <GridBlockRenderer
                        urls={block.urls}
                        coverUrl={coverUrl}
                        onSetCover={onSetCover}
                        onChange={(urls) => updateBlockUrls(block.id, urls)}
                        trackUpload={trackUpload}
                      />
                    )}
                    {block.type === 'carousel' && (
                      <CarouselBlockRenderer
                        urls={block.urls}
                        coverUrl={coverUrl}
                        onSetCover={onSetCover}
                        onChange={(urls) => updateBlockUrls(block.id, urls)}
                        trackUpload={trackUpload}
                      />
                    )}
                  </div>
                </div>

                {/* Subtle 1-click Inserter between blocks */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-dashed border-dash-line opacity-30 group-hover/block:opacity-80 transition-opacity" />
                  </div>
                  <div className="relative z-10 flex items-center gap-1.5 rounded-full border border-dash-line bg-dash-surface px-2.5 py-1 text-xs opacity-0 transition-opacity duration-200 group-hover/block:opacity-100 shadow-sm">
                    <span className="text-[11px] text-dash-muted pr-1">+ Insert:</span>
                    <button
                      type="button"
                      onClick={() => addBlock('single', index + 1)}
                      className="rounded px-2 py-0.5 text-[11px] font-medium text-dash-fg hover:bg-dash-elevated hover:text-dash-brand"
                    >
                      Image
                    </button>
                    <span className="text-dash-subtle">•</span>
                    <button
                      type="button"
                      onClick={() => addBlock('grid', index + 1)}
                      className="rounded px-2 py-0.5 text-[11px] font-medium text-dash-fg hover:bg-dash-elevated hover:text-dash-brand"
                    >
                      Grid
                    </button>
                    <span className="text-dash-subtle">•</span>
                    <button
                      type="button"
                      onClick={() => addBlock('carousel', index + 1)}
                      className="rounded px-2 py-0.5 text-[11px] font-medium text-dash-fg hover:bg-dash-elevated hover:text-dash-brand"
                    >
                      Carousel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Persistent Floating 1-Click Bottom Dock */}
          <div className="sticky bottom-6 z-20 mx-auto flex w-fit items-center gap-2 rounded-full border border-dash-line-strong bg-dash-surface/90 px-4 py-2 shadow-2xl backdrop-blur-xl animate-dash-fade-up">
            <span className="hidden pr-1 font-mono text-[11px] font-medium text-dash-muted sm:inline-block">
              Add Block:
            </span>
            <button
              type="button"
              onClick={() => addBlock('single')}
              className="inline-flex items-center gap-2 rounded-full bg-dash-elevated px-4 py-2 text-xs font-semibold text-dash-fg shadow-sm transition-all hover:bg-dash-brand hover:text-dash-brand-fg active:scale-95"
            >
              <ImageIcon className="size-4 text-dash-brand" />
              <span>+ Add Image</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('grid')}
              className="inline-flex items-center gap-2 rounded-full bg-dash-elevated px-4 py-2 text-xs font-semibold text-dash-fg shadow-sm transition-all hover:bg-dash-brand hover:text-dash-brand-fg active:scale-95"
            >
              <LayoutGrid className="size-4 text-dash-brand" />
              <span>+ Add Grid</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('carousel')}
              className="inline-flex items-center gap-2 rounded-full bg-dash-elevated px-4 py-2 text-xs font-semibold text-dash-fg shadow-sm transition-all hover:bg-dash-brand hover:text-dash-brand-fg active:scale-95"
            >
              <Layers className="size-4 text-dash-brand" />
              <span>+ Add Carousel</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   High-Res Image with Skeleton & Lazy Loading
─────────────────────────────────────────────────────────────────────────── */
function OptimizedCanvasImage({
  src,
  alt,
  className,
  fit = 'contain',
}: {
  src: string;
  alt: string;
  className?: string;
  fit?: 'contain' | 'cover';
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative w-full overflow-hidden bg-dash-elevated/40', className)}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dash-elevated/80 animate-pulse">
          <ImageIcon className="size-8 text-dash-muted/40 animate-pulse" />
          <span className="mt-2 text-[11px] font-mono text-dash-muted/60">Loading high-res asset…</span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'transition-opacity duration-300 ease-out',
          fit === 'contain'
            ? 'w-full h-auto max-h-[85vh] object-contain mx-auto block'
            : 'size-full object-cover',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Block Type Badge
─────────────────────────────────────────────────────────────────────────── */
function BlockTypeBadge({ type }: { type: MediaBlockType }) {
  if (type === 'single') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-dash-fg">
        <ImageIcon className="size-3.5 text-dash-brand" /> Single Image (Uncropped)
      </span>
    );
  }
  if (type === 'grid') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-dash-fg">
        <LayoutGrid className="size-3.5 text-dash-brand" /> 3-Column Grid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-dash-fg">
      <Layers className="size-3.5 text-dash-brand" /> Carousel Slider (Embla)
    </span>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Starter Card (for Empty Canvas)
─────────────────────────────────────────────────────────────────────────── */
function StarterCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center rounded-2xl border border-dash-line bg-dash-surface p-6 text-center shadow-dash-card transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-dash-brand hover:shadow-dash-pop focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dash-brand/15"
    >
      <div className="grid size-12 place-items-center rounded-2xl bg-dash-elevated transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-dash-fg">{title}</h3>
      <p className="mt-1.5 text-xs text-dash-muted leading-relaxed">{description}</p>
      <span className="mt-4 text-xs font-semibold text-dash-brand group-hover:underline">
        + Add block
      </span>
    </button>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   1. SINGLE IMAGE BLOCK RENDERER (Uncropped, High-Res)
─────────────────────────────────────────────────────────────────────────── */
interface BlockRendererProps {
  urls: string[];
  coverUrl: string;
  onSetCover: (url: string) => void;
  onChange: (urls: string[]) => void;
  trackUpload: (fn: () => Promise<void>) => Promise<void>;
}

function SingleBlockRenderer({
  urls,
  coverUrl,
  onSetCover,
  onChange,
  trackUpload,
}: BlockRendererProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const currentUrl = urls[0];
  const isCover = Boolean(currentUrl && currentUrl === coverUrl);

  const handleUpload = async (file: File | undefined) => {
    if (!file || !isImageFile(file)) {
      toast.error('Please choose a valid image file.');
      return;
    }
    setUploading(true);
    await trackUpload(async () => {
      try {
        const url = await uploadProjectImage(file);
        onChange([url]);
        toast.success('Image uploaded');
      } catch (err: any) {
        toast.error('Failed to upload image: ' + (err?.message ?? 'unknown'));
      } finally {
        setUploading(false);
      }
    });
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="sr-only"
        onChange={(e) => {
          void handleUpload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {currentUrl ? (
        <div className="group relative w-full overflow-hidden rounded-xl border border-dash-line bg-black/20 shadow-dash-card">
          {/* Uncropped presentation - natural aspect ratio */}
          <OptimizedCanvasImage
            src={currentUrl}
            alt="Single presentation visual"
            fit="contain"
            className="rounded-lg"
          />

          {/* Floating Controls Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/40">
            <div className="flex items-center justify-between pointer-events-auto">
              {isCover ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-dash-brand px-2.5 py-1 text-xs font-semibold text-dash-brand-fg shadow-dash-glow">
                  <Star className="size-3.5 fill-current" /> Cover Image
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onSetCover(currentUrl)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink-950/80 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md hover:bg-dash-brand hover:text-dash-brand-fg transition-colors"
                >
                  <Star className="size-3.5" /> Set as Cover
                </button>
              )}

              <button
                type="button"
                onClick={() => onChange([])}
                className="grid size-8 place-items-center rounded-lg bg-dash-danger/80 text-white backdrop-blur-md hover:bg-dash-danger transition-colors"
                title="Remove image"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="flex justify-end pointer-events-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-ink-950/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md hover:bg-white hover:text-ink-950 transition-colors"
              >
                {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                Replace Image
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="group flex aspect-[16/9] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-dash-line-strong bg-dash-canvas/40 p-8 text-center transition-all duration-300 hover:border-dash-brand/70 hover:bg-dash-surface hover:shadow-dash-glow/5"
        >
          <div className="grid size-12 place-items-center rounded-xl bg-dash-elevated text-dash-muted transition-transform group-hover:scale-110 group-hover:text-dash-brand">
            {uploading ? <Loader2 className="size-6 animate-spin text-dash-brand" /> : <UploadCloud className="size-6" />}
          </div>
          <p className="mt-3 text-sm font-semibold text-dash-fg">
            {uploading ? 'Uploading showcase image…' : 'Drop full-width image or click to upload'}
          </p>
          <p className="mt-1 text-xs text-dash-subtle">
            Uncropped display • Preserves original height, width, and high-res details.
          </p>
        </button>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   2. 3-COLUMN GRID BLOCK RENDERER
─────────────────────────────────────────────────────────────────────────── */
function GridBlockRenderer({
  urls,
  coverUrl,
  onSetCover,
  onChange,
  trackUpload,
}: BlockRendererProps) {
  const slots = [urls[0] || '', urls[1] || '', urls[2] || ''];

  const setSlot = (index: number, newUrl: string) => {
    const updated = [...slots];
    updated[index] = newUrl;
    onChange(updated);
  };

  const removeSlot = (index: number) => {
    const updated = [...slots];
    updated[index] = '';
    onChange(updated);
  };

  return (
    <div>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        {slots.map((url, slotIndex) => (
          <GridSlotItem
            key={`slot-${slotIndex}`}
            slotIndex={slotIndex}
            url={url}
            coverUrl={coverUrl}
            onSetCover={onSetCover}
            onUploadSuccess={(newUrl) => setSlot(slotIndex, newUrl)}
            onRemove={() => removeSlot(slotIndex)}
            trackUpload={trackUpload}
          />
        ))}
      </div>
      <p className="mt-2 text-right text-[11px] text-dash-subtle">
        3-column responsive grid layout (uncropped)
      </p>
    </div>
  );
}

function GridSlotItem({
  slotIndex,
  url,
  coverUrl,
  onSetCover,
  onUploadSuccess,
  onRemove,
  trackUpload,
}: {
  slotIndex: number;
  url: string;
  coverUrl: string;
  onSetCover: (url: string) => void;
  onUploadSuccess: (url: string) => void;
  onRemove: () => void;
  trackUpload: (fn: () => Promise<void>) => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isCover = Boolean(url && url === coverUrl);

  const handleUpload = async (file: File | undefined) => {
    if (!file || !isImageFile(file)) {
      toast.error('Please choose a valid image file.');
      return;
    }
    setUploading(true);
    await trackUpload(async () => {
      try {
        const publicUrl = await uploadProjectImage(file);
        onUploadSuccess(publicUrl);
        toast.success(`Slot #${slotIndex + 1} updated`);
      } catch (err: any) {
        toast.error('Upload failed: ' + (err?.message ?? 'unknown'));
      } finally {
        setUploading(false);
      }
    });
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="sr-only"
        onChange={(e) => {
          void handleUpload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {url ? (
        <div className="group relative w-full overflow-hidden rounded-xl border border-dash-line bg-black/20 shadow-dash-card">
          <OptimizedCanvasImage
            src={url}
            alt={`Grid slot ${slotIndex + 1}`}
            fit="contain"
            className="rounded-lg"
          />

          <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/60">
            <div className="flex items-center justify-between pointer-events-auto">
              {isCover ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-dash-brand px-2 py-0.5 text-[10px] font-semibold text-dash-brand-fg shadow-dash-glow">
                  <Star className="size-3 fill-current" /> Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onSetCover(url)}
                  className="inline-flex items-center gap-1 rounded-full bg-ink-950/70 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md hover:bg-dash-brand hover:text-dash-brand-fg transition-colors"
                >
                  <Star className="size-3" /> Cover
                </button>
              )}

              <button
                type="button"
                onClick={onRemove}
                className="grid size-6 place-items-center rounded bg-dash-danger/80 text-white backdrop-blur-md hover:bg-dash-danger transition-colors"
                title="Remove slot"
              >
                <Trash2 className="size-3" />
              </button>
            </div>

            <div className="flex justify-end pointer-events-auto">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="rounded bg-ink-950/80 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md hover:bg-white hover:text-ink-950 transition-colors"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="group flex min-h-[220px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-dash-line-strong bg-dash-canvas/40 p-4 text-center transition-all duration-300 hover:border-dash-brand/70 hover:bg-dash-surface"
        >
          <div className="grid size-8 place-items-center rounded-lg bg-dash-elevated text-dash-muted transition-transform group-hover:scale-110 group-hover:text-dash-brand">
            {uploading ? <Loader2 className="size-4 animate-spin text-dash-brand" /> : <Plus className="size-4" />}
          </div>
          <span className="mt-2 text-xs font-semibold text-dash-fg">
            Slot {slotIndex + 1}
          </span>
          <span className="text-[10px] text-dash-subtle">
            {uploading ? 'Uploading…' : 'Click to add (uncropped)'}
          </span>
        </button>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   3. CAROUSEL SLIDER BLOCK RENDERER (Fluid Embla Carousel)
─────────────────────────────────────────────────────────────────────────── */
function CarouselBlockRenderer({
  urls,
  coverUrl,
  onSetCover,
  onChange,
  trackUpload,
}: BlockRendererProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    skipSnaps: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const slides = urls;
  const currentSlideUrl = slides[selectedIndex];
  const isCover = Boolean(currentSlideUrl && currentSlideUrl === coverUrl);

  const handleAddSlides = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const valid = Array.from(files).filter(isImageFile);
    if (valid.length === 0) {
      toast.error('Please choose image files.');
      return;
    }

    setUploading(true);
    await trackUpload(async () => {
      const newUrls: string[] = [];
      for (const f of valid) {
        try {
          const u = await uploadProjectImage(f);
          newUrls.push(u);
        } catch {
          toast.error(`Upload error on ${f.name}`);
        }
      }
      if (newUrls.length > 0) {
        const next = [...slides, ...newUrls];
        onChange(next);
        toast.success(`Added ${newUrls.length} slide(s) to carousel`);
        setTimeout(() => {
          emblaApi?.scrollTo(next.length - 1);
        }, 100);
      }
      setUploading(false);
    });
  };

  const removeSlide = (indexToRemove: number) => {
    const updated = slides.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    if (selectedIndex >= updated.length) {
      setSelectedIndex(Math.max(0, updated.length - 1));
    }
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES}
        className="sr-only"
        onChange={(e) => {
          void handleAddSlides(e.target.files);
          e.target.value = '';
        }}
      />

      {slides.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="group flex aspect-[16/9] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-dash-line-strong bg-dash-canvas/40 p-8 text-center transition-all duration-300 hover:border-dash-brand/70 hover:bg-dash-surface"
        >
          <div className="grid size-12 place-items-center rounded-xl bg-dash-elevated text-dash-muted transition-transform group-hover:scale-110 group-hover:text-dash-brand">
            {uploading ? <Loader2 className="size-6 animate-spin text-dash-brand" /> : <Layers className="size-6" />}
          </div>
          <p className="mt-3 text-sm font-semibold text-dash-fg">
            {uploading ? 'Uploading carousel slides…' : 'Add slides to this Carousel'}
          </p>
          <p className="mt-1 text-xs text-dash-subtle">
            Select multiple images • Fluid touch & drag swipe gestures enabled.
          </p>
        </button>
      ) : (
        <div className="space-y-3">
          {/* Main Fluid Embla Slide Deck */}
          <div className="group relative overflow-hidden rounded-xl border border-dash-line bg-black/30 shadow-dash-card">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {slides.map((url, i) => (
                  <div key={i} className="min-w-0 flex-[0_0_100%] relative flex items-center justify-center p-2 sm:p-4">
                    <OptimizedCanvasImage
                      src={url}
                      alt={`Slide ${i + 1}`}
                      fit="contain"
                      className="rounded-lg max-h-[70vh]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Navigation Overlay */}
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                aria-label="Previous slide"
                disabled={selectedIndex === 0}
                onClick={scrollPrev}
                className="pointer-events-auto grid size-10 place-items-center rounded-full bg-ink-950/70 text-white backdrop-blur-md transition-all hover:bg-white hover:text-ink-950 disabled:opacity-20 disabled:pointer-events-none active:scale-95"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                disabled={selectedIndex === slides.length - 1}
                onClick={scrollNext}
                className="pointer-events-auto grid size-10 place-items-center rounded-full bg-ink-950/70 text-white backdrop-blur-md transition-all hover:bg-white hover:text-ink-950 disabled:opacity-20 disabled:pointer-events-none active:scale-95"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Top Bar for Active Slide */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 bg-gradient-to-b from-ink-950/60 to-transparent">
              <span className="rounded-full bg-ink-950/70 px-2.5 py-0.5 font-mono text-xs text-white/90 backdrop-blur-md">
                Slide {selectedIndex + 1} of {slides.length}
              </span>

              <div className="flex items-center gap-1.5">
                {isCover ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-dash-brand px-2 py-0.5 text-[11px] font-semibold text-dash-brand-fg shadow-dash-glow">
                    <Star className="size-3 fill-current" /> Cover Image
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSetCover(currentSlideUrl!)}
                    className="inline-flex items-center gap-1 rounded-full bg-ink-950/70 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-md hover:bg-dash-brand hover:text-dash-brand-fg transition-colors"
                  >
                    <Star className="size-3" /> Set Cover
                  </button>
                )}

                <button
                  type="button"
                  title="Remove this slide"
                  onClick={() => removeSlide(selectedIndex)}
                  className="grid size-7 place-items-center rounded-lg bg-dash-danger/80 text-white backdrop-blur-md hover:bg-dash-danger transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide Strip & Quick Reorder */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
            {slides.map((url, i) => (
              <div
                key={`thumb-${url}-${i}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  'group/thumb relative aspect-[16/9] w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-dash-elevated transition-all',
                  i === selectedIndex
                    ? 'border-dash-brand ring-2 ring-dash-brand/30'
                    : 'border-dash-line hover:border-dash-line-strong opacity-70 hover:opacity-100'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Thumb ${i + 1}`} loading="lazy" className="size-full object-cover" />
                <span className="absolute bottom-0.5 right-1 rounded bg-ink-950/70 px-1 font-mono text-[9px] text-white">
                  {i + 1}
                </span>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex aspect-[16/9] w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-dash-line-strong bg-dash-canvas/40 text-dash-muted hover:border-dash-brand hover:text-dash-brand transition-colors"
            >
              {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-4" />}
              <span className="mt-0.5 text-[10px] font-medium">Add slide</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
