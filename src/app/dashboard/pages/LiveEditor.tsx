'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, Monitor, Smartphone } from 'lucide-react';
import { updateSettingsAction } from '../settings/actions';
import { Field, DynamicStringArray, DynamicObjectArray } from '../settings/SettingsForm';
import { cn } from '@/utils/cn';

// Preview Components
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { AboutPageContent } from '@/components/sections/AboutPageContent';

export function LiveEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    const res = await updateSettingsAction(data);
    if (res.error) {
      toast.error(`Failed to save: ${res.error}`);
    } else {
      toast.success('Live edits saved successfully!');
    }
    setIsSaving(false);
  };

  const handleChange = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] -mx-6 -mb-6 md:-mx-10 md:-mb-10 bg-dash-bg">
      {/* Top Bar */}
      <div className="flex-none h-14 border-b border-dash-line bg-dash-surface flex items-center justify-between px-4 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-dash-fg text-sm">Visual Editor</div>
          <div className="text-xs text-dash-muted px-2 py-1 bg-dash-canvas rounded-md border border-dash-line hidden sm:block">
            Click text to edit inline. Hover over cards to delete.
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-dash-brand px-4 text-sm font-medium text-dash-brand-fg transition-all hover:bg-dash-brand/90 hover:shadow-dash-glow disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Full Screen Live Preview */}
      <div className="flex-1 bg-black overflow-y-auto relative pattern-isometric pattern-white/[0.02] pattern-size-4">
        <div className="relative h-full text-white">
          <main id="main">
            <AboutPageContent 
              settings={data} 
              isEditorMode={true} 
              onChange={handleChange} 
            />
          </main>
        </div>
      </div>
    </div>
  );
}
