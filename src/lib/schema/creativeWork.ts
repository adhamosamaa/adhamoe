import { absoluteUrl, SCHEMA_ID } from "./constants";
import { getImageObject, type ImageObjectSchema } from "./imageObject";

export interface CreativeWorkInput {
  title: string;
  description: string;
  slug: string;
  heroImage: string;
  datePublished: string;
  dateModified?: string;
  keywords?: string[];
}

export interface CreativeWorkSchema {
  "@type": "CreativeWork";
  "@id": string;
  name: string;
  headline: string;
  description: string;
  url: string;
  image: ImageObjectSchema;
  datePublished: string;
  dateModified: string;
  keywords?: string;
  creator: { "@id": string };
  author: { "@id": string };
  mainEntityOfPage: { "@id": string };
  isPartOf: { "@id": string };
}

export function getCreativeWorkSchema({
  title,
  description,
  slug,
  heroImage,
  datePublished,
  dateModified,
  keywords = [],
}: CreativeWorkInput): CreativeWorkSchema {
  const path = `/works/${slug}`;

  return {
    "@type": "CreativeWork",
    "@id": SCHEMA_ID.creativeWork(slug),
    name: title,
    headline: title,
    description,
    url: absoluteUrl(path),
    image: getImageObject({ url: heroImage, path }),
    datePublished,
    dateModified: dateModified ?? datePublished,
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
    // Both reference Person — never re-declared inline
    creator: { "@id": SCHEMA_ID.person },
    author: { "@id": SCHEMA_ID.person },
    mainEntityOfPage: { "@id": SCHEMA_ID.webpage(path) },
    isPartOf: { "@id": SCHEMA_ID.collectionPage("/works") },
  };
}
