import type { Config } from 'tailwindcss';

/**
 * Tailwind configuration — Studio CMS design system.
 *
 * NOTE: This project runs Tailwind v4 (CSS-first). This file is loaded via
 * `@config '../../tailwind.config.ts';` in `src/app/globals.css`, and merges
 * with the portfolio tokens declared in the `@theme` block there.
 *
 * Dashboard colours are *semantic* and resolve to CSS variables defined in
 * `src/app/dashboard/dashboard.css`. Swapping the `.dark` class on the
 * dashboard root re-skins every surface without needing `dark:` variants.
 */
const config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /** Raw neutral ramp — deep blacks → sleek grays → paper whites. */
        ink: {
          50: '#f7f7f6',
          100: '#ededeb',
          200: '#d6d6d3',
          300: '#a9a9ae',
          400: '#7a7a82',
          500: '#55555c',
          600: '#36363b',
          700: '#232326',
          800: '#151517',
          850: '#0f0f11',
          900: '#0a0a0b',
          950: '#050505',
        },
        /** Semantic, theme-aware dashboard tokens. */
        dash: {
          canvas: 'var(--dash-canvas)',
          surface: 'var(--dash-surface)',
          elevated: 'var(--dash-elevated)',
          line: 'var(--dash-line)',
          'line-strong': 'var(--dash-line-strong)',
          fg: 'var(--dash-fg)',
          muted: 'var(--dash-muted)',
          subtle: 'var(--dash-subtle)',
          brand: 'var(--dash-brand)',
          'brand-fg': 'var(--dash-brand-fg)',
          danger: 'var(--dash-danger)',
        },
      },
      spacing: {
        sidebar: '16rem',
        'sidebar-collapsed': '4.75rem',
        header: '4rem',
      },
      boxShadow: {
        'dash-card': 'var(--dash-shadow-card)',
        'dash-pop': 'var(--dash-shadow-pop)',
        'dash-glow': '0 0 14px 0 color-mix(in oklab, var(--dash-brand) 60%, transparent)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'dash-fade-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'dash-pop-in': {
          from: { opacity: '0', transform: 'translateY(-4px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'dash-shimmer': {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'dash-fade-up': 'dash-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'dash-pop-in': 'dash-pop-in 0.18s cubic-bezier(0.16, 1, 0.3, 1) both',
        'dash-shimmer': 'dash-shimmer 2.4s linear infinite',
      },
    },
  },
} satisfies Config;

export default config;
