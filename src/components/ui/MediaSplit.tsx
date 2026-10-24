import type { ReactNode } from "react";
import type { SiteImage } from "@/content/images";
import { Figure } from "./Figure";
import styles from "./MediaSplit.module.css";

/** Image beside a block of text. */
export function MediaSplit({
  image,
  children,
  reverse = false,
  ratio = "4 / 3",
}: {
  image: SiteImage;
  children: ReactNode;
  reverse?: boolean;
  ratio?: string;
}) {
  return (
    <div className={`${styles.split} ${reverse ? styles.reverse : ""}`}>
      <Figure image={image} ratio={ratio} sizes="(min-width: 64rem) 38rem, 100vw" className={styles.figure} />
      <div className={styles.text}>{children}</div>
    </div>
  );
}
