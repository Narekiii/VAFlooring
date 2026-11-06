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
  brandFaqs,
  typeList,
  unitOf,
  type CatalogBrand,
  type CatalogItem,
} from "@/content/catalog";
import { brandItems } from "@/lib/catalog-data";
import { FaqSection } from "@/components/home/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/seo";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/catalog/Catalog.module.css";

export const dynamicParams = false;
export const generateStaticParams = () => catalog.brands.map((b) => ({ brand: b.slug }));

type Params = { params: Promise<{ brand: string }> };

const catList = (b: CatalogBrand) =>
  catalogCategories.filter((c) => (b.categories[c.key] ?? 0) > 0);
const describe = (b: CatalogBrand) => {
  const kind = /flooring$/i.test(b.name) ? typeList(b) : `${typeList(b)} flooring`;
  const long = `${b.name} ${kind} at V & A Flooring in Sun Valley, Los Angeles: ${b.count.toLocaleString("en-US")} ${unitOf(b)} to browse, with samples and installation.`;
  return long.length <= 160 ? long : `${b.name} flooring at V & A Flooring in Sun Valley, Los Angeles: ${b.count.toLocaleString("en-US")} ${unitOf(b)} to browse, with samples and installation.`;
};

/** Group a brand's floors by collection, collections A–Z with uncategorized last. */
const byCollection = (items: CatalogItem[]) => {
  const m = new Map<string, CatalogItem[]>();
  for (const it of items) m.set(it.col ?? "", [...(m.get(it.col ?? "") ?? []), it]);
  return [...m.entries()].sort(([a], [b]) => (a ? (b ? a.localeCompare(b) : -1) : 1));
};

const titleOf = (b: CatalogBrand) => (/floor(s|ing)?$/i.test(b.name) ? b.name : `${b.name} Flooring`);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const b = getBrand((await params).brand);
  if (!b) return {};
  return pageMetadata({ title: `${titleOf(b)} in ${titleOf(b).length > 24 ? "LA" : "Los Angeles"}`, description: describe(b), path: brandHref(b.slug), image: images.showroomSelection });
}

export default async function BrandPage({ params }: Params) {
  const b = getBrand((await params).brand);
  if (!b) notFound();
  const cats = catList(b);
  const all = cats.map((c) => ({ cat: c, items: brandItems(b.slug, c.key) }));
  const base = siteUrl();
  const itemList = base && {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${b.name} floors available from V & A Flooring Inc`,
    numberOfItems: b.count,
    itemListElement: all
      .flatMap(({ cat, items }) => items.map((it) => `${b.name} ${it.col ? `${it.col} ` : ""}${it.t} (${cat.label})`))
      .slice(0, 100)
      .map((name, i) => ({ "@type": "ListItem", position: i + 1, name })),
  };
  const others = catalog.brands.filter((x) => x.slug !== b.slug && cats.some((c) => (x.categories[c.key] ?? 0) > 0));
  return (
    <>
      <JsonLd data={itemList} />
      <PageHero
        mentions={[{ "@type": "Brand", name: b.name }]}
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
              Browse all {b.count.toLocaleString("en-US")} {unitOf(b)}
            </ButtonLink>
            <ButtonLink href={`${routes.estimate}?product=${encodeURIComponent(b.name)}`} variant="outline-light">
              Ask about {b.name}
            </ButtonLink>
          </>
        }
      >
        <p>
          {b.name} is a flooring manufacturer based in {placeOf(b)}
          {b.distributor ? `, distributed by ${b.distributor}` : ""}. We can supply its {typeList(b)} and install it
          with our own crews across Los Angeles, Orange and Ventura counties. Ask us to confirm current colors and
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
              <p>{b.categories.carpet ? "Products listed" : "Floors listed"}</p>
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
                  {b.name} {c.label} ({b.categories[c.key]})
                </ButtonLink>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section tone="white" labelledBy="all-floors">
        <Container>
          <SectionHead id="all-floors" kicker="Full list" title={`All ${b.count.toLocaleString("en-US")} ${b.name} ${unitOf(b)}`}>
            <p>Every {b.name} {unitOf(b, 1)} in our online catalog, by type and collection. Ask us about any of them.</p>
          </SectionHead>
          <div className={styles.floorList}>
            {all.map(({ cat, items }) => (
              <div key={cat.key}>
                <h3>
                  {b.name} {cat.label} ({items.length})
                </h3>
                <div className={styles.floorGroups}>
                  {byCollection(items).map(([col, list]) => (
                    <div key={col || "other"} className={styles.floorGroup}>
                      <h4>{col || (byCollection(items).length > 1 ? "Other floors" : cat.label)}</h4>
                      <ul>
                        {list.map((it) => (
                          <li key={it.id}>
                            {it.t}
                            {it.c === "carpet" && it.s?.Colors ? ` (${it.s.Colors} colors)` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <FaqSection faqs={brandFaqs(b)} tone="ivory" title={`${b.name} at V & A Flooring`} intro="Quick answers about buying and installing this brand." />

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
