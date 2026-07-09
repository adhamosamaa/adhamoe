# Adham Osama — Portfolio

Production-ready rebuild of the original static site: **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide React**. Same UI/UX, restructured into a scalable, typed, data-driven codebase.

## Stack

| | |
|---|---|
| Framework | Next.js 16, App Router, React Server Components by default |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js` needed) |
| Motion | Framer Motion — scroll reveals, in-view triggers, `useReducedMotion` support |
| Icons | Lucide React — process-step icons, button arrows |
| Fonts | `next/font/google` — Space Grotesk + DM Serif Display, self-hosted, zero layout shift |

## Architecture

```
src/
├── app/
│   ├── layout.tsx        Root layout — metadata, fonts, spark sprite
│   ├── page.tsx           Composes all sections
│   └── globals.css        Tailwind v4 theme tokens + component classes
├── components/
│   ├── ui/                 Primitive, fully reusable pieces
│   │   ├── Button.tsx           solid / outline / ghost variants
│   │   ├── SectionLabel.tsx     eyebrow label (spark icon + caption)
│   │   ├── AccentText.tsx       accent-colored serif italic span
│   │   ├── HighlightText.tsx    bio paragraph with one bolded phrase
│   │   ├── SparkIcon.tsx        the small pulsing spark glyph
│   │   ├── SparkSprite.tsx      shared <symbol> definition (rendered once)
│   │   └── Reveal.tsx           Framer Motion scroll-reveal wrapper
│   ├── layout/
│   │   ├── Navbar.tsx      scroll-aware background, active-link highlight
│   │   ├── Footer.tsx
│   │   └── SocialRail.tsx  vertical social links beside the hero
│   ├── sections/            One component per page section
│   │   ├── Hero.tsx, Ticker.tsx, Projects.tsx, HowItWorks.tsx,
│   │   └── About.tsx, Skills.tsx, Contact.tsx
│   └── cards/                Repeated item renderers, always driven by .map()
│       ├── ProjectCard.tsx, HiwCard.tsx, ProcessStepCard.tsx, SkillRow.tsx
├── data/                    All copy lives here — nothing is hardcoded in JSX
│   ├── settings.ts    site-wide copy (hero, about, contact headlines)
│   ├── nav.ts, social.ts, ticker.ts
│   ├── projects.ts, how-it-works.ts, process.ts, skills.ts, contact.ts
├── types/index.ts           One interface per data shape above
├── hooks/
│   ├── useScrolled.ts        navbar background toggle
│   ├── useActiveSection.ts   scrollspy
│   └── useContactForm.ts     FormSubmit.co submit/validate/status logic
└── utils/cn.ts               className merge helper
```

### Server vs. Client Components

Everything is a **Server Component by default**. Only five files declare `'use client'`, each for a concrete reason:

| Component | Why it's a Client Component |
|---|---|
| `Navbar` | scroll listener + `IntersectionObserver` for active-link state |
| `Ticker` | `useInView` to pause the marquee when off-screen |
| `HowItWorks` | `useInView` to trigger the card entrance animation |
| `Contact` | form state (sending/success/error) + `onSubmit` handler |
| `Reveal` | wraps Framer Motion's `whileInView` |

Everything else — Hero, Projects, About, Skills, Footer, every card — renders fully on the server. No client JS ships for content that doesn't need interactivity.

## Content model

Nothing is hardcoded inside a component. Every repeated block (nav links, social links, ticker tags, projects, "How It Works" cards, process steps, skills, contact form fields) is typed in `src/types/index.ts` and sourced from `src/data/*.ts`, then rendered with `.map()`. To add a fourth project, edit `data/projects.ts` — no component changes needed.

## What's intentionally different from the static build (and why)

- **Scroll-reveal & "How It Works" entrance** now run through Framer Motion (`Reveal`, `useInView`) instead of a hand-rolled `IntersectionObserver`, as requested — same easing curve, same distances, same `prefers-reduced-motion` behavior.
- **Fonts** load via `next/font/google` instead of a `<link>` tag — self-hosted, no external request blocking first paint, no font-swap layout shift.
- **Icons** in the process timeline use `lucide-react` equivalents of the original inline SVGs (`User`, `Share2`, `LayoutGrid`, `MonitorSmartphone`) — visually equivalent, now trivially swappable.
- Everything else — spacing, colors, typography, copy, hover states, breakpoints — is unchanged.

## What you need to add

- `public/images/adham-pro.png` — hero portrait (wasn't in the original upload)
- `public/images/og-cover.jpg` — Open Graph share image

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. (`next/font` fetches font files from Google Fonts at build time — a normal internet connection is all that's needed; no API key.)

## Build & deploy

```bash
npm run build
npm start
```

Push to GitHub and import on [vercel.com](https://vercel.com) for zero-config deploys.
# adhamoe
