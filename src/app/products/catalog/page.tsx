import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { InquiryCta } from "@/components/home/InquiryCta";
import { catalog } from "@/content/catalog";
import { routes } from "@/content/navigation";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/catalog/Catalog.module.css";

const total = catalog.total.toLocaleString("en-US");
const description = `Browse ${total} hardwood, vinyl, laminate and tile floors from ${catalog.brands.length} manufacturers we offer, then ask V & A Flooring about availability, samples and installation in Los Angeles.`;

export const metadata = pageMetadata({
  title: "Browse Flooring: Hardwood, Vinyl, Laminate & Tile",
  description,
  path: routes.catalog,
});

export default function CatalogPage() {
  return (
    <>
      <PageHero
        description={description}
        pageType="CollectionPage"
        kicker="Product catalog"
        title="Browse Our Floors"
        subtitle={`${total} floors from ${catalog.brands.length} manufacturers, in addition to Mohawk, Shaw and Engineered Floors.`}
        crumbs={[
          { name: "Products", href: routes.products },
          { name: "Browse floors", href: routes.catalog },
        ]}
        actions={
          <>
            <ButtonLink href={routes.brands} variant="light">
              See all brands
            </ButtonLink>
            <ButtonLink href={routes.contact} variant="outline-light">
              Visit the showroom
            </ButtonLink>
          </>
        }
      >
        <p>
          These are some of the floors we can supply and install. Pick a type, narrow it by brand or search for a
          color, then ask us about any floor: we’ll confirm current availability and pricing, arrange samples and
          include it in your estimate.
        </p>
      </PageHero>

      <Section tone="ivory" labelledBy="browse">
        <Container>
          <h2 id="browse" className="visually-hidden">
            Floors
          </h2>
          <Suspense fallback={<p>Loading…</p>}>
            <CatalogBrowser
              brands={catalog.brands.map(({ slug, name, categories }) => ({ slug, name, categories }))}
              counts={catalog.byCategory}
            />
          </Suspense>
          <p className={styles.note}>
            Product names, photos and specifications come from each manufacturer’s published information and can
            change. Availability, colors and pricing are confirmed by V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc at the time
            of your order. Brand names are trademarks of their respective owners and do not imply endorsement.{" "}
            <TextLink href={routes.brands}>About the brands</TextLink>
          </p>
        </Container>
      </Section>

      <InquiryCta
        title="Don’t see the floor you want?"
        body="This isn’t everything we can source. Tell us the product, color or look you have in mind, and we’ll find it or suggest close options."
        ctaLabel="Ask About Materials"
      />
    </>
  );
}
