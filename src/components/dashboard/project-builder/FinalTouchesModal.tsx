'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ImageIcon, Loader2, RotateCcw, Send, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { getAllBlockUrls, type ProjectDraft, type ProjectSuggestions } from './draft';
import { ACCEPTED_IMAGE_TYPES, isImageFile, uploadProjectImage } from './upload';

export type SaveIntent = 'draft' | 'publish';

interface FinalTouchesModalProps {
  open: boolean;
  onClose: () => void;
  draft: ProjectDraft;
  onChange: (patch: Partial<ProjectDraft>) => void;
  /** Resolved thumbnail (explicit choice or first canvas image). */
  coverUrl: string;
  onSave: (intent: SaveIntent) => void;
  pendingIntent: SaveIntent | null;
  /** Canvas uploads still running — saving now would drop them. */
  canvasUploading: boolean;
  isPublished: boolean;
  suggestions: ProjectSuggestions;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function FinalTouchesModal(props: FinalTouchesModalProps) {
  // Mount the dialog only while open so focus/scroll handling starts fresh each time.
  if (!props.open) return null;
  return <FinalTouchesDialog {...props} />;
}

function FinalTouchesDialog({
  onClose,
  draft,
  onChange,
  coverUrl,
  onSave,
  pendingIntent,
  canvasUploading,
  isPublished,
  suggestions,
}: FinalTouchesModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [thumbUploading, setThumbUploading] = useState(false);

  const busy = pendingIntent !== null;
  const blocked = busy || thumbUploading || canvasUploading;

  // Latest values for the long-lived keydown listener.
  const closeRef = useRef(onClose);
  const busyRef = useRef(busy);
  useEffect(() => {
    closeRef.current = onClose;
    busyRef.current = busy;
  });

  // Scroll lock, initial focus, Escape-to-close, focus trap, focus restore.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    titleInputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busyRef.current) {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handlePublish = () => {
    if (!draft.title.trim()) {
      setTitleError('Give your project a title before publishing.');
      titleInputRef.current?.focus();
      return;
    }
    onSave('publish');
  };

  const handleThumbnailFile = async (file: File | undefined) => {
    if (!file) return;
    if (!isImageFile(file)) {
      toast.error('Thumbnails must be an image file.');
      return;
    }
    setThumbUploading(true);
    try {
      const url = await uploadProjectImage(file);
      onChange({ cover: { url, source: 'upload' } });
      toast.success('Thumbnail updated');
    } catch (error) {
      toast.error("Couldn't upload thumbnail", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setThumbUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => !busy && onClose()}
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-dash-surface text-dash-fg shadow-dash-pop animate-dash-pop-in sm:max-h-[min(92dvh,920px)] sm:rounded-3xl"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-dash-line px-6 py-5 sm:px-8">
          <div>
            <h2 id={titleId} className="text-xl font-semibold tracking-tight">
              Final touches
            </h2>
            <p className="mt-1 text-sm text-dash-muted">Choose a thumbnail and tell the story behind the work.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close final touches"
            className="grid size-9 shrink-0 place-items-center rounded-full text-dash-muted transition-colors hover:bg-dash-elevated hover:text-dash-fg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dash-brand/15 disabled:opacity-40"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </header>

        {/* Body */}
        <div className="grid flex-1 gap-8 overflow-y-auto px-6 py-6 sm:px-8 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-10">
          {/* Left — thumbnail */}
          <aside className="md:sticky md:top-0 md:self-start">
            <FieldLabel as="p">Thumbnail preview</FieldLabel>
            <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-2xl bg-dash-elevated shadow-dash-card">
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="Project thumbnail" className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center text-dash-subtle">
                  <ImageIcon className="size-8" strokeWidth={1.5} />
                </div>
              )}
              {thumbUploading && (
                <div className="absolute inset-0 grid place-items-center bg-ink-950/50 text-white">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              )}
            </div>

