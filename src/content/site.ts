/**
 * Central business configuration.
 *
 * Only verified details belong here. Fields set to `null` are hidden everywhere on the
 * public site (header, footer, contact page, structured data) until they are filled in.
 * See HANDOFF.md for the list of details still needed from V & A Flooring.
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
  /** Contractor license or other credentials, only when verified and approved for publication. */
  license: string | null;
  /** Social profiles (absolute URLs) to list in structured data and the footer. */
  sameAs: string[];
};

export const business: BusinessConfig = {
  name: "V & A Flooring",
  founded: 1999,
  founder: "Armond Markarian",
  ownership: "Family owned",
  serviceArea: "Los Angeles",
  brandLine: "Family Owned • Since 1999",

  // Not yet supplied — hidden until provided.
  phone: null,
  email: null,
  address: null,
  hours: null,
  license: null,
  sameAs: [],
};

export const facts = {
  installationCrews: "20+",
  installationCrewsLong: "More than 20 installation crews",
  lowesLine: "Serving Lowe’s installation customers for more than 20 years.",
  manufacturers: ["Mohawk", "Shaw", "Engineered Floors"],
  americanMadeLine: "American-made options from established flooring manufacturers.",
} as const;

/** Phone formatted for tel: links. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
