import { absoluteUrl, SCHEMA_ID } from "./constants";

export interface AboutPageInput {
  title: string;
  description: string;
}

export interface AboutPageSchema {
  "@type": "AboutPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
  isPartOf: { "@id": string };
  about: { "@id": string };
  mainEntity: { "@id": string };
}

export function getAboutPageSchema({
  title,
  description,
}: AboutPageInput): AboutPageSchema {
  return {
    "@type": "AboutPage",
    "@id": SCHEMA_ID.aboutPage,
    url: absoluteUrl("/about"),
    name: title,
    description,
    isPartOf: { "@id": SCHEMA_ID.website },
    about: { "@id": SCHEMA_ID.person },
    mainEntity: { "@id": SCHEMA_ID.person },
  };
}
