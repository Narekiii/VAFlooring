import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "light" | "outline-light";

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

export function ButtonLink({ href, variant = "primary", children, className, ...rest }: Props) {
  return (
    <Link href={href} className={[styles.button, styles[variant], className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Link>
  );
}

export function buttonClass(variant: Variant = "primary") {
  return `${styles.button} ${styles[variant]}`;
}
