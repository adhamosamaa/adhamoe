'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, CloudOff, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { saveProjectAction } from '@/app/dashboard/projects/actions';
import {
  draftToInput,
  getAllBlockUrls,
  resolveCoverUrl,
  type MediaBlock,
  type ProjectDraft,
  type ProjectSuggestions,
} from './draft';
import { FinalTouchesModal, type SaveIntent } from './FinalTouchesModal';
import { MediaCanvas } from './MediaCanvas';
import { usePersistentDraft } from './usePersistentDraft';

interface ProjectBuilderProps {
  /** Omit to create a new project. */
  projectId?: string;
  initialDraft: ProjectDraft;
  isPublished: boolean;
  suggestions: ProjectSuggestions;
}

/**
 * Two-step, Dribbble/Behance-style block project builder.
 *   Step 1 — distraction-free block media canvas (Single, 3-Column Grid, Carousel).
 *   Step 2 — "Final touches" modal for thumbnail + metadata.
 * Every change is mirrored to localStorage until the database confirms a save.
 */
export function ProjectBuilder({ projectId, initialDraft, isPublished, suggestions }: ProjectBuilderProps) {
  const router = useRouter();
  const draftScope = projectId ? `draft_project_${projectId}` : 'draft_project_new';
  const { draft, setDraft, isDirty, clearLocalDraft } = usePersistentDraft(draftScope, initialDraft);

  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<SaveIntent | null>(null);
  const [, startTransition] = useTransition();

  const coverUrl = resolveCoverUrl(draft);
  const allImages = getAllBlockUrls(draft.blocks);
  const hasImages = allImages.length > 0;
  const isEditing = Boolean(projectId);
  const busy = pendingIntent !== null;

  const patchDraft = useCallback((patch: Partial<ProjectDraft>) => setDraft((d) => ({ ...d, ...patch })), [setDraft]);
  const updateBlocks = useCallback(
    (update: (prev: MediaBlock[]) => MediaBlock[]) => setDraft((d) => ({ ...d, blocks: update(d.blocks) })),
    [setDraft],
  );
  const handleSetCover = useCallback(
    (url: string) => {
      setDraft((d) => ({ ...d, cover: { url, source: 'gallery' } }));
      toast.success('Cover image updated!');
    },
    [setDraft],
  );

  // Uploads live only in this tab — warn before leaving mid-upload.
  useEffect(() => {
    if (!uploading) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [uploading]);

  const save = (intent: SaveIntent) => {
    if (busy || uploading) return;
    if (intent === 'publish' && !hasImages) {
      toast.error('Add at least one image before publishing.');
      setModalOpen(false);
      return;
    }

    setPendingIntent(intent);
    startTransition(async () => {
      try {
        const result = await saveProjectAction(draftToInput(draft), { id: projectId, publish: intent === 'publish' });
        if (!result.ok) {
          toast.error(result.error);
          setPendingIntent(null);
          return;
        }
        // Only now — with the DB write confirmed — is the local safety net removed.
        clearLocalDraft();
        toast.success(result.published ? 'Project published' : 'Saved to drafts', {
          action: result.published
            ? { label: 'View', onClick: () => window.open(`/works/${result.slug}`, '_blank', 'noopener') }
            : undefined,
        });
        // Buttons stay locked while we navigate away.
        router.push('/dashboard/projects');
      } catch {
        toast.error('Network error — your work is still saved in this browser. Please try again.');
        setPendingIntent(null);
      }
    });
  };

  const canSaveDraft = !busy && !uploading && (isEditing || hasImages || draft.title.trim() !== '');

  return (
    <div className="relative min-h-dvh">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-dash-line bg-dash-canvas/80 px-4 backdrop-blur-xl sm:px-6">
        <Link
          href="/dashboard/projects"
          aria-label="Exit builder"
          title="Exit — your changes stay saved in this browser"
          className="grid size-9 shrink-0 place-items-center rounded-full text-dash-muted transition-colors hover:bg-dash-elevated hover:text-dash-fg"
        >
          <X className="size-5" strokeWidth={1.75} />
        </Link>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">
            {isEditing ? draft.title.trim() || 'Untitled project' : 'New project'}
          </p>
          <SaveStatus uploading={uploading} dirty={isDirty} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            id="builder-save-draft"
            onClick={() => save('draft')}
            disabled={!canSaveDraft}
            className="hidden h-10 items-center gap-2 rounded-full border border-dash-line-strong px-5 text-sm font-medium text-dash-fg transition-colors hover:bg-dash-elevated disabled:pointer-events-none disabled:opacity-40 sm:inline-flex"
          >
            {pendingIntent === 'draft' && !modalOpen && <Loader2 className="size-4 animate-spin" />}
            {isPublished ? 'Move to drafts' : 'Save as draft'}
          </button>
          <button
            type="button"
            id="builder-continue"
            onClick={() => setModalOpen(true)}
            disabled={!hasImages || busy}
            title={!hasImages ? 'Add at least one image to continue' : undefined}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-dash-brand px-5 text-sm font-semibold text-dash-brand-fg transition-all duration-200 hover:-translate-y-px hover:shadow-dash-glow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dash-brand/25 disabled:pointer-events-none disabled:opacity-40"
          >
            Continue
            <ArrowRight className="size-4" />
          </button>
        </div>
      </header>

      <MediaCanvas
        blocks={draft.blocks}
        onBlocksChange={updateBlocks}
        coverUrl={coverUrl}
        onSetCover={handleSetCover}
        onUploadingChange={setUploading}
      />

      <FinalTouchesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        draft={draft}
        onChange={patchDraft}
        coverUrl={coverUrl}
        onSave={save}
        pendingIntent={pendingIntent}
        canvasUploading={uploading}
        isPublished={isPublished}
        suggestions={suggestions}
      />
    </div>
  );
}

function SaveStatus({ uploading, dirty }: { uploading: boolean; dirty: boolean }) {
  const [label, Icon, tone] = uploading
    ? (['Uploading media…', Loader2, 'text-dash-brand'] as const)
    : dirty
      ? (['Unpublished changes · auto-saved in this browser', CloudOff, 'text-amber-500'] as const)
      : (['All changes saved', Check, 'text-dash-subtle'] as const);

  return (
    <p aria-live="polite" className={cn('flex items-center gap-1 truncate text-[11px]', tone)}>
      <Icon className={cn('size-3 shrink-0', uploading && 'animate-spin')} />
      <span className="truncate">{label}</span>
    </p>
  );
}
