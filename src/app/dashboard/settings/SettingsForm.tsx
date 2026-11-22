'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, X, Save } from 'lucide-react';
import { updateSettingsAction } from './actions';
import { cn } from '@/utils/cn';

interface SettingsFormProps {
  initialData: any;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateSettingsAction(data);
    if (res.error) {
      toast.error(`Failed to save: ${res.error}`);
    } else {
      toast.success('Settings saved successfully!');
    }
    setIsSaving(false);
  };

  const handleChange = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-dash-line bg-dash-surface p-6 shadow-dash-card">
        <div className="space-y-6 animate-dash-fade-up">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Brand Name" value={data.brand_name} onChange={(v) => handleChange('brand_name', v)} />
            <Field label="Contact Email" type="email" value={data.email} onChange={(v) => handleChange('email', v)} />
            <div className="sm:col-span-2">
              <Field label="CV File URL" value={data.cv_url} onChange={(v) => handleChange('cv_url', v)} />
            </div>
          </div>
          
          <div className="pt-4 border-t border-dash-line/50">
            <DynamicObjectArray 
              title="Social Links" 
              value={data.social_links} 
              onChange={(v) => handleChange('social_links', v)} 
              template={{ id: '', label: '', href: '' }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-dash-line pt-6">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-dash-brand px-6 text-sm font-medium text-dash-brand-fg transition-all hover:bg-dash-brand/90 hover:shadow-dash-glow disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}

// --- HELPER COMPONENTS --- //

export function Field({ label, value, onChange, isTextArea, type = 'text' }: { label: string, value: string, onChange: (v: string) => void, isTextArea?: boolean, type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-dash-muted">{label}</label>
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-dash-line bg-dash-canvas p-3 text-sm text-dash-fg outline-none transition-colors focus:border-dash-brand focus:ring-1 focus:ring-dash-brand min-h-[100px]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-dash-line bg-dash-canvas px-3 py-2 text-sm text-dash-fg outline-none transition-colors focus:border-dash-brand focus:ring-1 focus:ring-dash-brand"
        />
      )}
    </div>
  );
}

export function DynamicStringArray({ title, value, onChange }: { title: string, value: string[], onChange: (v: string[]) => void }) {
  const handleUpdate = (index: number, val: string) => {
    const newArr = [...value];
    newArr[index] = val;
    onChange(newArr);
  };
  const handleAdd = () => onChange([...value, '']);
  const handleRemove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3 rounded-xl border border-dash-line bg-dash-canvas p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-dash-fg">{title}</h3>
        <button type="button" onClick={handleAdd} className="flex items-center gap-1 text-xs font-medium text-dash-brand hover:underline">
          <Plus className="size-3" /> Add Line
        </button>
      </div>
      {value.map((str, i) => (
        <div key={i} className="flex items-center gap-3">
          <input
            value={str}
            onChange={(e) => handleUpdate(i, e.target.value)}
            className="flex-1 rounded-lg border border-dash-line bg-dash-surface px-3 py-2 text-sm text-dash-fg outline-none focus:border-dash-brand"
          />
          <button type="button" onClick={() => handleRemove(i)} className="text-dash-muted hover:text-dash-danger p-1">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function DynamicObjectArray({ title, value, onChange, template }: { title: string, value: any[], onChange: (v: any[]) => void, template: any }) {
  const handleUpdate = (index: number, key: string, val: any) => {
    const newArr = [...value];
    newArr[index] = { ...newArr[index], [key]: val };
    onChange(newArr);
  };
  const handleAdd = () => onChange([...value, { ...template }]);
  const handleRemove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-4 rounded-xl border border-dash-line bg-dash-canvas p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-dash-fg">{title}</h3>
        <button type="button" onClick={handleAdd} className="flex items-center gap-1 text-xs font-medium text-dash-brand hover:underline">
          <Plus className="size-3" /> Add Item
        </button>
      </div>
      {value.map((item, i) => (
        <div key={i} className="relative grid gap-4 rounded-xl border border-dash-line bg-dash-surface p-5 shadow-sm">
          <button type="button" onClick={() => handleRemove(i)} className="absolute top-3 right-3 text-dash-muted hover:text-dash-danger bg-dash-elevated rounded-full p-1 transition-colors">
            <X className="size-4" />
          </button>
          
          <div className="grid gap-4 sm:grid-cols-2 mt-2">
            {Object.keys(template).map(key => {
              const isTextArea = key === 'text' || key === 'description';
              const isArray = Array.isArray(template[key]);
              const val = item[key];
              
              // Helper to convert comma-separated strings back to array for tags
              const handleArrayStringChange = (str: string) => {
                const arr = str.split(',').map(s => s.trim()).filter(Boolean);
                handleUpdate(i, key, arr);
              };

              return (
                <div key={key} className={cn(isTextArea ? "sm:col-span-2" : "")}>
                  <label className="text-xs font-medium text-dash-muted capitalize mb-1.5 block">{key}</label>
                  {isTextArea ? (
                    <textarea
                      value={val || ''}
                      onChange={(e) => handleUpdate(i, key, e.target.value)}
                      className="w-full rounded-lg border border-dash-line bg-dash-canvas p-3 text-sm text-dash-fg outline-none focus:border-dash-brand min-h-[80px]"
                    />
                  ) : isArray ? (
                    <input
                      value={(val || []).join(', ')}
                      onChange={(e) => handleArrayStringChange(e.target.value)}
                      placeholder="Comma separated values..."
                      className="w-full rounded-lg border border-dash-line bg-dash-canvas px-3 py-2 text-sm text-dash-fg outline-none focus:border-dash-brand"
                    />
                  ) : (
                    <input
                      value={val || ''}
                      onChange={(e) => handleUpdate(i, key, e.target.value)}
                      className="w-full rounded-lg border border-dash-line bg-dash-canvas px-3 py-2 text-sm text-dash-fg outline-none focus:border-dash-brand"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
