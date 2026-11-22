'use client';

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { parseDraft, serializeDraft, type ProjectDraft } from './draft';

const STORAGE_PREFIX = 'adhamoe:project-draft:v1:';

interface StoredDraft {
  savedAt: number;
  draft: ProjectDraft;
}

function readStored(key: string): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: unknown; draft?: unknown };
    const draft = parseDraft(parsed.draft);
    if (!draft) return null;
    return { savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : Date.now(), draft };
  } catch {
    return null; // Corrupt JSON / storage disabled — behave as if nothing was saved.
  }
}

function formatAgo(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(ts).toLocaleDateString();
}

export interface PersistentDraft {
  draft: ProjectDraft;
  setDraft: Dispatch<SetStateAction<ProjectDraft>>;
  /** True when the draft differs from the last version stored in the database. */
  isDirty: boolean;
  /** Call ONLY after the database confirmed the save. */
  clearLocalDraft: () => void;
}

/**
 * Keeps `draft` mirrored to localStorage (scoped per route) on every change,
 * and restores it on mount with a "Draft recovered" toast.
 *
 * Nothing is written while the draft equals `initial`, so simply opening the
 * builder never leaves a stale entry behind.
 */
export function usePersistentDraft(scope: string, initial: ProjectDraft): PersistentDraft {
  const key = STORAGE_PREFIX + scope;
  const [draft, setDraft] = useState<ProjectDraft>(initial);
  // Writes are blocked until we've had a chance to read — otherwise the first
  // render would overwrite the stored draft with `initial`.
  const [hydrated, setHydrated] = useState(false);
  const restoredRef = useRef(false);
  const clearedRef = useRef(false);
  const initialRef = useRef(initial);
  const initialSerialized = serializeDraft(initial);

  // 1. Restore on mount. (Ref guard stops a duplicate toast under StrictMode.)
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const stored = readStored(key);
    if (stored && serializeDraft(stored.draft) !== serializeDraft(initialRef.current)) {
      setDraft(stored.draft);
      toast.success('Draft recovered', {
        description: `Unsaved changes from ${formatAgo(stored.savedAt)} were restored.`,
        duration: 8000,
        action: {
          label: 'Discard',
          onClick: () => {
            window.localStorage.removeItem(key);
            setDraft(initialRef.current);
          },
        },
      });
    }
    setHydrated(true);
  }, [key]);

  // 2. Persist on every change.
  useEffect(() => {
    if (!hydrated || clearedRef.current) return;
    try {
      if (serializeDraft(draft) === initialSerialized) {
        window.localStorage.removeItem(key);
      } else {
        const payload: StoredDraft = { savedAt: Date.now(), draft };
        window.localStorage.setItem(key, JSON.stringify(payload));
      }
    } catch {
      // Quota exceeded / private mode — the in-memory draft still works.
    }
  }, [draft, hydrated, key, initialSerialized]);

  const clearLocalDraft = useCallback(() => {
    clearedRef.current = true; // Block any re-write while we navigate away.
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }, [key]);

  return {
    draft,
    setDraft,
    isDirty: serializeDraft(draft) !== initialSerialized,
    clearLocalDraft,
  };
}
