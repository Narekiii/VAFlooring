import type { ReactNode } from "react";
import styles from "./Section.module.css";

type Tone = "ivory" | "white" | "sand" | "navy";

type Props = {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  labelledBy?: string;
  className?: string;
  compact?: boolean;
};

export function Section({ children, tone = "ivory", id, labelledBy, className, compact = false }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-surface={tone === "navy" ? "dark" : undefined}
      className={[styles.section, styles[tone], compact ? styles.compact : "", className].filter(Boolean).join(" ")}
    >
      {children}
    </section>
  );
}
