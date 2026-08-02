import { absoluteUrl, SCHEMA_ID } from "./constants";

export interface CollectionPageInput {
  title: string;
  description: string;
  path?: string;
  /** @id list of CreativeWork entities to list, e.g. from SCHEMA_ID.creativeWork(slug) */
  itemIds?: string[];
}

export interface CollectionPageSchema {
  "@type": "CollectionPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
  isPartOf: { "@id": string };
  about: { "@id": string };
  mainEntity?: {
    "@type": "ItemList";
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      item: { "@id": string };
    }>;
  };
}

export function getCollectionPageSchema({
  title,
  description,
  path = "/works",
  itemIds = [],
}: CollectionPageInput): CollectionPageSchema {
  return {
    "@type": "CollectionPage",
    "@id": SCHEMA_ID.collectionPage(path),
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: { "@id": SCHEMA_ID.website },
    about: { "@id": SCHEMA_ID.person },
    ...(itemIds.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: itemIds.map((id, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: { "@id": id },
            })),
          },
        }
      : {}),
  };
}
