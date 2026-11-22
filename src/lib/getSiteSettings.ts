import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';
import { siteSettings } from '@/data/settings';
import { aboutHeroParagraphs, experience, softwareList } from '@/data/about';
import { howItWorksCards } from '@/data/how-it-works';
import { socialLinks } from '@/data/social';
import type { BioParagraph, ExperienceEntry, HowItWorksCard, SocialLink, SoftwareItem } from '@/types';

/** Shape of the `site_settings` row (id = 1) as consumed by the UI. */
export interface SiteSettingsRow {
  id: number;
  brand_name: string;
  role_title: string;
  hero_headline: string[];
  hero_highlight: string;
  hero_description: string;
  about_paragraphs: BioParagraph[];
  about_extended_paragraphs: BioParagraph[];
  experience: ExperienceEntry[];
  software_list: SoftwareItem[];
  how_it_works: HowItWorksCard[];
  contact_headline: string;
  contact_highlight: string;
  contact_description: string;
  email: string;
  cv_url: string;
  social_links: SocialLink[];
}

/**
 * Complete, valid fallback used whenever Supabase is unreachable, the row is
 * missing, or individual columns are null. Sourced from the static data files
 * so there is a single source of truth for default copy.
 */
export const DEFAULT_SITE_SETTINGS: Readonly<SiteSettingsRow> = Object.freeze({
  id: 1,
  brand_name: siteSettings.brandName,
  role_title: siteSettings.role,
  hero_headline: siteSettings.heroHeadline,
  hero_highlight: siteSettings.heroHighlight,
  hero_description: siteSettings.heroDescription,
  about_paragraphs: siteSettings.aboutParagraphs,
  about_extended_paragraphs: aboutHeroParagraphs,
  experience,
  software_list: softwareList,
  how_it_works: howItWorksCards,
  contact_headline: siteSettings.contactHeadline,
  contact_highlight: siteSettings.contactHighlight,
  contact_description: siteSettings.contactDescription,
  email: siteSettings.email,
  cv_url: siteSettings.cv,
  social_links: socialLinks,
});

/**
 * Merge a (possibly partial) DB row over the defaults. `null`/`undefined`
 * columns never override a default, and array columns must actually be arrays.
 */
function mergeWithDefaults(row: Record<string, unknown>): SiteSettingsRow {
  const merged: Record<string, unknown> = { ...DEFAULT_SITE_SETTINGS };

  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined) continue;
    const fallback = (DEFAULT_SITE_SETTINGS as Record<string, unknown>)[key];
    if (Array.isArray(fallback) && !Array.isArray(value)) continue;
    merged[key] = value;
  }

  return merged as unknown as SiteSettingsRow;
}

/**
 * Fetch global site settings. Never throws and never returns null:
 * on any failure it degrades gracefully to `DEFAULT_SITE_SETTINGS`.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettingsRow> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();

    if (error || !data) {
      console.warn(
        `[getSiteSettings] Using default site settings: ${error?.message ?? 'no site_settings row with id = 1'}`,
      );
      return { ...DEFAULT_SITE_SETTINGS };
    }

    return mergeWithDefaults(data as Record<string, unknown>);
  } catch (err) {
    console.warn(
      `[getSiteSettings] Using default site settings: ${err instanceof Error ? err.message : String(err)}`,
    );
    return { ...DEFAULT_SITE_SETTINGS };
  }
});
