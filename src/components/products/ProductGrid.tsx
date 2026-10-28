import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { productHref, products } from "@/content/products";
import styles from "@/components/home/ServicesGrid.module.css";
import own from "./ProductGrid.module.css";

/** Cards linking to each product page. */
export function ProductGrid({ headingId, exclude }: { headingId: string; exclude?: string }) {
  return (
    <ul className={`${styles.grid} ${own.grid}`} aria-labelledby={headingId}>
      {products
        .filter((p) => p.slug !== exclude)
        .map((p) => (
          <li key={p.slug} className={styles.card}>
            <Figure image={p.showroomImage} ratio="4 / 3" sizes="(min-width: 75rem) 18rem, (min-width: 40rem) 50vw, 100vw" />
            <div className={styles.body}>
              <h3 className={styles.title}>
                <Link href={productHref(p)}>{p.name}</Link>
              </h3>
              <p className={styles.text}>{p.cardText}</p>
              <span className={styles.more} aria-hidden="true">
                Shop {p.material}
              </span>
            </div>
          </li>
        ))}
    </ul>
  );
}
