import Link from "next/link";
import type { ReactNode } from "react";
import type { SiteImage } from "@/content/images";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/structured-data";
import { Container } from "./Container";
import { Figure } from "./Figure";
import styles from "./PageHero.module.css";

type Props = {
  title: string;
  subtitle?: string;
  kicker?: string;
  children?: ReactNode;
  actions?: ReactNode;
  image?: SiteImage;
  imageFocus?: string;
  /** Trail after "Home", ending with the current page. */
  crumbs?: Crumb[];
};

export function PageHero({ title, subtitle, kicker, children, actions, image, imageFocus, crumbs }: Props) {
  const trail: Crumb[] | null = crumbs ? [{ name: "Home", href: "/" }, ...crumbs] : null;
  return (
    <section className={`${styles.hero} ${image ? "" : styles.noImage}`} aria-labelledby="page-title" data-surface="dark">
      <Container>
        {trail && (
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <ol>
              {trail.map((c, i) => (
                <li key={c.href}>
                  {i < trail.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className={styles.grid}>
          <div className={styles.text}>
            {kicker && <p className="kicker">{kicker}</p>}
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
      {trail && <JsonLd data={breadcrumbJsonLd(trail)} />}
    </section>
  );
}
