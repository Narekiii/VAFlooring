import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { routes } from "@/content/navigation";
import { productHref, products } from "@/content/products";
import { getService, serviceHref } from "@/content/services";
import styles from "./HomeSections.module.css";

/** 4 · What we do: each floor type links to its product page and its installation page. */
export function HomeWhatWeDo() {
  return (
    <Section tone="white" labelledBy="what-title">
      <Container>
        <SectionHead id="what-title" kicker="What we do" title="Flooring products and installation in Los Angeles">
          <p>
            We sell and install five types of flooring. Explore the products to compare types and brands, or the
            installation pages to see how we plan and install each floor.
          </p>
        </SectionHead>
        <ul className={styles.what}>
          {products.map((p) => {
            const install = getService(p.installSlug);
            return (
              <li key={p.slug} className={styles.whatCard}>
                <Figure image={p.showroomImage} ratio="4 / 3" sizes="(min-width: 75rem) 15rem, (min-width: 40rem) 50vw, 100vw" />
                <div className={styles.whatBody}>
                  <h3>{p.name}</h3>
                  <p>{p.cardText}</p>
                  <ul className={styles.whatLinks}>
                    <li>
                      <Link href={productHref(p)}>
                        Products<span className="visually-hidden">: {p.name}</span>
                      </Link>
                    </li>
                    {install && (
                      <li>
                        <Link href={serviceHref(install)}>
                          Installation<span className="visually-hidden">: {install.name}</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
        <div className={styles.audiences}>
          <Link href={routes.residential} className={styles.audience}>
            <span className={styles.audienceKicker}>Residential</span>
            <span className={styles.audienceTitle}>Homes, single rooms and ADUs</span>
          </Link>
          <Link href={routes.commercial} className={styles.audience}>
            <span className={styles.audienceKicker}>Commercial &amp; multifamily</span>
            <span className={styles.audienceTitle}>Apartments, hotels and commercial interiors</span>
          </Link>
          <Link href={routes.serviceAreas} className={styles.audience}>
            <span className={styles.audienceKicker}>Service areas</span>
            <span className={styles.audienceTitle}>Los Angeles, Orange and Ventura counties</span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
