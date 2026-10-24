import styles from "./CredibilityStrip.module.css";

const items = [
  { big: "1999", small: "Family owned since" },
  { big: "20+", small: "Installation crews" },
  { big: "Supply + Install", small: "Materials and installation" },
  { big: "Homes to Hotels", small: "Residential and commercial" },
];

export function CredibilityStrip() {
  return (
    <section className={styles.strip} aria-label="At a glance">
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.big} className={styles.item}>
            <span className={styles.small}>{item.small}</span>
            <span className={styles.big}>{item.big}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
