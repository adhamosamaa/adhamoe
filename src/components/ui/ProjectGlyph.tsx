import type { ProjectIcon } from '@/types';

/** SVG glyphs used as placeholders when a project has no cover image. */
export const iconGlyphs: Record<ProjectIcon, () => React.JSX.Element> = {
  orbit: () => (
    <>
      <circle cx="30" cy="30" r="20" stroke="#7DAF88" strokeWidth=".6" />
      <circle cx="30" cy="30" r="12" stroke="#7DAF88" strokeWidth=".6" />
      <circle cx="30" cy="30" r="3" fill="#7DAF88" />
    </>
  ),
  square: () => <rect x="15" y="15" width="30" height="30" rx="2" stroke="#9B8FCC" strokeWidth=".6" />,
  peak: () => (
    <path d="M15 42 L30 18 L45 42" stroke="#CC8F8F" strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round" />
  ),
};
