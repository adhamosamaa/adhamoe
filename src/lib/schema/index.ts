export * from "./constants";
export * from "./imageObject";
export * from "./person";
export * from "./website";
export * from "./webpage";
export * from "./breadcrumb";
export * from "./creativeWork";
export * from "./collectionPage";
export * from "./aboutPage";
export * from "./contactPage";

/**
 * Wraps any number of schema entities into a single @graph.
 * This is what actually gets serialized into the <script> tag.
 */
export function buildSchemaGraph(...entities: Record<string, any>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": entities,
  };
}
