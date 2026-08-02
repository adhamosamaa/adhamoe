import { absoluteUrl, SCHEMA_ID } from "./constants";

export interface BreadcrumbItemInput {
  name: string;
  path: string;
}

export interface BreadcrumbSchema {
  "@type": "BreadcrumbList";
  "@id": string;
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export function getBreadcrumbSchema(
  items: BreadcrumbItemInput[],
  currentPath: string
): BreadcrumbSchema {
  return {
    "@type": "BreadcrumbList",
    "@id": SCHEMA_ID.breadcrumb(currentPath),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
