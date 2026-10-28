import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import styles from "./Detail.module.css";

/** "At a glance" fact list: short, extractable facts for readers and answer engines. */
export function Glance({ items, title = "At a glance" }: { items: [string, ReactNode][]; title?: string }) {
  return (
    <section className={styles.glance} aria-labelledby="glance-title">
      <Container>
        <h2 id="glance-title" className={styles.glanceTitle}>
          {title}
        </h2>
        <dl className={styles.glanceList}>
          {items.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
