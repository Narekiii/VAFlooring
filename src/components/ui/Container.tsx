import type { ReactNode } from "react";
import styles from "./Container.module.css";

export function Container({ children, className, wide = false }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <div className={[styles.container, wide ? styles.wide : "", className].filter(Boolean).join(" ")}>{children}</div>;
}
