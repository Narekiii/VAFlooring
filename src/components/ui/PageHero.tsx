import type { ReactNode } from "react";
import type { SiteImage } from "@/content/images";
import { Container } from "./Container";
import { Figure } from "./Figure";
import styles from "./PageHero.module.css";

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
  image?: SiteImage;
  imageFocus?: string;
};

export function PageHero({ title, subtitle, children, actions, image, imageFocus }: Props) {
  return (
    <section className={`${styles.hero} ${image ? "" : styles.noImage}`} aria-labelledby="page-title">
      <Container>
        <div className={styles.grid}>
          <div className={styles.text}>
            <h1 id="page-title">{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {children && <div className={styles.intro}>{children}</div>}
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
          {image && (
            <Figure
              image={image}
              ratio="var(--page-hero-ratio)"
              sizes="(min-width: 64rem) 40rem, 100vw"
              priority
              focus={imageFocus}
              className={styles.figure}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
