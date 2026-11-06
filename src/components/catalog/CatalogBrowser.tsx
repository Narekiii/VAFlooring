"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { catalogCategories, interleave, type CatalogCategory, type CatalogItem } from "@/content/catalog";
import { buttonClass } from "@/components/ui/Button";
import { ProductCard } from "./ProductCard";
import styles from "./Catalog.module.css";

type BrandOption = { slug: string; name: string; categories: Partial<Record<CatalogCategory, number>> };

const PAGE = 36;
const isCategory = (v: string | null): v is CatalogCategory => catalogCategories.some((c) => c.key === v);
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function CatalogBrowser({
  brands,
  counts,
  preview,
}: {
  brands: BrandOption[];
  counts: Record<CatalogCategory, number>;
  /** Server-rendered first page of the default view, shown until the full list loads. */
  preview?: CatalogItem[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const brandParam = params.get("brand") ?? "";
  const brandValid = brands.some((b) => b.slug === brandParam);
  const catParam = params.get("category");
  // A brand link without a category opens that brand's largest category.
  const fallbackCat = brandValid
    ? (Object.entries(brands.find((b) => b.slug === brandParam)!.categories).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0] as CatalogCategory)
    : "hardwood";
  const category: CatalogCategory = isCategory(catParam) ? catParam : fallbackCat;
  const brand = brandValid ? brandParam : "";

  const [items, setItems] = useState<Record<string, CatalogItem[]>>({});
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    if (items[category]) return;
    let live = true;
    setFailed(false);
    fetch(`/catalog/${category}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((list: CatalogItem[]) => live && setItems((m) => ({ ...m, [category]: list })))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [category, items]);

  useEffect(() => setShown(PAGE), [category, brand, query]);

  const names = useMemo(() => Object.fromEntries(brands.map((b) => [b.slug, b.name])), [brands]);
  const list = items[category];
  const mixed = useMemo(() => (list ? interleave(list) : []), [list]);
  const usePreview = !list && !brand && !query && category === "hardwood" && preview;
  const filtered = useMemo(() => {
    if (!list) return usePreview ? preview : [];
    const base = brand ? list : mixed;
    const words = norm(query).split(/\s+/).filter(Boolean);
    return base.filter((it) => {
      if (brand && it.b !== brand) return false;
      if (!words.length) return true;
      const hay = norm([names[it.b], it.col, it.t, it.sku, ...Object.values(it.s ?? {})].filter(Boolean).join(" "));
      return words.every((w) => hay.includes(w));
    });
  }, [list, mixed, brand, query, names, usePreview, preview]);

  const setParams = (next: { category?: CatalogCategory; brand?: string }) => {
    const q = new URLSearchParams();
    const c = next.category ?? category;
    const b = next.brand ?? brand;
    q.set("category", c);
    if (b && (brands.find((x) => x.slug === b)?.categories[c] ?? 0) > 0) q.set("brand", b);
    router.replace(`?${q.toString()}`, { scroll: false });
  };

  const brandsHere = brands.filter((b) => (b.categories[category] ?? 0) > 0);
  const label = catalogCategories.find((c) => c.key === category)!.label;

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.tabs} role="group" aria-label="Flooring type">
          {catalogCategories.map((c) => (
            <button
              key={c.key}
              type="button"
              className={styles.tab}
              aria-pressed={c.key === category}
              onClick={() => setParams({ category: c.key })}
            >
              {c.label} <span aria-hidden="true">({counts[c.key].toLocaleString("en-US")})</span>
              <span className="visually-hidden">, {counts[c.key]} floors</span>
            </button>
          ))}
        </div>
        <div className={styles.filters}>
          <label>
            Brand
            <select value={brand} onChange={(e) => setParams({ brand: e.target.value })}>
              <option value="">All brands ({brandsHere.length})</option>
              {brandsHere.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name} ({b.categories[category]})
                </option>
              ))}
            </select>
          </label>
          <label>
            Search {label.toLowerCase()}
            <input
              type="search"
              value={query}
              placeholder="Color, collection, species…"
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <p className={styles.count} aria-live="polite" style={{ alignSelf: "end" }}>
            {list || usePreview
              ? usePreview
                ? `${counts.hardwood.toLocaleString("en-US")} floors`
                : `${filtered.length.toLocaleString("en-US")} ${category === "carpet" ? (filtered.length === 1 ? "carpet style" : "carpet styles") : filtered.length === 1 ? "floor" : "floors"}${brand ? ` from ${names[brand]}` : ""}`
              : failed
                ? "The list couldn’t load. Please refresh the page."
                : "Loading…"}
          </p>
        </div>
      </div>

      {list && filtered.length === 0 && (
        <p>No floors match that search. Try a different word, or ask us: we can source products not listed here.</p>
      )}
      <ul className={styles.grid}>
        {filtered.slice(0, shown).map((it) => (
          <ProductCard key={it.id} item={it} brandName={names[it.b] ?? it.b} />
        ))}
      </ul>
      {(usePreview ? counts.hardwood : filtered.length) > shown && (
        <div className={styles.more}>
          <button type="button" className={buttonClass("secondary")} onClick={() => setShown((n) => n + PAGE)}>
            Show more ({((usePreview ? counts.hardwood : filtered.length) - shown).toLocaleString("en-US")} left)
          </button>
        </div>
      )}
    </div>
  );
}
