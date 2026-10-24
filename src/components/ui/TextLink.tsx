import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./TextLink.module.css";

/** Understated text link with a drawn underline, used for "learn more" style navigation. */
export function TextLink({ href, children, tone = "dark" }: { href: string; children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <Link href={href} className={`${styles.link} ${tone === "light" ? styles.light : ""}`}>
      {children}
    </Link>
  );
}
