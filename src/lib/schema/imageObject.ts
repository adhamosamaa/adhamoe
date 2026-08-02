import { SITE_URL, SCHEMA_ID } from "./constants";

export interface ImageObjectInput {
  url: string;
  width?: number;
  height?: number;
  /** Page path this image is the primary image of — used to build a stable @id */
  path?: string;
  caption?: string;
}

export interface ImageObjectSchema {
  "@type": "ImageObject";
  "@id"?: string;
  url: string;
  contentUrl: string;
  width?: number;
  height?: number;
  caption?: string;
}

export function getImageObject({
  url,
  width = 1200,
  height = 630,
  path,
  caption,
}: ImageObjectInput): ImageObjectSchema {
  const absoluteImageUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  return {
    "@type": "ImageObject",
    ...(path ? { "@id": SCHEMA_ID.image(path) } : {}),
    url: absoluteImageUrl,
    contentUrl: absoluteImageUrl,
    width,
    height,
    ...(caption ? { caption } : {}),
  };
}
