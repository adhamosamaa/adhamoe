import { createClient } from '@/utils/supabase/server';
import { SettingsForm } from './SettingsForm';
import { Settings2 } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();
  
  // Fetch the singleton settings row (id = 1)
  const { data: settings, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return (
    <div className="space-y-8 animate-dash-fade-up max-w-5xl">
      <header className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-dash-brand">CMS</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl flex items-center gap-3">
            <Settings2 className="size-8 text-dash-fg" />
            Pages & Sections
          </h1>
          <p className="mt-2 max-w-xl text-sm text-dash-muted">
            Manage the global copy and static content displayed across your public portfolio.
          </p>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-dash-danger/20 bg-dash-danger/10 p-6 text-sm text-dash-danger">
          <p className="font-semibold mb-2">Failed to load site settings.</p>
          <p>{error.message}</p>
          <p className="mt-2 text-xs">Ensure you have run the SQL script to create and seed the site_settings table.</p>
        </div>
      ) : settings ? (
        <SettingsForm initialData={settings} />
      ) : null}
    </div>
  );
}
