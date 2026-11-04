"use client";

import Link from "next/link";
import { useState } from "react";
import { categoryLabel, inquiryText, specLine, type CatalogItem } from "@/content/catalog";
import { routes } from "@/content/navigation";
import styles from "./Catalog.module.css";

/** One floor from the catalog. Images load from the manufacturer; a neutral tile replaces any that fail. */
export function ProductCard({ item, brandName, headingLevel = 3 }: { item: CatalogItem; brandName: string; headingLevel?: 2 | 3 }) {
  const [broken, setBroken] = useState(false);
  const H = headingLevel === 2 ? "h2" : "h3";
  const spec = specLine(item.s);
  const ask = `${routes.estimate}?product=${encodeURIComponent(inquiryText(item, brandName))}`;
  return (
    <li className={styles.card}>
      <div className={styles.media}>
        {broken || !item.img ? (
          <span className={styles.noImg}>
            <span aria-hidden="true">{categoryLabel(item.c)}</span>
            <span className={styles.noImgNote}>Photo on request</span>
          </span>
        ) : (
          // Manufacturer-hosted images: plain <img> so no third-party domains need allow-listing.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.img}
            alt={`${brandName} ${item.col ? `${item.col} ` : ""}${item.t} ${categoryLabel(item.c).toLowerCase()} flooring`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setBroken(true)}
          />
        )}
      </div>
      <div className={styles.body}>
        <p className={styles.brand}>
          {brandName}
          {item.col ? ` · ${item.col}` : ""}
        </p>
        <H className={styles.title}>{item.t}</H>
        {spec && <p className={styles.spec}>{spec}</p>}
        <Link href={ask} className={styles.ask}>
          Ask about this floor<span className="visually-hidden">: {item.t}</span>
        </Link>
      </div>
    </li>
  );
}
