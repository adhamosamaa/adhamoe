import { absoluteUrl, SCHEMA_ID } from "./constants";
import { getImageObject, type ImageObjectSchema } from "./imageObject";

export interface WebPageInput {
  path: string;
  title: string;
  description: string;
  image?: string;
  /** Set true when the page also renders a BreadcrumbList (e.g. project pages) */
  includeBreadcrumb?: boolean;
}

export interface WebPageSchema {
  "@type": "WebPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
  inLanguage: string;
  isPartOf: { "@id": string };
  about: { "@id": string };
  author: { "@id": string };
  primaryImageOfPage?: ImageObjectSchema;
  breadcrumb?: { "@id": string };
}

export function getWebPageSchema({
  path,
  title,
  description,
  image,
  includeBreadcrumb = false,
}: WebPageInput): WebPageSchema {
  return {
    "@type": "WebPage",
    "@id": SCHEMA_ID.webpage(path),
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: "en",
    isPartOf: { "@id": SCHEMA_ID.website },
    about: { "@id": SCHEMA_ID.person },
    author: { "@id": SCHEMA_ID.person },
    ...(image ? { primaryImageOfPage: getImageObject({ url: image, path }) } : {}),
    ...(includeBreadcrumb ? { breadcrumb: { "@id": SCHEMA_ID.breadcrumb(path) } } : {}),
  };
}
