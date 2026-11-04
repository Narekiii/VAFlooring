import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { InquiryCta } from "@/components/home/InquiryCta";
import { ProductCard } from "@/components/catalog/ProductCard";
import {
  brandHref,
  catalog,
  catalogCategories,
  catalogHref,
  getBrand,
  placeOf,
  type CatalogBrand,
} from "@/content/catalog";
import { routes } from "@/content/navigation";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/catalog/Catalog.module.css";

export const dynamicParams = false;
export const generateStaticParams = () => catalog.brands.map((b) => ({ brand: b.slug }));

type Params = { params: Promise<{ brand: string }> };

const catList = (b: CatalogBrand) =>
  catalogCategories.filter((c) => (b.categories[c.key] ?? 0) > 0);
const describe = (b: CatalogBrand) => {
  const types = catList(b).map((c) => c.label.toLowerCase());
  const t = types.length > 1 ? `${types.slice(0, -1).join(", ")} and ${types.at(-1)}` : types[0];
  return `${b.name} ${t} flooring at V & A Flooring in Sun Valley, Los Angeles. Browse ${b.count} ${b.count === 1 ? "floor" : "floors"}, then ask us about availability, samples and installation.`;
};

const titleOf = (b: CatalogBrand) => (/floor(s|ing)?$/i.test(b.name) ? b.name : `${b.name} Flooring`);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const b = getBrand((await params).brand);
  if (!b) return {};
  return pageMetadata({ title: `${titleOf(b)} in Los Angeles`, description: describe(b), path: brandHref(b.slug) });
}

export default async function BrandPage({ params }: Params) {
  const b = getBrand((await params).brand);
  if (!b) notFound();
  const cats = catList(b);
  const others = catalog.brands.filter((x) => x.slug !== b.slug && cats.some((c) => (x.categories[c.key] ?? 0) > 0));
  return (
    <>
      <PageHero
        description={describe(b)}
        pageType="CollectionPage"
        kicker={`Brand · ${placeOf(b)}`}
        title={titleOf(b)}
        subtitle={`${cats.map((c) => c.label).join(" · ")}, available through V & A Flooring Inc.`}
        crumbs={[
          { name: "Products", href: routes.products },
          { name: "Brands", href: routes.brands },
          { name: b.name, href: brandHref(b.slug) },
        ]}
        actions={
          <>
            <ButtonLink href={catalogHref({ brand: b.slug })} variant="light">
              Browse all {b.count} {b.count === 1 ? "floor" : "floors"}
            </ButtonLink>
            <ButtonLink href={`${routes.estimate}?product=${encodeURIComponent(b.name)}`} variant="outline-light">
              Ask about {b.name}
            </ButtonLink>
          </>
        }
      >
        <p>
          {b.name} is a flooring manufacturer based in {placeOf(b)}
          {b.distributor ? `, distributed by ${b.distributor}` : ""}. We can supply its floors and install them with
          our own crews across Los Angeles, Orange and Ventura counties. Ask us to confirm current colors and
          availability, or to bring samples to compare in your space.
        </p>
      </PageHero>

      <Section tone="navy" compact labelledBy="glance">
        <Container>
          <h2 id="glance" className="visually-hidden">
            {b.name} at a glance
          </h2>
          <div className={styles.featured} style={{ marginBottom: 0 }}>
            <div>
              <p>Floors listed</p>
              <strong>{b.count.toLocaleString("en-US")}</strong>
            </div>
            <div>
              <p>Flooring types</p>
              <strong>{cats.map((c) => c.label).join(", ")}</strong>
            </div>
            <div>
              <p>Collections</p>
              <strong>{b.collections.length ? b.collections.length : "Ask us"}</strong>
            </div>
          </div>
        </Container>
      </Section>

      {b.featured.length > 0 && (
        <Section tone="ivory" labelledBy="featured">
          <Container>
            <SectionHead id="featured" kicker="A selection" title={`Floors from ${b.name}`}>
              <p>A few examples from the range. Browse the full list by flooring type.</p>
            </SectionHead>
            <ul className={styles.grid}>
              {b.featured.map((it) => (
                <ProductCard key={it.id} item={it} brandName={b.name} />
              ))}
            </ul>
            <div className={styles.more} style={{ flexWrap: "wrap", gap: "var(--space-4)" }}>
              {cats.map((c) => (
                <ButtonLink key={c.key} href={catalogHref({ category: c.key, brand: b.slug })} variant="secondary">
                  {b.name}: {c.label} ({b.categories[c.key]})
                </ButtonLink>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {b.collections.length > 0 && (
        <Section tone="white" labelledBy="collections">
          <Container>
            <SectionHead id="collections" kicker="Collections" title={`${b.name} collections`}>
              <p>Collection names as published by the manufacturer.</p>
            </SectionHead>
            <ul className={styles.collections}>
              {b.collections.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section tone="sand" labelledBy="more-brands">
        <Container>
          <SectionHead id="more-brands" kicker="Compare" title="Other brands with similar floors" />
          <ul className={styles.collections}>
            {others.map((x) => (
              <li key={x.slug}>
                <Link href={brandHref(x.slug)}>{x.name}</Link>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "var(--space-5)" }}>
            <TextLink href={routes.brands}>All brands we offer</TextLink>
          </p>
          <p className={styles.note}>
            {b.name} is a trademark of its owner, named here to identify products we offer; this does not imply
            endorsement of V&nbsp;&amp;&nbsp;A Flooring&nbsp;Inc. Product information is from the manufacturer and can
            change.
          </p>
        </Container>
      </Section>

      <InquiryCta
        title={`Interested in ${b.name}?`}
        body="Tell us the floor or collection and the rooms it’s for. We’ll confirm availability and pricing, and include installation in your estimate."
        ctaLabel="Ask About Materials"
      />
    </>
  );
}
