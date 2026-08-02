import { absoluteUrl, SCHEMA_ID } from "./constants";

export interface ContactPageInput {
  title: string;
  description: string;
}

export interface ContactPageSchema {
  "@type": "ContactPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
  isPartOf: { "@id": string };
  about: { "@id": string };
  mainEntity: { "@id": string };
}

export function getContactPageSchema({
  title,
  description,
}: ContactPageInput): ContactPageSchema {
  return {
    "@type": "ContactPage",
    "@id": SCHEMA_ID.contactPage,
    url: absoluteUrl("/contact"),
    name: title,
    description,
    isPartOf: { "@id": SCHEMA_ID.website },
    about: { "@id": SCHEMA_ID.person },
    mainEntity: { "@id": SCHEMA_ID.person },
  };
}
