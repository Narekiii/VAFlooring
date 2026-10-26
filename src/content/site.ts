/**
 * Central business configuration.
 *
 * Only verified details belong here. Fields set to `null` are hidden everywhere on the
 * public site (header, footer, contact page, structured data) until they are filled in.
 * See HANDOFF.md for the list of details still needed from V & A Flooring Inc.
 */

export type PostalAddress = {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
};

export type BusinessConfig = {
  name: string;
  founded: number;
  founder: string;
  ownership: string;
  serviceArea: string;
  brandLine: string;
  /** Public phone number exactly as it should be displayed, e.g. "(818) 000-0000". */
  phone: string | null;
  /** Public email address for customer inquiries. */
  email: string | null;
  /** Office or showroom address. Leave null if the business does not publish one. */
  address: PostalAddress | null;
  /** Public operating hours, one line per entry, e.g. "Monday–Friday, 8 am–5 pm". */
  hours: string[] | null;
  /** Contractor license, as displayed. Only verified, approved details. */
  license: { authority: string; number: string; classifications: string[] } | null;
  /** Show "Bonded & Insured" (supplied by the business). */
  bondedInsured: boolean;
  /** EPA Lead-Safe Certified Firm certification number, if current. */
  epaLeadSafe: string | null;
  /** Legal entity name, for structured data. */
  legalName: string;
  /** Counties served, used for copy and structured data. */
  counties: string[];
  /** Social profiles (absolute URLs) to list in structured data and the footer. */
  sameAs: string[];
};

export const business: BusinessConfig = {
  name: "V & A Flooring Inc",
  founded: 1999,
  founder: "Armond Markarian",
  ownership: "Family owned",
  serviceArea: "Los Angeles",
  brandLine: "Family Owned • Since 1999",

  legalName: "V & A Flooring Inc",
  phone: "(818) 843-4773",
  address: {
    streetAddress: "10945 Pendleton St",
    addressLocality: "Sun Valley",
    addressRegion: "CA",
    postalCode: "91352",
  },
  // Number confirmed against public CSLB records (V & A Flooring Inc, active). Supplied as #86699.
  license: { authority: "CSLB", number: "866991", classifications: ["B", "C-15", "C-54"] },
  bondedInsured: true,
  epaLeadSafe: "NAT-44728-4",
  counties: ["Los Angeles County", "Orange County", "Ventura County"],

  // Not yet supplied — hidden until provided.
  email: null,
  hours: null,
  sameAs: [],
};

export const facts = {
  installationCrews: "20+",
  installationCrewsLong: "More than 20 installation crews",
  lowesLine: "Serving Lowe’s installation customers for more than 20 years.",
  manufacturers: ["Mohawk", "Shaw", "Engineered Floors"],
  americanMadeLine: "American-made options from established flooring manufacturers.",
} as const;

export const licenseLine = (l: NonNullable<BusinessConfig["license"]>) =>
  `${l.authority} License #${l.number} (${l.classifications.join(", ")})`;

/** Plain-language region line. */
export const regionLine = "Los Angeles, Orange and Ventura counties";

/** Phone formatted for tel: links. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Google Maps search link for the business address, or null when no address is configured. */
export function mapsHref(): string | null {
  const a = business.address;
  if (!a) return null;
  const q = `${business.name}, ${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
