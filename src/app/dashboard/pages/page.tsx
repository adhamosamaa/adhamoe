import { getSiteSettings } from '@/lib/getSiteSettings';
import { LiveEditor } from './LiveEditor';

export const revalidate = 0;

export default async function PagesEditorPage() {
  const settings = await getSiteSettings();
  if (!settings) return <div>Failed to load settings.</div>;

  return <LiveEditor initialData={settings} />;
}
