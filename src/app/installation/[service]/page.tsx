import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Steps } from "@/components/ui/Steps";
import { FaqSection } from "@/components/home/FaqSection";
import { InquiryCta } from "@/components/home/InquiryCta";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { routes } from "@/content/navigation";
import { getService, publishedServices, serviceHref } from "@/content/services";
import { business, facts, licenseLine, regionLine, telHref } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { serviceJsonLd } from "@/lib/structured-data";
import styles from "@/components/detail/Detail.module.css";
import { Glance } from "@/components/detail/Glance";
import { TextLink } from "@/components/ui/TextLink";
import { getProduct, productHref } from "@/content/products";

// Only published installation services get pages; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedServices.map((s) => ({ service: s.slug }));
}

type Params = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getService((await params).service);
  if (!s) return {};
  return pageMetadata({ title: s.metaTitle, description: s.metaDescription, path: serviceHref(s), image: s.detailImage });
}

export default async function ServicePage({ params }: Params) {
  const s = getService((await params).service);
  if (!s) notFound();
  const material = s.material;
  const product = getProduct(s.productSlug);

  const glance: [string, string][] = [
    ["Service area", regionLine],
    ["What we provide", `${s.shortName} installation by our own crews, with materials supplied`],
    ["Projects", "Homes, ADUs, multifamily, hotels and commercial"],
    ["Installation capacity", facts.installationCrewsLong],
    ["Manufacturers include", facts.manufacturers.join(", ")],
    ["In business since", `${business.founded}, family owned`],
    ...(business.license ? ([["License", `${licenseLine(business.license)}${business.bondedInsured ? ", bonded & insured" : ""}`]] as [string, string][]) : []),
  ];

  return (
    <>
      <PageHero
        description={s.metaDescription}
        kicker="Flooring installation"
        title={s.h1}
        image={s.image}
        crumbs={[
          { name: "Installation", href: routes.installation },
          { name: s.name, href: serviceHref(s) },
        ]}
        actions={
          <>
            <ButtonLink href={routes.estimate} variant="light">
              Get a {material} estimate
            </ButtonLink>
            {business.phone && (
              <a className={styles.call} href={telHref(business.phone)}>
                Call {business.phone}
              </a>
            )}
          </>
        }
      >
        <p>{s.summary}</p>
      </PageHero>

      <Glance items={glance} />

      <Section tone="ivory" labelledBy="overview-0">
        <Container>
          <div className={styles.overview}>
            <div className={styles.article}>
              {s.sections.map((sec, i) => (
                <div key={sec.heading} className={styles.block}>
                  <h2 id={`overview-${i}`}>{sec.heading}</h2>
                  {sec.body.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              ))}
              {product && (
                <div className={styles.block}>
                  <h2 id="choosing-title">Choosing {material === "tile" ? "floor tile" : `${material} flooring`}</h2>
                  <p>
                    {product.cardText} Compare types, see a side-by-side comparison and find out what we carry on our{" "}
                    {product.name.toLowerCase()} page.
                  </p>
                  <TextLink href={productHref(product)}>{product.name}: types, brands and comparison</TextLink>
                </div>
              )}
            </div>
            <aside className={styles.aside} aria-label="Start your project">
              <Figure image={s.detailImage} ratio="4 / 3" sizes="(min-width: 64rem) 26rem, 100vw" />
              <div className={styles.asideBody} data-surface="dark">
                <p className={styles.asideTitle}>Planning a {material} project?</p>
                <p>Tell us about the rooms or areas, the approximate size and your timing. We’ll follow up to talk it through.</p>
                <ButtonLink href={routes.estimate} variant="light">
                  Request an Estimate
                </ButtonLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tone="sand" labelledBy="process-title">
        <Container>
          <SectionHead id="process-title" kicker="How it works" title={`How ${material} installation works`}>
            <p>One company supplies the material and installs it, so you have one point of contact from start to finish.</p>
          </SectionHead>
          <Steps steps={s.process} />
        </Container>
      </Section>

      <Section tone="white" labelledBy="fits-title">
        <Container>
          <SectionHead id="fits-title" kicker="Projects" title={`Where we install ${material}`} />
          <ul className={styles.fits}>
            {s.fits.map((f) => (
              <li key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                {f.href && (
                  <Link href={f.href} className={styles.fitLink}>
                    {f.href === routes.residential ? "Residential flooring" : "Commercial & multifamily flooring"}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FaqSection
        faqs={s.faqs}
        tone="ivory"
        title={`${s.shortName} installation FAQ`}
        intro={`Common questions about ${material} installation in Los Angeles, Orange and Ventura counties.`}
      />

      <Section tone="white" labelledBy="related-title">
        <Container>
          <SectionHead id="related-title" kicker="Installation" title="Other flooring we install" />
          <ServicesGrid headingId="related-title" exclude={serviceHref(s)} />
        </Container>
      </Section>

      <InquiryCta
        title={`Ready to talk about your ${material} floor?`}
        body="Share the project’s location, the rooms or approximate area and your timing. We’ll follow up to discuss materials, scope and scheduling; there’s no obligation."
      />
      <JsonLd data={serviceJsonLd(s)} />
    </>
  );
}
