import styles from "./CredibilityStrip.module.css";

const items = ["Family Owned Since 1999", "20+ Installation Crews", "Materials & Installation", "Residential & Commercial"];

export function CredibilityStrip() {
  return (
    <section className={styles.strip} aria-label="At a glance" data-surface="dark">
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
