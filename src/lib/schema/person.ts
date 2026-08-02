import {
  SITE_URL,
  PERSON,
  KNOWS_ABOUT,
  KNOWS_LANGUAGE,
  SOCIAL_LINKS,
  SCHEMA_ID,
} from "./constants";
import { getImageObject, type ImageObjectSchema } from "./imageObject";

export interface PersonSchema {
  "@type": "Person";
  "@id": string;
  name: string;
  alternateName: string[];
  description: string;
  url: string;
  email: string;
  image: ImageObjectSchema;
  jobTitle: string;
  hasOccupation: { "@type": "Occupation"; name: string };
  knowsAbout: string[];
  knowsLanguage: string[];
  nationality: { "@type": "Country"; name: string };
  affiliation: { "@type": "CollegeOrUniversity"; name: string };
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressCountry: string;
  };
  sameAs: string[];
  mainEntityOfPage: { "@id": string };
}

export function getPersonSchema(): PersonSchema {
  return {
    "@type": "Person",
    "@id": SCHEMA_ID.person,
    name: PERSON.name,
    alternateName: [...PERSON.alternateName],
    description: PERSON.description,
    url: SITE_URL,
    email: PERSON.email,
    image: getImageObject({ url: PERSON.image }),
    jobTitle: PERSON.jobTitle,
    hasOccupation: { "@type": "Occupation", name: PERSON.jobTitle },
    knowsAbout: [...KNOWS_ABOUT],
    knowsLanguage: [...KNOWS_LANGUAGE],
    nationality: { "@type": "Country", name: PERSON.nationality },
    affiliation: { "@type": "CollegeOrUniversity", name: PERSON.affiliation },
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON.addressLocality,
      addressCountry: PERSON.addressCountry,
    },
    sameAs: [...SOCIAL_LINKS],
    // References the WebPage entity for "/", not a duplicated inline object
    mainEntityOfPage: { "@id": SCHEMA_ID.webpage("/") },
  };
}
