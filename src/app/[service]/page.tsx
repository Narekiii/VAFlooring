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
import styles from "./page.module.css";

// Only published services get pages; every other top-level slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedServices.map((s) => ({ service: s.slug }));
}

type Params = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getService((await params).service);
  if (!s) return {};
  return pageMetadata({ title: s.metaTitle, description: s.metaDescription, path: serviceHref(s) });
}

export default async function ServicePage({ params }: Params) {
  const s = getService((await params).service);
  if (!s) notFound();
  const material = s.material;

  const glance: [string, string][] = [
    ["Service area", regionLine],
    ["What we provide", `${s.shortName} supply and installation`],
    ["Projects", "Homes, ADUs, multifamily, hotels and commercial"],
    ["Installation capacity", facts.installationCrewsLong],
    ["Manufacturers include", facts.manufacturers.join(", ")],
    ["In business since", `${business.founded}, family owned`],
    ...(business.license ? ([["License", `${licenseLine(business.license)}${business.bondedInsured ? ", bonded & insured" : ""}`]] as [string, string][]) : []),
  ];

  return (
    <>
      <PageHero
        kicker="Flooring services"
        title={s.h1}
        image={s.image}
        crumbs={[{ name: s.name, href: serviceHref(s) }]}
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

      <section className={styles.glance} aria-labelledby="glance-title">
        <Container>
          <h2 id="glance-title" className={styles.glanceTitle}>
            At a glance
          </h2>
          <dl className={styles.glanceList}>
            {glance.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

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

      {s.comparison && (
        <Section tone="white" labelledBy="compare-title">
          <Container>
            <SectionHead id="compare-title" kicker="Compare" title={s.comparison.caption}>
              <p>A general comparison. Specific products vary, so we always check the manufacturer’s specifications.</p>
            </SectionHead>
            <div className={styles.tableWrap} role="region" aria-label={`${s.comparison.caption} table`} tabIndex={0}>
              <table className={styles.table}>
                <caption className="visually-hidden">{s.comparison.caption}</caption>
                <thead>
                  <tr>
                    {s.comparison.columns.map((c, i) => (
                      <th key={i} scope="col">
                        {c || <span className="visually-hidden">Feature</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.comparison.rows.map((r) => (
                    <tr key={r[0]}>
                      <th scope="row">{r[0]}</th>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </Section>
      )}

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
        title={`${s.shortName} FAQ`}
        intro={`Common questions about ${material} flooring and installation in Los Angeles, Orange and Ventura counties.`}
      />

      <Section tone="white" labelledBy="related-title">
        <Container>
          <SectionHead id="related-title" kicker="More services" title="Other flooring services" />
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
