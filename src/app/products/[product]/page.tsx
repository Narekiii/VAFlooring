import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { MediaSplit } from "@/components/ui/MediaSplit";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { ComparisonTable } from "@/components/detail/ComparisonTable";
import { Glance } from "@/components/detail/Glance";
import { FaqSection } from "@/components/home/FaqSection";
import { InquiryCta } from "@/components/home/InquiryCta";
import { ProductGrid } from "@/components/products/ProductGrid";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { getProduct, productHref, products } from "@/content/products";
import { getService, serviceHref } from "@/content/services";
import { addressLine, directionsHref, facts, hoursLines } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { ProductCard } from "@/components/catalog/ProductCard";
import { brandHref, brandsFor, catalog, catalogCategories, catalogHref } from "@/content/catalog";
import catStyles from "@/components/catalog/Catalog.module.css";
import styles from "@/components/detail/Detail.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ product: p.slug }));
}

type Params = { params: Promise<{ product: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProduct((await params).product);
  if (!p) return {};
  return pageMetadata({ title: p.metaTitle, description: p.metaDescription, path: productHref(p), image: p.showroomImage });
}

export default async function ProductPage({ params }: Params) {
  const p = getProduct((await params).product);
  if (!p) notFound();
  const install = getService(p.installSlug);
  const address = addressLine();
  const hours = hoursLines();
  const directions = directionsHref();

  const glance: [string, React.ReactNode][] = [
    ["Types we carry", p.types.join(" · ")],
    ...(() => {
      const cat = catalogCategories.find((c) => c.productSlug === p.slug);
      const more = cat ? brandsFor(cat.key).slice(0, 5).map((b) => b.name) : [];
      const all = [...(p.brands ?? []), ...more];
      if (!all.length) return [];
      const n = (p.brands?.length ?? 0) + (cat ? brandsFor(cat.key).length : 0);
      return [["Brands include", n > all.length ? `${all.join(", ")} and more` : all.join(", ")]] as [string, string][];
    })(),
    ...(address ? ([["See it in person", `Showroom & design center, ${address}`]] as [string, string][]) : []),
    ...(hours.length ? ([["Showroom hours", hours.join("; ")]] as [string, string][]) : []),
    ["Who we supply", "Homeowners, contractors, builders and property managers"],
    ["Installation", `Available from our own crews (${facts.installationCrewsLong.toLowerCase()})`],
  ];

  return (
    <>
      <PageHero
        description={p.metaDescription}
        pageType="CollectionPage"
        kicker="Flooring products"
        title={p.h1}
        image={p.showroomImage}
        crumbs={[
          { name: "Products", href: routes.products },
          { name: p.name, href: productHref(p) },
        ]}
        actions={
          <>
            <ButtonLink href={routes.contact} variant="light">
              Visit the showroom
            </ButtonLink>
            <ButtonLink href={routes.estimate} variant="outline-light">
              Get a {p.material} estimate
            </ButtonLink>
          </>
        }
      >
        <p>{p.summary}</p>
      </PageHero>

      <Glance items={glance} />

      <Section tone="ivory" labelledBy="overview-0">
        <Container>
          <div className={styles.overview}>
            <div className={styles.article}>
              {p.sections.map((sec, i) => (
                <div key={sec.heading} className={styles.block}>
                  <h2 id={`overview-${i}`}>{sec.heading}</h2>
                  {sec.body.map((t) => (
                    <p key={t.slice(0, 40)}>{t}</p>
                  ))}
                </div>
              ))}
            </div>
            <aside className={styles.aside} aria-label="See it in our showroom">
              <Figure image={images.showroomSelection} ratio="4 / 3" sizes="(min-width: 64rem) 26rem, 100vw" />
              <div className={styles.asideBody} data-surface="dark">
                <p className={styles.asideTitle}>See {p.name.toLowerCase()} in person</p>
                <p>
                  Compare samples side by side at our Sun Valley showroom{hours.length ? `, open ${hours.join("; ")}` : ""}.
                </p>
                {directions ? (
                  <ButtonLink href={directions} variant="light">
                    Get directions
                  </ButtonLink>
                ) : (
                  <ButtonLink href={routes.contact} variant="light">
                    Contact us
                  </ButtonLink>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {(() => {
        const cat = catalogCategories.find((c) => c.productSlug === p.slug);
        if (!cat) return null;
        const brands = brandsFor(cat.key);
        const sample = brands
          .flatMap((b) => b.featured.filter((f) => f.c === cat.key).slice(0, 1).map((f) => ({ f, name: b.name })))
          .slice(0, 8);
        return (
          <Section tone="sand" labelledBy="browse-title">
            <Container>
              <SectionHead id="browse-title" kicker="Browse" title={`${catalog.byCategory[cat.key].toLocaleString("en-US")} ${cat.label.toLowerCase()} floors to explore`}>
                <p>
                  Some of the {cat.label.toLowerCase()} we can supply and install, from {brands.length} manufacturers.
                  Ask us about any of them.
                </p>
              </SectionHead>
              <ul className={catStyles.grid}>
                {sample.map(({ f, name }) => (
                  <ProductCard key={f.id} item={f} brandName={name} />
                ))}
              </ul>
              <div className={catStyles.more}>
                <ButtonLink href={catalogHref({ category: cat.key })}>Browse all {cat.label.toLowerCase()}</ButtonLink>
              </div>
              <h3 className={catStyles.brandsHeading}>{cat.label} brands</h3>
              <ul className={catStyles.collections}>
                {brands.map((b) => (
                  <li key={b.slug}>
                    <Link href={brandHref(b.slug)}>{b.name}</Link>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        );
      })()}

      {p.comparison && (
        <Section tone="white" labelledBy="compare-title">
          <Container>
            <SectionHead id="compare-title" kicker="Compare" title={p.comparison.caption}>
              <p>A general comparison. Specific products vary, so we always check the manufacturer’s specifications.</p>
            </SectionHead>
            <ComparisonTable comparison={p.comparison} />
          </Container>
        </Section>
      )}

      {install && (
        <Section tone="sand" labelledBy="install-title">
          <Container>
            <MediaSplit image={install.image}>
              <p className="kicker">Installation</p>
              <h2 id="install-title">Installed by our own crews</h2>
              <p>
                We install the {p.material === "tile" ? "tile" : `${p.material} flooring`} we sell, so the product, the
                order and the installation stay with one accountable company. We review the subfloor, transitions and the
                manufacturer’s installation requirements before work begins.
              </p>
              <TextLink href={serviceHref(install)}>{install.name}</TextLink>
            </MediaSplit>
          </Container>
        </Section>
      )}

      <FaqSection
        faqs={p.faqs}
        tone="ivory"
        title={`${p.name} FAQ`}
        intro={`Common questions about choosing ${p.material === "tile" ? "floor tile" : `${p.material} flooring`} in Los Angeles.`}
      />

      <Section tone="white" labelledBy="related-title">
        <Container>
          <SectionHead id="related-title" kicker="Products" title="More flooring products" />
          <ProductGrid headingId="related-title" exclude={p.slug} />
        </Container>
      </Section>

      <InquiryCta
        title={`Questions about ${p.name.toLowerCase()}?`}
        body="Tell us about the space, how it’s used and your timing. We’ll help you narrow the options and prepare an estimate; there’s no obligation."
      />
    </>
  );
}
