import { SITE_URL, SITE_NAME, PERSON, IN_LANGUAGE, SCHEMA_ID } from "./constants";

export interface WebsiteSchema {
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
  identifier: { "@type": "PropertyValue"; propertyID: string; value: string };
  author: { "@id": string };
  creator: { "@id": string };
  inLanguage: string[];
  potentialAction: { "@type": "ViewAction"; target: string };
}

export function getWebsiteSchema(): WebsiteSchema {
  return {
    "@type": "WebSite",
    "@id": SCHEMA_ID.website,
    url: SITE_URL,
    name: SITE_NAME,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "username",
      value: PERSON.username,
    },
    author: { "@id": SCHEMA_ID.person },
    creator: { "@id": SCHEMA_ID.person },
    inLanguage: [...IN_LANGUAGE],
    potentialAction: { "@type": "ViewAction", target: SITE_URL },
  };
}
