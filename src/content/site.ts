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

/** One opening-hours rule, e.g. Monday–Friday 08:00–16:00 (24-hour times). */
export type OpeningHours = {
  days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  opens: string;
  closes: string;
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
  /** Public showroom/office hours. Days not listed are shown as closed. */
  hours: OpeningHours[] | null;
  /** Map coordinates of the showroom (used for structured data and the contact-page map). */
  geo: { latitude: number; longitude: number } | null;
  /** Google Business Profile place ID, used for map and directions links. */
  googlePlaceId: string | null;
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
  sameAs: [],

  // From the public Google Business Profile listing for 10945 Pendleton St (October 2026).
  // Confirm with the business; see HANDOFF.md.
  hours: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "16:00" }],
  geo: { latitude: 34.242073, longitude: -118.370575 },
  googlePlaceId: "ChIJy9ruT1-VwoARipH8HrbyqWM",
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

/** Date the site content was last reviewed (used for sitemap lastmod and llms.txt). */
export const contentUpdated = "2026-10-26";

/** Single-line address, e.g. "10945 Pendleton St, Sun Valley, CA 91352". */
export function addressLine(): string | null {
  const a = business.address;
  return a ? `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}` : null;
}

const mapsQuery = () => {
  const line = addressLine();
  return line ? encodeURIComponent(`${business.name}, ${line}`) : null;
};

/** Google Maps link to the business listing, or null when no address is configured. */
export function mapsHref(): string | null {
  const q = mapsQuery();
  if (!q) return null;
  const id = business.googlePlaceId ? `&query_place_id=${business.googlePlaceId}` : "";
  return `https://www.google.com/maps/search/?api=1&query=${q}${id}`;
}

/** Google Maps driving directions to the showroom. */
export function directionsHref(): string | null {
  const q = mapsQuery();
  if (!q) return null;
  const id = business.googlePlaceId ? `&destination_place_id=${business.googlePlaceId}` : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${q}${id}`;
}

/** Keyless Google Maps embed URL for the showroom location. */
export function mapEmbedSrc(): string | null {
  const q = mapsQuery();
  return q ? `https://maps.google.com/maps?q=${q}&z=15&output=embed` : null;
}

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const short: Record<string, string> = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun" };

function time12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

function dayRange(days: string[], abbreviate: boolean): string {
  const name = (d: string) => (abbreviate ? short[d] : d);
  const idx = days.map((d) => dayOrder.indexOf(d as (typeof dayOrder)[number])).sort((a, b) => a - b);
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (idx.length > 2 && contiguous) return `${name(dayOrder[idx[0]])}–${name(dayOrder[idx[idx.length - 1]])}`;
  return idx.map((i) => name(dayOrder[i])).join(", ");
}

/** Human-readable hours, including closed days, e.g. ["Monday–Friday: 8:00 AM–4:00 PM", "Saturday–Sunday: Closed"]. */
export function hoursLines(abbreviate = false): string[] {
  const h = business.hours;
  if (!h || h.length === 0) return [];
  const lines = h.map((r) => `${dayRange(r.days, abbreviate)}: ${time12(r.opens)}–${time12(r.closes)}`);
  const open = new Set(h.flatMap((r) => r.days));
  const closed = dayOrder.filter((d) => !open.has(d));
  if (closed.length) lines.push(`${closed.length === 2 && closed[0] === "Saturday" && closed[1] === "Sunday" ? `${abbreviate ? "Sat" : "Saturday"}–${abbreviate ? "Sun" : "Sunday"}` : dayRange(closed, abbreviate)}: Closed`);
  return lines;
}
