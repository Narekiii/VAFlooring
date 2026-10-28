import type { Comparison } from "@/content/products";
import styles from "./Detail.module.css";

/** Accessible comparison table (scrolls horizontally on small screens). */
export function ComparisonTable({ comparison: c }: { comparison: Comparison }) {
  return (
    <div className={styles.tableWrap} role="region" aria-label={`${c.caption} table`} tabIndex={0}>
      <table className={styles.table}>
        <caption className="visually-hidden">{c.caption}</caption>
        <thead>
          <tr>
            {c.columns.map((col, i) => (
              <th key={i} scope="col">
                {col || <span className="visually-hidden">Feature</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {c.rows.map((r) => (
            <tr key={r[0]}>
              <th scope="row">{r[0]}</th>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
