export const SITE_URL = "https://adhamoe.vercel.app";
export const SITE_NAME = "Adham Osama";

export const PERSON = {
  name: "Adham Osama Elghobary",
  alternateName: [
    "adhamoe",
    "Adham Osama",
    "Adham Elghobary",
    "أدهم أسامة",
    "أدهم الغباري",
    "أدهم أسامة الغباري",
  ],
  username: "adhamoe",
  email: "hello.adhamoe@gmail.com",
  jobTitle: "Graphic Designer",
  description:
    "Graphic Designer specializing in social media design, brand identity, and visual storytelling.",
  image: `${SITE_URL}/images/adham-osama.webp`,
  addressLocality: "Mansoura",
  addressCountry: "EG",
  nationality: "Egypt",
  affiliation: "Mansoura University",
} as const;

export const KNOWS_ABOUT = [
  "Graphic Design",
  "Social Media Design",
  "Brand Identity",
  "Visual Identity",
  "Typography",
  "Editorial Design",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe After Effects",
] as const;

export const KNOWS_LANGUAGE = ["Arabic", "English"] as const;
export const IN_LANGUAGE = ["en", "ar"] as const;

export const SOCIAL_LINKS = [
  "https://www.behance.net/Adham-Osama",
  "https://linkedin.com/in/adham-ossama",
  "https://github.com/adhamosamaa",
  "https://x.com/adham_oe",
  "https://www.facebook.com/adhamosama.oe",
  "https://www.facebook.com/AdhamOssamaa",
  "https://t.me/adham_oe",
] as const;

/**
 * Central @id registry. Every schema entity resolves its @id from
 * here, so URLs and fragments are never duplicated across files.
 */
export const SCHEMA_ID = {
  website: `${SITE_URL}/#website`,
  person: `${SITE_URL}/#person`,
  webpage: (path: string) => `${SITE_URL}${normalizePath(path)}#webpage`,
  breadcrumb: (path: string) => `${SITE_URL}${normalizePath(path)}#breadcrumb`,
  collectionPage: (path: string) =>
    `${SITE_URL}${normalizePath(path)}#collectionpage`,
  aboutPage: `${SITE_URL}/about#aboutpage`,
  contactPage: `${SITE_URL}/contact#contactpage`,
  creativeWork: (slug: string) => `${SITE_URL}/works/${slug}#creativework`,
  image: (path: string) => `${SITE_URL}${normalizePath(path)}#primaryimage`,
};

function normalizePath(path: string): string {
  if (path === "/" || path === "") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${normalizePath(path)}`;
}
