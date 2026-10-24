import { selectionFactors } from "@/content/materials";
import styles from "./SelectionGuide.module.css";

/** Expandable list of selection factors built on native <details> for keyboard and screen-reader support. */
export function SelectionGuide() {
  return (
    <div className={styles.guide}>
      {selectionFactors.map((f, i) => (
        <details key={f.title} className={styles.item} open={i === 0}>
          <summary className={styles.summary}>
            <span className={styles.title}>{f.title}</span>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <div className={styles.body}>
            <p>{f.body}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
