import data from "./catalog.generated.json";
import type { Faq } from "./services";

/**
 * Product catalog generated from V & A Flooring's supplied product data (November 2026) by
 * scripts/catalog/transform.py. Only records from each brand's own catalog are included (no
 * third-party resale listings), without prices or stock. Product images are the manufacturers'
 * own images, loaded from their servers.
 *
 * The full lists live in public/catalog/<category>.json and are loaded by the catalog browser;
 * this file holds brand summaries and a few featured items per brand for server-rendered pages.
 */

export type CatalogCategory = "hardwood" | "laminate" | "vinyl" | "tile";

export type CatalogItem = {
  id: string;
  /** Brand slug. */
  b: string;
  c: CatalogCategory;
  /** Product / color name. */
  t: string;
  /** Manufacturer image; missing when the supplied photo was not specific to this floor. */
  img?: string;
  /** Collection. */
  col?: string;
  sku?: string;
  /** Specifications as published by the manufacturer. */
  s?: Record<string, string>;
};

export type CatalogBrand = {
  slug: string;
  name: string;
  city: string;
  distributor: string | null;
  count: number;
  categories: Partial<Record<CatalogCategory, number>>;
  collections: string[];
  featured: CatalogItem[];
};

export const catalog = data as unknown as {
  asOf: string;
  total: number;
  byCategory: Record<CatalogCategory, number>;
  brands: CatalogBrand[];
};

export const catalogCategories: { key: CatalogCategory; label: string; productSlug: string }[] = [
  { key: "hardwood", label: "Hardwood", productSlug: "hardwood-flooring" },
  { key: "vinyl", label: "Vinyl & LVP", productSlug: "vinyl-lvp-flooring" },
  { key: "laminate", label: "Laminate", productSlug: "laminate-flooring" },
  { key: "tile", label: "Tile", productSlug: "tile" },
];
export const categoryLabel = (c: CatalogCategory) => catalogCategories.find((x) => x.key === c)?.label ?? c;

export const catalogHref = (opts: { category?: CatalogCategory; brand?: string } = {}) => {
  const q = new URLSearchParams();
  if (opts.category) q.set("category", opts.category);
  if (opts.brand) q.set("brand", opts.brand);
  const s = q.toString();
  return `/products/catalog${s ? `?${s}` : ""}`;
};
export const brandHref = (slug: string) => `/products/brands/${slug}`;
export const getBrand = (slug: string) => catalog.brands.find((b) => b.slug === slug);
export const brandsFor = (c: CatalogCategory) =>
  catalog.brands.filter((b) => (b.categories[c] ?? 0) > 0).sort((a, b) => (b.categories[c] ?? 0) - (a.categories[c] ?? 0));

/** Text for the estimate form when a customer asks about a specific floor. */
export const inquiryText = (item: CatalogItem, brandName: string) =>
  [brandName, item.col, item.t, item.sku ? `(${item.sku})` : ""].filter(Boolean).join(" – ");

/** Short spec line for cards: width · thickness · wear layer. */
export const specLine = (s?: Record<string, string>) =>
  s ? ["Width", "Thickness", "Wear layer", "Species"].map((k) => s[k]).filter(Boolean).slice(0, 3).join(" · ") : "";

/** "Pacoima, CA"; regions are shown as given. */
export const placeOf = (b: CatalogBrand) => (/california/i.test(b.city) ? b.city : `${b.city}, CA`);

/** Mix brands (one from each in turn) so a combined list doesn't open on a single manufacturer; floors with photos first. */
export function interleave(list: CatalogItem[]) {
  const groups = new Map<string, CatalogItem[]>();
  for (const it of list) groups.set(it.b, [...(groups.get(it.b) ?? []), it]);
  const queues = [...groups.values()];
  const out: CatalogItem[] = [];
  for (let i = 0; out.length < list.length; i++) for (const q of queues) if (q[i]) out.push(q[i]);
  return [...out.filter((x) => x.img), ...out.filter((x) => !x.img)];
}

/** "hardwood, vinyl & LVP and tile" */
export const typeList = (b: CatalogBrand) => {
  const t = catalogCategories.filter((c) => (b.categories[c.key] ?? 0) > 0).map((c) => (c.key === "vinyl" ? "vinyl & LVP" : c.label.toLowerCase()));
  return t.length > 1 ? `${t.slice(0, -1).join(", ")} and ${t.at(-1)}` : t[0] ?? "";
};

/** All brand names, national manufacturers first. */
export const allBrandNames = (national: string[]) => [...national, ...catalog.brands.map((b) => b.name)];

const fmt = (n: number) => n.toLocaleString("en-US");

/** Q&A for the catalog page (also published as FAQPage data and in llms-full.txt). */
export const catalogFaqs = (): Faq[] => [
  {
    q: "How many flooring products can I browse on your website?",
    a: `Our online catalog lists ${fmt(catalog.total)} floors: ${fmt(catalog.byCategory.hardwood)} hardwood, ${fmt(catalog.byCategory.vinyl)} vinyl and LVP, ${fmt(catalog.byCategory.laminate)} laminate and ${fmt(catalog.byCategory.tile)} tile, from ${catalog.brands.length} manufacturers. Mohawk, Shaw and Engineered Floors products are available through our showroom in addition to these.`,
  },
  {
    q: "Are the floors in the catalog in stock?",
    a: "The catalog shows floors we can supply, using each manufacturer’s published names, photos and specifications. We confirm current availability, colors and pricing when you ask about a floor, before you order.",
  },
  {
    q: "Can you install the floors in the catalog?",
    a: "Yes. V & A Flooring Inc is a licensed California flooring contractor (CSLB #866991) with its own installation crews, and we install the floors we sell across Los Angeles, Orange and Ventura counties.",
  },
  {
    q: "How do I get samples or a price for a floor I found online?",
    a: "Select “Ask about this floor” on any product. The estimate form opens with the floor already filled in. Tell us the rooms and approximate size, and we’ll follow up about samples, pricing and installation. You can also visit our Sun Valley showroom.",
  },
];

/** Q&A for a brand page. */
export const brandFaqs = (b: CatalogBrand): Faq[] => [
  {
    q: `Does V & A Flooring sell ${b.name} flooring?`,
    a: `Yes. We supply ${b.name} ${typeList(b)} flooring from our showroom and warehouse in Sun Valley, Los Angeles. Our online catalog lists ${fmt(b.count)} ${b.name} ${b.count === 1 ? "floor" : "floors"}${b.collections.length ? `, including the ${b.collections.slice(0, 3).join(", ")} collections` : ""}.`,
  },
  {
    q: `Can you install ${b.name} floors?`,
    a: `Yes. Our own crews install ${b.name} floors for homes, ADUs, multifamily, hotel and commercial projects across Los Angeles, Orange and Ventura counties, following the manufacturer’s installation requirements.`,
  },
  {
    q: `Where is ${b.name} based?`,
    a: `${b.name} is based in ${placeOf(b)}${b.distributor ? ` and is distributed by ${b.distributor}` : ""}. Ask us to confirm current colors, availability and pricing for any ${b.name} product.`,
  },
];
