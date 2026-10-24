import styles from "./FeatureList.module.css";

type Item = { title: string; body: string };

/** Unordered set of short titled statements laid out in columns. */
export function FeatureList({ items, columns = 3, tone = "light" }: { items: Item[]; columns?: 2 | 3; tone?: "light" | "dark" }) {
  return (
    <ul className={`${styles.list} ${columns === 2 ? styles.two : ""} ${tone === "dark" ? styles.dark : ""}`}>
      {items.map((i) => (
        <li key={i.title} className={styles.item}>
          <h3 className={styles.title}>{i.title}</h3>
          <p>{i.body}</p>
        </li>
      ))}
    </ul>
  );
}
