import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

/** Heading + optional kicker and intro for a content section. */
export function SectionHead({
  id,
  title,
  kicker,
  children,
  align = "split",
}: {
  id: string;
  title: string;
  kicker?: string;
  children?: ReactNode;
  align?: "split" | "stack";
}) {
  return (
    <div className={`${styles.head} ${align === "stack" ? styles.stack : ""}`}>
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 id={id}>{title}</h2>
      </div>
      {children && <div className={styles.intro}>{children}</div>}
    </div>
  );
}
