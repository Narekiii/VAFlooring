import fs from "node:fs";
import path from "node:path";
import { interleave, type CatalogCategory, type CatalogItem } from "@/content/catalog";

/** Full catalog lists, read at build time for server-rendered pages (the browser fetches the same files). */
const cache = new Map<CatalogCategory, CatalogItem[]>();
export function categoryItems(c: CatalogCategory): CatalogItem[] {
  if (!cache.has(c)) {
    const file = path.join(process.cwd(), "public", "catalog", `${c}.json`);
    cache.set(c, JSON.parse(fs.readFileSync(file, "utf8")) as CatalogItem[]);
  }
  return cache.get(c)!;
}

export const brandItems = (slug: string, c: CatalogCategory) => categoryItems(c).filter((x) => x.b === slug);

/** The first page the catalog browser shows, rendered on the server so the floors are in the HTML. */
export const firstPage = (c: CatalogCategory, n = 36) => interleave(categoryItems(c)).slice(0, n);
