import type { LucideIcon } from 'lucide-react';

/** A single nav / footer link. */
export interface NavLink {
  id: string;
  label: string;
  /** Anchor href for single-page navigation on the home page (e.g. '#hero'). */
  href: string;
  /** Route href for navigation from sub-pages (e.g. '/' or '/works'). */
  routeHref: string;
}

/** External social profile link (Behance, LinkedIn, Instagram, ...). */
export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

/** One label in the infinite scrolling ticker under the hero. */
export interface TickerTag {
  id: string;
  label: string;
}

/** Decorative gradient background used behind a project's SVG glyph. */
export type ProjectGradient = 'gradient-1' | 'gradient-2' | 'gradient-3';

/** The small line-art glyph rendered inside a project card thumbnail. */
export type ProjectIcon = 'orbit' | 'square' | 'peak';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  href: string;
  gradient: ProjectGradient;
  icon: ProjectIcon;
  /** Cover image path for the project detail hero. */
  cover: string;
  /** Gallery image paths — falls back to cover if empty. */
  gallery: string[];
  /** Category for filtering on the works page. */
  category: string;
  /** Extended overview paragraph for the project detail page. */
  overview: string;
  /** List of services provided for this project. */
  services: string[];
  /** List of tools / technologies used. */
  tools: string[];
  /** The challenge or problem this project addressed. */
  challenge: string;
  /** The solution or approach taken. */
  solution: string;
}

/** One of the three floating cards in the "How It Works" section. */
export interface HowItWorksCard {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Positional variant, drives placement/rotation styling. */
  variant: '01' | '02' | '03';
}

/** One step in the vertical "My Process" timeline. */
export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/** One row in the "Capabilities" skills list. */
export interface SkillRowData {
  id: string;
  number: string;
  name: string;
  tags: string[];
}

/** One paragraph of bio copy, with an optional phrase rendered in bold. */
export interface BioParagraph {
  id: string;
  text: string;
  /** Exact substring of `text` to render as bold — omit for plain paragraphs. */
  boldPhrase?: string;
}

/** One of the short text inputs in the contact form (name / email). */
export interface ContactFormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email';
  placeholder: string;
  autoComplete: string;
}

/** Global, site-wide settings and copy used across multiple sections. */
export interface SiteSettings {
  brandName: string;
  role: string;
  heroHeadline: string[];
  heroHighlight: string;
  heroDescription: string;
  aboutParagraphs: BioParagraph[];
  contactHeadline: string;
  contactHighlight: string;
  contactDescription: string;
  email: string;
  maxWidthPage: string;
  cv: string;
}

/** One entry in the about page experience timeline. */
export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

/** One software / tool item for the about page. */
export interface SoftwareItem {
  id: string;
  name: string;
  category: string;
}
