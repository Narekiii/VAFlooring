import { Figure } from "@/components/ui/Figure";
import { propertyTypes } from "@/content/projects";
import styles from "./PropertyTypeGrid.module.css";

/** Image-led overview of the property types V & A Flooring Inc works in (illustrative imagery). */
export function PropertyTypeGrid({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className={styles.grid}>
      {propertyTypes.map((t, i) => (
        <li key={t.category} className={styles.item}>
          <Figure
            image={t.image}
            ratio={i === 0 ? "var(--lead-ratio)" : "4 / 3"}
            sizes={i === 0 ? "(min-width: 64rem) 30rem, 100vw" : "(min-width: 64rem) 22rem, (min-width: 40rem) 50vw, 100vw"}
            className={styles.figure}
          />
          <H className={styles.title}>{t.title}</H>
          <p className={styles.text}>{t.text}</p>
        </li>
      ))}
    </ul>
  );
}
