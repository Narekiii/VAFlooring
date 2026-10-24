import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { images, type SiteImage } from "@/content/images";
import { routes } from "@/content/navigation";
import { publishedServices, serviceHref } from "@/content/services";
import styles from "./ServicesGrid.module.css";

type Card = { title: string; text: string; href: string; image: SiteImage; cta: string };

export function servicesCards(): Card[] {
  return [
    ...publishedServices.map((s) => ({
      title: s.name,
      text: s.cardText,
      href: serviceHref(s),
      image: s.image,
      cta: `${s.shortName} details`,
    })),
    {
      title: "Residential Flooring",
      text: "Home renovations, single rooms and ADUs, planned around the people who live there.",
      href: routes.residential,
      image: images.aduDining,
      cta: "Residential flooring",
    },
    {
      title: "Commercial & Multifamily",
      text: "Apartment communities, hotels and commercial projects with 20+ installation crews.",
      href: routes.commercial,
      image: images.corridor,
      cta: "Commercial flooring",
    },
  ];
}

export function ServicesGrid({
  headingId = "services-title",
  exclude,
  only,
}: {
  headingId?: string;
  exclude?: string;
  only?: string[];
}) {
  const cards = servicesCards().filter((c) => c.href !== exclude && (!only || only.includes(c.href)));
  return (
    <ul className={styles.grid} aria-labelledby={headingId}>
      {cards.map((c) => (
        <li key={c.href} className={styles.card}>
          <Figure image={c.image} ratio="4 / 3" sizes="(min-width: 75rem) 18rem, (min-width: 40rem) 50vw, 100vw" />
          <div className={styles.body}>
            <h3 className={styles.title}>
              <Link href={c.href}>{c.title}</Link>
            </h3>
            <p className={styles.text}>{c.text}</p>
            <span className={styles.more} aria-hidden="true">
              {c.cta}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
