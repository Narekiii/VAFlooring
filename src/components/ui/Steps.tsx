import styles from "./Steps.module.css";

/** Ordered process list. Use only for content that is a genuine sequence. */
export function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className={styles.steps}>
      {steps.map((s) => (
        <li key={s.title} className={styles.step}>
          <h3 className={styles.title}>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
