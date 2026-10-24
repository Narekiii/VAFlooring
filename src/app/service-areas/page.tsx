import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { InquiryCta } from "@/components/home/InquiryCta";
import { images } from "@/content/images";
import { routes } from "@/content/navigation";
import { publishedServices, serviceAreas, serviceHref } from "@/content/services";
import { business, telHref } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Flooring Contractor Serving Los Angeles, Orange & Ventura Counties",
  description:
    "V & A Flooring installs hardwood, laminate, LVP, carpet and tile across Los Angeles, Orange and Ventura counties, from Sun Valley to Burbank, Glendale, Pasadena, Santa Clarita, Irvine and Thousand Oaks.",
  path: routes.serviceAreas,
});

export default function ServiceAreasPage() {
  const a = business.address;
  return (
    <>
      <PageHero
        kicker="Service areas"
        title="Flooring Installation in Los Angeles, Orange & Ventura Counties"
        image={images.corridor}
        crumbs={[{ name: "Service Areas", href: routes.serviceAreas }]}
        actions={
          <>
            <ButtonLink href={routes.estimate} variant="light">
              Request an Estimate
            </ButtonLink>
            {business.phone && (
              <a className={styles.call} href={telHref(business.phone)}>
                Call {business.phone}
              </a>
            )}
          </>
        }
      >
        <p>
          V&nbsp;&amp;&nbsp;A Flooring is based in Sun Valley, in the San Fernando Valley, and supplies and installs
          flooring for homes, ADUs, apartment communities, hotels and commercial projects across Los Angeles, Orange and
          Ventura counties.
        </p>
      </PageHero>

      <Section tone="white" labelledBy="areas-title">
        <Container>
          <SectionHead id="areas-title" kicker="Where we work" title="Cities and communities we serve">
            <p>
              The list below includes many of the communities we serve. If your project is in Los Angeles, Orange or
              Ventura county and your city isn’t listed, ask us.
            </p>
          </SectionHead>
          <div className={styles.counties}>
            {serviceAreas.map((c) => (
              <section key={c.county} className={styles.county} aria-labelledby={`c-${c.county.split(" ")[0]}`}>
                <h3 id={`c-${c.county.split(" ")[0]}`}>{c.county}</h3>
                <ul className={styles.places}>
                  {c.places.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="ivory" labelledBy="svc-title">
        <Container>
          <SectionHead id="svc-title" kicker="Services" title="Flooring we install throughout the region" />
          <ul className={styles.services}>
            {publishedServices.map((s) => (
              <li key={s.slug}>
                <Link href={serviceHref(s)}>{s.name}</Link>
                <p>{s.cardText}</p>
              </li>
            ))}
            <li>
              <Link href={routes.residential}>Residential Flooring</Link>
              <p>Home renovations, single rooms and ADUs.</p>
            </li>
            <li>
              <Link href={routes.commercial}>Commercial &amp; Multifamily Flooring</Link>
              <p>Apartment communities, hotels and commercial projects with 20+ installation crews.</p>
            </li>
          </ul>
        </Container>
      </Section>

      {a && (
        <Section tone="sand" compact labelledBy="loc-title">
          <Container>
            <div className={styles.location}>
              <h2 id="loc-title">Our location</h2>
              <address>
                <strong>{business.name}</strong>
                <br />
                {a.streetAddress}
                <br />
                {a.addressLocality}, {a.addressRegion} {a.postalCode}
                {business.phone && (
                  <>
                    <br />
                    <a href={telHref(business.phone)}>{business.phone}</a>
                  </>
                )}
              </address>
            </div>
          </Container>
        </Section>
      )}

      <InquiryCta />
    </>
  );
}
