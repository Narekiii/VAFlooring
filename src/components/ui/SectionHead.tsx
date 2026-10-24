import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

/** Heading + optional intro for a content section. */
export function SectionHead({ id, title, children, align = "split" }: { id: string; title: string; children?: ReactNode; align?: "split" | "stack" }) {
  return (
    <div className={`${styles.head} ${align === "stack" ? styles.stack : ""}`}>
      <h2 id={id}>{title}</h2>
      {children && <div className={styles.intro}>{children}</div>}
    </div>
  );
}
