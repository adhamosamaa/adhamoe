import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DASHBOARD_HOME, DASHBOARD_NAV_ITEMS } from '@/data/dashboard-nav';

/**
 * Temporary catch-all for dashboard sections that haven't been built yet.
 * Creating a real folder (e.g. `dashboard/projects/page.tsx`) takes precedence automatically.
 */

const sections = DASHBOARD_NAV_ITEMS.filter((item) => item.href !== DASHBOARD_HOME);
const findSection = (slug: string) => sections.find((item) => item.href === `${DASHBOARD_HOME}/${slug}`);

interface SectionPageProps {
  params: Promise<{ section: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return sections.map((item) => ({ section: item.href.split('/').pop() as string }));
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { section } = await params;
  return { title: findSection(section)?.label ?? 'Not found' };
}

export default async function DashboardSectionPage({ params }: SectionPageProps) {
  const { section } = await params;
  const item = findSection(section);
  if (!item) notFound();

  const Icon = item.icon;

  return (
    <div className="space-y-8">
      <header className="animate-dash-fade-up">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-dash-brand">Studio</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{item.label}</h1>
        <p className="mt-2 max-w-xl text-sm text-dash-muted">{item.description}</p>
      </header>

      <section className="grid animate-dash-fade-up place-items-center rounded-2xl border border-dashed border-dash-line-strong bg-dash-surface/50 px-6 py-24 text-center [animation-delay:120ms]">
        <span className="grid size-14 place-items-center rounded-2xl bg-dash-elevated text-dash-brand shadow-dash-card">
          <Icon className="size-6" strokeWidth={1.5} />
        </span>
        <h2 className="mt-6 text-lg font-semibold tracking-tight">Nothing here yet</h2>
        <p className="mt-2 max-w-sm text-sm text-dash-muted">
          The {item.label.toLowerCase()} module will be built in an upcoming step. The shell, navigation, and
          theming are ready for it.
        </p>
      </section>
    </div>
  );
}
