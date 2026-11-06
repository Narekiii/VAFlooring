import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { InquiryCta } from "@/components/home/InquiryCta";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FaqSection } from "@/components/home/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { brandHref, brandsFor, catalog, catalogCategories, catalogFaqs } from "@/content/catalog";
import { firstPage } from "@/lib/catalog-data";
import { siteUrl } from "@/lib/seo";
import { routes } from "@/content/navigation";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/catalog/Catalog.module.css";

const total = catalog.total.toLocaleString("en-US");
const description = `Browse ${total} hardwood, LVP, laminate, tile and carpet options from Mohawk, Shaw and ${catalog.brands.length - 2} more brands at our Sun Valley, LA flooring store.`;

export const metadata = pageMetadata({
  title: "Browse Floors & Carpet: Mohawk, Shaw & More",
  description,
  path: routes.catalog,
});

export default function CatalogPage() {
  const preview = firstPage("hardwood");
  const names = Object.fromEntries(catalog.brands.map((b) => [b.slug, b.name]));
  const base = siteUrl();
  const list = base && {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Flooring by type at V & A Flooring Inc",
    itemListElement: catalogCategories.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.label} flooring (${catalog.byCategory[c.key]} ${c.key === "carpet" ? "styles" : "floors"})`,
      url: `${base}/products/${c.productSlug}`,
    })),
  };
  const browserProps = {
    brands: catalog.brands.map(({ slug, name, categories }) => ({ slug, name, categories })),
    counts: catalog.byCategory,
  };
  return (
    <>
      <JsonLd data={list} />
      <PageHero
        description={description}
        pageType="CollectionPage"
        kicker="Product catalog"
        title="Browse Our Floors"
        subtitle={`${total} floors and carpet styles from ${catalog.brands.length} manufacturers, including Mohawk Flooring and Shaw Floors.`}
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
          {/* The server renders the first page of floors (also the no-JavaScript view); the browser takes over on load. */}
          <Suspense
            fallback={
              <ul className={styles.grid}>
                {preview.map((it) => (
                  <ProductCard key={it.id} item={it} brandName={names[it.b] ?? it.b} />
                ))}
              </ul>
            }
          >
            <CatalogBrowser {...browserProps} preview={preview} />
          </Suspense>
          <p className={styles.note}>
            Product names, photos and specifications come from each manufacturer’s published information and can
            change. Availability, colors and pricing are confirmed by V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc at the time
            of your order. Brand names are trademarks of their respective owners and do not imply endorsement.{" "}
            <TextLink href={routes.brands}>About the brands</TextLink>
          </p>
        </Container>
      </Section>

      <Section tone="white" labelledBy="by-brand">
        <Container>
          <h2 id="by-brand">Shop flooring by type and brand</h2>
          <div className={styles.directory}>
            {catalogCategories.map((c) => (
              <div key={c.key}>
                <h3>
                  <Link href={`/products/${c.productSlug}`}>{c.label} flooring</Link>
                </h3>
                <p className={styles.brandMeta}>
                  {catalog.byCategory[c.key].toLocaleString("en-US")} {c.key === "carpet" ? "styles" : "floors"}
                </p>
                <ul>
                  {brandsFor(c.key).map((b) => (
                    <li key={b.slug}>
                      <Link href={brandHref(b.slug)}>{b.name}</Link> <span>({b.categories[c.key]})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <FaqSection faqs={catalogFaqs()} tone="ivory" title="About our flooring catalog" intro="How to use the catalog and what happens when you ask about a floor." />

      <InquiryCta
        title="Don’t see the floor you want?"
        body="This isn’t everything we can source. Tell us the product, color or look you have in mind, and we’ll find it or suggest close options."
        ctaLabel="Ask About Materials"
      />
    </>
  );
}
