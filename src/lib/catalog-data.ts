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

/** Distinct spec values across a brand's floors of one type, most common first. */
export function specSummary(items: CatalogItem[], keys: string[], max = 6) {
  return keys
    .map((k) => {
      const n = new Map<string, number>();
      for (const it of items) {
        let v = it.s?.[k];
        if (!v || /^\d+x\d+$/i.test(v) || v.length > 34 || /^(multiple|various|assorted|see )/i.test(v)) continue;
        if (k === "Width" && parseFloat(v) > 60 && /"$/.test(v)) continue; // roll widths in inches (sheet vinyl)
        v = v.replace(/\b(spc|wpc|lvt|lvp|uv)\b/gi, (m) => m.toUpperCase());
        n.set(v, (n.get(v) ?? 0) + 1);
      }
      const vals = [...n.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v);
      return { key: k, values: vals.slice(0, max), more: Math.max(0, vals.length - max) };
    })
    .filter((r) => r.values.length > 0);
}

export const brandItems = (slug: string, c: CatalogCategory) => categoryItems(c).filter((x) => x.b === slug);

/** The first page the catalog browser shows, rendered on the server so the floors are in the HTML. */
export const firstPage = (c: CatalogCategory, n = 36) => interleave(categoryItems(c)).slice(0, n);