            <input
              ref={thumbInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                void handleThumbnailFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <button
                type="button"
                id="final-touches-select-thumbnail"
                onClick={() => thumbInputRef.current?.click()}
                disabled={thumbUploading || busy}
                className="inline-flex items-center gap-1.5 font-medium text-dash-brand underline-offset-4 hover:underline disabled:opacity-50"
              >
                <Upload className="size-3.5" /> Select thumbnail
              </button>
              {draft.cover && (
                <button
                  type="button"
                  onClick={() => onChange({ cover: null })}
                  className="inline-flex items-center gap-1.5 text-dash-muted transition-colors hover:text-dash-fg"
                >
                  <RotateCcw className="size-3.5" /> Use first image
                </button>
              )}
            </div>

            {(() => {
              const allImages = getAllBlockUrls(draft.blocks);
              if (allImages.length <= 1) return null;
              return (
                <div className="mt-6">
                  <FieldLabel as="p">Or pick from your media</FieldLabel>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {allImages.map((url, i) => {
                      const selected = url === coverUrl;
                      return (
                        <button
                          key={url}
                          type="button"
                          aria-label={`Use image ${i + 1} as thumbnail`}
                          aria-pressed={selected}
                          onClick={() => onChange({ cover: i === 0 ? null : { url, source: 'gallery' } })}
                          className={cn(
                            'aspect-[4/3] overflow-hidden rounded-lg bg-dash-elevated ring-offset-2 ring-offset-dash-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand',
                            selected ? 'ring-2 ring-dash-brand' : 'opacity-70 hover:opacity-100',
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" loading="lazy" className="size-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </aside>

          {/* Right — metadata */}
          <div className="space-y-8">
            <Section title="Basics">
              <div>
                <FieldLabel htmlFor="ft-title">
                  Title <span className="text-dash-danger">*</span>
                </FieldLabel>
                <input
                  ref={titleInputRef}
                  id="ft-title"
                  value={draft.title}
                  maxLength={200}
                  onChange={(e) => {
                    onChange({ title: e.target.value });
                    if (titleError) setTitleError(null);
                  }}
                  placeholder="Give your project a name"
                  aria-invalid={titleError ? true : undefined}
                  aria-describedby={titleError ? 'ft-title-error' : undefined}
                  className={cn(inputClass, 'h-12 text-base font-medium', titleError && 'border-dash-danger focus:border-dash-danger focus:ring-dash-danger/15')}
                />
                {titleError && (
                  <p id="ft-title-error" className="mt-1.5 text-xs text-dash-danger">
                    {titleError}
                  </p>
                )}
              </div>
              <div>
                <FieldLabel htmlFor="ft-category">Category</FieldLabel>
                <input
                  id="ft-category"
                  list="ft-category-options"
                  value={draft.category}
                  maxLength={120}
                  onChange={(e) => onChange({ category: e.target.value })}
                  placeholder="e.g. Visual Identity"
                  className={cn(inputClass, 'h-10')}
                />
                <datalist id="ft-category-options">
                  {suggestions.categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </Section>

            <Section title="Story">
              <div>
                <FieldLabel htmlFor="ft-description">Description</FieldLabel>
                <textarea
                  id="ft-description"
                  rows={4}
                  value={draft.description}
                  onChange={(e) => onChange({ description: e.target.value })}
                  placeholder="What is this project, and who was it for?"
                  className={cn(inputClass, 'resize-y py-2.5')}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="ft-challenge">Challenge</FieldLabel>
                  <textarea
                    id="ft-challenge"
                    rows={4}
                    value={draft.challenge}
                    onChange={(e) => onChange({ challenge: e.target.value })}
                    placeholder="The problem you set out to solve"
                    className={cn(inputClass, 'resize-y py-2.5')}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="ft-solution">Solution</FieldLabel>
                  <textarea
                    id="ft-solution"
                    rows={4}
                    value={draft.solution}
                    onChange={(e) => onChange({ solution: e.target.value })}
                    placeholder="How you approached and solved it"
                    className={cn(inputClass, 'resize-y py-2.5')}
                  />
                </div>
              </div>
            </Section>

            <Section title="Details">
              <TagInput
                id="ft-tags"
                label="Tags"
                values={draft.tags}
                onChange={(tags) => onChange({ tags })}
                placeholder="Branding, Social Media…"
                suggestions={suggestions.tags}
              />
              <TagInput
                id="ft-tools"
                label="Tools"
                values={draft.tools}
                onChange={(tools) => onChange({ tools })}
                placeholder="Figma, Photoshop…"
                suggestions={suggestions.tools}
              />
              <TagInput
                id="ft-services"
                label="Services"
                values={draft.services}
                onChange={(services) => onChange({ services })}
                placeholder="Art Direction, Visual Identity…"
                suggestions={suggestions.services}
              />
            </Section>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col-reverse gap-3 border-t border-dash-line bg-dash-surface px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-10 rounded-full px-5 text-sm font-medium text-dash-muted transition-colors hover:bg-dash-elevated hover:text-dash-fg disabled:opacity-40"
          >
            Close
          </button>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            {canvasUploading && <span className="text-xs text-dash-subtle sm:mr-2">Waiting for uploads to finish…</span>}
            <button
              type="button"
              id="final-touches-save-draft"
              onClick={() => onSave('draft')}
              disabled={blocked}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-dash-line-strong px-5 text-sm font-medium text-dash-fg transition-colors hover:bg-dash-elevated disabled:pointer-events-none disabled:opacity-50"
            >
              {pendingIntent === 'draft' && <Loader2 className="size-4 animate-spin" />}
              {isPublished ? 'Move to drafts' : 'Save as draft'}
            </button>
            <button
              type="button"
              id="final-touches-publish"
              onClick={handlePublish}
              disabled={blocked}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-dash-brand px-6 text-sm font-semibold text-dash-brand-fg transition-all duration-200 hover:-translate-y-px hover:shadow-dash-glow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dash-brand/25 disabled:pointer-events-none disabled:opacity-50"
            >
              {pendingIntent === 'publish' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {isPublished ? 'Update project' : 'Publish now'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ───────────────────────── small building blocks ───────────────────────── */

const inputClass =
  'w-full rounded-xl border border-dash-line bg-dash-canvas px-3.5 text-sm text-dash-fg placeholder:text-dash-subtle transition-[border-color,box-shadow] duration-200 hover:border-dash-line-strong focus:border-dash-brand/60 focus:outline-none focus:ring-4 focus:ring-dash-brand/10';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-dash-subtle">{title}</h3>
      {children}
    </section>
  );
}

function FieldLabel({ htmlFor, as = 'label', children }: { htmlFor?: string; as?: 'label' | 'p'; children: ReactNode }) {
  const className = 'mb-1.5 block text-sm font-medium text-dash-fg';
  return as === 'label' ? (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ) : (
    <p className={className}>{children}</p>
  );
}

/** Chip input: Enter / comma adds, Backspace on empty removes last, pasted lists are split. */
function TagInput({
  id,
  label,
  values,
  onChange,
  placeholder,
  suggestions,
}: {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  suggestions: string[];
}) {
  const [text, setText] = useState('');

  const add = (raw: string) => {
    const incoming = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (incoming.length === 0) return;
    const seen = new Set(values.map((v) => v.toLowerCase()));
    const next = [...values];
    for (const item of incoming) {
      if (!seen.has(item.toLowerCase())) {
        seen.add(item.toLowerCase());
        next.push(item);
      }
    }
    onChange(next);
    setText('');
  };

  const remove = (index: number) => onChange(values.filter((_, i) => i !== index));
  const available = suggestions.filter((s) => !values.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div
        className={cn(
          inputClass,
          'flex min-h-10 cursor-text flex-wrap items-center gap-1.5 px-2 py-1.5 focus-within:border-dash-brand/60 focus-within:ring-4 focus-within:ring-dash-brand/10',
        )}
        onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement | null)?.focus()}
      >
        {values.map((value, i) => (
          <span
            key={value}
            className="inline-flex items-center gap-1 rounded-full bg-dash-elevated py-0.5 pl-2.5 pr-1 text-xs font-medium text-dash-fg"
          >
            {value}
            <button
              type="button"
              aria-label={`Remove ${value}`}
              onClick={() => remove(i)}
              className="grid size-4 place-items-center rounded-full text-dash-subtle transition-colors hover:bg-dash-line-strong hover:text-dash-fg"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          list={available.length > 0 ? `${id}-options` : undefined}
          value={text}
          onChange={(e) => {
            const v = e.target.value;
            if (v.includes(',')) add(v);
            else setText(v);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(text);
            } else if (e.key === 'Backspace' && !text && values.length > 0) {
              remove(values.length - 1);
            }
          }}
          onBlur={() => add(text)}
          placeholder={values.length === 0 ? placeholder : ''}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm text-dash-fg placeholder:text-dash-subtle focus:outline-none"
        />
        {available.length > 0 && (
          <datalist id={`${id}-options`}>
            {available.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        )}
      </div>
      <p className="mt-1 text-xs text-dash-subtle">Press Enter or comma to add.</p>
    </div>
  );
}
