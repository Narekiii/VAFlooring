import data from "./catalog.generated.json";

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
