import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { InquiryCta } from "@/components/home/InquiryCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { brandHref, catalog, catalogCategories, placeOf } from "@/content/catalog";
import { routes } from "@/content/navigation";
import { images } from "@/content/images";
import { facts } from "@/content/site";
import { pageMetadata, siteUrl } from "@/lib/seo";
import styles from "@/components/catalog/Catalog.module.css";

const description = `Flooring brands at V & A Flooring in Sun Valley, Los Angeles: Mohawk, Shaw and Engineered Floors, plus ${catalog.brands.length} more hardwood, vinyl, laminate and tile manufacturers.`;

export const metadata = pageMetadata({
  title: "Flooring Brands & Manufacturers We Offer",
  description,
  path: routes.brands,
  image: images.showroomSelection,
});

const cats = (c: Partial<Record<string, number>>) =>
  catalogCategories
    .filter((x) => (c[x.key] ?? 0) > 0)
    .map((x) => x.label)
    .join(" · ");

export default function BrandsPage() {
  const base = siteUrl();
  const list = base && {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Flooring brands offered by V & A Flooring Inc",
    itemListElement: catalog.brands.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      url: `${base}${brandHref(b.slug)}`,
    })),
  };
  return (
    <>
      <JsonLd data={list} />
      <PageHero
        description={description}
        pageType="CollectionPage"
        kicker="Manufacturers"
        title="Flooring Brands We Offer"
        subtitle="Just some of the many flooring options available through our Sun Valley showroom."
        image={images.showroomSelection}
        crumbs={[
          { name: "Products", href: routes.products },
          { name: "Brands", href: routes.brands },
        ]}
        actions={
          <>
            <ButtonLink href={routes.catalog} variant="light">
              Browse all floors
            </ButtonLink>
            <ButtonLink href={routes.estimate} variant="outline-light">
              Ask About Materials
            </ButtonLink>
          </>
        }
      >
        <p>
          V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc supplies and installs flooring from national manufacturers and from
          Southern California flooring companies. Choose a brand to see its collections and floors, or ask us to
          compare options for your project.
        </p>
      </PageHero>

      <Section tone="white" labelledBy="major">
        <Container>
          <SectionHead id="major" kicker="National manufacturers" title="Mohawk, Shaw and Engineered Floors">
            <p>
              Hardwood, laminate, vinyl and carpet from these manufacturers are available through our showroom. Ask
              us for current collections and samples.
            </p>
          </SectionHead>
          <ul className={styles.brandList}>
            {facts.manufacturers.map((m) => (
              <li key={m} className={styles.brandCard} style={{ position: "static" }}>
                <h3>{m}</h3>
                <p className={styles.brandMeta}>Collections and samples on request</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="ivory" labelledBy="all-brands">
        <Container>
          <SectionHead id="all-brands" kicker={`${catalog.brands.length} more brands`} title="More manufacturers, by name">
            <p>{catalog.total.toLocaleString("en-US")} floors to browse online, with more in the showroom.</p>
          </SectionHead>
          <ul className={styles.brandList}>
            {catalog.brands.map((b) => (
              <li key={b.slug} className={styles.brandCard}>
                <h3>
                  <a href={brandHref(b.slug)}>{b.name}</a>
                </h3>
                <p className={styles.brandMeta}>
                  {b.count.toLocaleString("en-US")} {b.count === 1 ? "floor" : "floors"} · {placeOf(b)}
                </p>
                <p className={styles.brandCats}>{cats(b.categories)}</p>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            All brand names are trademarks of their respective owners. They are named here to identify products we
            offer and do not imply endorsement of V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc.
          </p>
        </Container>
      </Section>

      <InquiryCta
        title="Looking for a brand that isn’t listed?"
        body="We can source many other products. Send us the manufacturer and product name, or a photo of the look you like."
        ctaLabel="Ask About Materials"
      />
    </>
  );
}
